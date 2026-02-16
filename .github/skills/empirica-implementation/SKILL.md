---
name: empirica-implementation
description: Implement an Empirica experiment from a spec using the correct Classic lifecycle primitives, updating server callbacks, client components, and treatment/lobby config consistently.
---

Use this implementation checklist:

0. Confirm relevant Empirica references before editing:
   - docs: https://docs.empirica.ly/
   - framework repo: https://github.com/empiricaly/empirica
   - docs repo: https://github.com/empiricaly/docsv2
   - project reference map: `schema/empirica-reference.json` if present

Generalizable implementation defaults:
- Preserve lifecycle semantics: intro/exit are asynchronous; rounds/stages are synchronous.
- Keep scope boundaries strict: game/player/round/stage attributes should be intentional and documented.
- For async writes outside lifecycle callbacks (intervals, API callbacks, workers), call `await Empirica.flush()` after `set(...)`.
- Load env before callback module initialization (dotenv first, then import callbacks) when top-level env reads exist.
- Prefer stable, explicit shared-state keys for UI/server coordination; avoid implicit state coupling.

1. Before coding, present the UI plan to the researcher:
   - show proposed participant screens by stage
   - call out interactions and where each decision is saved (`player.stage`, `player.round`, etc.)
   - request explicit feedback before implementation

2. Translate experiment design into Empirica config:
   - update `.empirica/treatments.yaml`
   - update `.empirica/lobbies.yaml`
   - include an admin-run plan that states expected batch and randomization setup

3. Implement lifecycle logic in `server/src/callbacks.js`:
   - create rounds/stages in `onGameStart`
   - compute outcomes in `onStageEnded` or `onRoundEnded`
   - store all analytic variables with explicit keys
   - avoid silent defaults for missing critical values
   - if using async timers/workers/API responses, flush writes (`await Empirica.flush()`)

4. Implement player UI in `client/src`:
    - round/stage routing in `Stage.jsx`
    - task components in `client/src/task-design` or new feature folders
    - profile/summaries in `Profile.jsx`
    - intro/exit survey fields in `client/src/intro` and `client/src/exit`
    - wire intro/exit in Empirica-native way in `client/src/App.jsx`:
      - use `EmpiricaContext` props `consent`, `introSteps`, `exitSteps`
      - provide intro/exit components as ordered arrays
      - keep each step as a focused React component under `client/src/intro` or `client/src/exit`

5. Keep schema keys synchronized across server and client:
   - every `get("key")` should have a clear producer `set("key")`
   - use stable, analysis-friendly key names and annotate each key with Empirica scope in final report

6. Verify by running Empirica-native flow:
    - `empirica bundle` for integration build check
    - then run autonomous test and screenshot workflow from the testing skill
    - ensure the autonomous run has strict completion criteria:
      - all simulated participants reach final exit
      - treatment-specific mechanics are exercised (not just nominal page traversal)
      - failures block "test passed" status until resolved

Required output after coding:
- list of touched files
- list of new schema keys grouped by `game/player/round/stage`
- intro/exit mapping summary:
  - consent component used
  - introSteps order
  - exitSteps order
- Empirica references consulted
- remaining assumptions or limits
