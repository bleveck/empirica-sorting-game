# POLI 172 — Group Sorting Game Lab

An interactive web-based game lab implementing the group-sorting game described in `group_sorting_game.typ`. Players are randomly assigned a type (A or B) and an initial group (1 or 2). Each round they see the composition of both groups, earn a payoff based on whether their type wins their group's local majority (reward `r`) minus a congestion cost that scales with group size, then choose to stay or switch groups. The game ends after a configurable number of rounds, or earlier if the class reaches a perfectly sorted equilibrium (all A's in one group, all B's in the other).

This repo is an [Empirica](https://empirica.ly/) v1 experiment.

## What's in here

- `group_sorting_game.typ` — the original (formal, simplified-to-be-tractable) game spec
- `server/src/callbacks.js` — type/group assignment, per-round payoff logic, switching cost, Nash detection, group-composition history
- `client/src/` — the React UI (registration → instructions → rounds → exit survey)
- `.empirica/treatments.yaml` — the four treatments (`Test`, `Test_SwitchCost`, `Class_NoSwitchCost`, `Class_SwitchCost`)
- `instruction_slides/` — Typst source + compiled PDF of the in-class slides
- `CLASS_DAY_RUNBOOK.md` — instructor-side deployment notes
- `TA_GUIDE.md` — student-facing FAQ

## Prerequisites

- macOS or Linux (Windows works via WSL)
- Node.js 20+ — verify with `node --version`
- Empirica CLI

If you don't have Empirica yet, install per the [official quickstart](https://docs.empirica.ly/quick-start/installation):

```bash
curl https://install.empirica.ly | sh
```

Then verify:

```bash
empirica --help
```

## Clone and run

```bash
git clone https://github.com/bleveck/empirica-sorting-game.git
cd empirica-sorting-game
empirica
```

The first run installs npm dependencies in `client/` and `server/` automatically and starts a local dev server. When you see something like `server: started`, it's ready.

Open two browser tabs:

- **Admin panel**: <http://localhost:3000/admin>
  - Username: `admin`
  - Password: `CHANGE_ME_PASSWORD` (the placeholder in `.empirica/empirica.toml` — change it for production but the default is fine for local testing)
- **Player view**: <http://localhost:3000/>

## Test with 4 simulated players

The simplest way to play through the game yourself is with 4 browser windows.

1. In the admin panel, click **New Batch**.
2. Choose the **Test** treatment (4 players, 5 rounds, no switching cost) or **Test_SwitchCost** (with cost = 1).
3. Click **Create**, then **Start**.
4. Open four player tabs. To keep them as separate participants, append a unique `participantKey` to each URL:
   - <http://localhost:3000/?participantKey=p1>
   - <http://localhost:3000/?participantKey=p2>
   - <http://localhost:3000/?participantKey=p3>
   - <http://localhost:3000/?participantKey=p4>

   (Or use four different browser profiles / private windows.)
5. In each tab:
   - Click **I Agree** on the consent screen
   - Fill registration with any name + email prefix
   - Click **I understand. Start the game.**
6. Once all four are in, the lobby fills and the game begins. Play 5 rounds, then submit the exit survey.
7. Export the data with `empirica export --out /tmp/sorting-export.zip`, unzip, and inspect `game.csv` (look at `groupHistory`) and `player.csv` (look at `roundStats_*`).

To wipe state between runs:

```bash
rm -rf .empirica/local
empirica
```

## Treatment knobs (`.empirica/treatments.yaml`)

| Factor | What it controls | Default |
|---|---|---|
| `playerCount` | Lobby size for the batch | 4 (Test) / 50 (Class) |
| `rounds` | Max rounds per game | 5 (Test) / 20 (Class) |
| `r` | Reward when your type wins | 4 |
| `c` | Congestion factor (per-target-group scaling) | 2 |
| `switchingCost` | Points charged per group switch | 0 or 1 |
| `resultDuration` | Result-stage timeout (sec) | 12 |
| `switchDuration` | Switch-decision timeout (sec) | 30 |

Congestion cost per round = `c · (n_g − 1) / max(1, N/2 − 1)` where `N` is total players and `n_g` is your group's size. So `c` is interpretable as "the congestion cost a player would pay in a typical evenly-split group."

## Where to look first if you're modifying the game

- Payoff formula and group composition tracking → `server/src/callbacks.js` (`onRoundStart` and `onRoundEnded`)
- What players see each round → `client/src/stages/Result.jsx` and `client/src/stages/SwitchDecision.jsx`
- Both groups' A/B counts on screen → `client/src/components/GroupComposition.jsx`
- Round-by-round summary at end of game → `client/src/exit/ExitSurvey.jsx`

## Bundled AI-assistant skills (optional)

If you use Claude Code, this repo ships with four skill files in `.claude/skills/` that automate spec writing, implementation, schema validation, and end-to-end browser testing. They're optional — you can ignore them if you're not using Claude.

## Game spec & background

See `group_sorting_game.typ` for the formal model. The honors-project version was simplified to four players for tractability; this implementation scales to ~25 players per group (50 total) and adds dynamics (multiple rounds + switching). The "perfectly sorted" terminator is one Nash equilibrium of the static game; whether and how fast classes reach it under different switching costs is the empirical question.

## Acknowledgments

Project skeleton based on [empirica-copilot](https://github.com/malsobay/empirica-copilot).
