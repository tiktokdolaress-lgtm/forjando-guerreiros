'use client';
import React, { useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function RootError({ error, reset }) {
  useEffect(() => {
    console.error('Root Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full bg-[#0D0D0E] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-[#140e0a] border border-amber-600/50 p-6 text-center flex flex-col items-center gap-4">
        <ShieldAlert size={40} className="text-amber-400" />
        <h2 className="font-display text-2xl font-black text-amber-200">FORJANDO GUERREIROS</h2>
        <p className="text-xs font-mono text-amber-200/70">
          Reiniciando a interface da forja para retomar o progresso.
        </p>
        <button
          onClick={() => {
            try {
              reset();
            } catch (e) {
              window.location.reload();
            }
          }}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <RefreshCw size={15} />
          <span>REINICIAR</span>
        </button>
      </div>
    </div>
  );
}
