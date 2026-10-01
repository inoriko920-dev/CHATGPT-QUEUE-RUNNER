# RECOVERY_HANDOFF_CHAT_1

## Identity

- Project: `CHATGPT-QUEUE-RUNNER`
- Branch: `recovery/chat1-source-r0`
- Coordinator baseline commit: `083ed5030d6a6304e9f720ce6edcec5b4ce83288`
- Rescue input: user-supplied `extensions.zip`
- Provenance: `VERIFIED_SOURCE`
- Rescue SHA-256: `f46767d61dff61c2b0ce7dc413fc7dbe29f78d0029c17a2259d54bd96c5ddd56`
- Documented expected SHA-256: same value
- Hash result: **MATCH**

## Recovered source

- Recovered/imported: **80 files** under `extensions/**`.
- Runner directories: **10** (`chat-queue-runner-01` through `chat-queue-runner-10`).
- Per runner: `background.js`, `content.js`, `interruption-bypass.js`, `manifest.json`, `popup.css`, `popup.html`, `popup.js`, `README.md`.
- Core rescue files were imported without feature work or speculative rewrite.

## Classification

- APP SOURCE: 60
- CONFIG: 10
- DOCS: 10
- TEST: 0
- BUILD SCRIPT: 0
- BUNDLED DEPENDENCY: 0
- GENERATED FILE: 0
- BINARY/PORTABLE: 0

## Manifest verification

All Runner 01–10 manifests parse and report Manifest V3, version `0.1.8`, service worker `background.js`, popup `popup.html`, and content scripts `interruption-bypass.js` + `content.js`.

## Syntax validation

- Node: `v22.16.0`
- JavaScript checked: **40**
- PASS: **40**
- FAIL: **0**
- Scope: syntax/static check only. Chrome extension integration and live ChatGPT behavior were **NOT RUN** in Chat 1.

## Cross-runner drift

- Byte-identical across Runner 01–10: `background.js`, `content.js`, `popup.css`, `popup.html`, `popup.js`, `README.md`.
- `interruption-bypass.js`: six unique payloads. Runner 01–05 each differs; Runner 06–10 are identical.
- `manifest.json`: runner-specific identity/title; all remain version `0.1.8`.

## Recovery labels

### FOUND_EXACT

All 80 files physically present in the verified rescue ZIP.

### FOUND_BUT_VERSION_UNKNOWN

None among the 80 imported rescue files.

### MISSING_KNOWN_FILE

Historical audit evidence says **81 files**, while the verified rescue has **80**. Exactly one historical path is therefore missing by count, but its filename/path/content is not supported by current evidence.

### UNKNOWN

- Identity/path/content of the historical 81st file.
- Whether the rescue is exactly old commit `7bcfbf7cdfa87303f21d5f979796200880e355ae` or another partial/later working tree; the ZIP itself has no `.git` metadata.
- Live Chrome/ChatGPT runtime behavior.

## Integrator checks for Chat 5

1. Verify this branch contains exactly the 80 rescue files under `extensions/**`.
2. Resolve 81-vs-80 only if later evidence names the missing historical path; do not synthesize it.
3. Keep syntax PASS separate from Chrome/live integration status.
4. Do not auto-merge this worker branch; integrate only after provenance review.
