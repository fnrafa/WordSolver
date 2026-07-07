import { ResultGroup } from '@/components/ResultGroup'

type ResultsPanelProps = {
  groups: Array<[number, string[]]>
  isLoading: boolean
  loadError: string
  hasEnoughLetters: boolean
  loadingText: string
  emptyInputText: string
  emptyResultsText: string
  lengthLabel: string
  wordsLabel: string
  lengthUnitLabel: string
}

export function ResultsPanel({
  groups,
  isLoading,
  loadError,
  hasEnoughLetters,
  loadingText,
  emptyInputText,
  emptyResultsText,
  lengthLabel,
  wordsLabel,
  lengthUnitLabel,
}: ResultsPanelProps) {
  if (loadError) {
    return <div className="px-4 py-6 text-sm text-red-400 sm:px-6">{loadError}</div>
  }

  if (isLoading) {
    return <div className="px-4 py-6 text-sm text-zinc-500 sm:px-6">{loadingText}</div>
  }

  if (!hasEnoughLetters) {
    return <div className="px-4 py-6 text-sm text-zinc-500 sm:px-6">{emptyInputText}</div>
  }

  if (groups.length === 0) {
    return <div className="px-4 py-6 text-sm text-zinc-500 sm:px-6">{emptyResultsText}</div>
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 border-b border-zinc-800 px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-zinc-600 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-4 sm:px-6">
        <div>{lengthLabel}</div>
        <div>{wordsLabel}</div>
      </div>
      {groups.map(([length, words]) => (
        <ResultGroup key={length} length={length} words={words} lengthUnitLabel={lengthUnitLabel} />
      ))}
    </div>
  )
}
