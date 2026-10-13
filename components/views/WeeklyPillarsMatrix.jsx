'use client';
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Flame,
  Shield,
  Eye,
  Zap,
} from 'lucide-react';
import { today, getWeekDays, shiftWeek, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

const PILLARS_MATRIX_I18N = {
  title: {
    pt: 'MATRIZ SEMANAL DOS 3 PILARES',
    en: 'WEEKLY 3 PILLARS MATRIX',
    es: 'MATRIZ SEMANAL DE LOS 3 PILARES',
  },
  subtitle: {
    pt: 'Planilha de combate e blindagem moral da semana',
    en: 'Weekly combat and moral shielding spreadsheet',
    es: 'Planilla semanal de combate y blindaje moral',
  },
  thisWeek: {
    pt: 'Esta Semana',
    en: 'This Week',
    es: 'Esta Semana',
  },
  todayBadge: {
    pt: 'HOJE',
    en: 'TODAY',
    es: 'HOY',
  },
  colPillar: {
    pt: 'PILAR DE COMBATE',
    en: 'COMBAT PILLAR',
    es: 'PILAR DE COMBATE',
  },
  colConsistency: {
    pt: 'SEMANA',
    en: 'WEEK',
    es: 'SEMANA',
  },
  dailyShieldRate: {
    pt: 'BLINDAGEM DO DIA',
    en: 'DAILY SHIELDING',
    es: 'BLINDAJE DEL DÍA',
  },
  fullShieldVictory: {
    pt: 'Blindagem Total',
    en: 'Full Shield',
    es: 'Blindaje Total',
  },
  pillars: {
    r: {
      icon: '🛡️',
      name: { pt: 'Retenção Seminal', en: 'Semen Retention', es: 'Retención Seminal' },
      sub: { pt: 'Energia Vital', en: 'Vital Energy', es: 'Energía Vital' },
    },
    p: {
      icon: '👁️',
      name: { pt: 'Zero Pornografia', en: 'Zero Pornography', es: 'Cero Pornografía' },
      sub: { pt: 'Olhar Firme', en: 'Clean Gaze', es: 'Mirada Limpia' },
    },
    m: {
      icon: '⚡',
      name: { pt: 'Sem Masturbação', en: 'No Masturbation', es: 'Sin Masturbación' },
      sub: { pt: 'Autodomínio', en: 'Self-Mastery', es: 'Autodominio' },
    },
  },
};

const WEEKDAY_NAMES = {
  pt: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
};

export default function WeeklyPillarsMatrix({
  S,
  curLang = 'pt',
  setCI,
}) {
  const [weekOffset, setWeekOffset] = useState(0);

  const todayStr = today();
  const currentWeekRef = useMemo(() => shiftWeek(todayStr, weekOffset), [todayStr, weekOffset]);
  const weekDays = useMemo(() => getWeekDays(currentWeekRef), [currentWeekRef]);

  const lang = ['pt', 'en', 'es'].includes(curLang) ? curLang : 'pt';
  const T = (key) => (PILLARS_MATRIX_I18N[key] && PILLARS_MATRIX_I18N[key][lang]) || '';
  const weekdays = WEEKDAY_NAMES[lang] || WEEKDAY_NAMES.pt;

  const reqPillars = useMemo(() => {
    return L.pillars(S) || ['r', 'p', 'm'];
  }, [S]);

  const weekRangeLabel = useMemo(() => {
    if (weekDays.length < 7) return '';
    const start = fmtD(weekDays[0]);
    const end = fmtD(weekDays[6]);
    return `${start} — ${end}`;
  }, [weekDays]);

  // Estatísticas por dia
  const dailyShieldStats = useMemo(() => {
    return weekDays.map((ds) => {
      const c = L.ci(S, ds) || {};
      const doneCount = reqPillars.filter((k) => !!c[k]).length;
      const isFull = doneCount === reqPillars.length && reqPillars.length > 0;
      const pct = reqPillars.length > 0 ? Math.round((doneCount / reqPillars.length) * 100) : 0;
      return { ds, doneCount, isFull, pct };
    });
  }, [weekDays, S, reqPillars]);

  // Aproveitamento geral da semana nos 3 pilares
  const weekPillarsSummary = useMemo(() => {
    let done = 0;
    const totalPossible = reqPillars.length * 7;
    weekDays.forEach((ds) => {
      const c = L.ci(S, ds) || {};
      reqPillars.forEach((k) => {
        if (c[k]) done++;
      });
    });
    const pct = totalPossible > 0 ? Math.round((done / totalPossible) * 100) : 0;
    return { done, totalPossible, pct };
  }, [weekDays, S, reqPillars]);

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-full min-w-0 select-none animate-fade-in">
      {/* Topo do Navegador da Semana */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-black/40 border border-line/50">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck size={16} className="text-gold flex-none" />
          <div className="flex flex-col min-w-0">
            <span className="font-display font-black text-xs text-gold uppercase tracking-wider truncate">
              {PILLARS_MATRIX_I18N.title[lang]}
            </span>
            <span className="text-[9.5px] text-muted font-mono truncate">
              {PILLARS_MATRIX_I18N.subtitle[lang]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => {
              AF.click();
              setWeekOffset((w) => w - 1);
            }}
            className="p-1 rounded-md border border-line bg-surface hover:border-gold/50 text-muted hover:text-gold transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] font-mono font-bold text-ink px-2 py-0.5 rounded border border-line/60 bg-surface2/80 truncate">
            {weekRangeLabel}
          </span>
          <button
            type="button"
            onClick={() => {
              AF.click();
              setWeekOffset((w) => w + 1);
            }}
            className="p-1 rounded-md border border-line bg-surface hover:border-gold/50 text-muted hover:text-gold transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => {
                AF.click();
                setWeekOffset(0);
              }}
              className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded border border-gold/50 bg-gold/20 text-gold hover:bg-gold/30 transition-all cursor-pointer"
            >
              {PILLARS_MATRIX_I18N.thisWeek[lang]} ↺
            </button>
          )}
        </div>
      </div>

      {/* Tabela Planilha dos 3 Pilares */}
      <div className="w-full rounded-xl border border-line/80 bg-[#121219] overflow-hidden shadow-md">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-stone-700">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-line/80 bg-[#181723] text-[9.5px] font-mono text-muted">
                <th className="py-2 px-2.5 font-black uppercase tracking-wider sticky left-0 bg-[#181723] z-20 shadow-[2px_0_6px_rgba(0,0,0,0.5)] min-w-[150px] sm:min-w-[170px]">
                  {PILLARS_MATRIX_I18N.colPillar[lang]}
                </th>
                {weekDays.map((ds, idx) => {
                  const isToday = ds === todayStr;
                  const dayNum = ds.split('-')[2];
                  const wName = weekdays[idx] || '';
                  return (
                    <th
                      key={ds}
                      className={`py-1.5 px-1 text-center font-bold min-w-[42px] sm:min-w-[48px] border-l border-line/40 ${
                        isToday ? 'bg-amber-500/15 border-t-2 border-t-gold text-gold' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        {isToday ? (
                          <span className="px-1 py-0.2 rounded bg-gold text-black text-[7px] font-black uppercase">
                            {PILLARS_MATRIX_I18N.todayBadge[lang]}
                          </span>
                        ) : (
                          <span className="text-[8px] text-muted uppercase">{wName}</span>
                        )}
                        <span className={`text-[11px] font-mono font-black ${isToday ? 'text-gold' : 'text-[#EDE5D5]'}`}>
                          {dayNum}
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th className="py-2 px-2 text-center font-black uppercase tracking-wider border-l border-line/40 min-w-[65px]">
                  {PILLARS_MATRIX_I18N.colConsistency[lang]}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line/40 text-xs">
              {reqPillars.map((k, rIdx) => {
                const conf = PILLARS_MATRIX_I18N.pillars[k] || {
                  icon: '⚔️',
                  name: { pt: `Pilar ${k}`, en: `Pillar ${k}`, es: `Pilar ${k}` },
                  sub: { pt: '', en: '', es: '' },
                };

                // Contagem na semana para este pilar
                let pillarWeekDone = 0;
                weekDays.forEach((ds) => {
                  const c = L.ci(S, ds) || {};
                  if (c[k]) pillarWeekDone++;
                });
                const pillarPct = Math.round((pillarWeekDone / 7) * 100);

                return (
                  <tr
                    key={k}
                    className={`transition-colors group ${
                      rIdx % 2 === 0 ? 'bg-[#14131C]' : 'bg-[#161520]'
                    } hover:bg-[#1C1B2A]`}
                  >
                    {/* Coluna Sticky do Pilar */}
                    <td className={`py-2 px-2.5 sticky left-0 z-10 shadow-[2px_0_6px_rgba(0,0,0,0.5)] border-r border-line/40 ${
                      rIdx % 2 === 0 ? 'bg-[#14131C]' : 'bg-[#161520]'
                    } group-hover:bg-[#1C1B2A]`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base flex-none">{conf.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs text-[#F5EEDC] truncate leading-tight group-hover:text-gold transition-colors">
                            {conf.name[lang]}
                          </span>
                          <span className="text-[9px] text-muted font-mono truncate">
                            {conf.sub[lang]}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 7 Células dos Dias */}
                    {weekDays.map((ds) => {
                      const isToday = ds === todayStr;
                      const c = L.ci(S, ds) || {};
                      const isChecked = !!c[k];
                      const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
                      const failTypes = String(c.fail || '').split('+').filter(Boolean);
                      const isFailed = !isChecked && failTypes.includes(FAILMAP[k]);

                      return (
                        <td
                          key={ds}
                          className={`p-1 text-center border-l border-line/40 align-middle ${
                            isToday ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (setCI) {
                                AF.click();
                                setCI(k, !isChecked, ds);
                              }
                            }}
                            title={`${conf.name[lang]} · ${fmtD(ds)}: ${
                              isChecked
                                ? '✓ Blindado'
                                : isFailed
                                ? '✕ Queda'
                                : '· Pendente'
                            }`}
                            className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-black transition-all active:scale-90 cursor-pointer select-none ${
                              isChecked
                                ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_8px_rgba(250,204,21,0.35)]'
                                : isFailed
                                ? 'bg-red-500/25 border border-red-500/70 text-red-400'
                                : isToday
                                ? 'bg-[#181824] border border-gold/40 hover:border-gold hover:bg-[#222132] text-muted/30 hover:text-gold'
                                : 'bg-[#15151F] border border-line/50 hover:border-gold/40 text-muted/20 hover:text-muted'
                            }`}
                          >
                            {isChecked ? (
                              <Check size={14} strokeWidth={3} className="text-black" />
                            ) : isFailed ? (
                              <X size={13} strokeWidth={2.5} className="text-red-400" />
                            ) : (
                              <span className="opacity-0 group-hover:opacity-40 text-xs">·</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Coluna Consistência */}
                    <td className="py-2 px-2 text-center border-l border-line/40">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="font-mono font-bold text-[10.5px] text-gold">
                          {pillarWeekDone}/7
                        </span>
                        <div className="w-10 h-1 rounded-full bg-surface2 overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full"
                            style={{ width: `${pillarPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Rodapé: Blindagem do Dia */}
            <tfoot>
              <tr className="border-t-2 border-line/80 bg-[#161522] text-[9.5px] font-mono font-bold">
                <td className="py-2 px-2.5 uppercase tracking-wider sticky left-0 bg-[#161522] z-20 shadow-[2px_0_6px_rgba(0,0,0,0.5)] border-r border-line/40">
                  <div className="flex items-center gap-1.5 text-gold">
                    <span>🛡️</span>
                    <span className="font-black truncate">{PILLARS_MATRIX_I18N.dailyShieldRate[lang]}</span>
                  </div>
                </td>
                {dailyShieldStats.map(({ ds, doneCount, isFull, pct }) => {
                  const isToday = ds === todayStr;
                  return (
                    <td
                      key={ds}
                      className={`py-1.5 px-1 text-center border-l border-line/40 align-middle ${
                        isToday ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span
                          className={`font-black text-[10px] ${
                            isFull ? 'text-gold' : pct > 0 ? 'text-amber-300' : 'text-muted/60'
                          }`}
                        >
                          {doneCount}/{reqPillars.length}
                        </span>
                        {isFull && <span className="text-[8px] text-gold">🏆</span>}
                      </div>
                    </td>
                  );
                })}
                <td className="py-2 px-2 text-center border-l border-line/40 text-[10px] font-black text-amber-300">
                  {weekPillarsSummary.pct}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
