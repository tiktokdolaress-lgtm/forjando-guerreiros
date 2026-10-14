'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flame,
  Clock,
  Sparkles,
  Check,
  X,
  Lock,
  Shield,
  ShieldCheck,
  Eye,
  Zap,
  Target,
  Swords,
  Trophy,
  RefreshCw,
  Hourglass,
  Edit3,
  Calendar,
  Layers,
  Timer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { today, yesterday, parseD, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';
import { BATTLE_FOCUS_AXIOMS } from '@/components/Warrior3DCard';

const MONTH_NAMES = {
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

const DAY_NAMES = {
  pt: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
};

const HABITFLOW_I18N = {
  todayBadge: { pt: 'Hoje', en: 'Today', es: 'Hoy' },
  yesterdayBadge: { pt: 'Ontem', en: 'Yesterday', es: 'Ayer' },
  btnNewHabit: { pt: '+ Novo Hábito', en: '+ New Habit', es: '+ Nuevo Hábito' },
  dailyConsistency: { pt: 'Consistência Diária', en: 'Daily Consistency', es: 'Consistencia Diaria' },
  doneLabel: { pt: 'FEITO', en: 'DONE', es: 'HECHO' },
  habitsSummary: {
    pt: (d, t, p) => `${d} de ${t} itens concluídos (${p}%)`,
    en: (d, t, p) => `${d} of ${t} items completed (${p}%)`,
    es: (d, t, p) => `${d} de ${t} ítems completados (${p}%)`,
  },
  motivationalSuper: {
    pt: '⚡ Forja Lendária! Blindagem moral 100% cumprida com honra.',
    en: '⚡ Legendary Forge! 100% moral shielding fulfilled with honor.',
    es: '⚡ ¡Forja Legendaria! Blindaje moral 100% cumplido con honor.',
  },
  motivationalHalf: {
    pt: '✨ Ótimo ritmo! Você já passou da metade da jornada diária.',
    en: '✨ Great pace! You are already past halfway through today.',
    es: '✨ ¡Gran ritmo! Ya pasaste de la mitad de la jornada diaria.',
  },
  motivationalStart: {
    pt: '⚔️ O dia começou. Vença cada batalha sem recuar.',
    en: '⚔️ The day has begun. Conquer each battle without hesitation.',
    es: '⚔️ El día ha comenzado. Vence cada batalla sin vacilar.',
  },
  threePillarsSection: {
    pt: 'OS 3 PILARES DE COMBATE',
    en: 'THE 3 COMBAT PILLARS',
    es: 'LOS 3 PILARES DE COMBATE',
  },
  forgeHabitsSection: {
    pt: 'HÁBITOS DA FORJA',
    en: 'FORGE HABITS',
    es: 'HÁBITOS DE LA FORJA',
  },
  noActiveHabits: {
    pt: 'Nenhum hábito ativo na Forja. Toque em "+ Novo Hábito" para forjar sua rotina.',
    en: 'No active habits in the Forge. Tap "+ New Habit" to forge your routine.',
    es: 'Ningún hábito activo en la Forja. Toca "+ Nuevo Hábito" para forjar tu rutina.',
  },
  daysWord: { pt: 'dias', en: 'days', es: 'días' },
  remainingHours: {
    pt: (h, m) => `${h}h ${m}m restantes hoje`,
    en: (h, m) => `${h}h ${m}m remaining today`,
    es: (h, m) => `${h}h ${m}m restantes hoy`,
  },
  dayElapsedPct: {
    pt: (p) => `${p}% do dia`,
    en: (p) => `${p}% of day`,
    es: (p) => `${p}% del día`,
  },
  daysRemainingNextTier: {
    pt: (days, name) => `⏳ Faltam ${days}d para ${name}`,
    en: (days, name) => `⏳ ${days}d left until ${name}`,
    es: (days, name) => `⏳ Faltan ${days}d para ${name}`,
  },
  maxRankReached: {
    pt: '👑 Patente Máxima Alcançada',
    en: '👑 Maximum Rank Achieved',
    es: '👑 Rango Máximo Alcanzado',
  },
  pillarsAllConquered: {
    pt: '⚔️ Os 3 Pilares foram blindados hoje com honra total!',
    en: '⚔️ All 3 Pillars were shielded today with total honor!',
    es: '⚔️ ¡Los 3 Pilares fueron blindados hoy con honor total!',
  },
  showCompletedPillars: {
    pt: 'Exibir Pilares',
    en: 'Show Pillars',
    es: 'Mostrar Pilares',
  },
  hideCompletedPillars: {
    pt: 'Ocultar Pilares',
    en: 'Hide Pillars',
    es: 'Ocultar Pilares',
  },
  allHabitsConquered: {
    pt: '⚡ Todos os hábitos de hoje foram forjados com sucesso!',
    en: '⚡ All habits for today have been forged successfully!',
    es: '⚡ ¡Todos los hábitos de hoy han sido forjados con éxito!',
  },
  showCompletedHabits: {
    pt: 'Exibir Hábitos Concluídos',
    en: 'Show Completed Habits',
    es: 'Mostrar Hábitos Concluidos',
  },
  hideCompletedHabits: {
    pt: 'Ocultar Concluídos',
    en: 'Hide Completed',
    es: 'Ocultar Concluidos',
  },
  btnRegisterFall: {
    pt: 'Registrar Queda em Combate',
    en: 'Register Combat Fall',
    es: 'Registrar Caída en Combate',
  },
  battleWonLabel: {
    pt: 'BATALHA DE HOJE VENCIDA · HONRA INTACTA',
    en: "TODAY'S BATTLE WON · HONOR INTACT",
    es: 'BATALLA DE HOY VENCIDA · HONOR INTACTO',
  },
  precisionTimerLabel: {
    pt: 'CRONÔMETRO DE PRECISÃO',
    en: 'PRECISION TIMER',
    es: 'CRONÓMETRO DE PRECISIÓN',
  },
  timeInVigilLabel: {
    pt: 'TEMPO EM VIGÍLIA',
    en: 'TIME IN VIGIL',
    es: 'TIEMPO EN VIGILIA',
  },
  standardInFocus: {
    pt: 'ESTANDARTE EM FOCO',
    en: 'BANNER IN FOCUS',
    es: 'ESTANDARTE EN ENFOQUE',
  },
  pillarPrinciple: {
    pt: 'Princípio do Pilar',
    en: 'Pillar Principle',
    es: 'Principio del Pilar',
  },
  tapForDetails: {
    pt: 'Toque para detalhes & cronômetro',
    en: 'Tap for details & timer',
    es: 'Toca para detalles y cronómetro',
  },
  inviolablePastNotice: {
    pt: '🛡️ Registro Inviolável: Para manter a honra da jornada, apenas o dia de hoje e o de ontem podem ser alterados.',
    en: '🛡️ Inviolable Record: To preserve journey honor, only today and yesterday can be altered.',
    es: '🛡️ Registro Inviolable: Para preservar el honor del camino, solo hoy y ayer pueden ser alterados.',
  },
  futureNotice: {
    pt: 'O futuro ainda não existe. Vença apenas o dia de hoje.',
    en: 'The future does not exist yet. Conquer only today.',
    es: 'El futuro aún no existe. Vence solo el día de hoy.',
  },
  pillars: {
    p: {
      name: { pt: 'Zero Pornografia', en: 'Zero Pornography', es: 'Cero Pornografía' },
      sub: { pt: 'Olhar Firme', en: 'Clean Gaze', es: 'Mirada Limpia' },
      cat: { pt: 'Mente', en: 'Mind', es: 'Mente' },
      icon: Eye,
      iconColor: 'text-amber-400',
    },
    m: {
      name: { pt: 'Sem Masturbação', en: 'No Masturbation', es: 'Sin Masturbación' },
      sub: { pt: 'Autodomínio', en: 'Self-Mastery', es: 'Autodominio' },
      cat: { pt: 'Espírito', en: 'Spirit', es: 'Espíritu' },
      icon: Zap,
      iconColor: 'text-amber-400',
    },
    r: {
      name: { pt: 'Retenção Seminal', en: 'Semen Retention', es: 'Retención Seminal' },
      sub: { pt: 'Energia Vital', en: 'Vital Energy', es: 'Energía Vital' },
      cat: { pt: 'Corpo', en: 'Body', es: 'Cuerpo' },
      icon: Shield,
      iconColor: 'text-amber-400',
    },
  },
};

export default function HabitDailyCardsView({
  S,
  curLang = 'pt',
  activeHabits = [],
  setCI,
  onToggleHabit,
  onCreateHabit,
  onOpenReserve,
  getHabitStreak,
  getHabitCategory,
  onNotify,
  tier,
  nt = null,
  progressDays = 0,
  onFailFlow,
  pillarsData,
  renderSchedule = null,
}) {
  const lang = ['pt', 'en', 'es'].includes(curLang) ? curLang : 'pt';
  const todayStr = today();
  const yesterdayStr = yesterday(todayStr);

  // Data navegável (focada no dia de hoje, permitindo retroceder até ontem)
  const [selectedDate, setSelectedDate] = useState(todayStr);
  // Pilar expandido para exibir detalhes e cronômetro de precisão segundo a segundo
  const [expandedPillar, setExpandedPillar] = useState(null);
  // Controle para exibir/ocultar pilares e hábitos já concluídos
  const [showFinishedPillars, setShowFinishedPillars] = useState(false);
  const [showFinishedHabits, setShowFinishedHabits] = useState(false);


  const isToday = selectedDate === todayStr;
  const isYesterday = selectedDate === yesterdayStr;
  const isFuture = selectedDate > todayStr;
  const isPastLocked = !isToday && !isYesterday && !isFuture;
  const canEdit = isToday || isYesterday;

  // Formatação de data em destaque
  const selectedDateObj = useMemo(() => parseD(selectedDate), [selectedDate]);
  const dateFormattedTitle = useMemo(() => {
    const dayW = DAY_NAMES[lang][selectedDateObj.getDay()];
    const dayN = selectedDateObj.getDate();
    const mon = MONTH_NAMES[lang][selectedDateObj.getMonth()];
    if (lang === 'en') {
      return `${dayW}, ${mon} ${dayN}`;
    }
    return `${dayW}, ${dayN} De ${mon}`;
  }, [selectedDateObj, lang]);

  // Lemas táticos de foco nas 24 horas para vencer o dia
  const [axiomIdx, setAxiomIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setAxiomIdx((prev) => (prev + 1) % BATTLE_FOCUS_AXIOMS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const curAxiomObj = BATTLE_FOCUS_AXIOMS[axiomIdx % BATTLE_FOCUS_AXIOMS.length] || BATTLE_FOCUS_AXIOMS[0];
  const curAxiomText = curAxiomObj[lang] || curAxiomObj.pt;

  // Cronômetro regressivo das 24 horas restantes
  const [dayProgress, setDayProgress] = useState(() => {
    const now = new Date();
    const minsPassed = now.getHours() * 60 + now.getMinutes();
    const minsLeft = Math.max(0, 1440 - minsPassed);
    return {
      hoursLeft: Math.floor(minsLeft / 60),
      minsLeft: minsLeft % 60,
      pct: Math.min(100, Math.max(2, Math.round((minsPassed / 1440) * 100))),
    };
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const minsPassed = now.getHours() * 60 + now.getMinutes();
      const minsLeft = Math.max(0, 1440 - minsPassed);
      setDayProgress({
        hoursLeft: Math.floor(minsLeft / 60),
        minsLeft: minsLeft % 60,
        pct: Math.min(100, Math.max(2, Math.round((minsPassed / 1440) * 100))),
      });
    };
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dados dos 3 Pilares no dia selecionado
  const reqPillars = useMemo(() => L.pillars(S) || ['p', 'm', 'r'], [S]);
  const cData = useMemo(() => L.ci(S, selectedDate) || {}, [S, selectedDate]);

  // Dados dos Hábitos no dia selecionado
  const doneMap = useMemo(() => (S && S.forge && S.forge.done) || {}, [S]);
  const failMap = useMemo(() => (S && S.forge && S.forge.failed) || {}, [S]);
  const selectedDoneHabits = doneMap[selectedDate] || [];

  // Contagem Geral de Conclusão do Dia
  const totalItemsCount = reqPillars.length + activeHabits.length;
  const pillarsDoneCount = reqPillars.filter((k) => !!cData[k]).length;
  const habitsDoneCount = activeHabits.filter((h) =>
    selectedDoneHabits.some((id) => String(id) === String(h.id))
  ).length;
  const totalDoneCount = pillarsDoneCount + habitsDoneCount;
  const totalProgressPct = totalItemsCount > 0 ? Math.round((totalDoneCount / totalItemsCount) * 100) : 0;

  // Frase Motivacional de Acordo com o Ritmo
  const motivationalNotice = useMemo(() => {
    if (totalProgressPct === 100) return HABITFLOW_I18N.motivationalSuper[lang];
    if (totalProgressPct >= 50) return HABITFLOW_I18N.motivationalHalf[lang];
    return HABITFLOW_I18N.motivationalStart[lang];
  }, [totalProgressPct, lang]);

  // Patente e Nível
  const safeTier = tier || L.tierNow(S);
  const tierName = (safeTier && safeTier.name) || (lang === 'en' ? 'Warrior' : 'Guerreiro');
  const stageNum = safeTier && typeof safeTier.min === 'number'
    ? safeTier.min >= 730 ? 11 : safeTier.min >= 365 ? 10 : safeTier.min >= 270 ? 9 : safeTier.min >= 180 ? 8 : safeTier.min >= 120 ? 7 : safeTier.min >= 61 ? 6 : safeTier.min >= 31 ? 5 : safeTier.min >= 15 ? 4 : safeTier.min >= 7 ? 3 : safeTier.min >= 3 ? 2 : 1
    : 1;

  // Ações de Navegação de Dias
  const handlePrevDay = () => {
    AF.click();
    const curr = parseD(selectedDate);
    const prev = new Date(curr.getTime() - 86400000);
    setSelectedDate(dstr(prev));
  };

  const handleNextDay = () => {
    if (selectedDate >= todayStr) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    AF.click();
    const curr = parseD(selectedDate);
    const next = new Date(curr.getTime() + 86400000);
    setSelectedDate(dstr(next));
  };

  // Clique em Pilar
  const handlePillarClick = (k, isChecked) => {
    if (isFuture) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(HABITFLOW_I18N.inviolablePastNotice[lang]);
      return;
    }
    if (setCI) {
      AF.click();
      setCI(k, !isChecked, selectedDate);
    }
  };

  // Clique em Hábito
  const handleHabitClick = (habitId) => {
    if (isFuture) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(HABITFLOW_I18N.inviolablePastNotice[lang]);
      return;
    }
    if (onToggleHabit) {
      onToggleHabit(habitId, selectedDate);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0">
      {/* 1. BARRA SUPERIOR DE DATA & SELETOR DE DIAS (ESTILO HABITFLOW) */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl border border-line/80 bg-[#14141E] shadow-sm select-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Botão Dia Anterior */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="w-8 h-8 rounded-xl border border-line/70 bg-[#1A1926] hover:border-gold/60 text-muted hover:text-gold flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Título da Data + Badge */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-black text-sm sm:text-base text-[#F5EEDC] tracking-wide capitalize truncate">
                {dateFormattedTitle}
              </span>
              {isToday ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-gold/50 text-gold text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.todayBadge[lang]}
                </span>
              ) : isYesterday ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.yesterdayBadge[lang]}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-surface2 border border-line/60 text-muted text-[10px] font-mono flex items-center gap-1">
                  <Lock size={9} />
                  <span>{fmtD(selectedDate)}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-muted truncate mt-0.5">
              {HABITFLOW_I18N.habitsSummary[lang](totalDoneCount, totalItemsCount, totalProgressPct)}
            </span>
          </div>

          {/* Botão Próximo Dia (desabilitado se já for hoje) */}
          <button
            type="button"
            disabled={isToday}
            onClick={handleNextDay}
            className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isToday
                ? 'border-line/30 bg-black/20 text-muted/20 cursor-not-allowed'
                : 'border-line/70 bg-[#1A1926] hover:border-gold/60 text-muted hover:text-gold cursor-pointer active:scale-95'
            }`}
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Botão Novo Hábito */}
        
      </div>

      {/* 2. CARD DE CONSISTÊNCIA DIÁRIA COM O ANEL DE PROGRESSO & FRASE DO DIA INTEGRADA */}
      <div className="p-3.5 sm:p-5 rounded-2xl border border-line/80 bg-[#14141E] shadow-md flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Tag Motivacional Dinâmica */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-gold/30 text-amber-300 text-[11px] font-mono font-bold w-fit">
              <Sparkles size={12} className="shrink-0" />
              <span className="truncate">{motivationalNotice}</span>
            </div>

            {/* Título da Seção */}
            <h2 className="font-display font-black text-lg sm:text-2xl text-[#EDE5D5] tracking-wide">
              {HABITFLOW_I18N.dailyConsistency[lang]}
            </h2>

            {/* Badges de Nível, Estágio e Conquistas */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Patente Atual */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold">
                <Swords size={12} className="text-amber-400" />
                <span>
                  {lang === 'en' ? `Stage ${stageNum}:` : lang === 'es' ? `Etapa ${stageNum}:` : `Estágio ${stageNum}:`}{' '}
                  <strong className="text-gold uppercase">{tierName}</strong>
                </span>
                <span className="text-gold/80 ml-1">({progressDays} {HABITFLOW_I18N.daysWord[lang]})</span>
              </span>

              {/* Dias para a Próxima Patente */}
              {nt ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gold/40 bg-gradient-to-r from-amber-950/40 to-[#181622] text-amber-200 text-[11px] font-mono font-bold shadow-xs">
                  <span>{HABITFLOW_I18N.daysRemainingNextTier[lang](Math.max(1, nt.min - progressDays), nt.name)}</span>
                  <span className="ml-0.5">{nt.icon}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gold/40 bg-amber-500/15 text-gold text-[11px] font-mono font-bold">
                  <span>{HABITFLOW_I18N.maxRankReached[lang]}</span>
                </span>
              )}

              {/* Pilares Blindados no Dia */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-line/60 bg-surface text-muted text-[11px] font-mono">
                <Trophy size={12} className="text-gold" />
                <span>{pillarsDoneCount}/3 {lang === 'en' ? 'Pillars' : lang === 'es' ? 'Pilares' : 'Pilares'}</span>
              </span>
            </div>
          </div>

          {/* Anel Circular de Porcentagem (Estilo HabitFlow 50% FEITO) */}
          <div className="relative flex-none w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Círculo de fundo */}
              <path
                className="text-stone-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Círculo preenchido colorido */}
              <path
                className="text-amber-400 transition-all duration-700 ease-out"
                strokeDasharray={`${totalProgressPct}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-xs sm:text-base text-white leading-none">
                {totalProgressPct}%
              </span>
              <span className="text-[7px] sm:text-[8px] font-mono font-black text-muted tracking-widest uppercase mt-0.5">
                {HABITFLOW_I18N.doneLabel[lang]}
              </span>
            </div>
          </div>
        </div>

        {/* Barra Fina de Progresso Linear */}
        <div className="w-full h-1.5 rounded-full bg-stone-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${totalProgressPct}%` }}
          />
        </div>

        {/* 3. LOCAL NOBRE: FRASE ROTATIVA DO DIA & CRONÔMETRO DAS 24H (INTEGRADOS AQUI) */}
        <div className="pt-2 border-t border-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Frase / Lema Tático do Dia */}
          <div
            onClick={() => {
              AF.click();
              setAxiomIdx((p) => (p + 1) % BATTLE_FOCUS_AXIOMS.length);
            }}
            className="flex items-center gap-2 group cursor-pointer min-w-0"
            title="Toque para alternar o lema tático"
          >
            <Swords size={13} className="text-gold/80 flex-none group-hover:rotate-45 transition-transform" />
            <p className="text-[11px] sm:text-xs font-serif italic text-muted group-hover:text-gold/90 transition-colors truncate">
              "{curAxiomText}"
            </p>
            <RefreshCw size={11} className="text-muted/40 group-hover:text-gold flex-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Relógio das 24 Horas Restantes */}
          <div className="flex items-center gap-2 flex-none font-mono text-[10px] text-muted self-end sm:self-auto">
            <span className="flex items-center gap-1 text-amber-300">
              <Hourglass size={12} className="text-amber-400" />
              <span>{HABITFLOW_I18N.remainingHours[lang](dayProgress.hoursLeft, dayProgress.minsLeft)}</span>
            </span>
            <span className="text-muted/50">·</span>
            <span className="text-muted/80">{HABITFLOW_I18N.dayElapsedPct[lang](dayProgress.pct)}</span>
          </div>
        </div>
      </div>

      {/* 4. SEÇÃO: OS 3 PILARES DE COMBATE (CARDS GRANDES ESTILO HABITFLOW) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono font-black text-gold/80 uppercase tracking-widest">
            {HABITFLOW_I18N.threePillarsSection[lang]}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted">
              {pillarsDoneCount}/3 {HABITFLOW_I18N.doneLabel[lang]}
            </span>
            {pillarsDoneCount === 3 && (
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setShowFinishedPillars((v) => !v);
                }}
                className="text-[9.5px] font-mono font-bold text-gold/80 hover:text-gold transition-colors underline cursor-pointer"
              >
                {showFinishedPillars ? HABITFLOW_I18N.hideCompletedPillars[lang] : HABITFLOW_I18N.showCompletedPillars[lang]}
              </button>
            )}
          </div>
        </div>

        {/* Se todos os 3 pilares foram blindados e o guerreiro não pediu para exibir, os cards ficam ocultos */}
        {pillarsDoneCount === 3 && !showFinishedPillars ? (
          <div className="p-3.5 rounded-2xl border border-gold/40 bg-gradient-to-r from-amber-950/30 via-[#13121C] to-amber-950/30 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck size={18} className="text-gold flex-none" />
              <span className="text-xs font-mono font-bold text-gold truncate">
                {HABITFLOW_I18N.pillarsAllConquered[lang]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                AF.click();
                setShowFinishedPillars(true);
              }}
              className="px-2 py-1 rounded-lg border border-gold/40 bg-gold/10 text-gold text-[10px] font-mono font-bold hover:bg-gold/20 transition-all cursor-pointer shrink-0"
            >
              {HABITFLOW_I18N.showCompletedPillars[lang]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {reqPillars.map((k) => {
            const conf = HABITFLOW_I18N.pillars[k] || {
              name: { pt: `Pilar ${k}`, en: `Pillar ${k}`, es: `Pilar ${k}` },
              sub: { pt: 'Combate', en: 'Combat', es: 'Combate' },
              cat: { pt: 'Geral', en: 'General', es: 'General' },
              icon: Shield,
              iconColor: 'text-amber-400',
            };
            const IconComponent = conf.icon || Shield;
            const isChecked = !!cData[k];
            const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
            const failTypes = String(cData.fail || '').split('+').filter(Boolean);
            const isFailed = !isChecked && failTypes.includes(FAILMAP[k]);
            const isExpanded = expandedPillar === k;

            // Dados de cronômetro e dias individuais deste pilar
            const pKey = k === 'r' ? 'ret' : k === 'p' ? 'porn' : 'mast';
            const pillarInfo = (pillarsData && pillarsData[pKey]) || {
              days: progressDays,
              timer: `${progressDays}d 00h:00m:00s`,
            };

            return (
              <div
                key={k}
                className={`flex flex-col rounded-2xl border transition-all select-none overflow-hidden ${
                  isChecked
                    ? 'border-gold/70 bg-gradient-to-r from-amber-950/40 to-[#14131C] shadow-[0_0_12px_rgba(250,204,21,0.15)]'
                    : isFailed
                    ? 'border-red-500/60 bg-red-950/25'
                    : 'border-line/70 bg-[#14141E] hover:border-gold/50'
                }`}
              >
                {/* Linha Principal do Card */}
                <div className="flex items-center justify-between p-3 sm:p-3.5">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Botão de Checkbox Grande Macio (1 TOQUE PARA MARCAR) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePillarClick(k, isChecked);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none cursor-pointer active:scale-90 ${
                        isChecked
                          ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                          : isFailed
                          ? 'bg-red-500/25 border border-red-500/70 text-red-400'
                          : isPastLocked
                          ? 'bg-black/40 border border-line/40 text-muted/30 cursor-not-allowed'
                          : 'bg-black/30 border border-line/70 text-transparent hover:border-gold/60'
                      }`}
                      title="Marcar / Desmarcar Pilar"
                    >
                      {isChecked ? (
                        <Check size={18} strokeWidth={3.5} className="text-black" />
                      ) : isFailed ? (
                        <X size={16} strokeWidth={3} className="text-red-400" />
                      ) : isPastLocked ? (
                        <Lock size={12} className="text-muted/40" />
                      ) : null}
                    </button>

                    {/* Informações do Pilar (CLIQUE EXPANDI DETALHES & CRONÔMETRO) */}
                    <div
                      onClick={() => {
                        AF.click();
                        setExpandedPillar((prev) => (prev === k ? null : k));
                      }}
                      className="flex flex-col min-w-0 cursor-pointer flex-1 group"
                      title={HABITFLOW_I18N.tapForDetails[lang]}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComponent size={14} className={conf.iconColor || 'text-gold'} />
                        <span className={`font-display font-black text-sm tracking-wide truncate group-hover:text-gold transition-colors ${isChecked ? 'text-amber-300' : 'text-[#EDE5D5]'}`}>
                          {conf.name[lang]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-surface border border-line/50 text-[9.5px] font-mono text-muted">
                          {conf.cat[lang]}
                        </span>
                        <span className="text-[10px] text-muted/70 font-mono truncate">
                          {conf.sub[lang]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lado Direito: Dias em Vigília + Toggle de Detalhes */}
                  <div
                    onClick={() => {
                      AF.click();
                      setExpandedPillar((prev) => (prev === k ? null : k));
                    }}
                    className="flex items-center gap-1.5 flex-none pl-2 cursor-pointer"
                  >
                    <span className="font-mono font-black text-xs text-gold">
                      {pillarInfo.days}d
                    </span>
                    <button
                      type="button"
                      className="p-1 rounded-md text-muted hover:text-gold transition-colors"
                      title={HABITFLOW_I18N.tapForDetails[lang]}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* GAVETA TÁTICA EXPANSÍVEL: DADOS COMPLETOS E CRONÔMETRO DE ALTA PRECISÃO (ESTILO DO SEU 3º PRINT) */}
                {isExpanded && (
                  <div className="p-3 border-t border-line/50 bg-[#0F0E17] flex flex-col gap-2.5 animate-fade-in text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-xs text-gold uppercase tracking-wider">
                              {conf.name[lang]}
                            </span>
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/40 uppercase">
                              {HABITFLOW_I18N.standardInFocus[lang]}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted font-serif italic mt-0.5">
                            {conf.sub[lang]}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-black text-lg text-gold leading-none">
                          {pillarInfo.days} {HABITFLOW_I18N.daysWord[lang].toUpperCase()}
                        </span>
                        <small className="block text-[8px] font-mono uppercase tracking-widest text-muted mt-0.5">
                          {HABITFLOW_I18N.timeInVigilLabel[lang]}
                        </small>
                      </div>
                    </div>

                    {/* Cronômetro de Precisão Segundo a Segundo */}
                    <div className="p-2 rounded-xl border border-gold/30 bg-black/40 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold text-muted uppercase tracking-wider">
                        <Timer size={12} className="text-amber-400" />
                        <span>{HABITFLOW_I18N.precisionTimerLabel[lang]}</span>
                      </span>
                      <span className="font-mono font-black text-xs text-amber-300 tracking-wider">
                        {pillarInfo.timer}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}

        {/* BOTÃO NOBRE DE REGISTRO DE QUEDA & STATUS DE COMBATE (ESTILO DO SEU 2º PRINT) */}
        <div className="flex flex-col gap-1.5 mt-1">
          {pillarsDoneCount === 3 && (
            <div className="w-full py-2 px-3 rounded-xl border border-gold/50 bg-gradient-to-r from-amber-950/50 via-[#181622] to-amber-950/50 text-gold text-xs font-mono font-black flex items-center justify-center gap-1.5 shadow-sm select-none">
              <Trophy size={14} className="text-gold" />
              <span>{HABITFLOW_I18N.battleWonLabel[lang]}</span>
            </div>
          )}

          {canEdit && onFailFlow && (
            <button
              type="button"
              onClick={onFailFlow}
              className="w-full py-2 px-3 rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-[#161016] to-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm select-none"
            >
              <span>🩸</span>
              <span>{HABITFLOW_I18N.btnRegisterFall[lang]}</span>
            </button>
          )}
        </div>

      </div>

      {/* 5. SEÇÃO: HÁBITOS DA FORJA (APENAS OS HÁBITOS RESTANTES FICAM VISÍVEIS) */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono font-black text-gold/80 uppercase tracking-widest">
            {HABITFLOW_I18N.forgeHabitsSection[lang]}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted">
              {habitsDoneCount}/{activeHabits.length} {HABITFLOW_I18N.doneLabel[lang]}
            </span>
            {habitsDoneCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setShowFinishedHabits((v) => !v);
                }}
                className="text-[9.5px] font-mono font-bold text-gold/80 hover:text-gold transition-colors underline cursor-pointer"
              >
                {showFinishedHabits ? HABITFLOW_I18N.hideCompletedHabits[lang] : HABITFLOW_I18N.showCompletedHabits[lang]}
              </button>
            )}
          </div>
        </div>

        {/* Filtrar hábitos visíveis: Se showFinishedHabits for falso, exibe apenas os hábitos que AINDA NÃO FORAM FEITOS */}
        {(() => {
          const visibleHabits = showFinishedHabits
            ? activeHabits
            : activeHabits.filter((h) => !selectedDoneHabits.some((id) => String(id) === String(h.id)));

          if (activeHabits.length > 0 && visibleHabits.length === 0) {
            return (
              <div className="p-4 rounded-2xl border border-gold/40 bg-gradient-to-r from-amber-950/30 via-[#13121C] to-amber-950/30 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Check size={18} strokeWidth={3} className="text-gold flex-none" />
                  <span className="text-xs font-mono font-bold text-gold truncate">
                    {HABITFLOW_I18N.allHabitsConquered[lang]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    AF.click();
                    setShowFinishedHabits(true);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-gold/40 bg-gold/10 text-gold text-[10.5px] font-mono font-bold hover:bg-gold/20 transition-all cursor-pointer shrink-0"
                >
                  {HABITFLOW_I18N.showCompletedHabits[lang]}
                </button>
              </div>
            );
          }

          if (activeHabits.length === 0) {
            return (
              <div className="p-6 rounded-2xl border border-dashed border-line/80 bg-[#12121A] text-center flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">🔨</span>
                <p className="text-xs font-mono text-muted max-w-sm">
                  {HABITFLOW_I18N.noActiveHabits[lang]}
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {visibleHabits.map((h) => {
              const isDone = selectedDoneHabits.some((id) => String(id) === String(h.id));
              const fList = failMap[selectedDate] || [];
              const isFail = fList.some((id) => String(id) === String(h.id));
              const streakCount = getHabitStreak ? getHabitStreak(h.id) : 0;
              const cat = (getHabitCategory && getHabitCategory(h)) || h.category || 'body';
              const time = (S.forge && S.forge.times && S.forge.times[h.id]) || '';

              const catBadge =
                cat === 'body'
                  ? { label: lang === 'en' ? 'Body' : lang === 'es' ? 'Cuerpo' : 'Corpo', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' }
                  : cat === 'mind'
                  ? { label: lang === 'en' ? 'Mind' : lang === 'es' ? 'Mente' : 'Mente', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' }
                  : cat === 'mission'
                  ? { label: lang === 'en' ? 'Mission' : lang === 'es' ? 'Misión' : 'Missão', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' }
                  : { label: lang === 'en' ? 'Spirit' : lang === 'es' ? 'Espíritu' : 'Espírito', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' };

              return (
                <div
                  key={h.id}
                  onClick={() => handleHabitClick(h.id)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all select-none ${
                    isPastLocked
                      ? 'opacity-85 border-line/40 bg-[#12121A] cursor-not-allowed'
                      : 'cursor-pointer active:scale-[0.98]'
                  } ${
                    isDone
                      ? 'border-gold/70 bg-gradient-to-r from-amber-950/40 to-[#14131C] shadow-[0_0_12px_rgba(250,204,21,0.15)]'
                      : isFail
                      ? 'border-red-500/60 bg-red-950/25'
                      : 'border-line/70 bg-[#14141E] hover:border-gold/50 hover:bg-[#181826]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Botão de Checkbox Grande Macio */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none ${
                        isDone
                          ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                          : isFail
                          ? 'bg-red-500/25 border border-red-500/70 text-red-400'
                          : isPastLocked
                          ? 'bg-black/40 border border-line/40 text-muted/30'
                          : 'bg-black/30 border border-line/70 text-transparent hover:border-gold/60'
                      }`}
                    >
                      {isDone ? (
                        <Check size={18} strokeWidth={3.5} className="text-black" />
                      ) : isFail ? (
                        <X size={16} strokeWidth={3} className="text-red-400" />
                      ) : isPastLocked ? (
                        <Lock size={12} className="text-muted/40" />
                      ) : null}
                    </div>

                    {/* Informações do Hábito */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base flex-none">{h.icon || '⚡'}</span>
                        <span className={`font-display font-black text-sm tracking-wide truncate ${isDone ? 'text-amber-300' : 'text-[#EDE5D5]'}`}>
                          {h.n || h.name || h.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {/* Tag de Categoria */}
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${catBadge.color}`}>
                          {catBadge.label}
                        </span>

                        {/* Horário */}
                        {time && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-mono text-muted">
                            <Clock size={10} className="text-gold/70" />
                            <span>{time}</span>
                          </span>
                        )}

                        {/* Streak */}
                        {streakCount > 0 && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-mono font-bold text-amber-400">
                            <Flame size={10} className="fill-amber-400" />
                            <span>{streakCount} {HABITFLOW_I18N.daysWord[lang]}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cadeado ou Ações */}
                  <div className="flex items-center gap-1 flex-none pl-2">
                    {isPastLocked && (
                      <Lock size={13} className="text-muted/40" />
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          );
        })()}
      </div>

      {/* 6. AGENDA OPERACIONAL & TAREFAS DO DIA (INTEGRADA DE FORMA LEVE E RETRÁTIL) */}
      {renderSchedule && (
        <div className="w-full mt-1">
          {renderSchedule()}
        </div>
      )}
    </div>
  );
}
