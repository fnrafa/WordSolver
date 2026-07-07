import { useEffect, useMemo, useState } from 'react'

import { LanguageSwitch } from '@/components/LanguageSwitch'
import { ResultsPanel } from '@/components/ResultsPanel'
import { SolverInput } from '@/components/SolverInput'
import { StatusBar } from '@/components/StatusBar'
import {
  groupWordsByLength,
  MIN_WORD_LENGTH,
  normalizeLetters,
  solveWords,
} from '@/lib/solver'

type LanguageCode = 'en' | 'id'

const DEFAULT_INPUT = 'bkear'
const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Indonesia', value: 'id' },
] as const

const LANGUAGE_CONFIG: Record<
  LanguageCode,
  {
    dictionaryPath: string
    appName: string
    languageLabel: string
    inputTitle: string
    inputHelperText: string
    clearLabel: string
    statusLabel: string
    lettersLabel: string
    dictionaryLabel: string
    loadingDictionaryText: string
    preparingResultsText: string
    minimumLettersText: (minimumLength: number) => string
    resultCountText: (count: number) => string
    emptyInputText: string
    emptyResultsText: string
    lengthLabel: string
    wordsLabel: string
    lengthUnitLabel: string
    loadErrorText: string
  }
> = {
  en: {
    dictionaryPath: '/dictionary-en.txt',
    appName: 'Word Solver',
    languageLabel: 'Language',
    inputTitle: 'Letters',
    inputHelperText: 'Enter up to',
    clearLabel: 'Clear',
    statusLabel: 'Status',
    lettersLabel: 'Letters',
    dictionaryLabel: 'Dictionary',
    loadingDictionaryText: 'Loading dictionary...',
    preparingResultsText: 'Preparing results...',
    minimumLettersText: (minimumLength) => `Enter at least ${minimumLength} letters`,
    resultCountText: (count) => `${count} words`,
    emptyInputText: 'Type letters to start.',
    emptyResultsText: 'No words found.',
    lengthLabel: 'Length',
    wordsLabel: 'Words',
    lengthUnitLabel: 'letters',
    loadErrorText: 'Failed to load dictionary.',
  },
  id: {
    dictionaryPath: '/dictionary-id.txt',
    appName: 'Word Solver',
    languageLabel: 'Bahasa',
    inputTitle: 'Huruf',
    inputHelperText: 'Masukkan hingga',
    clearLabel: 'Hapus',
    statusLabel: 'Status',
    lettersLabel: 'Huruf',
    dictionaryLabel: 'Kamus',
    loadingDictionaryText: 'Memuat kamus...',
    preparingResultsText: 'Menyiapkan hasil...',
    minimumLettersText: (minimumLength) => `Masukkan minimal ${minimumLength} huruf`,
    resultCountText: (count) => `${count} kata`,
    emptyInputText: 'Masukkan huruf untuk mulai.',
    emptyResultsText: 'Tidak ada kata yang ditemukan.',
    lengthLabel: 'Panjang',
    wordsLabel: 'Kata',
    lengthUnitLabel: 'huruf',
    loadErrorText: 'Gagal memuat kamus.',
  },
}

function App() {
  const [language, setLanguage] = useState<LanguageCode>('en')
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [dictionary, setDictionary] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const languageConfig = LANGUAGE_CONFIG[language]

  useEffect(() => {
    let isMounted = true

    async function loadDictionary() {
      try {
        setIsLoading(true)
        setLoadError('')

        const response = await fetch(languageConfig.dictionaryPath)

        if (!response.ok) {
          throw new Error(`Failed to load dictionary: ${response.status}`)
        }

        const text = await response.text()
        const words = text
          .split(/\r?\n/)
          .map((word) => word.trim().toLowerCase())
          .filter((word) => word.length >= MIN_WORD_LENGTH && /^[a-z]+$/.test(word))

        if (isMounted) {
          setDictionary(words)
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error ? error.message : languageConfig.loadErrorText,
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDictionary()

    return () => {
      isMounted = false
    }
  }, [languageConfig.dictionaryPath, languageConfig.loadErrorText])

  const normalizedLetters = useMemo(() => normalizeLetters(input), [input])
  const words = useMemo(
    () => solveWords(normalizedLetters, dictionary),
    [dictionary, normalizedLetters],
  )
  const groupedWords = useMemo(() => groupWordsByLength(words), [words])
  const hasEnoughLetters = normalizedLetters.length >= MIN_WORD_LENGTH
  const statusText = loadError
    ? loadError
    : isLoading
      ? languageConfig.loadingDictionaryText
      : hasEnoughLetters
        ? languageConfig.resultCountText(words.length)
        : languageConfig.minimumLettersText(MIN_WORD_LENGTH)

  return (
    <main className="flex h-screen min-h-screen w-full flex-col overflow-hidden bg-zinc-950 text-zinc-200">
      <header className="sticky top-0 z-10 shrink-0">
        <div className="border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
                {languageConfig.appName}
              </h1>
            </div>
            <LanguageSwitch
              currentValue={language}
              onChange={(value) => setLanguage(value as LanguageCode)}
              options={[...LANGUAGE_OPTIONS]}
              label={languageConfig.languageLabel}
            />
          </div>
          <SolverInput
            value={input}
            onChange={setInput}
            title={languageConfig.inputTitle}
            helperText={languageConfig.inputHelperText}
            clearLabel={languageConfig.clearLabel}
          />
        </div>
        <StatusBar
          dictionarySize={dictionary.length}
          normalizedLetters={normalizedLetters}
          statusText={statusText}
          statusLabel={languageConfig.statusLabel}
          lettersLabel={languageConfig.lettersLabel}
          dictionaryLabel={languageConfig.dictionaryLabel}
        />
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto">
        <ResultsPanel
          groups={groupedWords}
          isLoading={isLoading}
          loadError={loadError}
          hasEnoughLetters={hasEnoughLetters}
          loadingText={languageConfig.preparingResultsText}
          emptyInputText={languageConfig.emptyInputText}
          emptyResultsText={languageConfig.emptyResultsText}
          lengthLabel={languageConfig.lengthLabel}
          wordsLabel={languageConfig.wordsLabel}
          lengthUnitLabel={languageConfig.lengthUnitLabel}
        />
      </section>
    </main>
  )
}

export default App
