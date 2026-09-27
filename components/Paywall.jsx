'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Crown, Flame, Siren, BookOpen, ChartNoAxesColumn, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import * as cloud from '@/lib/supabase';
import { AF } from '@/lib/audio';
import { cx } from '@/lib/content-i18n';
import WarriorLogo from './WarriorLogo';

/* i18n ETAPA 3a: portão de assinatura traduzido.
   Moeda continua decidida pelo país (regra anti-burla) — só a língua muda. */
export default function Paywall() {
  const { toast, auth, refreshSub, subChecking, S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = (id, fb) => cx(lang, 'pay', id) || fb;
  const [busy, setBusy] = useState(false);
  const [regionData, setRegionData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'yearly'

  React.useEffect(() => {
    let alive = true;
    fetch('/api/region-price')
      .then((r) => r.json())
      .then((d) => { if (alive && d) setRegionData(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const startTrial = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const sess = await cloud.getSession();
      if (!sess || !sess.access_token) throw new Error(T('err_session', 'Sessão expirada — entre novamente.'));
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sess.access_token },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || T('err_checkout', 'Falha ao iniciar o checkout.'));
      window.location.href = data.url;
    } catch (e) {
      toast('⚠ ' + (e.message || T('err_open', 'Erro ao abrir o checkout.')));
      setBusy(false);
    }
  };

  const BENEFITS = [
    [Flame, T('b1', 'QG completo: retenção, pureza e patamares de guerra')],
    [Siren, T('b2', 'Protocolo S.O.S de 5 minutos com respiração guiada')],
    [BookOpen, T('b3', 'Diário de Bordo, notas de campo e relatórios ilimitados')],
    [ChartNoAxesColumn, T('b4', 'Mapa de combate, consistência da Forja e histórico')],
    [Sparkles, T('b5', 'Sincronização em nuvem: PC, celular e tablet')],
  ];

  const mAmount = regionData?.amount || (regionData?.currency === 'USD' ? '$9.90' : 'R$ 9,90');
  const yAmount = regionData?.amountYearly || (regionData?.currency === 'USD' ? '$87.00' : 'R$ 87,00');
  const yPerM = regionData?.yearlyPerMonth || (regionData?.currency === 'USD' ? '$7.25' : 'R$ 7,25');

  return (
    <div className="grid min-h-dvh place-items-center p-5">
      <div className="w-full max-w-md rounded-r2 border border-gold/40 bg-surface p-7 text-center shadow-glow rise">
        <WarriorLogo size={68} glow={true} className="mx-auto mb-3" />
        <h1 className="font-display text-3xl tracking-wide">{T('h1', 'ENTRE PARA A FORJA')}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          {T('start', 'Seu acesso começa com')} <b className="text-gold">{T('free', '7 dias grátis')}</b>. {T('cancel', 'Cancele quando quiser.')}
        </p>

        {/* SELETOR DE PLANO (MENSAL vs ANUAL) */}
        <div className="my-4 grid grid-cols-2 gap-2 text-left">
          {/* Opção Mensal */}
          <button
            type="button"
            onClick={() => { AF.click(); setSelectedPlan('monthly'); }}
            className={`relative p-3 rounded-xl border transition-all text-left cursor-pointer ${
              selectedPlan === 'monthly'
                ? 'border-gold bg-gold/15 text-gold shadow-md'
                : 'border-line bg-surface2 text-muted hover:border-gold/40'
            }`}
          >
            <span className="block text-[11px] font-mono uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Monthly' : lang === 'es' ? 'Mensual' : 'Mensal'}
            </span>
            <b className="block text-sm font-bold text-ink mt-0.5">{mAmount}</b>
            <span className="text-[10px] text-muted block leading-tight">
              {lang === 'en' ? 'per month' : lang === 'es' ? 'por mes' : 'por mês'}
            </span>
          </button>

          {/* Opção Anual */}
          <button
            type="button"
            onClick={() => { AF.click(); setSelectedPlan('yearly'); }}
            className={`relative p-3 rounded-xl border transition-all text-left cursor-pointer ${
              selectedPlan === 'yearly'
                ? 'border-gold bg-gold/15 text-gold shadow-md'
                : 'border-line bg-surface2 text-muted hover:border-gold/40'
            }`}
          >
            <span className="absolute -top-2 right-2 bg-gold text-bg text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
              {lang === 'en' ? 'BEST VALUE' : lang === 'es' ? 'MÁS POPULAR' : 'ECONOMIZE 27%'}
            </span>
            <span className="block text-[11px] font-mono uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Annual Plan' : lang === 'es' ? 'Plan Anual' : 'Plano Anual'}
            </span>
            <b className="block text-sm font-bold text-ink mt-0.5">{yAmount}</b>
            <span className="text-[10px] text-gold font-semibold block leading-tight">
              (~{yPerM}/{lang === 'en' ? 'mo' : 'mês'})
            </span>
          </button>
        </div>

        <div className="mb-5 space-y-2.5 text-left">
          {BENEFITS.map(([Ic, txt], i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-r border border-line bg-surface2 p-2.5 text-[12.5px] font-semibold">
              <Ic size={16} className="flex-none text-gold" /> {txt}
            </div>
          ))}
        </div>
        <button className="btn-gold btn-big" disabled={busy || subChecking} onClick={() => { AF.click(); startTrial(); }}>
          {busy || subChecking ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {subChecking ? T('btn_check', 'CONFIRMANDO PAGAMENTO...') : T('btn', '🛡️ INICIAR MEUS 7 DIAS GRÁTIS')}
        </button>
        <p className="fnote">{T('foot1', 'Pagamento processado com segurança pela Stripe. Nenhum dado de cartão toca este aplicativo.')}</p>
        <p className="fnote" style={{ marginTop: 6 }}>{T('foot2', 'Conectado como:')} <b className="text-gold">{auth.email || '—'}</b></p>
      </div>
    </div>
  );
}
