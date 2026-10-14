'use client';
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flame,
  Clock,
  Sparkles,
  Edit3,
  Archive,
  Trash2,
  Check,
  X,
  Compass,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { today, getPast7Days, fmtD, parseD, dstr } from '@/lib/utils';
import { AF } from '@/lib/audio';

const MATRIX_I18N = {
  sheetTitle: {
    pt: 'MATRIZ SEMANAL DE HÁBITOS',
    en: 'WEEKLY HABIT MATRIX',
    es: 'MATRIZ SEMANAL DE HÁBITOS',
  },
  futureWarning: {
    pt: 'O futuro ainda não existe. Apenas o dia de hoje pode ser combatido.',
    en: 'The future does not exist yet. Only today can be fought.',
    es: 'El futuro aún no existe. Solo el día de hoy puede ser combatido.',
  },
  sheetSubtitle: {
    pt: 'Hoje e os últimos 6 dias de consistência · 1 toque para marcar ou alternar',
    en: 'Today and the last 6 days of consistency · 1 tap to check or toggle',
    es: 'Hoy y los últimos 6 días de consistencia · 1 toque para marcar o alternar',
  },
  thisWeekBtn: {
    pt: 'Esta Semana',
    en: 'This Week',
    es: 'Esta Semana',
  },
  prevWeek: {
    pt: 'Semana Anterior',
    en: 'Previous Week',
    es: 'Semana Anterior',
  },
  nextWeek: {
    pt: 'Próxima Semana',
    en: 'Next Week',
    es: 'Próxima Semana',
  },
  todayBadge: {
    pt: 'HOJE',
    en: 'TODAY',
    es: 'HOY',
  },
  colHabit: {
    pt: 'HÁBITO & PILAR',
    en: 'HABIT & PILLAR',
    es: 'HÁBITO Y PILAR',
  },
  colWeekRate: {
    pt: 'CONSISTÊNCIA',
    en: 'CONSISTENCY',
    es: 'CONSISTENCIA',
  },
  colStreak: {
    pt: 'SEQUÊNCIA',
    en: 'STREAK',
    es: 'RACHA',
  },
  colActions: {
    pt: 'AÇÕES',
    en: 'ACTIONS',
    es: 'ACCIONES',
  },
  dailyRateRow: {
    pt: 'TAXA DO DIA',
    en: 'DAILY RATE',
    es: 'TASA DEL DÍA',
  },
  weekAverageRow: {
    pt: 'MÉDIA DA SEMANA',
    en: 'WEEK AVERAGE',
    es: 'PROMEDIO SEMANAL',
  },
  filterAll: {
    pt: 'Todos',
    en: 'All',
    es: 'Todos',
  },
  filterBody: {
    pt: '🛡️ Corpo',
    en: '🛡️ Body',
    es: '🛡️ Cuerpo',
  },
  filterMind: {
    pt: '🧠 Mente',
    en: '🧠 Mind',
    es: '🧠 Mente',
  },
  filterSpirit: {
    pt: '⚡ Espírito',
    en: '⚡ Spirit',
    es: '⚡ Espíritu',
  },
  statTodayForged: {
    pt: 'HÁBITOS HOJE',
    en: 'HABITS TODAY',
    es: 'HÁBITOS HOY',
  },
  statWeekConsistency: {
    pt: 'CONSISTÊNCIA SEMANAL',
    en: 'WEEK CONSISTENCY',
    es: 'CONSISTENCIA SEMANAL',
  },
  statActiveStreak: {
    pt: 'MAIOR SEQUÊNCIA',
    en: 'BEST STREAK',
    es: 'MEJOR RACHA',
  },
  noHabitsTitle: {
    pt: 'Nenhum hábito ativo neste filtro',
    en: 'No active habits in this filter',
    es: 'Ningún hábito activo en este filtro',
  },
  noHabitsSub: {
    pt: 'Adicione novos hábitos ou ative hábitos do seu arsenal de reserva.',
    en: 'Add new habits or activate habits from your reserve arsenal.',
    es: 'Añade nuevos hábitos o activa hábitos de tu arsenal de reserva.',
  },
  createNewHabit: {
    pt: '+ Criar Novo Hábito',
    en: '+ Create New Habit',
    es: '+ Crear Nuevo Hábito',
  },
  reserveArsenalBtn: {
    pt: '📦 Ver Arsenal de Reserva',
    en: '📦 View Reserve Arsenal',
    es: '📦 Ver Arsenal de Reserva',
  },
  editBtn: {
    pt: 'Editar Hábito',
    en: 'Edit Habit',
    es: 'Editar Hábito',
  },
  reserveBtn: {
    pt: 'Mover para Reserva',
    en: 'Move to Reserve',
    es: 'Mover a Reserva',
  },
  daysWord: {
    pt: 'dias',
    en: 'days',
    es: 'días',
  },
  legendTitle: {
    pt: 'Legenda da Planilha:',
    en: 'Spreadsheet Legend:',
    es: 'Leyenda de la Planilla:',
  },
  legendDone: {
    pt: '✓ Forjado (Vitória)',
    en: '✓ Forged (Victory)',
    es: '✓ Forjado (Victoria)',
  },
  legendFail: {
    pt: '✕ Falha / Negligência',
    en: '✕ Missed / Failed',
    es: '✕ Falla / Negligencia',
  },
  legendPending: {
    pt: '· Pendente (Toque para marcar)',
    en: '· Pending (Tap to mark)',
    es: '· Pendiente (Toca para marcar)',
  },
};

const WEEKDAY_NAMES = {
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};

export default function HabitSpreadsheetMatrix({
  habits = [],
  S,
  curLang = 'pt',
  onToggleDay,
  onEditHabit,
  onMoveToReserve,
  onCreateHabit,
  onOpenReserve,
  getHabitStreak,
  getHabitCategory,
  isCustomHabit,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [pillarFilter, setPillarFilter] = useState('all');

  const todayStr = today();
  const weekDays = useMemo(() => getPast7Days(todayStr, weekOffset), [todayStr, weekOffset]);

  const doneMap = useMemo(() => (S && S.forge && S.forge.done) || {}, [S]);
  const failMap = useMemo(() => (S && S.forge && S.forge.failed) || {}, [S]);

  const lang = ['pt', 'en', 'es'].includes(curLang) ? curLang : 'pt';
  const T = (key) => (MATRIX_I18N[key] && MATRIX_I18N[key][lang]) || '';
  const weekdays = WEEKDAY_NAMES[lang] || WEEKDAY_NAMES.pt;

  // Filtragem por Pilar
  const filteredHabits = useMemo(() => {
    if (pillarFilter === 'all') return habits;
    return habits.filter((h) => {
      const cat = (getHabitCategory && getHabitCategory(h)) || h.category || 'body';
      return cat === pillarFilter;
    });
  }, [habits, pillarFilter, getHabitCategory]);

  // Estatísticas Rápidas
  const todayDoneCount = useMemo(() => {
    const todayList = doneMap[todayStr] || [];
    return habits.filter((h) => todayList.some((id) => String(id) === String(h.id))).length;
  }, [habits, doneMap, todayStr]);

  const todayPct = habits.length > 0 ? Math.round((todayDoneCount / habits.length) * 100) : 0;

  // Total da semana para cálculo de consistência global
  const { weekTotalDone, weekTotalPossible, weekConsistencyPct } = useMemo(() => {
    if (habits.length === 0) return { weekTotalDone: 0, weekTotalPossible: 0, weekConsistencyPct: 0 };
    let done = 0;
    const totalPossible = habits.length * 7;
    weekDays.forEach((ds) => {
      const dList = doneMap[ds] || [];
      habits.forEach((h) => {
        if (dList.some((id) => String(id) === String(h.id))) {
          done++;
        }
      });
    });
    const pct = totalPossible > 0 ? Math.round((done / totalPossible) * 100) : 0;
    return { weekTotalDone: done, weekTotalPossible: totalPossible, weekConsistencyPct: pct };
  }, [habits, weekDays, doneMap]);

  // Melhor streak
  const bestStreak = useMemo(() => {
    if (!getHabitStreak || habits.length === 0) return 0;
    return habits.reduce((max, h) => Math.max(max, getHabitStreak(h.id) || 0), 0);
  }, [habits, getHabitStreak]);

  // Taxa de cada dia da semana para o rodapé da tabela
  const dailyStats = useMemo(() => {
    return weekDays.map((ds) => {
      const dList = doneMap[ds] || [];
      const fList = failMap[ds] || [];
      const doneCount = habits.filter((h) => dList.some((id) => String(id) === String(h.id))).length;
      const failCount = habits.filter((h) => fList.some((id) => String(id) === String(h.id))).length;
      const pct = habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0;
      return { ds, doneCount, failCount, pct };
    });
  }, [weekDays, doneMap, failMap, habits]);

  // Data formatada de início e fim da semana
  const weekRangeLabel = useMemo(() => {
    if (weekDays.length < 7) return '';
    const start = fmtD(weekDays[0]);
    const end = fmtD(weekDays[6]);
    return `${start} — ${end}`;
  }, [weekDays]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-full min-w-0 select-none">
      {/* 1. BARRA SUPERIOR DA PLANILHA: CONTROLES DE SEMANA, PILARES E AÇÕES */}
      <div className="p-3 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Título & Subtítulo */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base">📑</span>
              <h3 className="font-display font-black text-xs sm:text-sm text-gold tracking-wide uppercase truncate">
                {T('sheetTitle')}
              </h3>
            </div>
            <p className="text-[10px] text-muted font-mono truncate mt-0.5">
              {T('sheetSubtitle')}
            </p>
          </div>

          {/* Navegador de Semanas */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                AF.click();
                setWeekOffset((w) => w - 1);
              }}
              title={T('prevWeek')}
              className="p-1.5 rounded-lg border border-line bg-surface hover:border-gold/50 text-muted hover:text-gold transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="text-[11px] font-mono font-bold text-ink px-2.5 py-1 rounded-lg border border-line/60 bg-surface2/80 truncate">
              {weekRangeLabel}
            </span>

            <button
              type="button"
              disabled={weekOffset >= 0}
              onClick={() => {
                if (weekOffset >= 0) return;
                AF.click();
                setWeekOffset((w) => Math.min(0, w + 1));
              }}
              title={T('nextWeek')}
              className={`p-1.5 rounded-lg border border-line bg-surface transition-colors ${
                weekOffset >= 0
                  ? 'opacity-25 cursor-not-allowed text-muted/30'
                  : 'hover:border-gold/50 text-muted hover:text-gold cursor-pointer'
              }`}
            >
              <ChevronRight size={15} />
            </button>

            {weekOffset !== 0 && (
              <button
                type="button"
                onClick={() => {
                  AF.click();
                  setWeekOffset(0);
                }}
                className="text-[10px] font-mono font-black px-2 py-1 rounded-lg border border-gold/50 bg-gold/20 text-gold hover:bg-gold/30 transition-all cursor-pointer"
              >
                {T('thisWeekBtn')} ↺
              </button>
            )}

            {onCreateHabit && (
              <button
                type="button"
                onClick={onCreateHabit}
                className="btn-gold text-[10.5px] font-black py-1 px-2.5 rounded-lg flex items-center gap-1 ml-1 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus size={13} strokeWidth={3} />
                <span>{lang === 'en' ? 'New' : lang === 'es' ? 'Nuevo' : 'Novo'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Linha de Filtro por Pilar */}
        <div className="pt-2 border-t border-line/40 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5">
            {[
              { id: 'all', label: T('filterAll') },
              { id: 'body', label: T('filterBody') },
              { id: 'mind', label: T('filterMind') },
              { id: 'spirit', label: T('filterSpirit') },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  AF.click();
                  setPillarFilter(f.id);
                }}
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  pillarFilter === f.id
                    ? 'border-gold bg-gold text-black shadow-xs'
                    : 'border-line/60 bg-surface text-muted hover:text-ink hover:border-gold/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Legenda Resumida da Grade */}
          <div className="hidden md:flex items-center gap-2 text-[9.5px] font-mono text-muted">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-400 text-black font-black flex items-center justify-center text-[8px]">✓</span>
              <span>{T('legendDone')}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/60 text-red-400 font-bold flex items-center justify-center text-[8px]">✕</span>
              <span>{T('legendFail')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MINI CARDS DE PERFORMANCE DA SEMANA (ESTILO DASHBOARD / VÍDEOS) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 sm:p-2.5 rounded-xl border border-line/70 bg-[#15151E] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[9.5px] font-mono font-bold text-muted uppercase tracking-wider truncate">
            {T('statTodayForged')}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-gold">
              {todayDoneCount}/{habits.length}
            </span>
            <span className="text-[10px] font-mono text-muted">({todayPct}%)</span>
          </div>
          <div className="w-full h-1 rounded-full bg-surface2 mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-gold rounded-full transition-all"
              style={{ width: `${todayPct}%` }}
            />
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl border border-line/70 bg-[#15151E] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[9.5px] font-mono font-bold text-muted uppercase tracking-wider truncate">
            {T('statWeekConsistency')}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base sm:text-lg font-black font-mono text-amber-300">
              {weekConsistencyPct}%
            </span>
            <span className="text-[10px] font-mono text-muted">
              ({weekTotalDone}/{weekTotalPossible})
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-surface2 mt-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                weekConsistencyPct >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : weekConsistencyPct >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${weekConsistencyPct}%` }}
            />
          </div>
        </div>

        <div className="p-2 sm:p-2.5 rounded-xl border border-line/70 bg-[#15151E] flex flex-col justify-between">
          <span className="text-[9px] sm:text-[9.5px] font-mono font-bold text-muted uppercase tracking-wider truncate">
            {T('statActiveStreak')}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Flame size={16} className="text-amber-400 shrink-0" />
            <span className="text-base sm:text-lg font-black font-mono text-amber-300">
              {bestStreak}
            </span>
            <span className="text-[10px] font-mono text-muted">{T('daysWord')}</span>
          </div>
          <div className="w-full h-1 rounded-full bg-amber-500/20 mt-1">
            <div className="h-full bg-amber-400 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* 3. A PLANILHA / TABELA TÁTICA DE HÁBITOS */}
      {filteredHabits.length > 0 ? (
        <div className="w-full rounded-xl border border-line/80 bg-[#121219] overflow-hidden shadow-lg">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-stone-700">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* CABEÇALHO DA TABELA */}
              <thead>
                <tr className="border-b border-line/80 bg-[#181723] text-[10px] font-mono text-muted">
                  {/* Coluna Sticky do Hábito */}
                  <th className="py-2.5 px-3 font-black uppercase tracking-wider sticky left-0 bg-[#181723] z-20 shadow-[2px_0_6px_rgba(0,0,0,0.5)] min-w-[190px] sm:min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span>{T('colHabit')}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface border border-line/50 text-gold font-bold">
                        {filteredHabits.length}
                      </span>
                    </div>
                  </th>

                  {/* 7 Colunas dos Dias da Semana */}
                  {weekDays.map((ds) => {
                    const isToday = ds === todayStr;
                    const isFuture = ds > todayStr;
                    const dayNum = ds.split('-')[2];
                    const dateObj = parseD(ds);
                    const wName = weekdays[dateObj.getDay()] || '';

                    return (
                      <th
                        key={ds}
                        className={`py-2 px-1 text-center font-bold min-w-[46px] sm:min-w-[54px] border-l border-line/40 ${
                          isToday
                            ? 'bg-gradient-to-b from-amber-500/20 via-gold/10 to-transparent border-t-2 border-t-gold text-gold shadow-inner'
                            : 'hover:bg-surface/30'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          {isToday ? (
                            <span className="px-1 py-0.2 rounded bg-gold text-black text-[7.5px] font-black tracking-widest uppercase">
                              {T('todayBadge')}
                            </span>
                          ) : (
                            <span className="text-[8.5px] text-muted uppercase tracking-wider">
                              {wName}
                            </span>
                          )}
                          <span
                            className={`text-xs font-mono font-black ${
                              isToday ? 'text-gold text-sm' : 'text-[#EDE5D5]'
                            }`}
                          >
                            {dayNum}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  {/* Coluna Consistência da Semana */}
                  <th className="py-2.5 px-2 text-center font-black uppercase tracking-wider border-l border-line/40 min-w-[85px]">
                    {T('colWeekRate')}
                  </th>

                  {/* Coluna Sequência */}
                  <th className="py-2.5 px-2 text-center font-black uppercase tracking-wider border-l border-line/40 min-w-[70px]">
                    {T('colStreak')}
                  </th>

                  {/* Coluna Ações Rápidas */}
                  <th className="py-2.5 px-2 text-center font-black uppercase tracking-wider border-l border-line/40 min-w-[65px]">
                    {T('colActions')}
                  </th>
                </tr>
              </thead>

              {/* CORPO DA PLANILHA (LINHAS DE HÁBITOS) */}
              <tbody className="divide-y divide-line/40 text-xs">
                {filteredHabits.map((h, rIdx) => {
                  const isCustom = isCustomHabit && isCustomHabit(h.id);
                  const streakCount = getHabitStreak ? getHabitStreak(h.id) : 0;
                  const cat = (getHabitCategory && getHabitCategory(h)) || h.category || 'body';
                  const time = (S.forge && S.forge.times && S.forge.times[h.id]) || '';

                  // Cálculo de conclusão deste hábito na semana
                  let habitWeekDone = 0;
                  weekDays.forEach((ds) => {
                    const dList = doneMap[ds] || [];
                    if (dList.some((id) => String(id) === String(h.id))) habitWeekDone++;
                  });
                  const habitWeekPct = Math.round((habitWeekDone / 7) * 100);

                  const catBadge =
                    cat === 'body'
                      ? { label: lang === 'en' ? 'Body' : lang === 'es' ? 'Cuerpo' : 'Corpo', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' }
                      : cat === 'mind'
                      ? { label: lang === 'en' ? 'Mind' : lang === 'es' ? 'Mente' : 'Mente', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' }
                      : cat === 'mission'
                      ? { label: lang === 'en' ? 'Mission' : lang === 'es' ? 'Misión' : 'Missão', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' }
                      : { label: lang === 'en' ? 'Spirit' : lang === 'es' ? 'Espíritu' : 'Espírito', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' };

                  return (
                    <tr
                      key={h.id}
                      className={`transition-colors group ${
                        rIdx % 2 === 0 ? 'bg-[#14131C]' : 'bg-[#161520]'
                      } hover:bg-[#1C1B2A]`}
                    >
                      {/* Coluna Sticky do Hábito (Ícone, Nome, Pilar, Horário) */}
                      <td className={`py-2 px-3 sticky left-0 z-10 shadow-[2px_0_6px_rgba(0,0,0,0.5)] border-r border-line/40 ${
                        rIdx % 2 === 0 ? 'bg-[#14131C]' : 'bg-[#161520]'
                      } group-hover:bg-[#1C1B2A]`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg flex-none select-none drop-shadow-sm">
                            {h.icon || '⚡'}
                          </span>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-xs sm:text-[13px] text-[#F5EEDC] truncate leading-tight group-hover:text-gold transition-colors">
                              {h.n || h.name || h.title || ''}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9.5px] font-mono text-muted truncate">
                              <span className={`px-1.5 py-0.2 rounded border font-semibold text-[8.5px] ${catBadge.color}`}>
                                {catBadge.label}
                              </span>
                              {time && (
                                <span className="flex items-center gap-0.5 text-gold/90 font-medium">
                                  <Clock size={9} />
                                  <span>{time}</span>
                                </span>
                              )}
                              {isCustom && (
                                <span className="text-amber-400 font-bold">★</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 7 Células Interativas dos Dias */}
                      {weekDays.map((ds) => {
                        const isToday = ds === todayStr;
                        const dList = doneMap[ds] || [];
                        const fList = failMap[ds] || [];
                        const isDone = dList.some((id) => String(id) === String(h.id));
                        const isFail = fList.some((id) => String(id) === String(h.id));

                        return (
                          <td
                            key={ds}
                            className={`p-1 text-center border-l border-line/40 align-middle ${
                              isToday ? 'bg-amber-500/5' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => { if (isFuture) return; onToggleDay && onToggleDay(h.id, ds); }}
                              title={isFuture ? `${h.n || h.name} · ${fmtD(ds)} (${T('futureWarning')})` : `${h.n || h.name} · ${fmtD(ds)}: ${
                                isDone ? T('legendDone') : isFail ? T('legendFail') : T('legendPending')
                              }`}
                              className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-lg flex items-center justify-center text-xs font-black transition-all active:scale-90 cursor-pointer select-none ${
                                isDone
                                  ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.35)] scale-100'
                                  : isFail
                                  ? 'bg-red-500/20 border border-red-500/70 text-red-400 hover:bg-red-500/30'
                                  : isFuture
                                  ? 'bg-black/30 border border-line/20 opacity-25 cursor-not-allowed text-muted/10'
                                  : isToday
                                  ? 'bg-[#181824] border-2 border-gold/60 hover:border-gold hover:bg-[#222132] text-muted/30 hover:text-gold shadow-sm'
                                  : 'bg-[#15151F] border border-line/50 hover:border-gold/50 hover:bg-[#1E1E2B] text-muted/20 hover:text-muted'
                              }`}
                            >
                              {isDone ? (
                                <Check size={16} strokeWidth={3} className="text-black" />
                              ) : isFail ? (
                                <X size={14} strokeWidth={2.5} className="text-red-400" />
                              ) : (
                                <span className="opacity-0 group-hover:opacity-40 text-xs">·</span>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Coluna Consistência da Semana */}
                      <td className="py-2 px-2 text-center border-l border-line/40">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="font-mono font-bold text-[11px] text-ink">
                            {habitWeekDone}/7
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-surface2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                habitWeekPct >= 85
                                  ? 'bg-emerald-400'
                                  : habitWeekPct >= 50
                                  ? 'bg-gold'
                                  : 'bg-amber-600'
                              }`}
                              style={{ width: `${habitWeekPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Coluna Sequência */}
                      <td className="py-2 px-2 text-center border-l border-line/40">
                        {streakCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300">
                            <Flame size={11} className="text-amber-400 shrink-0" />
                            <span>{streakCount}d</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted/50">—</span>
                        )}
                      </td>

                      {/* Coluna Ações (Editar, Reserva) */}
                      <td className="py-2 px-2 text-center border-l border-line/40">
                        <div className="flex items-center justify-center gap-1">
                          {isCustom && onEditHabit && (
                            <button
                              type="button"
                              onClick={() => onEditHabit(h)}
                              title={T('editBtn')}
                              className="p-1.5 rounded hover:bg-gold/20 text-muted hover:text-gold transition-colors cursor-pointer"
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                          {onMoveToReserve && (
                            <button
                              type="button"
                              onClick={() => onMoveToReserve(h.id)}
                              title={T('reserveBtn')}
                              className="p-1.5 rounded hover:bg-surface2 text-muted hover:text-ink transition-colors cursor-pointer"
                            >
                              <Archive size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* RODAPÉ DA PLANILHA: TAXA DO DIA & CONSISTÊNCIA */}
              <tfoot>
                <tr className="border-t-2 border-line/80 bg-[#161522] text-[10px] font-mono font-bold">
                  {/* Célula Sticky do Total */}
                  <td className="py-2.5 px-3 uppercase tracking-wider sticky left-0 bg-[#161522] z-20 shadow-[2px_0_6px_rgba(0,0,0,0.5)] border-r border-line/40">
                    <div className="flex items-center gap-1.5 text-gold">
                      <span className="text-xs">📊</span>
                      <span className="font-black truncate">{T('dailyRateRow')}</span>
                    </div>
                  </td>

                  {/* 7 Totais dos Dias da Semana */}
                  {dailyStats.map(({ ds, doneCount, pct }) => {
                    const isToday = ds === todayStr;
                    return (
                      <td
                        key={ds}
                        className={`py-2 px-1 text-center border-l border-line/40 align-middle ${
                          isToday ? 'bg-amber-500/10' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <span
                            className={`font-black text-[11px] ${
                              pct >= 100
                                ? 'text-emerald-400'
                                : pct >= 50
                                ? 'text-gold'
                                : pct > 0
                                ? 'text-amber-300'
                                : 'text-muted/60'
                            }`}
                          >
                            {pct}%
                          </span>
                          <span className="text-[8.5px] text-muted">
                            {doneCount}/{habits.length}
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  {/* Média Semanal Global */}
                  <td className="py-2.5 px-2 text-center border-l border-line/40">
                    <span className="font-black text-[11px] text-amber-300">
                      {weekConsistencyPct}%
                    </span>
                  </td>

                  <td colSpan={2} className="py-2.5 px-2 text-center border-l border-line/40 text-[9px] text-muted">
                    {lang === 'en' ? 'Active Forge' : lang === 'es' ? 'Forja Activa' : 'Forja Ativa'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Estado Vazio caso filtro não tenha hábitos */
        <div className="p-8 rounded-xl border border-dashed border-line text-center bg-[#14141C] flex flex-col items-center justify-center gap-2">
          <Layers size={28} className="text-muted/60 mb-1" />
          <h4 className="font-bold text-sm text-[#EDE5D5]">{T('noHabitsTitle')}</h4>
          <p className="text-xs text-muted max-w-sm leading-relaxed">{T('noHabitsSub')}</p>
          <div className="flex items-center gap-2 mt-3">
            {onCreateHabit && (
              <button
                type="button"
                onClick={onCreateHabit}
                className="btn-gold py-1.5 px-3.5 text-xs font-bold cursor-pointer"
              >
                {T('createNewHabit')}
              </button>
            )}
            {onOpenReserve && (
              <button
                type="button"
                onClick={onOpenReserve}
                className="btn-dark py-1.5 px-3.5 text-xs font-bold cursor-pointer"
              >
                {T('reserveArsenalBtn')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. RODAPÉ INFORMATIVO: DICA & LEGENDA MOBILE */}
      <div className="p-2.5 rounded-xl border border-line/50 bg-[#121218] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-gold shrink-0" />
          <span>
            {lang === 'en'
              ? 'Tap any cell in the sheet to cycle: Done (✓) → Missed (✕) → Clear (·)'
              : lang === 'es'
              ? 'Toca cualquier celda en la planilla: Hecho (✓) → Falló (✕) → Limpiar (·)'
              : 'Toque em qualquer célula da planilha: Concluído (✓) → Falhou (✕) → Limpar (·)'}
          </span>
        </span>
        <div className="flex items-center gap-3 text-[9px]">
          <span className="text-gold font-bold">100% {lang === 'en' ? 'Synced' : lang === 'es' ? 'Sincronizado' : 'Sincronizado'}</span>
        </div>
      </div>
    </div>
  );
}
