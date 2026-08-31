import React from "react";

/**
 * Without this, any render error white-screens the entire app — there was no
 * boundary anywhere in the tree.
 *
 * Kept as a class because React has no hook equivalent for componentDidCatch.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Until Sentry lands (B37), the console is the only sink we have — but at
    // least the user now sees something they can act on.
    console.error("Unhandled render error:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
        <div className="w-full max-w-md rounded border border-line bg-surface p-6">
          <h1 className="text-title text-ink">This page didn&rsquo;t load</h1>
          <p className="mt-2 text-body text-ink-faint">
            Something broke while rendering. Your data is safe &mdash; nothing was saved or
            changed.
          </p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex h-10 items-center justify-center rounded border border-ink bg-ink px-4 text-body font-medium text-white transition-colors hover:bg-black"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center rounded border border-line-strong bg-surface px-4 text-body font-medium text-ink transition-colors hover:bg-surface-raised"
            >
              Go to home
            </a>
          </div>

          {import.meta.env.DEV && (
            <pre className="mt-5 max-h-48 overflow-auto rounded border border-line bg-surface-raised p-3 text-label text-ink-muted">
              {String(this.state.error?.stack ?? this.state.error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
