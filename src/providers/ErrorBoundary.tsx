import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: (error: unknown, reset: () => void) => ReactNode }
type State = { hasError: boolean; error: unknown }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  componentDidCatch(error: unknown) {
    // Could log to monitoring here
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset)
      return (
        <div className="min-h-dvh flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold mb-2">Quelque chose s'est mal passé</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Une erreur imprévue est survenue.</p>
            <button onClick={this.reset} className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition">
              Réessayer
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


