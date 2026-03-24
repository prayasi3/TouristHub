export function LoadingState({ label = "Loading" }) {
  return (
    <div className="surface-card flex min-h-48 items-center justify-center text-sm font-medium text-ink-900/60">
      {label}...
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, action }) {
  return (
    <div className="surface-card text-center">
      <p className="text-lg font-semibold text-ink-950">{title}</p>
      {message ? <p className="mt-2 text-sm text-ink-900/60">{message}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="surface-card text-center">
      <p className="text-lg font-semibold text-ink-950">{title}</p>
      <p className="mt-2 text-sm text-ink-900/60">{message}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
