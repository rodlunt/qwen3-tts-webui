"""Qwen3-TTS — FastAPI backend."""
import argparse
import io
import os
import sys
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
import torch
from fastapi import FastAPI, Form, HTTPException, UploadFile
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles


def _get_config():
    p = argparse.ArgumentParser(add_help=False)
    p.add_argument("--model-dir", default=os.environ.get("QWEN_TTS_MODEL_DIR", "./models"))
    p.add_argument("--qwen-tts-path", default=os.environ.get("QWEN_TTS_PATH", None))
    args, _ = p.parse_known_args()
    return args


_cfg = _get_config()
model_dir: str = os.path.abspath(_cfg.model_dir)
if _cfg.qwen_tts_path:
    sys.path.insert(0, _cfg.qwen_tts_path)

loaded_models: dict = {}

MODEL_SUBDIRS = {
    "Base (Voice Clone)": "Qwen3-TTS-12Hz-1.7B-Base",
    "CustomVoice": "Qwen3-TTS-12Hz-1.7B-CustomVoice",
    "VoiceDesign": "Qwen3-TTS-12Hz-1.7B-VoiceDesign",
}
HF_MODEL_IDS = {
    "Base (Voice Clone)": "Qwen/Qwen3-TTS-12Hz-1.7B-Base",
    "CustomVoice": "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice",
    "VoiceDesign": "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
}
SPEAKERS = ["Aiden", "Dylan", "Eric", "Ono_anna", "Ryan", "Serena", "Sohee", "Uncle_fu", "Vivian"]
LANGUAGES = ["Auto", "Japanese", "English", "Chinese", "Korean", "Spanish", "French", "German", "Italian", "Portuguese"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    loaded_models.clear()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()


app = FastAPI(title="Qwen3-TTS", lifespan=lifespan)


def _model_path(name: str) -> str:
    return os.path.join(model_dir, MODEL_SUBDIRS[name])


def _resolve_device(s: str) -> str:
    if s == "auto":
        return "cuda:0" if torch.cuda.is_available() else "cpu"
    return s


def _resolve_dtype(s: str):
    return torch.bfloat16 if s == "bf16" else torch.float32


def _get_model(name: str):
    if name not in loaded_models:
        raise HTTPException(400, f"Model '{name}' is not loaded.")
    return loaded_models[name]


def _gen_kwargs(seed, temperature, top_p, top_k, repetition_penalty, max_new_tokens):
    if seed >= 0:
        torch.manual_seed(int(seed))
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(int(seed))
    return dict(
        temperature=temperature,
        top_p=top_p,
        top_k=int(top_k),
        repetition_penalty=repetition_penalty,
        max_new_tokens=int(max_new_tokens),
    )


def _to_wav(sr: int, audio: np.ndarray) -> bytes:
    import wave
    if audio.dtype.kind == "f":
        audio = (np.clip(audio, -1.0, 1.0) * 32767).astype(np.int16)
    elif audio.dtype != np.int16:
        audio = audio.astype(np.int16)
    if audio.ndim > 1:
        audio = audio[:, 0]
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(audio.tobytes())
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/status")
def status():
    return {"loaded": list(loaded_models.keys())}


@app.get("/api/constants")
def constants():
    return {
        "models": list(MODEL_SUBDIRS.keys()),
        "speakers": SPEAKERS,
        "languages": LANGUAGES,
    }


@app.post("/api/load")
def load_model(
    model_name: str = Form(...),
    device: str = Form("auto"),
    dtype: str = Form("bf16"),
):
    from qwen_tts import Qwen3TTSModel
    from huggingface_hub import snapshot_download

    if model_name not in MODEL_SUBDIRS:
        raise HTTPException(400, f"Unknown model: {model_name}")
    if model_name in loaded_models:
        return {"status": f"'{model_name}' is already loaded."}

    path = _model_path(model_name)
    dev = _resolve_device(device)
    dt = _resolve_dtype(dtype)

    if not os.path.isdir(path):
        try:
            print(f"Downloading {HF_MODEL_IDS[model_name]} → {path}", flush=True)
            snapshot_download(repo_id=HF_MODEL_IDS[model_name], local_dir=path)
        except Exception as e:
            raise HTTPException(500, f"Download failed: {e}")

    try:
        m = Qwen3TTSModel.from_pretrained(path, device_map=dev, dtype=dt)
        loaded_models[model_name] = m
        return {"status": f"Loaded '{model_name}' on {dev} ({dtype})."}
    except Exception as e:
        raise HTTPException(500, f"Failed to load: {e}")


@app.post("/api/unload")
def unload_models():
    n = len(loaded_models)
    loaded_models.clear()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    return {"status": f"Unloaded {n} model(s). VRAM freed."}


@app.post("/api/generate/voice-clone")
async def gen_voice_clone(
    ref_audio: UploadFile,
    ref_text: str = Form(""),
    text: str = Form(...),
    language: str = Form("Auto"),
    x_vector_only: bool = Form(False),
    seed: int = Form(-1),
    temperature: float = Form(0.9),
    top_p: float = Form(1.0),
    top_k: int = Form(50),
    repetition_penalty: float = Form(1.05),
    max_new_tokens: int = Form(2048),
):
    if not text.strip():
        raise HTTPException(400, "Text is required.")
    ref_text_val = ref_text.strip() or None
    if not x_vector_only and not ref_text_val:
        raise HTTPException(400, "Reference text is required when x_vector_only is off.")

    model = _get_model("Base (Voice Clone)")
    kwargs = _gen_kwargs(seed, temperature, top_p, top_k, repetition_penalty, max_new_tokens)

    suffix = Path(ref_audio.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await ref_audio.read())
        tmp_path = tmp.name

    try:
        wavs, sr = model.generate_voice_clone(
            text=text.strip(),
            language=language.lower() if language != "Auto" else "auto",
            ref_audio=tmp_path,
            ref_text=ref_text_val,
            x_vector_only_mode=x_vector_only,
            **kwargs,
        )
    finally:
        os.unlink(tmp_path)

    return Response(_to_wav(sr, wavs[0]), media_type="audio/wav")


@app.post("/api/generate/custom-voice")
def gen_custom_voice(
    speaker: str = Form("Vivian"),
    text: str = Form(...),
    instruct: str = Form(""),
    language: str = Form("Auto"),
    seed: int = Form(-1),
    temperature: float = Form(0.9),
    top_p: float = Form(1.0),
    top_k: int = Form(50),
    repetition_penalty: float = Form(1.05),
    max_new_tokens: int = Form(2048),
):
    if not text.strip():
        raise HTTPException(400, "Text is required.")
    model = _get_model("CustomVoice")
    kwargs = _gen_kwargs(seed, temperature, top_p, top_k, repetition_penalty, max_new_tokens)
    wavs, sr = model.generate_custom_voice(
        text=text.strip(),
        speaker=speaker,
        language=language.lower() if language != "Auto" else "auto",
        instruct=instruct.strip() or None,
        **kwargs,
    )
    return Response(_to_wav(sr, wavs[0]), media_type="audio/wav")


@app.post("/api/generate/voice-design")
def gen_voice_design(
    text: str = Form(...),
    instruct: str = Form(...),
    language: str = Form("Auto"),
    seed: int = Form(-1),
    temperature: float = Form(0.9),
    top_p: float = Form(1.0),
    top_k: int = Form(50),
    repetition_penalty: float = Form(1.05),
    max_new_tokens: int = Form(2048),
):
    if not text.strip():
        raise HTTPException(400, "Text is required.")
    if not instruct.strip():
        raise HTTPException(400, "Voice style instruction is required.")
    model = _get_model("VoiceDesign")
    kwargs = _gen_kwargs(seed, temperature, top_p, top_k, repetition_penalty, max_new_tokens)
    wavs, sr = model.generate_voice_design(
        text=text.strip(),
        instruct=instruct.strip(),
        language=language.lower() if language != "Auto" else "auto",
        **kwargs,
    )
    return Response(_to_wav(sr, wavs[0]), media_type="audio/wav")


# Serve built frontend (registered last so API routes take precedence)
_static = Path(__file__).parent / "frontend" / "dist"
if _static.exists():
    app.mount("/", StaticFiles(directory=str(_static), html=True), name="static")
