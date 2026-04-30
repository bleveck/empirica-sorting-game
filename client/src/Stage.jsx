import {
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Result } from "./stages/Result";
import { SwitchDecision } from "./stages/SwitchDecision";

export function Stage() {
  const stage = useStage();
  const stageName = stage?.get("name");

  switch (stageName) {
    case "Result":
      return <Result />;
    case "SwitchDecision":
      return <SwitchDecision />;
    default:
      return <Loading />;
  }
}
