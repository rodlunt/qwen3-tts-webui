#!/bin/bash
set -e

IMAGE="localhost/qwen3-tts-webui:latest"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Model directory: first CLI arg > env var > default
MODELS_DIR="${1:-${QWEN_TTS_MODEL_DIR:-$HOME/models/qwen3-tts}}"

mkdir -p "$MODELS_DIR"

podman stop qwen3-tts 2>/dev/null || true
podman rm   qwen3-tts 2>/dev/null || true

echo 'Starting Qwen3-TTS WebUI...'
echo "Models  : $MODELS_DIR"
echo 'Access  : http://localhost:7860'
echo ''

podman run --rm   --name qwen3-tts   --device /dev/kfd   --device /dev/dri   --security-opt label=disable   -e HIP_VISIBLE_DEVICES=0   -e HF_HOME=/models/hf_cache   -v "$MODELS_DIR:/models"   -v "$SCRIPT_DIR/frontend/dist:/app/frontend/dist:ro"   -p 7860:7860   "$IMAGE"
