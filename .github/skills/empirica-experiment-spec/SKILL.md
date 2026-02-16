---
name: empirica-experiment-spec
description: Turn a researcher prompt into a complete Empirica experiment specification with treatments, lobby settings, rounds, stages, player actions, and output variables. Use this when a researcher describes an experiment idea.
---

When a researcher describes an experiment, do this before writing code:

0. Ground yourself in Empirica references before proposing details:
   - docs: https://docs.empirica.ly/
   - framework repo: https://github.com/empiricaly/empirica
   - docs repo: https://github.com/empiricaly/docsv2
   - project reference map: `schema/empirica-reference.json` if present

Generalizable Empirica defaults to enforce in every spec:
- Lifecycle contract first: explicitly map intro/exit (asynchronous) vs rounds/stages (synchronous).
- Data-scope contract first: define where every variable lives (`game`, `player`, `round`, `stage`) before implementation.
- Async server work plan: if timers/workers/external APIs are involved, require explicit `Empirica.flush()` points.
- Reliability plan: include deterministic key naming and producer/consumer ownership for every analytic field.
- Validation plan: require end-to-end run + export schema verification, not code inspection only.

1. Elicit missing requirements:
   - target population and sample size
   - multiplayer vs single-player requirements
   - treatments/factors and assignment constraints
   - required player count per treatment (do not assume pairwise games)
   - per-round and per-stage timing
   - decisions each participant makes
   - payoff/scoring logic
   - chat and communication rules
   - intro flow requirements:
     - consent behavior (default or custom consent component)
     - instructions/onboarding content
     - comprehension or attention checks
   - exit flow requirements:
     - exit survey items
     - participant completion/submission code behavior
     - debrief content
   - export variables required for analysis
   - explicit data scope for each variable:
     - game scope (`game.set`)
     - player scope (`player.set`)
     - round scope (`round.set`, `player.round.set`)
     - stage scope (`stage.set`, `player.stage.set`)

2. Produce an implementation-ready spec with these sections:
   - **Treatments** mapped to `.empirica/treatments.yaml`
   - **Lobby setup** mapped to `.empirica/lobbies.yaml`
   - **Admin panel plan**:
     - batch composition (how many games per batch)
     - assignment method choice (`complete` vs `simple`)
     - treatment randomization strategy
     - treatment test scope: all treatments or named subset
   - **Game lifecycle** mapped to `server/src/callbacks.js` hooks
   - **UI flow** mapped to `client/src` components
   - **Intro/Exit flow (EmpiricaContext mapping)**:
     - `client/src/App.jsx` `EmpiricaContext` `consent`, `introSteps`, `exitSteps`
     - explicit ordered arrays of intro/exit React components
     - expected data keys captured in intro/exit and their scope
   - **UI preview checkpoint**:
     - provide wireframe-level stage screens before coding
     - ask researcher for feedback and approval
   - **Data schema** listing required keys by scope:
      - player persistent (`player.set`)
      - round (`player.round.set`, `round.set`)
      - stage (`player.stage.set`, `stage.set`)
      - game (`game.set`)

3. Validate feasibility against Empirica Classic primitives used in this repo:
   - `game.addRound`, `round.addStage`
   - `Empirica.onGameStart/onStageEnded/...`
   - player hooks (`usePlayer`, `useRound`, `useStageTimer`, `usePlayers`)

4. Before finalizing the spec, run a researcher checkpoint:
   - present a concise "Empirica primitive plan" with:
     - Treatment(s) and factor mapping
     - Lobby design
     - Game composition and assignment method
     - Round/Stage sequence with timers
     - What is stored at game/player/round/stage scope
   - ask for explicit confirmation or requested changes.

5. End with a build plan ordered by file edits and a test plan.
   - test plan must include strict E2E completion criteria:
     - required participant count per treatment launched
     - all simulated participants reach final exit
     - condition-specific interactions exercised for each treatment

Output format:
- Start with a concise assumptions list.
- Then provide the final spec in structured bullets.
- Include an explicit "schema contract" table with: key, scope, unit of analysis, description, producer, consumer, export file target (`game.csv`, `player.csv`, `round.csv`, `stage.csv`).
- End with an "Empirica references consulted" list (doc page/repo section names).
