type StatusBarProps = {
  dictionarySize: number
  normalizedLetters: string
  statusText: string
  statusLabel: string
  lettersLabel: string
  dictionaryLabel: string
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1 truncate">
      <span className="shrink-0 text-[10px] uppercase tracking-[0.08em] text-zinc-600">{label}:</span>
      <span className="truncate text-xs text-zinc-400">{value}</span>
    </div>
  )
}

export function StatusBar({
  dictionarySize,
  normalizedLetters,
  statusText,
  statusLabel,
  lettersLabel,
  dictionaryLabel,
}: StatusBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-zinc-800 bg-zinc-950 px-4 py-2 sm:px-6">
      <StatusItem label={statusLabel} value={statusText} />
      <StatusItem
        label={lettersLabel}
        value={normalizedLetters.length > 0 ? normalizedLetters.toUpperCase() : '-'}
      />
      <StatusItem label={dictionaryLabel} value={dictionarySize.toLocaleString()} />
    </section>
  )
}
