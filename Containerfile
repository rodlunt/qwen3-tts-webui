# Stage 1: build the React frontend
FROM node:22-slim AS frontend-builder
WORKDIR /frontend
# node:22-slim ships corepack, so this activates pnpm without ever calling npm.
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm run build

# Stage 2: Python runtime with ROCm
FROM docker.io/rocm/pytorch:rocm7.2.3_ubuntu24.04_py3.12_pytorch_release_2.10.0
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends sox ffmpeg && rm -rf /var/lib/apt/lists/*
COPY api/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY api/api.py /app/
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

ENV HF_HOME=/models/hf_cache
ENV QWEN_TTS_MODEL_DIR=/models
EXPOSE 7860

CMD ["python3", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
