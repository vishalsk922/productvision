import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL Error Boundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-8 bg-slate-950/90 border border-slate-800 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-600/40 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white">3D Canvas Encountered an Issue</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-md">
            WebGL acceleration may be limited or restarting. Click below to re-initialize the 3D viewport.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload 3D Canvas</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
