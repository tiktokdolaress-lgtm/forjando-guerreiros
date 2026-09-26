'use client';
import React, { useEffect } from 'react';
import { Crown, Check, ShieldCheck, Mail, Sparkles, X } from 'lucide-react';
import { AF } from '@/lib/audio';

export default function CommandReplyModal({ message, onClose }) {
  useEffect(() => {
    try {
      AF.victory();
    } catch (e) {}
  }, []);

  if (!message) return null;

  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-b from-[#18110b] via-[#100b07] to-[#080504] border-2 border-amber-500/70 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-ink animate-fadeIn">
      {/* Brilho solar celestial superior */}
      <div className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 h-36 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.35)_0%,transparent_75%)]" />

      {/* Cabeçalho */}
      <div className="relative z-10 flex items-start justify-between gap-3 border-b border-amber-900/50 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-md">
            <Crown size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300">
                COMANDO SUPREMO
              </span>
              <span className="text-[10px] font-mono text-muted">
                {new Date(message.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl text-gold tracking-wide mt-0.5">
              DECRETO DO COMANDO
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg border border-amber-900/40 text-muted hover:text-ink hover:border-amber-500/40 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 space-y-3.5 font-mono text-xs">
        {/* Mensagem original do guerreiro */}
        {message.originalMessage && (
          <div className="p-3 rounded-xl bg-surface2/70 border border-line text-muted">
            <span className="block text-[10px] uppercase font-bold text-muted/80 mb-1 flex items-center gap-1">
              <Mail size={11} /> Seu relato enviado:
            </span>
            <p className="italic text-ink/90 text-xs font-sans line-clamp-3">
              &ldquo;{message.originalMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Resposta Solene do General/Criador */}
        <div className="relative p-4 rounded-xl bg-gradient-to-b from-amber-950/40 to-black/60 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 border-b border-amber-800/40 pb-1.5">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>Resposta Direta do Criador da Forja:</span>
            </span>
            <span className="text-[10px] text-amber-400/80">Oficial</span>
          </div>

          <p className="text-sm font-sans leading-relaxed text-amber-100 whitespace-pre-wrap pt-1 font-medium">
            {message.replyText}
          </p>

          <div className="pt-2 text-right text-[10.5px] text-amber-300/80 font-bold italic">
            — Comando Supremo da Forja
          </div>
        </div>
      </div>

      {/* Botão de Honra / Fechamento */}
      <div className="relative z-10 pt-4 mt-2 flex justify-end">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Check size={16} />
          <span>HONRA RECEBIDA (CONTINUAR COMBATE)</span>
        </button>
      </div>
    </div>
  );
}
