'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flame,
  Bell,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  Sparkles,
  Trophy,
  Crown,
  Shield,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
  Timer,
  Swords,
  ShieldCheck,
} from 'lucide-react';
import { today, yesterday, parseD, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

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
    pt: (d, t, p) => `${d} de ${t} hábitos concluídos (${p}%)`,
    en: (d, t, p) => `${d} of ${t} habits completed (${p}%)`,
    es: (d, t, p) => `${d} de ${t} hábitos completados (${p}%)`,
  },
  motivationalPhrase: {
    pt: 'Dê o primeiro passo para um dia produtivo!',
    en: 'Take the first step towards a productive day!',
    es: '¡Da el primer paso hacia un día productivo!',
  },
  conquests: {
    pt: (c, t) => `${c}/${t} Pilares`,
    en: (c, t) => `${c}/${t} Pillars`,
    es: (c, t) => `${c}/${t} Pilares`,
  },
  daysWord: { pt: 'dia', en: 'day', es: 'día' },
  daysPluralWord: { pt: 'dias', en: 'days', es: 'días' },
  lockedPastNotice: {
    pt: '🛡️ Registro Inviolável: Para manter a honra da jornada, apenas hoje e ontem podem ser alterados.',
    en: '🛡️ Inviolable Record: To preserve journey honor, only today and yesterday can be altered.',
    es: '🛡️ Registro Inviolable: Para preservar el honor del camino, solo hoy y ayer pueden ser alterados.',
  },
  futureNotice: {
    pt: 'O futuro ainda não existe. Vença apenas o dia de hoje.',
    en: 'The future does not exist yet. Conquer only today.',
    es: 'El futuro aún no existe. Vence solo el día de hoy.',
  },
  pillarsSectionTitle: {
    pt: 'OS 3 PILARES DE COMBATE (HONRA SAGRADA)',
    en: 'THE 3 COMBAT PILLARS (SACRED HONOR)',
    es: 'LOS 3 PILARES DE COMBATE (HONOR SAGRADO)',
  },
  forgeHabitsTitle: {
    pt: 'HÁBITOS DA FORJA (DISCIPLINA DIÁRIA)',
    en: 'FORGE HABITS (DAILY DISCIPLINE)',
    es: 'HÁBITOS DE LA FORJA (DISCIPLINA DIARIA)',
  },
  pillarsAllDone: {
    pt: '⚔️ Os 3 Pilares foram blindados hoje. Honra intacta!',
    en: '⚔️ All 3 Pillars were shielded today. Honor intact!',
    es: '⚔️ ¡Los 3 Pilares fueron blindados hoy. Honor intacto!',
  },
  habitsAllDone: {
    pt: '⚡ Todos os hábitos de hoje foram forjados com sucesso!',
    en: '⚡ All habits for today have been forged successfully!',
    es: '⚡ ¡Todos los hábitos de hoy han sido forjados con éxito!',
  },
  showCompleted: {
    pt: 'Exibir concluídos',
    en: 'Show completed',
    es: 'Mostrar completados',
  },
  hideCompleted: {
    pt: 'Ocultar concluídos',
    en: 'Hide completed',
    es: 'Ocultar completados',
  },
  btnRegisterFall: {
    pt: '🩸 Registrar Queda em Combate',
    en: '🩸 Register Combat Fall',
    es: '🩸 Registrar Caída en Combate',
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
  mottoQuote: {
    pt: '"Vença o hoje · O amanhã ainda não existe · Foco total no agora"',
    en: '"Conquer today · Tomorrow does not exist yet · Total focus on now"',
    es: '"Vence el hoy · El mañana aún no existe · Enfoque total en el ahora"',
  },
  hoursRemainingSuffix: {
    pt: (h, m) => `⏳ ${h}h ${m}m restantes hoje`,
    en: (h, m) => `⏳ ${h}h ${m}m left today`,
    es: (h, m) => `⏳ ${h}h ${m}m restantes hoy`,
  },
  dayPercentSuffix: {
    pt: (p) => `${p}% do dia`,
    en: (p) => `${p}% of day`,
    es: (p) => `${p}% del día`,
  },
  pillars: {
    r: {
      pt: 'Retenção Seminal',
      en: 'Semen Retention',
      es: 'Retención Seminal',
      icon: '⚡',
      cat: { pt: 'Corpo', en: 'Body', es: 'Cuerpo' },
      time: '08:00',
    },
    p: {
      pt: 'Zero Pornografia',
      en: 'Zero Pornography',
      es: 'Cero Pornografía',
      icon: '🛡️',
      cat: { pt: 'Mente', en: 'Mind', es: 'Mente' },
      time: '08:00',
    },
    m: {
      pt: 'Sem Masturbação',
      en: 'No Masturbation',
      es: 'Sin Masturbación',
      icon: '⚔️',
      cat: { pt: 'Espírito', en: 'Spirit', es: 'Espíritu' },
      time: '08:00',
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
  progressDays = 0,
  nt = null,
  onFailFlow = null,
  pillarsData = null,
}) {
  const lang = ['pt', 'en', 'es'].includes(curLang) ? curLang : 'pt';
  const todayStr = today();
  const yesterdayStr = yesterday(todayStr);

  // Data navegável
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const isToday = selectedDate === todayStr;
  const isYesterday = selectedDate === yesterdayStr;
  const isFuture = selectedDate > todayStr;
  const isPastLocked = !isToday && !isYesterday && !isFuture;

  // Estado para expandir gaveta do cronômetro de precisão por pilar
  const [expandedPillar, setExpandedPillar] = useState(null);

  // Estado opcional para auditar concluídos se o guerreiro quiser rever
  const [showFinishedPillars, setShowFinishedPillars] = useState(false);
  const [showFinishedHabits, setShowFinishedHabits] = useState(false);

  // Relógio do dia (tempo restante das 24h e % decorrido)
  const [nowTime, setNowTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const { remHours, remMinutes, dayProgressPct } = useMemo(() => {
    const h = nowTime.getHours();
    const m = nowTime.getMinutes();
    const currentMins = h * 60 + m;
    const totalMins = 1440;
    const remMins = Math.max(0, totalMins - currentMins);
    const rH = Math.floor(remMins / 60);
    const rM = remMins % 60;
    const pct = Math.min(100, Math.round((currentMins / totalMins) * 100));
    return { remHours: rH, remMinutes: rM, dayProgressPct: pct };
  }, [nowTime]);

  // Formatação da data idêntica ao print
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

  // Mapas de dados
  const reqPillars = useMemo(() => L.pillars(S) || ['r', 'p', 'm'], [S]);
  const cData = useMemo(() => L.ci(S, selectedDate) || {}, [S, selectedDate]);
  const doneHabitsMap = useMemo(() => (S && S.forge && S.forge.done) || {}, [S]);
  const selectedDoneHabits = doneHabitsMap[selectedDate] || [];

  // 1. Lista dos 3 Pilares
  const pillarCards = useMemo(() => {
    return reqPillars.map((k) => {
      const conf = HABITFLOW_I18N.pillars[k] || {
        pt: `Pilar ${k}`,
        en: `Pillar ${k}`,
        es: `Pilar ${k}`,
        icon: '🛡️',
        cat: { pt: 'Combate', en: 'Combat', es: 'Combate' },
        time: '08:00',
      };
      const isDone = !!cData[k];
      const pKey = k === 'r' ? 'ret' : k === 'p' ? 'porn' : 'mast';
      const info = (pillarsData && pillarsData[pKey]) || {
        days: progressDays,
        timer: `${progressDays}d 00h:00m:00s`,
      };

      return {
        key: k,
        id: `pillar_${k}`,
        name: conf[lang] || conf.pt,
        icon: conf.icon,
        cat: conf.cat[lang] || conf.cat.pt,
        time: conf.time,
        days: info.days,
        timer: info.timer,
        isDone,
      };
    });
  }, [reqPillars, cData, lang, pillarsData, progressDays]);

  const pillarsDoneCount = pillarCards.filter((x) => x.isDone).length;
  const allPillarsDone = reqPillars.length > 0 && pillarsDoneCount === reqPillars.length;

  // 2. Lista de Hábitos da Forja
  const habitCards = useMemo(() => {
    return activeHabits.map((h) => {
      const isDone = selectedDoneHabits.some((id) => String(id) === String(h.id));
      const streak = getHabitStreak ? getHabitStreak(h.id) : 0;
      const cat = (getHabitCategory && getHabitCategory(h)) || h.category || 'Saúde';
      const time = (S.forge && S.forge.times && S.forge.times[h.id]) || '08:00';

      const catLabel =
        cat === 'body'
          ? (lang === 'en' ? 'Fitness' : lang === 'es' ? 'Fitness' : 'Fitness')
          : cat === 'mind'
          ? (lang === 'en' ? 'Mind' : lang === 'es' ? 'Mente' : 'Mente')
          : cat === 'mission'
          ? (lang === 'en' ? 'Routine' : lang === 'es' ? 'Rutina' : 'Rotina')
          : (lang === 'en' ? 'Health' : lang === 'es' ? 'Salud' : 'Saúde');

      return {
        id: h.id,
        name: h.n || h.name || h.title || 'Hábito',
        icon: h.icon || '⚡',
        cat: catLabel,
        time,
        streak,
        isDone,
      };
    });
  }, [activeHabits, selectedDoneHabits, getHabitStreak, getHabitCategory, S, lang]);

  const habitsDoneCount = habitCards.filter((x) => x.isDone).length;
  const allHabitsDone = habitCards.length > 0 && habitsDoneCount === habitCards.length;

  // Total Geral (Pilares + Hábitos) para a métrica de 33%
  const grandTotal = pillarCards.length + habitCards.length;
  const grandDone = pillarsDoneCount + habitsDoneCount;
  const progressPct = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

  // Patente e Nível
  const safeTier = tier || L.tierNow(S);
  const tierName = (safeTier && safeTier.name) || (lang === 'en' ? 'Unstoppable Legend' : 'Lenda Imparável');
  const stageNum = safeTier && typeof safeTier.min === 'number'
    ? safeTier.min >= 730 ? 11 : safeTier.min >= 365 ? 10 : safeTier.min >= 270 ? 9 : safeTier.min >= 180 ? 8 : safeTier.min >= 120 ? 7 : safeTier.min >= 61 ? 6 : safeTier.min >= 31 ? 5 : safeTier.min >= 15 ? 4 : safeTier.min >= 7 ? 3 : safeTier.min >= 3 ? 2 : 1
    : 7;

  // Ações de Data
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
  const handlePillarToggle = (p) => {
    if (isFuture) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(HABITFLOW_I18N.lockedPastNotice[lang]);
      return;
    }
    if (setCI) {
      AF.click();
      setCI(p.key, !p.isDone, selectedDate);
    }
  };

  // Clique em Hábito
  const handleHabitToggle = (h) => {
    if (isFuture) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(HABITFLOW_I18N.lockedPastNotice[lang]);
      return;
    }
    if (onToggleHabit) {
      onToggleHabit(h.id, selectedDate);
    }
  };

  // Filtragem dos Pilares e Hábitos: os que forem concluídos SOMEM da tela!
  const visiblePillars = showFinishedPillars ? pillarCards : pillarCards.filter((p) => !p.isDone);
  const visibleHabits = showFinishedHabits ? habitCards : habitCards.filter((h) => !h.isDone);

  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0 select-none">
      {/* 1. BARRA SUPERIOR DE DATA (EXATA DO HABITFLOW COM PALETA OURO & AÇO) */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl border border-line/80 bg-[#14141E] shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Seta Anterior */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="w-8 h-8 rounded-xl border border-line/80 bg-[#1D1B28] hover:border-gold/50 text-muted hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Data + Badge */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-black text-sm sm:text-base text-[#EDE5D5] tracking-wide truncate">
                {dateFormattedTitle}
              </span>
              {isToday ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-gold/50 text-gold text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.todayBadge[lang]}
                </span>
              ) : isYesterday ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-gold/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.yesterdayBadge[lang]}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#1D1B28] text-muted text-[10px] font-mono flex items-center gap-1">
                  <Lock size={9} />
                  <span>{fmtD(selectedDate)}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-muted truncate mt-0.5">
              {HABITFLOW_I18N.habitsSummary[lang](grandDone, grandTotal, progressPct)}
            </span>
          </div>

          {/* Seta Próximo */}
          <button
            type="button"
            disabled={isToday}
            onClick={handleNextDay}
            className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isToday
                ? 'border-line/40 bg-[#101016] text-muted/30 cursor-not-allowed'
                : 'border-line/80 bg-[#1D1B28] hover:border-gold/50 text-muted hover:text-white cursor-pointer active:scale-95'
            }`}
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>
        </div>


      </div>

      {/* 2. CARD GRANDE DE CONSISTÊNCIA DIÁRIA (TOTALMENTE OTIMIZADO PARA MOBILE & DESKTOP) */}
      <div className="p-3.5 sm:p-5 rounded-2xl border border-line/80 bg-[#14141E] shadow-md flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1">
            {/* Tag de Motivação Dourada */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-gold/30 text-amber-300 text-[10px] sm:text-[11px] font-mono font-bold w-fit max-w-full truncate">
              <Sparkles size={11} className="shrink-0 text-gold" />
              <span className="truncate">{HABITFLOW_I18N.motivationalPhrase[lang]}</span>
            </div>

            {/* Título: Consistência Diária */}
            <h2 className="font-display font-black text-lg sm:text-2xl text-[#EDE5D5] tracking-wide truncate">
              {HABITFLOW_I18N.dailyConsistency[lang]}
            </h2>

            {/* Badges de Nível & Pilares Conquistados */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-gold/40 bg-[#1D1B28] text-white text-[10px] sm:text-[11px] font-mono font-bold">
                <Crown size={12} className="text-gold shrink-0" />
                <span>
                  <strong>Nível {stageNum}:</strong> {tierName}
                </span>
                <span className="text-gold font-bold ml-1">({progressDays * 250 + 550} XP)</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-gold/40 bg-[#1D1B28] text-gold text-[10px] sm:text-[11px] font-mono font-bold">
                <Trophy size={11} className="text-gold shrink-0" />
                <span>{HABITFLOW_I18N.conquests[lang](pillarsDoneCount, reqPillars.length)}</span>
              </span>

              {nt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-gold/30 bg-amber-500/10 text-amber-200 text-[10px] sm:text-[11px] font-mono font-bold">
                  <span>⏳ Faltam {Math.max(1, nt.min - progressDays)}d para {nt.name}</span>
                </span>
              )}
            </div>
          </div>

          {/* Anel Circular com Porcentagem em Ouro/Âmbar (com dimensões explícitas em pixels para evitar overflow no mobile) */}
          <div className="relative flex-none w-[76px] h-[76px] sm:w-[86px] sm:h-[86px] flex items-center justify-center shrink-0">
            <svg className="w-[76px] h-[76px] sm:w-[86px] sm:h-[86px] -rotate-90 block" viewBox="0 0 36 36">
              {/* Círculo base */}
              <path
                className="text-[#201F2C]"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Arco preenchido em ouro forjado */}
              <path
                className="text-amber-400 transition-all duration-700 ease-out"
                strokeDasharray={`${progressPct}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-sm sm:text-base text-gold leading-none">
                {progressPct}%
              </span>
              <span className="text-[7.5px] sm:text-[8px] font-mono font-black text-muted tracking-widest uppercase mt-0.5">
                {HABITFLOW_I18N.doneLabel[lang]}
              </span>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="w-full h-px bg-line/60 mt-1" />

        {/* Lema Tático das 24h & Tempo Restante do Dia (INTEGRADO DISCRETAMENTE NO RODAPÉ DO CARD) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted gap-2 flex-wrap">
          <span className="italic text-gold/80 font-serif">
            {HABITFLOW_I18N.mottoQuote[lang]}
          </span>
          <span className="font-bold text-amber-300">
            {HABITFLOW_I18N.hoursRemainingSuffix[lang](remHours, remMinutes)} · {HABITFLOW_I18N.dayPercentSuffix[lang](dayProgressPct)}
          </span>
        </div>
      </div>

      {/* 3. SEÇÃO DOS 3 PILARES DE COMBATE (DESTAQUE NOBRE COM BORDA DOURADA & SOMEM AO CONCLUIR) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10.5px] font-mono font-black text-gold uppercase tracking-widest flex items-center gap-1.5">
            <Shield size={13} className="text-gold" />
            <span>{HABITFLOW_I18N.pillarsSectionTitle[lang]}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted font-bold">
              {pillarsDoneCount}/3 {HABITFLOW_I18N.doneLabel[lang]}
            </span>
            {pillarsDoneCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setShowFinishedPillars((v) => !v);
                }}
                className="text-[10px] font-mono font-bold text-gold/80 hover:text-gold underline cursor-pointer"
              >
                {showFinishedPillars ? HABITFLOW_I18N.hideCompleted[lang] : HABITFLOW_I18N.showCompleted[lang]}
              </button>
            )}
          </div>
        </div>

        {/* Se todos os 3 pilares foram blindados e o guerreiro não pediu para exibir, mostra selo de honra intacta */}
        {allPillarsDone && !showFinishedPillars ? (
          <div className="p-3.5 rounded-2xl border border-gold/50 bg-gradient-to-r from-amber-950/40 via-[#181624] to-amber-950/40 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck size={18} className="text-gold flex-none" />
              <span className="text-xs font-mono font-bold text-gold truncate">
                {HABITFLOW_I18N.pillarsAllDone[lang]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                AF.click();
                setShowFinishedPillars(true);
              }}
              className="px-2.5 py-1 rounded-lg border border-gold/40 bg-gold/15 text-gold text-[10.5px] font-mono font-bold hover:bg-gold/25 transition-all cursor-pointer shrink-0"
            >
              {HABITFLOW_I18N.showCompleted[lang]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {visiblePillars.map((p) => {
              const isExpanded = expandedPillar === p.key;

              return (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl border transition-all overflow-hidden ${
                    p.isDone
                      ? 'border-gold/70 bg-gradient-to-r from-amber-950/40 to-[#14131C] shadow-[0_0_12px_rgba(250,204,21,0.15)]'
                      : 'border-gold/40 bg-gradient-to-r from-amber-950/20 via-[#161522] to-amber-950/20 hover:border-gold/70 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Checkbox Dourado */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePillarToggle(p);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none cursor-pointer active:scale-90 ${
                          p.isDone
                            ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                            : 'border-2 border-gold/40 bg-[#1D1B28] hover:border-gold'
                        }`}
                        title="Marcar pilar como vencido hoje"
                      >
                        {p.isDone && <Check size={18} strokeWidth={3.5} className="text-black" />}
                      </button>

                      {/* Informações do Pilar (Clique revela Cronômetro de Precisão) */}
                      <div
                        onClick={() => {
                          AF.click();
                          setExpandedPillar((prev) => (prev === p.key ? null : p.key));
                        }}
                        className="flex flex-col min-w-0 flex-1 cursor-pointer group"
                        title="Toque para ver cronômetro de precisão segundo a segundo"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base flex-none">{p.icon}</span>
                          <span className={`font-display font-black text-xs sm:text-sm tracking-wide truncate group-hover:text-gold transition-colors ${
                            p.isDone ? 'line-through text-muted' : 'text-[#EDE5D5]'
                          }`}>
                            {p.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/30 text-[9.5px] font-mono font-bold">
                            {p.cat}
                          </span>
                          <span className="text-[10px] font-mono text-muted flex items-center gap-0.5">
                            <Flame size={10} className="fill-amber-400 text-amber-400" />
                            <span>{p.days}d {HABITFLOW_I18N.timeInVigilLabel[lang]}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle de Cronômetro de Precisão */}
                    <button
                      type="button"
                      onClick={() => {
                        AF.click();
                        setExpandedPillar((prev) => (prev === p.key ? null : p.key));
                      }}
                      className="p-1 rounded-md text-muted hover:text-gold transition-colors flex-none pl-1"
                      title="Cronômetro de precisão"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Gaveta do Cronômetro de Precisão (Segundo a Segundo) */}
                  {isExpanded && (
                    <div className="p-2.5 border-t border-gold/30 bg-black/40 flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold text-muted uppercase tracking-wider">
                        <Timer size={12} className="text-gold" />
                        <span>{HABITFLOW_I18N.precisionTimerLabel[lang]}</span>
                      </span>
                      <span className="font-mono font-black text-xs text-amber-300 tracking-wider">
                        {p.timer}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. SEÇÃO DOS HÁBITOS DA FORJA (GRADE EM 4 COLUNAS & SOMEM AO CONCLUIR) */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10.5px] font-mono font-black text-gold/80 uppercase tracking-widest flex items-center gap-1.5">
            <Swords size={13} className="text-gold" />
            <span>{HABITFLOW_I18N.forgeHabitsTitle[lang]}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted font-bold">
              {habitsDoneCount}/{habitCards.length} {HABITFLOW_I18N.doneLabel[lang]}
            </span>
            {habitsDoneCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setShowFinishedHabits((v) => !v);
                }}
                className="text-[10px] font-mono font-bold text-gold/80 hover:text-gold underline cursor-pointer"
              >
                {showFinishedHabits ? HABITFLOW_I18N.hideCompleted[lang] : HABITFLOW_I18N.showCompleted[lang]}
              </button>
            )}
          </div>
        </div>

        {/* Se todos os hábitos foram concluídos e não pediu para exibir, mostra banner de vitória */}
        {allHabitsDone && !showFinishedHabits ? (
          <div className="p-3.5 rounded-2xl border border-gold/40 bg-gradient-to-r from-amber-950/30 via-[#14141E] to-amber-950/30 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Check size={18} strokeWidth={3} className="text-gold flex-none" />
              <span className="text-xs font-mono font-bold text-gold truncate">
                {HABITFLOW_I18N.habitsAllDone[lang]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                AF.click();
                setShowFinishedHabits(true);
              }}
              className="px-2.5 py-1 rounded-lg border border-gold/40 bg-gold/15 text-gold text-[10.5px] font-mono font-bold hover:bg-gold/25 transition-all cursor-pointer shrink-0"
            >
              {HABITFLOW_I18N.showCompleted[lang]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
            {visibleHabits.map((h) => {
              return (
                <div
                  key={h.id}
                  onClick={() => handleHabitToggle(h)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
                    h.isDone
                      ? 'border-gold/60 bg-gradient-to-r from-amber-950/30 to-[#14131C]'
                      : 'border-line/70 bg-[#14141E] hover:border-gold/50 hover:bg-[#181826]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox Dourado */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none ${
                        h.isDone
                          ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                          : 'border-2 border-line/80 bg-[#1D1B28]'
                      }`}
                    >
                      {h.isDone && <Check size={18} strokeWidth={3.5} className="text-black" />}
                    </div>

                    {/* Nome + Tags */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base flex-none">{h.icon}</span>
                        <span
                          className={`font-display font-black text-xs sm:text-sm tracking-wide truncate ${
                            h.isDone ? 'line-through text-muted' : 'text-[#EDE5D5]'
                          }`}
                        >
                          {h.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="px-1.5 py-0.2 rounded bg-surface border border-line/60 text-muted text-[9.5px] font-mono">
                          {h.cat}
                        </span>

                        {h.time && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-mono text-gold font-bold">
                            <Bell size={10} className="text-gold" />
                            <span>{h.time}</span>
                          </span>
                        )}

                        {h.streak > 0 && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-mono font-bold text-amber-400">
                            <Flame size={10} className="fill-amber-400 text-amber-400" />
                            <span>{h.streak} {h.streak === 1 ? HABITFLOW_I18N.daysWord[lang] : HABITFLOW_I18N.daysPluralWord[lang]}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações Lápis e Lixeira */}
                  <div className="flex items-center gap-1 flex-none text-muted/60 pl-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCreateHabit) onCreateHabit();
                      }}
                      className="p-1 hover:text-gold transition-colors"
                      title="Editar na Forja"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNotify) onNotify('Hábito pode ser gerenciado na aba A Forja');
                      }}
                      className="p-1 hover:text-red-400 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. BOTÃO SOLENE DE QUEDA EM COMBATE NO RODAPÉ (MINIMALISTA, DISCRETO E SÓBRIO) */}
      {onFailFlow && (
        <div className="w-full mt-2">
          <button
            type="button"
            onClick={onFailFlow}
            className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/30 via-[#151015] to-red-950/30 hover:border-red-500/60 hover:bg-red-950/50 text-red-400/90 hover:text-red-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] shadow-xs"
          >
            <span>{HABITFLOW_I18N.btnRegisterFall[lang]}</span>
          </button>
        </div>
      )}
    </div>
  );
}
