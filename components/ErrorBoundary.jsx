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
        <div className="p-4 my-2 rounded-xl bg-gradient-to-b from-[#18110b] to-[#0c0805] border border-amber-600/40 text-center text-amber-200 shadow-lg">
          <p className="text-xs font-mono text-amber-300/80 mb-2">Interface em sincronização com a Forja.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-1.5 text-xs font-mono font-bold uppercase rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500 text-amber-200 transition-all"
          >
            Sincronizar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
