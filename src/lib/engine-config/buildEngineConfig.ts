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

  if (newImports.length === 0) {
    return JSON.stringify(base, null, 2);
  }

  const json = JSON.stringify({ ...base, import: [...newImports, ...base.import] }, null, 2);

  // Insert a blank line between the last new import and the first original import
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lastNewImportJson = escapeRegExp(JSON.stringify(newImports[newImports.length - 1]));
  const firstBaseImportJson = base.import.length > 0 ? escapeRegExp(JSON.stringify(base.import[0])) : null;
  if (!firstBaseImportJson) return json;

  return json.replace(
    new RegExp(`(${lastNewImportJson},)\n([ \\t]+${firstBaseImportJson})`),
    '$1\n\n$2',
  );
}
