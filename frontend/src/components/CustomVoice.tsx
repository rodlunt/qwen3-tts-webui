import { useState } from 'react'
import { generateCustomVoice } from '../lib/api'
import { Card, SectionHeader, FieldLabel, TextArea, SelectField, GenerateButton, AudioPlayer } from './ui'
import { AdvancedParams, useParams } from './AdvancedParams'

const SPEAKERS = ['Aiden','Dylan','Eric','Ono_anna','Ryan','Serena','Sohee','Uncle_fu','Vivian']
const LANGUAGES = ['Auto','Japanese','English','Chinese','Korean','Spanish','French','German','Italian','Portuguese']

export function CustomVoice() {
  const [speaker, setSpeaker] = useState('Vivian')
  const [language, setLanguage] = useState('Auto')
  const [instruct, setInstruct] = useState('')
  const [text, setText] = useState('')
  const [params, setParams] = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioSrc, setAudioSrc] = useState('')

  async function handleGenerate() {
    if (!text.trim()) { setError('Please enter text to synthesise.'); return }
    setError(''); setLoading(true)
    try { setAudioSrc(await generateCustomVoice(speaker, text, instruct, language, params)) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <Card>
        <SectionHeader badge="2" title="Speaker &amp; Style" desc="Pick a built-in voice and optional delivery direction" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel tooltip="Built-in voice character. Each has a distinct timbre, age, and style.">Speaker</FieldLabel>
            <SelectField value={speaker} options={SPEAKERS} onChange={setSpeaker} />
          </div>
          <div>
            <FieldLabel tooltip="Synthesis language. 'Auto' detects from the input text.">Language</FieldLabel>
            <SelectField value={language} options={LANGUAGES} onChange={setLanguage} />
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel tooltip="How to deliver the speech. e.g. 'Speak slowly and warmly' or 'Nervous, hushed whisper'.">
            Style Instruction (optional)
          </FieldLabel>
          <TextArea value={instruct} onChange={setInstruct} placeholder="e.g. Speak slowly and warmly, with a hint of wry humour." rows={2} />
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
