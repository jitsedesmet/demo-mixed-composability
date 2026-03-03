import type {FullTraqulaConfig} from "$lib/traqula/types";
import {
  accumulateGroupGraphPattern,
  graphPatternNotTriples,
  inScopeVariablesWithLateral,
  lateral,
  lateralGraphPattern,
  translateAlgLateral,
  translateAlgPatternNewReplace
} from "./implementation";


export const imports: string[] = [
  "import { lex as lex11 } from '@traqula/rules-sparql-1-1';",
  "import { gram as gramLat, lexLat } from '@traqula/rules-sparql-1-1-lateral';"
];


export const configLateral: FullTraqulaConfig = {
  lexer: {
    imports,
    toAdd: [
      { token: lateral, str: 'lexLat.lateral' },
    ],
    toAddBefore: [],
    toDelete: [],
  },
  parser: {
    imports,
    toAdd: [{rule: lateralGraphPattern, str: 'gramLat.lateralGraphPattern'}],
    toPatch: [{rule: graphPatternNotTriples, str: 'gramLat.graphPatternNotTriples'}],
    toDelete: [],
  },
  generator: {
    imports,
    toAdd: [{rule: lateralGraphPattern, str: 'gramLat.lateralGraphPattern'}],
    toPatch: [{rule: graphPatternNotTriples, str: 'gramLat.graphPatternNotTriples'}],
  },
  toAlgebra: {
    imports,
    toAdd: [],
    toPatch: [
      { rule: accumulateGroupGraphPattern, str: 'gramLat.accumulateGroupGraphPattern' },
      { rule: inScopeVariablesWithLateral, str: 'gramLat.inScopeVariablesWithLateral' },
    ]
  },
  toAst: {
    imports,
    toAdd: [{ rule: translateAlgLateral, str: 'gramLat.translateAlgLateral' }],
    toPatch: [{ rule: translateAlgPatternNewReplace, str: 'gramLat.translateAlgPatternNewReplace' }],
  }
}

