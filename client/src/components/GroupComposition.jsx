import React from "react";

function fmtOutcome(group, outcome, isTie) {
  if (group.total === 0) return <span className="text-gray-400">empty</span>;
  if (isTie) {
    return (
      <span className="text-yellow-700">
        Tied (coin flip → {outcome})
      </span>
    );
  }
  return (
    <span className={outcome === "A" ? "text-blue-700" : "text-orange-700"}>
      Majority {outcome}
    </span>
  );
}

function GroupCard({ label, group, outcome, isTie, isMine, myType }) {
  const tie = group.A === group.B && group.total > 0;
  return (
    <div
      className={`flex-1 rounded-lg border-2 px-4 py-3 ${
        isMine ? "border-empirica-500 bg-empirica-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="text-base font-semibold text-gray-800">
          {label}
          {isMine && (
            <span className="ml-2 text-xs uppercase tracking-wide text-empirica-600">
              (you)
            </span>
          )}
        </h4>
        <span className="text-sm font-medium text-gray-500">
          {group.total} player{group.total === 1 ? "" : "s"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-baseline space-x-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${
              myType === "A" ? "ring-2 ring-blue-300" : ""
            }`}
            style={{ backgroundColor: "#2563eb" }}
          />
          <span className="font-mono">
            <span className="font-bold text-blue-700 text-base">{group.A}</span>{" "}
            <span className="text-gray-500">type A</span>
          </span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${
              myType === "B" ? "ring-2 ring-orange-300" : ""
            }`}
            style={{ backgroundColor: "#ea580c" }}
          />
          <span className="font-mono">
            <span className="font-bold text-orange-700 text-base">{group.B}</span>{" "}
            <span className="text-gray-500">type B</span>
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t text-sm">
        Outcome: <span className="font-semibold">{fmtOutcome(group, outcome, isTie ?? tie)}</span>
      </div>
    </div>
  );
}

export function GroupComposition({ composition, myGroup, myType }) {
  if (!composition) return null;
  const { group1, group2, outcome1, outcome2 } = composition;
  return (
    <div className="flex space-x-4 w-full max-w-2xl">
      <GroupCard
        label="Group 1"
        group={group1}
        outcome={outcome1}
        isTie={group1.A === group1.B && group1.total > 0}
        isMine={myGroup === 1}
        myType={myType}
      />
      <GroupCard
        label="Group 2"
        group={group2}
        outcome={outcome2}
        isTie={group2.A === group2.B && group2.total > 0}
        isMine={myGroup === 2}
        myType={myType}
      />
    </div>
  );
}
