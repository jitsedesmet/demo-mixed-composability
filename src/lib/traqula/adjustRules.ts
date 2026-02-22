import {lex as lex11} from '@traqula/rules-sparql-1-1';
import { gram as gramAdj, lex as lexAdj } from '@traqula/rules-sparql-1-1-adjust';
import type {FullTraqulaConfig} from "$lib/traqula/types";

const imports: string[] = [
  "import { lex as lex11 } from '@traqula/rules-sparql-1-1';",
  "import { gram as gramAdj, lex as lexAdj } from '@traqula/rules-sparql-1-1-adjust';"
];

export const configAdjust: FullTraqulaConfig = <const> {
  lexer: {
    imports,
    toAddBefore: <const> [{
      before: lex11.a,
      strBefore: "lex11.a",
      tokens: [lexAdj.BuiltInAdjust],
      strTokens: "lexAdj.BuiltInAdjust",
    }],
    toAdd: [],
    toDelete: [],
  },
  parser: {
    imports,
    toAdd: <const> [
      { rule: gramAdj.builtInAdjust, str: "gramAdj.builtInAdjust" }
    ],
    toPatch:  <const> [
      { rule: gramAdj.builtInPatch, str: "gramAdj.builtInPatch" }
    ],
    toDelete: [],
  },
// No changes required for generator or transformers
  generator: {
    imports: [],
    toAdd: [],
    toPatch: [],
  },
  toAlgebra: {
    imports: [],
    toAdd: [],
    toPatch: [],
  },
  toAst: {
    imports: [],
    toAdd: [],
    toPatch: [],
  }
}
