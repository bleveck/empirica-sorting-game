import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment") || {};
  const stageDurationSec = treatment.stageDurationSec || 300;
  const roundsPerGame = treatment.roundsPerGame || 1;

  for (let i = 1; i <= roundsPerGame; i += 1) {
    const round = game.addRound({
      name: `Round ${i}`,
      task: "default-task",
      roundIndex: i,
    });

    round.addStage({ name: "Task", duration: stageDurationSec });
    round.addStage({ name: "Result", duration: 30 });
  }
});

Empirica.onRoundStart(({ round }) => {
  // Initialize round-level variables here.
});

Empirica.onStageStart(({ stage }) => {
  // Initialize stage-level variables here.
});

Empirica.onStageEnded(({ stage }) => {
  // Compute and persist stage outcomes here.
});

Empirica.onRoundEnded(({ round }) => {
  // Compute and persist round outcomes here.
});

Empirica.onGameEnded(({ game }) => {
  // Compute and persist game-level outcomes here.
});
