'use client';
import React from 'react';
import { Castle, Hammer, Target, BookOpen, ChartNoAxesColumn, Skull, Settings, Siren, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { TABS, LIFE_STATUS } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { lifeMode, progressDays, allH } from '@/lib/logic';
import { ensureSw, scheduleLocalTimers } from '@/lib/notify';
import { AF } from '@/lib/audio';
import SosModal from './SosModal';
import QgView from './views/QgView';
import ForgeView from './views/ForgeView';
import OpsView from './views/OpsView';
import JournalView from './views/JournalView';
import StatsView from './views/StatsView';
import EnemyView from './views/EnemyView';
import SettingsView from './views/SettingsView';

const ICONS = { qg: Castle, forge: Hammer, ops: Target, journal: BookOpen, stats: ChartNoAxesColumn, enemy: Skull, settings: Settings };
const VIEWS = { qg: QgView, forge: ForgeView, ops: OpsView, journal: JournalView, stats: StatsView, enemy: EnemyView, settings: SettingsView };

export default function Shell() {
  const { S, tab, setTab, t, openModal, update } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const lifeLbl = (() => { const m = lifeMode(S); const LS = cx(lang, 'life', m) || LIFE_STATUS[m] || LIFE_STATUS.single; return LS.label; })();
  const go = (id) => { AF.click(); setTab(id); window.scrollTo({ top: 0 }); }
  const openSOS = () => { update((d) => { d.sos = (d.sos || 0) + 1; }); openModal(<SosModal />, 'full'); };
  const View = VIEWS[tab] || QgView;
  const TabIcon = ICONS[tab] || Castle;

  /* PWA: registra o service worker + agenda lembretes locais (hábitos ⏰ e check-in 20h) */
  React.useEffect(() => {
    ensureSw();
    const clean = scheduleLocalTimers(S, allH(S), true);
    return clean;
  }, [S]);

  return (
    <div className="relative z-[2] min-h-dvh w-full max-w-full overflow-x-hidden lg:grid lg:grid-cols-[242px_minmax(0,1fr)]">
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-1.5 overflow-y-auto border-r border-gold/20 bg-deep p-4 lg:flex">
        <div className="mb-5 flex items-center gap-2.5 px-2">
          <ShieldCheck size={40} className="flex-none text-gold" strokeWidth={1.6} />
          <div className="font-display text-[21px] leading-[.95] tracking-[.08em] text-gold">
            {S.settings.discreet ? <>FG<br />{t('brandMain')}<small className="block font-body text-[9px] font-extrabold tracking-[.3em] text-muted">{t('brand1')}</small></> : <>FORJANDO<br />GUERREIROS<small className="block font-body text-[9px] font-extrabold tracking-[.3em] text-muted">{t('brand2')}</small></>}
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
              <TabIcon size={20} className="text-gold flex-none" />
              <h1 className="truncate font-display text-xl sm:text-2xl tracking-[.06em] text-ink leading-tight">
                {t(tab)}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-none">
              <span className="chip flex-none text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5">{lifeLbl}</span>
              <button
                className="flex-none rounded-lg border border-line bg-surface2 p-1.5 sm:p-2 text-muted hover:text-gold transition-colors active:scale-95"
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
          <View key={tab} />
        </main>
      </div>

      {/* Menu de abas fixo inferior no mobile ao rolar a tela */}
      <nav
        aria-label="Navegação móvel"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/20 bg-[rgba(13,13,14,0.96)] backdrop-blur-xl lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.85)]"
        style={{
          paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="grid grid-cols-7 w-full px-1 py-1.5 gap-0.5 max-w-lg mx-auto">
          {TABS.map(([id]) => {
            const Ic = ICONS[id];
            if (!Ic) return null;
            const active = tab === id;
            const navLabel = t(`nav_${id}`) || t(id);
            return (
              <button
                key={id}
                onClick={() => go(id)}
                type="button"
                aria-label={t(id)}
                className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all min-w-0 select-none ${
                  active ? 'text-gold' : 'text-muted hover:text-ink'
                }`}
              >
                <div
                  className={`grid h-7 w-7 place-items-center rounded-md transition-all ${
                    active ? 'bg-gold/20 text-gold shadow-sm' : ''
                  }`}
                >
                  <Ic size={18} strokeWidth={active ? 2.3 : 1.7} />
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase tracking-tight truncate w-full text-center leading-tight mt-0.5 ${
                    active ? 'text-gold' : 'text-muted/75'
                  }`}
                >
                  {navLabel}
                </span>
              </button>
            );
          })}
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
