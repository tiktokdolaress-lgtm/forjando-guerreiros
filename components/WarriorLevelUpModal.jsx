'use client';
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ShieldCheck, Award, Flame, X, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { AF } from '@/lib/audio';

const Warrior3DCanvas = dynamic(() => import('@/components/Warrior3DCanvas'), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full flex items-center justify-center text-amber-400 font-mono text-xs">Carregando 3D...</div>,
});

export default function WarriorLevelUpModal({ tier, currentDays, lang = 'pt', onClose }) {
  const canvasRef = useRef(null);
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';

  const TXT = {
    title: {
      pt: 'NOVA PATENTE CONQUISTADA!',
      en: 'NEW RANK CONQUERED!',
      es: '¡NUEVO RANGO CONQUISTADO!',
    },
    subtitle: {
      pt: 'O Fogo da Forja Moldou seu Caráter',
      en: 'The Forge Fire Shaped Your Character',
      es: 'El Fuego de la Forja Moldeó tu Carácter',
    },
    days: {
      pt: `Alcançado no Dia ${currentDays}`,
      en: `Achieved on Day ${currentDays}`,
      es: `Alcanzado en el Día ${currentDays}`,
    },
    reward: {
      pt: 'RECOMPENSA DE GUERRA DESBLOQUEADA',
      en: 'UNLOCKED WAR REWARD',
      es: 'RECOMPENSA DE GUERRA DESBLOQUEADA',
    },
    perks: {
      pt: 'TRANSFORMAÇÕES ATIVAS NO SEU CORPO & MENTE',
      en: 'ACTIVE TRANSFORMATIONS IN BODY & MIND',
      es: 'TRANSFORMACIONES ACTIVAS EN TU CUERPO Y MENTE',
    },
    btn: {
      pt: 'HONRAR MINHA EVOLUÇÃO ⚔️',
      en: 'HONOR MY EVOLUTION ⚔️',
      es: 'HONRAR MI EVOLUCIÓN ⚔️',
    },
  };

  useEffect(() => {
    /* Efeito sonoro triunfal da forja */
    try {
      AF.seal();
      setTimeout(() => {
        AF.victory(tier && tier.min >= 90);
      }, 250);
    } catch (e) {}

    /* Partículas de brasa e confete de ouro no canvas */
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const colors = ['#f59e0b', '#fbbf24', '#f97316', '#ffffff', '#eab308', '#ffd700'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: width / 2,
        y: height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.75) * 16,
        size: Math.random() * 4.5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 70 + 50,
        spin: (Math.random() - 0.5) * 0.2,
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravidade
        p.vx *= 0.985;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (particles.some((p) => p.alpha > 0)) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tier]);

  if (!tier) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Canvas de explosão de faíscas da forja */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full z-10"
      />

      {/* Container Principal com Tremor de Forja inicial */}
      <div className="relative z-20 w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#1c140d] via-[#120d09] to-[#0a0705] border-2 border-amber-500/80 shadow-[0_0_60px_rgba(245,158,11,0.45)] overflow-hidden anim-level-up-rumble p-4 sm:p-6 text-center my-auto">
        {/* Feixe de Luz Divina / Tocha incandescente no topo */}
        <div className="pointer-events-none absolute left-1/2 -top-24 -translate-x-1/2 h-48 w-80 rounded-full bg-[radial-gradient(ellipse,rgba(251,191,36,0.45)_0%,rgba(245,158,11,0.15)_50%,transparent_80%)]" />

        {/* Botão de Fechar */}
        <button
          onClick={() => {
            AF.click();
            onClose();
          }}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 border border-amber-500/40 text-amber-300/80 hover:text-amber-100 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Badge de Nova Patente */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-500/40 to-amber-600/30 border border-amber-400/80 text-amber-200 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.5)] mb-2">
          <Sparkles size={13} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{TXT.title[curLang]}</span>
          <Sparkles size={13} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Nome da Patente & Ícone */}
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#FFD25A] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(245,158,11,0.8)] leading-tight">
          {tier.icon} {tier.name}
        </h2>

        <p className="text-xs sm:text-sm font-mono text-amber-200/90 tracking-wider uppercase mt-0.5">
          {tier.subtitle || TXT.subtitle[curLang]} · {TXT.days[curLang]}
        </p>

        {/* O GUERREIRO 3D EM VITÓRIA (COM ILUMINAÇÃO DE EVOLUÇÃO E PEDESTAL) */}
        <div className="relative my-3 flex flex-col items-center justify-center min-h-[260px] overflow-hidden rounded-xl bg-gradient-to-b from-[#1a110a] via-[#0e0a07] to-[#070504] border border-amber-500/60 p-2 shadow-inner">
          <Warrior3DCanvas
            tier={tier}
            days={currentDays}
            height={260}
            curLang={curLang}
            interactive={true}
            autoRotate={true}
          />
        </div>

        {/* Bloco de Recompensa Forjada */}
        {tier.reward && (
          <div className="rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 p-2.5 sm:p-3 mb-3 text-left">
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider mb-1">
              <Award size={14} className="text-amber-400 flex-none" />
              <span>{TXT.reward[curLang]}</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#FFF4D0] flex items-center gap-1.5">
              <span>🎁</span>
              <span>{tier.reward}</span>
            </div>
          </div>
        )}

        {/* Botão de Confirmação e Honra */}
        <button
          onClick={() => {
            AF.seal();
            onClose();
          }}
          className="w-full py-3 sm:py-3.5 rounded-xl font-display font-black text-sm sm:text-base uppercase tracking-wider text-black bg-gradient-to-r from-[#FFDF70] via-[#FFB703] to-[#E59800] hover:from-[#FFE890] hover:to-[#FFB703] border-2 border-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.6)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>{TXT.btn[curLang]}</span>
        </button>
      </div>
    </div>
  );
}
