'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Shield,
  Zap,
  Search,
  Filter,
  ArrowUpDown,
  Lock,
  UserCheck,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';
import { progressDays, currentStreak, tierNow } from '@/lib/logic';

const LEADERBOARD_I18N = {
  headline: {
    pt: 'LEADERBOARD DE GUERRA & RETENÇÃO',
    en: 'WAR & RETENTION LEADERBOARD',
    es: 'LEADERBOARD DE GUERRA Y RETENCIÓN',
  },
  subtitle: {
    pt: 'Irmandade anônima dos guerreiros invictos na Forja. Honra, dias limpos e consistência de aço.',
    en: 'Anonymous brotherhood of undefeated warriors in the Forge. Honor, clean days, and steel consistency.',
    es: 'Hermandad anónima de los guerreros invictos en la Forja. Honor, días limpios y consistencia de acero.',
  },
  tabRetention: {
    pt: 'Dias de Retenção',
    en: 'Retention Days',
    es: 'Días de Retención',
  },
  tabGloryScore: {
    pt: 'Pontos de Glória',
    en: 'Glory Points',
    es: 'Puntos de Gloria',
  },
  tabStreak: {
    pt: 'Série Atual (Streak)',
    en: 'Current Streak',
    es: 'Racha Actual (Streak)',
  },
  searchPlaceholder: {
    pt: 'Buscar guerreiro por pseudônimo...',
    en: 'Search warrior by pseudonym...',
    es: 'Buscar guerrero por seudónimo...',
  },
  filterAll: {
    pt: 'Todos os Patamares',
    en: 'All Tiers',
    es: 'Todos los Patamares',
  },
  filterMasters: {
    pt: 'Mestres & Imortais (120d+)',
    en: 'Masters & Immortals (120d+)',
    es: 'Maestros e Inmortales (120d+)',
  },
  filterChampions: {
    pt: 'Campeões (60d - 119d)',
    en: 'Champions (60d - 119d)',
    es: 'Campeones (60d - 119d)',
  },
  filterKnights: {
    pt: 'Cavaleiros (30d - 59d)',
    en: 'Knights (30d - 59d)',
    es: 'Caballeros (30d - 59d)',
  },
  filterInitiates: {
    pt: 'Iniciados (< 30d)',
    en: 'Initiates (< 30d)',
    es: 'Iniciados (< 30d)',
  },
  lblPodiumFirst: {
    pt: 'CAMPEÃO SUPREMO',
    en: 'SUPREME CHAMPION',
    es: 'CAMPEÓN SUPREMO',
  },
  lblPodiumSecond: {
    pt: 'VICE-CAMPEÃO',
    en: 'RUNNER-UP',
    es: 'SUBCAMPEÓN',
  },
  lblPodiumThird: {
    pt: 'TERCEIRO DE HONRA',
    en: 'THIRD OF HONOR',
    es: 'TERCERO DE HONOR',
  },
  lblRankCol: {
    pt: 'POSIÇÃO',
    en: 'RANK',
    es: 'POSICIÓN',
  },
  lblWarriorCol: {
    pt: 'GUERREIRO',
    en: 'WARRIOR',
    es: 'GUERRERO',
  },
  lblDaysCol: {
    pt: 'RETENÇÃO',
    en: 'RETENTION',
    es: 'RETENCIÓN',
  },
  lblStreakCol: {
    pt: 'STREAK',
    en: 'STREAK',
    es: 'RACHA',
  },
  lblScoreCol: {
    pt: 'GLÓRIA',
    en: 'GLORY',
    es: 'GLORIA',
  },
  badgeYou: {
    pt: 'VOCÊ',
    en: 'YOU',
    es: 'TÚ',
  },
  yourRankTitle: {
    pt: 'SUA CLASSIFICAÇÃO NO RANKING',
    en: 'YOUR LEADERBOARD RANKING',
    es: 'TU CLASIFICACIÓN EN EL RANKING',
  },
  yourRankDesc: (rank, total) => ({
    pt: `Você está na posição #${rank} entre ${total} guerreiros ativos.`,
    en: `You are currently ranked #${rank} among ${total} active warriors.`,
    es: `Estás en la posición #${rank} entre ${total} guerreros activos.`,
  }),
  privateModeTitle: {
    pt: '🛡️ VOCÊ ESTÁ NO MODO PRIVADO',
    en: '🛡️ YOU ARE IN PRIVATE MODE',
    es: '🛡️ ESTÁS EN MODO PRIVADO',
  },
  privateModeDesc: {
    pt: 'Seus dados não estão visíveis no Leaderboard. Para disputar o ranking com seu pseudônimo anônimo de honra, ative nas Configurações.',
    en: 'Your data is not visible on the Leaderboard. To join the ranking with your anonymous pseudonym of honor, enable it in Settings.',
    es: 'Tus datos no son visibles en el Leaderboard. Para competir en el ranking con tu seudónimo anónimo de honor, actívalo en Ajustes.',
  },
  btnActivatePseudonym: {
    pt: 'CONFIGURAR PSEUDÔNIMO',
    en: 'CONFIGURE PSEUDONYM',
    es: 'CONFIGURAR SEUDÓNIMO',
  },
  emptyList: {
    pt: 'Nenhum guerreiro encontrado para este filtro de busca.',
    en: 'No warriors found for this search filter.',
    es: 'No se encontraron guerreros para este filtro de búsqueda.',
  },
  loading: {
    pt: 'Convocando o Salão da Fama...',
    en: 'Summoning the Hall of Fame...',
    es: 'Convocando el Salón de la Fama...',
  },
  privacyNote: {
    pt: '🛡️ Ranking 100% anônimo: apenas pseudônimos táticos, patamar e contagem de dias. Nenhum e-mail ou dado pessoal é exposto.',
    en: '🛡️ 100% anonymous ranking: only tactical pseudonyms, tier, and day counts. No email or personal data is exposed.',
    es: '🛡️ Ranking 100% anónimo: solo seudónimos tácticos, patamar y conteo de días. Ningún correo o dato personal es expuesto.',
  },
  ptsSuffix: {
    pt: 'pts',
    en: 'pts',
    es: 'pts',
  },
  daysSuffix: {
    pt: 'dias',
    en: 'days',
    es: 'días',
  },
};

const DEFAULT_HONOR_WARRIORS = [
  { name: 'Sentinela_do_Aço', days: 395, streak: 98, tier: 'PATRIARCA IMORTAL', tierIcon: '👑', score: 6200, purity: 100 },
  { name: 'Guardião_da_Aurora', days: 294, streak: 122, tier: 'SOBERANO DO TEMPLO', tierIcon: '🦅', score: 5120, purity: 100 },
  { name: 'Espartano_77', days: 201, streak: 72, tier: 'GRÃO-MESTRE DA ORDEM', tierIcon: '⚡', score: 3980, purity: 99 },
  { name: 'Forja_Invicta', days: 146, streak: 49, tier: 'LORDE COMANDANTE', tierIcon: '🔥', score: 2940, purity: 100 },
  { name: 'Aço_Valiriano', days: 104, streak: 42, tier: 'CAMPEÃO DA FORJA', tierIcon: '🐉', score: 2260, purity: 98 },
  { name: 'Lobo_Solitário', days: 82, streak: 33, tier: 'CAMPEÃO DA FORJA', tierIcon: '🐉', score: 1840, purity: 100 },
  { name: 'Vontade_de_Ferro', days: 54, streak: 26, tier: 'CAVALEIRO DA ORDEM', tierIcon: '🏛️', score: 1390, purity: 100 },
  { name: 'Cavaleiro_Sem_Manto', days: 39, streak: 19, tier: 'CAVALEIRO DA ORDEM', tierIcon: '🏛️', score: 1080, purity: 97 },
  { name: 'Fênix_Ressurgida', days: 27, streak: 18, tier: 'HOMEM-DE-ARMAS', tierIcon: '🛡️', score: 810, purity: 100 },
  { name: 'Gladiador_do_Norte', days: 19, streak: 16, tier: 'HOMEM-DE-ARMAS', tierIcon: '🛡️', score: 650, purity: 96 },
  { name: 'Tempestade_Calma', days: 14, streak: 14, tier: 'ESCUDEIRO FORJADO', tierIcon: '⚔️', score: 490, purity: 100 },
  { name: 'Escudeiro_Valente', days: 9, streak: 9, tier: 'PAJEM DE ARMAS', tierIcon: '🗡️', score: 340, purity: 100 },
  { name: 'Iniciado_Corajoso', days: 5, streak: 5, tier: 'PAJEM DE ARMAS', tierIcon: '🗡️', score: 220, purity: 100 },
  { name: 'Guerreiro_em_Ascensão', days: 3, streak: 3, tier: 'NEÓFITO DA FORJA', tierIcon: '🛡️', score: 150, purity: 100 },
];

export default function Leaderboard({ onNavigateToSettings }) {
  const { S, setTab } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const t = LEADERBOARD_I18N;

  const [rawWarriors, setRawWarriors] = useState(null);
  const [sortMetric, setSortMetric] = useState('retention'); // 'retention' | 'glory' | 'streak'
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'masters' | 'champions' | 'knights' | 'initiates'
  const [searchQuery, setSearchQuery] = useState('');

  // Carrega dados da API /api/hall
  useEffect(() => {
    let mounted = true;
    fetch('/api/hall')
      .then((r) => r.json())
      .then((data) => {
        if (mounted) {
          if (Array.isArray(data) && data.length > 0) {
            setRawWarriors(data);
          } else {
            setRawWarriors(DEFAULT_HONOR_WARRIORS);
          }
        }
      })
      .catch(() => {
        if (mounted) setRawWarriors(DEFAULT_HONOR_WARRIORS);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Dados do usuário atual
  const userDays = progressDays(S) || 0;
  const userStreak = currentStreak(S) || (S?.streak || 0);
  const userTier = tierNow(S);
  const userHabitCount = (S?.forge?.done ? Object.values(S.forge.done).flat().length : 0);
  const userScore = Math.round(userDays * 10 + userStreak * 20 + userHabitCount * 5);
  const userHallName = (S?.hallName || '').trim() || (curLang === 'en' ? 'My Warrior' : curLang === 'es' ? 'Mi Guerrero' : 'Meu Guerreiro');
  const isUserOptIn = Boolean(S?.hallOptIn);

  // Monta a lista consolidada com o usuário atual inserido
  const consolidatedList = useMemo(() => {
    const base = Array.isArray(rawWarriors) && rawWarriors.length > 0 ? [...rawWarriors] : [...DEFAULT_HONOR_WARRIORS];

    // Formata campos necessários para cada guerreiro
    const formatted = base.map((w) => ({
      name: w.name || 'Guerreiro Anônimo',
      days: Number(w.days) || 0,
      streak: Number(w.streak) || 0,
      tier: w.tier || 'HOMEM-DE-ARMAS',
      tierIcon: w.tierIcon || '🛡️',
      score: Number(w.score) || Math.round((Number(w.days) || 0) * 10 + (Number(w.streak) || 0) * 20),
      purity: Number(w.purity) || 100,
      isCurrentUser: false,
    }));

    // Se o usuário optou pelo Salão da Fama, inclui ou substitui ele
    if (isUserOptIn) {
      const existingIdx = formatted.findIndex(
        (w) => w.name.toLowerCase() === userHallName.toLowerCase()
      );
      const userItem = {
        name: userHallName,
        days: userDays,
        streak: userStreak,
        tier: userTier.name,
        tierIcon: userTier.icon,
        score: userScore,
        purity: S?.purity || 100,
        isCurrentUser: true,
      };

      if (existingIdx >= 0) {
        formatted[existingIdx] = userItem;
      } else {
        formatted.push(userItem);
      }
    }

    return formatted;
  }, [rawWarriors, isUserOptIn, userHallName, userDays, userStreak, userTier, userScore, S]);

  // Ordenação de acordo com a métrica selecionada
  const sortedWarriors = useMemo(() => {
    const list = [...consolidatedList];
    if (sortMetric === 'retention') {
      list.sort((a, b) => b.days - a.days || b.streak - a.streak || b.score - a.score);
    } else if (sortMetric === 'glory') {
      list.sort((a, b) => b.score - a.score || b.days - a.days || b.streak - a.streak);
    } else if (sortMetric === 'streak') {
      list.sort((a, b) => b.streak - a.streak || b.days - a.days || b.score - a.score);
    }
    return list;
  }, [consolidatedList, sortMetric]);

  // Classificação geral indexada (1-based)
  const rankedWarriors = useMemo(() => {
    return sortedWarriors.map((w, index) => ({
      ...w,
      rank: index + 1,
    }));
  }, [sortedWarriors]);

  // Identifica a posição do usuário no ranking geral
  const userRankInfo = useMemo(() => {
    if (!isUserOptIn) return null;
    return rankedWarriors.find((w) => w.isCurrentUser) || null;
  }, [rankedWarriors, isUserOptIn]);

  // Filtragem por busca e por patamar
  const filteredWarriors = useMemo(() => {
    let result = rankedWarriors;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((w) => w.name.toLowerCase().includes(q));
    }

    if (tierFilter === 'masters') {
      result = result.filter((w) => w.days >= 120);
    } else if (tierFilter === 'champions') {
      result = result.filter((w) => w.days >= 60 && w.days < 120);
    } else if (tierFilter === 'knights') {
      result = result.filter((w) => w.days >= 30 && w.days < 60);
    } else if (tierFilter === 'initiates') {
      result = result.filter((w) => w.days < 30);
    }

    return result;
  }, [rankedWarriors, searchQuery, tierFilter]);

  // Separa o Top 3 para o pódio heroico (sempre baseado no ranking filtrado se houver ao menos 3)
  const top3 = useMemo(() => {
    if (searchQuery.trim()) return [];
    return filteredWarriors.slice(0, 3);
  }, [filteredWarriors, searchQuery]);

  const remainingWarriors = useMemo(() => {
    if (searchQuery.trim()) return filteredWarriors;
    return filteredWarriors.slice(3);
  }, [filteredWarriors, searchQuery]);

  const handleTabChange = (metric) => {
    AF.click();
    setSortMetric(metric);
  };

  const handleTierFilter = (filterKey) => {
    AF.click();
    setTierFilter(filterKey);
  };

  const handleGoToSettings = () => {
    AF.click();
    if (typeof onNavigateToSettings === 'function') {
      onNavigateToSettings();
    } else if (typeof setTab === 'function') {
      setTab('settings');
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* 1. CABEÇALHO TÁTICO DO LEADERBOARD */}
      <div className="rounded-xl border border-gold/40 bg-gradient-to-r from-[#1f1a14] via-[#141218] to-[#1a1418] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/50 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(212,175,55,0.25)] flex-none">
              <Trophy size={22} className="text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-sm sm:text-base text-ink tracking-wide uppercase">
                  {t.headline[curLang]}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-gold/15 text-gold border-gold/40">
                  {isUserOptIn ? `🛡️ ${userHallName}` : `🔒 ${t.privateModeTitle[curLang].replace('🛡️ ', '')}`}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed mt-0.5 max-w-xl">
                {t.subtitle[curLang]}
              </p>
            </div>
          </div>

          {/* Botão de Atalho para Configurações */}
          <button
            type="button"
            onClick={handleGoToSettings}
            className="self-start sm:self-center text-xs font-mono text-muted hover:text-gold px-2.5 py-1.5 rounded-lg border border-line hover:border-gold/40 bg-surface/80 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={t.btnActivatePseudonym[curLang]}
          >
            {isUserOptIn ? <UserCheck size={13} className="text-gold" /> : <Lock size={13} />}
            <span>{isUserOptIn ? userHallName : t.btnActivatePseudonym[curLang]}</span>
          </button>
        </div>

        {/* SELETOR DE MÉTRICA DE CLASSIFICAÇÃO */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 rounded-xl bg-surface2/80 border border-line/80">
          <button
            type="button"
            onClick={() => handleTabChange('retention')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sortMetric === 'retention'
                ? 'bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#121214] shadow-sm font-black'
                : 'text-muted hover:text-ink hover:bg-surface/50'
            }`}
          >
            <Shield size={13} />
            <span className="truncate">{t.tabRetention[curLang]}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('glory')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sortMetric === 'glory'
                ? 'bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#121214] shadow-sm font-black'
                : 'text-muted hover:text-ink hover:bg-surface/50'
            }`}
          >
            <Sparkles size={13} />
            <span className="truncate">{t.tabGloryScore[curLang]}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('streak')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sortMetric === 'streak'
                ? 'bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#121214] shadow-sm font-black'
                : 'text-muted hover:text-ink hover:bg-surface/50'
            }`}
          >
            <Flame size={13} />
            <span className="truncate">{t.tabStreak[curLang]}</span>
          </button>
        </div>
      </div>

      {/* 2. CARD DO STATUS DO PRÓPRIO GUERREIRO */}
      {isUserOptIn && userRankInfo ? (
        <div className="p-3.5 rounded-xl border border-gold/50 bg-gradient-to-r from-amber-950/30 via-gold/10 to-surface p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold text-[#121214] font-display font-black text-lg flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)] flex-none">
              #{userRankInfo.rank}
            </div>
            <div>
              <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-extrabold block">
                {t.yourRankTitle[curLang]}
              </span>
              <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                <span>{userHallName}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold/20 text-gold border border-gold/40">
                  {userRankInfo.tierIcon} {userRankInfo.tier}
                </span>
              </h4>
              <p className="text-xs text-muted mt-0.5">
                {t.yourRankDesc(userRankInfo.rank, rankedWarriors.length)[curLang]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center text-xs font-mono">
            <span className="px-2 py-1 rounded-lg bg-surface border border-line text-gold font-bold">
              🛡️ {userDays} {t.daysSuffix[curLang]}
            </span>
            <span className="px-2 py-1 rounded-lg bg-surface border border-line text-amber-400 font-bold">
              🔥 {userStreak}d streak
            </span>
            <span className="px-2 py-1 rounded-lg bg-gold/15 text-gold border border-gold/40 font-black">
              ⚡ {userScore} {t.ptsSuffix[curLang]}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl border border-line/80 bg-surface2/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-surface border border-line text-muted flex-none mt-0.5">
              <Lock size={16} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                {t.privateModeTitle[curLang]}
              </h4>
              <p className="text-xs text-muted leading-relaxed mt-0.5 max-w-xl">
                {t.privateModeDesc[curLang]}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoToSettings}
            className="self-start sm:self-center btn-gold py-2 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <span>🛡️</span>
            <span>{t.btnActivatePseudonym[curLang]}</span>
          </button>
        </div>
      )}

      {/* 3. PÓDIO SUPREMO TOP 3 (Ouro, Prata, Bronze) */}
      {top3.length === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* 🥈 2º Lugar (Esquerda no desktop, 2º no mobile) */}
          <div className="order-2 md:order-1 rounded-xl border border-slate-500/40 bg-gradient-to-b from-[#1b1c24] via-[#121318] to-[#171822] p-4 flex flex-col justify-between relative shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-slate-300 tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800/80 border border-slate-600/50">
                🥈 {t.lblPodiumSecond[curLang]}
              </span>
              <span className="font-display font-black text-xl text-slate-300">#2</span>
            </div>
            <div className="my-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">{top3[1].tierIcon}</span>
                <span className="text-[11px] font-mono text-muted uppercase font-bold truncate">
                  {top3[1].tier}
                </span>
              </div>
              <h4 className={`text-base font-bold truncate ${top3[1].isCurrentUser ? 'text-gold' : 'text-ink'}`}>
                {top3[1].name} {top3[1].isCurrentUser ? `(${t.badgeYou[curLang]})` : ''}
              </h4>
            </div>
            <div className="pt-2 border-t border-line/60 grid grid-cols-3 gap-1 text-center font-mono text-xs">
              <div>
                <span className="text-[9.5px] text-muted block">RETENÇÃO</span>
                <b className="text-ink font-bold">{top3[1].days}d</b>
              </div>
              <div>
                <span className="text-[9.5px] text-muted block">STREAK</span>
                <b className="text-amber-400 font-bold">{top3[1].streak}d</b>
              </div>
              <div>
                <span className="text-[9.5px] text-muted block">GLÓRIA</span>
                <b className="text-gold font-bold">{top3[1].score}</b>
              </div>
            </div>
          </div>

          {/* 🥇 1º Lugar (Centro no desktop, 1º no mobile - Destaque Máximo) */}
          <div className="order-1 md:order-2 rounded-xl border-2 border-gold bg-gradient-to-b from-[#2b2114] via-[#1a1618] to-[#1e151a] p-4 sm:p-5 flex flex-col justify-between relative shadow-[0_0_25px_rgba(212,175,55,0.35)] scale-[1.02]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-gold to-amber-500 text-[#121214] font-black font-mono text-[10px] tracking-widest shadow-[0_0_12px_rgba(212,175,55,0.6)] flex items-center gap-1">
              <Crown size={12} className="fill-current" />
              <span>{t.lblPodiumFirst[curLang]}</span>
            </div>
            <div className="flex items-center justify-between mb-2 mt-1">
              <span className="text-[10px] font-mono font-bold text-gold tracking-wider uppercase px-2 py-0.5 rounded bg-gold/20 border border-gold/40">
                🥇 1º LUGAR
              </span>
              <span className="font-display font-black text-2xl text-gold">#1</span>
            </div>
            <div className="my-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5 mb-1 justify-center sm:justify-start">
                <span className="text-xl">{top3[0].tierIcon}</span>
                <span className="text-xs font-mono text-gold uppercase font-black truncate">
                  {top3[0].tier}
                </span>
              </div>
              <h4 className={`text-lg sm:text-xl font-display font-black truncate ${top3[0].isCurrentUser ? 'text-gold' : 'text-ink'}`}>
                {top3[0].name} {top3[0].isCurrentUser ? `(${t.badgeYou[curLang]})` : ''}
              </h4>
            </div>
            <div className="pt-2.5 border-t border-gold/30 grid grid-cols-3 gap-1 text-center font-mono text-xs">
              <div className="p-1 rounded bg-surface/60 border border-gold/20">
                <span className="text-[9.5px] text-muted block">RETENÇÃO</span>
                <b className="text-gold font-black text-sm">{top3[0].days}d</b>
              </div>
              <div className="p-1 rounded bg-surface/60 border border-gold/20">
                <span className="text-[9.5px] text-muted block">STREAK</span>
                <b className="text-amber-400 font-black text-sm">{top3[0].streak}d</b>
              </div>
              <div className="p-1 rounded bg-surface/60 border border-gold/20">
                <span className="text-[9.5px] text-muted block">GLÓRIA</span>
                <b className="text-gold font-black text-sm">{top3[0].score}</b>
              </div>
            </div>
          </div>

          {/* 🥉 3º Lugar (Direita no desktop, 3º no mobile) */}
          <div className="order-3 md:order-3 rounded-xl border border-amber-800/40 bg-gradient-to-b from-[#211814] via-[#141215] to-[#181315] p-4 flex flex-col justify-between relative shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700/50">
                🥉 {t.lblPodiumThird[curLang]}
              </span>
              <span className="font-display font-black text-xl text-amber-500">#3</span>
            </div>
            <div className="my-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">{top3[2].tierIcon}</span>
                <span className="text-[11px] font-mono text-muted uppercase font-bold truncate">
                  {top3[2].tier}
                </span>
              </div>
              <h4 className={`text-base font-bold truncate ${top3[2].isCurrentUser ? 'text-gold' : 'text-ink'}`}>
                {top3[2].name} {top3[2].isCurrentUser ? `(${t.badgeYou[curLang]})` : ''}
              </h4>
            </div>
            <div className="pt-2 border-t border-line/60 grid grid-cols-3 gap-1 text-center font-mono text-xs">
              <div>
                <span className="text-[9.5px] text-muted block">RETENÇÃO</span>
                <b className="text-ink font-bold">{top3[2].days}d</b>
              </div>
              <div>
                <span className="text-[9.5px] text-muted block">STREAK</span>
                <b className="text-amber-400 font-bold">{top3[2].streak}d</b>
              </div>
              <div>
                <span className="text-[9.5px] text-muted block">GLÓRIA</span>
                <b className="text-gold font-bold">{top3[2].score}</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FILTROS E BUSCA */}
      <div className="rounded-xl border border-line/80 bg-surface2/70 p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder[curLang]}
            className="field pl-9 py-1.5 text-xs w-full bg-surface border-line/80 focus:border-gold/60"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-mono">
          <button
            type="button"
            onClick={() => handleTierFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
              tierFilter === 'all'
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            {t.filterAll[curLang]}
          </button>
          <button
            type="button"
            onClick={() => handleTierFilter('masters')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
              tierFilter === 'masters'
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            👑 {t.filterMasters[curLang]}
          </button>
          <button
            type="button"
            onClick={() => handleTierFilter('champions')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
              tierFilter === 'champions'
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            🐉 {t.filterChampions[curLang]}
          </button>
          <button
            type="button"
            onClick={() => handleTierFilter('knights')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
              tierFilter === 'knights'
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            🏛️ {t.filterKnights[curLang]}
          </button>
        </div>
      </div>

      {/* 5. TABELA / LISTA CLASSIFICADA */}
      <div className="rounded-xl border border-line/80 bg-[#121217] overflow-hidden shadow-sm">
        {/* Cabeçalho da Tabela */}
        <div className="grid grid-cols-12 gap-2 p-3 bg-surface2/80 border-b border-line text-[10px] font-mono text-muted uppercase font-black tracking-wider">
          <div className="col-span-2 sm:col-span-1 text-center">{t.lblRankCol[curLang]}</div>
          <div className="col-span-5 sm:col-span-6">{t.lblWarriorCol[curLang]}</div>
          <div className="col-span-2 text-center">{t.lblDaysCol[curLang]}</div>
          <div className="col-span-1 text-center hidden sm:block">{t.lblStreakCol[curLang]}</div>
          <div className="col-span-3 sm:col-span-2 text-right">{t.lblScoreCol[curLang]}</div>
        </div>

        {/* Linhas da Tabela */}
        {rawWarriors === null ? (
          <div className="p-8 text-center text-xs text-muted font-mono animate-pulse">
            {t.loading[curLang]}
          </div>
        ) : remainingWarriors.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted">
            {t.emptyList[curLang]}
          </div>
        ) : (
          <div className="divide-y divide-line/40 max-h-[500px] overflow-y-auto">
            {remainingWarriors.map((w) => {
              const isUser = w.isCurrentUser;
              return (
                <div
                  key={`${w.name}-${w.rank}`}
                  className={`grid grid-cols-12 gap-2 p-3 items-center text-xs transition-colors ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-950/40 via-gold/15 to-surface2/90 border-y border-gold/60 text-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'hover:bg-surface2/60 text-ink'
                  }`}
                >
                  {/* Posição Rank */}
                  <div className="col-span-2 sm:col-span-1 text-center font-display font-black text-xs sm:text-sm">
                    {w.rank <= 3 ? (
                      <span className="text-gold">
                        {w.rank === 1 ? '🥇' : w.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="font-mono text-muted">#{w.rank}</span>
                    )}
                  </div>

                  {/* Guerreiro & Patamar */}
                  <div className="col-span-5 sm:col-span-6 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-sm shrink-0">{w.tierIcon}</span>
                      <span className={`font-bold truncate text-xs sm:text-sm ${isUser ? 'text-gold' : 'text-ink'}`}>
                        {w.name}
                      </span>
                      {isUser && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-gold text-[#121214] font-black shrink-0">
                          {t.badgeYou[curLang]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-muted block truncate mt-0.5">
                      {w.tier}
                    </span>
                  </div>

                  {/* Dias de Retenção */}
                  <div className="col-span-2 text-center font-mono font-bold text-gold text-xs">
                    {w.days}d
                  </div>

                  {/* Streak */}
                  <div className="col-span-1 text-center font-mono text-amber-400 font-bold hidden sm:block text-xs">
                    🔥 {w.streak}
                  </div>

                  {/* Pontos de Glória */}
                  <div className="col-span-3 sm:col-span-2 text-right font-mono font-black text-ink text-xs pr-2">
                    ⚡ {w.score.toLocaleString()} <span className="text-[10px] font-normal text-muted">{t.ptsSuffix[curLang]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. NOTA DE PRIVACIDADE E SEGURANÇA */}
      <p className="text-[11px] font-mono text-muted/80 text-left pt-1">
        {t.privacyNote[curLang]}
      </p>
    </div>
  );
}
