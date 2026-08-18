# Contributing

Thanks for wanting to improve qwen3-tts-webui. This is a solo-maintained project, so the process
is deliberately light.

## Where things go

- **Bugs**: [open an issue](https://github.com/rodlunt/qwen3-tts-webui/issues/new/choose) using
  the bug report form.
- **Ideas and feature requests**: same place, using the feature request form.
- **Security problems**: never publicly. See [SECURITY.md](SECURITY.md).

## Development setup

The project has two halves: a FastAPI backend and a React/Vite frontend, normally built together
into one container.

```sh
git clone --branch v1.0.0 https://github.com/rodlunt/qwen3-tts-webui
cd qwen3-tts-webui

# Build and run the whole thing in a container
podman build -t localhost/qwen3-tts-webui:latest -f Containerfile .
./run.sh
```

To iterate on the frontend with hot-module replacement against a local backend:

```sh
# Terminal 1: Python backend
pip install fastapi "uvicorn[standard]" python-multipart qwen-tts huggingface_hub
python3 api/api.py --model-dir ./models

# Terminal 2: Vite dev server (proxies /api to localhost:7860)
cd frontend && pnpm install && pnpm dev
```

There is no automated test suite or CI in this repo yet, so there are no gates to run locally
before pushing. Verify a change by actually running it: build the container, or run the dev
servers, and exercise the affected synthesis mode.

## Expectations for a pull request

- **Branch from `main`**, named descriptively (`fix/...`, `feat/...`, `docs/...`).
- **Conventional commit messages** (`fix:`, `feat:`, `docs:`, `refactor:`, `test:`, `chore:`),
  imperative subject, body explaining why rather than what.
- **Link the tracking issue** with a `Closes #N` line in the PR body, when the PR has one.
- **Describe what you actually verified** in the PR's Verification section: which mode you
  tested, on what GPU (or CPU), and what you checked in the output.
- **Prose in Australian English**, and no em or en dashes anywhere (commas, colons, parentheses
  or hyphens instead).

Every change lands via a pull request; the maintainer reads the diff before merging. There is no
CI to gate on yet, so review is the only gate.

## Licence

By contributing you agree your contributions are licensed under this repository's
[MIT licence](LICENSE).
