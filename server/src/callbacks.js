import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function computeComposition(players) {
  const comp = {
    1: { A: 0, B: 0, total: 0, members: [] },
    2: { A: 0, B: 0, total: 0, members: [] },
  };
  for (const p of players) {
    const g = p.get("group");
    const t = p.get("type");
    if (g !== 1 && g !== 2) continue;
    comp[g].total += 1;
    comp[g][t] += 1;
    comp[g].members.push(p.id);
  }
  return comp;
}

function outcomeFor(group, tieDraw) {
  if (group.A > group.B) return "A";
  if (group.B > group.A) return "B";
  if (group.total === 0) return null;
  return tieDraw;
}

function fitFor(type, group, outcome, r) {
  if (group.total === 0) return 0;
  if (group.A === group.B) return r / 2;
  return outcome === type ? r : 0;
}

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment") || {};
  const {
    rounds = 20,
    resultDuration = 12,
    switchDuration = 30,
  } = treatment;

  const players = game.players;
  const N = players.length;

  const shuffledForType = shuffle(players.map((p) => p.id));
  const halfType = Math.floor(N / 2);
  const typeAssignments = {};
  shuffledForType.forEach((pid, i) => {
    typeAssignments[pid] = i < halfType ? "A" : "B";
  });

  const shuffledForGroup = shuffle(players.map((p) => p.id));
  const halfGroup = Math.floor(N / 2);
  const groupAssignments = {};
  shuffledForGroup.forEach((pid, i) => {
    groupAssignments[pid] = i < halfGroup ? 1 : 2;
  });

  for (const p of players) {
    p.set("type", typeAssignments[p.id]);
    p.set("group", groupAssignments[p.id]);
    p.set("score", 0);
  }

  game.set("playerCountActual", N);
  game.set("groupHistory", []);
  game.set("endReason", null);

  for (let r = 0; r < rounds; r++) {
    const round = game.addRound({
      name: `Round ${r + 1} of ${rounds}`,
      task: "sortingRound",
      roundIndex: r,
    });
    round.addStage({ name: "Result", duration: resultDuration });
    round.addStage({ name: "SwitchDecision", duration: switchDuration });
  }
});

Empirica.onRoundStart(({ round }) => {
  const game = round.currentGame;
  const treatment = game.get("treatment") || {};
  const r = treatment.r ?? 4;
  const c = treatment.c ?? 2;
  const N = game.get("playerCountActual") || game.players.length;
  const scale = Math.max(1, N / 2 - 1);

  const composition = computeComposition(game.players);

  const tieDraw1 = composition[1].A === composition[1].B ? (Math.random() < 0.5 ? "A" : "B") : null;
  const tieDraw2 = composition[2].A === composition[2].B ? (Math.random() < 0.5 ? "A" : "B") : null;
  const outcome1 = outcomeFor(composition[1], tieDraw1);
  const outcome2 = outcomeFor(composition[2], tieDraw2);

  round.set("composition", {
    group1: { A: composition[1].A, B: composition[1].B, total: composition[1].total },
    group2: { A: composition[2].A, B: composition[2].B, total: composition[2].total },
    outcome1,
    outcome2,
    tieResolution1: tieDraw1,
    tieResolution2: tieDraw2,
  });

  for (const p of game.players) {
    const g = p.get("group");
    const t = p.get("type");
    const groupComp = composition[g];
    const myOutcome = g === 1 ? outcome1 : outcome2;
    const fit = fitFor(t, groupComp, myOutcome, r);
    const congestion = (c * Math.max(0, groupComp.total - 1)) / scale;
    const payoff = fit - congestion;

    p.round.set("type", t);
    p.round.set("group", g);
    p.round.set("groupSize", groupComp.total);
    p.round.set("groupA", groupComp.A);
    p.round.set("groupB", groupComp.B);
    p.round.set("outcome", myOutcome);
    p.round.set("isTie", groupComp.A === groupComp.B && groupComp.total > 0);
    p.round.set("fitPayoff", fit);
    p.round.set("congestionCost", congestion);
    p.round.set("payoff", payoff);
  }
});

Empirica.onStageStart(({ stage }) => {
  const game = stage.currentGame;
  if (game && game.get("endReason") === "nash") {
    // Fast-forward remaining stages once we've reached the Nash terminator.
    // game.end() set the endReason in onRoundEnded but doesn't stop already-queued rounds,
    // so we end each subsequent stage as it starts.
    stage.end("nash equilibrium reached — skipping remaining rounds");
  }
});

Empirica.onStageEnded(({ stage }) => {
  if (stage.get("name") !== "SwitchDecision") return;

  const game = stage.currentGame;
  const treatment = game.get("treatment") || {};
  const switchingCost = treatment.switchingCost ?? 0;

  const switches = [];
  for (const p of game.players) {
    const choice = p.stage.get("switchChoice") || "stay";
    const currentGroup = p.get("group");
    let newGroup = currentGroup;
    let switched = false;
    let costPaid = 0;

    if (choice === "switch") {
      newGroup = currentGroup === 1 ? 2 : 1;
      switched = true;
      costPaid = switchingCost;
      p.set("group", newGroup);
    }

    p.round.set("switchChoice", choice);
    p.round.set("switched", switched);
    p.round.set("switchingCostPaid", costPaid);

    if (switched) {
      switches.push({
        playerId: p.id,
        from: currentGroup,
        to: newGroup,
        paid: costPaid,
      });
    }
  }
  stage.round.set("switches", switches);
});

Empirica.onRoundEnded(({ round }) => {
  const game = round.currentGame;
  const roundIndex = round.get("roundIndex");
  const composition = round.get("composition") || {};
  const switches = round.get("switches") || [];

  const history = game.get("groupHistory") || [];
  history.push({
    round: roundIndex,
    group1: composition.group1,
    group2: composition.group2,
    outcome1: composition.outcome1,
    outcome2: composition.outcome2,
    tieResolution1: composition.tieResolution1,
    tieResolution2: composition.tieResolution2,
    switches,
  });
  game.set("groupHistory", history);

  for (const p of game.players) {
    const payoff = p.round.get("payoff") || 0;
    const costPaid = p.round.get("switchingCostPaid") || 0;
    const prev = p.get("score") || 0;
    const newScore = prev + payoff - costPaid;
    p.set("score", newScore);

    p.set(`roundStats_${roundIndex}`, {
      roundIndex,
      type: p.round.get("type"),
      group: p.round.get("group"),
      groupSize: p.round.get("groupSize"),
      groupA: p.round.get("groupA"),
      groupB: p.round.get("groupB"),
      outcome: p.round.get("outcome"),
      isTie: p.round.get("isTie"),
      fitPayoff: p.round.get("fitPayoff"),
      congestionCost: p.round.get("congestionCost"),
      payoff,
      switched: p.round.get("switched"),
      switchingCostPaid: costPaid,
      cumulativeScore: newScore,
    });
  }

  // Nash check: are groups perfectly sorted by type now (after switches)?
  const postComp = computeComposition(game.players);
  const g1Empty = postComp[1].total === 0;
  const g2Empty = postComp[2].total === 0;
  const g1PureA = postComp[1].A > 0 && postComp[1].B === 0;
  const g1PureB = postComp[1].B > 0 && postComp[1].A === 0;
  const g2PureA = postComp[2].A > 0 && postComp[2].B === 0;
  const g2PureB = postComp[2].B > 0 && postComp[2].A === 0;
  const sorted =
    !g1Empty &&
    !g2Empty &&
    ((g1PureA && g2PureB) || (g1PureB && g2PureA));

  if (sorted) {
    game.set("endReason", "nash");
    game.end("Nash equilibrium reached: groups are perfectly sorted by type.");
  }
});

Empirica.onGameEnded(({ game }) => {
  if (!game.get("endReason")) {
    game.set("endReason", "rounds_complete");
  }
});
