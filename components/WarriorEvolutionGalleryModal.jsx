'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Award, Flame, X, Sparkles, ChevronRight, Lock, CheckCircle2, Play } from 'lucide-react';
import { AF } from '@/lib/audio';

const Warrior3DCanvas = dynamic(() => import('@/components/Warrior3DCanvas'), {
  ssr: false,
  loading: () => <div className="h-[210px] w-full flex items-center justify-center text-amber-400 font-mono text-xs">Carregando 3D...</div>,
});

export default function WarriorEvolutionGalleryModal({ tiers, currentTier, currentDays, lang = 'pt', onClose, onTestLevelUp }) {
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const [selectedIdx, setSelectedIdx] = useState(() => {
    const idx = tiers.findIndex((t) => t.min === currentTier.min);
    return idx >= 0 ? idx : 0;
  });

  const selectedTier = tiers[selectedIdx] || tiers[0];
  const isUnlocked = currentDays >= selectedTier.min;

  const TXT = {
    title: {
      pt: 'EVOLUÇÃO DAS 11 ARMADURAS MEDIEVAIS',
      en: 'EVOLUTION OF THE 11 MEDIEVAL ARMORS',
      es: 'EVOLUCIÓN DE LAS 11 ARMADURAS MEDIEVALES',
    },
    subtitle: {
      pt: 'A cada marco de retenção, seu guerreiro ganha novas proteções e títulos sagrados.',
      en: 'At each retention milestone, your warrior gains new protections and sacred titles.',
      es: 'En cada hito de retención, tu guerrero gana nuevas protecciones y títulos sagrados.',
    },
    unlocked: {
      pt: 'PATENTE DESBLOQUEADA',
      en: 'UNLOCKED RANK',
      es: 'RANGO DESBLOQUEADO',
    },
    locked: {
      pt: 'BLOQUEADO',
      en: 'LOCKED',
      es: 'BLOQUEADO',
    },
    reward: {
      pt: 'RECOMPENSA FORJADA',
      en: 'FORGED REWARD',
      es: 'RECOMPENSA FORJADA',
    },
    testBtn: {
      pt: 'ASSISTIR ANIMAÇÃO DE NÍVEL ⚡',
      en: 'WATCH LEVEL UP ANIMATION ⚡',
      es: 'VER ANIMACIÓN DE NIVEL ⚡',
    },
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative z-20 w-full max-w-2xl rounded-2xl bg-gradient-to-b from-[#1c140d] via-[#120d09] to-[#0a0705] border-2 border-amber-600/70 shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden p-3 sm:p-5 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/40 relative z-10 flex-none">
          <div className="flex flex-col text-left">
            <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-wider text-gold flex items-center gap-1.5">
              <span>⚔️</span>
              <span>{TXT.title[curLang]}</span>
            </h3>
            <p className="text-[10px] sm:text-xs text-muted font-sans mt-0.5">
              {TXT.subtitle[curLang]}
            </p>
          </div>
          <button
            onClick={() => {
              AF.click();
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/50 border border-amber-500/30 text-amber-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo: Lista Horizontal de Patentes + Visualizador Central */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 my-3 flex-1 min-h-0 overflow-y-auto">
          {/* Seletor Lateral/Superior dos 11 Níveis */}
          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto max-h-[140px] md:max-h-[380px] w-full md:w-56 flex-none pr-1">
            {tiers.map((t, idx) => {
              const unlocked = currentDays >= t.min;
              const isSel = idx === selectedIdx;
              return (
                <button
                  key={t.min}
                  onClick={() => {
                    AF.click();
                    setSelectedIdx(idx);
                  }}
                  className={`flex items-center justify-between gap-1.5 p-2 rounded-lg text-left text-xs transition-all flex-shrink-0 md:flex-shrink ${
                    isSel
                      ? 'bg-gradient-to-r from-amber-600/30 to-amber-500/20 border border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : unlocked
                      ? 'bg-surface2/80 border border-line/60 text-[#EDE5D5] hover:border-amber-500/40'
                      : 'bg-black/40 border border-line/30 text-muted/60 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm">{t.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[11px] truncate leading-tight">{t.name}</span>
                      <span className="text-[9px] font-mono text-muted">{t.min}+ {curLang === 'en' ? 'days' : curLang === 'es' ? 'días' : 'dias'}</span>
                    </div>
                  </div>
                  {unlocked ? (
                    <CheckCircle2 size={12} className="text-ok flex-none ml-1" />
                  ) : (
                    <Lock size={12} className="text-muted/50 flex-none ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Área de Visualização da Armadura Selecionada */}
          <div className="flex-1 rounded-xl bg-gradient-to-b from-[#140f0c] via-[#0d0907] to-[#080605] border border-amber-900/50 p-3 sm:p-4 flex flex-col justify-between items-center text-center relative overflow-hidden">
            {/* Brilho da Forja */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.22)_0%,transparent_70%)] anim-torch-glow" />

            {/* Topo do Card */}
            <div className="relative z-10 w-full flex items-center justify-between gap-1 pb-1">
              <span className={`text-[9.5px] sm:text-[10.5px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                isUnlocked
                  ? 'border-ok/60 bg-ok/10 text-ok'
                  : 'border-amber-600/40 bg-amber-950/20 text-amber-400'
              }`}>
                {isUnlocked ? `✓ ${TXT.unlocked[curLang]}` : `🔒 ${TXT.locked[curLang]} (${selectedTier.min}+ ${curLang === 'en' ? 'DAYS' : curLang === 'es' ? 'DÍAS' : 'DIAS'})`}
              </span>

              <span className="text-[9.5px] sm:text-[10px] font-mono text-muted">
                {curLang === 'en' ? `Level ${selectedIdx + 1} of ${tiers.length}` : curLang === 'es' ? `Nivel ${selectedIdx + 1} de ${tiers.length}` : `Nível ${selectedIdx + 1} de ${tiers.length}`}
              </span>
            </div>

            {/* Guerreiro 3D ou Forja Trancada */}
            <div className="relative z-10 my-2 w-full flex flex-col items-center justify-center min-h-[210px]">
              {isUnlocked ? (
                <Warrior3DCanvas
                  tier={selectedTier}
                  days={selectedTier.min}
                  height={210}
                  curLang={curLang}
                  interactive={true}
                  autoRotate={true}
                />
              ) : (
                <div className="h-[210px] w-full rounded-xl bg-gradient-to-b from-[#18110a] to-[#0a0704] border-2 border-dashed border-amber-900/60 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-2xl text-amber-400 mb-2 shadow-inner">
                    🔒
                  </div>
                  <span className="font-display font-black text-sm text-amber-400 tracking-wider">
                    {curLang === 'en' ? 'SACRED FORGE LOCKED' : curLang === 'es' ? 'FORJA SAGRADA BLOQUEADA' : 'FORJA SAGRADA TRANCADA'}
                  </span>
                  <span className="text-[10px] font-mono text-amber-200/70 mt-1 max-w-xs">
                    {curLang === 'en'
                      ? `${selectedTier.min - currentDays} days of clean retention remaining to temper this armor.`
                      : curLang === 'es'
                      ? `Faltan ${selectedTier.min - currentDays} días de retención limpia para templar esta armadura.`
                      : `Faltam ${selectedTier.min - currentDays} dias de retenção limpa para temperar esta armadura.`}
                  </span>
                </div>
              )}
            </div>

            {/* Informações da Patente */}
            <div className="relative z-10 w-full mt-1">
              <h4 className="text-base sm:text-lg font-display font-black text-gold">
                {selectedTier.icon} {selectedTier.name}
              </h4>
              <p className="text-[11px] font-mono text-amber-200/80 mb-2">
                {selectedTier.subtitle || ''}
              </p>

              {/* Recompensa */}
              {selectedTier.reward && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-2 text-left mb-3">
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block">
                    🎁 {TXT.reward[curLang]}:
                  </span>
                  <span className="text-xs font-bold text-[#FFF2CC] block">
                    {selectedTier.reward}
                  </span>
                </div>
              )}

              {/* Botão de Testar a Celebração de Subida de Nível (Desbloqueado vs Bloqueado) */}
              {isUnlocked ? (
                <button
                  onClick={() => {
                    AF.seal();
                    onTestLevelUp(selectedTier);
                  }}
                  className="w-full py-2.5 rounded-lg font-display font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-gold via-gold2 to-gold hover:brightness-110 border border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <Play size={13} fill="currentColor" />
                  <span>{TXT.testBtn[curLang]}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded-lg font-display font-bold text-xs uppercase tracking-wider text-amber-400/50 bg-amber-950/30 border border-amber-900/40 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                >
                  <Lock size={13} />
                  <span>
                    {curLang === 'en'
                      ? `LOCKED · REACH ${selectedTier.min} DAYS`
                      : curLang === 'es'
                      ? `BLOQUEADO · ALCANZA ${selectedTier.min} DÍAS`
                      : `BLOQUEADO · ALCANCE ${selectedTier.min} DIAS`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
