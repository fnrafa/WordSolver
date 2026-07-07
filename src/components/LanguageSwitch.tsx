type LanguageOption = {
  label: string
  value: string
}

type LanguageSwitchProps = {
  currentValue: string
  onChange: (value: string) => void
  options: LanguageOption[]
  label: string
}

export function LanguageSwitch({
  currentValue,
  onChange,
  options,
  label,
}: LanguageSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-switch" className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <select
          id="language-switch"
          value={currentValue}
          onChange={(event) => onChange(event.target.value)}
          className="language-select border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-9 text-sm text-zinc-200"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6.5L8 10L12 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  )
}
