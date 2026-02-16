import { usePlayer, usePlayers } from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Task } from "./task-design/Task";

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }

  return <Task />;
}
