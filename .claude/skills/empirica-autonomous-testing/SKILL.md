---
name: empirica-autonomous-testing
description: Run the experiment autonomously, capture screenshots across participant/admin views, and perform smoke checks after implementation changes.
---

Use this when asked to test the experiment end-to-end and show visual progress.

Runtime command policy for this repo:
- Do not use `npm run build`/`npm test` to validate the Empirica app.
- Only install dependencies with `npm install` in `client/` and `server/`.
- Start and run the app with `empirica` from repository root.
- If a full integration build check is needed, run `empirica bundle` from repository root.

Before running tests, review relevant Empirica references:
- docs: https://docs.empirica.ly/
- framework repo: https://github.com/empiricaly/empirica
- docs repo: https://github.com/empiricaly/docsv2
- project reference map: `schema/empirica-reference.json` if present

Generalizable runtime checks for any Empirica experiment:
- Verify lifecycle progression is correct (intro/exit async behavior, stage/round synchronization).
- Verify server-to-client propagation for async server updates (especially timer/API-driven updates).
- If async updates appear only after refresh, check for missing `Empirica.flush()` in async paths.
- Verify env-dependent features (API keys, debug flags) are loaded in the actual server process.
- Treat an E2E run as incomplete until every simulated participant reaches the final exit state.
- Require interaction depth: each simulated participant should perform realistic task actions (not just page loads/check-ins).
- Include condition/treatment stress checks: exercise branch-specific mechanics and edge interactions for each condition under test.

## Workflow

1. Start local experiment:
    - `empirica` in repository root.
    - use admin credentials from `.empirica/empirica.toml` to access `/admin`.
    - if `.empirica/empirica.toml` still has `CHANGE_ME_SRTOKEN` or `CHANGE_ME_PASSWORD`, stop and configure them first during implementation.

2. Run screenshot capture script:
   - `node .github/skills/empirica-autonomous-testing/scripts/capture-screenshots.mjs --base http://localhost:3000 --out .github/skills/empirica-autonomous-testing/artifacts --paths /,/admin`
   - If Node/Playwright is unavailable, capture screenshots manually from browser windows.
   - Always surface screenshots to researcher during the run (not only at the end).

3. Run a simulated session:
    - Prefer reusable automation script first:
      - `node .github/skills/empirica-autonomous-testing/scripts/run-treatment-e2e.mjs --base http://localhost:3000 --treatment "None" --player-count 5 --admin-user admin --admin-pass <password> --out .github/skills/empirica-autonomous-testing/artifacts/none-e2e --require-exit 1`
    - In admin panel automation, create/start a batch with intended treatment randomization and assignment mode.
    - Ask researcher whether to test all treatments or a named subset.
    - Verify expected game/treatment allocation before participants join.
    - For each treatment under test, launch the correct number of participants based on that treatment's `playerCount`.
    - Launch participant URLs and move through consent, intro steps, stage(s), and exit for each active game.
    - A treatment simulation is only considered complete if all simulated participants reach final exit.
    - Stress-test task interactions (not just check-in messages): domain-relevant decisions/communications plus condition-specific mechanics.
    - Fail the run if participant completion criteria are not met (do not silently continue to export/validation).
    - Capture screenshots during progression (intro, in-stage, waiting/result, exit, admin).

4. Export simulation data:
   - `empirica export` in repository root.
   - Move the generated zip into `.github/skills/empirica-autonomous-testing/artifacts/exports`.
   - Confirm zip contents include experiment tables (`game.csv`, `player.csv`, `round.csv`, `stage.csv`, etc.) when data exists.

5. Run schema checks against implementation and exported data:
   - `node .github/skills/empirica-data-schema-validation/scripts/validate-schema.mjs --server server/src/callbacks.js --client client/src --expect .github/skills/empirica-data-schema-validation/expected-schema.example.json`
   - `python3 .github/skills/empirica-data-schema-validation/scripts/compare-export-schema.py --export-zip <path-to-export-zip> --expect .github/skills/empirica-data-schema-validation/expected-schema.example.json`

6. Report outputs:
   - screenshot file paths
   - any page-load, runtime, or export errors observed
   - admin panel actions taken (batch config, assignment mode, treatment setup)
    - simulation status by treatment (participants launched, games started, games ended, stages completed)
    - intro/exit verification:
      - consent shown and completed
      - intro step order observed
      - exit survey/debrief/submission code behavior observed
      - participant completion counts (required vs completed exit)
    - schema comparison result (expected vs code vs exported data)
    - async propagation check result (live update vs requires refresh)
    - Empirica references consulted
    - explicit blockers if screenshots could not be produced

## Notes

- For multiplayer checks, open multiple participant URLs with different `participantKey` values.
- Reuse scripts under `scripts/lib`:
  - `admin.mjs` for stable Empirica admin actions (`newBatchButton`, assignment buttons, treatment select, create/start).
- Capture at least: landing/player page, active stage page, admin page.
- If Playwright is missing, install it with `npm install --no-save playwright`.
- If `node`/`npm` are unavailable, continue with manual browser simulation and Python-based export checks.
