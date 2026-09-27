import {
  runBuilderDemos,
  runStructuralDemos,
  runBehavioralCoreDemos,
  runCommandDemos,
  runStateDemos,
  runChainAndWorkflowDemos,
  runExtensionDemos,
} from "./scenarios";

function main(): void {
  runBuilderDemos();
  runStructuralDemos();
  runBehavioralCoreDemos();
  runCommandDemos();
  runStateDemos();
  runChainAndWorkflowDemos();
  runExtensionDemos();
}

main();
