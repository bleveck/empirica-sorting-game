import {
  usePlayer,
  useRound,
  useGame,
  useStageTimer,
} from "@empirica/core/player/classic/react";
import React from "react";
import { GroupComposition } from "../components/GroupComposition";

export function SwitchDecision() {
  const player = usePlayer();
  const round = useRound();
  const game = useGame();
  const timer = useStageTimer();

  const treatment = game.get("treatment") || {};
  const switchingCost = treatment.switchingCost ?? 0;

  const composition = round.get("composition");
  const myType = player.round.get("type") || player.get("type");
  const myGroup = player.round.get("group") || player.get("group");
  const otherGroup = myGroup === 1 ? 2 : 1;

  const choice = player.stage.get("switchChoice");
  const submitted = !!player.stage.get("submit");

  let remaining = null;
  if (timer?.remaining || timer?.remaining === 0) {
    remaining = Math.ceil(timer.remaining / 1000);
  }

  function handleStay() {
    player.stage.set("switchChoice", "stay");
    player.stage.set("submit", true);
  }

  function handleSwitch() {
    player.stage.set("switchChoice", "switch");
    player.stage.set("submit", true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-5 py-6 px-4">
        <p className="text-lg text-gray-700">
          You chose to{" "}
          <span className="font-bold">
            {choice === "switch" ? `switch to Group ${otherGroup}` : `stay in Group ${myGroup}`}
          </span>
          {choice === "switch" && switchingCost > 0 && (
            <span className="text-red-600">
              {" "}
              (−{switchingCost} pt switching cost)
            </span>
          )}
          .
        </p>
        <p className="text-sm text-gray-500">
          Waiting for other players...{" "}
          {remaining !== null && <span>(~{remaining}s)</span>}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center space-y-5 py-6 px-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Stay in Group {myGroup} or switch to Group {otherGroup}?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your decision applies starting next round.
        </p>
      </div>

      <GroupComposition
        composition={composition}
        myGroup={myGroup}
        myType={myType}
      />

      <div className="flex space-x-4 pt-2">
        <button
          onClick={handleStay}
          className="px-8 py-3 text-base font-bold rounded-lg shadow-md bg-empirica-600 text-white hover:bg-empirica-700"
        >
          Stay in Group {myGroup}
        </button>
        <button
          onClick={handleSwitch}
          className="px-8 py-3 text-base font-bold rounded-lg shadow-md bg-white border-2 border-empirica-500 text-empirica-700 hover:bg-empirica-50"
        >
          Switch to Group {otherGroup}
          {switchingCost > 0 && (
            <span className="block text-xs font-normal text-red-600 mt-1">
              costs {switchingCost} pt
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
