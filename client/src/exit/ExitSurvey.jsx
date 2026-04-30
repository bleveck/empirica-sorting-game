import { useGame, usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";

function fmt(n) {
  if (n === undefined || n === null) return "—";
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

export function ExitSurvey({ next }) {
  const labelClassName = "block text-sm font-medium text-gray-700 my-2";
  const inputClassName =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm";

  const player = usePlayer();
  const game = useGame();

  const [strategy, setStrategy] = useState("");
  const [switching, setSwitching] = useState("");
  const [surprises, setSurprises] = useState("");

  const treatment = game.get("treatment") || {};
  const totalRounds = treatment.rounds || 20;
  const switchingCost = treatment.switchingCost ?? 0;
  const totalScore = player.get("score") || 0;
  const endReason = game.get("endReason");

  const roundData = [];
  for (let r = 0; r < totalRounds; r++) {
    const stats = player.get(`roundStats_${r}`);
    if (stats) roundData.push({ round: r + 1, ...stats });
  }

  function handleSubmit(event) {
    event.preventDefault();
    player.set("exitSurvey", { strategy, switching, surprises });
    next();
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Game complete</h2>
      <p className="text-gray-500 mb-2">
        Your total score was{" "}
        <strong className={totalScore < 0 ? "text-red-600" : "text-gray-800"}>
          {fmt(totalScore)} points
        </strong>{" "}
        across {roundData.length} round{roundData.length === 1 ? "" : "s"}.
      </p>
      {endReason === "nash" && (
        <p className="text-sm text-emerald-700 mb-6 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
          The game ended early because the class reached a perfectly sorted equilibrium —
          all type-A players in one group and all type-B players in the other.
        </p>
      )}

      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Round-by-round summary</h3>
        <div className="border rounded-lg overflow-auto max-h-80">
          <table className="w-full text-sm text-center">
            <thead className="sticky top-0">
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-3 py-2">Round</th>
                <th className="px-3 py-2">Your type</th>
                <th className="px-3 py-2">Your group</th>
                <th className="px-3 py-2">Comp (A / B)</th>
                <th className="px-3 py-2">Outcome</th>
                <th className="px-3 py-2">Fit</th>
                <th className="px-3 py-2">Congestion</th>
                <th className="px-3 py-2">Switched?</th>
                <th className="px-3 py-2">Net</th>
              </tr>
            </thead>
            <tbody>
              {roundData.map((rd, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2 font-medium">{rd.round}</td>
                  <td className="px-3 py-2">
                    <span
                      className="font-semibold"
                      style={{ color: rd.type === "A" ? "#2563eb" : "#ea580c" }}
                    >
                      {rd.type}
                    </span>
                  </td>
                  <td className="px-3 py-2">{rd.group}</td>
                  <td className="px-3 py-2 font-mono">
                    {rd.groupA} / {rd.groupB}
                  </td>
                  <td className="px-3 py-2">
                    {rd.isTie ? (
                      <span className="text-yellow-700">tie→{rd.outcome}</span>
                    ) : (
                      <span
                        style={{ color: rd.outcome === "A" ? "#2563eb" : "#ea580c" }}
                      >
                        {rd.outcome}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-700">+{fmt(rd.fitPayoff)}</td>
                  <td className={`px-3 py-2 ${rd.congestionCost > 0 ? "text-red-500" : "text-gray-400"}`}>
                    {rd.congestionCost > 0 ? `−${fmt(rd.congestionCost)}` : "0"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {rd.switched ? (
                      <span className="text-emerald-700">
                        yes{switchingCost > 0 ? ` (−${switchingCost})` : ""}
                      </span>
                    ) : (
                      <span className="text-gray-400">no</span>
                    )}
                  </td>
                  <td
                    className={`px-3 py-2 font-semibold ${
                      rd.payoff - (rd.switchingCostPaid || 0) < 0 ? "text-red-600" : ""
                    }`}
                  >
                    {fmt(rd.payoff - (rd.switchingCostPaid || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Reflection</h3>
          <p className="text-sm text-gray-500 mb-4">
            Three short questions. There are no right or wrong answers.
          </p>
        </div>

        <div>
          <label htmlFor="strategy" className={labelClassName}>
            What was your strategy for choosing whether to stay or switch? Did it change
            over the course of the game?
          </label>
          <textarea
            className={inputClassName}
            id="strategy"
            name="strategy"
            rows={4}
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="switching" className={labelClassName}>
            What information mattered most when you decided to switch (or not)? Group
            size? Type composition? Something else?
          </label>
          <textarea
            className={inputClassName}
            id="switching"
            name="switching"
            rows={4}
            value={switching}
            onChange={(e) => setSwitching(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="surprises" className={labelClassName}>
            Anything that surprised you about how the class behaved?
          </label>
          <textarea
            className={inputClassName}
            id="surprises"
            name="surprises"
            rows={4}
            value={surprises}
            onChange={(e) => setSurprises(e.target.value)}
          />
        </div>

        <div className="mb-12">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
