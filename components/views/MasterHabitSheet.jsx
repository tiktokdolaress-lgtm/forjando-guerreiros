'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  Check,
  X,
  Lock,
  Shield,
  Eye,
  Zap,
  Sparkles,
  Trophy,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';
import { today, yesterday, parseD, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

const DAY_ABBR = {
  pt: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  en: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
  es: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
};

const SHEET_I18N = {
  title: {
    pt: 'Planilha de Hábitos Diários',
    en: 'Daily Habit Spreadsheet',
    es: 'Planilla de Hábitos Diarios',
  },
  badgeInteractive: {
    pt: 'Matriz Interativa',
    en: 'Interactive Matrix',
    es: 'Matriz Interactiva',
  },
  subtitle: {
    pt: 'Clique diretamente nas células de hoje e ontem para marcar ou desmarcar. Baixe o relatório CSV para o Excel ou Google Sheets a qualquer momento.',
    en: 'Click directly on today and yesterday cells to check or uncheck. Download CSV report to Excel or Google Sheets at any time.',
    es: 'Haz clic directamente en las celdas de hoy y ayer para marcar o desmarcar. Descarga el informe CSV para Excel o Google Sheets en cualquier momento.',
  },
  days7: { pt: '7 dias', en: '7 days', es: '7 días' },
  days14: { pt: '14 dias', en: '14 days', es: '14 días' },
  days30: { pt: '30 dias', en: '30 days', es: '30 días' },
  downloadCsv: {
    pt: 'Baixar CSV',
    en: 'Download CSV',
    es: 'Descargar CSV',
  },
  thDate: { pt: 'Data', en: 'Date', es: 'Fecha' },
  thDay: { pt: 'Dia', en: 'Day', es: 'Día' },
  thAverage: { pt: 'Média', en: 'Average', es: 'Promedio' },
  thTotal: { pt: 'Total', en: 'Total', es: 'Total' },
  thTargetPct: { pt: '% Meta', en: '% Target', es: '% Meta' },
  lockedPastNotice: {
    pt: '🛡️ Registro Inviolável: Para manter a honra da jornada e evitar autoengano, apenas o dia de hoje e o de ontem podem ser marcados.',
    en: '🛡️ Inviolable Record: To preserve journey honor and prevent self-deception, only today and yesterday can be marked.',
    es: '🛡️ Registro Inviolable: Para preservar el honor del camino y evitar el autoengaño, solo hoy y ayer pueden marcarse.',
  },
  futureNotice: {
    pt: 'O futuro ainda não existe. Apenas o dia de hoje pode ser combatido.',
    en: 'The future does not exist yet. Only today can be fought.',
    es: 'El futuro aún no existe. Solo el día de hoy puede ser combatido.',
  },
  pillars: {
    r: { pt: 'Retenção Seminal', en: 'Semen Retention', es: 'Retención Seminal', icon: Shield },
    p: { pt: 'Zero Pornografia', en: 'Zero Pornography', es: 'Cero Pornografía', icon: Eye },
    m: { pt: 'Sem Masturbação', en: 'No Masturbation', es: 'Sin Masturbación', icon: Zap },
  },
};

export default function MasterHabitSheet({
  S,
  habits = [],
  curLang = 'pt',
  setCI,
  onToggleHabit,
  onNotify,
}) {
  const lang = ['pt', 'en', 'es'].includes(curLang) ? curLang : 'pt';
  const todayStr = today();
  const yesterdayStr = yesterday(todayStr);

  // Filtro de alcance de dias (7, 14 ou 30 dias)
  const [rangeDays, setRangeDays] = useState(14);

  // Geração da lista de datas em ordem cronológica decrescente (ou crescente)
  // No print do HabitFlow vai de datas passadas até hoje
  const dateList = useMemo(() => {
    const list = [];
    const base = parseD(todayStr);
    for (let i = rangeDays - 1; i >= 0; i--) {
      const dt = new Date(base.getTime() - i * 86400000);
      list.push(dstr(dt));
    }
    return list;
  }, [todayStr, rangeDays]);

  // Colunas de Pilares obrigatórios
  const reqPillars = useMemo(() => L.pillars(S) || ['r', 'p', 'm'], [S]);
  // Hábitos ativos
  const activeHabits = useMemo(() => (Array.isArray(habits) ? habits : []), [habits]);

  // Lista unificada de colunas avaliadas
  // 1. Pilares
  // 2. Hábitos
  const columns = useMemo(() => {
    const cols = [];
    reqPillars.forEach((k) => {
      const pConf = SHEET_I18N.pillars[k] || {
        pt: `Pilar ${k}`,
        en: `Pillar ${k}`,
        es: `Pilar ${k}`,
        icon: Shield,
      };
      cols.push({
        type: 'pillar',
        key: k,
        id: `pillar_${k}`,
        name: pConf[lang] || pConf.pt,
        icon: pConf.icon,
      });
    });

    activeHabits.forEach((h) => {
      cols.push({
        type: 'habit',
        key: h.id,
        id: `habit_${h.id}`,
        name: h.n || h.name || h.title || 'Hábito',
        icon: h.icon || '⚡',
      });
    });

    return cols;
  }, [reqPillars, activeHabits, lang]);

  const totalColsCount = columns.length;

  // Mapas de dados
  const checkins = useMemo(() => (S && S.checkins) || {}, [S]);
  const doneHabitsMap = useMemo(() => (S && S.forge && S.forge.done) || {}, [S]);
  const failHabitsMap = useMemo(() => (S && S.forge && S.forge.failed) || {}, [S]);

  // Função para verificar se uma célula está concluída
  const isCellDone = (col, ds) => {
    if (col.type === 'pillar') {
      const c = checkins[ds] || {};
      return !!c[col.key];
    }
    const dList = doneHabitsMap[ds] || [];
    return dList.some((id) => String(id) === String(col.key));
  };

  // Função para verificar se uma célula foi marcada como falha
  const isCellFailed = (col, ds) => {
    if (col.type === 'pillar') {
      const c = checkins[ds] || {};
      const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
      const failTypes = String(c.fail || '').split('+').filter(Boolean);
      return !c[col.key] && failTypes.includes(FAILMAP[col.key]);
    }
    const fList = failHabitsMap[ds] || [];
    return fList.some((id) => String(id) === String(col.key));
  };

  // Médias por coluna no período
  const columnAverages = useMemo(() => {
    const totalDays = dateList.length;
    if (totalDays === 0) return {};

    const avgs = {};
    columns.forEach((col) => {
      let doneCount = 0;
      dateList.forEach((ds) => {
        if (isCellDone(col, ds)) doneCount++;
      });
      avgs[col.id] = Math.round((doneCount / totalDays) * 100);
    });

    // Média geral consolidada de todas as colunas no período
    let grandTotalDone = 0;
    const grandPossible = totalDays * totalColsCount;
    dateList.forEach((ds) => {
      columns.forEach((col) => {
        if (isCellDone(col, ds)) grandTotalDone++;
      });
    });
    avgs.__grandTotal = grandPossible > 0 ? Math.round((grandTotalDone / grandPossible) * 100) : 0;

    return avgs;
  }, [columns, dateList, checkins, doneHabitsMap, totalColsCount]);

  // Ação de clique na célula
  const handleCellClick = (col, ds) => {
    const isFuture = ds > todayStr;
    const isToday = ds === todayStr;
    const isYesterday = ds === yesterdayStr;
    const isPastLocked = !isToday && !isYesterday && !isFuture;

    if (isFuture) {
      if (onNotify) onNotify(SHEET_I18N.futureNotice[lang]);
      return;
    }

    if (isPastLocked) {
      AF.tone(110, 0.25, 'sine', 0.15, 0, 50);
      if (onNotify) onNotify(SHEET_I18N.lockedPastNotice[lang]);
      return;
    }

    if (col.type === 'pillar') {
      const currentVal = isCellDone(col, ds);
      if (setCI) {
        AF.click();
        setCI(col.key, !currentVal, ds);
      }
    } else if (col.type === 'habit') {
      if (onToggleHabit) {
        onToggleHabit(col.key, ds);
      }
    }
  };

  // Exportar para CSV (Google Sheets / Excel)
  const exportToCSV = () => {
    try {
      AF.click();
      let csv = 'Data,Dia';
      columns.forEach((c) => {
        csv += `,"${c.name.replace(/"/g, '""')}"`;
      });
      csv += ',Total,% Meta\n';

      dateList.forEach((ds) => {
        const dObj = parseD(ds);
        const dayOfWeek = DAY_ABBR[lang][dObj.getDay()];
        let row = `${ds},${dayOfWeek}`;
        let rowDone = 0;

        columns.forEach((col) => {
          const done = isCellDone(col, ds);
          if (done) rowDone++;
          row += `,${done ? 'SIM' : 'NÃO'}`;
        });

        const pct = totalColsCount > 0 ? Math.round((rowDone / totalColsCount) * 100) : 0;
        row += `,${rowDone}/${totalColsCount},${pct}%\n`;
        csv += row;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `forjando_guerreiros_planilha_${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onNotify) onNotify('📥 CSV exportado com sucesso para Excel / Google Sheets!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0">
      {/* 1. TOPO DA PLANILHA (ULTRA-LIMPO: TÍTULO ENXUTO E SELETOR DE PERÍODO) */}
      <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 rounded-2xl border border-line/80 bg-[#14141E] shadow-sm select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <FileSpreadsheet size={15} />
          </div>
          <h2 className="font-display font-black text-xs sm:text-base text-[#EDE5D5] tracking-wide truncate">
            {SHEET_I18N.title[lang]}
          </h2>
        </div>

        {/* Seletor de Período Compacto [ 7 dias | 14 dias | 30 dias ] */}
        <div className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-xl bg-[#0D0D14] border border-line/70 shrink-0">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                AF.click();
                setRangeDays(d);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                rangeDays === d
                  ? 'bg-gold text-black shadow-sm font-black'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {d === 7 ? SHEET_I18N.days7[lang] : d === 14 ? SHEET_I18N.days14[lang] : SHEET_I18N.days30[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TABELA ESTILO HABITFLOW / GOOGLE SHEETS COM DATAS NAS LINHAS E HÁBITOS NAS COLUNAS */}
      <div className="w-full rounded-2xl border border-line/80 bg-[#12121A] overflow-hidden shadow-md">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-stone-700">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* CABEÇALHO DAS COLUNAS */}
            <thead>
              <tr className="border-b border-line/60 bg-[#161522] text-[11px] font-mono font-bold text-muted">
                <th className="py-2.5 px-3 w-16 text-left">{SHEET_I18N.thDate[lang]}</th>
                <th className="py-2.5 px-2 w-12 text-center border-l border-line/40">{SHEET_I18N.thDay[lang]}</th>

                {/* Colunas dos Pilares e Hábitos */}
                {columns.map((col) => {
                  const IconComp = col.icon;
                  return (
                    <th
                      key={col.id}
                      className="py-2.5 px-2 text-center border-l border-line/40 min-w-[110px] max-w-[140px]"
                    >
                      <div className="flex items-center justify-center gap-1 truncate" title={col.name}>
                        {typeof IconComp === 'string' ? (
                          <span className="text-xs flex-none">{IconComp}</span>
                        ) : IconComp ? (
                          <IconComp size={12} className="text-gold flex-none" />
                        ) : null}
                        <span className="truncate text-[11px] text-[#EDE5D5] font-display">
                          {col.name}
                        </span>
                      </div>
                    </th>
                  );
                })}

                <th className="py-2.5 px-2 w-16 text-center border-l border-line/40">{SHEET_I18N.thTotal[lang]}</th>
                <th className="py-2.5 px-2 w-16 text-center border-l border-line/40 text-gold">{SHEET_I18N.thTargetPct[lang]}</th>
              </tr>

              {/* LINHA DE MÉDIA FIXA NO TOPO (EXATAMENTE COMO NO HABITFLOW) */}
              <tr className="border-b-2 border-gold/40 bg-gradient-to-r from-amber-950/40 via-[#181624] to-amber-950/40 text-xs font-mono font-black text-gold">
                <td className="py-2 px-3 text-gold font-display uppercase tracking-wider">{SHEET_I18N.thAverage[lang]}</td>
                <td className="py-2 px-2 text-center border-l border-line/40 text-muted/60">-</td>

                {columns.map((col) => (
                  <td key={col.id} className="py-2 px-2 text-center border-l border-line/40 text-[11.5px] font-mono text-amber-300">
                    {columnAverages[col.id] || 0}%
                  </td>
                ))}

                <td className="py-2 px-2 text-center border-l border-line/40 text-muted/60">-</td>
                <td className="py-2 px-2 text-center border-l border-line/40 text-gold font-display font-black text-xs">
                  {columnAverages.__grandTotal || 0}%
                </td>
              </tr>
            </thead>

            {/* CORPO DA TABELA: CADA LINHA É UMA DATA */}
            <tbody className="divide-y divide-line/30 text-xs font-mono">
              {dateList.map((ds) => {
                const isToday = ds === todayStr;
                const isYesterday = ds === yesterdayStr;
                const isPastLocked = !isToday && !isYesterday;
                const dObj = parseD(ds);
                const dayOfWeek = DAY_ABBR[lang][dObj.getDay()];
                const isWeekend = dObj.getDay() === 0 || dObj.getDay() === 6;

                // Contagem do dia
                let dayDoneCount = 0;
                columns.forEach((col) => {
                  if (isCellDone(col, ds)) dayDoneCount++;
                });
                const dayPct = totalColsCount > 0 ? Math.round((dayDoneCount / totalColsCount) * 100) : 0;

                // Formatação simples da data (ex: 10-01)
                const monthStr = String(dObj.getMonth() + 1).padStart(2, '0');
                const dateNumStr = String(dObj.getDate()).padStart(2, '0');
                const shortDateDisplay = `${monthStr}-${dateNumStr}`;

                // Cor do Badge da Porcentagem da Meta
                const pctBadgeColor =
                  dayPct === 100
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black shadow-xs'
                    : dayPct >= 70
                    ? 'bg-amber-500/20 text-amber-300 border border-gold/40'
                    : dayPct >= 50
                    ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                    : dayPct > 0
                    ? 'bg-surface text-muted border border-line/60'
                    : 'bg-black/30 text-muted/40';

                return (
                  <tr
                    key={ds}
                    className={`transition-colors hover:bg-surface2/50 ${
                      isToday ? 'bg-amber-500/10 font-bold' : isYesterday ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    {/* 1. Coluna Data */}
                    <td className="py-2 px-3 text-muted flex items-center gap-1 font-mono">
                      <span>{shortDateDisplay}</span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping flex-none" />
                      )}
                    </td>

                    {/* 2. Coluna Dia da Semana */}
                    <td className={`py-2 px-2 text-center border-l border-line/40 text-[11px] font-mono ${
                      isWeekend ? 'text-amber-400/90 font-bold' : 'text-muted'
                    }`}>
                      {dayOfWeek}
                    </td>

                    {/* 3. Colunas Interativas com Células Quadradas Estilo HabitFlow */}
                    {columns.map((col) => {
                      const done = isCellDone(col, ds);
                      const failed = isCellFailed(col, ds);

                      return (
                        <td
                          key={col.id}
                          className="py-1.5 px-2 text-center border-l border-line/40 align-middle"
                        >
                          <button
                            type="button"
                            onClick={() => handleCellClick(col, ds)}
                            title={`${col.name} · ${fmtD(ds)}: ${done ? 'Feito' : failed ? 'Falha' : 'Pendente'}`}
                            className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-black transition-all active:scale-90 select-none ${
                              done
                                ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_8px_rgba(250,204,21,0.35)] cursor-pointer'
                                : failed
                                ? 'bg-red-500/20 border border-red-500/70 text-red-400 cursor-pointer'
                                : isPastLocked
                                ? 'bg-black/40 border border-line/30 text-muted/20 opacity-40 cursor-not-allowed'
                                : isToday
                                ? 'bg-[#181824] border-2 border-gold/60 hover:border-gold hover:bg-[#222132] text-muted/30 hover:text-gold cursor-pointer'
                                : 'bg-[#15151F] border border-line/50 hover:border-gold/40 text-muted/20 hover:text-muted cursor-pointer'
                            }`}
                          >
                            {done ? (
                              <Check size={14} strokeWidth={3} className={isPastLocked ? 'text-black' : 'text-black'} />
                            ) : failed ? (
                              <X size={13} strokeWidth={2.5} className="text-red-400" />
                            ) : isPastLocked ? (
                              <Lock size={10} className="text-muted/30" />
                            ) : (
                              <span className="opacity-0 group-hover:opacity-40 text-xs">·</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* 4. Coluna Total de Feitos */}
                    <td className="py-2 px-2 text-center border-l border-line/40 font-mono text-[11px] text-muted font-bold">
                      {dayDoneCount} / {totalColsCount}
                    </td>

                    {/* 5. Coluna Porcentagem da Meta */}
                    <td className="py-2 px-2 text-center border-l border-line/40">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-mono font-black ${pctBadgeColor}`}>
                        {dayPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
