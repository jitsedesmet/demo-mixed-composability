import {lex as lex11} from '@traqula/rules-sparql-1-1';
import { gram as gramAdj, lex as lexAdj } from '@traqula/rules-sparql-1-1-adjust';
import type {LexerTokensBefore, ParserToAdd, ParserToPatch} from "$lib/traqula/types";

export const importsNeeded: string[] = [
  "import { lexAdj as l11 } from '@traqula/rules-sparql-1-1';",
  "import { gramAdj, lexAdj } from '@traqula/rules-sparql-1-1-adjust';"
]

export const lexerRulesToAddAndBefore: LexerTokensBefore = <const> [{
  before: lex11.a,
  strBefore: "lex11.a",
  tokens: [lexAdj.BuiltInAdjust],
  strTokens: "lexAdj.BuiltInAdjust",
}]

export const parserRulesToAdd: ParserToAdd = <const> [
  { rule: gramAdj.builtInAdjust, str: "gramAdj.builtInAdjust" }
];

export const parserRulesToPatch: ParserToPatch = <const> [
  { rule: gramAdj.builtInPatch, str: "gramAdj.builtInPatch" }
]

// No changes required for generator or transformer
