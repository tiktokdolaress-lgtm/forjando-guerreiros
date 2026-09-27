'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { cx } from '@/lib/content-i18n';

export default function PricingSection({ lang = 'pt' }) {
  const [regionData, setRegionData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' | 'yearly'
  const L = (id, fb) => cx(lang, 'land', id) || fb;

  useEffect(() => {
    let alive = true;
    fetch('/api/region-price')
      .then((r) => r.json())
      .then((d) => { if (alive && d) setRegionData(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const isUSD = regionData?.currency === 'USD';
  const mPrice = regionData?.amount || (isUSD ? '$9.90' : 'R$ 9,90');
  const yPrice = regionData?.amountYearly || (isUSD ? '$87.00' : 'R$ 87,00');
  const yPerM = regionData?.yearlyPerMonth || (isUSD ? '$7.25' : 'R$ 7,25');

  const BENEFICIOS = [
    L('pr_f1', 'Todos os módulos desbloqueados'),
    L('pr_f2', 'Sincronização celular + PC em tempo real'),
    L('pr_f3', 'Protocolo S.O.S ilimitado'),
    L('pr_f4', 'Relatórios e histórico completos'),
    L('pr_f6', 'Pacto de Batalhas & Parceria entre Guerreiros'),
    L('pr_f5', 'Cancelamento em 1 clique, sem multa'),
  ];

  return (
    <section className="border-y border-line bg-surface2/40 px-5 py-16 text-center">
      <h2 className="font-display text-3xl sm:text-4xl tracking-wide">{L('pr_title', 'UM PREÇO DE CAFÉ. UMA GUERRA INTEIRA.')}</h2>
      <p className="mx-auto mt-2 max-w-xl text-[13.5px] text-muted">
        {L('pr_sub', 'Experimente por 7 dias grátis. Escolha o plano que melhor se adapta à sua jornada:')}
      </p>

      {/* SELETOR DE PLANO (MENSAL vs ANUAL) */}
      <div className="mx-auto mt-7 flex max-w-xs items-center justify-center rounded-xl border border-line bg-surface p-1">
        <button
          type="button"
          onClick={() => setSelectedPlan('monthly')}
          className={`flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            selectedPlan === 'monthly'
              ? 'bg-gold text-bg shadow'
              : 'text-muted hover:text-ink'
          }`}
        >
          {lang === 'en' ? 'Monthly' : lang === 'es' ? 'Mensual' : 'Mensal'}
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlan('yearly')}
          className={`relative flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            selectedPlan === 'yearly'
              ? 'bg-gold text-bg shadow'
              : 'text-muted hover:text-ink'
          }`}
        >
          {lang === 'en' ? 'Annual Plan' : lang === 'es' ? 'Plan Anual' : 'Plano Anual'}
          <span className="absolute -top-2.5 -right-1 rounded-full bg-emerald-500 text-bg px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-tight">
            -27%
          </span>
        </button>
      </div>

      <div className="mx-auto mt-8 max-w-md rounded-2xl border-2 border-gold/50 bg-surface p-7 shadow-glow relative overflow-hidden">
        {selectedPlan === 'yearly' && (
          <div className="absolute top-0 right-0 bg-gold text-bg text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1">
            <Sparkles size={12} /> {lang === 'en' ? 'BEST VALUE' : lang === 'es' ? 'MÁS POPULAR' : 'MAIS VANTAJOSO'}
          </div>
        )}

        <p className="k2 mb-1 text-gold2">{L('pr_k', 'ACESSO COMPLETO')}</p>
        <p className="font-display text-5xl text-gold">{L('pr_days', '7 dias')}</p>
        
        {selectedPlan === 'monthly' ? (
          <p className="mb-5 text-[14px] text-muted">
            {L('pr_free', 'grátis · depois')}{' '}
            <b className="text-gold text-lg">{mPrice}</b>
            <span className="text-xs">{lang === 'en' ? '/month' : lang === 'es' ? '/mes' : '/mês'}</span>
          </p>
        ) : (
          <p className="mb-5 text-[14px] text-muted">
            {L('pr_free', 'grátis · depois')}{' '}
            <b className="text-gold text-lg">{yPrice}</b>
            <span className="text-xs">{lang === 'en' ? '/year' : lang === 'es' ? '/año' : '/ano'}</span>
            <span className="block text-xs text-gold/90 mt-1 font-semibold">
              (~{yPerM}{lang === 'en' ? '/month — save 27%' : lang === 'es' ? '/mes — ahorra 27%' : '/mês — economize 27%'})
            </span>
          </p>
        )}

        <ul className="mb-6 space-y-2.5 text-left text-[12.5px] font-semibold border-t border-b border-line py-4">
          {BENEFICIOS.map((x) => (
            <li key={x} className="flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-none text-emerald-400" />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        <Link href="/app" className="btn-gold btn-big w-full block text-center">
          {L('pr_cta', '⚔️ INICIAR MEU TESTE GRÁTIS')}
        </Link>
        <p className="fnote mt-3">
          <Lock size={12} className="mr-1 inline text-muted" />
          {L('pr_pay', 'Pagamento processado pela Stripe. O app nunca vê seu cartão.')}
        </p>
      </div>
    </section>
  );
}
