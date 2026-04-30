import { useGame, usePlayer } from "@empirica/core/player/classic/react";
import React, { useEffect } from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  const player = usePlayer();
  const game = useGame();

  useEffect(() => {
    const raw = sessionStorage.getItem("playerRegistration");
    if (raw && player) {
      const data = JSON.parse(raw);
      player.set("firstName", data.firstName);
      player.set("lastName", data.lastName);
      player.set("emailPrefix", data.emailPrefix);
      sessionStorage.removeItem("playerRegistration");
    }
  }, [player]);

  const treatment = game?.get("treatment") || {};
  const r = treatment.r ?? 4;
  const c = treatment.c ?? 2;
  const rounds = treatment.rounds ?? 20;
  const switchingCost = treatment.switchingCost ?? 0;
  const playerCount = treatment.playerCount ?? 50;
  const targetGroupSize = Math.max(1, Math.floor(playerCount / 2));
  const typicalCost = c.toFixed(c % 1 === 0 ? 0 : 1);

  return (
    <div className="mt-3 sm:mt-5 p-10 sm:p-16 max-w-3xl mx-auto">
      <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-6">
        Welcome to the Group Sorting Game
      </h3>

      <div className="space-y-4 text-gray-700">
        <p>
          You'll play <strong>up to {rounds} rounds</strong> with the rest of the class. The
          game ends earlier if everyone has perfectly sorted into two same-type groups.
        </p>

        <h4 className="text-lg font-semibold text-gray-800 mt-6">Your type & group</h4>
        <p>
          When the game starts you'll be randomly assigned a <strong>type</strong> —{" "}
          <span className="font-bold text-blue-700">A</span> or{" "}
          <span className="font-bold text-orange-700">B</span> — and randomly placed
          in <strong>Group 1</strong> or <strong>Group 2</strong>. Your type stays the
          same the entire game; your group can change each round if you choose to switch.
        </p>

        <h4 className="text-lg font-semibold text-gray-800 mt-6">How each round works</h4>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>You see how many A's and B's are in each group.</li>
          <li>The local <em>outcome</em> of each group is its majority type (a tie is broken by a coin flip).</li>
          <li>You earn payoff = <strong>fit</strong> − <strong>congestion</strong>.</li>
          <li>You then decide to <strong>stay</strong> or <strong>switch</strong> groups for the next round.</li>
        </ol>

        <h4 className="text-lg font-semibold text-gray-800 mt-6">Payoff rules</h4>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>
            <strong>Fit</strong>: <span className="font-mono">{r}</span> if your group's
            majority outcome matches your type, <span className="font-mono">{r / 2}</span> if your
            group is tied, <span className="font-mono">0</span> if the opposite type wins.
          </li>
          <li>
            <strong>Congestion</strong>: roughly <span className="font-mono">{typicalCost}</span> per
            round when groups are evenly split (~{targetGroupSize} per group). Bigger groups
            cost more, smaller groups cost less.
          </li>
          {switchingCost > 0 && (
            <li>
              <strong>Switching cost</strong>: you pay{" "}
              <span className="font-mono">{switchingCost}</span> point each time you change groups.
            </li>
          )}
        </ul>

        <h4 className="text-lg font-semibold text-gray-800 mt-6">Worked example</h4>
        <p>
          Suppose you're type A in a group of {targetGroupSize} where {targetGroupSize} are
          A's (perfectly sorted). Your fit = {r}, your congestion ≈ {typicalCost}, so your
          round payoff ≈ <strong>{(r - c).toFixed(c % 1 === 0 ? 0 : 1)}</strong>. If instead
          your group is mostly B's, fit = 0 and your payoff is roughly <strong>−{typicalCost}</strong>.
        </p>

        <p className="text-sm text-gray-500 italic mt-4">
          Tip: There is no penalty for negative scores — they're part of the game. Try to
          end with as high a total as you can.
        </p>
      </div>

      <div className="mt-8">
        <Button handleClick={next} autoFocus>
          I understand. Start the game.
        </Button>
      </div>
    </div>
  );
}
