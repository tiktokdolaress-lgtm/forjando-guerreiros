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
    pt: (c, t) => `${c}/${t} Conquistas`,
    en: (c, t) => `${c}/${t} Achievements`,
    es: (c, t) => `${c}/${t} Conquistas`,
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
      pt: 'Autodomínio / Sem Masturbação',
      en: 'Self-Mastery / No Masturbation',
      es: 'Autodominio / Sin Masturbación',
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

  // Formatação de data em destaque idêntica ao print: "Sexta-Feira, 16 De Outubro"
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

  // Lista Unificada: 3 Pilares + Hábitos da Forja
  const reqPillars = useMemo(() => L.pillars(S) || ['r', 'p', 'm'], [S]);
  const cData = useMemo(() => L.ci(S, selectedDate) || {}, [S, selectedDate]);
  const doneHabitsMap = useMemo(() => (S && S.forge && S.forge.done) || {}, [S]);
  const selectedDoneHabits = doneHabitsMap[selectedDate] || [];

  // Itens unificados para o grid
  const allCardItems = useMemo(() => {
    const items = [];

    // Pilares
    reqPillars.forEach((k) => {
      const conf = HABITFLOW_I18N.pillars[k] || {
        pt: `Pilar ${k}`,
        en: `Pillar ${k}`,
        es: `Pilar ${k}`,
        icon: '🛡️',
        cat: { pt: 'Forja', en: 'Forge', es: 'Forja' },
        time: '08:00',
      };
      const isDone = !!cData[k];
      items.push({
        type: 'pillar',
        id: `pillar_${k}`,
        rawKey: k,
        name: conf[lang] || conf.pt,
        icon: conf.icon,
        cat: conf.cat[lang] || conf.cat.pt,
        time: conf.time,
        streak: progressDays,
        isDone,
      });
    });

    // Hábitos da Forja
    activeHabits.forEach((h) => {
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

      items.push({
        type: 'habit',
        id: `habit_${h.id}`,
        rawKey: h.id,
        name: h.n || h.name || h.title || 'Hábito',
        icon: h.icon || '⚡',
        cat: catLabel,
        time,
        streak,
        isDone,
      });
    });

    return items;
  }, [reqPillars, cData, activeHabits, selectedDoneHabits, lang, progressDays, getHabitStreak, getHabitCategory, S]);

  // Contagem de Conclusão
  const totalCount = allCardItems.length;
  const doneCount = allCardItems.filter((x) => x.isDone).length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Patente e Nível
  const safeTier = tier || L.tierNow(S);
  const tierName = (safeTier && safeTier.name) || (lang === 'en' ? 'Unstoppable Legend' : 'Lenda Imparável');
  const stageNum = safeTier && typeof safeTier.min === 'number'
    ? safeTier.min >= 730 ? 11 : safeTier.min >= 365 ? 10 : safeTier.min >= 270 ? 9 : safeTier.min >= 180 ? 8 : safeTier.min >= 120 ? 7 : safeTier.min >= 61 ? 6 : safeTier.min >= 31 ? 5 : safeTier.min >= 15 ? 4 : safeTier.min >= 7 ? 3 : safeTier.min >= 3 ? 2 : 1
    : 7;

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

  // Clique no Card / Checkbox
  const handleToggleItem = (item) => {
    if (isFuture) {
      if (onNotify) onNotify(HABITFLOW_I18N.futureNotice[lang]);
      return;
    }
    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(HABITFLOW_I18N.lockedPastNotice[lang]);
      return;
    }

    if (item.type === 'pillar') {
      if (setCI) {
        AF.click();
        setCI(item.rawKey, !item.isDone, selectedDate);
      }
    } else {
      if (onToggleHabit) {
        onToggleHabit(item.rawKey, selectedDate);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0">
      {/* 1. BARRA SUPERIOR DE DATA & SELETOR DE DIAS (EXATAMENTE COMO NO PRINT DO HABITFLOW) */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl border border-[#2B2D31] bg-[#181A1C] shadow-sm select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Botão Seta Anterior */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="w-8 h-8 rounded-xl border border-[#2F3136] bg-[#222428] hover:border-[#4E5058] text-[#949BA4] hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Título da Data + Badge Hoje */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-black text-sm sm:text-base text-white tracking-wide truncate">
                {dateFormattedTitle}
              </span>
              {isToday ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.todayBadge[lang]}
                </span>
              ) : isYesterday ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  {HABITFLOW_I18N.yesterdayBadge[lang]}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-[#2B2D31] text-[#949BA4] text-[10px] font-mono flex items-center gap-1">
                  <Lock size={9} />
                  <span>{fmtD(selectedDate)}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-[#8E9296] truncate mt-0.5">
              {HABITFLOW_I18N.habitsSummary[lang](doneCount, totalCount, progressPct)}
            </span>
          </div>

          {/* Botão Seta Próximo */}
          <button
            type="button"
            disabled={isToday}
            onClick={handleNextDay}
            className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
              isToday
                ? 'border-[#242629] bg-[#161719] text-[#4E5058] cursor-not-allowed'
                : 'border-[#2F3136] bg-[#222428] hover:border-[#4E5058] text-[#949BA4] hover:text-white cursor-pointer active:scale-95'
            }`}
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Botão "+ Novo Hábito" Verde Esmeralda Exato do Print */}
        <button
          type="button"
          onClick={() => {
            if (onCreateHabit) onCreateHabit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#00C48C] hover:bg-[#00D699] text-white font-display font-black text-xs sm:text-sm tracking-wide shadow-[0_0_12px_rgba(0,196,140,0.3)] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={3} />
          <span>{HABITFLOW_I18N.btnNewHabit[lang]}</span>
        </button>
      </div>

      {/* 2. CARD GRANDE DE "CONSISTÊNCIA DIÁRIA" COM ANEL DE 33% (EXATAMENTE COMO NO PRINT) */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#2B2D31] bg-[#181A1C] shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Tag de Motivação Verde Ciano */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00C48C]/15 border border-[#00C48C]/35 text-[#00C48C] text-[11px] font-mono font-bold w-fit">
              <Sparkles size={12} className="shrink-0" />
              <span className="truncate">{HABITFLOW_I18N.motivationalPhrase[lang]}</span>
            </div>

            {/* Título: Consistência Diária */}
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
              {HABITFLOW_I18N.dailyConsistency[lang]}
            </h2>

            {/* Badges de Nível & Conquistas */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#3A3D44] bg-[#222428] text-white text-[11px] font-mono font-bold">
                <Crown size={13} className="text-[#F1C40F]" />
                <span>
                  <strong>Nível {stageNum}:</strong> {tierName}
                </span>
                <span className="text-[#F1C40F] font-bold">({progressDays * 250 + 550} XP)</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#3A3D44] bg-[#222428] text-[#F1C40F] text-[11px] font-mono font-bold">
                <Trophy size={12} className="text-[#F1C40F]" />
                <span>{HABITFLOW_I18N.conquests[lang](doneCount, totalCount)}</span>
              </span>
            </div>
          </div>

          {/* Anel Circular com Porcentagem (ex: 33% FEITO) */}
          <div className="relative flex-none w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Fundo do círculo */}
              <path
                className="text-[#25282C]"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Arco preenchido ciano/esmeralda */}
              <path
                className="text-[#00C48C] transition-all duration-700 ease-out"
                strokeDasharray={`${progressPct}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-sm sm:text-base text-white leading-none">
                {progressPct}%
              </span>
              <span className="text-[7.5px] sm:text-[8px] font-mono font-black text-[#8E9296] tracking-widest uppercase mt-0.5">
                {HABITFLOW_I18N.doneLabel[lang]}
              </span>
            </div>
          </div>
        </div>

        {/* Linha Fina Cinza Divisória na Base */}
        <div className="w-full h-1 rounded-full bg-[#25282C] mt-1" />
      </div>

      {/* 3. GRADE DOS CARDS DE HÁBITOS (EXATAMENTE COMO NO PRINT EM 4 COLUNAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
        {allCardItems.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all select-none cursor-pointer active:scale-[0.98] ${
                item.isDone
                  ? 'border-[#2B2D31] bg-[#181A1C]'
                  : 'border-[#2B2D31] bg-[#181A1C] hover:border-[#3F4248]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Checkbox Quadrado com Cantos Arredondados */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none ${
                    item.isDone
                      ? 'bg-[#00C48C] text-white shadow-[0_0_10px_rgba(0,196,140,0.35)]'
                      : 'border-2 border-[#3F4248] bg-[#222428]'
                  }`}
                >
                  {item.isDone && <Check size={18} strokeWidth={3.5} className="text-white" />}
                </div>

                {/* Nome do Hábito + Tags (Categoria, Horário, Streak) */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base flex-none">{item.icon}</span>
                    <span
                      className={`font-display font-black text-xs sm:text-sm tracking-wide truncate ${
                        item.isDone ? 'line-through text-[#8E9296]' : 'text-white'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {/* Categoria */}
                    <span className="px-1.5 py-0.2 rounded bg-[#25282C] text-[#8E9296] text-[9.5px] font-mono">
                      {item.cat}
                    </span>

                    {/* Horário com Sino */}
                    {item.time && (
                      <span className="flex items-center gap-0.5 text-[9.5px] font-mono text-[#F1C40F]">
                        <Bell size={10} className="text-[#F1C40F]" />
                        <span>{item.time}</span>
                      </span>
                    )}

                    {/* Streak com Fogo */}
                    {item.streak > 0 && (
                      <span className="flex items-center gap-0.5 text-[9.5px] font-mono font-bold text-[#FF5A5F]">
                        <Flame size={10} className="fill-[#FF5A5F]" />
                        <span>{item.streak} {item.streak === 1 ? HABITFLOW_I18N.daysWord[lang] : HABITFLOW_I18N.daysPluralWord[lang]}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões Lápis e Lixeira Discretos à Direita */}
              <div className="flex items-center gap-1 flex-none text-[#5C6068] pl-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCreateHabit) onCreateHabit();
                  }}
                  className="p-1 hover:text-[#949BA4] transition-colors"
                  title="Editar"
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
    </div>
  );
}
