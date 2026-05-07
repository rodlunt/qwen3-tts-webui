import { useState } from 'react'
import { generateVoiceClone } from '../lib/api'
import { Card, SectionHeader, FieldLabel, TextArea, SelectField, CheckboxField, GenerateButton, AudioPlayer } from './ui'
import { AdvancedParams, useParams } from './AdvancedParams'
import { AudioDropzone } from './AudioDropzone'

const LANGUAGES = ['Auto','Japanese','English','Chinese','Korean','Spanish','French','German','Italian','Portuguese']

export function VoiceClone() {
  const [refFile, setRefFile] = useState<File | null>(null)
  const [refText, setRefText] = useState('')
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('Auto')
  const [xVectorOnly, setXVectorOnly] = useState(false)
  const [params, setParams] = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioSrc, setAudioSrc] = useState('')

  async function handleGenerate() {
    if (!refFile) { setError('Please provide a reference audio file.'); return }
    if (!text.trim()) { setError('Please enter text to synthesise.'); return }
    if (!xVectorOnly && !refText.trim()) { setError('Reference text is required when x_vector_only is off.'); return }
    setError(''); setLoading(true)
    try { setAudioSrc(await generateVoiceClone(refFile, refText, text, language, xVectorOnly, params)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <Card>
        <SectionHeader badge="2" title="Reference Voice" desc="5–15 sec of the voice to clone" />

        {/* Equal-height two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: '220px' }}>
          <AudioDropzone file={refFile} onChange={setRefFile} className="h-full min-h-[220px]" />
          <div className="flex flex-col gap-1.5 min-h-[220px]">
            <FieldLabel tooltip="Exact transcript of the reference audio. Improves clone accuracy significantly.">
              Reference Text
            </FieldLabel>
            <TextArea
              value={refText}
              onChange={setRefText}
              placeholder="The quick brown fox jumps over the lazy dog. She sells seashells by the seashore."
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="w-44">
            <FieldLabel tooltip="Synthesis language. 'Auto' detects from the input text.">Language</FieldLabel>
            <SelectField value={language} options={LANGUAGES} onChange={setLanguage} />
          </div>
          <div className="pt-5">
            <CheckboxField
              checked={xVectorOnly}
              onChange={setXVectorOnly}
              label="x_vector_only (faster, lower quality)"
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader badge="3" title="Target Text" desc="What should be spoken in the cloned voice" />
        <TextArea value={text} onChange={setText} placeholder="Enter the text you want to speak…" rows={5} />
      </Card>

      <Card>
        <SectionHeader badge="4" title="Fine-Tuning &amp; Generate" />
        <AdvancedParams params={params} onChange={setParams} />
        <div className="mt-4">
          {error && <p className="text-sm text-q-red mb-3 bg-q-red/10 border border-q-red/20 rounded-lg px-3 py-2">{error}</p>}
          <GenerateButton loading={loading} disabled={false} onClick={handleGenerate} />
        </div>
        {audioSrc && <AudioPlayer src={audioSrc} />}
      </Card>
    </div>
  )
}
