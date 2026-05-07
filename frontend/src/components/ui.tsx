import { ReactNode } from 'react'
import clsx from 'clsx'
import { useSettings } from '../context/settings'

// ── Tooltip ──────────────────────────────────────────────────────────────────

export function Tip({ text, children }: { text: string; children: ReactNode }) {
  const { tooltips } = useSettings()
  if (!tooltips || !text) return <>{children}</>
  return (
    <span className="group relative inline-flex items-center gap-1.5 cursor-default">
      {children}
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-q-text3 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="absolute bottom-full left-0 mb-2 w-max max-w-xs px-3 py-2 bg-q-bg3 border border-q-border text-q-text2 text-xs rounded-xl shadow-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[100] leading-relaxed">
        {text}
      </span>
    </span>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

export function SectionHeader({ badge, title, desc }: { badge: string; title: string; desc?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-q-border-soft">
      <div className="w-5 h-5 rounded-full bg-q-accent/10 border border-q-accent/35 text-q-accent font-mono text-xxs font-semibold flex items-center justify-center flex-shrink-0">
        {badge}
      </div>
      <span className="text-xxs font-bold tracking-widest uppercase text-q-text2">{title}</span>
      {desc && <span className="ml-auto text-xxs italic text-q-text3">{desc}</span>}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-q-bg1 border border-q-border rounded-card p-5 mb-4', className)}>
      {children}
    </div>
  )
}

// ── Field label (with optional tooltip) ──────────────────────────────────────

export function FieldLabel({ children, tooltip }: { children: ReactNode; tooltip?: string }) {
  return (
    <label className="block mb-1.5">
      <Tip text={tooltip ?? ''}>
        <span className="text-xs font-semibold tracking-wider uppercase text-q-text2">{children}</span>
      </Tip>
    </label>
  )
}

// ── Form controls ─────────────────────────────────────────────────────────────

export function TextArea({
  value, onChange, placeholder, rows = 4, required, className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
  className?: string
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={clsx(
        'w-full bg-q-bg2 border border-q-border rounded-lg px-3 py-2.5 text-q-text text-sm placeholder-q-text3 resize-none focus:outline-none focus:border-q-accent focus:ring-2 focus:ring-q-accent/20 transition-colors',
        className,
      )}
    />
  )
}

export function SelectField({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-q-bg2 border border-q-border text-q-text text-sm rounded-lg px-3 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-q-accent focus:ring-2 focus:ring-q-accent/20 transition-colors"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-q-text3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

export function CheckboxField({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-150',
          checked ? 'bg-q-accent border-q-accent' : 'bg-q-bg2 border-q-border group-hover:border-q-accent/60',
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-q-text2 group-hover:text-q-text transition-colors">{label}</span>
    </label>
  )
}

// ── Generate button ───────────────────────────────────────────────────────────

export function GenerateButton({ loading, disabled, onClick }: { loading: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-q-accent text-black font-bold text-sm tracking-wide transition-all duration-150 hover:brightness-110 hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 shadow-[0_0_20px_rgba(14,219,207,0.15)]"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Generating…
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          Generate Speech
        </>
      )}
    </button>
  )
}

// ── Audio player ──────────────────────────────────────────────────────────────

export function AudioPlayer({ src }: { src: string }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold tracking-wider uppercase text-q-text2 mb-2">Output</p>
      <audio controls src={src} className="w-full rounded-xl" style={{ accentColor: 'var(--q-accent)' }} />
      <a
        href={src}
        download="qwen3-tts-output.wav"
        className="mt-2 flex items-center gap-1.5 text-xs text-q-text3 hover:text-q-accent transition-colors w-fit"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Download WAV
      </a>
    </div>
  )
}
