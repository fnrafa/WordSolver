type ResultGroupProps = {
  length: number
  words: string[]
  lengthUnitLabel: string
}

export function ResultGroup({ length, words, lengthUnitLabel }: ResultGroupProps) {
  return (
    <section className="grid grid-cols-1 border-b border-zinc-900 px-4 py-3 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-4 sm:px-6">
      <div className="mb-2 text-[11px] uppercase tracking-[0.08em] text-zinc-500 sm:mb-0">
        {length} {lengthUnitLabel}
        <span className="ml-1 text-zinc-700">{words.length}</span>
      </div>
      <div className="break-words text-sm leading-7 text-zinc-200">{words.join(' ')}</div>
    </section>
  )
}
