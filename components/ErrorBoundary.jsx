'use client';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 my-4 mx-auto max-w-md rounded-xl bg-gradient-to-b from-[#18110b] to-[#0c0805] border border-amber-600/40 text-center text-amber-200 shadow-2xl">
          <p className="text-sm font-display tracking-wider text-gold font-bold mb-1">INTERFACE EM SINCRONIZAÇÃO</p>
          <p className="text-xs font-mono text-amber-300/80 mb-4 leading-relaxed">
            Ocorreu uma oscilação na interface da Forja. Clique abaixo para restabelecer o painel.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-gold text-[#121214] hover:bg-gold2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              🔄 Restabelecer Painel
            </button>
          </div>
          {this.state.error && (
            <details className="mt-3 text-left">
              <summary className="text-[10px] font-mono text-amber-500/70 cursor-pointer hover:text-amber-400">
                Ver detalhes técnicos
              </summary>
              <pre className="mt-1 p-2 bg-black/60 rounded text-[9px] font-mono text-red-300 overflow-x-auto max-h-32 whitespace-pre-wrap">
                {String(this.state.error.message || this.state.error)}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
