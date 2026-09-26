'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Crown,
  Users,
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Flame,
  Shield,
  Database,
  Webhook,
  Key,
  TrendingUp,
  X,
  FileText,
  Mail,
  Calendar,
  Sparkles,
  Send,
  CornerDownRight,
  Check,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';

const ADMIN_EMAILS = ['micheldiemeson@gmail.com', 'diemesonmd@gmail.com'];

export default function AdminView() {
  const { auth, authRef, toast } = useApp();

  const userEmail = (
    auth?.email ||
    authRef?.current?.email ||
    (typeof window !== 'undefined' ? localStorage.getItem('fg_local_session') : '') ||
    ''
  ).trim().toLowerCase();

  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'warriors' | 'feedback' | 'health'

  // Filtros de Guerreiros
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState('all');
  const [selectedWarrior, setSelectedWarrior] = useState(null);

  // Filtros de Feedback
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Estado para Resposta Direta do Dono ao Guerreiro
  const [replyingFbId, setReplyingFbId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySending, setReplySending] = useState(false);

  const handleSendReply = async (fb) => {
    if (!replyContent || replyContent.trim().length < 2) {
      toast('⚠ Digite uma resposta com pelo menos 2 caracteres.');
      return;
    }
    setReplySending(true);
    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': userEmail,
        },
        body: JSON.stringify({
          feedbackId: fb.id,
          targetEmail: fb.contact,
          targetUserId: fb.userId,
          originalMessage: fb.message,
          replyText: replyContent.trim(),
          adminEmail: userEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao enviar resposta.');
      }

      // Atualiza o feedback localmente no estado para refletir na hora
      setMetrics((prev) => {
        if (!prev || !Array.isArray(prev.feedbacks)) return prev;
        return {
          ...prev,
          feedbacks: prev.feedbacks.map((f) => {
            if (f.id === fb.id) {
              return {
                ...f,
                reply: {
                  id: data.reply.id,
                  text: data.reply.replyText,
                  createdAt: data.reply.createdAt,
                  author: data.reply.author,
                },
              };
            }
            return f;
          }),
        };
      });

      try { AF.victory(); } catch (e) {}
      toast('⚔️ Decreto enviado com sucesso! O guerreiro receberá a notificação no app.');
      setReplyingFbId(null);
      setReplyContent('');
    } catch (err) {
      console.error(err);
      toast('⚠ Erro ao enviar resposta: ' + (err.message || 'Tente novamente.'));
    } finally {
      setReplySending(false);
    }
  };

  const fetchMetrics = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      AF.click();
      const res = await fetch(`/api/admin/metrics?admin_email=${encodeURIComponent(userEmail)}`, {
        headers: {
          'x-admin-email': userEmail,
        },
      });

      if (!res.ok) {
        throw new Error('Acesso negado ou falha ao carregar dados do servidor.');
      }

      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao carregar métricas.');
      toast('⚠ Falha ao conectar ao servidor do Comando.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchMetrics();
    }
  }, [isAdmin]);

  // Guerreiros filtrados por busca e assinatura
  const filteredWarriors = useMemo(() => {
    if (!metrics || !Array.isArray(metrics.warriors)) return [];
    return metrics.warriors.filter((w) => {
      const matchSearch =
        !searchQuery ||
        (w.email && w.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.id && String(w.id).toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.tierName && w.tierName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSub =
        subFilter === 'all' ||
        (subFilter === 'active' && (w.subStatus === 'active' || w.subStatus === 'trialing')) ||
        (subFilter === 'trialing' && w.subStatus === 'trialing') ||
        (subFilter === 'inactive' && (w.subStatus === 'inactive' || w.subStatus === 'local' || !w.subStatus));

      return matchSearch && matchSub;
    });
  }, [metrics, searchQuery, subFilter]);

  // Feedbacks filtrados
  const filteredFeedbacks = useMemo(() => {
    if (!metrics || !Array.isArray(metrics.feedbacks)) return [];
    return metrics.feedbacks.filter((fb) => {
      if (feedbackFilter === 'all') return true;
      return fb.category === feedbackFilter;
    });
  }, [metrics, feedbackFilter]);

  // Se não for admin, exibe tela de acesso restrito
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger mb-4">
          <Shield size={48} className="mx-auto mb-2" />
          <h2 className="font-display font-bold text-lg">ZONA RESTRITA DA FORJA</h2>
          <p className="text-xs text-muted font-mono mt-1">
            Este setor é reservado exclusivamente ao Comando Supremo ({ADMIN_EMAILS[0]}).
          </p>
        </div>
      </div>
    );
  }

  const kpis = metrics?.kpis || {};
  const server = metrics?.server || {};

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10 text-ink animate-fadeIn">
      {/* CABEÇALHO TÁTICO DO COMANDO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-deep via-surface to-deep border-2 border-gold/40 p-4 sm:p-6 shadow-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gold/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-gold/15 border border-gold/30 text-gold shadow-sm">
                <Crown size={20} />
              </span>
              <h1 className="font-display text-xl sm:text-2xl font-black tracking-wider text-gold">
                PAINEL DO COMANDO SUPREMO
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                PROPRIETÁRIO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted font-mono">
              Inteligência tática, métricas do reino, faturamento e monitoramento dos guerreiros.
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-gold2">
              <span>Conta Mestre:</span>
              <strong className="text-gold font-bold">{userEmail}</strong>
              <span className="text-muted">· Versão {server.version || 'v1.5.2'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-xs font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Sincronizando...' : 'Atualizar Dados'}</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS DO ADMIN */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-line/50">
          <button
            onClick={() => { AF.click(); setActiveTab('overview'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-gold text-black shadow-md font-black'
                : 'bg-surface2/60 text-muted hover:text-ink hover:bg-surface2'
            }`}
          >
            <Activity size={14} />
            <span>MÉTRICAS DO REINO</span>
          </button>

          <button
            onClick={() => { AF.click(); setActiveTab('warriors'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'warriors'
                ? 'bg-gold text-black shadow-md font-black'
                : 'bg-surface2/60 text-muted hover:text-ink hover:bg-surface2'
            }`}
          >
            <Users size={14} />
            <span>TROPA DE GUERREIROS ({kpis.totalWarriors ?? 0})</span>
          </button>

          <button
            onClick={() => { AF.click(); setActiveTab('feedback'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'feedback'
                ? 'bg-gold text-black shadow-md font-black'
                : 'bg-surface2/60 text-muted hover:text-ink hover:bg-surface2'
            }`}
          >
            <MessageSquare size={14} />
            <span>CONSELHO & BUGS ({(metrics?.feedbacks || []).length})</span>
          </button>

          <button
            onClick={() => { AF.click(); setActiveTab('health'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'health'
                ? 'bg-gold text-black shadow-md font-black'
                : 'bg-surface2/60 text-muted hover:text-ink hover:bg-surface2'
            }`}
          >
            <Database size={14} />
            <span>SAÚDE DA INFRAESTRUTURA</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-danger/15 border border-danger/40 text-danger text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button onClick={fetchMetrics} className="underline hover:text-ink">Tentar novamente</button>
        </div>
      )}

      {/* ABA 1: MÉTRICAS GERAIS DO REINO (OVERVIEW) */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* CARDS DE KPIS PRINCIPAIS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total de Guerreiros */}
            <div className="p-4 rounded-xl bg-surface border border-line flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-xs font-mono mb-2">
                <span>TOTAL DE GUERREIROS</span>
                <Users size={16} className="text-gold" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-gold">
                  {loading ? '...' : kpis.totalWarriors ?? 0}
                </div>
                <div className="text-[11px] font-mono text-muted mt-1 flex items-center gap-1">
                  <span className="text-ok font-bold">+{kpis.active24h ?? 0}</span> ativos nas últimas 24h
                </div>
              </div>
            </div>

            {/* Assinaturas & Conversão */}
            <div className="p-4 rounded-xl bg-surface border border-line flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-xs font-mono mb-2">
                <span>ASSINANTES ATIVOS</span>
                <CreditCard size={16} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
                  {loading ? '...' : (kpis.subs?.active ?? 0) + (kpis.subs?.trialing ?? 0)}
                </div>
                <div className="text-[11px] font-mono text-muted mt-1 flex items-center gap-1">
                  <span>{kpis.subs?.trialing ?? 0} em período de teste (7d)</span>
                </div>
              </div>
            </div>

            {/* Vitórias no S.O.S */}
            <div className="p-4 rounded-xl bg-surface border border-line flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-xs font-mono mb-2">
                <span>TENTAÇÕES VENCIDAS</span>
                <Shield size={16} className="text-sky-400" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-sky-400">
                  {loading ? '...' : kpis.totalSosVictories ?? 0}
                </div>
                <div className="text-[11px] font-mono text-muted mt-1">
                  Resgates de emergência concluídos
                </div>
              </div>
            </div>

            {/* Média de Retenção & Recorde */}
            <div className="p-4 rounded-xl bg-surface border border-line flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted text-xs font-mono mb-2">
                <span>MÉDIA DE VIGÍLIA</span>
                <Flame size={16} className="text-amber-500" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">
                  {loading ? '...' : `${kpis.avgDays ?? 0}d`}
                </div>
                <div className="text-[11px] font-mono text-muted mt-1">
                  Maior sequência atual: <strong className="text-gold">{kpis.maxStreak ?? 0} dias</strong>
                </div>
              </div>
            </div>
          </div>

          {/* DISTRIBUIÇÃO DE PATENTES E MODOS DE VIDA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Patentes da Forja */}
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2.5">
                <h3 className="font-display font-bold text-sm text-gold flex items-center gap-2">
                  <Sparkles size={16} /> DISTRIBUIÇÃO POR PATENTE MILITAR
                </h3>
                <span className="text-[11px] font-mono text-muted">Força das Tropas</span>
              </div>

              <div className="space-y-2 pt-1">
                {metrics?.tierCounts && Object.keys(metrics.tierCounts).length > 0 ? (
                  Object.entries(metrics.tierCounts).map(([tierName, count]) => {
                    const pct = kpis.totalWarriors ? Math.round((count / kpis.totalWarriors) * 100) : 0;
                    return (
                      <div key={tierName} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-ink font-bold">{tierName}</span>
                          <span className="text-muted">{count} guerreiros ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface2 overflow-hidden border border-line">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-gold rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted font-mono py-4 text-center">
                    Nenhum perfil de guerreiro computado ainda no banco de dados.
                  </p>
                )}
              </div>
            </div>

            {/* Modos de Vida & Status de Assinatura */}
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-line space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-2.5 mb-3">
                  <h3 className="font-display font-bold text-sm text-gold flex items-center gap-2">
                    <CreditCard size={16} /> FUNIL DE ASSINATURAS
                  </h3>
                  <span className="text-[11px] font-mono text-muted">Stripe & Acessos</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-surface2 border border-line">
                    <span className="text-muted block text-[10px]">ATIVAS PAGAS</span>
                    <strong className="text-emerald-400 text-lg font-bold">{kpis.subs?.active ?? 0}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface2 border border-line">
                    <span className="text-muted block text-[10px]">TRIAL (7 DIAS)</span>
                    <strong className="text-sky-400 text-lg font-bold">{kpis.subs?.trialing ?? 0}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface2 border border-line">
                    <span className="text-muted block text-[10px]">GRATUITOS / INATIVOS</span>
                    <strong className="text-amber-400 text-lg font-bold">{kpis.subs?.inactive ?? 0}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface2 border border-line">
                    <span className="text-muted block text-[10px]">DISPOSITIVOS LOCAIS</span>
                    <strong className="text-muted text-lg font-bold">{kpis.subs?.local ?? 0}</strong>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-line pb-2 mb-2">
                  <h4 className="text-xs font-mono font-bold text-ink/80">MODO DE VIDA SELECIONADO</h4>
                  <span className="text-[10px] font-mono text-muted">Status de Relacionamento</span>
                </div>
                <div className="flex gap-2 text-xs font-mono">
                  <div className="flex-1 p-2 rounded bg-surface2 text-center border border-line">
                    <span className="text-[10.5px] text-muted block">Solteiros</span>
                    <b className="text-gold">{metrics?.lifeModeCounts?.single ?? 0}</b>
                  </div>
                  <div className="flex-1 p-2 rounded bg-surface2 text-center border border-line">
                    <span className="text-[10.5px] text-muted block">Casados (Modo A)</span>
                    <b className="text-gold">{metrics?.lifeModeCounts?.committedA ?? 0}</b>
                  </div>
                  <div className="flex-1 p-2 rounded bg-surface2 text-center border border-line">
                    <span className="text-[10.5px] text-muted block">Casados (Modo B)</span>
                    <b className="text-gold">{metrics?.lifeModeCounts?.committedB ?? 0}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: TROPA DE GUERREIROS (LISTA COMPLETA DE USUÁRIOS) */}
      {activeTab === 'warriors' && (
        <div className="space-y-3">
          {/* BARRA DE FILTROS E PESQUISA */}
          <div className="p-3.5 rounded-xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Buscar por e-mail, nome ou patente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface2 border border-line text-xs font-mono text-ink placeholder:text-muted focus:border-gold/60 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-mono text-muted flex items-center gap-1 mr-1">
                <Filter size={12} /> Filtro:
              </span>
              <button
                onClick={() => setSubFilter('all')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  subFilter === 'all'
                    ? 'bg-gold/20 text-gold border-gold/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                Todos ({metrics?.warriors?.length || 0})
              </button>
              <button
                onClick={() => setSubFilter('active')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  subFilter === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                Assinantes ({(kpis.subs?.active || 0) + (kpis.subs?.trialing || 0)})
              </button>
              <button
                onClick={() => setSubFilter('inactive')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  subFilter === 'inactive'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                Inativos ({kpis.subs?.inactive || 0})
              </button>
            </div>
          </div>

          {/* TABELA DE GUERREIROS */}
          <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface2/80 border-b border-line text-muted uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Guerreiro / E-mail</th>
                    <th className="p-3">Vigília (Dias)</th>
                    <th className="p-3">Patente Atual</th>
                    <th className="p-3">Pureza</th>
                    <th className="p-3">SOS Vencidos</th>
                    <th className="p-3">Assinatura</th>
                    <th className="p-3">Última Atividade</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted animate-pulse">
                        Carregando tropa de guerreiros do banco...
                      </td>
                    </tr>
                  ) : filteredWarriors.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted">
                        Nenhum guerreiro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredWarriors.map((w, idx) => (
                      <tr key={w.id || idx} className="hover:bg-surface2/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-ink truncate max-w-[220px]" title={w.email}>
                            {w.email}
                          </div>
                          <div className="text-[10px] text-muted truncate max-w-[180px]">
                            ID: {w.id}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gold text-sm">{w.days}d</span>
                          <span className="text-[10px] text-muted block">Streak: 🔥 {w.streak}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 text-ink font-bold">
                            <span>{w.tierIcon}</span>
                            <span className="truncate max-w-[140px]">{w.tierName}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-gold font-bold">💎 {w.purity}%</span>
                        </td>
                        <td className="p-3">
                          <span className="text-emerald-400 font-bold">🛡️ {w.sosCount}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                            w.subStatus === 'active'
                              ? 'bg-ok/15 text-ok border-ok/30'
                              : w.subStatus === 'trialing'
                              ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}>
                            {w.subStatus === 'active' ? 'Ativa' : w.subStatus === 'trialing' ? 'Trial 7d' : 'Inativa'}
                          </span>
                        </td>
                        <td className="p-3 text-[10.5px] text-muted whitespace-nowrap">
                          {w.lastActive ? new Date(w.lastActive).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => { AF.click(); setSelectedWarrior(w); }}
                            className="px-2 py-1 rounded bg-surface2 border border-line text-muted hover:text-gold hover:border-gold/40 text-[10.5px] font-bold"
                          >
                            Inspecionar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: CONSELHO DE GUERRA (FEEDBACKS & BUGS) */}
      {activeTab === 'feedback' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-sm text-gold">CENTRAL DE DECRETOS & RELATOS</h3>
              <p className="text-[11px] font-mono text-muted">
                Mensagens enviadas através do card &quot;Conselho de Guerra&quot; nas configurações.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setFeedbackFilter('all')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  feedbackFilter === 'all'
                    ? 'bg-gold/20 text-gold border-gold/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                Todos ({(metrics?.feedbacks || []).length})
              </button>
              <button
                onClick={() => setFeedbackFilter('suggestion')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  feedbackFilter === 'suggestion'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                💡 Sugestões
              </button>
              <button
                onClick={() => setFeedbackFilter('bug')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  feedbackFilter === 'bug'
                    ? 'bg-danger/20 text-danger border-danger/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                🐛 Bugs
              </button>
              <button
                onClick={() => setFeedbackFilter('praise')}
                className={`text-[10.5px] font-mono px-2.5 py-1 rounded-md border ${
                  feedbackFilter === 'praise'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
                    : 'bg-surface2 text-muted border-line hover:text-ink'
                }`}
              >
                ⭐ Elogios
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-muted rounded-xl bg-surface border border-line">
                Nenhuma mensagem nesta categoria até o momento.
              </div>
            ) : (
              filteredFeedbacks.map((fb, idx) => (
                <div key={fb.id || idx} className="p-4 rounded-xl border border-line bg-surface space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`font-bold text-[10.5px] font-mono uppercase px-2 py-0.5 rounded border ${
                      fb.category === 'bug'
                        ? 'bg-danger/15 text-danger border-danger/30'
                        : fb.category === 'suggestion'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : fb.category === 'praise'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-gold/15 text-gold border-gold/30'
                    }`}>
                      {fb.category === 'bug' ? '🐛 BUG' : fb.category === 'suggestion' ? '💡 SUGESTÃO' : fb.category === 'praise' ? '⭐ ELOGIO' : '⚔️ USABILIDADE'}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      {new Date(fb.createdAt).toLocaleString('pt-BR')} · {fb.appVersion}
                    </span>
                  </div>

                  <p className="text-ink leading-relaxed font-sans text-xs bg-surface2/60 p-3 rounded-lg border border-line">
                    {fb.message}
                  </p>

                  {fb.contact && (
                    <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between gap-1.5 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} />
                        <span>Contato informado:</span>
                        <strong className="text-emerald-300">{fb.contact}</strong>
                      </div>
                      {!fb.reply && replyingFbId !== fb.id && (
                        <button
                          type="button"
                          onClick={() => {
                            AF.click();
                            setReplyingFbId(fb.id);
                            setReplyContent('');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold text-[10.5px] font-bold font-mono transition-all cursor-pointer"
                        >
                          <Send size={11} />
                          <span>RESPONDER GUERREIRO</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Resposta já enviada pelo dono */}
                  {fb.reply && (
                    <div className="mt-2.5 p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-300 font-bold border-b border-amber-800/40 pb-1">
                        <span className="flex items-center gap-1.5">
                          <Crown size={12} className="text-gold" />
                          <span>Sua Resposta Oficial (Decreto do Criador):</span>
                        </span>
                        <span className="text-[9.5px] text-muted">
                          {new Date(fb.reply.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-amber-100 font-sans text-xs leading-relaxed">
                        {fb.reply.text}
                      </p>
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            AF.click();
                            setReplyingFbId(fb.id);
                            setReplyContent(fb.reply.text);
                          }}
                          className="text-[10px] text-amber-400/90 underline font-mono hover:text-amber-200"
                        >
                          Editar ou enviar nova resposta
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Formulário de Resposta Aberto */}
                  {replyingFbId === fb.id && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-surface2 border-2 border-gold/50 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs font-mono text-gold font-bold">
                        <span className="flex items-center gap-1.5">
                          <Crown size={13} />
                          <span>DECRETAR RESPOSTA PARA: {fb.contact || 'GUERREIRO'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setReplyingFbId(null)}
                          className="text-muted hover:text-ink text-xs"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Botões de respostas rápidas */}
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => setReplyContent('⚔️ Honra máxima pela disciplina, guerreiro! Continue firme na guarda. O Comando está com você.')}
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted hover:text-gold hover:border-gold/40"
                        >
                          + Honra & Disciplina
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyContent('🛠️ Relato de bug recebido! Nossa equipe tática já está corrigindo e subindo a atualização.')}
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted hover:text-danger hover:border-danger/40"
                        >
                          + Bug em Correção
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyContent('💡 Excelente sugestão, guerreiro! Já incluímos no mapa de guerra para as próximas atualizações da Forja.')}
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted hover:text-sky-400 hover:border-sky-400/40"
                        >
                          + Sugestão Aprovada
                        </button>
                      </div>

                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Digite o decreto de resposta que aparecerá na tela do guerreiro..."
                        rows={3}
                        className="w-full p-2.5 rounded-lg bg-surface border border-line text-ink font-sans text-xs placeholder:text-muted focus:border-gold focus:outline-none"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-muted">
                          O guerreiro receberá notificação visual com som triunfal no app.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingFbId(null)}
                            className="px-3 py-1.5 rounded-lg border border-line text-muted hover:text-ink text-xs font-mono"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            disabled={replySending || !replyContent.trim()}
                            onClick={() => handleSendReply(fb)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold hover:bg-gold2 text-black font-display font-black text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                          >
                            <Send size={12} />
                            <span>{replySending ? 'Enviando...' : 'ENVIAR DECRETO'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ABA 4: SAÚDE DA INFRAESTRUTURA & CONFIGURAÇÕES DE SERVIDOR */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-line space-y-4">
            <h3 className="font-display font-bold text-sm text-gold flex items-center gap-2 border-b border-line pb-2.5">
              <Database size={16} /> STATUS DOS SERVIÇOS & INTEGRAÇÕES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              {/* Supabase */}
              <div className="p-3.5 rounded-lg bg-surface2 border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Database size={14} className="text-emerald-400" /> Supabase (Banco & Auth)
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    server.supabaseStatus === 'connected' ? 'bg-ok/15 text-ok' : 'bg-danger/15 text-danger'
                  }`}>
                    {server.supabaseStatus === 'connected' ? 'CONECTADO' : 'PENDENTE'}
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Armazena os perfis dos guerreiros (tabela <code>warrior_profiles</code>) e autentica login Google/E-mail.
                </p>
              </div>

              {/* Stripe */}
              <div className="p-3.5 rounded-lg bg-surface2 border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CreditCard size={14} className="text-gold" /> Stripe (Pagamentos & Paywall)
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    server.stripeConfigured ? 'bg-ok/15 text-ok' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {server.stripeConfigured ? 'CONFIGURADO' : 'CHAVE PENDENTE'}
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  {server.stripeConfigured
                    ? 'Chave secreta configurada. Preço BRL: ' + (server.stripePrices?.brl ? 'OK' : 'Pendente')
                    : 'Variável STRIPE_SECRET_KEY não preenchida na Vercel.'}
                </p>
              </div>

              {/* Webhook Discord/Telegram */}
              <div className="p-3.5 rounded-lg bg-surface2 border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Webhook size={14} className="text-sky-400" /> Webhook de Alerta no Celular
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    server.webhookConfigured ? 'bg-ok/15 text-ok' : 'bg-muted/20 text-muted'
                  }`}>
                    {server.webhookConfigured ? 'ATIVO' : 'OPCIONAL'}
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Dispara notificações instantâneas no seu Discord ou Telegram quando alguém envia um feedback.
                </p>
              </div>

              {/* Versão Atual */}
              <div className="p-3.5 rounded-lg bg-surface2 border border-line space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-gold" /> Versão em Produção
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold/15 text-gold border border-gold/30">
                    {server.version || 'v1.5.2'}
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Construção otimizada Next.js rodando nos servidores globais da Vercel.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE INSPEÇÃO DETALHADA DO GUERREIRO */}
      {selectedWarrior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-surface border border-gold/40 rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col text-ink">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedWarrior.tierIcon}</span>
                <div>
                  <h3 className="font-display font-bold text-base text-gold">
                    FICHA DE COMBATE DO GUERREIRO
                  </h3>
                  <p className="text-[11px] text-muted font-mono">{selectedWarrior.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWarrior(null)}
                className="p-1 rounded-lg border border-line text-muted hover:text-ink hover:border-gold/40"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-surface2 border border-line">
                  <span className="text-muted block text-[10px]">DIAS DE VIGÍLIA</span>
                  <b className="text-gold text-base">{selectedWarrior.days} dias</b>
                </div>
                <div className="p-2.5 rounded bg-surface2 border border-line">
                  <span className="text-muted block text-[10px]">STREAK DE CHECK-IN</span>
                  <b className="text-amber-400 text-base">🔥 {selectedWarrior.streak} dias</b>
                </div>
                <div className="p-2.5 rounded bg-surface2 border border-line">
                  <span className="text-muted block text-[10px]">PATENTE MILITAR</span>
                  <b className="text-ink text-sm">{selectedWarrior.tierName}</b>
                </div>
                <div className="p-2.5 rounded bg-surface2 border border-line">
                  <span className="text-muted block text-[10px]">NÍVEL DE PUREZA</span>
                  <b className="text-gold text-sm">💎 {selectedWarrior.purity}%</b>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface2 border border-line space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">Status da Assinatura:</span>
                  <strong className="text-ink uppercase">{selectedWarrior.subStatus}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Modo de Vida:</span>
                  <strong className="text-ink">
                    {selectedWarrior.lifeStatus === 'committedA'
                      ? 'Casado (Modo A)'
                      : selectedWarrior.lifeStatus === 'committedB'
                      ? 'Casado (Modo B)'
                      : 'Solteiro'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Hábitos da Forja Ativos:</span>
                  <strong className="text-gold">{selectedWarrior.activeHabitsCount || 0} hábitos</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Missões Cadastradas:</span>
                  <strong className="text-gold">{selectedWarrior.tasksCount || 0} tarefas</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Resgates S.O.S Vencidos:</span>
                  <strong className="text-emerald-400">{selectedWarrior.sosCount || 0} vezes</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Último Acesso / Sync:</span>
                  <strong className="text-muted">
                    {selectedWarrior.lastActive ? new Date(selectedWarrior.lastActive).toLocaleString('pt-BR') : '—'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex justify-end">
              <button
                onClick={() => setSelectedWarrior(null)}
                className="px-4 py-1.5 rounded-lg border border-line bg-surface2 text-ink font-bold hover:border-gold/40 text-xs font-mono"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
