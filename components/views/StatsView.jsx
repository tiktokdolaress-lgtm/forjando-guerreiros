'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Share2,
  Clock3,
  Trophy,
  ShieldAlert,
  Skull,
  MoreVertical,
  Check,
  BarChart2,
  Flame,
  CalendarDays,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty, Chk } from '@/components/ui';
import * as L from '@/lib/logic';
import { cx, cxHabits } from '@/lib/content-i18n';
import { today, dstr, fdmy } from '@/lib/utils';
import { AF } from '@/lib/audio';

const TRIGGER_LABELS = {
  madrugada: 'Madrugada / Tarde da Noite',
  redes: 'Redes Sociais / Rolo Infinito',
  tedio: 'Tédio / Falta de Missão',
  stress: 'Estresse / Sobrecarga Mental',
  solidao: 'Solidão / Isolamento',
  canso: 'Cansaço Extremo / Esgotamento',
  gatilho_visual: 'Gatilho Visual (Filmes/Séries)',
  fantasia: 'Fantasias Mentais Prolongadas',
  cama: 'Ficar na Cama após Acordar',
  banho: 'Banho Demorado / Sozinho',
};

const STATS_CATEGORIES = [
  { id: 'general', key: 'cat_general', label: 'Geral & Consistência', icon: BarChart2 },
  { id: 'timeline', key: 'cat_timeline', label: 'Linha do Tempo', icon: CalendarDays },
  { id: 'risk', key: 'cat_risk', label: 'Risco & S.O.S', icon: ShieldAlert },
  { id: 'hall', key: 'cat_hall', label: 'Salão da Fama & Honra', icon: Trophy },
];

/* =========================================================================
   COMPONENTE: CURVA DE VITALIDADE & FORÇA (Sincronizada aos 3 Pilares)
   ========================================================================= */
function VitalityCurve({ curve, peakVitality, avgVitality, curVitality, T }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const active = selectedDay || (curve && curve.length ? curve[curve.length - 1] : null);

  if (!curve || curve.length === 0) return null;

  const width = 800;
  const height = 180;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 22;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom; // 126

  const pts = curve.map((pt, i) => {
    const x = padLeft + (i / Math.max(1, curve.length - 1)) * plotW;
    const y = padTop + ((100 - pt.vitality) / 100) * plotH;
    return { x, y, pt, i };
  });

  // Geração da curva Bezier suave
  let pathD = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  if (pts.length === 1) {
    pathD += ` L ${(pts[0].x + 10).toFixed(1)} ${pts[0].y.toFixed(1)}`;
  } else {
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
  }

  const bottomY = padTop + plotH; // 148
  const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${bottomY} L ${pts[0].x.toFixed(1)} ${bottomY} Z`;

  // Índices para rótulos de datas no eixo X
  const dateStep = Math.max(1, Math.floor((pts.length - 1) / 5));
  const dateIndices = [];
  for (let i = 0; i < pts.length; i += dateStep) dateIndices.push(i);
  if (!dateIndices.includes(pts.length - 1)) dateIndices.push(pts.length - 1);

  return (
    <div className="mb-4 rounded-xl border border-gold/30 bg-[#101014] p-3.5 sm:p-4 shadow-sm">
      {/* Cabeçalho da Curva */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-line/40">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-gold" />
            <span className="font-display text-sm tracking-wider text-gold font-bold">
              {T('curve_title', 'CURVA DE VITALIDADE & FORÇA')}
            </span>
          </div>
          <p className="text-[11px] text-muted mt-0.5 leading-snug">
            {T('curve_sub', 'Sincronizada aos 3 Pilares da Tríade: sobe com dias limpos e reage proporcionalmente a cada pilar.')}
          </p>
        </div>

        {/* Métricas da curva */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-gold/10 border border-gold/30 text-[11px] font-mono font-bold text-gold">
            {T('curve_cur', 'Vitalidade Atual: ')}{curVitality}%
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface2 border border-line text-[11px] font-mono text-muted">
            {T('curve_peak_label', 'Pico no Período: ')}<b className="text-ok">{peakVitality}%</b>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface2 border border-line text-[11px] font-mono text-muted">
            {T('curve_avg_label', 'Média: ')}{avgVitality}%
          </span>
        </div>
      </div>

      {/* Gráfico SVG Responsivo */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 sm:h-52 overflow-visible select-none">
          <defs>
            <linearGradient id="vitalityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
              <stop offset="65%" stopColor="#D97706" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="vitalityStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Linhas horizontais de referência (100%, 50%, 0%) */}
          <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#F59E0B" strokeOpacity="0.25" strokeDasharray="3 3" />
          <text x={padLeft - 6} y={padTop + 3.5} textAnchor="end" className="text-[9.5px] fill-gold/70 font-mono">100%</text>

          <line x1={padLeft} y1={padTop + plotH / 2} x2={width - padRight} y2={padTop + plotH / 2} stroke="#3f3f46" strokeOpacity="0.4" strokeDasharray="3 3" />
          <text x={padLeft - 6} y={padTop + plotH / 2 + 3.5} textAnchor="end" className="text-[9.5px] fill-muted font-mono">50%</text>

          <line x1={padLeft} y1={bottomY} x2={width - padRight} y2={bottomY} stroke="#EF4444" strokeOpacity="0.3" strokeDasharray="3 3" />
          <text x={padLeft - 6} y={bottomY + 3.5} textAnchor="end" className="text-[9.5px] fill-danger/70 font-mono">0%</text>

          {/* Área sombreada sob a curva */}
          <path d={areaD} fill="url(#vitalityGradient)" />

          {/* Traçado da curva principal */}
          <path d={pathD} fill="none" stroke="url(#vitalityStroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Linha vertical e marcador do dia ativo */}
          {active && (
            (() => {
              const activePt = pts.find((p) => p.pt.ds === active.ds);
              if (!activePt) return null;
              return (
                <g>
                  <line x1={activePt.x} y1={padTop} x2={activePt.x} y2={bottomY} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" strokeOpacity="0.8" />
                  <circle cx={activePt.x} cy={activePt.y} r="6" fill="#F59E0B" fillOpacity="0.3" />
                  <circle cx={activePt.x} cy={activePt.y} r="3.5" fill="#FFF" stroke="#F59E0B" strokeWidth="2" />
                </g>
              );
            })()
          )}

          {/* Pontos nos dias do período */}
          {pts.map((p) => {
            const isFall = p.pt.cls === 'f';
            const isWin = p.pt.cls === 'w';
            const isPart = p.pt.cls === 'p';
            const showDot = pts.length <= 45 || isFall || p.pt.vitality === 100 || p.pt.vitality === 0;
            if (!showDot) return null;

            let fill = '#F59E0B';
            let stroke = '#121217';
            let radius = 3.5;

            if (isFall) {
              fill = '#EF4444';
              radius = 4.5;
            } else if (isPart) {
              fill = '#FBBF24';
              radius = 3.5;
            } else if (isWin && p.pt.vitality >= 90) {
              fill = '#10B981';
              radius = 3.5;
            }

            return (
              <circle
                key={p.pt.ds}
                cx={p.x}
                cy={p.y}
                r={radius}
                fill={fill}
                stroke={stroke}
                strokeWidth="1.5"
                className="transition-transform duration-100 hover:scale-150 cursor-pointer"
                onClick={() => setSelectedDay(p.pt)}
              />
            );
          })}

          {/* Rótulos de datas no eixo X */}
          {dateIndices.map((idx) => {
            const p = pts[idx];
            if (!p) return null;
            const parts = p.pt.ds.split('-');
            const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : p.pt.ds;
            return (
              <text
                key={p.pt.ds}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[9.5px] fill-muted font-mono"
              >
                {label}
              </text>
            );
          })}

          {/* Áreas verticais de captura de toque/mouse */}
          {pts.map((p, idx) => {
            const prevX = idx === 0 ? padLeft : (pts[idx - 1].x + p.x) / 2;
            const nextX = idx === pts.length - 1 ? width - padRight : (p.x + pts[idx + 1].x) / 2;
            const colW = Math.max(8, nextX - prevX);
            return (
              <rect
                key={'hit-' + p.pt.ds}
                x={prevX}
                y={padTop}
                width={colW}
                height={plotH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setSelectedDay(p.pt)}
                onClick={() => setSelectedDay(p.pt)}
              />
            );
          })}
        </svg>
      </div>

      {/* Painel Tático do Dia Inspecionado */}
      {active && (
        <div className="mt-2.5 p-2.5 sm:p-3 rounded-lg bg-[#141419] border border-line/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gold">
                📅 {fdmy(active.ds)}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                active.vitality >= 80 ? 'bg-ok/15 text-ok border-ok/40' :
                active.vitality >= 40 ? 'bg-gold/15 text-gold border-gold/40' :
                'bg-danger/15 text-danger border-danger/40'
              }`}>
                {active.vitality}% Vitalidade
              </span>
              <span className="text-[10.5px] text-[#EDE5D5] font-mono">
                {T(active.statusKey, active.lab)}
              </span>
            </div>

            {/* Status dos 3 Pilares no dia */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
              <span className={`flex items-center gap-1 ${active.cc.p ? 'text-ok font-bold' : active.fTypes?.includes('porn') ? 'text-danger font-bold' : 'text-muted'}`}>
                {active.cc.p ? '✓' : active.fTypes?.includes('porn') ? '✗' : '○'} {T('curve_p1_name', 'Zero Pornografia')}
              </span>
              <span className="text-muted/30">•</span>
              <span className={`flex items-center gap-1 ${active.cc.m ? 'text-ok font-bold' : active.fTypes?.includes('mast') ? 'text-danger font-bold' : 'text-muted'}`}>
                {active.cc.m ? '✓' : active.fTypes?.includes('mast') ? '✗' : '○'} {T('curve_p2_name', 'Autodomínio Inabalável')}
              </span>
              <span className="text-muted/30">•</span>
              <span className={`flex items-center gap-1 ${active.cc.r ? 'text-ok font-bold' : active.fTypes?.includes('ejac') ? 'text-danger font-bold' : 'text-muted'}`}>
                {active.cc.r ? '✓' : active.fTypes?.includes('ejac') ? '✗' : '○'} {T('curve_p3_name', 'Retenção Seminal')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatsView() {
  const { S, update, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = React.useCallback((id, fb) => cx(lang, 'stats', id) || fb, [lang]);

  const [activeCategory, setActiveCategory] = useState('general');
  const [hmOff, setHmOff] = useState(0);
  const [hall, setHall] = useState(null);
  const [timelineRange, setTimelineRange] = useState(30);
  const [customStart, setCustomStart] = useState(() => dstr(new Date(Date.now() - 29 * 86400000)));
  const [customEnd, setCustomEnd] = useState(() => today());

  useEffect(() => {
    fetch('/api/hall')
      .then((r) => r.json())
      .then(setHall)
      .catch(() => setHall([]));
  }, []);

  /* Auditoria de Quedas & Gatilhos */
  const auditFalls = useMemo(() => {
    if (!S || !Array.isArray(S.audit)) return [];
    return [...S.audit].sort(
      (a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0)
    );
  }, [S]);

  const triggerRank = useMemo(() => {
    const counts = {};
    auditFalls.forEach((f) => {
      if (Array.isArray(f.triggers)) {
        f.triggers.forEach((trg) => {
          counts[trg] = (counts[trg] || 0) + 1;
        });
      }
    });

    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts)
      .map(([id, count]) => ({
        id,
        name: T('trg_' + id, TRIGGER_LABELS[id] || id),
        count,
        pct: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [auditFalls, T]);

  /* Linha do Tempo Analítica & Curva de Vitalidade */
  const timelineData = useMemo(() => {
    let cells = [], wins = 0, falls = 0, part = 0;
    if (!S) return { cells, wins, falls, part, rate: 0, curve: [], peakVitality: 0, avgVitality: 0, curVitality: 0 };

    const req = L.pillars(S);
    let daysList = [];

    if (timelineRange === 'custom') {
      let sDate = customStart || dstr(new Date(Date.now() - 29 * 86400000));
      let eDate = customEnd || today();
      if (sDate > eDate) {
        const tmp = sDate;
        sDate = eDate;
        eDate = tmp;
      }
      if (eDate > today()) eDate = today();

      let curD = new Date(sDate + 'T12:00:00');
      const endD = new Date(eDate + 'T12:00:00');
      let count = 0;
      while (curD <= endD && count < 366) {
        daysList.push(dstr(curD));
        curD = new Date(curD.getTime() + 86400000);
        count++;
      }
    } else {
      const rangeNum = Number(timelineRange) || 30;
      for (let i = rangeNum - 1; i >= 0; i--) {
        daysList.push(dstr(new Date(Date.now() - i * 86400000)));
      }
    }

    if (!daysList.length) {
      daysList = [today()];
    }

    // Simulação dos 45 dias anteriores à primeira data do intervalo para a curva iniciar no nível autêntico
    let vitality = 50;
    const firstDayTime = new Date(daysList[0] + 'T12:00:00').getTime();
    for (let i = 45; i >= 1; i--) {
      const prevDs = dstr(new Date(firstDayTime - i * 86400000));
      const cc = (S.checkins || {})[prevDs];
      if (cc) {
        if (cc.ok) {
          vitality = Math.min(100, vitality + 10);
        } else if (cc.fail) {
          const fTypes = String(cc.fail).split('+').filter(Boolean);
          const fellCount = Math.min(req.length, Math.max(1, fTypes.length));
          const keptCount = Math.max(0, req.length - fellCount);
          if (keptCount >= 2) vitality = Math.max(15, Math.round(vitality * 0.72));
          else if (keptCount === 1) vitality = Math.max(8, Math.round(vitality * 0.35));
          else vitality = 0;
        } else if (cc.p || cc.m || cc.r) {
          const keptCount = req.filter((k) => cc[k]).length;
          if (keptCount === req.length) vitality = Math.min(100, vitality + 10);
          else if (keptCount >= 2) vitality = Math.max(15, Math.round(vitality * 0.72));
          else if (keptCount === 1) vitality = Math.max(8, Math.round(vitality * 0.35));
          else vitality = 0;
        } else {
          vitality = Math.max(0, vitality - 3);
        }
      } else {
        vitality = Math.max(0, vitality - 3);
      }
    }

    const curve = [];
    let vitalitySum = 0;
    let peakVitality = 0;

    daysList.forEach((ds) => {
      const cc = (S.checkins || {})[ds];
      let cls = '', lab = T('day_state_none', 'Sem registro');
      let kept = null;
      let statusKey = 'curve_status_none';
      let fTypes = [];

      if (cc && cc.fail) {
        cls = 'f';
        falls++;
        lab = T('day_state_fall', 'Queda');
        fTypes = String(cc.fail).split('+').filter(Boolean);
        const fellCount = Math.min(req.length, Math.max(1, fTypes.length));
        kept = Math.max(0, req.length - fellCount);
      } else if (cc && cc.ok) {
        cls = 'w';
        wins++;
        lab = T('day_state_win', 'Vitória');
        kept = req.length;
      } else if (cc && (cc.p || cc.m || cc.r)) {
        cls = 'p';
        part++;
        lab = T('day_state_part', 'Parcial');
        kept = req.filter((k) => cc[k]).length;
      }

      const prevVit = vitality;
      if (kept === null) {
        vitality = Math.max(0, vitality - 3);
        statusKey = 'curve_status_none';
      } else if (kept >= req.length) {
        vitality = Math.min(100, vitality + 10);
        statusKey = 'curve_status_win';
      } else if (kept === req.length - 1) {
        vitality = Math.max(15, Math.round(vitality * 0.72));
        statusKey = 'curve_status_fall1';
      } else if (kept === 1) {
        vitality = Math.max(8, Math.round(vitality * 0.35));
        statusKey = 'curve_status_fall2';
      } else {
        vitality = 0;
        statusKey = 'curve_status_fall3';
      }

      vitalitySum += vitality;
      if (vitality > peakVitality) peakVitality = vitality;

      cells.push({ ds, cls, lab });
      curve.push({
        ds,
        vitality,
        prevVit,
        delta: vitality - prevVit,
        kept,
        cls,
        lab,
        statusKey,
        cc: cc || {},
        fTypes,
      });
    });

    const rate = Math.round((wins / Math.max(1, daysList.length)) * 100);
    const avgVitality = Math.round(vitalitySum / Math.max(1, daysList.length));
    const curVitality = curve.length ? curve[curve.length - 1].vitality : 0;

    return { cells, wins, falls, part, rate, curve, peakVitality, avgVitality, curVitality };
  }, [S, timelineRange, customStart, customEnd, T]);

  if (!S) return null;

  const d = L.progressDays(S);
  const okDays = Object.values(S.checkins || {}).filter((c) => c && c.ok).length;
  const forgeTotal = Object.values(S.forge?.done || {}).reduce((a, b) => a + (b ? b.length : 0), 0);
  const ALLH = cxHabits(lang, L.allH(S));

  /* Heatmap do mês */
  const now = new Date();
  const ref = new Date(now.getFullYear(), now.getMonth() + hmOff, 1);
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const dim = new Date(y, m + 1, 0).getDate();
  const startW = new Date(y, m, 1).getDay();

  const grid = [];
  for (let i = 0; i < startW; i++) grid.push({ hidden: true });
  for (let day = 1; day <= dim; day++) {
    const ds = dstr(new Date(y, m, day));
    let cls = '';
    if (ds > today()) cls = 'lvx';
    else {
      const c = (S.checkins || {})[ds];
      if (!c) cls = '';
      else if (c.fail) cls = 'lvf';
      else if (c.ok) cls = 'lv3';
      else cls = 'lv' + ((c.p ? 1 : 0) + (c.m ? 1 : 0) + (c.r ? 1 : 0));
    }
    grid.push({ ds, cls });
  }

  /* Consistência do mês atual */
  const elapsed = hmOff === 0 ? now.getDate() : new Date(y, m + 1, 0).getDate();
  const consist = (S.forge?.active || [])
    .map((id) => {
      const h = ALLH.find((x) => x.id === id);
      if (!h) return null;
      let cnt = 0;
      for (let day = 1; day <= elapsed; day++) {
        const ds = dstr(new Date(y, m, day));
        if (((S.forge?.done || {})[ds] || []).includes(id)) cnt++;
      }
      return { h, cnt, pct: Math.round((cnt / elapsed) * 100) };
    })
    .filter(Boolean);

  const sosHist = Array.isArray(S.sosLog) ? S.sosLog.slice(-12).reverse() : [];
  const wr = L.weekReport(S);
  const us = L.urgeStats(S);

  const dayEditor = (ds) => {
    const req = L.pillars(S);
    const setCI = (k, v, dateStr) => {
      const dd = dateStr || today();
      update((s) => {
        s.checkins[dd] = s.checkins[dd] || { p: false, m: false, r: false };
        s.checkins[dd][k] = v;
        const c = s.checkins[dd], pils = L.pillars(s);
        const all = pils.every((r) => c[r]);
        if (all && !c.ok) {
          c.ok = true;
          if (dd === today()) {
            s.purity = Math.min(100, s.purity + 2);
            s.best = Math.max(s.best, L.progressDays(s));
          }
        }
        if (!all) delete c.ok;
      });
      AF.click();
    };

    const DayModal = () => {
      const cur = L.ci(S, ds);
      const state = cur.fail ? T('day_state_fall', 'Queda') : cur.ok ? T('day_state_win', 'Vitória') : (cur.p || cur.m || cur.r) ? T('day_state_part', 'Parcial') : T('day_state_none', 'Sem registro');
      return (
        <div className="text-center">
          <span className="k block text-gold text-base mb-1">
            {T('day_log_title', 'Registro de ')}{fdmy(ds)}{ds === today() ? T('day_today', ' · Hoje') : ''}
          </span>
          <p className="fnote mb-3 text-left">
            {T('day_cur_state', 'Estado atual: ')}<b className="text-gold">{state}</b>{T('day_adj_sub', ' · Ajuste os pilares deste dia abaixo:')}
          </p>
          {req.map((k) => {
            const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
            const fTypes = String(cur.fail || '').split('+').filter(Boolean);
            const label = k === 'p' ? T('day_p_porn', 'Zero Pornografia') : k === 'm' ? T('day_p_mast', 'Autodomínio Inabalável') : T('day_p_ejac', 'Retenção Seminal Mantida');
            return (
              <Chk key={k} className="mb-2" on={!!cur[k]} failed={!cur[k] && fTypes.includes(FAILMAP[k])} onClick={() => setCI(k, !cur[k], ds)}>
                {label}
              </Chk>
            );
          })}
          <div className="my-3 grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => { req.forEach((k, i) => setTimeout(() => setCI(k, true, ds), i * 10)); toast(T('day_toast_win', 'Marcado como vitória total')); }}>
              {T('day_btn_win', 'Marcar Vitória')}
            </button>
            <button className="btn-dark" onClick={() => { update((s) => { delete (s.checkins[ds] || {}).ok; delete s.checkins[ds]?.fail; }); AF.click(); toast(T('day_toast_part', 'Marcado como parcial')); }}>
              {T('day_btn_part', 'Marcar Parcial')}
            </button>
            <button className="btn-red" onClick={() => { update((s) => { s.checkins[ds] = s.checkins[ds] || { p: false, m: false, r: false }; delete s.checkins[ds].ok; s.checkins[ds].fail = 'porn'; }); AF.tone(110, 0.35, 'sine', 0.18, 0, 55); toast(T('day_toast_fall', 'Marcado como queda')); }}>
              {T('day_btn_fall', 'Registrar Queda')}
            </button>
            <button className="btn-dark" onClick={() => { update((s) => { delete s.checkins[ds]; }); toast(T('day_toast_clear', 'Registro limpo')); }}>
              {T('day_btn_clear', 'Limpar Dia')}
            </button>
          </div>
          <button className="btn-dark btn-big w-full mt-2" onClick={closeModal}>
            {T('day_btn_close', 'Fechar')}
          </button>
        </div>
      );
    };
    openModal(<DayModal />);
  };

  const shareImage = () => {
    const c = document.createElement('canvas');
    c.width = 1080;
    c.height = 1080;
    const x = c.getContext('2d');
    x.fillStyle = '#0D0D0E';
    x.fillRect(0, 0, 1080, 1080);
    x.strokeStyle = '#E5A93C';
    x.lineWidth = 8;
    x.strokeRect(48, 48, 984, 984);
    x.textAlign = 'center';
    x.fillStyle = '#FFC846';
    x.font = 'bold 62px sans-serif';
    x.fillText('FORJANDO GUERREIROS ⚔', 540, 170);
    x.fillStyle = '#F5F5F7';
    x.font = 'bold 40px sans-serif';
    x.fillText(T('cv2', 'RELATÓRIO SEMANAL DE GUERRA'), 540, 240);
    x.fillStyle = '#8E8E93';
    x.font = '28px sans-serif';
    x.fillText(
      wr.days[0].split('-').reverse().slice(0, 2).join('/') +
        T('cv_to', ' a ') +
        wr.days[6].split('-').reverse().slice(0, 2).join('/'),
      540,
      290
    );
    x.fillStyle = '#FFC846';
    x.font = 'bold 120px sans-serif';
    x.fillText(wr.daysTotal + T('cv_days', ' DIAS'), 540, 450);
    x.fillStyle = '#F5F5F7';
    x.font = 'bold 44px sans-serif';
    x.fillText(
      '🏆 ' + wr.wins + T('cv_wins', ' vitórias') + '      💥 ' + wr.falls + T('cv_falls', ' quedas'),
      540,
      570
    );
    x.fillText(
      '🔥 ' + T('cv_streak', 'streak') + ' ' + wr.streak + '      ✦ ' + T('cv_purity', 'pureza') + ' ' + wr.purity + '%',
      540,
      650
    );
    x.fillText(
      '🔨 ' + T('cv_cons', 'consistência') + ' ' + wr.consist + '%      🛡 S.O.S ' + wr.sos,
      540,
      730
    );
    x.fillStyle = '#8E8E93';
    x.font = 'italic 30px sans-serif';
    x.fillText(T('cv_motto', 'O impulso é passageiro. A honra é permanente.'), 540, 860);
    x.fillStyle = '#E5A93C';
    x.font = 'bold 30px sans-serif';
    x.fillText(T('cv_foot', 'forjandoguerreiros · reporte anônimo'), 540, 960);

    c.toBlob((b) => {
      if (!b) return;
      const f = new File([b], T('cv_file', 'relatorio-forjando-guerreiros.png'), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        navigator.share({ files: [f], title: T('cv_sharetitle', 'Relatório Semanal de Guerra') }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = f.name;
        a.click();
      }
    }, 'image/png');
  };

  const KPIS = [
    [d, L.modeA(S) ? T('kpi_clean', 'Sequência limpa') : T('kpi_streak', 'Streak atual')],
    [S.best || 0, T('kpi_best', 'Melhor streak')],
    [(S.purity != null ? S.purity : 100) + '%', T('kpi_purity', 'Score de pureza')],
    [okDays, T('kpi_okdays', 'Dias de pilares completos')],
    [forgeTotal, T('kpi_forge', 'Hábitos forjados')],
    [S.sos || 0, T('kpi_sos', 'S.O.S acionados')],
    ['🛡️ ' + L.sosWins(S), T('kpi_sosw', 'S.O.S vencidas')],
  ];

  const weekdayLetters = {
    pt: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    es: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  };

  const localeCode = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
  const currentCategory = STATS_CATEGORIES.find((c) => c.id === activeCategory) || STATS_CATEGORIES[0];
  const CurrentIcon = currentCategory.icon;

  return (
    <div className="flex flex-col gap-4 pb-16">
      {/* SELETOR DE CATEGORIAS RESPONSIVO */}
      <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-2">
        {STATS_CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isSel = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                AF.click();
                setActiveCategory(cat.id);
              }}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all truncate select-none cursor-pointer ${
                isSel
                  ? 'bg-gold text-[#141414] shadow-sm font-extrabold'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <CatIcon size={14} className="flex-none" />
              <span className="truncate">{T(cat.key, cat.label)}</span>
            </button>
          );
        })}
      </div>

      {/* CATEGORIA 1: GERAL & CONSISTÊNCIA */}
      {activeCategory === 'general' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* 1. Grade de KPIs Principais */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {KPIS.map(([v, lb], i) => (
              <div key={i} className="rounded-r border border-line bg-surface p-3 text-center">
                <b className="block font-display text-[26px] leading-none text-gold">{v}</b>
                <small className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                  {lb}
                </small>
              </div>
            ))}
          </div>

          {/* 2. Heatmap & Consistência da Forja */}
          <div className="grid gap-3.5 lg:grid-cols-2 items-stretch">
            <Card className="flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <K style={{ margin: 0 }}>
                {T('map_k', 'MAPA — ')}
                {ref
                  .toLocaleDateString(localeCode[lang] || 'pt-BR', { month: 'long', year: 'numeric' })
                  .toUpperCase()}
              </K>
              <div className="flex gap-1.5">
                <button className="chip-dim px-2 py-1" onClick={() => setHmOff(hmOff - 1)}>
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="chip-dim px-2 py-1"
                  disabled={hmOff >= 0}
                  style={hmOff >= 0 ? { opacity: 0.35 } : {}}
                  onClick={() => setHmOff(Math.min(0, hmOff + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="hm">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <b key={'w' + i} className="grid place-items-center border-none bg-transparent text-[9px] text-muted">
                  {T('wd' + i, (weekdayLetters[lang] || weekdayLetters.pt)[i])}
                </b>
              ))}
              {grid.map((c, i) =>
                c.hidden ? <b key={i} className="invisible" /> : <b key={i} className={c.cls} title={c.ds} />
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-line/60 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-muted">
            <span>
              <b className="lv1 mr-1 inline-block h-3 w-3 rounded bg-gold/25" />
              {T('lg1', '1 pilar')}
            </span>
            <span>
              <b className="lv2 mr-1 inline-block h-3 w-3 rounded bg-gold/50" />
              {T('lg2', '2 pilares')}
            </span>
            <span>
              <b className="lv3 mr-1 inline-block h-3 w-3 rounded bg-gold" />
              {T('lg3', 'completo')}
            </span>
            <span>
              <b className="lvf mr-1 inline-block h-3 w-3 rounded bg-danger/60" />
              {T('lgf', 'queda')}
            </span>
            <span>
              <b className="mr-1 inline-block h-3 w-3 rounded bg-[#202026]" />
              {T('lgn', 'sem registro')}
            </span>
          </div>
        </Card>

        {/* Card de Consistência com Resumo Mensal Integrado para Preenchimento Perfeito */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <K style={{ margin: 0 }}>{T('cons_k', '🔨 CONSISTÊNCIA DA FORJA — MÊS ATUAL')}</K>
              <span className="text-[10px] font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/25">
                {elapsed} {elapsed === 1 ? T('day_elapsed_one', 'dia corrido') : T('day_elapsed_other', 'dias corridos')}
              </span>
            </div>

            {consist.length ? (
              <div className="space-y-2.5">
                {consist.map((c) => (
                  <div key={c.h.id} className="p-2 rounded bg-surface2 border border-line/50">
                    <div className="mb-1 flex justify-between text-[12px] font-bold">
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{c.h.icon}</span>
                        <span className="truncate">{c.h.n}</span>
                      </span>
                      <span className="font-mono text-gold2 text-xs flex-none ml-2">
                        {c.cnt}/{elapsed} <span className="text-muted font-normal">({c.pct}%)</span>
                      </span>
                    </div>
                    <div className="bar">
                      <i style={{ width: c.pct + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>{T('cons_empty', 'Ative hábitos na Forja para medir consistência.')}</Empty>
            )}
          </div>

          {/* Resumo Tático Mensal: Preenche perfeitamente a parte inferior, eliminando qualquer espaço vago */}
          <div className="mt-3 pt-3 border-t border-line/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block mb-2">
              {T('cons_summary_title', 'RESUMO DE DISCIPLINA NO MÊS')}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-surface2 border border-line">
                <b className="block font-display text-lg text-gold leading-none">
                  {consist.reduce((acc, cur) => acc + cur.cnt, 0)}
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1">
                  {T('cons_done_lbl', 'Concluídos')}
                </small>
              </div>
              <div className="p-2 rounded bg-surface2 border border-line">
                <b className="block font-display text-lg text-gold leading-none">
                  {consist.length ? Math.round(consist.reduce((acc, cur) => acc + cur.pct, 0) / consist.length) : 0}%
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1">
                  {T('cons_avg_lbl', 'Adesão Média')}
                </small>
              </div>
              <div className="p-2 rounded bg-surface2 border border-line truncate">
                <b className="block font-display text-lg text-gold leading-none truncate">
                  {consist.length ? [...consist].sort((a, b) => b.pct - a.pct)[0]?.h.icon : '—'}
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1 truncate">
                  {T('cons_leader_lbl', 'Líder')}
                </small>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Relatório Semanal de Guerra (Largura Total) */}
        <Card className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <K style={{ margin: 0 }}>{T('wk_k', '📜 RELATÓRIO SEMANAL DE GUERRA (ÚLTIMOS 7 DIAS)')}</K>
            <button className="btn-ghost px-3 py-2 text-[12px]" onClick={shareImage}>
              <Share2 size={14} /> {T('wk_share', 'COMPARTILHAR IMAGEM')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-ok">{wr.wins}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_wins', 'Vitórias')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-danger">{wr.falls}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_falls', 'Quedas')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-gold">{wr.consist}%</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_cons', 'Consistência Forja')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-gold">🛡 {wr.sos}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_sos', 'S.O.S vencidas')}
              </small>
            </div>
          </div>
          <p className="fnote mt-3" style={{ textAlign: 'left' }}>
            {T('wk_part', 'Parciais: ')}
            {wr.part} · {T('wk_none', 'Sem registro: ')}
            {wr.none} · {T('wk_pur', 'Pureza atual: ')}
            {wr.purity}% · {T('wk_st', 'Streak: ')}
            {wr.streak} · {T('wk_hab', 'Hábitos concluídos: ')}
            {wr.habDone}
            {wr.habPossible ? '/' + wr.habPossible : ''}.
            {T('wk_push', ' Todo domingo você recebe um push avisando que o relatório está pronto.')}
          </p>
        </Card>
      </div>
    </div>
  )}

  {/* CATEGORIA: LINHA DO TEMPO (HISTÓRICO INTERATIVO DE DIAS, VITÓRIAS & SOS) */}
  {activeCategory === 'timeline' && (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      <Card className="flex-1 flex flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <K className="mb-0 flex items-center gap-2">
              <CalendarDays size={16} className="text-gold" />
              <span>{T('tl_title', 'LINHA DO TEMPO & DIAS DE COMBATE')}</span>
            </K>
            <span className="text-xs font-mono font-bold text-gold px-2.5 py-0.5 rounded bg-gold/10 border border-gold/30">
              {T('tl_rate', 'Taxa: ')}{timelineData.rate}%
            </span>
          </div>

          {/* Seletor de Intervalo de Dias */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {[7, 14, 30, 60, 90, 365].map((n) => (
              <button
                key={n}
                type="button"
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  timelineRange === n
                    ? 'border-gold bg-gold text-[#141414] shadow-sm'
                    : 'border-line bg-surface text-muted hover:text-ink hover:border-gold/40'
                }`}
                onClick={() => {
                  AF.click();
                  setTimelineRange(n);
                }}
              >
                {n} {T('tl_days_btn', 'dias')}
              </button>
            ))}

            <button
              type="button"
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                timelineRange === 'custom'
                  ? 'border-gold bg-gold text-[#141414] shadow-sm'
                  : 'border-line bg-surface text-muted hover:text-ink hover:border-gold/40'
              }`}
              onClick={() => {
                AF.click();
                setTimelineRange('custom');
              }}
            >
              <Calendar size={12} />
              <span>{T('tl_custom_btn', 'Personalizado 📅')}</span>
            </button>
          </div>

          {/* Filtro de Datas Personalizadas */}
          {timelineRange === 'custom' && (
            <div className="mb-3 flex flex-wrap items-center gap-2.5 p-2.5 rounded-xl bg-surface2/70 border border-line text-xs animate-in fade-in">
              <span className="font-mono text-muted text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar size={12} className="text-gold" /> {T('tl_custom_filter', 'Período Personalizado')}:
              </span>
              <div className="flex items-center gap-1.5">
                <label className="text-muted text-[11px] font-mono">{T('tl_custom_start', 'Início')}:</label>
                <input
                  type="date"
                  value={customStart}
                  max={customEnd || today()}
                  onChange={(e) => {
                    setCustomStart(e.target.value);
                    AF.click();
                  }}
                  className="px-2 py-1 rounded bg-[#16161a] border border-line text-ink text-xs font-mono focus:border-gold outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-muted text-[11px] font-mono">{T('tl_custom_end', 'Fim')}:</label>
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  max={today()}
                  onChange={(e) => {
                    setCustomEnd(e.target.value);
                    AF.click();
                  }}
                  className="px-2 py-1 rounded bg-[#16161a] border border-line text-ink text-xs font-mono focus:border-gold outline-none"
                />
              </div>
            </div>
          )}

          {/* Badges de Desempenho Tático */}
          <div className="mb-3.5 flex flex-wrap gap-1.5">
            <span className="chip cursor-default text-[11px] font-bold text-gold border-gold/40">
              🏆 {timelineData.wins} {T('tl_badge_wins', 'Vitórias')}
            </span>
            <span className="chip-dim cursor-default border-danger/50 text-danger text-[11px] font-bold">
              💥 {timelineData.falls} {T('tl_badge_falls', 'Quedas')}
            </span>
            <span className="chip-dim cursor-default text-[11px]">
              ◐ {timelineData.part} {T('tl_badge_part', 'Parciais')}
            </span>
            <span className="chip-dim cursor-default text-[11px] text-[#EDE5D5]">
              ⚡ {timelineData.rate}% {T('tl_badge_cons', 'Consistência')}
            </span>
            <span className="chip-dim cursor-default border-ok/45 text-ok text-[11px] font-bold">
              🛡️ {L.sosWins(S)} {T('tl_badge_sos', 'S.O.S Vencidos')}
            </span>
          </div>

          {/* CURVA DE VITALIDADE & FORÇA */}
          <VitalityCurve
            curve={timelineData.curve}
            peakVitality={timelineData.peakVitality}
            avgVitality={timelineData.avgVitality}
            curVitality={timelineData.curVitality}
            T={T}
          />

          {/* Grid de Células de Dias */}
          <div className="flex flex-wrap gap-[5px] p-2.5 rounded-xl bg-[#121217] border border-line/60">
            {timelineData.cells.map((c) => (
              <button
                key={c.ds}
                title={`${c.ds} · ${c.lab} ${T('tl_cell_edit_tip', '(Clique para editar este dia)')}`}
                className={`tlc ${c.cls} cursor-pointer hover:scale-125 transition-transform`}
                onClick={() => dayEditor(c.ds)}
              />
            ))}
          </div>
        </div>

        {/* Legenda de Cores */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted pt-3 border-t border-line/50">
          <span className="flex items-center gap-1.5">
            <b className="tlc w inline-block" style={{ animation: 'none' }} /> {T('tl_leg_win', 'Vitória (3/3 pilares)')}
          </span>
          <span className="flex items-center gap-1.5">
            <b className="tlc p inline-block" style={{ animation: 'none' }} /> {T('tl_leg_part', 'Parcial')}
          </span>
          <span className="flex items-center gap-1.5">
            <b className="tlc f inline-block" style={{ animation: 'none' }} /> {T('tl_leg_fall', 'Queda')}
          </span>
          <span className="flex items-center gap-1.5">
            <b className="inline-block h-[13px] w-[13px] rounded bg-[#202026] border border-line/40" /> {T('tl_leg_none', 'Sem registro')}
          </span>
          <span className="w-full text-[10px] text-gold/80 mt-1">
            {T('tl_hint', '💡 Toque em qualquer dia para inspecionar, corrigir pilares ou registrar histórico retroativo.')}
          </span>
        </div>
      </Card>
    </div>
  )}

  {/* CATEGORIA 2: RISCO & S.O.S */}
  {activeCategory === 'risk' && (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      <div className="grid gap-3.5 lg:grid-cols-2 items-stretch">
        {/* Mapa de Risco por Horário */}
        <Card className="flex flex-col justify-between">
          <div>
            <K>
              <Clock3 size={12} className="mr-1 inline text-gold" /> {T('risk_k', 'MAPA DE RISCO POR HORÁRIO')}
            </K>
            {us.total ? (
              <>
                <div className="grid grid-cols-12 gap-1 my-2">
                  {us.buckets.map((b, h) => {
                    const max = Math.max(1, ...us.buckets.map((y) => y.sum + y.n));
                    const lvl = (b.sum + b.n) / max;
                    return (
                      <b
                        key={h}
                        title={h + 'h · ' + b.n + T('risk_reg', ' registro(s)')}
                        className="aspect-square rounded border border-line"
                        style={{ background: lvl > 0 ? `rgba(255,77,77,${0.15 + lvl * 0.85})` : '#202026' }}
                      />
                    );
                  })}
                </div>
                <div className="p-2 rounded bg-danger/10 border border-danger/30 text-xs font-bold text-danger flex items-center justify-between">
                  <span>{T('risk_win', '🎯 Janela Crítica de Alerta:')}</span>
                  <span className="font-mono">{us.window[0]}h – {us.window[1]}h</span>
                </div>
              </>
            ) : (
              <div className="p-3 my-2 rounded bg-surface2 border border-line text-xs text-muted leading-relaxed">
                {T('risk_empty_desc', 'Nenhum impulso crítico registrado ainda. Acione o botão S.O.S em momentos de urgência para mapear com precisão cirúrgica seus horários de maior vulnerabilidade.')}
              </div>
            )}
          </div>
          <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
            {us.total ? `${us.total} ${T('risk_note', 'impulsos registrados. Mantenha telas longe do quarto nessa janela.')}` : T('risk_note_default', 'Defesa preventiva ativa: mantenha o celular fora do quarto após as 22h.')}
          </p>
        </Card>

        {/* Histórico S.O.S */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <K style={{ margin: 0 }} className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" />
                <span>{T('sos_won_title', 'INTERVENÇÕES S.O.S VENCIDAS')}</span>
              </K>
              <span className="text-xs font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                {L.sosWins(S)} {T('sos_won_badge', 'Vencidas')}
              </span>
            </div>
            {sosHist.length ? (
              <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-1">
                {sosHist.map((e, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center rounded-r border border-line bg-surface2 p-2 text-[12px] font-semibold"
                  >
                    <span className="flex items-center gap-1.5 text-gold">
                      <span>🛡️</span>
                      <span>{T('sos_item', 'Intervenção Vencida')}</span>
                    </span>
                    <span className="font-mono text-[10.5px] text-muted">
                      {fdmy(e.d || dstr(new Date(e.ts || Date.now())))} · {e.h || '--:--'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded bg-surface2 border border-line text-xs text-muted leading-relaxed">
                {T('sos_empty_full', 'Nenhuma intervenção S.O.S registrada ainda. Em momentos de urgência, use o botão de emergência flutuante para resfriar a mente e salvar seu streak.')}
              </div>
            )}
          </div>
          <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
            {T('sos_footer_note', 'Cada vitória no S.O.S recalibra os receptores de dopamina pré-frontais.')}
          </p>
        </Card>
      </div>

      {/* Ranking de Gatilhos & Auditoria */}
      <Card className="border-danger/30">
        <div>
          <K className="text-danger flex items-center gap-1.5 text-xs font-bold font-mono uppercase mb-2">
            <ShieldAlert size={14} />
            {triggerRank.length > 0 ? T('trg_rank_title', 'RANKING DE GATILHOS (AUDITORIA)') : T('trg_shield_title', 'BLINDAGEM CONTRA GATILHOS')}
          </K>
          {triggerRank.length > 0 ? (
            <div className="flex flex-col gap-2">
              {triggerRank.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1 p-2 rounded bg-surface2 border border-line/40">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-ink flex items-center gap-1.5 truncate">
                      <span className="text-danger font-mono font-bold text-[11px]">#{idx + 1}</span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono text-danger font-bold text-xs flex-none ml-2">
                      {item.count}x ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#1b1b22] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-danger h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface2 border border-line flex items-center gap-2">
                <span className="text-ok font-bold text-sm">✓</span>
                <span className="text-ink">{T('trg_empty_safe', 'Nenhuma queda recente registrada. Defesas intactas!')}</span>
              </div>
              <div className="p-2 rounded bg-surface2/60 border border-line/50 text-[11px] text-muted space-y-1">
                <div className="font-bold text-gold2">{T('trg_empty_top', 'Top Gatilhos Críticos a Vigiar:')}</div>
                <div>{T('trg_empty_1', '• Redes Sociais no escuro da madrugada')}</div>
                <div>{T('trg_empty_2', '• Estresse acumulado e cansaço sem treino')}</div>
                <div>{T('trg_empty_3', '• Tédio e isolamento com computador aberto')}</div>
              </div>
            </div>
          )}
        </div>
        <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
          {T('trg_footer_note', 'Identificar o gatilho antecipadamente desativa a cascata impulsiva no cérebro.')}
        </p>
      </Card>
    </div>
  )}

  {/* CATEGORIA 3: SALÃO DA FAMA & HONRA */}
  {activeCategory === 'hall' && (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* Resumo de Honra & Conquistas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{T('hall_stat_streak', 'Streak Atual')}</span>
          <b className="block font-display text-2xl text-gold mt-1">🔥 {S.streak || 0}d</b>
        </div>
        <div className="p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{T('hall_stat_purity', 'Índice de Pureza')}</span>
          <b className="block font-display text-2xl text-gold mt-1">✦ {S.purity || 100}%</b>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">{T('hall_stat_status', 'Status no Salão')}</span>
          <span className={`block font-mono text-xs font-bold mt-2 ${S.hallOptIn ? 'text-gold' : 'text-muted'}`}>
            {S.hallOptIn ? `🛡️ ${S.hallName || T('hall_stat_active', 'Ativo')}` : `🔒 ${T('hall_stat_private', 'Privado')}`}
          </span>
        </div>
      </div>

      {/* Salão da Fama Anônimo */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <K style={{ margin: 0 }}>
              <Trophy size={12} className="mr-1 inline text-gold" /> {T('hall_k', 'SALÃO DA FAMA ANÔNIMO')}
            </K>
            <span className="text-[10px] font-mono text-muted">
              {S.hallOptIn ? `🛡️ ${T('hall_joined', 'Participando')}` : T('hall_priv_mode', 'Modo Privado')}
            </span>
          </div>
          {hall === null ? (
            <Empty>{T('loading', 'Carregando...')}</Empty>
          ) : hall.length ? (
            <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
              {hall.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 rounded-r border p-2.5 text-[12px] font-bold ${
                    h.name === S.hallName ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface2'
                  }`}
                >
                  <span className="w-7 text-center font-display text-sm text-gold2">
                    {i + 1}º
                  </span>
                  <span className="flex-1 truncate">
                    {h.name} {h.name === S.hallName ? T('you', '(você)') : ''}
                  </span>
                  <span className="text-xs text-muted">{h.tier}</span>
                  <span className="font-mono text-gold text-xs font-bold">{h.days}d</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded bg-surface2 border border-line text-xs text-muted">
              {T('hall_empty_act', 'Nenhum guerreiro optou pelo Salão ainda. Ative nas Configurações para ingressar.')}
            </div>
          )}
        </div>
        <p className="fnote mt-3 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
          {T('hall_note', 'Ranking anônimo com pseudônimos — apenas dias e patamar.')}
        </p>
      </Card>

      {/* Cartão de Compartilhamento Semanal */}
      <Card className="p-3.5 bg-gradient-to-br from-surface to-gold/5 border-gold/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold font-mono text-gold flex items-center gap-1.5 uppercase tracking-wider">
              <Share2 size={13} />
              <span>{T('hall_share_title', 'Cartão Semanal de Honra & Vitória')}</span>
            </span>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {T('hall_share_desc', 'Exporte o seu resumo semanal oficial com gráficos vetoriais, dias limpos e streak para compartilhar ou salvar nas suas notas.')}
            </p>
          </div>
          <button
            type="button"
            className="btn-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap flex-none w-full sm:w-auto justify-center cursor-pointer"
            onClick={shareImage}
          >
            <Share2 size={13} />
            <span>{T('hall_share_btn', 'Exportar Imagem')}</span>
          </button>
        </div>
      </Card>
    </div>
  )}
    </div>
  );
}
