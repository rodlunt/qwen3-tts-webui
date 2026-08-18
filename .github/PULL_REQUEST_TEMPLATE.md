<!-- Thanks for the PR. CONTRIBUTING.md has the two-minute read behind each line here. -->

## What and why

<!-- What changed, and the reason it needed to. -->

Closes #

## Verification

<!-- There is no automated test suite or CI in this repo yet, so describe what you actually
     ran: which synthesis mode you exercised, on what GPU (or CPU), and what you checked in the
     output. A screenshot or a short audio sample is useful for UI or synthesis-quality changes. -->

## Checklist

- [ ] Container builds cleanly: `podman build -t localhost/qwen3-tts-webui:latest -f Containerfile .`
      (or the equivalent `docker build`)
- [ ] App starts and serves the UI: `./run.sh`, then checked `http://localhost:7860`
- [ ] Frontend changes: `cd frontend && pnpm install && pnpm run build` completes without errors
- [ ] Backend changes: ran `python3 api/api.py --model-dir ./models` and exercised the affected
      endpoint or mode manually
- [ ] Commits follow conventional commits (`fix:`, `feat:`, `docs:`, `chore:`, ...)
- [ ] Prose is Australian English with no em or en dashes
