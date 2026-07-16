import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CapiMercado Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] p-6 text-center">
          <div className="max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h1 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Algo salió mal</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Hemos detectado un problema al cargar esta sección. Por favor, intenta recargar la página.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#050505] dark:bg-white dark:text-[#050505] text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              Recargar CapiMercado
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
