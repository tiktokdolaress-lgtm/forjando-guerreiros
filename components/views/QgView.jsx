'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Trophy, CalendarDays, Flame, ShieldCheck, Droplets, Hand, HeartPulse, Check, X, Zap, Sparkles, ShieldAlert, Target, Compass, MoreVertical, LayoutDashboard, ChevronDown, ChevronUp, Clock, Link as LinkIcon, Eye, Play, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Bar, Chk, Empty } from '@/components/ui';
import { METAS, NEXTF, FAIL_PEN, TRIGGERS, FAIL_LBL, TIERS, QUOTES } from '@/lib/data';
import { cx, cxHabits, cxTiers, cxQuotes } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF, metaSfx } from '@/lib/audio';
import { today, dstr, fdmy, fmtD, pad, yesterday } from '@/lib/utils';
import WarriorLogo from '@/components/WarriorLogo';
import WarriorLevelUpModal from '@/components/WarriorLevelUpModal';
import WarriorEvolutionGalleryModal from '@/components/WarriorEvolutionGalleryModal';
import Warrior3DCard from '@/components/Warrior3DCard';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getTodayCombatTimeline } from '@/lib/notify';

/* Dicionário Internacional dos Efeitos Biológicos e Mentais (PT / EN / ES) */
const BIO_EFFECTS_I18N = {
  header: {
    pt: 'EFEITOS BIOLÓGICOS & MENTAIS ATIVOS NESTE MARCO:',
    en: 'ACTIVE BIOLOGICAL & MENTAL EFFECTS AT THIS MILESTONE:',
    es: 'EFECTOS BIOLÓGICOS Y MENTALES ACTIVOS EN ESTE HITO:',
  },
  tiers: [
    {
      min: 0, max: 3,
      perks: {
        pt: ['Quebra do ciclo automático', 'Redução do pico de cortisol', 'Recuperação inicial da dopamina'],
        en: ['Automatic loop broken', 'Cortisol spike reduction', 'Initial dopamine recovery'],
        es: ['Ruptura del ciclo automático', 'Reducción del pico de cortisol', 'Recuperación inicial de dopamina'],
      }
    },
    {
      min: 4, max: 7,
      perks: {
        pt: ['Pico natural de testosterona (+45%)', 'Aumento de energia física', 'Fim gradual da névoa mental'],
        en: ['Natural testosterone surge (+45%)', 'Boost in physical energy', 'Gradual end of brain fog'],
        es: ['Pico natural de testosterona (+45%)', 'Aumento de energía física', 'Fin gradual de la niebla mental'],
      }
    },
    {
      min: 8, max: 14,
      perks: {
        pt: ['Sono profundo restaurador', 'Vontade e assertividade reforçadas', 'Olhar firme e redução da timidez'],
        en: ['Deep restorative sleep', 'Enhanced willpower & assertiveness', 'Steady gaze and less shyness'],
        es: ['Sueño profundo y reparador', 'Voluntad y asertividad reforzadas', 'Mirada firme y menos timidez'],
      }
    },
    {
      min: 15, max: 30,
      perks: {
        pt: ['Receptores de dopamina rebalanceados', 'Redução drástica de ansiedade social', 'Magnetismo pessoal e foco aguçado'],
        en: ['Rebalanced dopamine receptors', 'Drastic drop in social anxiety', 'Personal magnetism & sharp focus'],
        es: ['Receptores de dopamina equilibrados', 'Reducción drástica de ansiedad social', 'Magnetismo personal y enfoque agudo'],
      }
    },
    {
      min: 31, max: 60,
      perks: {
        pt: ['Controle absoluto de pensamentos invasivos', 'Aura de respeito natural', 'Vitalidade transmutada em criação'],
        en: ['Total control over invasive thoughts', 'Aura of natural respect', 'Vitality transmuted into creation'],
        es: ['Control total sobre pensamientos intrusivos', 'Aura de respeto natural', 'Vitalidad transmutada en creación'],
      }
    },
    {
      min: 61, max: 90,
      perks: {
        pt: ['Superação da flatline (platô)', 'Alta performance física e cognitiva', 'Autodomínio e disciplina inabaláveis'],
        en: ['Flatline conquered', 'High physical & cognitive performance', 'Unshakable self-mastery and discipline'],
        es: ['Superación de la flatline (meseta)', 'Alto rendimiento físico y cognitivo', 'Autodominio y disciplina inquebrantables'],
      }
    },
    {
      min: 91, max: 120,
      perks: {
        pt: ['Blindagem neural contra recaídas tardias', 'Foco cirúrgico em metas de vida e carreira', 'Paz mental profunda e presença inabalável'],
        en: ['Neural shield against late-stage relapses', 'Surgical focus on life & career goals', 'Deep mental peace and unshakable presence'],
        es: ['Blindaje neural contra recaídas tardías', 'Enfoque quirúrgico en metas de vida y carrera', 'Paz mental profunda y presencia inquebrantable'],
      }
    },
    {
      min: 121, max: 180,
      perks: {
        pt: ['Aço de Damasco mental: 6 meses limpo', 'Cérebro completamente reconfigurado', 'Fogo criativo alimentando novos impérios'],
        en: ['Mental Damascus steel: 6 months clean', 'Brain fully rewired and reset', 'Creative fire fueling new empires'],
        es: ['Acero de Damasco mental: 6 meses limpio', 'Cerebro completamente reconfigurado', 'Fuego creativo alimentando nuevos imperios'],
      }
    },
    {
      min: 181, max: 270,
      perks: {
        pt: ['Transmutação seminal em força física e patrimônio', 'Aura magnética e liderança natural', 'Zero necessidade de aprovação externa'],
        en: ['Seminal transmutation into wealth & physical power', 'Magnetic aura and natural leadership', 'Zero need for external validation'],
        es: ['Transmutación seminal en riqueza y fuerza física', 'Aura magnética y liderazgo natural', 'Cero necesidad de aprobación externa'],
      }
    },
    {
      min: 271, max: 365,
      perks: {
        pt: ['1 Ano Completo: soberania absoluta da mente', 'Poder transformador de legado e exemplo', 'O homem forjado que você prometeu se tornar'],
        en: ['1 Full Year: absolute mind sovereignty', 'Transformative power of legacy and example', 'The forged man you swore to become'],
        es: ['1 Año Completo: soberanía mental absoluta', 'Poder transformador de legado y ejemplo', 'El hombre forjado que prometiste ser'],
      }
    },
    {
      min: 366, max: 9999,
      perks: {
        pt: ['Mito vivo: 2+ anos de disciplina suprema', 'Panteão dos mestres inquebrantáveis', 'Caráter de aço eterno'],
        en: ['Living myth: 2+ years of supreme discipline', 'Pantheon of unshakable masters', 'Eternal steel character'],
        es: ['Mito vivo: 2+ años de disciplina suprema', 'Panteón de maestros inquebrantables', 'Carácter de acero eterno'],
      }
    },
  ]
};

/* Textos Trilíngues do Bloco de Protocolo Tático */
const TACTICAL_BLOCK_I18N = {
  title: {
    pt: 'PROTOCOLO TÁTICO & BLINDAGEM DO DIA',
    en: 'TACTICAL PROTOCOL & DAILY SHIELDING',
    es: 'PROTOCOLO TÁCTICO Y BLINDAJE DIARIO',
  },
  riskTitle: {
    pt: 'ZONA DE RISCO ELEVADO',
    en: 'HIGH RISK ZONE',
    es: 'ZONA DE ALTO RIESGO',
  },
  riskDesc: {
    pt: 'Noite / Cansaço (22h - 01h). Mantenha as telas fora do quarto.',
    en: 'Night / Fatigue (10 PM - 1 AM). Keep screens away from bed.',
    es: 'Noche / Cansancio (22h - 01h). Mantén las pantallas fuera del cuarto.',
  },
  goldenRuleTitle: {
    pt: 'REGRA DE CONDUTA',
    en: 'RULE OF CONDUCT',
    es: 'REGLA DE CONDUCTA',
  },
  goldenRuleDesc: {
    pt: 'A tentação dura 10 minutos. O arrependimento dura dias inteiros.',
    en: 'The urge lasts 10 minutes. Regret lingers for days.',
    es: 'La tentación dura 10 minutos. El arrepentimiento dura días enteros.',
  },
  energyTitle: {
    pt: 'ENERGIA VITAL',
    en: 'VITAL ENERGY',
    es: 'ENERGÍA VITAL',
  },
  energyDesc: {
    pt: 'Transmute o fogo interno em treino, estudo e trabalho.',
    en: 'Transmute inner fire into training, studying, and building.',
    es: 'Transmuta el fuego interno en entrenamiento, estudio y trabajo.',
  },
};

function getBioPerksI18n(days, lang) {
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const found = BIO_EFFECTS_I18N.tiers.find((b) => days >= b.min && days <= b.max) || BIO_EFFECTS_I18N.tiers[0];
  return {
    header: BIO_EFFECTS_I18N.header[currentLang] || BIO_EFFECTS_I18N.header.pt,
    perks: found.perks[currentLang] || found.perks.pt,
  };
}

/* Hook de Cronômetro Tático em Tempo Real (Segundo a Segundo) */
function useLiveTimer(startDateStr, daysTotal) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function tick() {
      if (!startDateStr) {
        setTime({ days: Number(daysTotal) || 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      let startMs = 0;
      if (typeof startDateStr === 'number') {
        startMs = startDateStr;
      } else if (typeof startDateStr === 'string') {
        const clean = startDateStr.trim();
        if (clean.length === 10 && clean.includes('-')) {
          const p = clean.split('-').map(Number);
          startMs = new Date(p[0], p[1] - 1, p[2], 0, 0, 0).getTime();
        } else {
          const norm = clean.includes(' ') ? clean.replace(' ', 'T') : clean;
          startMs = new Date(norm).getTime();
        }
      } else {
        startMs = new Date(startDateStr).getTime();
      }

      if (isNaN(startMs) || startMs <= 0) {
        startMs = Date.now();
      }

      const diff = Math.max(0, Date.now() - startMs);
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const hasExactTime = typeof startDateStr === 'string' && startDateStr.includes('T');
      const effectiveDays = hasExactTime ? days : Math.max(days, Number(daysTotal) || 0);
      setTime({ days: effectiveDays, hours, minutes, seconds });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDateStr, daysTotal]);

  return time;
}

/* Carga Tática do Dia & Bateria Mobile (Trilíngue: PT, EN, ES) */
const TACTICAL_ENERGY_I18N = {
  title: {
    pt: 'CARGA TÁTICA DO DIA',
    en: "TODAY'S TACTICAL CHARGE",
    es: 'CARGA TÁCTICA DEL DÍA',
  },
  subFull: {
    pt: '🏆 Blindagem Máxima Atingida · Honra Intacta',
    en: '🏆 Maximum Shielding Achieved · Honor Intact',
    es: '🏆 Blindaje Máximo Alcanzado · Honor Intacto',
  },
  subAdvanced: {
    pt: '⚔️ Forja em Combate · Ritmo Implacável',
    en: '⚔️ Forge in Combat · Relentless Pace',
    es: '⚔️ Forja en Combate · Ritmo Implacable',
  },
  subStarting: {
    pt: '🛡️ Primeiras Barreiras Erguidas · Mantenha a Linha',
    en: '🛡️ First Barriers Raised · Hold the Line',
    es: '🛡️ Primeras Barreras Levantadas · Mantén la Línea',
  },
  subZero: {
    pt: '🔥 Batalha Iniciada · Vença o Hoje',
    en: '🔥 Battle Begun · Conquer Today',
    es: '🔥 Batalla Iniciada · Vence el Hoy',
  },
};

/* Batalha das 24 Horas & Pacto de Honra de Hoje (Trilíngue: PT, EN, ES) */
const BATTLE_24H_I18N = {
  cardTitle: {
    pt: 'A BATALHA DAS 24 HORAS',
    en: 'THE 24-HOUR BATTLE',
    es: 'LA BATALLA DE LAS 24 HORAS',
  },
  cardSubtitle: {
    pt: 'VENÇA O HOJE · O AMANHÃ NÃO EXISTE',
    en: 'CONQUER TODAY · TOMORROW DOES NOT EXIST',
    es: 'VENCE EL HOY · EL MAÑANA NO EXISTE',
  },
  badgeToday: {
    pt: 'HOJE',
    en: 'TODAY',
    es: 'HOY',
  },
  timeRemaining: {
    pt: (h, m) => `${h}h ${m}m restantes nestas 24h`,
    en: (h, m) => `${h}h ${m}m left in these 24h`,
    es: (h, m) => `${h}h ${m}m restantes en estas 24h`,
  },
  dayPassed: {
    pt: (pct) => `${pct}% do dia de hoje decorrido`,
    en: (pct) => `${pct}% of today elapsed`,
    es: (pct) => `${pct}% del día transcurrido`,
  },
  pactButtonUnpledged: {
    pt: '⚔️ SELAR PACTO DE HOJE: "HOJE EU NÃO CAIO"',
    en: '⚔️ SEAL TODAY\'S PACT: "TODAY I WILL NOT FALL"',
    es: '⚔️ SELLAR PACTO DE HOY: "HOY NO CAIGO"',
  },
  pactButtonPledged: {
    pt: '🛡️ PACTO DE HOJE SELADO: SOBERANIA ATIVA',
    en: '🛡️ TODAY\'S PACT SEALED: SOVEREIGNTY ACTIVE',
    es: '🛡️ PACTO DE HOY SELLADO: SOBERANÍA ACTIVA',
  },
  pactToastPledged: {
    pt: '⚔️ PACTO DE HONRA SELADO: O dia de hoje pertence à sua vitória!',
    en: '⚔️ HONOR PACT SEALED: Today belongs to your victory!',
    es: '⚔️ PACTO DE HONOR SELLADO: ¡El día de hoy pertenece a tu victoria!',
  },
  pactToastUnpledged: {
    pt: 'Pacto reaberto para confirmação.',
    en: 'Pact reopened for confirmation.',
    es: 'Pacto reabierto para confirmación.',
  },
  allCleanHonor: {
    pt: '3 Pilares invictos hoje. Mantenha a honra até o último segundo!',
    en: '3 Pillars undefeated today. Hold honor until the final second!',
    es: '3 Pilares invictos hoy. ¡Mantén el honor hasta el último segundo!',
  },
  pillarsPendingHonor: {
    pt: 'Sua única missão é manter sua honra nestas 24 horas.',
    en: 'Your sole mission is to preserve your honor in these 24 hours.',
    es: 'Tu única misión es preservar tu honor en estas 24 horas.',
  },
  switchAxiomTooltip: {
    pt: 'Toque para alternar o axioma de guerra de hoje',
    en: 'Tap to switch today\'s battle axiom',
    es: 'Toca para cambiar el axioma de guerra de hoy',
  },
  pactRegistered: {
    pt: '✓ PACTO REGISTRADO',
    en: '✓ PACT REGISTERED',
    es: '✓ PACTO REGISTRADO',
  },
  pactPending: {
    pt: 'AGUARDANDO PACTO',
    en: 'AWAITING PACT',
    es: 'ESPERANDO PACTO',
  },
  axioms: [
    {
      pt: 'Ontem virou cinzas e estatística. O amanhã ainda não existe. Toda a sua guerra se resume a vencer as próximas 24 horas. Faça deste dia épico.',
      en: 'Yesterday turned to ash and statistics. Tomorrow does not yet exist. Your entire war comes down to conquering the next 24 hours. Make today epic.',
      es: 'El ayer se convirtió en cenizas y estadísticas. El mañana aún no existe. Toda tu guerra se reduce a vencer las próximas 24 horas. Haz de hoy un día épico.',
    },
    {
      pt: 'Não prometa 1 ano de pureza. Prometa vencer apenas o dia de hoje. A disciplina inquebrantável é forjada um único dia por vez.',
      en: 'Do not promise a year of purity. Promise only to conquer today. Unshakable discipline is forged a single day at a time.',
      es: 'No prometas un año de pureza. Promete vencer solo el día de hoy. La disciplina inquebrantable se forja un solo día a la vez.',
    },
    {
      pt: 'O passado não pode ser reescrito e o futuro é construído agora. Domine seus impulsos nestas 24 horas e o império será erguido.',
      en: 'The past cannot be rewritten and the future is built right now. Master your impulses during these 24 hours and the empire will rise.',
      es: 'El pasado no se puede reescribir y el futuro se construye ahora. Domina tus impulsos en estas 24 horas y el imperio será levantado.',
    },
    {
      pt: 'Hoje é o único dia em que você pode lutar, transmutar e honrar seu nome. Deixe o suor no campo e chegue invicto à noite.',
      en: 'Today is the only day you can fight, transmute, and honor your name. Leave everything on the battlefield and finish the night undefeated.',
      es: 'Hoy es el único día en que puedes luchar, transmutar y honrar tu nombre. Deja todo en el campo de batalla y llega invicto a la noche.',
    },
    {
      pt: 'A mente fraca se apavora com a distância da jornada. O guerreiro de aço foca apenas no próximo passo e na vitória de hoje.',
      en: 'A weak mind trembles before the length of the journey. A warrior of steel focuses only on the next step and today\'s victory.',
      es: 'La mente débil se aterra ante la distancia del viaje. El guerrero de acero se enfoca solo en el siguiente paso y en la victoria de hoy.',
    },
  ],
};

export default function QgView() {
  const { S, update, t, openModal, closeModal, toast, setTab, navigateToProject } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const [ciDate, setCiDate] = useState(today());
  const [levelUpModalTier, setLevelUpModalTier] = useState(null);
  const [showEvolutionGallery, setShowEvolutionGallery] = useState(false);
  const [pactAxiomIdx, setPactAxiomIdx] = useState(0);
  const [showCompletedInSchedule, setShowCompletedInSchedule] = useState(false);
  const [pillarsOpen, setPillarsOpen] = useState(false);

  /* i18n */
  const tiers = cxTiers(lang, TIERS);
  const d = L.progressDays(S);
  const tier = tiers.find((x) => x.min === L.tierNow(S).min) || L.tierNow(S);
  const nt = tiers.find((x) => x.min > d) || null;

  /* Detecção automática de subida de nível */
  const currentTierMin = tier && typeof tier.min === 'number' ? tier.min : 0;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('fg_last_celebrated_tier');
      const lastTierMin = stored !== null ? Number(stored) : -1;
      if (lastTierMin >= 0 && currentTierMin > lastTierMin) {
        setLevelUpModalTier(tier);
      }
      localStorage.setItem('fg_last_celebrated_tier', String(currentTierMin));
    } catch (e) {}
  }, [currentTierMin, tier]);
  const quotes = cxQuotes(lang, QUOTES);
  const ALLH = cxHabits(lang, L.allH(S));
  const MT = (m) => (m ? Object.assign({}, m, cx(lang, 'metas', m.d) || {}) : m);
  const TR = (x, i) => cx(lang, 'ob', 'trig' + i) || x;
  const fallLbl = (x) => { const k = t('fall_' + x); return k === 'fall_' + x ? (FAIL_LBL[x] || x) : k; };

  const cView = L.ci(S, ciDate);
  const fd = L.fDone(S, today()), ff = L.fFailed(S, today());
  const act = S.forge.active.slice().sort((a, b) => (L.hTime(S, a) || '99:99').localeCompare(L.hTime(S, b) || '99:99'));
  const doneF = S.forge.active.filter((id) => fd.includes(id)).length;
  const pendingHabits = S.forge.active.filter((id) => !fd.includes(id) && !ff.includes(id)).length;
  const totalHabits = S.forge.active.length;
  const streak = L.currentStreak(S);
  const lvlPct = nt ? Math.min(100, ((d - tier.min) / (nt.min - tier.min)) * 100) : 100;
  const lvlTxt = nt ? <>{t('lvl_a')}<b className="text-gold">{nt.min - d}{t('dayw')}</b>{t('lvl_b')}{nt.icon} {nt.name}</> : t('lvl_max');
  const mantraPool = L.mantraPool(S, quotes);
  const mantra = mantraPool[S.phraseIdx % mantraPool.length];
  const pornFree = S.lastPorn ? Math.max(0, L.daysBetweenSafe(S.lastPorn)) : d;
  const mastFree = S.lastMast ? Math.max(0, L.daysBetweenSafe(S.lastMast)) : d;
  const isTaskActive = (x) => {
    if (!x || x.archived) return false;
    return true;
  };
  const openTasks = (S.tasks || [])
    .filter((x) => isTaskActive(x) && L.repDue(x, today()) && !L.isDone(x, today()))
    .slice(0, 5);
  const goalMeta = MT(METAS.find((m) => m.d === S.goal));
  const lw = L.sosLast(S);
  const bioData = getBioPerksI18n(d, lang);
  const tac = TACTICAL_BLOCK_I18N;
  const liveTime = useLiveTimer(S.retStart || S.created || today(), d);
  const pornTime = useLiveTimer(S.lastPorn || S.retStart || S.created || today(), pornFree);
  const mastTime = useLiveTimer(S.lastMast || S.retStart || S.created || today(), mastFree);

  const formatTimer = (t, dFallback) => {
    const days = Math.max(t.days, Number(dFallback) || 0);
    const dStr = days > 0 ? `${days}d ` : '0d ';
    return `${dStr}${String(t.hours).padStart(2, '0')}h:${String(t.minutes).padStart(2, '0')}m:${String(t.seconds).padStart(2, '0')}s`;
  };

  const pillarsData = useMemo(() => ({
    ret: {
      days: d,
      timer: formatTimer(liveTime, d),
    },
    porn: {
      days: pornFree,
      timer: formatTimer(pornTime, pornFree),
    },
    mast: {
      days: mastFree,
      timer: formatTimer(mastTime, mastFree),
    },
  }), [d, pornFree, mastFree, liveTime, pornTime, mastTime]);

  /* ações */
  const setCI = (k, v, dateStr) => {
    const dd = dateStr || today();
    update((s) => {
      s.checkins[dd] = s.checkins[dd] || { p: false, m: false, r: false };
      s.checkins[dd][k] = v;
      const c = s.checkins[dd], req = L.pillars(s);
      const all = req.every((r) => c[r]);
      if (all && !c.ok) {
        c.ok = true;
        if (dd === today()) { s.purity = Math.min(100, s.purity + 2); s.best = Math.max(s.best, L.progressDays(s)); }
      }
      if (!all) delete c.ok;
    });
    const req = L.pillars(S), c = { ...cView, [k]: v };
    const all = req.every((r) => c[r]);
    if (all && dd === today()) {
      AF.victory(L.tierNow(S).min >= 180); metaSfx(d);
      openModal(<Victory />);
    } else if (all) {
      toast('✅ ' + fdmy(dd) + t('recvit'));
    } else {
      if (v) AF.seal();
      else AF.click();
    }
  };

  const toggleHabitDone = (id, e) => {
    if (e) e.stopPropagation();
    if (!S.forge.active.includes(id)) return;
    update((s) => {
      const dd = today();
      const a = s.forge.done[dd] = s.forge.done[dd] || [];
      const i = a.indexOf(id);
      if (i >= 0) {
        a.splice(i, 1);
      } else {
        a.push(id);
        const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
        const fi = f.indexOf(id);
        if (fi >= 0) f.splice(fi, 1);
      }
    });
    AF.click();
  };

  const toggleHabitFailed = (id, e) => {
    if (e) e.stopPropagation();
    if (!S.forge.active.includes(id)) return;
    update((s) => {
      const dd = today();
      const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
      const fi = f.indexOf(id);
      if (fi >= 0) {
        f.splice(fi, 1);
      } else {
        f.push(id);
        const a = s.forge.done[dd] = s.forge.done[dd] || [];
        const ai = a.indexOf(id);
        if (ai >= 0) a.splice(ai, 1);
      }
    });
    AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
  };

  const failFlow = () => {
    let sel = [];
    const opts = L.modeA(S) ? ['porn', 'mast'] : ['porn', 'mast', 'ejac'];
    const lbl = {
      porn: <>{t('lblp')}<small className="ml-auto text-danger">{t('penp')}</small></>,
      mast: <>{t('lblm')}<small className="ml-auto text-danger">{t('penm')}</small></>,
      ejac: <>{t('lble')}<small className="ml-auto text-danger">{t('pene')}</small></>,
    };
    const Fail = () => {
      const [, force] = useState(0);
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-danger">{t('fail_t')}</h3>
          <p className="mb-4 text-sm text-muted">{t('fail_d')} <b className="text-gold">{t('fail_sel')}</b></p>
          {opts.map((o) => (
            <button key={o} className={`btn-big mb-2 w-full text-left ${sel.includes(o) ? 'btn-red' : 'btn-dark'}`} onClick={() => { sel = sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]; force((x) => x + 1); AF.click(); }}>{lbl[o]}</button>
          ))}
          {L.modeA(S) && <p className="fnote text-gold2">{t('modeA_note')}</p>}
          <button className="btn-red btn-big" disabled={!sel.length} onClick={() => doFail(sel)}>{t('fail_ok')}</button>
          <p className="fnote">{t('honest')}</p>
          <button className="btn-dark btn-big mt-1" onClick={closeModal}>{t('cancel_btn')}</button>
        </div>
      );
    };
    openModal(<Fail />);
  };

  const doFail = (types) => {
    if (L.modeA(S)) types = types.filter((x) => x !== 'ejac');
    if (!types.length) { toast(t('nothing')); return; }
    AF.tone(110, 0.5, 'sine', 0.2, 0, 55);

    const Post = () => {
      const now = new Date();
      const dd = today();
      const tt = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const sec = pad(now.getSeconds());
      const fallTimestamp = `${dd}T${tt}:${sec}`;
      const [triggers, setTriggers] = useState([]);
      const [vent, setVent] = useState('');

      const handleSave = () => {
        update((s) => {
          s.checkins[dd] = s.checkins[dd] || { p: false, m: false, r: false };
          const c = s.checkins[dd];
          delete c.ok;
          c.fail = types.join('+');
          let pen = 0;
          if (types.includes('porn')) { pen += FAIL_PEN.porn; s.lastPorn = fallTimestamp; c.p = false; }
          if (types.includes('mast')) { pen += FAIL_PEN.mast; s.lastMast = fallTimestamp; c.m = false; }
          if (types.includes('ejac')) { pen += FAIL_PEN.ejac; s.retStart = fallTimestamp; c.r = false; }
          s.purity = Math.max(5, s.purity - pen);

          if (Array.isArray(s.journal)) {
            s.journal.unshift({
              id: 'j_fall_' + Date.now(),
              date: dd,
              time: tt,
              mood: 'guerra',
              fall: true,
              fallTypes: types,
              fallTriggers: triggers,
              vent: vent || '',
              text: vent || (lang === 'en' ? '⚠️ Fall logged.' : lang === 'es' ? '⚠️ Caída registrada.' : '⚠️ Queda registrada.'),
              createdAt: Date.now(),
            });
          } else {
            s.journal = s.journal || {};
            s.journal[dd] = s.journal[dd] || { mood: '', good: '', ch: '' };
            Object.assign(s.journal[dd], { fall: true, fallTypes: types, fallTriggers: triggers, vent: vent || s.journal[dd].vent || '' });
          }
        });

        closeModal();
        const okMsg = cx(lang, 'qg', 'fall_toast_ok') || (lang === 'en'
          ? '⚠️ Fall logged. The precision stopwatch restarted now — rise up and rebuild!'
          : lang === 'es'
          ? '⚠️ Caída registrada. El cronómetro de precisión se reinició ahora — ¡levántate y reconstruye!'
          : '⚠️ Queda registrada. O cronômetro de precisão foi reiniciado agora — levante-se e reconstrua!');
        toast(okMsg);
      };

      return (
        <div className="text-center space-y-3">
          <div>
            <h3 className="mb-1 font-display text-2xl tracking-wide text-danger">
              {cx(lang, 'qg', 'fall_precision_title') || t('fall_t')}
            </h3>
            <p className="text-xs text-muted">
              {types.map((x) => fallLbl(x)).join(' + ')}
            </p>
          </div>

          {/* REGISTRO DO CRONÔMETRO NA QUEDA - HONESTO, EM TEMPO REAL, SEM BURLAS */}
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-danger flex items-center gap-1">
                ⏱️ {cx(lang, 'qg', 'fall_time_lbl') || 'Registro em Tempo Real:'}
              </span>
              <span className="text-xs font-mono font-black text-danger">
                {dd} · {tt}:{sec}
              </span>
            </div>
            <p className="text-[10.5px] text-muted/90 font-mono leading-tight">
              {cx(lang, 'qg', 'fall_timer_note') || 'Sem alterações retroativas. O cronômetro do pilar zera agora e recomeça a evolução em tempo real segundo a segundo.'}
            </p>
          </div>

          <div className="rounded-r border border-gold/30 bg-gold/5 p-3 text-left text-[12.5px] leading-relaxed">
            <b className="text-gold">{t('retom')}</b><br />{t('r1')}<br />{t('r2')}<br />{t('r3')}<br />{t('r4')}<br />{t('r5')}
          </div>

          <div className="text-left">
            <span className="k text-danger">{t('fall_trig')}</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5 justify-start">
              {TRIGGERS.map((x, i) => (
                <button
                  key={x}
                  type="button"
                  className={`tag ${triggers.includes(x) ? 'sel' : ''}`}
                  onClick={() => {
                    setTriggers((prev) => prev.includes(x) ? prev.filter((y) => y !== x) : [...prev, x]);
                  }}
                >
                  {TR(x, i)}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-left">
            <span className="lbl">{t('fall_vent')}</span>
            <textarea
              className="field text-xs"
              rows={3}
              maxLength={600}
              placeholder={t('ventph')}
              value={vent}
              onChange={(e) => setVent(e.target.value)}
            />
          </label>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              className="btn-gold btn-big w-full cursor-pointer"
              onClick={handleSave}
            >
              {t('fall_save')}
            </button>
            <button
              type="button"
              className="btn-dark btn-big w-full cursor-pointer"
              onClick={closeModal}
            >
              {t('fall_no')}
            </button>
          </div>
        </div>
      );
    };
    openModal(<Post />);
  };

  const dayEditor = (ds) => {
    const c = L.ci(S, ds), req = L.pillars(S);
    const Day = () => {
      const cur = L.ci(S, ds);
      const state = cur.fail ? t('st_f') : cur.ok ? t('st_v') : (cur.p || cur.m || cur.r) ? t('st_p') : t('st_n');
      return (
        <div className="text-center">
          <span className="k">{t('de_t')} {fdmy(ds)}{ds === today() ? ' · ' + t('hj') : ''}</span>
          <p className="fnote" style={{ textAlign: 'left', margin: '-2px 0 12px' }}>{t('de_estado')} <b className="text-gold">{state}</b> · {t('de_hint')}</p>
          {req.map((k) => {
            const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
            const fTypes = String(cur.fail || '').split('+').filter(Boolean);
            return (
              <Chk key={k} className="mb-2" on={!!cur[k]} failed={!cur[k] && fTypes.includes(FAILMAP[k])} onClick={() => setCI(k, !cur[k], ds)}>
                {t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3')}
              </Chk>
            );
          })}
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => { req.forEach((k, i) => setTimeout(() => setCI(k, true, ds), i * 10)); }}>{t('st_v')}</button>
            <button className="btn-dark" onClick={() => { update((s) => { delete (s.checkins[ds] || {}).ok; delete s.checkins[ds]?.fail; }); AF.click(); }}>{t('st_p')}</button>
            <button className="btn-red" onClick={() => { update((s) => { s.checkins[ds] = s.checkins[ds] || { p: false, m: false, r: false }; delete s.checkins[ds].ok; s.checkins[ds].fail = 'porn'; }); AF.tone(110, 0.35, 'sine', 0.18, 0, 55); }}>{t('b_f')}</button>
            <button className="btn-dark" onClick={() => update((s) => { delete s.checkins[ds]; })}>{t('b_c')}</button>
          </div>
          <button className="btn-dark btn-big" onClick={closeModal}>{t('de_fechar')}</button>
        </div>
      );
    };
    openModal(<Day />);
  };

  const Victory = () => (
    <div className="relative overflow-hidden text-center">
      <Trophy size={64} className="mx-auto mb-3 text-gold" />
      <h2 className="font-display text-3xl tracking-wide">{t('vic_t')} {(S.name || t('warrior_w')).toUpperCase()}!</h2>
      <p className="mt-2 text-sm text-muted">{L.modeA(S) ? t('vic_2') : t('vic_3')}. {t('vic_x')}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="chip">🔥 {L.progressDays(S)}{t('dayw')}</span>
        <span className="chip">✦ {S.purity}% {t('purw')}</span>
        {tier.min >= 90 && <span className="chip">{tier.icon} {tier.name}</span>}
      </div>
      <button className="btn-gold btn-big mt-5" onClick={closeModal}>{t('vic_b')}</button>
    </div>
  );

  const ring = 213.6 * (1 - S.purity / 100);

  const totalTasksToday = (S.tasks || []).filter((x) => isTaskActive(x) && L.repDue(x, today()));
  const pendingTasksCount = totalTasksToday.filter((x) => !L.isDone(x, today())).length;

  const nextMantra = () => {
    AF.click();
    update((s) => {
      s.phraseIdx = (s.phraseIdx + 1) % L.mantraPool(s, quotes).length;
    });
  };

  /* Blocos Modulares de Renderização */
  const renderMantra = () => (
    <Card className="border-gold/40 bg-gradient-to-br from-surface to-gold/5 py-2.5 px-3.5 sm:px-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Frase Clicável com feedback visual de transição e contador */}
        <div
          onClick={nextMantra}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nextMantra(); }}
          title={curLang === 'en' ? 'Click to show next phrase' : curLang === 'es' ? 'Haz clic para la siguiente frase' : 'Clique para ver a próxima frase'}
          className="group min-w-0 flex-1 cursor-pointer select-none transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="k text-[10px] text-gold flex items-center gap-1">
              ⚡ {t('code')}
            </span>
            <span className="text-[10px] text-muted/70 font-mono group-hover:text-gold transition-colors">
              ({(S.phraseIdx % mantraPool.length) + 1}/{mantraPool.length} · {curLang === 'en' ? 'click phrase to rotate' : curLang === 'es' ? 'clic en la frase para cambiar' : 'clique na frase para alternar'})
            </span>
          </div>
          <p className="border-l-[3px] border-gold2 pl-3 text-[14px] sm:text-[15.5px] font-bold italic leading-snug text-[#f3ead2] group-hover:text-gold transition-colors">
            "{mantra}"
          </p>
        </div>

        {/* Botão Tarefas do Dia no lugar do botão anterior */}
        <div className="flex items-center gap-2 flex-none justify-end pt-1 sm:pt-0">
          <button
            type="button"
            onClick={() => { AF.click(); setTab('ops'); }}
            className="btn-gold py-1.5 px-3 sm:px-4 text-xs font-extrabold flex items-center gap-2 rounded-r shadow-[0_2px_10px_rgba(255,200,70,0.15)] hover:shadow-[0_2px_15px_rgba(255,200,70,0.3)] transition-all active:scale-95 whitespace-nowrap"
            title={curLang === 'en' ? 'Open Daily Tasks' : curLang === 'es' ? 'Abrir Tareas del Día' : 'Abrir Tarefas do Dia'}
          >
            <Target size={14} className="text-deep flex-none" />
            <span>{curLang === 'en' ? 'Daily Tasks' : curLang === 'es' ? 'Tareas del Día' : 'Tarefas do Dia'}</span>
            {pendingTasksCount > 0 ? (
              <span className="rounded-full bg-deep text-gold px-1.5 py-0.2 text-[10px] font-black leading-none">
                {pendingTasksCount}
              </span>
            ) : (
              <span className="rounded-full bg-deep/20 text-deep px-1.5 py-0.2 text-[10px] font-black leading-none">
                ✓
              </span>
            )}
          </button>
        </div>
      </div>
    </Card>
  );

  /* A BATALHA DAS 24 HORAS (VENÇA O HOJE & PACTO DE HONRA) */
  const renderBattle24Hours = () => {
    const isPledged = !!(S?.dailyPacts && S.dailyPacts[today()]);
    const bTx = BATTLE_24H_I18N;
    const now = new Date();
    const curHour = now.getHours();
    const curMin = now.getMinutes();
    const minsPassed = curHour * 60 + curMin;
    const dayPct = Math.min(100, Math.max(2, Math.round((minsPassed / 1440) * 100)));
    const remHours = 23 - curHour;
    const remMins = 59 - curMin;

    const axiomIdx = (pactAxiomIdx !== undefined ? pactAxiomIdx : Math.abs(d) % bTx.axioms.length);
    const curAxiom = bTx.axioms[axiomIdx % bTx.axioms.length][curLang] || bTx.axioms[0].pt;

    const togglePact = () => {
      const nextState = !isPledged;
      update((s) => {
        s.dailyPacts = s.dailyPacts || {};
        s.dailyPacts[today()] = nextState;
      });
      if (nextState) {
        AF.epicLevelUp();
        toast(bTx.pactToastPledged[curLang]);
      } else {
        AF.click();
        toast(bTx.pactToastUnpledged[curLang]);
      }
    };

    const nextAxiom = (e) => {
      e.stopPropagation();
      setPactAxiomIdx((prev) => (prev + 1) % bTx.axioms.length);
      AF.click();
    };

    const cToday = L.ci(S, today());
    const reqPil = L.pillars(S);
    const is3PillarsClean = reqPil.length > 0 && reqPil.every((p) => !!cToday[p]);

    return (
      <div className="rounded-xl border border-gold/35 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] p-3 sm:p-3.5 shadow-sm relative overflow-hidden group w-full min-w-0 select-none">
        {/* Glow de fundo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

        {/* Topo: Título e Relógio das 24 Horas */}
        <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 border border-gold/35 text-gold flex-none text-base">
              ⚔️
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#F5EEDC] font-display leading-tight flex items-center gap-1.5 truncate">
                <span>{bTx.cardTitle[curLang]}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-gold/15 text-gold border border-gold/30">
                  {bTx.badgeToday[curLang]}
                </span>
              </h3>
              <p className="text-[10px] text-muted font-mono leading-none mt-0.5 truncate">
                {bTx.cardSubtitle[curLang]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono text-gold2 font-bold px-2 py-0.5 rounded-lg bg-surface border border-line shrink-0">
            <Clock size={11} className="text-gold shrink-0" />
            <span>{bTx.timeRemaining[curLang](remHours, remMins)}</span>
          </div>
        </div>

        {/* Barra de Progresso do Dia Atual (24 Horas) */}
        <div className="mb-3 relative z-10">
          <div className="flex items-center justify-between text-[9.5px] font-mono text-muted mb-1">
            <span>{bTx.dayPassed[curLang](dayPct)}</span>
            <span className="font-bold text-gold font-mono">{dayPct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#1e1c24] overflow-hidden border border-line/60">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-gold to-yellow-300 transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
              style={{ width: `${dayPct}%` }}
            />
          </div>
        </div>

        {/* Botão de Ação: Pacto de Honra de Hoje */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={togglePact}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 text-center leading-snug ${
              isPledged
                ? 'border border-gold bg-gold text-[#141414] shadow-[0_0_15px_rgba(245,158,11,0.25)] font-black'
                : 'border border-gold/60 bg-gold/15 hover:bg-gold/25 text-gold'
            }`}
          >
            {isPledged ? (
              <>
                <Check size={15} strokeWidth={3} className="text-[#141414] shrink-0" />
                <span className="break-words">{bTx.pactButtonPledged[curLang]}</span>
              </>
            ) : (
              <>
                <Flame size={15} className="text-gold animate-bounce shrink-0" />
                <span className="break-words">{bTx.pactButtonUnpledged[curLang]}</span>
              </>
            )}
          </button>
        </div>

        {/* Status dos Pilares neste dia */}
        <div className="mt-2 pt-2 border-t border-line/40 flex items-center justify-between text-[10px] font-mono text-muted relative z-10 flex-wrap gap-1">
          <span className="flex items-center gap-1">
            {is3PillarsClean ? (
              <span className="text-ok font-bold flex items-center gap-1">
                <span>🛡️</span> {bTx.allCleanHonor[curLang]}
              </span>
            ) : (
              <span className="text-amber-300 font-semibold flex items-center gap-1">
                <span>⚔️</span> {bTx.pillarsPendingHonor[curLang]}
              </span>
            )}
          </span>
          <span className="text-muted/70 text-[9px] font-bold">
            {isPledged ? bTx.pactRegistered[curLang] : bTx.pactPending[curLang]}
          </span>
        </div>
      </div>
    );
  };

  /* 2. O GUERREIRO VIVO DA FORJA (CARD 3D COM OS 3 PILARES GIRATÓRIOS DO PEDESTAL) */
  const renderPillars3DTowers = (isDesktop = false) => {
    return (
      <div id="tour-qg-towers" className="w-full">
        <ErrorBoundary>
          <Warrior3DCard
            tier={tier}
            d={d}
            nt={nt}
            curLang={curLang}
            purity={S.purity}
            streak={streak}
            sosWins={L.sosWins(S)}
            pillarsData={pillarsData}
            lvlPct={lvlPct}
            lvlTxt={lvlTxt}
            onGoToArmors={() => setShowEvolutionGallery(true)}
            dailyQuote={mantra}
            onNextQuote={nextMantra}
            quoteIdx={(S.phraseIdx % mantraPool.length) + 1}
            quoteTotal={mantraPool.length}
          />
        </ErrorBoundary>
      </div>
    );
  };

  const renderDailyCheckin = () => {
    const tTx = TACTICAL_ENERGY_I18N;
    const reqPil = L.pillars(S);
    const donePil = reqPil.filter((k) => !!cView[k]).length;
    const totPil = reqPil.length || 3;

    const timelineItems = getTodayCombatTimeline(S, ALLH, curLang);
    const totMissions = timelineItems.length;
    const doneMissions = timelineItems.filter((i) => i.done).length;

    const totalWeight = totPil + totMissions;
    const doneWeight = donePil + doneMissions;
    const energyPct = totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : 0;

    const SHIELD_I18N = {
      r: {
        icon: '🛡️',
        shortName: { pt: 'Retenção', en: 'Retention', es: 'Retención' },
        title: { pt: 'Retenção Seminal', en: 'Semen Retention', es: 'Retención Seminal' },
        sub: { pt: 'Energia Vital', en: 'Vital Energy', es: 'Energía Vital' },
      },
      p: {
        icon: '👁️',
        shortName: { pt: 'Sem Pornô', en: 'No Porn', es: 'Sin Porno' },
        title: { pt: 'Zero Pornografia', en: 'Zero Pornography', es: 'Cero Pornografía' },
        sub: { pt: 'Olhar Firme', en: 'Clean Gaze', es: 'Mirada Limpia' },
      },
      m: {
        icon: '⚡',
        shortName: { pt: 'Autodomínio', en: 'Self-Mastery', es: 'Autodominio' },
        title: { pt: 'Sem Masturbação', en: 'No Masturbation', es: 'Sin Masturbación' },
        sub: { pt: 'Vontade de Aço', en: 'Iron Will', es: 'Voluntad Firme' },
      },
    };

    const isAllShielded = cView.ok || (donePil === totPil && totPil > 0);

    return (
      <div className="rounded-xl border border-gold/35 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] p-3 sm:p-3.5 shadow-sm w-full max-w-full overflow-hidden min-w-0 select-none transition-all">
        {/* Topo: Título, Data e Seletor Ontem / Hoje */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-line/60 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 border border-gold/35 text-gold flex-none">
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-black text-xs sm:text-sm text-[#F5EEDC] tracking-wide uppercase truncate">
                {curLang === 'en' ? 'DAILY COMBAT SHIELDING' : curLang === 'es' ? 'BLINDAJE DE COMBATE DIARIO' : 'BLINDAGEM DE COMBATE DIÁRIO'}
              </span>
              <span className="text-[9.5px] text-muted font-mono truncate">
                {ciDate === today() ? `${t('today_b')} · ${fdmy(today())}` : `${t('editing_r')} ${fdmy(ciDate)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-none">
            <button
              type="button"
              className="text-[10px] text-muted hover:text-gold px-2 py-1 rounded-lg border border-line bg-surface font-mono font-bold transition-all cursor-pointer"
              onClick={() => { AF.click(); setCiDate(yesterday(ciDate)); }}
              title={t('prev_d')}
            >
              ◀ {curLang === 'en' ? 'Yesterday' : curLang === 'es' ? 'Ayer' : 'Ontem'}
            </button>
            {ciDate !== today() && (
              <button
                type="button"
                className="text-[10px] text-gold px-2 py-1 rounded-lg border border-gold/40 bg-gold/15 font-mono font-bold transition-all cursor-pointer"
                onClick={() => { AF.click(); setCiDate(today()); }}
              >
                {curLang === 'en' ? 'Today' : curLang === 'es' ? 'Hoy' : 'Hoje'} ▶
              </button>
            )}
            <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg border ${
              isAllShielded ? 'border-gold/50 bg-gold/25 text-gold shadow-sm' : 'border-line bg-surface text-muted'
            }`}>
              {donePil}/{totPil} {curLang === 'en' ? 'SHIELDS' : curLang === 'es' ? 'ESCUDOS' : 'ESCUDOS'}
            </span>
          </div>
        </div>

        {/* Carga Tática Integrada: Mini Barra de Foco e Energia */}
        <div className="mb-2.5 px-2 py-1.5 rounded-lg bg-black/40 border border-line/40 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9.5px] font-mono text-muted">
            <span className="flex items-center gap-1 text-gold/90 font-bold truncate">
              <Zap size={11} className="text-gold shrink-0" />
              <span>{tTx.title[curLang]}:</span>
              <span className="text-stone-300 font-normal truncate">
                {energyPct >= 100 ? tTx.subFull[curLang] : energyPct > 0 ? tTx.subAdvanced[curLang] : tTx.subZero[curLang]}
              </span>
            </span>
            <span className="font-black text-gold ml-1 shrink-0">{energyPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#101015] border border-line/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                energyPct >= 100
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                  : 'bg-gradient-to-r from-amber-600 via-gold to-yellow-300'
              }`}
              style={{ width: `${Math.max(energyPct, 2)}%` }}
            />
          </div>
        </div>

        {/* Os 3 Escudos Interativos de 1 Toque Direto (3 Colunas Lado a Lado) */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {reqPil.map((k) => {
            const isChecked = !!cView[k];
            const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
            const failTypes = String(cView.fail || '').split('+').filter(Boolean);
            const isFailed = !isChecked && failTypes.includes(FAILMAP[k]);
            const conf = SHIELD_I18N[k] || {
              icon: '⚔️',
              shortName: { pt: t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3'), en: t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3'), es: t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3') },
              sub: { pt: '', en: '', es: '' },
            };

            return (
              <button
                key={k}
                type="button"
                onClick={() => setCI(k, !isChecked, ciDate)}
                className={`group flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl border text-center transition-all active:scale-[0.96] cursor-pointer min-h-[94px] select-none ${
                  isChecked
                    ? 'border-gold/70 bg-gradient-to-b from-gold/25 via-amber-500/10 to-[#14121a] shadow-[0_2px_12px_rgba(255,200,70,0.18)]'
                    : isFailed
                    ? 'border-danger/70 bg-danger/15 shadow-[0_2px_10px_rgba(239,68,68,0.15)]'
                    : 'border-line/80 bg-surface hover:border-gold/50 hover:bg-surface2'
                }`}
              >
                {/* Ícone */}
                <div className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border text-sm sm:text-base transition-all ${
                  isChecked
                    ? 'border-gold bg-gold text-[#121214] font-black shadow-md scale-105'
                    : isFailed
                    ? 'border-danger bg-danger/25 text-danger font-black'
                    : 'border-[#383844] bg-[#1C1C24] text-muted group-hover:border-gold/50 group-hover:text-gold'
                }`}>
                  {isChecked ? '✓' : conf.icon}
                </div>

                {/* Nome do Pilar */}
                <div className="flex flex-col items-center mt-1 w-full min-w-0">
                  <span className={`text-[11px] sm:text-xs font-bold leading-tight truncate w-full ${
                    isChecked ? 'text-gold' : isFailed ? 'text-danger' : 'text-[#EDE5D5]'
                  }`}>
                    {conf.shortName[curLang] || conf.shortName.pt}
                  </span>
                  <span className="text-[9px] text-muted/80 truncate w-full mt-0.5">
                    {conf.sub[curLang] || conf.sub.pt}
                  </span>
                </div>

                {/* Tag de Status */}
                <span className={`mt-1 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-mono font-black uppercase tracking-wider w-full truncate border ${
                  isChecked
                    ? 'border-gold/50 bg-gold/20 text-gold shadow-sm'
                    : isFailed
                    ? 'border-danger/50 bg-danger/25 text-danger'
                    : 'border-line bg-surface2 text-muted group-hover:text-gold group-hover:border-gold/30'
                }`}>
                  {isChecked
                    ? (curLang === 'en' ? 'SHIELDED' : curLang === 'es' ? 'BLINDADO' : 'BLINDADO')
                    : isFailed
                    ? (curLang === 'en' ? 'FALL' : curLang === 'es' ? 'CAÍDO' : 'FALHOU')
                    : (curLang === 'en' ? 'MARK' : curLang === 'es' ? 'MARCAR' : 'MARCAR')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selo de Vitória Se Hoje For 100% Blindado */}
        {isAllShielded && (
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-gold/50 bg-gradient-to-r from-gold/15 via-amber-500/20 to-gold/15 py-1.5 px-2 text-center text-gold text-[11px] sm:text-xs font-extrabold shadow-sm animate-pulse">
            <span className="flex-none">🏆</span>
            <span className="tracking-wide leading-tight truncate">
              {curLang === 'en' ? 'DAILY BATTLE WON · HONOR INTACT' : curLang === 'es' ? 'BATALLA DIARIA GANADA · HONOR INTACTO' : 'BATALHA DE HOJE VENCIDA · HONRA INTACTA'}
            </span>
          </div>
        )}

        {/* Botão de Queda Solene em Combate */}
        {ciDate === today() ? (
          <button
            type="button"
            className="mt-2 w-full py-1.5 px-3 rounded-lg border border-danger/40 bg-danger/10 text-danger hover:bg-danger hover:text-white text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm"
            onClick={failFlow}
          >
            <span>🩸</span>
            <span>{curLang === 'en' ? 'Register Battle Fall' : curLang === 'es' ? 'Registrar Caída' : 'Registrar Queda em Combate'}</span>
          </button>
        ) : (
          <p className="fnote mt-1.5 text-center">{t('retro')}</p>
        )}
      </div>
    );
  };

  const renderForgeToday = () => (
    <Card className="flex-1 flex flex-col justify-between">
      <div>
        <K>🔨 {t('forgeToday')} — {doneF}{t('of_w')}{S.forge.active.length}</K>
        {act.length ? (
          <div className="flex flex-col gap-1.5 mt-1">
            {act.map((id) => {
              const h = ALLH.find((x) => String(x.id) === String(id)); if (!h) return null;
              const dn = fd.some((x) => String(x) === String(id)), isF = ff.some((x) => String(x) === String(id)), tm = L.hTime(S, id);
              return (
                <div key={id} className={`flex items-center gap-2 rounded-r border p-2 text-left text-xs sm:text-[13px] font-semibold transition-colors ${dn ? 'border-gold/50 bg-gold/10' : isF ? 'border-danger/50 bg-danger/10' : 'border-line bg-surface2'}`}>
                  <span className="w-[22px] text-center text-base">{h.icon}</span>
                  <span className={`min-w-0 flex-1 truncate ${dn ? 'text-muted line-through' : isF ? 'text-danger line-through opacity-80' : ''}`}>{h.n || h.name || h.title || ''}</span>
                  {tm && <span className="font-mono text-[10px] text-gold2">⏰{tm}</span>}
                  <div className="flex items-center gap-1.5 flex-none">
                    <button
                      type="button"
                      title="Marcar como Falho"
                      onClick={(e) => toggleHabitFailed(id, e)}
                      className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                        isF 
                          ? 'border-danger bg-danger text-white shadow-sm' 
                          : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger/60 hover:text-danger'
                      }`}
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      title="Marcar como Cumprido"
                      onClick={(e) => toggleHabitDone(id, e)}
                      className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                        dn 
                          ? 'border-gold bg-gold text-[#141414] shadow-sm' 
                          : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold/60 hover:text-gold'
                      }`}
                    >
                      <Check size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <><Empty>{t('ef1')}<br />{t('ef2')} <b className="text-gold">{t('forge_b')}</b>.</Empty>
            <button className="btn-ghost btn-big mt-2" onClick={() => setTab('forge')}>{t('goforge')}</button></>
        )}
      </div>
      {act.length > 0 && (
        <div className="bar mt-3"><i style={{ width: (S.forge.active.length ? (doneF / S.forge.active.length) * 100 : 0) + '%' }} /></div>
      )}
    </Card>
  );

  /* CARGA TÁTICA DO DIA: Barra de Energia / Foco de Batalha com Feedback Visual e Háptico */
  const renderDailyTacticalEnergy = () => {
    const tTx = TACTICAL_ENERGY_I18N;
    const reqPil = L.pillars(S);
    const donePil = reqPil.filter((k) => !!cView[k]).length;
    const totPil = reqPil.length || 3;

    const timelineItems = getTodayCombatTimeline(S, ALLH, curLang);
    const totMissions = timelineItems.length;
    const doneMissions = timelineItems.filter((i) => i.done).length;

    const totalWeight = totPil + totMissions;
    const doneWeight = donePil + doneMissions;
    const energyPct = totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : 0;

    const statusText =
      energyPct >= 100
        ? tTx.subFull[curLang]
        : energyPct >= 60
        ? tTx.subAdvanced[curLang]
        : energyPct > 0
        ? tTx.subStarting[curLang]
        : tTx.subZero[curLang];

    return (
      <div className="w-full rounded-xl border border-gold/35 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] p-2.5 sm:p-3 shadow-sm select-none transition-all">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg bg-gold/15 border border-gold/35 text-gold flex-none">
              <Zap size={14} className="animate-pulse" />
            </div>
            <span className="font-display font-black text-xs sm:text-[13px] uppercase tracking-wider text-[#F5EEDC] truncate">
              {tTx.title[curLang]}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-none">
            <div className="flex items-center gap-1 text-[9px] font-mono text-muted">
              <span className="px-1.5 py-0.2 rounded bg-surface2 border border-line/60">
                🛡️ {donePil}/{totPil}
              </span>
              {totMissions > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-surface2 border border-line/60">
                  🎯 {doneMissions}/{totMissions}
                </span>
              )}
            </div>
            <span
              className={`text-xs font-mono font-black px-1.5 py-0.5 rounded border transition-colors ${
                energyPct >= 100
                  ? 'border-ok/50 bg-ok/15 text-ok shadow-[0_0_8px_rgba(74,222,128,0.25)]'
                  : energyPct > 0
                  ? 'border-gold/50 bg-gold/15 text-gold'
                  : 'border-line bg-surface text-muted'
              }`}
            >
              {energyPct}%
            </span>
          </div>
        </div>

        {/* Barra de Progresso Tático Suave */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#0D0D12] border border-line/70">
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              energyPct >= 100
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                : energyPct > 0
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400'
                : 'bg-transparent'
            }`}
            style={{ width: `${Math.max(energyPct, 2)}%` }}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-muted leading-tight">
          <span className="truncate text-gold/90 font-medium">
            {statusText}
          </span>
          <span className="text-[9px] font-mono text-muted/70 flex-none pl-1">
            {doneWeight}/{totalWeight}
          </span>
        </div>
      </div>
    );
  };

  /* MINI CARD: AGENDA OPERACIONAL DE HOJE (Tarefas, Hábitos da Forja e Projetos) */
  const renderCombatScheduleMiniCard = () => {
    const timelineItems = getTodayCombatTimeline(S, ALLH, curLang);
    const totalCount = timelineItems.length;
    const completedItems = timelineItems.filter((x) => x.done);
    const pendingItems = timelineItems.filter((x) => !x.done);
    const completedCount = completedItems.length;
    const pendingCount = pendingItems.length;

    // Fila Operacional Dinâmica: quando marca uma missão, ela sai imediatamente e a próxima da fila entra
    const MAX_VISIBLE_PENDING = 5;
    const visiblePending = pendingItems.slice(0, MAX_VISIBLE_PENDING);
    const remainingPendingCount = Math.max(0, pendingItems.length - MAX_VISIBLE_PENDING);

    const renderItemRow = (item, isCompletedSection = false) => {
      const isTask = item.type === 'task';
      const isHabit = item.type === 'habit';
      const isProject = item.type === 'project';

      const handleRowClick = () => {
        if (isProject) {
          if (navigateToProject) navigateToProject(item.originalId);
          else setTab('ops');
        }
      };

      return (
        <div
          key={item.id}
          onClick={handleRowClick}
          className={`group flex items-center justify-between gap-2.5 p-2 sm:p-2.5 min-h-[48px] rounded-xl border text-left text-xs transition-all duration-150 active:scale-[0.98] select-none ${
            isProject ? 'cursor-pointer hover:border-gold/60 hover:bg-gold/5' : ''
          } ${
            item.done
              ? 'border-ok/30 bg-ok/5 opacity-70'
              : item.status === 'overdue'
              ? 'border-danger/40 bg-danger/10 hover:border-danger/60'
              : item.status === 'soon'
              ? 'border-gold/60 bg-gold/15 shadow-[0_0_12px_rgba(212,175,55,0.15)] animate-pulse'
              : 'border-line/80 bg-[#16151D] hover:border-gold/40'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Badge do Horário / Tipo */}
            <div className="flex flex-col items-center flex-none">
              <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black tracking-tight ${
                item.done
                  ? 'text-muted bg-surface border border-line/40'
                  : item.status === 'soon'
                  ? 'bg-gold text-[#121214] font-black shadow-[0_0_8px_rgba(255,200,70,0.3)]'
                  : 'bg-gold/15 text-gold border border-gold/35'
              }`}>
                {item.time}
              </span>
            </div>

            {/* Ícone em Moldura Rústica e Nome da Tarefa/Hábito/Projeto */}
            <div className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border text-sm flex-none transition-all ${
              item.done
                ? 'border-ok/40 bg-ok/15 text-ok shadow-sm'
                : item.status === 'soon'
                ? 'border-gold bg-gold/20 text-gold shadow-sm'
                : 'border-[#3c3c46] bg-[#1D1B26] text-ink'
            }`}>
              {item.icon}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`font-bold truncate text-[12px] sm:text-[12.5px] ${
                  item.done ? 'line-through text-muted' : 'text-[#EDE5D5] group-hover:text-gold'
                }`}>
                  {item.title}
                </span>
              </div>

              {/* Subtítulo com tipo ou projeto vinculado */}
              <div className="flex items-center gap-2 text-[9.5px] text-muted truncate mt-0.5">
                <span className="uppercase font-semibold tracking-wider text-gold/80">
                  {isTask
                    ? (curLang === 'en' ? 'Task' : curLang === 'es' ? 'Tarea' : 'Tarefa')
                    : isHabit
                    ? (curLang === 'en' ? 'Forge Habit' : curLang === 'es' ? 'Hábito Forja' : 'Hábito da Forja')
                    : (curLang === 'en' ? 'Project' : curLang === 'es' ? 'Proyecto' : 'Projeto')}
                </span>
                {item.projectName && (
                  <button
                    type="button"
                    title={curLang === 'en' ? 'Open linked project' : curLang === 'es' ? 'Abrir proyecto vinculado' : 'Abrir projeto vinculado'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.projectId && navigateToProject) navigateToProject(item.projectId);
                      else if (navigateToProject) navigateToProject();
                      else setTab('ops');
                    }}
                    className="truncate border-l border-line/60 pl-1.5 text-muted hover:text-gold transition-colors flex items-center gap-1 cursor-pointer group/proj text-left"
                  >
                    <span className="truncate group-hover/proj:underline">🏛️ {item.projectName}</span>
                  </button>
                )}
                {item.status === 'soon' && !item.done && (
                  <span className="text-gold font-bold font-mono">
                    ⚡ {curLang === 'en' ? 'NOW' : curLang === 'es' ? 'AHORA' : 'AGORA'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ação: Marcar Tarefa / Hábito diretamente do Card */}
          <div className="flex items-center flex-none pl-1">
            {isTask ? (
              <button
                type="button"
                title={
                  item.done
                    ? (curLang === 'en' ? 'Unmark task' : curLang === 'es' ? 'Desmarcar tarea' : 'Desmarcar tarefa')
                    : (curLang === 'en' ? 'Complete operation' : curLang === 'es' ? 'Completar operación' : 'Concluir operação')
                }
                onClick={(e) => {
                  e.stopPropagation();
                  update((s) => {
                    const tt = (s.tasks || []).find((y) => String(y.id) === String(item.originalId));
                    if (!tt) return;
                    if ((tt.rep || 'unica') === 'unica') {
                      tt.done = !tt.done;
                    } else {
                      const dd = today();
                      tt.doneDates = tt.doneDates || [];
                      const idx = tt.doneDates.indexOf(dd);
                      if (idx >= 0) tt.doneDates.splice(idx, 1);
                      else tt.doneDates.push(dd);
                    }
                  });
                  AF.click();
                  toast(
                    item.done
                      ? (curLang === 'en' ? '↩ Mission unmarked' : curLang === 'es' ? '↩ Operación desmarcada' : '↩ Operação desmarcada')
                      : (curLang === 'en' ? '⚔️ Mission accomplished with honor!' : curLang === 'es' ? '⚔️ ¡Operación cumplida con honor!' : '⚔️ Operação cumprida com honra!')
                  );
                }}
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border text-xs font-bold transition-all duration-150 cursor-pointer active:scale-90 select-none ${
                  item.done
                    ? 'border-gold bg-gold text-[#141414] shadow-[0_0_12px_rgba(255,200,70,0.35)] font-black'
                    : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold hover:text-gold'
                }`}
              >
                <Check size={14} strokeWidth={item.done ? 3 : 2} />
              </button>
            ) : isHabit ? (
              <button
                type="button"
                title={
                  item.done
                    ? (curLang === 'en' ? 'Habit completed' : curLang === 'es' ? 'Hábito cumplido' : 'Hábito cumprido')
                    : (curLang === 'en' ? 'Mark in Forge' : curLang === 'es' ? 'Marcar en la Forja' : 'Marcar na Forja')
                }
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHabitDone(item.originalId, e);
                  toast(
                    item.done
                      ? (curLang === 'en' ? '↩ Habit unmarked' : curLang === 'es' ? '↩ Hábito desmarcado' : '↩ Hábito desmarcado')
                      : (curLang === 'en' ? '🔨 Habit forged for today!' : curLang === 'es' ? '🔨 ¡Hábito forjado hoy!' : '🔨 Hábito forjado hoje!')
                  );
                }}
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border text-xs font-bold transition-all duration-150 cursor-pointer active:scale-90 select-none ${
                  item.done
                    ? 'border-gold bg-gold text-[#141414] shadow-[0_0_12px_rgba(255,200,70,0.35)] font-black'
                    : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold hover:text-gold'
                }`}
              >
                <Check size={14} strokeWidth={item.done ? 3 : 2} />
              </button>
            ) : (
              <button
                type="button"
                title={curLang === 'en' ? 'Open project in Projects tab' : curLang === 'es' ? 'Abrir proyecto en pestaña Proyectos' : 'Abrir projeto na aba Projetos'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigateToProject) navigateToProject(item.originalId);
                  else setTab('ops');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-lg text-[10.5px] font-mono font-bold text-amber-300 bg-amber-950/25 border border-amber-500/40 hover:bg-amber-950/45 hover:border-amber-400 transition-all duration-150 cursor-pointer shadow-sm active:scale-95 flex-none select-none"
              >
                <span className="text-xs">🏛️</span>
                <span>{curLang === 'en' ? 'VIEW PROJECT' : curLang === 'es' ? 'VER PROYECTO' : 'VER PROJETO'}</span>
                <ArrowRight size={11} className="hidden sm:inline-block" />
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="rounded-xl border border-gold/35 bg-gradient-to-r from-[#17151F] via-[#121218] to-[#17151F] p-3 sm:p-3.5 shadow-sm w-full max-w-full overflow-hidden transition-all select-none">
        {/* Cabeçalho do Card Agenda Operacional */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-line/60">
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 border border-gold/35 text-gold text-base flex-none">
              ⏰
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#F5EEDC] truncate flex items-center gap-1.5 font-display">
                {curLang === 'en' ? "TODAY'S COMBAT SCHEDULE" : curLang === 'es' ? 'CRONOGRAMA DE OPERACIONES' : 'AGENDA OPERACIONAL DE HOJE'}
                {pendingCount > 0 && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold animate-ping flex-none" />
                )}
              </span>
              <span className="text-[9.5px] text-muted truncate">
                {curLang === 'en'
                  ? 'Active missions, forge habits & projects'
                  : curLang === 'es'
                  ? 'Misiones activas, hábitos de la forja y proyectos'
                  : 'Missões ativas, hábitos da forja e projetos'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-none">
            {totalCount > 0 ? (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-black border transition-colors ${
                pendingCount === 0
                  ? 'border-ok/40 bg-ok/10 text-ok'
                  : 'border-gold/40 bg-gold/15 text-gold'
              }`}>
                {completedCount}/{totalCount} {curLang === 'en' ? 'DONE' : curLang === 'es' ? 'CUMPLIDOS' : 'CUMPRIDOS'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold border border-line text-muted">
                {curLang === 'en' ? 'NO OPERATIONS' : curLang === 'es' ? 'SIN OPERACIONES' : 'SEM OPERAÇÕES'}
              </span>
            )}
          </div>
        </div>

        {/* Lista de Itens Pendentes (Ao marcar, o item sai e o próximo da fila entra automaticamente) */}
        {visiblePending.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {visiblePending.map((item) => renderItemRow(item, false))}

            {/* Aviso tático de itens que aguardam na fila de hoje */}
            {remainingPendingCount > 0 && (
              <div className="mt-1 flex items-center justify-between px-2.5 py-1 rounded bg-[#101015] border border-line/40 text-[9.5px] text-muted font-mono">
                <span className="flex items-center gap-1 truncate">
                  <span>⏳</span>
                  <span className="truncate">
                    +{remainingPendingCount} {curLang === 'en' ? 'more missions in queue for today' : curLang === 'es' ? 'más operaciones en cola para hoy' : 'missões na fila para hoje'}
                  </span>
                </span>
                <span className="text-gold/80 font-bold shrink-0 pl-1">
                  {curLang === 'en' ? 'COMPLETE TO UNLOCK' : curLang === 'es' ? 'COMPLETA PARA AVANZAR' : 'CONCLUA PARA AVANÇAR'}
                </span>
              </div>
            )}
          </div>
        ) : totalCount > 0 ? (
          /* Estado de Honra: 100% das Operações Concluídas */
          <div className="py-4 px-3 rounded-lg bg-ok/10 border border-ok/30 flex flex-col items-center justify-center text-center gap-1.5">
            <span className="text-2xl">⚔️</span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-ok">
              {curLang === 'en' ? 'ALL MISSIONS ACCOMPLISHED TODAY!' : curLang === 'es' ? '¡TODAS LAS OPERACIONES CUMPLIDAS HOY!' : 'TODAS AS MISSÕES CUMPRIDAS HOJE!'}
            </span>
            <p className="text-[11px] text-muted max-w-sm leading-tight">
              {curLang === 'en'
                ? 'Unshakable discipline. No procrastination was left standing in the last 24 hours.'
                : curLang === 'es'
                ? 'Disciplina inquebrantable. Ninguna procrastinación quedó en pie en las últimas 24 horas.'
                : 'Disciplina inabalável. Nenhuma procrastinação sobrou de pé nas últimas 24 horas.'}
            </p>
          </div>
        ) : (
          /* Nenhuma missão no dia */
          <div className="py-3 px-3 rounded-lg bg-surface2/60 border border-line/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-muted text-sm flex-none">🔔</span>
              <p className="text-[11px] text-muted leading-snug">
                {curLang === 'en'
                  ? 'No tasks or habits scheduled for today. Add missions to build momentum!'
                  : curLang === 'es'
                  ? 'Sin tareas o hábitos programados para hoy. ¡Agrega misiones para avanzar!'
                  : 'Nenhuma tarefa ou hábito agendado para hoje. Adicione missões para entrar em ritmo de guerra!'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-none">
              <button
                type="button"
                onClick={() => { AF.click(); setTab('ops'); }}
                className="px-2.5 py-1 rounded border border-gold/30 bg-gold/10 text-gold text-[10.5px] font-bold hover:bg-gold/20 transition-all cursor-pointer whitespace-nowrap"
              >
                + {curLang === 'en' ? 'New Task' : curLang === 'es' ? 'Nueva Tarea' : 'Nova Tarefa'}
              </button>
            </div>
          </div>
        )}

        {/* Seção de Concluídas do Dia (Para conferência ou desmarcação acidental) */}
        {completedCount > 0 && (
          <div className="mt-2 pt-2 border-t border-line/50 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setShowCompletedInSchedule((prev) => !prev)}
              className="flex items-center justify-between w-full text-[10px] sm:text-[10.5px] font-bold text-muted hover:text-gold transition-colors py-0.5 cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-ok" />
                <span>
                  {showCompletedInSchedule
                    ? (curLang === 'en' ? 'Hide completed missions' : curLang === 'es' ? 'Ocultar operaciones cumplidas' : 'Ocultar missões concluídas')
                    : (curLang === 'en'
                        ? `View completed missions (${completedCount})`
                        : curLang === 'es'
                        ? `Ver operaciones cumplidas (${completedCount})`
                        : `Ver missões concluídas (${completedCount})`)}
                </span>
              </span>
              <span className="text-xs font-mono">
                {showCompletedInSchedule ? '▲' : '▼'}
              </span>
            </button>

            {showCompletedInSchedule && (
              <div className="flex flex-col gap-1 mt-1 pl-1 border-l-2 border-ok/30">
                {completedItems.map((item) => renderItemRow(item, true))}
              </div>
            )}
          </div>
        )}

        {/* Barra de Ações Operacionais */}
        <div className="mt-2.5 pt-2 border-t border-line/60 grid grid-cols-3 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => { AF.click(); setTab('ops'); }}
            className="py-1.5 px-1.5 sm:px-2 rounded-lg bg-surface hover:bg-surface2 border border-line text-muted hover:text-ink text-[10px] sm:text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🎯</span>
            <span className="truncate">{curLang === 'en' ? 'Operations' : curLang === 'es' ? 'Operaciones' : 'Operações'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigateToProject) navigateToProject();
              else { AF.click(); setTab('ops'); }
            }}
            className="py-1.5 px-1.5 sm:px-2 rounded-lg bg-surface hover:bg-surface2 border border-line text-muted hover:text-ink text-[10px] sm:text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🏛️</span>
            <span className="truncate">{curLang === 'en' ? 'Projects' : curLang === 'es' ? 'Proyectos' : 'Projetos'}</span>
          </button>
          <button
            type="button"
            onClick={() => { AF.click(); setTab('forge'); }}
            className="py-1.5 px-1.5 sm:px-2 rounded-lg bg-surface hover:bg-surface2 border border-line text-muted hover:text-ink text-[10px] sm:text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🔨</span>
            <span className="truncate">{curLang === 'en' ? 'Forge Habits' : curLang === 'es' ? 'La Forja' : 'A Forja'}</span>
          </button>
        </div>
      </div>
    );
  };

  /* OPÇÃO A: Mobile Combat Dashboard "Forjando Guerreiros" (Aço, Forja, Honra & Alta Densidade) */
  const renderMobileOneScreen = () => {
    return (
      <div className="flex flex-col gap-3 w-full min-w-0 max-w-full">
        {/* 1. OS 3 MONÓLITOS DA FORJA (Torres / Brasão Heráldico do Guerreiro com Frase do Dia e Contador 24h Integrados) */}
        {renderPillars3DTowers(false)}

        {/* 2. BLINDAGEM DO DIA: REGISTRO TÁTICO DIRETO COM OS 3 ESCUDOS E CARGA TÁTICA INTEGRADA */}
        {renderDailyCheckin()}

        {/* 3. AGENDA OPERACIONAL DE HOJE (Único hub de missões, hábitos e projetos) */}
        {renderCombatScheduleMiniCard()}
      </div>
    );
  };

  return (
    <div className="grid gap-3.5 w-full max-w-full min-w-0 overflow-x-hidden pb-12 lg:pb-6">
      {/* NO MOBILE: OPÇÃO A (Super Otimizada, Brasão / Torres 3D, Agenda Operacional) */}
      <div className="lg:hidden w-full min-w-0 max-w-full">
        {renderMobileOneScreen()}
      </div>

      {/* NO DESKTOP: GRID EM DUAS COLUNAS PERFEITAMENTE BALANCEADO */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3.5 items-start">
        {/* Coluna Esquerda Desktop: As 3 Torres 3D dos Pilares com Frase do Dia e Relógio 24h Integrados */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {renderPillars3DTowers(true)}
        </div>

        {/* Coluna Direita Desktop: Registro Diário de Combate e Agenda Operacional de Hoje */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {renderDailyCheckin()}
          {renderCombatScheduleMiniCard()}
        </div>
      </div>

      {/* Modal de Celebração de Subida de Nível */}
      {levelUpModalTier && (
        <WarriorLevelUpModal
          tier={levelUpModalTier}
          currentDays={d}
          lang={lang}
          onClose={() => setLevelUpModalTier(null)}
        />
      )}

      {/* Modal de Exibição e Inspeção das 11 Armaduras Medievais */}
      {showEvolutionGallery && (
        <WarriorEvolutionGalleryModal
          tiers={tiers}
          currentTier={tier}
          currentDays={d}
          lang={lang}
          onClose={() => setShowEvolutionGallery(false)}
          onTestLevelUp={(t) => {
            setShowEvolutionGallery(false);
            setLevelUpModalTier(t);
          }}
        />
      )}
    </div>
  );
}
