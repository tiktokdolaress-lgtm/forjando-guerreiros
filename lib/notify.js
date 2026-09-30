/* Helpers de notificação: permissão, push (VAPID), notificações fora (OS) e dentro do app (In-App) */
import { today } from './utils';
import { T, repDue, isDone } from './logic';

export const pushSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export async function ensureSw() {
  if (!pushSupported()) return null;
  try { return await navigator.serviceWorker.register('/sw.js'); } catch (e) { return null; }
}

export async function askPermission() {
  if (!pushSupported()) return 'denied';
  if (Notification.permission === 'default') return await Notification.requestPermission();
  return Notification.permission;
}

function b64ToUint8(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function subscribePush(token) {
  const reg = await ensureSw();
  if (!reg) throw new Error('Service worker indisponível neste navegador.');
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) throw new Error('VAPID pública não configurada.');
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(key) });
  const j = sub.toJSON();
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth_key: j.keys.auth }),
  });
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Falha ao salvar a inscrição de push.'); }
  return sub;
}

export async function unsubscribePush(token) {
  const reg = await ensureSw();
  const sub = reg && (await reg.pushManager.getSubscription());
  if (!sub) return;
  const endpoint = sub.endpoint;
  try { await sub.unsubscribe(); } catch (e) {}
  if (token) {
    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ endpoint }),
    }).catch(() => {});
  }
}

/* Disparo de notificação externa (fora do app / lockscreen / desktop) */
export async function localNotify(title, body, tag = 'fg-local', data = {}) {
  if (!pushSupported() || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.showNotification) {
      await reg.showNotification(title, {
        body,
        icon: '/icon-fg-192.png',
        badge: '/icon-badge.png',
        tag,
        vibrate: [250, 100, 250, 100, 250],
        renotify: true,
        data: Object.assign({ url: '/app' }, data),
      });
      return;
    }
  } catch (e) {}
  try {
    new Notification(title, {
      body,
      icon: '/icon-fg-192.png',
      tag,
    });
  } catch (e) {}
}

/* Agendamento e monitoramento ativo: Tarefas, Hábitos, Projetos e Check-in Noturno (Dentro e Fora do App) */
export function scheduleLocalTimers(S, habits, enabled, callbacks = {}) {
  if (!enabled) return () => {};

  const { onInAppNotify } = callbacks;
  const lang = (S?.settings?.lang) || 'pt';
  const todayStr = today();

  const checkAndDispatchReminders = () => {
    if (typeof window === 'undefined') return;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const itemsToAlert = [];

    // 1. Hábitos da Forja com Horário
    if (S?.settings?.notifHabits !== false) {
      const activeIds = S?.forge?.active || [];
      const times = S?.forge?.times || {};
      const doneToday = (S?.forge?.done || {})[todayStr] || [];

      activeIds.forEach((id) => {
        const tm = times[id];
        if (!tm) return;
        if (Array.isArray(doneToday) && doneToday.includes(id)) return;

        const [hh, mm] = tm.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return;

        const hab = (habits || []).find((x) => String(x.id) === String(id));
        const habName = hab ? (hab.n || hab.name || hab.title || hab.txt) : (lang === 'en' ? 'Discipline Habit' : lang === 'es' ? 'Hábito de Disciplina' : 'Hábito da Forja');

        const title = lang === 'en'
          ? `⏰ ${tm} · Habit: ${habName}`
          : lang === 'es'
          ? `⏰ ${tm} · Hábito: ${habName}`
          : `⏰ ${tm} · Hábito: ${habName}`;

        const body = lang === 'en'
          ? `Time to execute "${habName}". Keep your discipline sharp.`
          : lang === 'es'
          ? `Hora de ejecutar "${habName}". Mantén tu disciplina afilada.`
          : `Hora de executar "${habName}". Mantenha sua disciplina afiada.`;

        itemsToAlert.push({
          id: `hab_${id}`,
          originalId: id,
          tag: `hab-${id}-${tm}`,
          time: tm,
          minutes: hh * 60 + mm,
          title,
          body,
          name: habName,
          icon: hab?.icon || '🔨',
          type: 'habit',
        });
      });
    }

    // 2. Tarefas e Operações com Horário
    if (S?.settings?.notifTasks !== false) {
      (S?.tasks || []).forEach((task) => {
        if (task.done) return;
        if (task.postponedTo && task.postponedTo !== todayStr) return;
        if (task.due && task.due !== todayStr) return;
        if (!task.time) return;

        const [hh, mm] = task.time.split(':').map(Number);
        if (isNaN(hh) || isNaN(mm)) return;

        // O texto da tarefa fica salvo prioritariamente em task.txt
        const taskName = (task.txt || task.title || task.name || task.text || task.desc || '').trim() || (lang === 'en' ? 'Tactical Operation' : lang === 'es' ? 'Operación Táctica' : 'Operação Tática');

        // Busca projeto vinculado se houver
        const linkedProj = (S?.projects || []).find((p) => String(p.id) === String(task.projectId || task.proj));
        const projName = linkedProj ? (linkedProj.title || linkedProj.name || linkedProj.txt || '').trim() : '';

        const title = lang === 'en'
          ? `🎯 ${task.time} · Task: ${taskName}`
          : lang === 'es'
          ? `🎯 ${task.time} · Tarea: ${taskName}`
          : `🎯 ${task.time} · Tarefa: ${taskName}`;

        let body = '';
        if (projName) {
          body = lang === 'en'
            ? `Project: ${projName} · Time to execute your mission with no excuses.`
            : lang === 'es'
            ? `Proyecto: ${projName} · Hora de ejecutar tu misión sin excusas.`
            : `Projeto: ${projName} · Hora de executar sua missão sem desculpas.`;
        } else {
          body = lang === 'en'
            ? `Scheduled time reached for "${taskName}". Execute with precision.`
            : lang === 'es'
            ? `Llegó la hora programada para "${taskName}". Ejecuta con precisión.`
            : `Chegou o horário agendado para "${taskName}". Execute com precisão.`;
        }

        itemsToAlert.push({
          id: `task_${task.id}`,
          originalId: task.id,
          tag: `task-${task.id}-${task.time}`,
          time: task.time,
          minutes: hh * 60 + mm,
          title,
          body,
          name: taskName,
          projectName: projName,
          icon: '🎯',
          type: 'task',
        });
      });
    }

    // 3. Projetos Estratégicos: Janela de Foco Diária e Prazo Final Hoje
    if (S?.settings?.notifProjects !== false) {
      (S?.projects || []).forEach((proj) => {
        if (proj.status === 'concluido' || proj.archived) return;
        const projTitle = (proj.title || proj.name || proj.txt || proj.desc || '').trim() || (lang === 'en' ? 'Strategic Project' : lang === 'es' ? 'Proyecto Estratégico' : 'Projeto Estratégico');

        // Janela diária de foco
        if (proj.tStart) {
          const [hh, mm] = proj.tStart.split(':').map(Number);
          if (!isNaN(hh) && !isNaN(mm)) {
            const title = lang === 'en'
              ? `🏛️ ${proj.tStart} · Focus Window: ${projTitle}`
              : lang === 'es'
              ? `🏛️ ${proj.tStart} · Ventana de Enfoque: ${projTitle}`
              : `🏛️ ${proj.tStart} · Janela de Foco: ${projTitle}`;

            const body = lang === 'en'
              ? `Strategic focus block for "${projTitle}". Eliminate distractions and conquer.`
              : lang === 'es'
              ? `Bloque de enfoque estratégico para "${projTitle}". Elimina distracciones y avanza.`
              : `Bloco de foco estratégico para o projeto "${projTitle}". Elimine distrações e avance.`;

            itemsToAlert.push({
              id: `proj_focus_${proj.id}`,
              tag: `proj-focus-${proj.id}-${proj.tStart}`,
              time: proj.tStart,
              minutes: hh * 60 + mm,
              title,
              body,
              name: projTitle,
              icon: '🏛️',
              type: 'project_focus',
            });
          }
        }

        // Prazo final hoje (alerta às 09:00)
        const isDeadlineToday = (proj.deadline && proj.deadline === todayStr) || (proj.due && proj.due === todayStr);
        if (isDeadlineToday) {
          const title = lang === 'en'
            ? `🏛️ Deadline Today · Project: ${projTitle}`
            : lang === 'es'
            ? `🏛️ Plazo Final Hoy · Proyecto: ${projTitle}`
            : `🏛️ Prazo Final Hoje · Projeto: ${projTitle}`;

          const body = lang === 'en'
            ? `Project "${projTitle}" deadline is today. Deliver your victory.`
            : lang === 'es'
            ? `El proyecto "${projTitle}" vence hoy. ¡Entrega tu victoria!`
            : `O prazo do projeto "${projTitle}" vence hoje. Entregue sua vitória!`;

          itemsToAlert.push({
            id: `proj_due_${proj.id}`,
            tag: `proj-due-${proj.id}`,
            time: '09:00',
            minutes: 9 * 60,
            title,
            body,
            name: projTitle,
            icon: '🏛️',
            type: 'project_due',
          });
        }
      });
    }

    // 4. Check-in Diário da Forja às 20h e 21h30 (Pergunta se Venceu o Dia)
    if (S?.settings?.notifDaily !== false) {
      const ci = (S?.checkins || {})[todayStr];
      if (!(ci && (ci.ok || ci.fail))) {
        const title = lang === 'en'
          ? '⚔️ Did you conquer today, Warrior?'
          : lang === 'es'
          ? '⚔️ ¿Venciste el día hoy, Guerrero?'
          : '⚔️ Você venceu o dia hoje, Guerreiro?';

        const body = lang === 'en'
          ? 'The day is almost done. Did your honor stay intact? Tap to seal your 3 pillars and guard your streak.'
          : lang === 'es'
          ? 'El día casi termina. ¿Tu honor sigue intacto? Toca para sellar tus 3 pilares y blindar tu racha.'
          : 'O dia está quase no fim. Sua honra segue intacta? Toque para selar seus 3 pilares e blindar seu streak.';

        itemsToAlert.push({
          id: `checkin_${todayStr}`,
          tag: `checkin-${todayStr}`,
          time: '20:00',
          minutes: 20 * 60,
          title,
          body,
          name: lang === 'en' ? 'Did you conquer today?' : lang === 'es' ? '¿Venciste el día hoy?' : 'Você venceu o dia hoje?',
          icon: '🛡️',
          type: 'checkin',
        });

        itemsToAlert.push({
          id: `checkin_late_${todayStr}`,
          tag: `checkin-late-${todayStr}`,
          time: '21:30',
          minutes: 21 * 60 + 30,
          title: lang === 'en'
            ? '🛡️ Final Check: Did you conquer today?'
            : lang === 'es'
            ? '🛡️ Revisión Final: ¿Venciste el día hoy?'
            : '🛡️ Checagem Noturna: Você venceu o dia hoje?',
          body: lang === 'en'
            ? 'Close your night with dignity. Seal your 3 pillars before sleeping and maintain your victory.'
            : lang === 'es'
            ? 'Cierra tu noche con dignidad. Sella tus 3 pilares antes de dormir y mantén tu victoria.'
            : 'Feche sua noite com dignidade. Sele seus 3 pilares antes de dormir e mantenha sua vitória.',
          name: lang === 'en' ? 'Night Check' : lang === 'es' ? 'Revisión Nocturna' : 'Checagem Noturna',
          icon: '⚔️',
          type: 'checkin',
        });
      }
    }

    // Avaliação e Disparo Duplo (Dentro e Fora)
    itemsToAlert.forEach((item) => {
      const diff = currentMins - item.minutes;
      // Dispara se o horário for agora (ou até 3 minutos atrás, cobrindo destravamento da tela ou retorno à aba)
      if (diff >= 0 && diff <= 3) {
        const firedKey = `fg_fired_${todayStr}_${item.tag}`;
        try {
          const alreadyFired = sessionStorage.getItem(firedKey) || localStorage.getItem(firedKey);
          if (!alreadyFired) {
            sessionStorage.setItem(firedKey, '1');
            localStorage.setItem(firedKey, '1');

            // 1. FORA DO APP (Notificação do Sistema Operacional / Push / PWA)
            localNotify(item.title, item.body, item.tag);

            // 2. DENTRO DO APP (Toast visual com som tático)
            if (typeof onInAppNotify === 'function') {
              onInAppNotify(item);
            }
          }
        } catch (e) {}
      }
    });
  };

  // Checagem imediata
  checkAndDispatchReminders();

  // Checagem contínua a cada 20 segundos
  const intervalId = setInterval(checkAndDispatchReminders, 20000);

  // Checagem instantânea ao desbloquear tela ou voltar para a aba
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkAndDispatchReminders();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

/* Helper para obter todos os compromissos agendados de hoje para exibição na Tela Inicial (QG) */
export function getTodayCombatTimeline(S, habits, lang = 'pt') {
  if (!S) return [];
  const todayStr = today();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const items = [];

  // 1. Hábitos da Forja (com horário ou do dia)
  const activeHabits = S?.forge?.active || [];
  const times = S?.forge?.times || {};
  const doneHabitsToday = (S?.forge?.done || {})[todayStr] || [];

  activeHabits.forEach((id) => {
    const tm = times[id];
    const hab = (habits || []).find((h) => String(h.id) === String(id));
    const isHabitDone = Array.isArray(doneHabitsToday) && doneHabitsToday.includes(id);

    let itemMinutes = 1200; // Horário flexível do dia se não tiver horário exato
    if (tm) {
      const [hh, mm] = tm.split(':').map(Number);
      if (!isNaN(hh) && !isNaN(mm)) {
        itemMinutes = hh * 60 + mm;
      }
    }

    let status = 'upcoming';
    if (isHabitDone) {
      status = 'done';
    } else if (tm && itemMinutes < currentMinutes - 15) {
      status = 'overdue';
    } else if (tm && itemMinutes <= currentMinutes + 45) {
      status = 'soon';
    }

    const habName = hab ? (hab.n || hab.name || hab.title || hab.txt) : (lang === 'en' ? 'Discipline Habit' : lang === 'es' ? 'Hábito de Disciplina' : 'Hábito da Forja');

    items.push({
      id: `hab_${id}`,
      originalId: id,
      type: 'habit',
      time: tm || (lang === 'en' ? 'Forge' : lang === 'es' ? 'Forja' : 'Forja'),
      hasSetTime: !!tm,
      minutes: itemMinutes,
      title: habName,
      icon: hab?.icon || '🔨',
      done: isHabitDone,
      status,
    });
  });

  // 2. Tarefas e Operações (com horário ou do dia)
  (S?.tasks || []).forEach((t) => {
    if (t.archived) return;
    if (t.postponedTo && t.postponedTo > todayStr) return;
    if (t.due && t.due > todayStr) return;
    if (t.rep && t.rep !== 'unica' && !repDue(t, todayStr)) return;

    const isDoneTask = isDone(t, todayStr);

    let itemMinutes = 1260 + (t.pri === 'alta' ? 0 : t.pri === 'media' ? 20 : 40);
    if (t.time) {
      const [hh, mm] = t.time.split(':').map(Number);
      if (!isNaN(hh) && !isNaN(mm)) {
        itemMinutes = hh * 60 + mm;
      }
    }

    let status = 'upcoming';
    if (isDoneTask) {
      status = 'done';
    } else if (t.time && itemMinutes < currentMinutes - 15) {
      status = 'overdue';
    } else if (t.time && itemMinutes <= currentMinutes + 45) {
      status = 'soon';
    }

    const taskName = (t.txt || t.title || t.name || t.text || t.desc || '').trim() || (lang === 'en' ? 'Tactical Operation' : lang === 'es' ? 'Operación Táctica' : 'Operação Tática');
    const linkedProj = (S?.projects || []).find((p) => String(p.id) === String(t.projectId || t.proj));
    const projName = linkedProj ? (linkedProj.title || linkedProj.name || linkedProj.txt || '').trim() : '';

    items.push({
      id: `task_${t.id}`,
      originalId: t.id,
      projectId: linkedProj ? linkedProj.id : (t.projectId || t.proj || null),
      type: 'task',
      time: t.time || (lang === 'en' ? 'Today' : lang === 'es' ? 'Hoy' : 'Hoje'),
      hasSetTime: !!t.time,
      minutes: itemMinutes,
      title: taskName,
      projectName: projName,
      icon: '🎯',
      pri: t.pri,
      rep: t.rep,
      done: isDoneTask,
      status,
    });
  });

  // 3. Projetos com Janela de Foco ou Prazo Hoje
  (S?.projects || []).forEach((p) => {
    if (p.status === 'concluido' || p.archived) return;
    const projTitle = (p.title || p.name || p.txt || p.desc || '').trim() || (lang === 'en' ? 'Strategic Project' : lang === 'es' ? 'Proyecto Estratégico' : 'Projeto Estratégico');

    // Se tiver janela de foco diária (Opção A: exibe exclusivamente durante o período da janela de foco)
    if (p.tStart) {
      const [startH, startM] = p.tStart.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(startM)) {
        const startMinutes = startH * 60 + startM;

        let endMinutes = startMinutes + 120; // fallback padrão: 2 horas de janela
        if (p.tEnd) {
          const [endH, endM] = p.tEnd.split(':').map(Number);
          if (!isNaN(endH) && !isNaN(endM)) {
            endMinutes = endH * 60 + endM;
            // Se virar a meia-noite (ex: 23:00 às 01:00)
            if (endMinutes < startMinutes) endMinutes += 1440;
          }
        }

        // Se o horário atual ainda não chegou (antes do início com antecedência de até 45 min)
        // ou se já passou do fim da janela de foco (já encerrou hoje), não exibe fora de hora
        const isBeforeWindow = currentMinutes < startMinutes - 45;
        const isAfterWindow = currentMinutes > endMinutes;

        // Só aparece na Agenda quando estiver no horário (durante a janela de foco ou 45 min antes)
        if (!isBeforeWindow && !isAfterWindow) {
          const isInsideWindow = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
          const status = isInsideWindow ? 'soon' : 'upcoming';

          const timeLabel = p.tEnd ? `${p.tStart}–${p.tEnd}` : p.tStart;

          items.push({
            id: `proj_focus_${p.id}`,
            originalId: p.id,
            type: 'project',
            time: timeLabel,
            minutes: startMinutes,
            title: `${projTitle} (${lang === 'en' ? 'Active Focus Window' : lang === 'es' ? 'Ventana Activa de Enfoque' : 'Janela de Foco Ativa'})`,
            icon: '🏛️',
            done: false,
            status,
          });
        }
      }
    }

    // Se tiver prazo final hoje
    const isDeadlineToday = (p.deadline && p.deadline === todayStr) || (p.due && p.due === todayStr);
    if (isDeadlineToday) {
      items.push({
        id: `proj_due_${p.id}`,
        originalId: p.id,
        type: 'project',
        time: lang === 'en' ? 'Today' : lang === 'es' ? 'Hoy' : 'Hoje',
        minutes: 9999, // fim do dia
        title: `${projTitle} (${lang === 'en' ? 'Final Deadline' : lang === 'es' ? 'Plazo Final' : 'Prazo Final'})`,
        icon: '🏛️',
        done: false,
        status: 'soon',
      });
    }
  });

  // Ordena por horário crescente
  items.sort((a, b) => a.minutes - b.minutes);
  return items;
}
