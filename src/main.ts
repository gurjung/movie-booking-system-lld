import {
  runBuilderDemos,
  runStructuralDemos,
  runBehavioralCoreDemos,
  runCommandDemos,
  runStateDemos,
  runChainAndWorkflowDemos,
} from "./scenarios";

function main(): void {
  runBuilderDemos();
  runStructuralDemos();
  runBehavioralCoreDemos();
  runCommandDemos();
  runStateDemos();
  runChainAndWorkflowDemos();
}

main();
