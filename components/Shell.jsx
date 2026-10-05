'use client';
import React, { useEffect } from 'react';
import { Castle, Hammer, Target, BookOpen, ChartNoAxesColumn, Skull, Settings, Siren, ShieldCheck, Scroll, Crown, Mail, Compass, MoreHorizontal } from 'lucide-react';
import { useApp } from '@/lib/store';
import { TABS, LIFE_STATUS } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { lifeMode, progressDays, allH } from '@/lib/logic';
import { ensureSw, scheduleLocalTimers } from '@/lib/notify';
import { AF } from '@/lib/audio';
import { hasUnreadUpdates, CURRENT_APP_VERSION, markUpdatesAsRead } from '@/lib/changelog';
import WarriorLogo from './WarriorLogo';
import SosModal from './SosModal';
import ChangelogModal from './ChangelogModal';
import AppTourModal, { TOUR_STORAGE_KEY } from './AppTourModal';
import CommandReplyModal from './CommandReplyModal';
import QgView from './views/QgView';
import ForgeView from './views/ForgeView';
import OpsView from './views/OpsView';
import JournalView from './views/JournalView';
import StatsView from './views/StatsView';
import EnemyView from './views/EnemyView';
import SettingsView from './views/SettingsView';
import AdminView from './views/AdminView';
import ErrorBoundary from './ErrorBoundary';

const ICONS = { qg: Castle, forge: Hammer, ops: Target, journal: BookOpen, stats: ChartNoAxesColumn, enemy: Skull, settings: Settings, admin: Crown };
const VIEWS = { qg: QgView, forge: ForgeView, ops: OpsView, journal: JournalView, stats: StatsView, enemy: EnemyView, settings: SettingsView, admin: AdminView };
const MOBILE_TABS = ['qg', 'forge', 'ops', 'journal'];
const MOBILE_MORE_I18N = { pt: 'Mais', en: 'More', es: 'Más' };

const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];

export default function Shell() {
  const { S, tab, setTab, t, openModal, closeModal, update, toast, auth, authRef } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';

  const userEmail = (
    auth?.email ||
    authRef?.current?.email ||
    (typeof window !== 'undefined' ? localStorage.getItem('fg_local_session') : '') ||
    ''
  ).trim().toLowerCase();

  const isAdmin = ADMIN_EMAILS.includes(userEmail);
  const lifeLbl = (() => { const m = lifeMode(S); const LS = cx(lang, 'life', m) || LIFE_STATUS[m] || LIFE_STATUS.single; return LS.label; })();
  const go = (id) => { AF.click(); setTab(id); window.scrollTo({ top: 0 }); }
  const openSOS = () => { update((d) => { d.sos = (d.sos || 0) + 1; }); openModal(<SosModal />, 'full'); };
  const View = (tab === 'admin' && !isAdmin) ? QgView : (VIEWS[tab] || QgView);
  const TabIcon = ICONS[tab] || Castle;

  const [hasUnread, setHasUnread] = React.useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false);
  const [commandReplies, setCommandReplies] = React.useState([]);
  const [unreadReply, setUnreadReply] = React.useState(null);

  const handleOpenCommandReply = (msg) => {
    if (!msg) return;
    openModal(
      <CommandReplyModal
        message={msg}
        onClose={async () => {
          closeModal();
          setUnreadReply(null);
          try {
            await fetch('/api/user/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messageId: msg.id,
                email: userEmail,
                userId: auth?.userId || auth?.id,
              }),
            });
          } catch (e) {}
        }}
      />,
      'dialog'
    );
  };

  /* Consulta decretos e respostas do Comando Supremo enviados diretamente a este guerreiro */
  React.useEffect(() => {
    let isMounted = true;
    const checkMessages = async () => {
      if (!userEmail && !auth?.userId) return;
      try {
        const query = new URLSearchParams();
        if (userEmail) query.set('email', userEmail);
        if (auth?.userId) query.set('userId', auth.userId);

        const res = await fetch(`/api/user/messages?${query.toString()}`);
        if (!res.ok) return;
        const data = await res.json();

        if (isMounted && data && Array.isArray(data.messages)) {
          setCommandReplies(data.messages);
          const unread = data.messages.find((m) => !m.read);
          if (unread) {
            setUnreadReply(unread);
            toast('⚔️ Decreto do Comando Supremo recebido! Toque no topo para ler.');
            const timer = setTimeout(() => {
              if (isMounted) {
                handleOpenCommandReply(unread);
              }
            }, 1500);
            return () => clearTimeout(timer);
          }
        }
      } catch (e) {}
    };

    checkMessages();
    const interval = setInterval(checkMessages, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userEmail, auth?.userId]);

  /* Notificação visual automática e estritamente interna (in-app): Tour para novatos e Decretos para veteranos */
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!hasSeenTour) {
        // Apresentação inicial guiada para quem acabou de entrar ou nunca viu o tour
        const timer = setTimeout(() => {
          openModal(
            <AppTourModal
              onClose={() => {
                closeModal();
                try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch (e) {}
              }}
            />,
            'tour dialog'
          );
        }, 900);
        return () => clearTimeout(timer);
      }

      // Se já viu o tour, verifica se há atualizações / Decretos da Forja
      const unread = hasUnreadUpdates();
      setHasUnread(unread);
      if (unread) {
        // 1. Toast informativo interno na interface do app
        toast(cx(lang, 'settings', 'notif_update_toast') || '📜 Novo Decreto da Forja disponível! Toque no topo para ler.');

        // 2. Modal explicativo dos Decretos da Forja (apenas dentro do app)
        const timer = setTimeout(() => {
          openModal(
            <ChangelogModal
              onClose={() => {
                closeModal();
                setHasUnread(false);
                markUpdatesAsRead();
              }}
            />,
            'dialog'
          );
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [lang, openModal, closeModal, toast]);

  /* PWA: registra o service worker + agenda lembretes duplos (fora via OS e dentro via som e toast) */
  React.useEffect(() => {
    ensureSw();
    const clean = scheduleLocalTimers(S, allH(S), true, {
      onInAppNotify: (item) => {
        if (S?.settings?.notifSound !== false) {
          AF.alert();
        }
        toast(`${item.icon} ${item.title} — ${item.body}`, 7500);
      },
    });
    return clean;
  }, [S, toast]);

  return (
    <div className="relative z-[2] min-h-dvh w-full max-w-full overflow-x-hidden lg:grid lg:grid-cols-[242px_minmax(0,1fr)]">
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-1.5 overflow-y-auto border-r border-gold/20 bg-deep p-4 lg:flex">
        <div className="mb-5 flex items-center gap-3 px-2">
          {S.settings.discreet ? (
            <ShieldCheck size={38} className="flex-none text-gold" strokeWidth={1.6} />
          ) : (
            <WarriorLogo size={46} glow={true} />
          )}
          <div className="font-display text-[20px] leading-[.95] tracking-[.08em] text-gold">
            {S.settings.discreet ? (
              <>
                FG
                <br />
                {t('brandMain')}
                <small className="block font-body text-[9px] font-extrabold tracking-[.3em] text-muted">
                  {t('brand1')}
                </small>
              </>
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#F5C242] to-[#B38018] font-black">
                  FORJANDO
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#E5A93C] to-[#8C5D07] font-black">
                  GUERREIROS
                </span>
                <small className="block font-body text-[8.5px] font-extrabold tracking-[.22em] text-gold/60 mt-0.5">
                  {t('brand2')}
                </small>
              </>
            )}
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map(([id, emo]) => {
            const Ic = ICONS[id];
            if (!Ic) return null;
            const lb = t(id).toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase());
            return (
              <button key={id} onClick={() => go(id)} className={`flex items-center gap-3 rounded-r border px-3.5 py-3 text-left text-sm font-bold transition-all ${tab === id ? 'border-gold/25 bg-gold/10 text-gold' : 'border-transparent text-muted hover:translate-x-[3px] hover:bg-surface hover:text-ink'}`}>
                <Ic size={17} className={tab === id ? '' : 'opacity-60'} /> {lb}
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => go('admin')}
              className={`mt-2 flex items-center gap-3 rounded-r border px-3.5 py-2.5 text-left text-xs font-black transition-all ${
                tab === 'admin'
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'border-amber-600/30 bg-amber-950/30 text-amber-400 hover:translate-x-[3px] hover:bg-amber-900/50 hover:border-amber-500'
              }`}
            >
              <Crown size={16} className="text-amber-400 flex-none" />
              <span>PAINEL DO DONO</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              AF.click();
              openModal(
                <AppTourModal
                  onClose={() => {
                    closeModal();
                    try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch (e) {}
                  }}
                />,
                'tour dialog'
              );
            }}
            className="mt-2 flex items-center gap-2.5 rounded-lg border border-line/60 bg-surface/50 px-3 py-2 text-xs font-bold text-muted hover:text-gold hover:border-gold/40 transition-colors cursor-pointer select-none"
          >
            <Compass size={15} className="text-gold flex-none" />
            <span>{lang === 'en' ? "Warrior's Manual" : lang === 'es' ? 'Manual del Guerrero' : 'Manual do Guerreiro'}</span>
          </button>
        </nav>
        <div className="mt-auto rounded-r2 border border-gold/20 bg-surface p-3.5 text-center">
          <b className="block font-display text-[34px] leading-none text-gold">{progressDays(S)}</b>
          <small className="text-[9.5px] font-extrabold tracking-[.2em] text-muted">{t('dret')}</small>
        </div>
      </aside>

      <div className="flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* topbar */}
        <header className="sticky top-0 z-30 w-full border-b border-gold/20 bg-[rgba(13,13,14,.95)] px-3.5 sm:px-4 py-2.5 backdrop-blur-md lg:px-8">
          <div className="w-full flex items-center justify-between gap-2">
            {/* Título da aba ativa (sem seletor suspenso no mobile) */}
            <div className="flex items-center gap-2 min-w-0">
              {!S.settings.discreet && (
                <WarriorLogo size={26} glow={false} className="lg:hidden shrink-0" />
              )}
              <TabIcon size={19} className="text-gold flex-none hidden lg:block" />
              <h1 className="truncate font-display text-xl sm:text-2xl tracking-[.06em] text-ink leading-tight">
                {tab === 'admin' ? 'PAINEL DO COMANDO' : t(tab)}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-none">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => go('admin')}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10.5px] sm:text-[11px] font-mono font-black transition-all cursor-pointer shadow-sm ${
                    tab === 'admin'
                      ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'border-amber-500/50 bg-amber-950/70 text-amber-300 hover:bg-amber-900/80 hover:border-amber-400'
                  }`}
                  title="Painel do Comando Supremo (Exclusivo Dono)"
                >
                  <Crown size={13} className="text-amber-400 flex-none" />
                  <span className="hidden sm:inline">COMANDO</span>
                </button>
              )}
              {commandReplies.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    AF.click();
                    handleOpenCommandReply(unreadReply || commandReplies[0]);
                  }}
                  className={`relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10.5px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer shadow-sm ${
                    unreadReply
                      ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.5)] animate-pulse'
                      : 'border-amber-600/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500'
                  }`}
                  title="Decreto do Comando Supremo (Resposta do Criador)"
                >
                  <Mail size={12} className="text-amber-400 flex-none" />
                  <span className="hidden sm:inline">DECRETO</span>
                  {unreadReply && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                  )}
                </button>
              )}
              <span className="chip flex-none text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5">{lifeLbl}</span>
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setHasUnread(false);
                  openModal(
                    <ChangelogModal
                      onClose={() => {
                        closeModal();
                        setHasUnread(false);
                        markUpdatesAsRead();
                      }}
                    />,
                    'dialog'
                  );
                }}
                className={`relative flex-none flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[10.5px] sm:text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  hasUnread
                    ? 'border-amber-400 bg-amber-950/80 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'border-amber-600/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500/60'
                }`}
                title={cx(lang, 'settings', 'fb_decrees_title') || 'Decretos da Forja (Notas da Atualização)'}
              >
                <Scroll size={12} className="text-amber-400 flex-none" />
                <span>{CURRENT_APP_VERSION}</span>
                {hasUnread && (
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded border border-amber-400/40 uppercase font-extrabold tracking-wider hidden sm:inline">
                      {lang === 'en' ? 'NEW' : lang === 'es' ? 'NUEVA' : 'NOVA'}
                    </span>
                  </span>
                )}
              </button>
              <button
                id="tour-btn-manual"
                type="button"
                onClick={() => {
                  AF.click();
                  openModal(
                    <AppTourModal
                      onClose={() => {
                        closeModal();
                        try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch (e) {}
                      }}
                    />,
                    'tour dialog'
                  );
                }}
                className="flex-none rounded-lg border border-line bg-surface2 p-1.5 sm:p-2 text-muted hover:text-gold transition-colors active:scale-95 cursor-pointer"
                title={lang === 'en' ? "Warrior's Manual (App Tour)" : lang === 'es' ? 'Manual del Guerrero (Tour de la App)' : 'Manual do Guerreiro (Tour do App)'}
                aria-label="Tour"
              >
                <Compass size={17} />
              </button>
              <button
                className="flex-none rounded-lg border border-line bg-surface2 p-1.5 sm:p-2 text-muted hover:text-gold transition-colors active:scale-95 cursor-pointer"
                onClick={() => go('settings')}
                aria-label={t('adj')}
                title={t('settings')}
              >
                <Settings size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="w-full min-w-0 flex-1 px-3 sm:px-4 pb-32 pt-2.5 sm:pt-3 lg:px-8 lg:pb-16 overflow-x-hidden">
          <ErrorBoundary key={tab}>
            <View />
          </ErrorBoundary>
        </main>
      </div>

      {/* Menu de abas fixo inferior no mobile ao rolar a tela */}
      <nav
        id="tour-bottom-nav"
        aria-label="Navegação móvel"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-[rgba(13,13,14,0.96)] backdrop-blur-xl lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.85)]"
        style={{
          paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        {mobileMoreOpen && (
          <div className="absolute bottom-full right-2 mb-2 w-52 overflow-hidden rounded-xl border border-[#4a3822] bg-[rgba(18,15,12,.98)] p-1.5 shadow-[0_-8px_32px_rgba(0,0,0,.85)]">
            {['stats', 'enemy', 'settings'].map((id) => {
              const Ic = ICONS[id];
              return (
                <button key={id} type="button" onClick={() => { setMobileMoreOpen(false); go(id); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold text-muted transition-colors hover:bg-gold/10 hover:text-gold">
                  <Ic size={18} /> {t(id)}
                </button>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-5 w-full px-2 py-1.5 gap-1 max-w-lg mx-auto">
          {MOBILE_TABS.map((id) => {
            const Ic = ICONS[id];
            const active = tab === id;
            const navLabel = t(`nav_${id}`) || t(id);
            return (
              <button key={id} onClick={() => { setMobileMoreOpen(false); go(id); }} type="button" aria-label={t(id)} className={`flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-1.5 transition-all select-none ${active ? 'text-gold' : 'text-muted hover:text-ink'}`}>
                <div className={`grid h-8 w-8 place-items-center rounded-lg transition-all ${active ? 'border border-gold/25 bg-gold/10 text-gold shadow-[inset_0_0_10px_rgba(229,169,60,.08)]' : ''}`}>
                  <Ic size={19} strokeWidth={active ? 2.3 : 1.7} />
                </div>
                <span className={`mt-0.5 w-full truncate text-center text-[9.5px] font-extrabold uppercase leading-tight ${active ? 'text-gold' : 'text-muted/75'}`}>{navLabel}</span>
              </button>
            );
          })}
          <button type="button" onClick={() => setMobileMoreOpen((v) => !v)} aria-label={MOBILE_MORE_I18N[lang] || MOBILE_MORE_I18N.pt} className={`flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-1.5 transition-all select-none ${['stats','enemy','settings'].includes(tab) || mobileMoreOpen ? 'text-gold' : 'text-muted'}`}>
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${['stats','enemy','settings'].includes(tab) || mobileMoreOpen ? 'border border-gold/25 bg-gold/10' : ''}`}><MoreHorizontal size={20} /></div>
            <span className="mt-0.5 text-[9.5px] font-extrabold uppercase leading-tight">{MOBILE_MORE_I18N[lang] || MOBILE_MORE_I18N.pt}</span>
          </button>
        </div>
      </nav>

      {/* fab S.O.S com insets seguros posicionado acima da barra inferior no mobile */}
      <button
        id="fab"
        onClick={openSOS}
        className="fixed z-40 grid h-13 w-13 sm:h-16 sm:w-16 place-items-center rounded-full border-none bg-[radial-gradient(circle_at_32%_26%,#FF6A5E,#D52020_72%)] text-white shadow-[0_10px_30px_rgba(213,32,32,.5)] transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8"
        style={{
          right: 'calc(1rem + env(safe-area-inset-right, 0px))',
          bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))',
        }}
        aria-label="S.O.S"
      >
        <span className="absolute -inset-[6px] rounded-full border-2 border-danger/55" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
        <Siren size={22} />
        <span className="absolute -bottom-0.5 font-display text-[9px] tracking-widest">S.O.S</span>
      </button>
    </div>
  );
}
