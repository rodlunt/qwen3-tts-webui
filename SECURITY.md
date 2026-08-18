# Security Policy

qwen3-tts-webui is a self-hosted tool: it runs as a single container on your own hardware, with
no external service or account involved. There is no hosted instance to attack; the risk surface
is the container and the API it exposes on your network.

**Do not expose this container to the open internet without authentication in front of it.**
The FastAPI backend ships with no login, no rate limiting and no CSRF protection: it is designed
to sit behind your own network boundary (localhost, a home LAN, or a reverse proxy you control
with its own auth), not to be reachable directly from the internet.

## Supported versions

Only the latest tagged release receives security fixes. This is a small, pre-1.0 project with no
long-term support branch.

| Version | Supported |
|---|---|
| latest tag | yes |
| anything older | no |

If you are running an older tag or an untagged checkout of `main`, update to the latest release
before reporting: the issue may already be fixed. See the README's Quick start section for how
to pin an install to a specific tag.

## Reporting a vulnerability

Please do not open a public GitHub issue for a security problem: that discloses it before a fix
exists.

Instead, report it privately through
[GitHub Security Advisories](https://github.com/rodlunt/qwen3-tts-webui/security/advisories/new)
("Report a vulnerability" under this repository's Security tab). This lets you submit a private
report that only the maintainer can see and respond to.

Please include what you have: the affected version or commit, the class of issue (for example,
path traversal in the model directory handling, or an injection issue in the audio upload path),
and a reproduction if you have one.

## What to expect

This is a one-person project run alongside other work, so response times are modest and
best-effort, not contractual:

- **Acknowledgement**: within 5 business days of a report arriving.
- **Initial assessment** (severity and a rough plan): within 14 days of acknowledgement.
- **Fix or mitigation**: timeline depends on severity and complexity; you will be told what to
  expect once the report has been triaged.

You will be credited in the fix's release notes if you want to be, and left out if you would
rather not be.
