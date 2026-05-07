import { useState } from 'react'
import { generateVoiceDesign } from '../lib/api'
import { Card, SectionHeader, FieldLabel, TextArea, SelectField, GenerateButton, AudioPlayer } from './ui'
import { AdvancedParams, useParams } from './AdvancedParams'

const LANGUAGES = ['Auto','Japanese','English','Chinese','Korean','Spanish','French','German','Italian','Portuguese']

export function VoiceDesign() {
  const [instruct, setInstruct] = useState('')
  const [language, setLanguage] = useState('Auto')
  const [text, setText] = useState('')
  const [params, setParams] = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioSrc, setAudioSrc] = useState('')

  async function handleGenerate() {
    if (!text.trim()) { setError('Please enter text to synthesise.'); return }
    if (!instruct.trim()) { setError('Voice style instruction is required.'); return }
    setError(''); setLoading(true)
    try { setAudioSrc(await generateVoiceDesign(text, instruct, language, params)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <Card>
        <SectionHeader badge="2" title="Voice Description" desc="Describe the voice you want to create" />
        <div className="mb-4">
          <FieldLabel tooltip="Describe the voice to create. Be specific: gender, age, accent, pace, emotion.">
            Voice Style (required)
          </FieldLabel>
          <TextArea
            value={instruct}
            onChange={setInstruct}
            placeholder="e.g. A calm, deep male voice with a slight Australian accent and deliberate pacing."
            rows={3}
            required
          />
        </div>
        <div className="w-44">
          <FieldLabel tooltip="Synthesis language. 'Auto' detects from the input text.">Language</FieldLabel>
          <SelectField value={language} options={LANGUAGES} onChange={setLanguage} />
        </div>
      </Card>

      <Card>
        <SectionHeader badge="3" title="Target Text" />
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
