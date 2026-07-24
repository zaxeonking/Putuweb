interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink-300">{icon}</div>}
      <p className="font-display text-lg font-semibold text-ink-700">{title}</p>
      {message && <p className="mt-1 max-w-sm text-sm text-ink-500">{message}</p>}
    </div>
  );
}
