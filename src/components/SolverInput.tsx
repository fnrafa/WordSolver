import { useMemo, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

import { normalizeLetters } from '@/lib/solver'

const MAX_LETTERS = 12

type SolverInputProps = {
  value: string
  onChange: (value: string) => void
  title: string
  helperText: string
  clearLabel: string
}

function toSlots(value: string): string[] {
  const normalized = normalizeLetters(value).slice(0, MAX_LETTERS)
  const slots = new Array<string>(MAX_LETTERS).fill('')

  for (const [index, letter] of [...normalized].entries()) {
    slots[index] = letter
  }

  return slots
}

export function SolverInput({
  value,
  onChange,
  title,
  helperText,
  clearLabel,
}: SolverInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const slots = useMemo(() => toSlots(value), [value])

  function focusIndex(index: number) {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  function updateSlots(nextSlots: string[]) {
    onChange(nextSlots.join(''))
  }

  function handleChange(index: number, nextValue: string) {
    const normalized = normalizeLetters(nextValue)
    const nextSlots = [...slots]

    if (normalized.length === 0) {
      nextSlots[index] = ''
      updateSlots(nextSlots)
      return
    }

    for (let offset = 0; offset < normalized.length; offset += 1) {
      const slotIndex = index + offset

      if (slotIndex >= MAX_LETTERS) {
        break
      }

      nextSlots[slotIndex] = normalized[offset]
    }

    updateSlots(nextSlots)
    focusIndex(Math.min(index + normalized.length, MAX_LETTERS - 1))
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && slots[index] === '' && index > 0) {
      event.preventDefault()
      const nextSlots = [...slots]
      nextSlots[index - 1] = ''
      updateSlots(nextSlots)
      focusIndex(index - 1)
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault()
      focusIndex(index - 1)
      return
    }

    if (event.key === 'ArrowRight' && index < MAX_LETTERS - 1) {
      event.preventDefault()
      focusIndex(index + 1)
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()

    const pasted = normalizeLetters(event.clipboardData.getData('text'))

    if (pasted.length === 0) {
      return
    }

    const nextSlots = [...slots]

    for (let offset = 0; offset < pasted.length; offset += 1) {
      const slotIndex = index + offset

      if (slotIndex >= MAX_LETTERS) {
        break
      }

      nextSlots[slotIndex] = pasted[offset]
    }

    updateSlots(nextSlots)
    focusIndex(Math.min(index + pasted.length, MAX_LETTERS - 1))
  }

  function clearAll() {
    onChange('')
    focusIndex(0)
  }

  return (
    <section className="border-b border-zinc-800 bg-zinc-950 px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">{title}</div>
          <div className="text-sm text-zinc-400">
            {helperText} {MAX_LETTERS}
          </div>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="border border-zinc-800 px-3 py-2 text-xs uppercase tracking-[0.08em] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          {clearLabel}
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
        {slots.map((letter, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={letter.toUpperCase()}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            aria-label={`Letter ${index + 1}`}
            className={[
              'aspect-square w-full border-2 text-center text-lg font-semibold uppercase transition-colors sm:text-xl',
              letter
                ? 'border-zinc-400 bg-zinc-900 text-zinc-50'
                : 'border-zinc-700 bg-zinc-950 text-zinc-100',
              'focus:border-zinc-200',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}
