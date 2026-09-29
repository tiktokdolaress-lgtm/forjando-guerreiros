'use client';
import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';

export const TOUR_STORAGE_KEY = 'fg_tour_seen_v1';

export const TOUR_STEPS = [
  {
    id: 'qg_towers',
    tab: 'qg',
    icon: '🏰',
    badge: {
      pt: 'ETAPA 1 DE 5 · QUARTEL GENERAL',
      en: 'STEP 1 OF 5 · HEADQUARTERS',
      es: 'ETAPA 1 DE 5 · CUARTEL GENERAL',
    },
    title: {
      pt: 'As 3 Torres 3D & Vitória das 24 Horas',
      en: 'The 3 3D Towers & 24-Hour Victory',
      es: 'Las 3 Torres 3D y Victoria de 24 Horas',
    },
    arrowLabel: {
      pt: '👇 ESTA É A SUA TORRE DE CONTROLE DE COMBATE',
      en: '👇 THIS IS YOUR COMBAT CONTROL TOWER',
      es: '👇 ESTA ES TU TORRE DE CONTROL DE COMBATE',
    },
    desc: {
      pt: 'Aqui está o coração do aplicativo. As 3 Torres 3D monitoram em tempo real, segundo a segundo, sua Retenção Seminal, Zero Pornografia e Zero Masturbação.',
      en: 'Here lies the core of the app. The 3 3D Towers track your Semen Retention, Zero Pornography, and Zero Masturbation in real time, second by second.',
      es: 'Aquí está el corazón de la aplicación. Las 3 Torres 3D monitorean en tiempo real, segundo a segundo, tu Retención Seminal, Cero Pornografía y Cero Masturbación.',
    },
    tip: {
      pt: 'Toque nas torres ou no card de Batalha Diária todo fim de tarde para registrar sua vitória e evoluir sua armadura medieval.',
      en: 'Tap the towers or the Daily Battle card every evening to seal your victory and evolve your medieval armor.',
      es: 'Toca las torres o la tarjeta de Batalla Diaria cada atardecer para registrar tu victoria y evolucionar tu armadura medieval.',
    },
    previewType: 'towers',
  },
  {
    id: 'forge_habits',
    tab: 'forge',
    icon: '🔨',
    badge: {
      pt: 'ETAPA 2 DE 5 · FORJA DE HÁBITOS',
      en: 'STEP 2 OF 5 · HABIT FORGE',
      es: 'ETAPA 2 DE 5 · FORJA DE HÁBITOS',
    },
    title: {
      pt: 'Protocolo de Hábitos & Slots de Disciplina',
      en: 'Habit Protocol & Discipline Slots',
      es: 'Protocolo de Hábitos y Slots de Disciplina',
    },
    arrowLabel: {
      pt: '👇 CUMPRA OU FALHE SEUS HÁBITOS AQUI DIARIAMENTE',
      en: '👇 COMPLETE OR FAIL YOUR HABITS HERE DAILY',
      es: '👇 CUMPLE O FALLA TUS HÁBITOS AQUÍ A DIARIO',
    },
    desc: {
      pt: 'Construa novos hábitos viris para canalizar sua energia. O sistema libera slots controlados conforme sua patente sobe para evitar sobrecarga e garantir consistência.',
      en: 'Forge new masculine habits to transmute your vital energy. The system unlocks controlled slots as your rank rises to prevent burnout and ensure consistency.',
      es: 'Construye hábitos viriles para transmutar tu energía vital. El sistema desbloquea ranuras controladas según sube tu rango para evitar sobrecargas y asegurar constancia.',
    },
    tip: {
      pt: 'Marque feito (✓) ou falhou (✕) todo dia. O app dispara Alertas de Negligência se você abandonar hábitos ativos.',
      en: 'Mark done (✓) or failed (✕) daily. The app triggers Neglect Alerts if you abandon active habits.',
      es: 'Marca cumplido (✓) o fallado (✕) a diario. La app activa Alertas de Negligencia si abandonas hábitos activos.',
    },
    previewType: 'forge',
  },
  {
    id: 'ops_tasks',
    tab: 'ops',
    icon: '⚔️',
    badge: {
      pt: 'ETAPA 3 DE 5 · OPERAÇÕES DE GUERRA',
      en: 'STEP 3 OF 5 · WAR OPERATIONS',
      es: 'ETAPA 3 DE 5 · OPERACIONES DE GUERRA',
    },
    title: {
      pt: 'Missões Diárias & Projetos Estratégicos',
      en: 'Daily Missions & Strategic Projects',
      es: 'Misiones Diarias y Proyectos Estratégicos',
    },
    arrowLabel: {
      pt: '👇 ORGANIZE SUAS TAREFAS E PROJETOS DE VIDA',
      en: '👇 ORGANIZE YOUR TASKS & LIFE PROJECTS',
      es: '👇 ORGANIZA TUS TAREAS Y PROYECTOS DE VIDA',
    },
    desc: {
      pt: 'Homens sem missão caem em tentação. Na aba Operações você cria tarefas diárias com prioridades e organiza projetos de 30 a 90 dias usando os modelos prontos da Forja.',
      en: 'Men without a mission fall into temptation. In Operations you create prioritized daily tasks and organize 30 to 90-day projects using the Forge ready templates.',
      es: 'Los hombres sin misión caen en tentación. En Operaciones creas tareas diarias priorizadas y organizas proyectos de 30 a 90 días usando las plantillas listas de la Forja.',
    },
    tip: {
      pt: 'Defina suas tarefas na noite anterior e use "Adiar com Honra" se houver imprevistos sem perder o controle.',
      en: 'Set your tasks the night before and use "Postpone with Honor" when unexpected events occur without losing control.',
      es: 'Define tus tareas la noche anterior y usa "Posponer con Honor" si ocurren imprevistos sin perder el control.',
    },
    previewType: 'ops',
  },
  {
    id: 'sos_fab',
    tab: 'qg',
    icon: '🚨',
    badge: {
      pt: 'ETAPA 4 DE 5 · BOTÃO DE EMERGÊNCIA S.O.S',
      en: 'STEP 4 OF 5 · EMERGENCY S.O.S BUTTON',
      es: 'ETAPA 4 DE 5 · BOTÓN DE EMERGENCIA S.O.S',
    },
    title: {
      pt: 'Blindagem Instantânea Contra Recaídas',
      en: 'Instant Relapse Shielding',
      es: 'Blindaje Instantáneo Contra Recaídas',
    },
    arrowLabel: {
      pt: '👉 O BOTÃO VERMELHO S.O.S FICA FIXO NO CANTO INFERIOR',
      en: '👉 THE RED S.O.S BUTTON FLOATS IN THE BOTTOM CORNER',
      es: '👉 EL BOTÓN ROJO S.O.S ESTÁ FIJO EN LA ESQUINA INFERIOR',
    },
    desc: {
      pt: 'Em qualquer tela do aplicativo, este botão vermelho flutuante estará sempre à mão. Quando a tentação ou fissura apertar, aperte-o sem hesitar para cortar o pico de dopamina imediatamente.',
      en: 'Across all app screens, this red floating button remains pinned within reach. When temptation strikes, tap it without hesitation to kill the dopamine spike immediately.',
      es: 'En cualquier pantalla, este botón rojo flotante estará siempre a mano. Cuando la tentación apriete, tócalo sin dudar para cortar el pico de dopamina de inmediato.',
    },
    tip: {
      pt: 'Vencer uma fissura de 5 minutos preserva meses de honra. O S.O.S ativa respiração tática 4-4-4-4 e frequências sonoras de resgate.',
      en: 'Conquering a 5-minute urge preserves months of honor. S.O.S triggers 4-4-4-4 box breathing and acoustic rescue tones.',
      es: 'Vencer una urgencia de 5 minutos preserva meses de honor. El S.O.S activa respiración táctica 4-4-4-4 y tonos sonoros de rescate.',
    },
    previewType: 'sos',
  },
  {
    id: 'manual_access',
    tab: 'settings',
    icon: '🧭',
    badge: {
      pt: 'ETAPA 5 DE 5 · MANUAL TÁTICO & AJUSTES',
      en: 'STEP 5 OF 5 · TACTICAL MANUAL & SETTINGS',
      es: 'ETAPA 5 DE 5 · MANUAL TÁCTICO Y AJUSTES',
    },
    title: {
      pt: 'Manual do Guerreiro Sempre Disponível',
      en: 'Warrior Manual Always Ready',
      es: 'Manual del Guerrero Siempre Disponible',
    },
    arrowLabel: {
      pt: '👆 REVEJA ESTE TOUR QUANDO QUISER NO TOPO OU AJUSTES',
      en: '👆 REVIEW THIS TOUR ANYTIME AT THE TOP OR SETTINGS',
      es: '👆 REVISA ESTE TOUR CUANDO QUIERAS ARRIBA O EN AJUSTES',
    },
    desc: {
      pt: 'Você pode rever este tour explicativo a qualquer momento tocando na bússola no topo do app ou na aba Ajustes. O Comando está com você. A batalha começou!',
      en: 'You can review this tour at any time by tapping the compass in the header or in the Settings tab. Command is with you. The battle has begun!',
      es: 'Puedes revisar este tour en cualquier momento tocando la brújula arriba o en Ajustes. El Comando está contigo. ¡La batalla comenzó!',
    },
    tip: {
      pt: 'A disciplina supera o talento. Entre no QG, sele seus 3 pilares e vença o dia de hoje!',
      en: 'Discipline beats talent. Enter HQ, seal your 3 pillars, and conquer today!',
      es: 'La disciplina supera al talento. ¡Entra al QG, sella tus 3 pilares y vence el día de hoy!',
    },
    previewType: 'manual',
  },
];

export const TOUR_I18N = {
  skipBtn: { pt: 'Pular', en: 'Skip', es: 'Saltar' },
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
  const step = steps[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === steps.length - 1;

  // Atualiza a aba no fundo para o usuário ver a página real mudando
  useEffect(() => {
    if (step.tab && tab !== step.tab) {
      try {
        setTab(step.tab);
      } catch (e) {}
    }
  }, [stepIdx, step.tab, tab, setTab]);

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
    <div className="relative w-full max-w-lg mx-auto rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#090604] border-2 border-gold/60 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-ink overflow-hidden select-none">
      {/* Brilho Superior Dourado */}
      <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 h-24 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.25)_0%,transparent_75%)]" />

      {/* CABEÇALHO */}
      <div className="relative z-10 flex items-start justify-between gap-3 pb-2.5 border-b border-gold/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-none p-2 rounded-xl bg-gold/15 border border-gold/40 text-gold shadow-sm">
            <Compass size={22} className="text-gold" />
          </div>
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
          className="flex-none flex items-center gap-1 px-2.5 py-1 rounded-lg border border-line bg-surface2 text-muted hover:text-gold hover:border-gold/40 text-xs font-mono transition-colors cursor-pointer"
        >
          <span>{tx.skipBtn[l]}</span>
          <X size={13} />
        </button>
      </div>

      {/* BARRA DE PROGRESSO SLIDE */}
      <div className="relative z-10 w-full bg-surface2 h-1 rounded-full overflow-hidden my-3">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-300 rounded-full"
          style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* SETA INDICATIVA ANIMADA ("SETINHA") APONTANDO PARA O ELEMENTO */}
      <div className="relative z-10 mb-2 flex flex-col items-center animate-bounce">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-[#141414] font-mono text-[10px] sm:text-xs font-black tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)] border border-white/30">
          <span>{step.arrowLabel[l]}</span>
        </div>
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-gold drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" />
      </div>

      {/* CAIXA DE SIMULAÇÃO VISUAL DA FERRAMENTA REAL */}
      <div className="relative z-10 rounded-xl border border-gold/40 bg-black/60 p-3 sm:p-3.5 mb-3 shadow-inner">
        {step.previewType === 'towers' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-surface2 border border-gold/30">
                <span className="text-base block">🏛️</span>
                <span className="text-[10px] font-mono font-bold text-gold block truncate">Retenção</span>
                <span className="text-xs font-mono font-black text-ink">Ao Vivo ⏱️</span>
              </div>
              <div className="p-2 rounded-lg bg-surface2 border border-line">
                <span className="text-base block">🛡️</span>
                <span className="text-[10px] font-mono font-bold text-muted block truncate">Zero Porn</span>
                <span className="text-xs font-mono font-black text-ok">Limpo ✓</span>
              </div>
              <div className="p-2 rounded-lg bg-surface2 border border-line">
                <span className="text-base block">⚔️</span>
                <span className="text-[10px] font-mono font-bold text-muted block truncate">Zero Mast</span>
                <span className="text-xs font-mono font-black text-ok">Limpo ✓</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-gold/10 border border-gold/30 text-[11px] font-mono text-gold font-bold">
              <span>⚔️ Batalha das 24 Horas: Vença o Hoje</span>
              <span className="text-[10px] bg-gold text-black px-1.5 py-0.2 rounded font-black">HONRA</span>
            </div>
          </div>
        )}

        {step.previewType === 'forge' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted border-b border-line/60 pb-1.5">
              <span>Slots da Forja: <b className="text-gold">3 Ativos / 3 Máx</b></span>
              <span className="text-[10px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded font-bold">PATAMAR I</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface2 border border-gold/40">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">🏛️</span>
                <span className="text-xs font-bold text-ink truncate">Treino Pesado & Vigor</span>
              </div>
              <div className="flex items-center gap-1.5 flex-none">
                <span className="text-[10px] font-mono bg-ok/20 text-ok border border-ok/40 px-2 py-1 rounded font-bold">✓ CONCLUIR</span>
                <span className="text-[10px] font-mono bg-danger/10 text-danger border border-danger/30 px-2 py-1 rounded font-bold">✕ FALHEI</span>
              </div>
            </div>
          </div>
        )}

        {step.previewType === 'ops' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted border-b border-line/60 pb-1.5">
              <span>Operações Táticas: <b className="text-gold">Progresso 100%</b></span>
              <span className="text-[10px] bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded font-bold">+ Nova Tarefa</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-surface2 border border-line">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono bg-danger/20 text-danger px-1.5 py-0.5 rounded font-bold uppercase">ALTA</span>
                <span className="text-xs font-bold text-ink truncate">Leitura estoica de 20 páginas</span>
              </div>
              <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                <Clock size={10} /> 08:00
              </span>
            </div>
          </div>
        )}

        {step.previewType === 'sos' && (
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-danger/10 border border-danger/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] flex-none animate-pulse">
                <Siren size={20} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-red-200 block truncate">Botão Vermelho S.O.S</span>
                <span className="text-[10px] text-muted block truncate">Fixo no canto inferior direito</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-danger bg-danger/20 border border-danger/40 px-2 py-1 rounded uppercase tracking-wider flex-none">
              RESGATE
            </span>
          </div>
        )}

        {step.previewType === 'manual' && (
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-gold/10 border border-gold/30">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold flex-none">
                <Compass size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gold block truncate">Manual do Guerreiro</span>
                <span className="text-[10px] text-muted block truncate">Toque na bússola ou na aba Ajustes</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-gold bg-gold/20 border border-gold/40 px-2 py-1 rounded uppercase flex-none">
              REVER TOUR
            </span>
          </div>
        )}
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
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleJump(idx)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                idx === stepIdx
                  ? 'w-6 bg-gold shadow-sm'
                  : 'w-2 bg-line hover:bg-muted'
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
              className="px-3 py-1.5 rounded-lg border border-line bg-surface2 text-muted hover:text-ink text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
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
  );
}
