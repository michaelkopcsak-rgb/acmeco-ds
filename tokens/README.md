# tokens/

Design tokens in DTCG JSON format, built by `scripts/build-tokens.mjs` (Style Dictionary) into `src/tokens.css`.

| File | Tier | Used by |
|---|---|---|
| `primitives.json` | Raw values (every colour, size, radius) | Only semantic and component tokens, never components |
| `semantic-light.json` | Meaning (`color.text.default`, `color.action.background.default`) | Components and component tokens |
| `components/*.json` | One file per component (`button.background.default`) | That component's CSS |

Every token's `$description` carries an evidence label (OBSERVED, LEGACY-NAMED, PROPOSED, BENCHMARK-INFORMED). Filled in phase 1.
