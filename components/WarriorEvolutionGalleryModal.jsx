'use client';
import React, { useState } from 'react';
import { ShieldCheck, Award, Flame, X, Sparkles, ChevronRight, Lock, CheckCircle2, Play } from 'lucide-react';
import { AF } from '@/lib/audio';

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
                      <span className="text-[9px] font-mono text-muted">{t.min}+ dias</span>
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
                {isUnlocked ? `✓ ${TXT.unlocked[curLang]}` : `🔒 ${TXT.locked[curLang]} (${selectedTier.min}+ DIAS)`}
              </span>

              <span className="text-[9.5px] sm:text-[10px] font-mono text-muted">
                Nível {selectedIdx + 1} de {tiers.length}
              </span>
            </div>

            {/* Guerreiro */}
            <div className="relative z-10 my-2 flex flex-col items-center justify-center">
              <img
                src={selectedTier.image || '/escudeiro.png'}
                alt={selectedTier.name}
                className="h-[170px] sm:h-[200px] w-auto max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(245,158,11,0.3)] anim-warrior-breathe select-none pointer-events-none"
              />
              <div className="relative z-20 -mt-2 w-full max-w-[220px]">
                <div className="h-5 rounded-t bg-gradient-to-r from-[#2a1b0d] via-[#472d15] to-[#2a1b0d] border-t border-x border-amber-600/60 shadow flex items-center justify-center px-2">
                  <span className="text-[9px] font-mono font-black uppercase text-amber-200 truncate">
                    ⚔️ {selectedTier.name}
                  </span>
                </div>
              </div>
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

              {/* Botão de Testar a Celebração de Subida de Nível */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
