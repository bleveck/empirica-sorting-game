---
name: empirica-data-schema-validation
description: Validate experiment data by comparing the researcher-declared schema, implementation keys, and real exported data produced by empirica export after simulation.
---

Use this skill after implementing or changing experiment logic.

Runtime command policy for this repo:
- Do not use `npm run build`/`npm test` to validate the Empirica app.
- Only install dependencies with `npm install` in `client/` and `server/`.
- Start and run the app with `empirica` from repository root.
- If a full integration build check is needed, run `empirica bundle` from repository root.

Before validation, review relevant Empirica references:
- docs: https://docs.empirica.ly/
- framework repo: https://github.com/empiricaly/empirica
- docs repo: https://github.com/empiricaly/docsv2
- project reference map: `schema/empirica-reference.json` if present

Generalizable schema discipline:
- Every consumed key should have a known producer and explicit scope owner.
- Include lifecycle ownership in schema review (intro/exit keys vs in-game stage/round keys).
- For async server-produced keys, confirm values are flushed and present in export from real runs.
- Treat treatment/lobby/env-driven fields as explicit external inputs, not implicit app state.

## Validation process

1. Simulate a real run first:
   - complete at least one full participant run (or multiple for multiplayer designs)
   - confirm the target stages and outcomes were reached
   - for multiplayer tests, ensure all simulated participants reached final exit before exporting

2. Export data from the simulation:
   - `empirica export`
   - locate the generated export zip file for schema comparison

3. Extract observed schema keys from source:
   - producers: calls to `.set("...")`
   - consumers: calls to `.get("...")`

4. Run implementation schema helper:
   - `node .github/skills/empirica-data-schema-validation/scripts/validate-schema.mjs --server server/src/callbacks.js --client client/src --expect .github/skills/empirica-data-schema-validation/expected-schema.example.json`

5. Compare exported data schema with expected schema:
   - `python3 .github/skills/empirica-data-schema-validation/scripts/compare-export-schema.py --export-zip <path-to-export-zip> --expect .github/skills/empirica-data-schema-validation/expected-schema.example.json`

6. Check for:
   - consumed keys with no producer in project code
   - required keys missing from implementation
   - required keys missing from exported data
   - required keys present but in wrong entity table (`player.csv` vs `round.csv`, etc.)
   - optional keys present but undocumented

7. Report a schema contract table with columns:
    - key
    - scope (player/round/stage/game/treatment)
    - unit of analysis
    - description
    - expected export file (`player.csv` / `round.csv` / `stage.csv` / `game.csv`)
    - producer location(s)
    - consumer location(s)
    - present in export? (yes/no)

8. Print a terminal data-model summary:
   - `python3 .github/skills/empirica-data-schema-validation/scripts/print-data-model.py --expect .github/skills/empirica-data-schema-validation/expected-schema.example.json`

9. Include an "Empirica references consulted" list in the final report.

If keys are intentionally external (for example treatment values from config), mark them explicitly as external inputs.
