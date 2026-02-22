import type {NamedToken} from "@traqula/core";
import type {SparqlGeneratorRule as SparqlGeneratorRule11, SparqlGrammarRule as SparqlGrammarRule11} from "@traqula/rules-sparql-1-1";
import type {SparqlGeneratorRule as SparqlGeneratorRule12, SparqlGrammarRule as SparqlGrammarRule12} from "@traqula/rules-sparql-1-2";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SparqlGrammarRule = SparqlGrammarRule11<string, any, any> | SparqlGrammarRule12<string, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SparqlGeneratorRule = SparqlGeneratorRule11<string, any, any> | SparqlGeneratorRule12<string, any, any>;
export type LexerTokensBefore ={before: NamedToken, tokens: NamedToken[], strBefore: string, strTokens: string}[];
export type LexerDelete = { token: NamedToken, str: string}[];

export type ImportsNeeded = string[];
export type ParserToAdd = { rule:  SparqlGrammarRule, str: string }[];
export type ParserToPatch = { rule:  SparqlGrammarRule, str: string }[];

export type GeneratorToAdd = { rule:  SparqlGeneratorRule, str: string }[];
export type GeneratorToPatch = { rule:  SparqlGeneratorRule, str: string }[];


export type ContextWidenGeneric = { import: string; name: string };
