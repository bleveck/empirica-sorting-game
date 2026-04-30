import {
  usePlayer,
  useRound,
} from "@empirica/core/player/classic/react";
import React from "react";
import { Timer } from "./components/Timer";

function fmtScore(n) {
  if (n === undefined || n === null) return "0";
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

export function Profile() {
  const player = usePlayer();
  const round = useRound();

  const score = player?.get("score") ?? 0;
  const myType = player?.get("type");
  const myGroup = player?.get("group");

  return (
    <div className="min-w-lg md:min-w-2xl mt-2 mx-auto px-3 py-2 text-gray-500 rounded-md grid grid-cols-3 items-center border-.5">
      <div className="leading-tight ml-1">
        <div className="text-gray-600 font-semibold">
          {round ? round.get("name") : ""}
        </div>
        <div className="text-sm text-gray-400">
          {myType && (
            <span>
              You are{" "}
              <span
                className="font-semibold"
                style={{ color: myType === "A" ? "#2563eb" : "#ea580c" }}
              >
                type {myType}
              </span>
              {myGroup && <> in Group {myGroup}</>}
            </span>
          )}
        </div>
      </div>

      <Timer />

      <div className="flex flex-col items-end">
        <div className="text-xs font-semibold uppercase tracking-wide leading-none text-gray-400">
          Total Score
        </div>
        <div
          className={`text-3xl font-semibold !leading-none tabular-nums ${
            score < 0 ? "text-red-500" : ""
          }`}
        >
          {fmtScore(score)}
        </div>
      </div>
    </div>
  );
}
