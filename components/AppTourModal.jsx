'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Flame, 
  Zap, 
  Siren, 
  Target,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';

export const TOUR_STORAGE_KEY = 'fg_tour_seen_v1';

export const TOUR_STEPS = [
  {
    id: 'qg_towers',
    tab: 'qg',
    selector: '#tour-qg-towers',
    fallbackSelector: '#tour-bottom-nav',
    icon: '🏰',
    arrowLabel: {
      pt: 'AQUI ESTÃO SUAS 3 TORRES 👆',
      en: 'HERE ARE YOUR 3 TOWERS 👆',
      es: 'AQUÍ ESTÁN TUS 3 TORRES 👆',
    },
    badge: {
      pt: '1 DE 5 · O CORAÇÃO DO SISTEMA',
      en: '1 OF 5 · THE CORE OF THE SYSTEM',
      es: '1 DE 5 · EL CORAZÓN DEL SISTEMA',
    },
    title: {
      pt: 'Quartel General & As 3 Torres 3D',
      en: 'Headquarters & The 3 3D Towers',
      es: 'Cuartel General y las 3 Torres 3D',
    },
    desc: {
      pt: 'Aqui você vence cada 24 horas. Estas 3 Torres 3D acompanham em tempo real sua Retenção Seminal, Zero Pornografia e Zero Masturbação com cronômetro de precisão.',
      en: 'Here you conquer each 24-hour cycle. These 3 3D Towers monitor your Semen Retention, Zero Pornography, and Zero Masturbation in real time with high precision.',
      es: 'Aquí vences cada ciclo de 24 horas. Estas 3 Torres 3D monitorean tu Retención Seminal, Cero Pornografía y Cero Masturbación en tiempo real con cronómetro de precisión.',
    },
    tip: {
      pt: 'Toque nas torres ou na Batalha Diária todo fim de tarde para registrar sua vitória e subir de armadura.',
      en: 'Tap the towers or the Daily Battle every evening to seal your victory and level up your armor.',
      es: 'Toca las torres o la Batalla Diaria cada atardecer para registrar tu victoria y subir de armadura.',
    },
  },
  {
    id: 'forge_habits',
    tab: 'forge',
    selector: '#tour-forge-habits',
    fallbackSelector: '#tour-bottom-nav',
    icon: '🔨',
    arrowLabel: {
      pt: 'FORJA DE HÁBITOS & SLOTS 👆',
      en: 'HABIT FORGE & SLOTS 👆',
      es: 'FORJA DE HÁBITOS Y SLOTS 👆',
    },
    badge: {
      pt: '2 DE 5 · CONSTRUÇÃO DE DISCIPLINA',
      en: '2 OF 5 · DISCIPLINE BUILDING',
      es: '2 OF 5 · CONSTRUCCIÓN DE DISCIPLINA',
    },
    title: {
      pt: 'A Forja & Slots de Hábitos',
      en: 'The Forge & Habit Slots',
      es: 'La Forja y Slots de Hábitos',
    },
    desc: {
      pt: 'Construa novos hábitos viris para canalizar sua energia. O sistema libera slots controlados conforme sua patente aumenta para evitar sobrecarga.',
      en: 'Forge new masculine habits to transmute your energy. The system unlocks controlled slots as your rank rises to prevent burnout.',
      es: 'Construye nuevos hábitos viriles para canalizar tu energía. El sistema desbloquea ranuras controladas según sube tu rango para evitar sobrecargas.',
    },
    tip: {
      pt: 'Marque feito (✓) ou falhou (✕) diariamente. O app dispara Alertas de Negligência se você abandonar hábitos ativos.',
      en: 'Mark done (✓) or failed (✕) daily. The app triggers Neglect Alerts if you abandon active habits.',
      es: 'Marca cumplido (✓) o fallado (✕) a diario. La app activa Alertas de Negligencia si abandonas hábitos activos.',
    },
  },
  {
    id: 'ops_tasks',
    tab: 'ops',
    selector: '#tour-ops-tasks',
    fallbackSelector: '#tour-bottom-nav',
    icon: '⚔️',
    arrowLabel: {
      pt: 'OPERAÇÕES & MISSÕES 👆',
      en: 'OPERATIONS & MISSIONS 👆',
      es: 'OPERACIONES Y MISIONES 👆',
    },
    badge: {
      pt: '3 DE 5 · AÇÃO NO MUNDO REAL',
      en: '3 OF 5 · REAL-WORLD ACTION',
      es: '3 OF 5 · ACCIÓN EN EL MUNDO REAL',
    },
    title: {
      pt: 'Operações & Projetos Estratégicos',
      en: 'Operations & Strategic Projects',
      es: 'Operaciones y Proyectos Estratégicos',
    },
    desc: {
      pt: 'Homens sem missão caem em tentação. Na aba Operações você cria tarefas diárias priorizadas e organiza projetos de 30 a 90 dias com os 6 modelos prontos.',
      en: 'Men without a mission fall into temptation. In the Operations tab you create prioritized daily tasks and organize 30 to 90-day projects with 6 ready templates.',
      es: 'Los hombres sin misión caen en tentación. En Operaciones creas tareas diarias priorizadas y organizas proyectos de 30 a 90 días con 6 plantillas listas.',
    },
    tip: {
      pt: 'Defina suas missões na noite anterior e use "Adiar com Honra" se houver imprevistos sem perder o controle.',
      en: 'Set your missions the night before and use "Postpone with Honor" when unexpected events occur without losing control.',
      es: 'Define tus misiones la noche anterior y usa "Posponer con Honor" si ocurren imprevistos sin perder el control.',
    },
  },
  {
    id: 'sos_fab',
    tab: null, // Mantém na aba atual e foca no FAB flutuante
    selector: '#fab',
    fallbackSelector: '#fab',
    icon: '🚨',
    arrowLabel: {
      pt: 'SEU BOTÃO DE RESGATE S.O.S 👇',
      en: 'YOUR S.O.S RESCUE BUTTON 👇',
      es: 'TU BOTÓN DE RESCATE S.O.S 👇',
    },
    badge: {
      pt: '4 DE 5 · BLINDAGEM DE EMERGÊNCIA',
      en: '4 OF 5 · EMERGENCY SHIELD',
      es: '4 OF 5 · BLINDAJE DE EMERGENCIA',
    },
    title: {
      pt: 'Botão Flutuante S.O.S de Pânico',
      en: 'Floating Red S.O.S Button',
      es: 'Botón Flotante Rojo S.O.S de Pánico',
    },
    desc: {
      pt: 'Em qualquer lugar do app, este botão vermelho estará sempre à mão. Se a fissura ou tentação apertar, aperte-o sem hesitar para cortar o pico de dopamina imediatamente.',
      en: 'Anywhere in the app, this red button remains pinned within reach. When urge or temptation strikes, tap it without hesitation to kill the dopamine spike immediately.',
      es: 'En cualquier parte de la app, este botón rojo estará siempre a tu alcance. Cuando la tentación apriete, tócalo sin dudar para cortar el pico de dopamina de inmediato.',
    },
    tip: {
      pt: 'Vencer uma fissura de 5 minutos preserva meses de honra. O S.O.S ativa respiração tática 4-4-4-4 e frequências sonoras.',
      en: 'Conquering a 5-minute urge preserves months of honor. S.O.S triggers 4-4-4-4 box breathing and acoustic tones.',
      es: 'Vencer una urgencia de 5 minutos preserva meses de honor. El S.O.S activa respiración táctica 4-4-4-4 y tonos sonoros.',
    },
  },
  {
    id: 'manual_access',
    tab: null,
    selector: '#tour-btn-manual',
    fallbackSelector: '#tour-bottom-nav',
    icon: '🧭',
    arrowLabel: {
      pt: 'REVEJA O TOUR AQUI A QUALQUER HORA 👆',
      en: 'REVIEW TOUR HERE AT ANY TIME 👆',
      es: 'REVISA EL TOUR AQUÍ EN CUALQUIER MOMENTO 👆',
    },
    badge: {
      pt: '5 DE 5 · MANUAL TÁTICO SEMPRE À MÃO',
      en: '5 OF 5 · TACTICAL MANUAL ALWAYS READY',
      es: '5 OF 5 · MANUAL TÁCTICO SIEMPRE A MANO',
    },
    title: {
      pt: 'Pronto para a Batalha!',
      en: 'Ready for Battle!',
      es: '¡Listo para la Batalla!',
    },
    desc: {
      pt: 'Você pode rever este tour interativo com as setas a qualquer momento tocando na bússola no topo do app ou na aba Ajustes. O Comando está com você.',
      en: 'You can review this interactive tour with the arrows at any time by tapping the compass in the header or in the Settings tab. Command is with you.',
      es: 'Puedes revisar este tour interactivo con las flechas en cualquier momento tocando la brújula arriba o en Ajustes. El Comando está contigo.',
    },
    tip: {
      pt: 'A disciplina supera o talento. Entre no QG, sele seus 3 pilares e vença o dia de hoje!',
      en: 'Discipline beats talent. Enter HQ, seal your 3 pillars, and conquer today!',
      es: 'La disciplina supera al talento. ¡Entra al QG, sella tus 3 pilares y vence el día de hoy!',
    },
  },
];

export const TOUR_I18N = {
  skipBtn: { pt: 'Pular Tour', en: 'Skip Tour', es: 'Saltar Tour' },
  prevBtn: { pt: 'Anterior', en: 'Previous', es: 'Anterior' },
  nextBtn: { pt: 'Próximo', en: 'Next', es: 'Siguiente' },
  finishBtn: { pt: 'COMEÇAR A BATALHA', en: 'ENTER THE BATTLE', es: 'COMENZAR LA BATALLA' },
  tipPrefix: { pt: 'DIRETRIZ DE COMBATE', en: 'COMBAT DIRECTIVE', es: 'DIRECTRIZ DE COMBATE' },
};

export default function AppTourModal({ onClose }) {
  const { S, tab, setTab } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const l = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = TOUR_I18N;
  const steps = TOUR_STEPS;

  const [stepIdx, setStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [placement, setPlacement] = useState('bottom'); // 'bottom' | 'top' | 'center'
  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === steps.length - 1;

  // Atualiza a posição do spotlight e da setinha
  const updateTargetPosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    let el = document.querySelector(step.selector);
    if (!el && step.fallbackSelector) {
      el = document.querySelector(step.fallbackSelector);
    }

    if (el) {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}

      const rect = el.getBoundingClientRect();
      const padding = 8;
      const spotRect = {
        top: Math.max(0, rect.top - padding),
        left: Math.max(0, rect.left - padding),
        width: Math.min(window.innerWidth, rect.width + padding * 2),
        height: rect.height + padding * 2,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        rawTop: rect.top,
        rawBottom: rect.bottom,
      };

      setTargetRect(spotRect);

      // Decide se o card e a setinha ficam acima ou abaixo do elemento
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= 300) {
        setPlacement('bottom'); // Card embaixo, setinha aponta para CIMA (▲)
      } else if (spaceAbove >= 280) {
        setPlacement('top');    // Card em cima, setinha aponta para BAIXO (▼)
      } else {
        setPlacement('center'); // Centralizado se não houver espaço seguro
      }
    } else {
      setTargetRect(null);
      setPlacement('center');
    }
  }, [step]);

  // Troca de aba quando a etapa exige e atualiza posição após renderização
  useEffect(() => {
    if (step.tab && tab !== step.tab) {
      setTab(step.tab);
    }

    const timer1 = setTimeout(updateTargetPosition, 180);
    const timer2 = setTimeout(updateTargetPosition, 450);

    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition, true);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition, true);
    };
  }, [stepIdx, step, tab, setTab, updateTargetPosition]);

  const handleFinish = () => {
    try { AF.seal(); } catch (e) {}
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      }
    } catch (e) {}
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleNext = () => {
    try { AF.click(); } catch (e) {}
    if (isLast) {
      handleFinish();
    } else {
      setStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    try { AF.click(); } catch (e) {}
    if (!isFirst) {
      setStepIdx((prev) => prev - 1);
    }
  };

  const handleJump = (idx) => {
    try { AF.click(); } catch (e) {}
    setStepIdx(idx);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center overflow-hidden select-none">
      {/* 1. MÁSCARA ESCURA COM RECORTE / SPOTLIGHT ILUMINADO SOBRE O ELEMENTO */}
      {targetRect ? (
        <div 
          className="fixed pointer-events-none transition-all duration-300 rounded-xl"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            boxShadow: '0 0 0 9999px rgba(8, 8, 10, 0.82), 0 0 25px rgba(245, 158, 11, 0.7)',
            border: '2px solid rgba(245, 158, 11, 0.9)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[2px] pointer-events-none" />
      )}

      {/* 2. CARD DO TOUR POSICIONADO COM A SETINHA APONTANDO PARA O ELEMENTO */}
      <div 
        className="fixed z-50 w-[94vw] max-w-lg transition-all duration-300"
        style={
          targetRect && placement === 'bottom'
            ? {
                top: Math.min(window.innerHeight - 380, targetRect.top + targetRect.height + 16),
                left: '50%',
                transform: 'translateX(-50%)',
              }
            : targetRect && placement === 'top'
            ? {
                bottom: Math.min(window.innerHeight - 100, (window.innerHeight - targetRect.top) + 16),
                left: '50%',
                transform: 'translateX(-50%)',
              }
            : {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }
        }
      >
        {/* SETINHA APONTANDO PARA CIMA (Quando o card está embaixo do elemento) */}
        {targetRect && placement === 'bottom' && (
          <div className="flex flex-col items-center -mb-1 animate-bounce">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-[#141414] font-mono text-[10px] sm:text-xs font-black tracking-wider shadow-lg border border-white/20">
              <span>{step.arrowLabel[l]}</span>
            </div>
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-gold drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]" />
          </div>
        )}

        {/* CORPO PRINCIPAL DO CARD */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#090604] border-2 border-gold/60 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-ink overflow-hidden">
          {/* Brilho Superior Dourado */}
          <div className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 h-20 w-64 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.25)_0%,transparent_75%)]" />

          {/* CABEÇALHO */}
          <div className="relative z-10 flex items-start justify-between gap-3 pb-2.5 border-b border-gold/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl sm:text-3xl flex-none" role="img">{step.icon}</span>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-gold font-extrabold uppercase tracking-wider block truncate">
                  {step.badge[l]}
                </span>
                <h3 className="font-display text-sm sm:text-base font-bold text-ink leading-tight truncate">
                  {step.title[l]}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="flex-none flex items-center gap-1 px-2 py-0.5 rounded-lg border border-line bg-surface2 text-muted hover:text-gold hover:border-gold/40 text-[11px] font-mono transition-colors cursor-pointer"
            >
              <span>{tx.skipBtn[l]}</span>
              <X size={13} />
            </button>
          </div>

          {/* BARRA DE PROGRESSO */}
          <div className="relative z-10 w-full bg-surface2 h-1 rounded-full overflow-hidden my-2.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-300 rounded-full"
              style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* TEXTO EXPLICATIVO */}
          <p className="relative z-10 text-xs sm:text-[13px] text-ink/90 leading-relaxed mb-3">
            {step.desc[l]}
          </p>

          {/* DICA DE COMBATE */}
          <div className="relative z-10 p-2.5 rounded-lg border border-gold/30 bg-gold/5 flex items-start gap-2 text-xs mb-3.5">
            <span className="text-sm flex-none mt-0.5">💡</span>
            <div>
              <span className="font-mono text-[9.5px] font-extrabold text-gold block uppercase tracking-wider">
                {tx.tipPrefix[l]}
              </span>
              <p className="text-gold2 leading-tight text-[11px] sm:text-xs mt-0.5">
                {step.tip[l]}
              </p>
            </div>
          </div>

          {/* RODAPÉ: BOTÕES E NAVEGAÇÃO */}
          <div className="relative z-10 pt-2 border-t border-gold/20 flex items-center justify-between gap-2">
            {/* INDICADOR DE BOLINHAS */}
            <div className="flex items-center gap-1">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleJump(idx)}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    idx === stepIdx
                      ? 'w-5 bg-gold shadow-sm'
                      : 'w-1.5 bg-line hover:bg-muted'
                  }`}
                  aria-label={`Passo ${idx + 1}`}
                />
              ))}
            </div>

            {/* BOTÕES DE CONTROLE */}
            <div className="flex items-center gap-1.5">
              {!isFirst && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-2.5 py-1.5 rounded-lg border border-line bg-surface2 text-muted hover:text-ink text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>{tx.prevBtn[l]}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className={`py-1.5 px-3.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                  isLast
                    ? 'bg-gradient-to-r from-amber-500 via-gold to-amber-400 text-[#141414] font-black hover:brightness-110 active:scale-95'
                    : 'btn-gold'
                }`}
              >
                <span>{isLast ? tx.finishBtn[l] : tx.nextBtn[l]}</span>
                {isLast ? <Check size={13} strokeWidth={3} /> : <ArrowRight size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* SETINHA APONTANDO PARA BAIXO (Quando o card está em cima do elemento) */}
        {targetRect && placement === 'top' && (
          <div className="flex flex-col items-center -mt-1 animate-bounce">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-gold drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-[#141414] font-mono text-[10px] sm:text-xs font-black tracking-wider shadow-lg border border-white/20 mt-0.5">
              <span>{step.arrowLabel[l]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
