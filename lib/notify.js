/* Helpers de notificação: permissão, push (VAPID) e lembretes locais */
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

export async function localNotify(title, body, tag = 'fg-local') {
  if (!pushSupported() || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.showNotification) {
      reg.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag,
        vibrate: [200, 100, 200],
        renotify: true,
      });
      return;
    }
  } catch (e) {}
  try {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      tag,
    });
  } catch (e) {}
}

/* Lembretes locais (com o app aberto): horários dos hábitos, tarefas com horário, projetos com prazo hoje e check-in às 20h */
export function scheduleLocalTimers(S, habits, enabled) {
  const timers = [];
  if (!enabled || !pushSupported() || Notification.permission !== 'granted') return () => {};
  const now = new Date();
  const fireAt = (h, m, title, body, tag) => {
    const t = new Date(); t.setHours(h, m, 0, 0);
    const ms = t - now;
    if (ms > 0 && ms < 14 * 3600 * 1000) {
      timers.push(setTimeout(() => localNotify(title, body, tag), ms));
    }
  };

  const lang = (S?.settings?.lang) || 'pt';

  // 1. Hábitos da Forja com Horário
  if (S?.settings?.notifHabits !== false) {
    (S?.forge?.active || []).forEach((id) => {
      const tm = (S?.forge?.times || {})[id];
      if (!tm) return;
      const hab = (habits || []).find((x) => x.id === id);
      const [hh, mm] = tm.split(':').map(Number);
      const habName = hab ? hab.n : 'Hábito de Guerra';
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
      fireAt(hh, mm, title, body, `hab-${id}`);
    });
  }

  // 2. Tarefas e Operações do Dia com Horário
  const todayStr = today();
  (S?.tasks || []).forEach((task) => {
    if (task.done) return;
    if (task.postponedTo && task.postponedTo !== todayStr) return;
    if (task.due && task.due !== todayStr) return;
    if (!task.time) return;

    const [hh, mm] = task.time.split(':').map(Number);
    if (isNaN(hh) || isNaN(mm)) return;

    const taskTitle = task.title || task.text || (lang === 'en' ? 'Tactical Operation' : 'Operação Tática');
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
    fireAt(hh, mm, title, body, `task-${task.id}`);
  });

  // 3. Projetos Estratégicos com Prazo Hoje (alerta às 09:00 ou em 3 minutos se já passou)
  (S?.projects || []).forEach((proj) => {
    if (proj.status === 'done') return;
    if (proj.due === todayStr) {
      const projTitle = proj.title || proj.name || (lang === 'en' ? 'Strategic Project' : 'Projeto Estratégico');
      const title = lang === 'en'
        ? `🏛️ Deadline Today: ${projTitle}`
        : lang === 'es'
        ? `🏛️ Plazo Hoy: ${projTitle}`
        : `🏛️ Prazo Final Hoje: ${projTitle}`;
      const body = lang === 'en'
        ? 'Strategic project deadline is today. Deliver your victory.'
        : lang === 'es'
        ? 'El plazo del proyecto estratégico es hoy. Entrega tu victoria.'
        : 'O prazo do projeto estratégico vence hoje. Entregue sua vitória.';
      fireAt(9, 0, title, body, `proj-${proj.id}`);
    }
  });

  // 4. Check-in Diário da Forja às 20h
  if (S?.settings?.notifDaily !== false) {
    const ci = (S?.checkins || {})[todayStr];
    if (!(ci && (ci.ok || ci.fail))) {
      fireAt(20, 0, T(S, 'nc_title'), T(S, 'nc_body'), 'checkin-daily');
    }
  }

  return () => timers.forEach(clearTimeout);
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
  const doneHabitsToday = (S?.forge?.history || {})[todayStr] || [];

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
      icon: '🔨',
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

  // Projetos com prazo hoje
  (S?.projects || []).forEach((p) => {
    if (p.due !== todayStr) return;
    const isDone = p.status === 'done';
    items.push({
      id: `proj_${p.id}`,
      originalId: p.id,
      type: 'project',
      time: 'Hoje',
      minutes: 9999, // fim do dia
      title: p.title || p.name || 'Projeto Estratégico',
      icon: '🏛️',
      done: isDone,
      status: isDone ? 'done' : 'soon',
    });
  });

  // Ordena por horário crescente
  items.sort((a, b) => a.minutes - b.minutes);
  return items;
}
