/* eslint-disable @typescript-eslint/no-explicit-any */
import type {NamedToken} from "@traqula/core";
import type {SparqlGeneratorRule as SparqlGeneratorRule11, SparqlGrammarRule as SparqlGrammarRule11} from "@traqula/rules-sparql-1-1";
import type {SparqlGeneratorRule as SparqlGeneratorRule12, SparqlGrammarRule as SparqlGrammarRule12} from "@traqula/rules-sparql-1-2";
import type {AlgebraIndir as AlgebraIndir11, AstIndir as AstIndir11} from "@traqula/algebra-transformations-1-1";
import type {AlgebraIndir as AlgebraIndir12, AstIndir as AstIndir12} from "@traqula/algebra-transformations-1-2";

export type SparqlGrammarRule = SparqlGrammarRule11<string, any, any> | SparqlGrammarRule12<string, any, any>;
export type SparqlGeneratorRule = SparqlGeneratorRule11<string, any, any> | SparqlGeneratorRule12<string, any, any>;
export type AlgebraIndir = AlgebraIndir11<string, any, any> | AlgebraIndir12<string, any, any>;
export type AstIndir = AstIndir11<string, any, any> | AstIndir12<string, any, any>;


export type LexerConfig = {
  imports: string[];
  toAdd: { token: NamedToken, str: string}[];
  toAddBefore: {before: NamedToken, tokens: NamedToken[], strBefore: string, strTokens: string}[];
  toDelete: { token: NamedToken, str: string}[];
}

export type ParserConfig = {
  imports: string[];
  toAdd: { rule:  SparqlGrammarRule, str: string }[];
  toDelete: { rule:  string, str: string }[];
  toPatch: { rule:  SparqlGrammarRule, str: string }[];
  // to provide to widencontext
  context?: string;
}

export type GeneratorConfig = {
  imports: string[];
  toAdd: { rule:  SparqlGeneratorRule, str: string }[];
  toPatch: { rule:  SparqlGeneratorRule, str: string }[];
  // toProvide ToWidenContext
  context?: string
}

export type ToAlgebraConfig = {
  imports: string[];
  toAdd: { rule:  AlgebraIndir, str: string }[];
  toPatch: { rule:  AlgebraIndir, str: string }[];
  context?: string
}

export type ToAstConfig = {
  imports: string[];
  toAdd: { rule: AstIndir, str: string }[];
  toPatch: { rule: AstIndir, str: string }[];
  context?: string
}

export type FullTraqulaConfig = {
  lexer: LexerConfig;
  parser: ParserConfig;
  generator: GeneratorConfig
  toAlgebra: ToAlgebraConfig;
  toAst: ToAstConfig;
}

