import { useState } from 'react'
import { Loader2, Cpu } from 'lucide-react'
import { loadModel, unloadModels } from '../lib/api'
import { SectionHeader, FieldLabel, SelectField } from './ui'

interface Props { onLoaded: (models: string[]) => void }

const MODEL_OPTIONS  = ['Base (Voice Clone)', 'CustomVoice', 'VoiceDesign']
const DEVICE_OPTIONS = ['auto', 'cuda:0', 'cpu']
const DTYPE_OPTIONS  = ['bf16', 'fp32']

export function ModelSetup({ onLoaded }: Props) {
  const [model,    setModel]    = useState('Base (Voice Clone)')
  const [device,   setDevice]   = useState('auto')
  const [dtype,    setDtype]    = useState('bf16')
  const [status,   setStatus]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [unloading,setUnloading]= useState(false)

  async function handleLoad() {
    setLoading(true); setStatus('Loading model…')
    try {
      const msg = await loadModel(model, device, dtype)
      setStatus(msg)
      if (msg.toLowerCase().includes('loaded')) {
        const data = await fetch('/api/status').then(r => r.json())
        onLoaded(data.loaded)
      }
    } catch (e: unknown) { setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`) }
    finally { setLoading(false) }
  }

  async function handleUnload() {
    setUnloading(true)
    try { const msg = await unloadModels(); setStatus(msg); onLoaded([]) }
    catch (e: unknown) { setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`) }
    finally { setUnloading(false) }
  }

  return (
    <div className="bg-q-bg1 border border-q-border rounded-card p-5 mb-4">
      <SectionHeader badge="1" title="Model Setup" desc="Select and load a model. Each mode requires its own model." />

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1.5 min-w-[180px] flex-1">
          <FieldLabel tooltip="Which Qwen3-TTS variant to load. Base = voice cloning, CustomVoice = preset speakers, VoiceDesign = text-described voices.">Model</FieldLabel>
          <SelectField value={model} options={MODEL_OPTIONS} onChange={setModel} />
        </div>
        <div className="flex flex-col gap-1.5 w-28">
          <FieldLabel tooltip="Compute device. 'auto' selects ROCm/CUDA if available, otherwise CPU.">Device</FieldLabel>
          <SelectField value={device} options={DEVICE_OPTIONS} onChange={setDevice} />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <FieldLabel tooltip="bf16 halves VRAM with minimal quality loss. fp32 = full precision.">Precision</FieldLabel>
          <SelectField value={dtype} options={DTYPE_OPTIONS} onChange={setDtype} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLoad}
            disabled={loading || unloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-q-accent text-black font-bold text-sm transition-all duration-150 hover:brightness-110 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Cpu size={14} />}
            Load Model
          </button>
          <button
            onClick={handleUnload}
            disabled={loading || unloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-q-red/40 text-q-red font-semibold text-sm transition-all duration-150 hover:bg-q-red/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {unloading && <Loader2 size={14} className="animate-spin" />}
            Unload All
          </button>
        </div>
      </div>

      {status && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-q-bg0 border border-q-border-soft font-mono text-xs text-q-text3">
          {status}
        </div>
      )}
    </div>
  )
}
