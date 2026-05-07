import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { FieldLabel } from './ui'
import type { GenerationParams } from '../lib/api'

const DEFAULT_PARAMS: GenerationParams = {
  seed: -1, temperature: 0.9, top_p: 1.0, top_k: 50, repetition_penalty: 1.05, max_new_tokens: 2048,
}

export function useParams() { return useState<GenerationParams>(DEFAULT_PARAMS) }

interface SliderRowProps {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; tooltip?: string
}

function SliderRow({ label, value, min, max, step, onChange, tooltip }: SliderRowProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <FieldLabel tooltip={tooltip}>{label}</FieldLabel>
        <span className="font-mono text-xs text-q-accent mb-1.5">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  )
}

export function AdvancedParams({ params, onChange }: { params: GenerationParams; onChange: (p: GenerationParams) => void }) {
  const [open, setOpen] = useState(false)
  function set<K extends keyof GenerationParams>(key: K, val: GenerationParams[K]) { onChange({ ...params, [key]: val }) }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-q-text3 hover:text-q-text2 transition-colors"
      >
        <ChevronDown size={14} className={clsx('transition-transform duration-200', open && 'rotate-180')} />
        Advanced Parameters
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-q-bg0 rounded-xl border border-q-border-soft">
          <div>
            <FieldLabel tooltip="−1 = random each run. Fix a value to get reproducible results.">Seed</FieldLabel>
            <input
              type="number"
              value={params.seed}
              onChange={e => set('seed', Number(e.target.value))}
              className="w-full bg-q-bg2 border border-q-border rounded-lg px-3 py-2 text-q-text text-sm font-mono focus:outline-none focus:border-q-accent focus:ring-2 focus:ring-q-accent/20 transition-colors"
            />
          </div>
          <SliderRow label="Temperature"        value={params.temperature}        min={0.01} max={2}    step={0.01} onChange={v => set('temperature', v)}        tooltip="Higher = more expressive and varied. Lower = flatter, more consistent." />
          <SliderRow label="Top-P"              value={params.top_p}              min={0}    max={1}    step={0.01} onChange={v => set('top_p', v)}              tooltip="Nucleus sampling: only tokens in the top-P probability mass are sampled." />
          <SliderRow label="Top-K"              value={params.top_k}              min={1}    max={200}  step={1}    onChange={v => set('top_k', v)}              tooltip="Limits sampling to the K most probable tokens at each step." />
          <SliderRow label="Repetition Penalty" value={params.repetition_penalty} min={1}    max={2}    step={0.01} onChange={v => set('repetition_penalty', v)} tooltip="Reduces repeated audio artefacts. 1.05 is a safe default." />
          <SliderRow label="Max New Tokens"     value={params.max_new_tokens}     min={256}  max={8192} step={256}  onChange={v => set('max_new_tokens', v)}     tooltip="Maximum audio tokens to generate. ~2048 ≈ 30 seconds of speech." />
        </div>
      )}
    </div>
  )
}
