'use client';
import React, { useEffect } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default function AppError({ error, reset }) {
  useEffect(() => {
    // Log do erro no console para diagnóstico
    console.error('App Error Boundary capturou:', error);
  }, [error]);

  const handleReset = () => {
    try {
      reset();
    } catch (e) {
      window.location.href = '/app';
    }
  };

  const handleHardReset = () => {
    try {
      // Limpa dados temporários que possam estar corrompidos sem apagar o progresso do guerreiro
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      window.location.href = '/app';
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#0D0D0E] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Luz ambiente de alerta */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-md w-full rounded-2xl bg-gradient-to-b from-[#18120d] via-[#100c08] to-[#0a0705] border-2 border-amber-600/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-center flex flex-col items-center gap-4">
        <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <ShieldAlert size={42} />
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
            A FORJA PRECISA REINICIAR
          </h2>
          <p className="text-xs font-mono text-amber-200/70">
            Uma oscilação de renderização ocorreu no dispositivo. Seu progresso, dias e check-ins continuam seguros.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full pt-2">
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 active:scale-[0.98] border border-amber-400 text-black font-display font-black text-sm tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            <span>RETOMAR O COMBATE</span>
          </button>

          <button
            onClick={handleHardReset}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 active:scale-[0.98] border border-amber-600/40 text-amber-200 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>RECARREGAR QG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
