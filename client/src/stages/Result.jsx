import {
  usePlayer,
  useRound,
  useGame,
  useStageTimer,
} from "@empirica/core/player/classic/react";
import React from "react";
import { GroupComposition } from "../components/GroupComposition";
import { Button } from "../components/Button";

function fmt(n) {
  if (n === undefined || n === null) return "—";
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

export function Result() {
  const player = usePlayer();
  const round = useRound();
  const game = useGame();
  const timer = useStageTimer();

  const composition = round.get("composition");
  const myType = player.round.get("type") || player.get("type");
  const myGroup = player.round.get("group") || player.get("group");
  const groupSize = player.round.get("groupSize");
  const fitPayoff = player.round.get("fitPayoff");
  const congestionCost = player.round.get("congestionCost");
  const payoff = player.round.get("payoff");
  const isTie = player.round.get("isTie");
  const outcome = player.round.get("outcome");
  const score = player.get("score") || 0;

  let remaining = null;
  if (timer?.remaining || timer?.remaining === 0) {
    remaining = Math.ceil(timer.remaining / 1000);
  }

  const submitted = !!player.stage.get("submit");

  function handleContinue() {
    player.stage.set("submit", true);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center space-y-5 py-6 px-4">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-gray-500">This round</p>
        <p className="text-lg text-gray-800">
          You are{" "}
          <span
            className="font-bold"
            style={{ color: myType === "A" ? "#2563eb" : "#ea580c" }}
          >
            type {myType}
          </span>{" "}
          in <span className="font-bold">Group {myGroup}</span>
        </p>
      </div>

      <GroupComposition
        composition={composition}
        myGroup={myGroup}
        myType={myType}
      />

      <div className="w-full max-w-md p-4 bg-gray-50 rounded-xl shadow-sm space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>
            Fit payoff{" "}
            {isTie
              ? "(tie → r/2)"
              : outcome === myType
                ? "(your type wins)"
                : "(opposite type wins)"}
            :
          </span>
          <span className="font-semibold">+{fmt(fitPayoff)}</span>
        </div>
        <div className={`flex justify-between ${congestionCost > 0 ? "text-red-600" : "text-gray-500"}`}>
          <span>Congestion cost (group of {groupSize}):</span>
          <span className="font-semibold">
            {congestionCost > 0 ? `−${fmt(congestionCost)}` : "0"}
          </span>
        </div>
        <div className="border-t pt-1.5 flex justify-between text-base font-bold">
          <span>This round's payoff:</span>
          <span className={payoff < 0 ? "text-red-600" : "text-gray-800"}>
            {payoff >= 0 ? "+" : ""}
            {fmt(payoff)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 pt-1">
          <span>Total score so far:</span>
          <span className="font-mono">{fmt(score)}</span>
        </div>
      </div>

      {submitted ? (
        <div className="text-sm text-gray-500">
          Waiting for other players...{" "}
          {remaining !== null && <span>(~{remaining}s)</span>}
        </div>
      ) : (
        <Button handleClick={handleContinue} primary>
          Continue → Switch decision
        </Button>
      )}
    </div>
  );
}
