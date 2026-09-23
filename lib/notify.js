/* Helpers de notificação: permissão, push (VAPID), notificações fora (OS) e dentro do app (In-App) */
import { today } from './utils';
import { T } from './logic';

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

        const hab = (habits || []).find((x) => x.id === id);
        const habName = hab ? hab.n : (lang === 'en' ? 'War Habit' : lang === 'es' ? 'Hábito de Guerra' : 'Hábito de Guerra');

        const title = lang === 'en'
          ? `⏰ ${tm} — Habit: ${habName}`
          : lang === 'es'
          ? `⏰ ${tm} — Hábito: ${habName}`
          : `⏰ ${tm} — Hábito: ${habName}`;

        const body = lang === 'en'
          ? 'Time to execute. Keep your daily discipline sharp.'
          : lang === 'es'
          ? 'Hora de ejecutar. Mantén afilada tu disciplina diaria.'
          : 'Hora de executar. Mantenha sua disciplina diária afiada.';

        itemsToAlert.push({
          id: `hab_${id}`,
          tag: `hab-${id}-${tm}`,
          time: tm,
          minutes: hh * 60 + mm,
          title,
          body,
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

        const taskTitle = task.title || task.text || (lang === 'en' ? 'Tactical Operation' : lang === 'es' ? 'Operación Táctica' : 'Operação Tática');

        const title = lang === 'en'
          ? `🎯 ${task.time} — Operation: ${taskTitle}`
          : lang === 'es'
          ? `🎯 ${task.time} — Operación: ${taskTitle}`
          : `🎯 ${task.time} — Operação: ${taskTitle}`;

        const body = lang === 'en'
          ? 'Scheduled time reached. Execute your mission with no excuses.'
          : lang === 'es'
          ? 'Llegó la hora programada. Ejecuta tu misión sin excusas.'
          : 'Chegou o horário agendado. Execute sua missão sem desculpas.';

        itemsToAlert.push({
          id: `task_${task.id}`,
          tag: `task-${task.id}-${task.time}`,
          time: task.time,
          minutes: hh * 60 + mm,
          title,
          body,
          icon: '🎯',
          type: 'task',
        });
      });
    }

    // 3. Projetos Estratégicos: Janela de Foco Diária e Prazo Final Hoje
    if (S?.settings?.notifProjects !== false) {
      (S?.projects || []).forEach((proj) => {
        if (proj.status === 'concluido' || proj.archived) return;
        const projTitle = proj.title || proj.name || (lang === 'en' ? 'Strategic Project' : lang === 'es' ? 'Proyecto Estratégico' : 'Projeto Estratégico');

        // Janela diária de foco
        if (proj.tStart) {
          const [hh, mm] = proj.tStart.split(':').map(Number);
          if (!isNaN(hh) && !isNaN(mm)) {
            const title = lang === 'en'
              ? `🏛️ ${proj.tStart} — Focus Window: ${projTitle}`
              : lang === 'es'
              ? `🏛️ ${proj.tStart} — Ventana de Enfoque: ${projTitle}`
              : `🏛️ ${proj.tStart} — Janela de Foco: ${projTitle}`;

            const body = lang === 'en'
              ? 'Strategic focus block started. Eliminate distractions and conquer.'
              : lang === 'es'
              ? 'Inició tu bloque de enfoque estratégico. Elimina distracciones y avanza.'
              : 'Início do bloco de foco estratégico. Elimine distrações e avance.';

            itemsToAlert.push({
              id: `proj_focus_${proj.id}`,
              tag: `proj-focus-${proj.id}-${proj.tStart}`,
              time: proj.tStart,
              minutes: hh * 60 + mm,
              title,
              body,
              icon: '🏛️',
              type: 'project_focus',
            });
          }
        }

        // Prazo final hoje (alerta às 09:00)
        const isDeadlineToday = (proj.deadline && proj.deadline === todayStr) || (proj.due && proj.due === todayStr);
        if (isDeadlineToday) {
          const title = lang === 'en'
            ? `🏛️ Strategic Deadline Today: ${projTitle}`
            : lang === 'es'
            ? `🏛️ Plazo Final Hoy: ${projTitle}`
            : `🏛️ Prazo Final Hoje: ${projTitle}`;

          const body = lang === 'en'
            ? 'Project deadline is today. Deliver your victory.'
            : lang === 'es'
            ? 'El plazo del proyecto vence hoy. Entrega tu victoria.'
            : 'O prazo do projeto vence hoje. Entregue sua vitória.';

          itemsToAlert.push({
            id: `proj_due_${proj.id}`,
            tag: `proj-due-${proj.id}`,
            time: '09:00',
            minutes: 9 * 60,
            title,
            body,
            icon: '🏛️',
            type: 'project_due',
          });
        }
      });
    }

    // 4. Check-in Diário da Forja às 20h
    if (S?.settings?.notifDaily !== false) {
      const ci = (S?.checkins || {})[todayStr];
      if (!(ci && (ci.ok || ci.fail))) {
        const title = lang === 'en'
          ? '⚔️ Evening Check-in · Forging Warriors'
          : lang === 'es'
          ? '⚔️ Check-in Nocturno · Forjando Guerreros'
          : '⚔️ Check-in Noturno · Forjando Guerreiros';

        const body = lang === 'en'
          ? 'Day in battle. Log your 3 pillars and preserve your streak.'
          : lang === 'es'
          ? 'Día en batalla. Registra tus 3 pilares y preserva tu racha.'
          : 'Dia em batalha. Registre seus 3 pilares e preserve seu streak.';

        itemsToAlert.push({
          id: `checkin_${todayStr}`,
          tag: `checkin-${todayStr}`,
          time: '20:00',
          minutes: 20 * 60,
          title,
          body,
          icon: '🛡️',
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
export function getTodayCombatTimeline(S, habits) {
  if (!S) return [];
  const todayStr = today();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const items = [];

  // Hábitos com horário
  const activeHabits = S?.forge?.active || [];
  const times = S?.forge?.times || {};
  const doneHabitsToday = (S?.forge?.done || {})[todayStr] || [];

  activeHabits.forEach((id) => {
    const tm = times[id];
    if (!tm) return;
    const hab = (habits || []).find((h) => h.id === id);
    const [hh, mm] = tm.split(':').map(Number);
    const itemMinutes = hh * 60 + mm;
    const isDone = Array.isArray(doneHabitsToday) && doneHabitsToday.includes(id);

    let status = 'upcoming';
    if (isDone) {
      status = 'done';
    } else if (itemMinutes < currentMinutes - 15) {
      status = 'overdue';
    } else if (itemMinutes <= currentMinutes + 45) {
      status = 'soon';
    }

    items.push({
      id: `hab_${id}`,
      originalId: id,
      type: 'habit',
      time: tm,
      minutes: itemMinutes,
      title: hab?.n || 'Hábito de Guerra',
      icon: hab?.icon || '🔨',
      done: isDone,
      status,
    });
  });

  // Tarefas com horário
  (S?.tasks || []).forEach((t) => {
    if (t.postponedTo && t.postponedTo !== todayStr) return;
    if (t.due && t.due !== todayStr) return;
    if (!t.time) return;

    const [hh, mm] = t.time.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return;
    const itemMinutes = hh * 60 + mm;

    let status = 'upcoming';
    if (t.done) {
      status = 'done';
    } else if (itemMinutes < currentMinutes - 15) {
      status = 'overdue';
    } else if (itemMinutes <= currentMinutes + 45) {
      status = 'soon';
    }

    items.push({
      id: `task_${t.id}`,
      originalId: t.id,
      type: 'task',
      time: t.time,
      minutes: itemMinutes,
      title: t.title || t.text || 'Operação Tática',
      icon: '🎯',
      done: !!t.done,
      status,
    });
  });

  // Projetos com Janela de Foco ou Prazo Hoje
  (S?.projects || []).forEach((p) => {
    if (p.status === 'concluido' || p.archived) return;

    // Se tiver janela de foco hoje
    if (p.tStart) {
      const [hh, mm] = p.tStart.split(':').map(Number);
      if (!isNaN(hh) && !isNaN(mm)) {
        const itemMinutes = hh * 60 + mm;
        let status = 'upcoming';
        if (itemMinutes < currentMinutes - 15) {
          status = 'overdue';
        } else if (itemMinutes <= currentMinutes + 45) {
          status = 'soon';
        }

        items.push({
          id: `proj_focus_${p.id}`,
          originalId: p.id,
          type: 'project',
          time: p.tStart,
          minutes: itemMinutes,
          title: (p.title || p.name || 'Projeto Estratégico') + ' (Foco)',
          icon: '🏛️',
          done: false,
          status,
        });
      }
    }

    // Se tiver prazo final hoje
    const isDeadlineToday = (p.deadline && p.deadline === todayStr) || (p.due && p.due === todayStr);
    if (isDeadlineToday) {
      items.push({
        id: `proj_due_${p.id}`,
        originalId: p.id,
        type: 'project',
        time: 'Hoje',
        minutes: 9999, // fim do dia
        title: p.title || p.name || 'Projeto Estratégico',
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
