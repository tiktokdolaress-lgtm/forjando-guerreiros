'use client';
import React, { useRef, useState } from 'react';
import { 
  Cloud, RefreshCw, LogOut, Download, Upload, Skull, Plus, X, 
  ShieldCheck, Languages, Bell, BellOff, UserX, Handshake, Copy, 
  Trophy, Palette, Check, Volume2, Shield, Database, ChevronRight, Lock,
  MoreVertical, MessageSquarePlus, Send, Scroll, Sparkles, CheckCircle2, Crown
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Toggle, Chk, Empty } from '@/components/ui';
import { LIFE_STATUS, genHallName } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { setLangCookie } from '@/lib/i18n';
import * as cloud from '@/lib/supabase';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, LSKEY } from '@/lib/utils';
import { pushSupported, askPermission, subscribePush, unsubscribePush, localNotify } from '@/lib/notify';
import ChangelogModal from '../ChangelogModal';
import { CURRENT_APP_VERSION } from '@/lib/changelog';

const SUB_LBL_FALLBACK = {
  pt: { active: '✅ ATIVA', trialing: '🎁 TESTE GRÁTIS EM CURSO', inactive: '⛔ INATIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGAMENTO PENDENTE', local: '💾 MODO LOCAL' },
  en: { active: '✅ ACTIVE', trialing: '🎁 FREE TRIAL ACTIVE', inactive: '⛔ INACTIVE', canceled: '🚫 CANCELED', past_due: '⚠️ PAYMENT PENDING', local: '💾 LOCAL MODE' },
  es: { active: '✅ ACTIVA', trialing: '🎁 PRUEBA GRATIS ACTIVA', inactive: '⛔ INACTIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGO PENDIENTE', local: '💾 MODO LOCAL' },
};

const THEMES = [
  { id: 'dark', nameKey: 'theme_dark', fallbackName: 'Forja do Guerreiro', icon: '🛡️', descKey: 'theme_dark_desc', fallbackDesc: 'Armadura dourada & brasa da forja' },
  { id: 'stealth', nameKey: 'theme_stealth', fallbackName: 'Black Ops', icon: '⚔️', descKey: 'theme_stealth_desc', fallbackDesc: 'Titânio fosco & cinza tático' },
  { id: 'military', nameKey: 'theme_military', fallbackName: 'Exército', icon: '🪖', descKey: 'theme_military_desc', fallbackDesc: 'Verde oliva camuflado' },
];

const SETTINGS_CATEGORIES = [
  { id: 'general', key: 'cat_general', label: 'Geral & Visual', icon: Palette },
  { id: 'feedback', key: 'cat_feedback', label: 'Sugestões & Bugs', icon: MessageSquarePlus },
  { id: 'security', key: 'cat_security', label: 'Segurança & Acesso', icon: Shield },
  { id: 'data', key: 'cat_data', label: 'Conta & Dados', icon: Database },
];

export default function SettingsView() {
  const { S, update, toast, confirmBox, auth, setPhase, setAuth, authRef, sub, refreshSub, openModal, closeModal, setTab } = useApp();
  const st = S.settings;
  const lang = (st && st.lang) || 'pt';
  const currentTheme = st.theme || 'dark';
  const T = (id, fb) => cx(lang, 'settings', id) || cx(lang, 'life', id) || fb;
  
  // Categorias para organização minimalista
  const [activeCategory, setActiveCategory] = useState('general');

  // Modo Comando / Admin restrito ao Dono (micheldiemeson@gmail.com / diemesonmd@gmail.com)
  const userEmail = (
    auth?.email ||
    authRef?.current?.email ||
    (typeof window !== 'undefined' ? localStorage.getItem('fg_local_session') : '') ||
    ''
  ).trim().toLowerCase();

  const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  // Estado da área de Feedbacks, Sugestões & Bugs
  const [feedbackCategory, setFeedbackCategory] = useState('suggestion');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('fg_user_feedbacks');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        if (!item || typeof item !== 'object') return null;
        let rText = '';
        if (typeof item.reply === 'string') {
          rText = item.reply;
        } else if (item.reply && typeof item.reply === 'object') {
          rText = String(item.reply.text || item.reply.replyText || '');
        }
        return {
          ...item,
          reply: rText ? { text: rText, date: item.reply?.date || '' } : null,
        };
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  });

  // Sincroniza respostas do Comando com o histórico local de feedbacks do guerreiro
  useEffect(() => {
    if (!userEmail && !auth?.userId) return;
    const fetchMyReplies = async () => {
      try {
        const query = new URLSearchParams();
        if (userEmail) query.set('email', userEmail);
        if (auth?.userId) query.set('userId', auth.userId);
        const res = await fetch(`/api/user/messages?${query.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.messages) && data.messages.length > 0) {
          setFeedbackHistory((prev) => {
            const updated = prev.map((item) => {
              const matchedReply = data.messages.find(
                (m) =>
                  (item.id && m.feedbackId === item.id) ||
                  (item.message && m.originalMessage && m.originalMessage.includes(item.message.slice(0, 20)))
              );
              if (matchedReply && matchedReply.replyText) {
                return { ...item, reply: { text: String(matchedReply.replyText), date: String(matchedReply.createdAt || '') } };
              }
              return item;
            });
            try {
              localStorage.setItem('fg_user_feedbacks', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      } catch (e) {}
    };
    fetchMyReplies();
  }, [userEmail, auth?.userId]);

  const [showAdminFeedbacks, setShowAdminFeedbacks] = useState(false);
  const [adminFeedbacksList, setAdminFeedbacksList] = useState([]);
  const [adminFeedbacksLoading, setAdminFeedbacksLoading] = useState(false);

  const fetchAdminFeedbacks = async () => {
    if (!isAdmin) return;
    setAdminFeedbacksLoading(true);
    try {
      AF.click();
      const res = await fetch(`/api/feedback?admin_email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'x-admin-email': userEmail,
        },
      });
      if (!res.ok) throw new Error('Não autorizado');
      const data = await res.json();
      setAdminFeedbacksList(data.feedbacks || []);
      setShowAdminFeedbacks(true);
    } catch (e) {
      toast(T('admin_fetch_err', '⚠ Erro ao buscar feedbacks do servidor.'));
    } finally {
      setAdminFeedbacksLoading(false);
    }
  };

  const submitFeedback = async (e) => {
    if (e) e.preventDefault();
    const text = feedbackMsg.trim();
    if (!text || text.length < 5) {
      toast(T('fb_toast_min', '⚠ Escreva pelo menos 5 caracteres na sua mensagem.'));
      return;
    }
    setFeedbackSending(true);
    try {
      AF.click();
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: feedbackCategory,
          message: text,
          contact: feedbackContact.trim() || authRef.current?.email || '',
          appVersion: CURRENT_APP_VERSION,
          userId: authRef.current?.userId || 'local',
        }),
      });
      const data = await res.json().catch(() => ({}));
      const newEntry = {
        id: data.id || 'fb_' + Date.now(),
        category: feedbackCategory,
        message: text,
        contact: feedbackContact.trim(),
        date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR'),
        status: lang === 'en' ? 'Registered' : lang === 'es' ? 'Registrado' : 'Registrado',
      };
      const updated = [newEntry, ...feedbackHistory].slice(0, 15);
      setFeedbackHistory(updated);
      try {
        localStorage.setItem('fg_user_feedbacks', JSON.stringify(updated));
      } catch (err) {}
      setFeedbackMsg('');
      setFeedbackContact('');
      try { AF.win(); } catch (err) {}
      toast(T('fb_toast_ok', '🛡️ Feedback forjado e enviado ao comando com sucesso!'));
    } catch (err) {
      toast(T('fb_toast_err', '⚠ Erro de conexão ao enviar feedback.'));
    } finally {
      setFeedbackSending(false);
    }
  };
  
  const [pinCur, setPinCur] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [ph, setPh] = useState('');
  const fileRef = useRef(null);
  const [perm, setPerm] = useState(() => (pushSupported() ? Notification.permission : 'denied'));
  const [notifBusy, setNotifBusy] = useState(false);

  const enableNotif = async () => {
    if (notifBusy) return;
    setNotifBusy(true);
    try {
      const p = await askPermission();
      setPerm(p);
      if (p !== 'granted') { toast(T('err_notifDenied', '⚠ Permissão de notificação negada no navegador.')); return; }
      const sess = await cloud.getSession();
      if (!sess || !sess.access_token) throw new Error(T('err_sessExpired', 'Sessão expirada — entre novamente.'));
      await subscribePush(sess.access_token);
      update((s) => { s.settings.notifOn = true; });
      toast(T('ok_notifOn', '🔔 Notificações de guerra ativadas neste dispositivo.'));
    } catch (e) {
      toast('⚠ ' + (e.message || T('err_notifFail', 'Falha ao ativar notificações.')));
    }
    setNotifBusy(false);
  };

  const disableNotif = async () => {
    try {
      const sess = await cloud.getSession();
      await unsubscribePush(sess && sess.access_token);
      update((s) => { s.settings.notifOn = false; });
      toast(T('ok_notifOff', '🔕 Notificações desativadas neste dispositivo.'));
    } catch (e) { toast(T('err_notifOffFail', '⚠ Falha ao desativar.')); }
  };

  const deleteAccount = () =>
    confirmBox(
      T('c_delTitle', 'EXCLUIR CONTA E DADOS?'),
      T('c_delBody', 'Isto cancela a assinatura ativa e apaga PERMANENTEMENTE perfil, registros, diário, notas e notificações (direito LGPD). Esta ação é irreversível.'),
      async () => {
        try {
          const sess = await cloud.getSession();
          const res = await fetch('/api/account/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (sess && sess.access_token) } });
          if (!res.ok) { const d = await res.json().catch(() => ({})); toast('⚠ ' + (d.error || T('err_delFail', 'Falha ao excluir a conta.'))); return; }
          try { localStorage.removeItem(LSKEY); localStorage.removeItem('fg_local_session'); } catch (e) {}
          toast(T('ok_deleted', '🕊 Conta e dados excluídos. Até a próxima, guerreiro.'));
          setTimeout(() => { window.location.href = '/'; }, 900);
        } catch (e) { toast(T('err_delConn', '⚠ Erro de conexão ao excluir.')); }
      },
      T('c_delOk', 'SIM, EXCLUIR TUDO')
    );

  const setStatus = (m) => {
    if (L.lifeMode(S) === m) return;
    const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
    confirmBox(T('c_stTitle', 'MUDAR STATUS DE COMBATE?'), LS.desc + T('c_stBody2', ' Os pilares cobrados diariamente mudarão. O histórico de dias NUNCA é apagado.'), () => { update((s) => { s.lifeStatus = m; }); toast(T('ok_stUpdated', '🛡 Status atualizado.')); }, T('c_stOk', 'SIM, MUDAR'));
  };

  const setPin = () => {
    const nv = pinNew.trim();
    if (st.pin) {
      if (pinCur !== st.pin) { toast(T('err_pinCur', '⚠ PIN atual incorreto.')); return; }
      if (nv) { if (!/^\d{4}$/.test(nv)) { toast(T('err_pin4', '⚠ Use exatamente 4 dígitos.')); return; } update((s) => { s.settings.pin = nv; }); toast(T('ok_pinUpd', '🛡 PIN atualizado.')); }
      else { update((s) => { s.settings.pin = ''; }); toast(T('ok_pinRemoved', '🔓 Bloqueio por PIN removido.')); }
    } else {
      if (!/^\d{4}$/.test(nv)) { toast(T('err_pin4', '⚠ Use exatamente 4 dígitos.')); return; }
      update((s) => { s.settings.pin = nv; }); toast(T('ok_pinOn', '🛡 Bloqueio por PIN ativado.'));
    }
    setPinCur(''); setPinNew('');
  };

  const exportBk = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'forjando-guerreiros-backup-' + today() + '.json';
    a.click();
    toast(T('ok_bkExp', '💾 Backup exportado.'));
  };

  const importBk = (f) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result);
        if (typeof o !== 'object' || o.onboarded === undefined) throw 0;
        update((s) => Object.assign(s, o));
        toast(T('ok_bkImp', '⬆ Backup importado com sucesso.'));
        setTimeout(() => location.reload(), 800);
      } catch (e) { toast(T('err_bkInvalid', '⚠ Arquivo de backup inválido.')); }
    };
    r.readAsText(f);
  };

  const syncNow = async () => {
    if (!cloud.CLOUD) { toast(T('err_noCloud', '⚠ Supabase não configurado: sincronização indisponível (modo local).')); return; }
    toast(T('sync_ing', '🔄 Sincronizando com a nuvem...'));
    cloud.pushProfile(authRef.current.userId, authRef.current.email, S, true);
    const d = await cloud.pullProfile(authRef.current.userId);
    if (d && d.v) update((s) => Object.assign(s, d));
    toast(T('ok_syncDone', '✅ Sincronização concluída com a nuvem.'));
  };

  const signOut = async () => {
    if (cloud.CLOUD) await cloud.signOut();
    try { localStorage.removeItem('fg_local_session'); } catch (e) {}
    authRef.current = { email: '', userId: null };
    setAuth({ email: '', userId: null });
    setPhase('auth');
    toast(T('ok_signOut', '🚪 Sessão encerrada.'));
  };

  const selectTheme = (themeId) => {
    update((s) => { s.settings.theme = themeId; });
    document.documentElement.dataset.theme = themeId;
    AF.click();
    const tObj = THEMES.find((t) => t.id === themeId);
    toast('🎨 ' + (tObj ? T(tObj.nameKey, tObj.fallbackName) : T('theme_updated', 'Tema Atualizado')));
  };

  const subLabels = SUB_LBL_FALLBACK[lang] || SUB_LBL_FALLBACK.pt;

  const showGeneral = activeCategory === 'general';
  const showFeedback = activeCategory === 'feedback';
  const showSecurity = activeCategory === 'security';
  const showData = activeCategory === 'data';

  const activeCatObj = SETTINGS_CATEGORIES.find(c => c.id === activeCategory) || SETTINGS_CATEGORIES[0];
  const ActiveIcon = activeCatObj.icon;

  return (
    <div className="flex flex-col gap-3 pb-16">
      {/* SELETOR DE CATEGORIAS RESPONSIVO */}
      <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-2">
        {SETTINGS_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const sel = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                AF.click();
                setActiveCategory(cat.id);
              }}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all truncate select-none cursor-pointer ${
                sel
                  ? 'bg-gold text-[#141414] shadow-sm font-extrabold'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Icon size={14} className="flex-none" />
              <span className="truncate">{T(cat.key, cat.label)}</span>
            </button>
          );
        })}
      </div>

      {/* 1. SEÇÃO GERAL & VISUAL */}
      {showGeneral && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* IDENTIDADE VISUAL & ÁUDIO */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Palette size={13} className="mr-1 inline text-gold" /> {T('sec_theme', 'TEMA & IDENTIDADE VISUAL')}</K>
                <span className="text-[10px] font-mono text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
                  {(() => {
                    const curr = THEMES.find(t => t.id === currentTheme);
                    return curr ? T(curr.nameKey, curr.fallbackName) : currentTheme;
                  })()}
                </span>
              </div>

              {/* Seletor Compacto de Temas */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {THEMES.map((th) => {
                  const sel = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => selectTheme(th.id)}
                      className={`flex flex-col items-center justify-center rounded border p-2 text-center transition-all ${
                        sel
                          ? 'border-gold bg-gold/15 text-gold shadow-[0_0_8px_rgba(255,200,70,0.2)] font-bold'
                          : 'border-line bg-surface2 text-muted hover:border-gold/40 hover:text-ink'
                      }`}
                    >
                      <span className="text-base mb-0.5">{th.icon}</span>
                      <span className="text-[11.5px] leading-tight truncate w-full">{T(th.nameKey, th.fallbackName)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Linhas integradas de Idioma & Efeitos Sonoros */}
              <div className="space-y-2 pt-2.5 border-t border-line/60">
                <div className="flex items-center justify-between gap-3 p-2 rounded bg-surface2/60 border border-line/40">
                  <div className="flex items-center gap-2">
                    <Languages size={14} className="text-gold" />
                    <div>
                      <b className="text-xs text-ink">{T('lang_title', 'Idioma')}</b>
                      <small className="block text-[10px] text-muted">{T('lang_desc', 'Interface do sistema')}</small>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {['pt', 'en', 'es'].map((l) => (
                      <button
                        key={l}
                        className={st.lang === l ? 'chip text-[10.5px] py-0.5 px-2.5' : 'chip-dim text-[10.5px] py-0.5 px-2.5'}
                        onClick={() => {
                          update((s) => { s.settings.lang = l; });
                          setLangCookie(l);
                          toast(T('lang_toast', '🌐 Idioma: ') + l.toUpperCase());
                        }}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-surface2/60 border border-line/40">
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-gold" />
                    <div>
                      <b className="text-xs text-ink">{T('sound_title', 'Efeitos Sonoros')}</b>
                      <small className="block text-[10px] text-muted">{T('sound_desc', 'Feedback tático nas ações')}</small>
                    </div>
                  </div>
                  <Toggle
                    on={st.sound}
                    onChange={() => {
                      update((s) => { s.settings.sound = !s.settings.sound; });
                      if (!st.sound) AF.click();
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* STATUS DE VIDA & PILARES */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K>💍 {T('sec_status', 'STATUS DE VIDA & PILARES')}</K>
                <span className="text-[10px] font-mono text-muted">{T('status_impact_badge', 'IMPACTO NO QG')}</span>
              </div>
              <p className="text-[11.5px] text-muted mb-2 leading-relaxed">
                {T('status_desc', 'Define quais hábitos e pilares são cobrados diariamente no seu Quartel General.')}
              </p>

              <div className="space-y-1.5">
                {Object.keys(LIFE_STATUS).map((m) => {
                  const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
                  const sel = L.lifeMode(S) === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setStatus(m)}
                      className={`w-full flex items-start gap-2.5 p-2 rounded border text-left transition-all ${
                        sel
                          ? 'border-gold bg-gold/10 text-ink'
                          : 'border-line/60 bg-surface2/60 text-muted hover:border-gold/30 hover:text-ink'
                      }`}
                    >
                      <span className={`grid h-4 w-4 flex-none place-items-center rounded-full border text-[9px] font-bold mt-0.5 ${
                        sel ? 'border-gold bg-gold text-[#141414]' : 'border-line text-transparent'
                      }`}>✓</span>
                      <div className="flex-1 min-w-0">
                        <b className={`text-xs ${sel ? 'text-gold' : 'text-ink'}`}>{LS.label}</b>
                        <p className="text-[10.5px] text-muted leading-tight truncate">{LS.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* BANNER NOTAS DA ATUALIZAÇÃO NO GERAL */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-amber-600/40 bg-gradient-to-r from-amber-950/30 via-surface2/60 to-surface border-dashed">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 flex-none">
                  <Scroll size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <b className="text-xs text-amber-200">{T('decrees_banner_title', 'Decretos da Forja (Notas da Atualização)')}</b>
                    <span className="text-[10px] font-mono text-gold font-bold px-1.5 py-0.2 rounded bg-gold/10 border border-gold/30">
                      {CURRENT_APP_VERSION}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted truncate">
                    {T('decrees_banner_sub', 'Veja o que mudou nesta versão e acompanhe as melhorias da forja.')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openModal(<ChangelogModal onClose={closeModal} />, 'dialog')}
                className="flex-none px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-950/80 text-amber-300 text-xs font-bold hover:bg-amber-900 transition-colors cursor-pointer"
              >
                {T('decrees_banner_btn', 'Ver Novidades')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO 2: SUGESTÕES, BUGS & DECRETOS DA FORJA */}
      {showFeedback && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
          {/* FORMULÁRIO PRINCIPAL DE FEEDBACK */}
          <Card className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><MessageSquarePlus size={13} className="mr-1 inline text-gold" /> {T('fb_title', 'CONSELHO DE GUERRA & FEEDBACK')}</K>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={fetchAdminFeedbacks}
                    className="text-[10px] font-mono text-gold uppercase px-2 py-0.5 rounded bg-gold/15 border border-gold/40 hover:bg-gold/30 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                    title={T('admin_btn_title', 'Painel do Comando - Ver todos os feedbacks recebidos')}
                  >
                    <span className="font-bold">{T('fb_badge_admin', 'COMANDO · CANAL DIRETO')}</span>
                    <span className="text-[11px]">👁️</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-muted mb-3 leading-relaxed">
                {T('fb_sub', 'Ajude a forjar um aplicativo cada vez mais implacável. Relate problemas, sugira novas ideias de melhorias ou deixe seu testemunho de batalha.')}
              </p>

              {/* Seletor de Tipo */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono text-ink/80 mb-1.5 font-bold uppercase">
                  {T('fb_type_label', 'TIPO DE MENSAGEM')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'suggestion', label: T('fb_opt_sugg', 'Sugestão'), icon: '💡', desc: T('fb_opt_sugg_sub', 'Nova ideia') },
                    { id: 'bug', label: T('fb_opt_bug', 'Relatar Bug'), icon: '🐛', desc: T('fb_opt_bug_sub', 'Erro no app') },
                    { id: 'ux', label: T('fb_opt_ux', 'Usabilidade'), icon: '⚔️', desc: T('fb_opt_ux_sub', 'Dificuldade') },
                    { id: 'praise', label: T('fb_opt_praise', 'Elogio'), icon: '⭐', desc: T('fb_opt_praise_sub', 'Testemunho') },
                  ].map((cat) => {
                    const sel = feedbackCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          try { AF.click(); } catch (e) {}
                          setFeedbackCategory(cat.id);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          sel
                            ? 'border-gold bg-gold/15 text-gold font-bold shadow-sm'
                            : 'border-line bg-surface2 text-muted hover:border-gold/40 hover:text-ink'
                        }`}
                      >
                        <span className="text-base mb-0.5">{cat.icon}</span>
                        <span className="text-[11px] leading-tight font-bold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Campo de Mensagem */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono text-ink/80 mb-1 font-bold uppercase">
                  {T('fb_msg_label', 'SUA MENSAGEM / RELATO')}
                </label>
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder={
                    feedbackCategory === 'bug'
                      ? T('fb_msg_ph_bug', 'Descreva o que aconteceu, em qual tela ou aparelho, e o que deu errado...')
                      : feedbackCategory === 'suggestion'
                      ? T('fb_msg_ph_sugg', 'Descreva a sua ideia ou recurso que tornaria o app ainda melhor...')
                      : feedbackCategory === 'praise'
                      ? T('fb_msg_ph_praise', 'Conte como o Forjando Guerreiros tem impactado sua disciplina e retenção...')
                      : T('fb_msg_ph_ux', 'Conte-nos sua experiência ou dificuldade encontrada...')
                  }
                  rows={4}
                  maxLength={1000}
                  className="w-full rounded-lg border border-line bg-surface2 p-3 text-xs text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-muted mt-1 px-1">
                  <span>{T('fb_min_char', 'Mínimo 5 caracteres')}</span>
                  <span>{feedbackMsg.length}/1000</span>
                </div>
              </div>

              {/* Contato opcional */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono text-ink/80 mb-1 font-bold uppercase">
                  {T('fb_contact_label', 'SEU CONTATO (OPCIONAL)')}
                </label>
                <input
                  type="text"
                  value={feedbackContact}
                  onChange={(e) => setFeedbackContact(e.target.value)}
                  placeholder={T('fb_contact_ph', 'Seu e-mail ou @ para receber retorno, se desejar...')}
                  className="w-full rounded-lg border border-line bg-surface2 px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="button"
                onClick={submitFeedback}
                disabled={feedbackSending || feedbackMsg.trim().length < 5}
                className="w-full btn-gold py-2.5 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow"
              >
                <Send size={14} />
                <span>{feedbackSending ? T('fb_btn_sending', 'ENVIANDO AO COMANDO...') : T('fb_btn_send', 'ENVIAR AO COMANDO DA FORJA')}</span>
              </button>
            </div>
          </Card>

          {/* COLUNA LATERAL: NOTAS DE ATUALIZAÇÃO & HISTÓRICO */}
          <div className="space-y-3">
            {/* CARD DECRETOS DA FORJA (CHANGELOG) */}
            <Card className="border-amber-600/40 bg-gradient-to-br from-surface to-amber-950/20">
              <div className="flex items-center justify-between mb-2">
                <K><Scroll size={13} className="mr-1 inline text-amber-400" /> {T('fb_decrees_title', 'DECRETOS DA FORJA')}</K>
                <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                  {CURRENT_APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-muted mb-3 leading-relaxed">
                {T('fb_decrees_sub', 'Confira todas as melhorias e correções recém-forjadas no aplicativo. Suas assinaturas e dias permanecem 100% seguros a cada versão.')}
              </p>
              <button
                type="button"
                onClick={() => openModal(<ChangelogModal onClose={closeModal} />, 'dialog')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-amber-600/50 bg-amber-950/40 text-amber-300 text-xs font-bold hover:bg-amber-900/60 transition-colors cursor-pointer"
              >
                <Scroll size={14} className="text-amber-400" />
                <span>{T('fb_decrees_btn', 'VER NOTAS DA ATUALIZAÇÃO')}</span>
              </button>
            </Card>

            {/* CARD HISTÓRICO DE FEEDBACKS ENVIADOS */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <K><CheckCircle2 size={13} className="mr-1 inline text-emerald-400" /> {T('fb_history_title', 'SEUS ENVIOS')}</K>
                <span className="text-[10px] font-mono text-muted">{feedbackHistory.length} {T('fb_records_unit', 'registro(s)')}</span>
              </div>
              {feedbackHistory.length === 0 ? (
                <Empty className="py-4 text-[11px]">
                  {T('fb_history_empty', 'Nenhum feedback enviado ainda neste dispositivo.')}
                </Empty>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {feedbackHistory.map((item, idx) => (
                    <div key={idx} className="p-2 rounded border border-line/60 bg-surface2/60 text-xs">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-ink uppercase text-[10px] font-mono">
                          {item.category === 'bug' ? '🐛 Bug' : item.category === 'suggestion' ? '💡 Sugestão' : item.category === 'praise' ? '⭐ Elogio' : '⚔️ Usabilidade'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          {item.status || T('fb_status_registered', 'Registrado')}
                        </span>
                      </div>
                      <p className="text-muted text-[11px] line-clamp-2 italic">
                        "{item.message}"
                      </p>
                      {(() => {
                        const replyContent = typeof item.reply === 'string'
                          ? item.reply
                          : (item.reply && typeof item.reply === 'object'
                              ? (item.reply.text || item.reply.replyText || '')
                              : '');
                        if (!replyContent) return null;
                        return (
                          <div className="mt-2 p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 font-bold">
                              <Crown size={11} className="text-gold" />
                              <span>Resposta do Comando Supremo (Criador):</span>
                            </div>
                            <p className="text-amber-100 font-sans italic text-xs leading-relaxed">
                              &ldquo;{replyContent}&rdquo;
                            </p>
                          </div>
                        );
                      })()}
                      <div className="text-[9.5px] font-mono text-muted/70 mt-1 text-right">
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* MODAL DE CONSULTA DO COMANDO (FEEDBACKS RECEBIDOS NO SERVIDOR) */}
        {showAdminFeedbacks && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-surface border border-gold/40 rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col text-ink">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛡️</span>
                  <div>
                    <h3 className="font-display font-bold text-base text-gold">{T('admin_panel_title', 'PAINEL DO COMANDO · FEEDBACKS RECEBIDOS')}</h3>
                    <p className="text-[11px] text-muted font-mono">{T('admin_panel_sub', 'Feedbacks forjados pelos guerreiros no servidor')} ({adminFeedbacksList.length} total)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminFeedbacks(false)}
                  className="p-1 rounded-lg border border-line text-muted hover:text-ink hover:border-gold/40"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                {adminFeedbacksLoading ? (
                  <div className="text-center py-8 text-xs font-mono text-muted animate-pulse">{T('admin_loading', 'Carregando registros da Forja...')}</div>
                ) : adminFeedbacksList.length === 0 ? (
                  <div className="text-center py-8 text-xs font-mono text-muted">{T('admin_empty', 'Nenhum feedback recebido no servidor até o momento.')}</div>
                ) : (
                  adminFeedbacksList.map((fb, idx) => (
                    <div key={fb.id || idx} className="p-3 rounded-xl border border-line bg-surface2/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                          {fb.category === 'bug' ? '🐛 BUG' : fb.category === 'suggestion' ? '💡 SUGESTÃO' : fb.category === 'praise' ? '⭐ ELOGIO' : '⚔️ USABILIDADE'}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          {new Date(fb.createdAt).toLocaleString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR')} · {fb.appVersion}
                        </span>
                      </div>
                      <p className="text-ink leading-relaxed font-sans text-xs bg-black/30 p-2.5 rounded-lg border border-line/40">
                        {fb.message}
                      </p>
                      {fb.contact && (
                        <div className="text-[10.5px] font-mono text-emerald-400 flex items-center gap-1">
                          <span>{T('admin_contact_prefix', '📧 Contato do Guerreiro:')}</span>
                          <strong className="text-emerald-300">{fb.contact}</strong>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between text-[11px] font-mono text-muted">
                <span>{T('admin_tip', 'Dica: Para receber direto no celular, configure FEEDBACK_WEBHOOK_URL.')}</span>
                <button
                  type="button"
                  onClick={() => setShowAdminFeedbacks(false)}
                  className="px-4 py-1.5 rounded-lg border border-line bg-surface2 text-ink font-bold hover:border-gold/40"
                >
                  {T('admin_close', 'Fechar')}
                </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      {/* 3. SEÇÃO SEGURANÇA & ACESSO */}
      {showSecurity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* BLOQUEIO POR PIN */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><ShieldCheck size={13} className="mr-1 inline text-gold" /> {T('sec_pin', 'BLOQUEIO POR PIN')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  st.pin ? 'text-ok bg-ok/10 border-ok/30' : 'text-muted bg-surface2 border-line'
                }`}>
                  {st.pin ? T('badge_active', '✓ ATIVADO') : T('badge_disabled', 'DESATIVADO')}
                </span>
              </div>

              {st.pin ? (
                <div className="space-y-2">
                  <p className="text-xs text-ok font-medium">
                    {T('pin_on', '✓ Bloqueio ativo de 4 dígitos blindando o acesso ao app.')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinCur', 'PIN atual')} value={pinCur} onChange={(e) => setPinCur(e.target.value)} />
                    <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew1', 'Novo PIN (ou vazio)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                  </div>
                  <button className="btn-gold w-full text-xs py-1.5" onClick={setPin}>{T('pin_upd', 'ATUALIZAR / REMOVER PIN')}</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {T('pin_intro', 'Defina um PIN de 4 dígitos para impedir o acesso caso alguém pegue seu aparelho.')}
                  </p>
                  <div className="flex gap-2">
                    <input type="password" className="field flex-1 text-xs text-center font-mono tracking-widest" maxLength={4} inputMode="numeric" placeholder={T('ph_pin4_simple', 'Código de 4 dígitos')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                    <button className="btn-gold flex-none px-4 text-xs font-bold py-1.5" onClick={setPin}>{T('pin_act', 'ATIVAR PIN')}</button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* NOTIFICAÇÕES */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Bell size={13} className="mr-1 inline text-gold" /> {T('sec_notif', 'NOTIFICAÇÕES DE GUERRA')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  perm === 'granted' ? 'text-ok bg-ok/10 border-ok/30' : 'text-gold2 bg-gold/10 border-gold/20'
                }`}>
                  {perm === 'granted' ? T('badge_device_active', 'DISPOSITIVO ATIVO') : T('badge_not_authorized', 'NÃO AUTORIZADO')}
                </span>
              </div>

              {/* Painel Duplo de Notificações */}
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-surface2/80 border border-gold/20 text-xs text-muted leading-relaxed">
                  <span className="font-bold text-gold block mb-0.5 text-[11px]">
                    ⚡ {T('notif_dual_title', 'Motor de Alerta Duplo (Dentro e Fora)')}
                  </span>
                  {T('notif_dual_body', 'Fora: Notificações na tela de bloqueio e barra de status do celular ou PC. Dentro: Banners visuais e acorde sonoro tático para você não perder nenhum compromisso.')}
                </div>

                {perm !== 'granted' && (
                  <button className="btn-gold w-full text-xs py-2" disabled={notifBusy} onClick={enableNotif}>
                    <Bell size={13} /> {T('notif_on', 'AUTORIZAR NOTIFICAÇÕES NO DISPOSITIVO')}
                  </button>
                )}

                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_daily_t', 'Lembrete noturno')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_daily_d', 'Push às ~20h se não fez check-in')}</small>
                    </div>
                    <Toggle on={st.notifDaily !== false} onChange={() => update((s) => { s.settings.notifDaily = s.settings.notifDaily === false; })} />
                  </div>

                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_hab_t', 'Horários dos hábitos')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_hab_d', 'Alertas nos horários agendados')}</small>
                    </div>
                    <Toggle on={st.notifHabits !== false} onChange={() => update((s) => { s.settings.notifHabits = s.settings.notifHabits === false; })} />
                  </div>

                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_tasks_t', 'Tarefas e Operações')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_tasks_d', 'Alertas no horário agendado de cada tarefa')}</small>
                    </div>
                    <Toggle on={st.notifTasks !== false} onChange={() => update((s) => { s.settings.notifTasks = s.settings.notifTasks === false; })} />
                  </div>

                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_proj_t', 'Projetos Estratégicos')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_proj_d', 'Alertas de janela de foco diária e prazo final')}</small>
                    </div>
                    <Toggle on={st.notifProjects !== false} onChange={() => update((s) => { s.settings.notifProjects = s.settings.notifProjects === false; })} />
                  </div>

                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_sound_t', 'Sinal sonoro interno')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_sound_d', 'Toca um acorde heróico ao disparar o horário')}</small>
                    </div>
                    <Toggle on={st.notifSound !== false} onChange={() => update((s) => { s.settings.notifSound = s.settings.notifSound === false; })} />
                  </div>

                  <button
                    type="button"
                    className="btn-dark w-full text-xs py-2 mt-1 flex items-center justify-center gap-1.5 border-gold/30 text-gold hover:border-gold"
                    onClick={async () => {
                      if (st.notifSound !== false) {
                        AF.alert();
                      }
                      toast(T('notif_test_toast', '⚡ Teste de alerta tático executado! Notificações interna e externa ativas.'));
                      await localNotify(
                        '⚔️ Teste de Alerta · Forjando Guerreiros',
                        'Lembrete duplo (fora e dentro do app) funcionando perfeitamente!',
                        'fg-test-alert'
                      );
                    }}
                  >
                    <Bell size={13} />
                    <span>{T('notif_test_btn', 'TESTAR ALERTAS (DENTRO E FORA)')}</span>
                  </button>

                  {perm === 'granted' && (
                    <button className="btn-dark w-full text-[11px] py-1 text-muted hover:text-ink mt-1" onClick={disableNotif}>
                      <BellOff size={12} /> {T('notif_off', 'Desativar neste dispositivo')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* PARCEIRO DE RESPONSABILIDADE */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Handshake size={13} className="mr-1 inline text-gold" /> {T('sec_partner', 'PARCEIRO DE RESPONSABILIDADE')}</K>
                <span className="text-[10px] font-mono text-muted">{T('badge_accountability', 'ACCOUNTABILITY')}</span>
              </div>

              {S.partnerToken ? (
                <div className="space-y-2">
                  <p className="text-[11.5px] text-muted">
                    {T('partner_have', 'Link somente-leitura ativo. Exibe apenas pseudônimo, dias e streak:')}
                  </p>
                  <div className="flex gap-1.5">
                    <input className="field flex-1 font-mono text-[11px] py-1" readOnly value={(typeof window !== 'undefined' ? window.location.origin : '') + '/p/' + S.partnerToken} />
                    <button className="btn-gold flex-none px-3" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/p/' + S.partnerToken); toast(T('ok_linkCopied', '🔗 Link copiado.')); }}>
                      <Copy size={13} />
                    </button>
                  </div>
                  <button className="btn-dark w-full text-xs py-1 text-danger hover:bg-danger/10" onClick={() => confirmBox(T('c_plTitle', 'DESATIVAR LINK?'), T('c_plBody', 'Seu parceiro perderá o acesso ao seu cartão de responsabilidade.'), () => update((s) => { s.partnerToken = null; }), T('c_plOk', 'SIM, DESATIVAR'))}>
                    {T('partner_off', 'Desativar Link')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {T('partner_intro', 'Gere um link seguro para um amigo ou mentor acompanhar seu progresso sem expor notas ou dados privados.')}
                  </p>
                  <button className="btn-gold w-full text-xs py-2" onClick={() => { const tok = Math.random().toString(36).slice(2) + Date.now().toString(36); update((s) => { s.partnerToken = tok; if (!s.hallName) s.hallName = genHallName(); }); toast(T('ok_linkCreated', '🤝 Link de responsabilidade criado.')); }}>
                    <Handshake size={13} /> {T('btn_partner_create', 'GERAR LINK DE AUDITORIA')}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* SALÃO DA FAMA */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Trophy size={13} className="mr-1 inline text-gold" /> {T('sec_hall', 'SALÃO DA FAMA')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  S.hallOptIn ? 'text-gold bg-gold/10 border-gold/30' : 'text-muted bg-surface2 border-line'
                }`}>
                  {S.hallOptIn ? T('badge_participating', 'PARTICIPANDO') : T('badge_hidden', 'OCULTO')}
                </span>
              </div>

              <div className="p-2.5 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-3 mb-2">
                <div>
                  <b className="text-xs text-ink">{T('hall_t', 'Participar do ranking anônimo')}</b>
                  <small className="block text-[10.5px] text-muted">
                    {S.hallOptIn ? T('hall_pseudo', 'Pseudônimo: ') + (S.hallName || 'Guerreiro') : T('hall_optin', 'Apenas quem opta explicitamente é exibido')}
                  </small>
                </div>
                <Toggle
                  on={!!S.hallOptIn}
                  onChange={() => update((s) => {
                    s.hallOptIn = !s.hallOptIn;
                    if (s.hallOptIn && !s.hallName) s.hallName = genHallName();
                  })}
                />
              </div>

              <p className="text-[11px] text-muted leading-relaxed">
                {T('hall_intro', '100% anônimo. Apenas seu pseudônimo de combate e sequência de dias são visíveis para inspirar a tropa.')}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* 3. SEÇÃO CONTA, DADOS & CÓDIGO */}
      {showData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* CONTA & NUVEM */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K><Cloud size={13} className="mr-1 inline text-gold" /> {T('sec_account', 'SUA CONTA & NUVEM')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  cloud.CLOUD ? 'text-ok bg-ok/10 border-ok/30' : 'text-gold2 bg-gold/10 border-gold/30'
                }`}>
                  {cloud.CLOUD ? T('badge_cloud_active', 'NUVEM ATIVA') : T('badge_local', 'LOCAL')}
                </span>
              </div>

              <div className="p-2.5 rounded bg-surface2 border border-line/60 text-xs space-y-1.5 mb-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted">{T('lbl_warrior', 'Guerreiro:')}</span>
                  <b className="text-gold font-mono truncate max-w-[200px]">{auth.email || '—'}</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">{T('lbl_subscription', 'Assinatura:')}</span>
                  <span className="flex items-center gap-1.5">
                    <b className={sub === 'active' || sub === 'trialing' ? 'text-ok font-bold' : 'text-gold2 font-bold'}>
                      {subLabels[sub] || sub}
                    </b>
                    <button
                      className="underline text-[10px] text-muted hover:text-gold"
                      onClick={() => { refreshSub(2); toast(T('ok_subUpd', '🔄 Status atualizado.')); }}
                    >
                      {T('sub_refresh', '(atualizar)')}
                    </button>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="btn-ghost text-xs py-1.5" onClick={syncNow}>
                  <RefreshCw size={13} /> {T('btn_sync', 'Sincronizar Agora')}
                </button>
                <button className="btn-red text-xs py-1.5" onClick={signOut}>
                  <LogOut size={13} /> {T('btn_signout', 'Sair da Conta')}
                </button>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => { AF.click(); setTab('admin'); }}
                  className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold hover:bg-gold/25 transition-all shadow-sm"
                >
                  <Crown size={14} className="text-gold" />
                  <span>ABRIR PAINEL DO COMANDO (ADMIN)</span>
                </button>
              )}
            </div>
          </Card>

          {/* BACKUP LOCAL */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K><Download size={13} className="mr-1 inline text-gold" /> {T('sec_backup', 'BACKUP EM ARQUIVO')}</K>
                <span className="text-[10px] font-mono text-muted">{T('backup_format', 'FORMATO .JSON')}</span>
              </div>
              <p className="text-xs text-muted mb-2.5 leading-relaxed">
                {T('backup_desc', 'Exporte uma cópia completa dos seus dados criptografados para backup físico ou migração de aparelho.')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-ghost text-xs py-1.5" onClick={exportBk}>
                  <Download size={13} /> {T('btn_export', 'Exportar Backup')}
                </button>
                <button className="btn-ghost text-xs py-1.5" onClick={() => fileRef.current && fileRef.current.click()}>
                  <Upload size={13} /> {T('btn_import', 'Importar Arquivo')}
                </button>
              </div>
              <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) importBk(f); e.target.value = ''; }} />
            </div>
          </Card>

          {/* FRASES DO CÓDIGO DO GUERREIRO */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K>📜 {T('sec_phrases', 'FRASES DO CÓDIGO DO GUERREIRO')}</K>
                <span className="text-[10px] font-mono text-muted">{S.phrases.length} {T('lbl_extras', 'EXTRAS')}</span>
              </div>

              <div className="mb-2 flex flex-col gap-1.5">
                <div className="flex gap-1.5 items-start">
                  <textarea
                    rows={2}
                    className="field flex-1 text-xs py-2 px-2.5 resize-y min-h-[44px] max-h-[160px] leading-relaxed"
                    maxLength={3000}
                    placeholder={T('phrases_placeholder', 'Adicionar lema ou princípio de guerra (até 3000 caracteres)...')}
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && ph.trim()) {
                        e.preventDefault();
                        update((s) => { s.phrases.push(ph.trim()); });
                        setPh('');
                        toast(T('ok_phraseAdd', '✨ Frase adicionada.'));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-gold flex-none px-3.5 h-[44px] flex items-center justify-center"
                    onClick={() => {
                      if (!ph.trim()) return;
                      update((s) => { s.phrases.push(ph.trim()); });
                      setPh('');
                      toast(T('ok_phraseAdd', '✨ Frase adicionada.'));
                    }}
                    title={T('btn_add_phrase_title', 'Adicionar Frase')}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-muted px-0.5">
                  <span>{T('phrases_hint', 'Enter para salvar (Shift+Enter para nova linha)')}</span>
                  <span className={ph.length >= 2800 ? 'text-danger font-bold' : ''}>
                    {ph.length}/3000
                  </span>
                </div>
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                {S.phrases.length ? (
                  S.phrases.map((p, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 rounded border border-line/60 bg-surface2/60 p-2 text-xs">
                      <span className="italic text-ink whitespace-pre-wrap leading-relaxed break-words flex-1">"{p}"</span>
                      <button
                        className="text-muted hover:text-danger flex-none p-1 transition-colors mt-0.5"
                        onClick={() => confirmBox(T('c_phTitle', 'EXCLUIR FRASE?'), (T('del_phrase_prefix', 'Remover "') + p + T('del_phrase_suffix', '" do Código?')), () => update((s) => { s.phrases.splice(i, 1); s.phraseIdx = 0; }))}
                        title={T('del_phrase_btn', 'Excluir frase')}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                ) : (
                  <Empty className="py-2 text-[11px]">{T('phrases_empty', 'Nenhuma frase customizada adicionada ainda.')}</Empty>
                )}
              </div>
            </div>
          </Card>

          {/* ZONA CRÍTICA */}
          <Card className="border-danger/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K className="text-danger flex items-center gap-1"><Skull size={13} /> {T('sec_danger', 'ZONA CRÍTICA')}</K>
                <span className="text-[10px] font-mono text-danger/80">{T('badge_irreversible', 'AÇÕES IRREVERSÍVEIS')}</span>
              </div>
              <p className="text-xs text-muted mb-2.5 leading-relaxed">
                {T('danger_desc', 'Ações definitivas que redefinem o banco de dados local ou apagam sua conta na nuvem.')}
              </p>
              <div className="space-y-1.5">
                <button className="btn-red w-full text-xs py-1.5" onClick={() => confirmBox(T('c_wipeTitle', 'APAGAR TUDO?'), T('c_wipeBody', 'Onboarding, streaks, diário, hábitos, tarefas e notas serão destruídos para sempre.'), () => { try { localStorage.removeItem(LSKEY); } catch (e) {} location.reload(); }, T('c_wipeOk', 'SIM, QUEIMAR TUDO E RECOMEÇAR'))}>
                  <Skull size={13} /> {T('btn_wipe', 'Resetar Dados Locais')}
                </button>
                <button className="btn-red w-full border border-danger/40 bg-transparent text-danger hover:bg-danger/10 text-xs py-1.5" onClick={deleteAccount}>
                  <UserX size={13} /> {T('btn_delAcct', 'Excluir Conta & Dados (LGPD)')}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
