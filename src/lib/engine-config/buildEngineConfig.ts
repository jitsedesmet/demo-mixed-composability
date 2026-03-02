import type { FileDescriptions } from "./engineConfTypes";
import { adjustDescriptions } from "./adjust";
import { sparql12Descriptions } from "./sparql12";
import { lateralDescriptions } from "./lateral";

const OPTION_TO_DESCRIPTIONS: Record<string, FileDescriptions> = {
  'SPARQL 1.2': sparql12Descriptions,
  'Built-in Adjust': adjustDescriptions,
  'Lateral operation': lateralDescriptions,
};

export function getActiveEngineDescriptions(selected: Set<string>): FileDescriptions {
  return [...selected]
    .filter(opt => opt in OPTION_TO_DESCRIPTIONS)
    .flatMap(opt => OPTION_TO_DESCRIPTIONS[opt]);
}

export function generateConfigDefault(activeDescriptions: FileDescriptions, baseConfigText: string): string {
  const base = JSON.parse(baseConfigText);
  const newImports = activeDescriptions
    .filter(d => d.prefixForImport)
    .map(d => `${d.prefixForImport}/${d.name}`);
  return JSON.stringify({ ...base, import: [...newImports, ...base.import] }, null, 2);
}
