import { useRef, useState, useCallback } from 'react'
import { Upload, Mic, X, Square } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  file: File | null
  onChange: (f: File | null) => void
  className?: string
}

export function AudioDropzone({ file, onChange, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [recording, setRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('audio/')) onChange(f)
  }, [onChange])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onChange(new File([blob], 'recording.webm', { type: 'audio/webm' }))
        stream.getTracks().forEach(t => t.stop())
      }
      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch { alert('Microphone access denied.') }
  }

  function stopRecording() { recorderRef.current?.stop(); setRecording(false) }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {file ? (
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-q-bg2 border border-q-accent/30 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-q-accent/10 border border-q-accent/30 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-q-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-q-text truncate">{file.name}</p>
            <p className="text-xxs text-q-text3">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={() => onChange(null)} className="text-q-text3 hover:text-q-red transition-colors flex-shrink-0">
            <X size={15} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={e => { e.preventDefault(); setDragging(true) }}
          onDragOver={e => e.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={clsx(
            'flex-1 relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
            dragging
              ? 'border-q-accent bg-q-accent/5 scale-[1.01]'
              : 'border-q-border bg-q-bg2 hover:border-q-accent/50 hover:bg-q-bg3',
          )}
        >
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center transition-colors', dragging ? 'bg-q-accent/15 text-q-accent' : 'bg-q-bg3 text-q-text3')}>
            <Upload size={18} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-q-text2">Drop audio here</p>
            <p className="text-xs text-q-text3 mt-0.5">or click to browse · 5–15 sec recommended</p>
          </div>

          {/* Mic button inside the box, bottom-right */}
          <div className="absolute bottom-2.5 right-3" onClick={e => e.stopPropagation()}>
            {recording ? (
              <button onClick={stopRecording} className="flex items-center gap-1.5 text-xs text-q-red font-semibold hover:opacity-80 transition-opacity">
                <Square size={11} className="fill-current" /> Stop
              </button>
            ) : (
              <button onClick={startRecording} className="flex items-center gap-1.5 text-xs text-q-text3 hover:text-q-accent transition-colors">
                <Mic size={12} /> Record from mic
              </button>
            )}
          </div>

          <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f) }} />
        </div>
      )}
    </div>
  )
}
