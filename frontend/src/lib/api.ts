export interface ApiStatus {
  loaded: string[]
}

export interface ApiConstants {
  models: string[]
  speakers: string[]
  languages: string[]
}

export interface GenerationParams {
  seed: number
  temperature: number
  top_p: number
  top_k: number
  repetition_penalty: number
  max_new_tokens: number
}

async function apiPost(path: string, body: FormData): Promise<Response> {
  const res = await fetch(path, { method: 'POST', body })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? res.statusText)
  }
  return res
}

export async function fetchStatus(): Promise<ApiStatus> {
  const res = await fetch('/api/status')
  return res.json()
}

export async function fetchConstants(): Promise<ApiConstants> {
  const res = await fetch('/api/constants')
  return res.json()
}

export async function loadModel(model_name: string, device: string, dtype: string): Promise<string> {
  const fd = new FormData()
  fd.append('model_name', model_name)
  fd.append('device', device)
  fd.append('dtype', dtype)
  const res = await apiPost('/api/load', fd)
  const data = await res.json()
  return data.status
}

export async function unloadModels(): Promise<string> {
  const fd = new FormData()
  const res = await apiPost('/api/unload', fd)
  const data = await res.json()
  return data.status
}

function appendParams(fd: FormData, p: GenerationParams) {
  fd.append('seed', String(p.seed))
  fd.append('temperature', String(p.temperature))
  fd.append('top_p', String(p.top_p))
  fd.append('top_k', String(p.top_k))
  fd.append('repetition_penalty', String(p.repetition_penalty))
  fd.append('max_new_tokens', String(p.max_new_tokens))
}

export async function generateVoiceClone(
  refAudio: File,
  refText: string,
  text: string,
  language: string,
  xVectorOnly: boolean,
  params: GenerationParams,
): Promise<string> {
  const fd = new FormData()
  fd.append('ref_audio', refAudio)
  fd.append('ref_text', refText)
  fd.append('text', text)
  fd.append('language', language)
  fd.append('x_vector_only', String(xVectorOnly))
  appendParams(fd, params)
  const res = await apiPost('/api/generate/voice-clone', fd)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function generateCustomVoice(
  speaker: string,
  text: string,
  instruct: string,
  language: string,
  params: GenerationParams,
): Promise<string> {
  const fd = new FormData()
  fd.append('speaker', speaker)
  fd.append('text', text)
  fd.append('instruct', instruct)
  fd.append('language', language)
  appendParams(fd, params)
  const res = await apiPost('/api/generate/custom-voice', fd)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function generateVoiceDesign(
  text: string,
  instruct: string,
  language: string,
  params: GenerationParams,
): Promise<string> {
  const fd = new FormData()
  fd.append('text', text)
  fd.append('instruct', instruct)
  fd.append('language', language)
  appendParams(fd, params)
  const res = await apiPost('/api/generate/voice-design', fd)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
