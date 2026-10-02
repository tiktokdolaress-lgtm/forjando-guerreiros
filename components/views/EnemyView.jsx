'use client';
import React, { useState } from 'react';
import {
  Skull,
  ChevronDown,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Activity,
  Clock,
  CheckCircle2,
  FileText,
  Table,
  Flame,
  ShieldCheck,
  Zap,
  Award,
  Check,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { DOSSIER, DOSSIER_TABLE } from '@/lib/data';
import { AF } from '@/lib/audio';
import { cx, cxDossier, cxTable } from '@/lib/content-i18n';
import * as L from '@/lib/logic';

/* =========================================================================
   DICIONÁRIO TRILÍNGUE — O INIMIGO REVELADO (PADRÃO DA FORJA)
   ========================================================================= */
export const ENEMY_I18N = {
  tabDossier: { pt: 'Dossiês Científicos', en: 'Scientific Dossiers', es: 'Dossieres Científicos' },
  tabTable: { pt: 'Quadro Clínico', en: 'Clinical Overview', es: 'Cuadro Clínico' },
  tabTimeline: { pt: 'Cronograma Neural', en: 'Neural Timeline', es: 'Cronograma Neural' },

  headlineDossier: { pt: 'DOSSIÊ CIENTÍFICO & NEUROBIOLOGIA', en: 'SCIENTIFIC DOSSIER & NEUROBIOLOGY', es: 'DOSIER CIENTÍFICO Y NEUROBIOLOGÍA' },
  subtitleDossier: { pt: 'Evidências médicas irrefutáveis sobre o impacto da pornografia e masturbação compulsiva.', en: 'Irrefutable medical evidence on the impact of compulsive pornography and masturbation.', es: 'Evidencias médicas irrefutables sobre el impacto de la pornografía y masturbación compulsiva.' },

  headlineTable: { pt: 'MAPA DE DANOS & SINTOMAS CLÍNICOS', en: 'DAMAGE MAP & CLINICAL SYMPTOMS', es: 'MAPA DE DAÑOS Y SÍNTOMAS CLÍNICOS' },
  subtitleTable: { pt: 'Auditoria anatômica e neuroquímica das 6 áreas afetadas e seus efeitos no organismo.', en: 'Anatomical and neurochemical audit of the 6 affected areas and their bodily effects.', es: 'Auditoría anatómica y neuroquímica de las 6 áreas afectadas y sus efectos en el organismo.' },

  headlineTimeline: { pt: 'CRONOGRAMA DE RECUPERAÇÃO NEURAL', en: 'NEURAL RECOVERY TIMELINE', es: 'CRONOGRAMA DE RECUPERACIÓN NEURAL' },
  subtitleTimeline: { pt: 'Fases biológicas da neuroplasticidade: da desinflamação ao reset total dos receptores D2.', en: 'Biological phases of neuroplasticity: from de-inflammation to full D2 receptor reset.', es: 'Fases biológicas de la neuroplasticidad: de la desinflamación al reseteo total de los receptores D2.' },

  badgeClinicalStudies: { pt: 'ESTUDOS MÉDICOS', en: 'MEDICAL STUDIES', es: 'ESTUDIOS MÉDICOS' },
  badgeDamageAudit: { pt: '6 ÁREAS MAPEADAS', en: '6 MAPPED AREAS', es: '6 ÁREAS MAPEADAS' },
  badgeResetD2: { pt: 'RESET D2 (0-90D)', en: 'D2 RESET (0-90D)', es: 'RESET D2 (0-90D)' },

  btnExpandAll: { pt: 'Expandir Todos', en: 'Expand All', es: 'Expandir Todos' },
  btnCollapseAll: { pt: 'Recolher Todos', en: 'Collapse All', es: 'Contraer Todos' },

  kpiPied: { pt: 'Incidência DEIP em usuários compulsivos', en: 'PIED incidence in compulsive users', es: 'Incidencia DEIP en usuarios compulsivos' },
  kpiVolume: { pt: 'Volume no Estriado (Max Planck)', en: 'Striatum Volume (Max Planck)', es: 'Volumen en el Estriado (Max Planck)' },
  kpiThreshold: { pt: 'Aumento no Limiar Dopaminérgico', en: 'Increase in Dopamine Threshold', es: 'Aumento en el Umbral Dopaminérgico' },
  kpiReversible: { pt: 'Reversível com a Retenção & Forja', en: 'Reversible with Retention & Forge', es: 'Reversible con Retención y Forja' },

  thArea: { pt: 'Área Anatômica', en: 'Anatomical Area', es: 'Área Anatómica' },
  thCondition: { pt: 'Patologia / Condição', en: 'Pathology / Condition', es: 'Patología / Condición' },
  thSymptom: { pt: 'Sintoma Clínico Principal', en: 'Main Clinical Symptom', es: 'Síntoma Clínico Principal' },
  tableNote: { pt: 'Conhecer o inimigo é metade da vitória. A outra metade é a Forja.', en: 'Knowing the enemy is half the victory. The other half is the Forge.', es: 'Conocer al enemigo es la mitad de la victoria. La otra mitad es la Forja.' },

  timelineFooter: { pt: 'O cérebro tem neuroplasticidade infinita. Cada dia de retenção reconstrói receptores e devolve seu império.', en: 'The brain has infinite neuroplasticity. Every day of retention rebuilds receptors and restores your empire.', es: 'El cerebro tiene neuroplasticidad infinita. Cada día de retención reconstruye receptores y devuelve tu imperio.' },

  phaseCurrent: { pt: 'SUA FASE ATUAL', en: 'YOUR CURRENT PHASE', es: 'TU FASE ACTUAL' },
  phaseCompleted: { pt: 'SUPERADA', en: 'CONQUERED', es: 'SUPERADA' },
  phaseUpcoming: { pt: 'PRÓXIMO PATAMAR', en: 'NEXT TIER', es: 'PRÓXIMO NIVEL' },
  phaseProgress: { pt: 'Progresso da fase', en: 'Phase progress', es: 'Progreso de la fase' },

  scientificEvidenceLabel: { pt: 'Evidência Científica', en: 'Scientific Evidence', es: 'Evidencia Científica' },
  biologicalMechanismLabel: { pt: 'Mecanismo Biológico', en: 'Biological Mechanism', es: 'Mecanismo Biológico' },
  retentionNoteTitle: { pt: 'DECRETO TÁTICO: RETENÇÃO SEMINAL', en: 'TACTICAL DECREE: SEMINAL RETENTION', es: 'DECRETO TÁCTICO: RETENCIÓN SEMINAL' },
};

export default function EnemyView() {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = (k, fb) => (ENEMY_I18N[k] && ENEMY_I18N[k][curLang]) || fb;
  const T = (id, fb) => cx(lang, 'enemy', id) || fb;

  const streak = (L && typeof L.currentStreak === 'function' && S ? L.currentStreak(S) : (S && S.streak) || 0) || 0;
  const doss = cxDossier(lang, DOSSIER);
  const rows = cxTable(lang, DOSSIER_TABLE);

  const ENEMY_CATEGORIES = [
    { id: 'dossier', key: 'tabDossier', label: 'Dossiês Científicos', icon: FileText },
    { id: 'table', key: 'tabTable', label: 'Quadro Clínico', icon: Table },
    { id: 'timeline', key: 'tabTimeline', label: 'Cronograma Neural', icon: Clock },
  ];

  const DOSSIER_TAGS = {
    deip: { tag: T('tag_deip', 'UROLOGIA & EREÇÃO'), color: 'text-danger border-danger/40 bg-danger/10' },
    brain: { tag: T('tag_brain', 'NEUROBIOLOGIA & DOPAMINA'), color: 'text-gold border-gold/40 bg-gold/10' },
    grip: { tag: T('tag_grip', 'SISTEMA NERVOSO PERIFÉRICO'), color: 'text-[#E5A93C] border-[#E5A93C]/40 bg-[#E5A93C]/10' },
    pelvic: { tag: T('tag_pelvic', 'FISIOTERAPIA & ASSOALHO PÉLVICO'), color: 'text-danger border-danger/40 bg-danger/10' },
    escalation: { tag: T('tag_escalation', 'TOLERÂNCIA & COMPORTAMENTO'), color: 'text-purple-400 border-purple-400/40 bg-purple-400/10' },
    social: { tag: T('tag_social', 'VÍNCULOS & AUTOESTIMA'), color: 'text-sky-400 border-sky-400/40 bg-sky-400/10' },
  };

  const RECOVERY_TIMELINE = [
    {
      id: 1,
      min: 0,
      max: 14,
      period: T('rec_p1_period', '0 a 14 Dias'),
      title: T('rec_p1_title', 'Desinflamação & Choque Químico'),
      desc: T('rec_p1_desc', 'Queda do cortisol, redução do estresse neural e corte do looping de pornografia. A abstinência atinge o pico de fissura.'),
      icon: '⚡',
      accent: 'border-danger/40 text-danger',
    },
    {
      id: 2,
      min: 15,
      max: 30,
      period: T('rec_p2_period', '15 a 30 Dias'),
      title: T('rec_p2_title', 'Restauração da Sensibilidade'),
      desc: T('rec_p2_desc', 'Receptores periféricos começam a se regenerar (reversão do Death Grip). A ansiedade social e a névoa mental diminuem.'),
      icon: '🌿',
      accent: 'border-[#E5A93C]/40 text-[#E5A93C]',
    },
    {
      id: 3,
      min: 31,
      max: 90,
      period: T('rec_p3_period', '31 a 90 Dias'),
      title: T('rec_p3_title', 'Reconexão Pré-Frontal & Cura da DEIP'),
      desc: T('rec_p3_desc', 'O cérebro repara a via frontoestriatal. Retorno das ereções matinais espontâneas e atração por pessoas reais.'),
      icon: '🛡️',
      accent: 'border-gold/40 text-gold',
    },
    {
      id: 4,
      min: 91,
      max: 99999,
      period: T('rec_p4_period', '90+ Dias'),
      title: T('rec_p4_title', 'Neuroplasticidade Consolidada'),
      desc: T('rec_p4_desc', 'Densidade de receptores D2 restaurada ao estado de fábrica. Força de vontade inabalável, foco laser e autocontrole pleno.'),
      icon: '👑',
      accent: 'border-ok/40 text-ok',
    },
  ];

  const [activeCategory, setActiveCategory] = useState('dossier');
  const [open, setOpen] = useState({ deip: true, brain: true, grip: true, pelvic: true, escalation: true, social: true });

  const toggleAll = () => {
    AF.click();
    const hasAnyClosed = Object.values(open).some((v) => !v);
    const nextState = {};
    doss.forEach((d) => { nextState[d.id] = hasAnyClosed; });
    setOpen(nextState);
  };

  return (
    <div className="flex flex-col gap-4 pb-16 w-full max-w-full min-w-0">
      {/* NAVEGAÇÃO DE SUB-ABAS EM AÇO FORJADO & OURO */}
      <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-2 select-none">
        {ENEMY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                AF.click();
                setActiveCategory(cat.id);
              }}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-mono font-bold transition-all truncate select-none cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-gold text-[#141414] shadow-sm font-black'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Icon size={14} className="flex-none" />
              <span className="truncate">{tx(cat.key, cat.label)}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-ABA 1: DOSSIÊS CIENTÍFICOS
          ========================================================================= */}
      {activeCategory === 'dossier' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150 w-full max-w-full min-w-0">
          {/* BANNER TÁTICO DOSSIÊS CIENTÍFICOS */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-danger/30 bg-gradient-to-r from-[#191316] via-[#121217] to-[#191316] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-danger/40 flex items-center justify-center text-danger flex-none">
                <ShieldAlert size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx('headlineDossier', 'DOSSIÊ CIENTÍFICO & NEUROBIOLOGIA')}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-danger/15 text-danger border-danger/40">
                    {tx('badgeClinicalStudies', 'ESTUDOS MÉDICOS')}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  {tx('subtitleDossier', 'Evidências médicas irrefutáveis sobre o impacto da pornografia e masturbação compulsiva.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <button
                type="button"
                onClick={toggleAll}
                className="py-1.5 px-3 rounded-lg border border-line/80 bg-surface2/90 hover:border-gold/50 text-gold2 hover:text-gold text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>{Object.values(open).some((v) => !v) ? tx('btnExpandAll', 'Expandir Todos') : tx('btnCollapseAll', 'Recolher Todos')}</span>
              </button>
            </div>
          </div>

          {/* 4 KPIS DE IMPACTO CLÍNICO & NEUROBIOLÓGICO */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-xl border border-danger/30 bg-[#131218] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-danger">DEIP</span>
                <ShieldAlert size={15} className="text-danger" />
              </div>
              <div>
                <b className="block font-display text-2xl sm:text-3xl text-danger font-black">78%</b>
                <small className="text-[10px] font-mono text-muted block mt-1 leading-tight font-bold">
                  {tx('kpiPied', 'Incidência DEIP em usuários compulsivos')}
                </small>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gold/30 bg-[#131218] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold">MAX PLANCK</span>
                <Activity size={15} className="text-gold" />
              </div>
              <div>
                <b className="block font-display text-2xl sm:text-3xl text-gold font-black">-15%</b>
                <small className="text-[10px] font-mono text-muted block mt-1 leading-tight font-bold">
                  {tx('kpiVolume', 'Volume no Estriado (Max Planck)')}
                </small>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5A93C]/30 bg-[#131218] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5A93C]">DOPAMINA</span>
                <Flame size={15} className="text-[#E5A93C]" />
              </div>
              <div>
                <b className="block font-display text-2xl sm:text-3xl text-[#E5A93C] font-black">3×</b>
                <small className="text-[10px] font-mono text-muted block mt-1 leading-tight font-bold">
                  {tx('kpiThreshold', 'Aumento no Limiar Dopaminérgico')}
                </small>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-ok/30 bg-[#131218] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ok">NEUROPLASTICIDADE</span>
                <Sparkles size={15} className="text-ok" />
              </div>
              <div>
                <b className="block font-display text-2xl sm:text-3xl text-ok font-black">100%</b>
                <small className="text-[10px] font-mono text-muted block mt-1 leading-tight font-bold">
                  {tx('kpiReversible', 'Reversível com a Retenção & Forja')}
                </small>
              </div>
            </div>
          </div>

          {/* GRADE DOS 6 DOSSIÊS CIENTÍFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
            {doss.map((d) => {
              const isOpen = !!open[d.id];
              const tagInfo = DOSSIER_TAGS[d.id] || { tag: 'MEDICINA', color: 'text-muted border-line bg-surface2' };
              return (
                <div
                  key={d.id}
                  className="rounded-xl border border-line/80 hover:border-gold/40 bg-[#121217] transition-all overflow-hidden flex flex-col shadow-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 p-3.5 sm:p-4 text-left bg-gradient-to-r from-surface2/90 via-surface/80 to-surface2/90 hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer select-none"
                    onClick={() => {
                      AF.click();
                      setOpen((o) => ({ ...o, [d.id]: !o[d.id] }));
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#181822] border border-line/90 flex items-center justify-center text-xl flex-none shadow-sm">
                        <span>{d.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-display font-bold truncate text-ink tracking-wide">
                          {d.t}
                        </span>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold border ${tagInfo.color}`}>
                          {tagInfo.tag}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`flex-none text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : ''}`}
                    />
                  </button>

                  <div className={`transition-all duration-300 ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="space-y-2.5 border-t border-line/60 p-3.5 sm:p-4 bg-[#0e0e13]/80">
                      {d.pts.map((p, j) => {
                        const isRetentionHighlight = p[2] === true;
                        const hasCitation = p[2] && p[2] !== true;

                        if (isRetentionHighlight) {
                          return (
                            <div
                              key={j}
                              className="rounded-xl border border-gold/40 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent p-3 text-xs leading-relaxed text-ink shadow-sm"
                            >
                              <div className="flex items-center gap-1.5 text-gold font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
                                <ShieldCheck size={14} />
                                <span>{tx('retentionNoteTitle', 'DECRETO TÁTICO: RETENÇÃO SEMINAL')}</span>
                              </div>
                              <p className="text-ink/90 font-medium text-[11.5px] leading-relaxed">
                                {p[1]}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={j}
                            className="rounded-lg border border-line/70 bg-[#16151c]/80 p-3 text-xs leading-relaxed"
                          >
                            <div className="flex items-start gap-1.5">
                              <span className="text-gold font-mono font-bold flex-none text-[11px] mt-0.5">▸</span>
                              <div className="min-w-0">
                                <b className="text-gold2 font-bold text-[12px]">{p[0]}: </b>
                                <span className="text-muted/90 text-[11.5px] leading-relaxed">{p[1]}</span>
                                {hasCitation && (
                                  <div className="mt-2 pt-1.5 border-t border-line/50 flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-gold">
                                    <BookOpen size={12} className="flex-none" />
                                    <span>{p[2]}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 2: QUADRO CLÍNICO (TABELA DE DANOS & SINTOMAS)
          ========================================================================= */}
      {activeCategory === 'table' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150 w-full max-w-full min-w-0">
          {/* BANNER TÁTICO QUADRO CLÍNICO */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-gold/40 flex items-center justify-center text-gold flex-none">
                <Table size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx('headlineTable', 'MAPA DE DANOS & SINTOMAS CLÍNICOS')}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-gold/15 text-gold border-gold/30">
                    {tx('badgeDamageAudit', '6 ÁREAS MAPEADAS')}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  {tx('subtitleTable', 'Auditoria anatômica e neuroquímica das 6 áreas afetadas e seus efeitos no organismo.')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded-lg bg-surface2/90 border border-line/80 text-gold font-bold">
                ⚔️ 6/6 Áreas Críticas
              </span>
            </div>
          </div>

          {/* TABELA DE AÇO FORJADO */}
          <div className="rounded-xl border border-line/80 bg-[#121217] p-3.5 sm:p-5 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[500px] border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-line/80 text-left text-[10.5px] uppercase font-mono font-black tracking-wider text-gold pb-2">
                    <th className="p-3 w-1/4">{tx('thArea', 'Área Anatômica')}</th>
                    <th className="p-3 w-1/3">{tx('thCondition', 'Patologia / Condição')}</th>
                    <th className="p-3">{tx('thSymptom', 'Sintoma Clínico Principal')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40 font-medium">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-surface2/60 transition-colors group">
                      <td className="p-3 font-bold text-ink">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/70 group-hover:bg-gold transition-colors flex-none" />
                          <span>{r[0]}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-danger/10 border border-danger/30 text-danger font-mono font-bold text-[11px]">
                          {r[1]}
                        </span>
                      </td>
                      <td className="p-3 text-muted/95 leading-relaxed text-[11.5px]">
                        {r[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between flex-wrap gap-2">
              <p className="fnote flex items-center gap-1.5" style={{ textAlign: 'left', margin: 0 }}>
                <BookOpen size={12} className="text-gold flex-none" />
                <span>{tx('tableNote', 'Conhecer o inimigo é metade da vitória. A outra metade é a Forja.')}</span>
              </p>
              <span className="text-[10px] font-mono text-muted">Ref: Begovic · Kühn · Cleveland Clinic</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 3: CRONOGRAMA DE RECUPERAÇÃO NEURAL (SINCRONIZADO AO STREAK)
          ========================================================================= */}
      {activeCategory === 'timeline' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150 w-full max-w-full min-w-0">
          {/* BANNER TÁTICO CRONOGRAMA NEURAL */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-gold/30 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] shadow-sm select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface2/90 border border-gold/40 flex items-center justify-center text-gold flex-none">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-display font-black tracking-wide text-ink uppercase">
                    {tx('headlineTimeline', 'CRONOGRAMA DE RECUPERAÇÃO NEURAL')}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-gold/15 text-gold border-gold/30">
                    {tx('badgeResetD2', 'RESET D2 (0-90D)')}
                  </span>
                </div>
                <p className="text-[11px] text-muted truncate mt-0.5">
                  {tx('subtitleTimeline', 'Fases biológicas da neuroplasticidade: da desinflamação ao reset total dos receptores D2.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/40 text-gold font-bold">
                🔥 {streak} {streak === 1 ? 'Dia' : 'Dias'} de Retenção
              </span>
            </div>
          </div>

          {/* CARDS DAS 4 FASES DE NEUROPLASTICIDADE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {RECOVERY_TIMELINE.map((item) => {
              const isCurrent = streak >= item.min && streak <= item.max;
              const isPassed = streak > item.max;
              const isUpcoming = streak < item.min;

              // Cálculo do progresso na fase atual
              let pct = 0;
              if (isPassed) pct = 100;
              else if (isCurrent) {
                const span = Math.max(1, item.max - item.min);
                pct = Math.min(100, Math.max(5, Math.round(((streak - item.min) / span) * 100)));
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all shadow-sm ${
                    isCurrent
                      ? 'border-gold bg-gradient-to-br from-[#1c1a24] via-[#14131a] to-[#181622] shadow-md shadow-gold/5'
                      : isPassed
                      ? 'border-ok/40 bg-ok/5'
                      : 'border-line/70 bg-[#121217]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-mono font-bold text-xs">
                        <span className="text-xl flex-none">{item.icon}</span>
                        <span className={`text-xs uppercase tracking-wider font-display font-extrabold ${item.accent}`}>
                          {item.period}
                        </span>
                      </div>
                      <div>
                        {isCurrent && (
                          <span className="text-[9.5px] font-mono font-black text-[#141414] bg-gold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Flame size={11} className="fill-current" />
                            <span>{tx('phaseCurrent', 'SUA FASE ATUAL')}</span>
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-[9.5px] font-mono font-bold text-ok bg-ok/15 border border-ok/30 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check size={11} />
                            <span>{tx('phaseCompleted', 'SUPERADA')}</span>
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="text-[9.5px] font-mono font-bold text-muted bg-surface2 border border-line/70 px-2 py-0.5 rounded">
                            {tx('phaseUpcoming', 'PRÓXIMO PATAMAR')}
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm font-display font-bold text-ink tracking-wide mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-muted/95 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-line/50">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-muted">{tx('phaseProgress', 'Progresso da fase')}</span>
                      <span className={isCurrent ? 'text-gold font-bold' : isPassed ? 'text-ok font-bold' : 'text-muted'}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface2 overflow-hidden border border-line/50">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCurrent ? 'bg-gold' : isPassed ? 'bg-ok' : 'bg-muted/40'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl border border-gold/30 bg-[#121217] shadow-sm">
            <p className="fnote flex items-center gap-2" style={{ textAlign: 'left', margin: 0 }}>
              <Zap size={14} className="text-gold flex-none" />
              <span>{tx('timelineFooter', 'O cérebro tem neuroplasticidade infinita. Cada dia de retenção reconstrói receptores e devolve seu império.')}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
