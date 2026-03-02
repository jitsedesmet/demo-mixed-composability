import type { FileDescriptions } from "./engineConfTypes";
import { adjustDescriptions } from "./adjust";
import { sparql12Descriptions } from "./sparql12";
import { lateralDescriptions } from "./lateral";

const OPTION_TO_DESCRIPTIONS: Record<string, FileDescriptions> = {
  'SPARQL 1.2': sparql12Descriptions,
  'Built-in Adjust': adjustDescriptions,
  'Lateral operation': lateralDescriptions,
};

const BASE_CONFIG_IMPORTS = [
  "ccqs:config/bindings-aggregator-factory/actors.json",
  "ccqs:config/bindings-aggregator-factory/mediators.json",
  "ccqs:config/context-preprocess/actors.json",
  "ccqs:config/context-preprocess/mediators.json",
  "ccqs:config/expression-evaluator-factory/actors.json",
  "ccqs:config/expression-evaluator-factory/mediators.json",
  "lcqs:config/function-factory/actors.json",
  "lcqs:config/function-factory/bus.json",
  "lcqs:config/function-factory/mediators.json",
  "ccqs:config/hash-bindings/actors.json",
  "ccqs:config/hash-bindings/mediators.json",
  "ccqs:config/hash-quads/actors.json",
  "ccqs:config/hash-quads/mediators.json",
  "ccqs:config/http/actors.json",
  "ccqs:config/http/mediators.json",
  "ccqs:config/http-invalidate/actors.json",
  "ccqs:config/http-invalidate/mediators.json",
  "ccqs:config/init/actors.json",
  "ccqs:config/merge-bindings-context/actors.json",
  "ccqs:config/merge-bindings-context/mediators.json",
  "ccqs:config/optimize-query-operation/actors.json",
  "ccqs:config/optimize-query-operation/mediators.json",
  "ccqs:config/query-operation/actors.json",
  "ccqs:config/query-operation/mediators.json",
  "lcqs:config/query-parse/actors.json",
  "ccqs:config/query-parse/mediators.json",
  "ccqs:config/query-process/actors.json",
  "ccqs:config/query-process/mediators.json",
  "ccqs:config/query-result-serialize/actors.json",
  "ccqs:config/query-result-serialize/mediators.json",
  "ccqs:config/query-serialize/actors.json",
  "ccqs:config/query-serialize/mediators.json",
  "ccqs:config/query-source-dereference-link/actors.json",
  "ccqs:config/query-source-dereference-link/mediators.json",
  "ccqs:config/query-source-identify/actors.json",
  "ccqs:config/query-source-identify/mediators.json",
  "ccqs:config/query-source-identify-hypermedia/actors.json",
  "ccqs:config/query-source-identify-hypermedia/mediators.json",
  "ccqs:config/dereference/actors.json",
  "ccqs:config/dereference/mediators.json",
  "ccqs:config/dereference-rdf/actors.json",
  "ccqs:config/dereference-rdf/mediators.json",
  "ccqs:config/rdf-join/actors.json",
  "ccqs:config/rdf-join/mediators.json",
  "ccqs:config/rdf-join-entries-sort/actors.json",
  "ccqs:config/rdf-join-entries-sort/mediators.json",
  "ccqs:config/rdf-join-selectivity/actors.json",
  "ccqs:config/rdf-join-selectivity/mediators.json",
  "ccqs:config/rdf-metadata/actors.json",
  "ccqs:config/rdf-metadata/mediators.json",
  "ccqs:config/rdf-metadata-accumulate/actors.json",
  "ccqs:config/rdf-metadata-accumulate/mediators.json",
  "ccqs:config/rdf-metadata-extract/actors.json",
  "ccqs:config/rdf-metadata-extract/mediators.json",
  "ccqs:config/rdf-parse/actors.json",
  "ccqs:config/rdf-parse/mediators.json",
  "ccqs:config/rdf-parse-html/actors.json",
  "ccqs:config/rdf-resolve-hypermedia-links/actors.json",
  "ccqs:config/rdf-resolve-hypermedia-links/mediators.json",
  "ccqs:config/rdf-resolve-hypermedia-links-queue/actors.json",
  "ccqs:config/rdf-resolve-hypermedia-links-queue/mediators.json",
  "ccqs:config/rdf-serialize/actors.json",
  "ccqs:config/rdf-serialize/mediators.json",
  "ccqs:config/rdf-update-hypermedia/actors.json",
  "ccqs:config/rdf-update-hypermedia/mediators.json",
  "ccqs:config/rdf-update-quads/actors.json",
  "ccqs:config/rdf-update-quads/mediators.json",
  "ccqs:config/term-comparator-factory/actors.json",
  "ccqs:config/term-comparator-factory/mediators.json",
];

const LSD_CONFIG_VERSION = '^5.0.0';

const BASE_CONFIG_CONTEXT = [
  `https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/${LSD_CONFIG_VERSION}/components/context.jsonld`,
  `https://linkedsoftwaredependencies.org/bundles/npm/@local/config-query-sparql/${LSD_CONFIG_VERSION}/components/context.jsonld`,
];

export function getActiveEngineDescriptions(selected: Set<string>): FileDescriptions {
  return [...selected]
    .filter(opt => opt in OPTION_TO_DESCRIPTIONS)
    .flatMap(opt => OPTION_TO_DESCRIPTIONS[opt]);
}

export function generateConfigDefault(activeDescriptions: FileDescriptions): string {
  const newImports = activeDescriptions.map(d => `${d.prefixForImport}/${d.name}`);
  const config = {
    "@context": BASE_CONFIG_CONTEXT,
    "import": [...newImports, ...BASE_CONFIG_IMPORTS],
  };
  return JSON.stringify(config, null, 2);
}
