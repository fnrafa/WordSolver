const ASCII_A = 'a'.charCodeAt(0)
export const MIN_WORD_LENGTH = 2

export function normalizeLetters(input: string): string {
  return (input.toLowerCase().match(/[a-z]/g) ?? []).join('')
}

export function toLetterCounts(value: string): number[] {
  const counts = new Array<number>(26).fill(0)

  for (const letter of value) {
    counts[letter.charCodeAt(0) - ASCII_A] += 1
  }

  return counts
}

export function canBuildWord(word: string, availableCounts: number[]): boolean {
  const remaining = availableCounts.slice()

  for (const letter of word) {
    const index = letter.charCodeAt(0) - ASCII_A

    if (remaining[index] === 0) {
      return false
    }

    remaining[index] -= 1
  }

  return true
}

export function solveWords(letters: string, dictionary: string[]): string[] {
  const normalizedLetters = normalizeLetters(letters)

  if (normalizedLetters.length < MIN_WORD_LENGTH) {
    return []
  }

  const availableCounts = toLetterCounts(normalizedLetters)

  return dictionary
    .filter(
      (word) =>
        word.length >= MIN_WORD_LENGTH &&
        word.length <= normalizedLetters.length &&
        canBuildWord(word, availableCounts),
    )
    .sort((left, right) => {
      if (right.length !== left.length) {
        return right.length - left.length
      }

      return left.localeCompare(right)
    })
}

export function groupWordsByLength(words: string[]): Array<[number, string[]]> {
  const groupedWords = new Map<number, string[]>()

  for (const word of words) {
    const existingWords = groupedWords.get(word.length)

    if (existingWords) {
      existingWords.push(word)
      continue
    }

    groupedWords.set(word.length, [word])
  }

  return [...groupedWords.entries()].sort((left, right) => right[0] - left[0])
}
