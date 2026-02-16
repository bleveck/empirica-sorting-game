import { usePlayer, useRound, useStage } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";

export function Task() {
  const player = usePlayer();
  const round = useRound();
  const stage = useStage();

  function handleSubmit() {
    player.stage.set("submit", true);
  }

  return (
    <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">
        {round?.get("name") || "Task Round"}
      </h2>
      <p className="text-sm text-gray-500 text-center">
        Replace this component with your experiment-specific task UI.
      </p>
      <p className="text-xs text-gray-400">
        Current stage: {stage?.get("name") || "Task"}
      </p>
      <Button handleClick={handleSubmit} primary>
        Submit
      </Button>
    </div>
  );
}
