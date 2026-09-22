'use client';
import React, { useState } from 'react';
import { Scroll, Sparkles, X, ChevronDown, ChevronUp, Check, ShieldCheck, Flame } from 'lucide-react';
import { CURRENT_APP_VERSION, CHANGELOG_RELEASES, markUpdatesAsRead } from '@/lib/changelog';
import { AF } from '@/lib/audio';

export default function ChangelogModal({ onClose }) {
  const [showAll, setShowAll] = useState(false);

  const handleClose = () => {
    try { AF.click(); } catch (e) {}
    markUpdatesAsRead();
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const latestRelease = CHANGELOG_RELEASES[0];
  const previousReleases = CHANGELOG_RELEASES.slice(1);

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#090604] border-2 border-amber-600/60 p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-ink overflow-hidden max-h-[85vh] flex flex-col">
      {/* Brilho Superior da Forja */}
      <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 h-28 w-80 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.22)_0%,transparent_75%)]" />

      {/* CABEÇALHO */}
      <div className="relative z-10 flex items-start justify-between gap-3 pb-3 border-b border-amber-900/40 flex-none">
        <div className="flex items-center gap-2.5">
          <div className="flex-none p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 shadow">
            <Scroll size={22} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-lg sm:text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 font-black">
                DECRETOS DA FORJA
              </span>
              <span className="rounded-full border border-gold/50 bg-gold/15 px-2 py-0.5 text-[10px] font-mono text-gold font-extrabold uppercase shadow-sm">
                {CURRENT_APP_VERSION}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-amber-200/70 mt-0.5">
              Suas conquistas e dias estão intactos. Veja as melhorias ativas:
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar"
          className="flex-none p-1.5 rounded-lg border border-line bg-surface2 text-muted hover:text-ink hover:border-gold/40 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* CORPO COM ROLAGEM */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 my-3 space-y-4 text-left">
        {/* ÚLTIMA ATUALIZAÇÃO EM DESTAQUE */}
        {latestRelease && (
          <div className="rounded-xl border border-amber-600/40 bg-black/40 p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400 flex-none animate-pulse" />
                <span className="font-display text-sm sm:text-base font-bold text-amber-200">
                  {latestRelease.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                {latestRelease.date}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 mt-3">
              {latestRelease.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-surface2/60 border border-line/60"
                >
                  <span className="text-base sm:text-lg flex-none mt-0.5">{h.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-[13px] font-bold text-amber-100 flex items-center gap-1">
                      {h.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted leading-relaxed mt-0.5">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERSÕES ANTERIORES (EXPANSÍVEL) */}
        {previousReleases.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => {
                try { AF.click(); } catch (e) {}
                setShowAll(!showAll);
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg border border-line/60 bg-surface2/40 text-xs font-mono text-muted hover:text-ink hover:border-gold/30 transition-all cursor-pointer"
            >
              <span>📜 Histórico de Decretos Anteriores</span>
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showAll && (
              <div className="mt-2.5 space-y-3 pl-1">
                {previousReleases.map((rel) => (
                  <div key={rel.version} className="p-3 rounded-lg border border-line/40 bg-surface/30">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-amber-300/90">{rel.version} - {rel.title}</span>
                      <span className="text-[10px] font-mono text-muted">{rel.date}</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-muted">
                      {rel.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-xs">{item.icon}</span>
                          <span><strong className="text-ink">{item.title}:</strong> {item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTA DE SEGURANÇA E ASSINATURA */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-[11px] font-mono">
          <ShieldCheck size={16} className="text-emerald-400 flex-none" />
          <span>
            Atualizações não afetam sua assinatura ou registros. Seu progresso é gravado e protegido.
          </span>
        </div>
      </div>

      {/* BOTÃO FINAL */}
      <div className="relative z-10 pt-2 border-t border-amber-900/30 flex-none">
        <button
          type="button"
          onClick={handleClose}
          className="w-full btn-gold py-2.5 sm:py-3 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
        >
          <Flame size={16} className="text-amber-900" />
          <span>ENTENDIDO, AVANTE!</span>
        </button>
      </div>
    </div>
  );
}
