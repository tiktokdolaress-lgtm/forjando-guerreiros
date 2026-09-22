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
        <div className="p-4 my-2 rounded-xl bg-amber-950/30 border border-amber-600/40 text-center text-amber-200">
          <p className="text-xs font-mono">Elemento temporariamente indisponível.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 text-[11px] font-bold uppercase rounded bg-amber-600/30 border border-amber-500 text-amber-300"
          >
            Recarregar componente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
