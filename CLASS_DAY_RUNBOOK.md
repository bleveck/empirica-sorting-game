# Class Day Runbook — POLI 172 Group Sorting Game

This game lab runs **two back-to-back sessions** in the same class:

1. **Session A** — `Class_NoSwitchCost` (20 rounds, switching is free)
2. **Session B** — `Class_SwitchCost` (20 rounds, switching costs 1 point)

Each session ends when 20 rounds finish OR the class reaches a perfectly sorted equilibrium (all A's in one group, all B's in the other).

## Before Class

1. SSH key loaded: `ssh-add ~/.ssh/id_ed25519`
2. Stop any prior experiment if still running (see "Replacing the Old Experiment" below)
3. Test the server: open `https://poli172.games` in a browser
4. Admin panel: `https://poli172.games/admin` (credentials in your password manager — also stored locally in `.empirica/local-runbook.md`)

## Replacing the Old Experiment

```bash
ssh root@<server-ip>
systemctl stop empirica
cd ~/empirica && empirica export
cp *.zip ~/backups/ 2>/dev/null
rm /root/empirica/.empirica/local/tajriba.json
```

## Bundle and upload

```bash
cd ~/src/empirica_sorting_game
empirica bundle
scp <bundle>.tar.zst root@<server-ip>:~/empirica/empirica.tar.zst
```

Server auto-restarts on bundle detection — give it ~15 seconds, then reload `https://poli172.games/admin`. You should see the four treatments (`Test`, `Test_SwitchCost`, `Class_NoSwitchCost`, `Class_SwitchCost`).

## Schedule (75-minute class)

| Time   | Activity                                   | Notes                                                        |
|--------|--------------------------------------------|--------------------------------------------------------------|
| 0:00   | Presentation                               | Game rules, types, payoffs, switching                        |
| ~0:10  | Students connect + register                | URL: `https://poli172.games`                                 |
| ~0:13  | **Session A** (no switching cost) starts   | 20 rounds × ~42s each ≈ ~14 min (or earlier if sorted)       |
| ~0:27  | Session A exit survey                      | ~2 min                                                       |
| ~0:30  | **Session B** (switching cost = 1) starts  | New batch — students re-register                              |
| ~0:44  | Session B exit survey                      |                                                              |
| ~0:47  | Export data                                |                                                              |
| ~0:50  | Debrief / discussion                       | ~25 min remaining                                            |

Per-round timing: 12s Result + 30s SwitchDecision = 42s max. Most rounds end well before the timer because students submit early.

## Updating Player Count

Player count is fixed once a batch is created. Count students in the room **just before creating the batch**.

1. Admin panel → Batches → New Batch
2. Select treatment: `Class_NoSwitchCost` for Session A, `Class_SwitchCost` for Session B
3. Override `playerCount` to match attendance (default 50)
4. Click Create, then Start

Both groups need at least 1 player to make the game playable, so try to keep `playerCount` even — if the class is odd, round down by 1.

## Running each session

### Session A — `Class_NoSwitchCost`

1. Create the batch with `playerCount` set to attendance.
2. Tell students to go to `https://poli172.games` and register.
3. The lobby holds them until everyone joins. Once the batch fills, the game starts automatically.
4. Students play up to 20 rounds, see their summary, and complete the exit survey.

### Session B — `Class_SwitchCost`

1. After Session A finishes (everyone hits the exit survey), create a new batch with `Class_SwitchCost`.
2. Tell students to refresh `https://poli172.games`. They re-enter the same name/email so their data is identifiable across sessions.
3. Students play 20 more rounds with the switching cost in effect.

## Early-termination behavior

If the class hits a perfectly sorted state (all A's in one group, all B's in the other), the game ends immediately and the exit survey appears with a green note explaining why. This is a Nash equilibrium for these payoffs and is one of the things you can highlight in the debrief.

## After the game

```bash
ssh root@<server-ip>
cd ~/empirica && empirica export
```

Download exports:

```bash
scp root@<server-ip>:"~/empirica/*.zip" ~/Desktop/
```

The export includes per-round group composition (A/B counts and sizes for both groups) under `game.groupHistory`, and per-player per-round stats under `player.roundStats_*`. See `game_spec.md` and `group_sorting_game.typ` for variable definitions.

## Troubleshooting

- **Student can't connect**: confirm `https://poli172.games` (must be https)
- **Game won't start**: lobby waits for `playerCount` to fill — verify attendance count matches batch
- **Server unresponsive**: `ssh root@<server-ip>` then `systemctl restart empirica`
- **Student's screen is stuck**: have them refresh the browser
- **Need to re-run a session**: export data, wipe DB (`rm .empirica/local/tajriba.json`), restart empirica, create new batch
- **Negative scores**: expected — congestion can drive payoffs negative; reassure students
