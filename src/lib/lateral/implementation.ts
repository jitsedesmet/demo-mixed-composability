import { createToken, IndirBuilder, LexerBuilder, type RuleDefReturn } from '@traqula/core';
import {Algebra, type AlgebraIndir, type AstIndir} from '@traqula/algebra-transformations-1-1'
import type * as T11 from '@traqula/rules-sparql-1-1';
import {lex as lex11} from '@traqula/rules-sparql-1-1';
import { ParserBuilder } from '@traqula/core';
import type {Lateral, Pattern, PatternLateral} from "./treeTypes";
import {toAlgebra11Builder, toAst11Builder} from "@traqula/algebra-sparql-1-1";
import {sparql11ParserBuilder} from "@traqula/parser-sparql-1-1";
import {sparql11GeneratorBuilder} from "@traqula/generator-sparql-1-1";

// ===============================
//  ========= Lexer ==============
// ===============================

const lateral = createToken({
  name: 'Lateral',
  pattern: /lateral/i,
  label: 'Lateral pattern'
});

// ===============================
// ========== Parser =============
// ===============================


// grammatically, union and minus are alike

// Retrieve the original implementation of the rules we replace so we can call them later
const origGraphPatternNotTriplesParserRule = sparql11ParserBuilder
  .getRule('graphPatternNotTriples');
const origGraphPatternNotTriplesGeneratorRule = sparql11GeneratorBuilder
  .getRule('graphPatternNotTriples');
const origGroupGraphPatternParserRule = sparql11ParserBuilder
  .getRule('groupGraphPattern');
const origGroupGraphPatternGeneratorRule = sparql11GeneratorBuilder
  .getRule('groupGraphPattern');

const graphPatternNotTriples: T11.SparqlRule<
  typeof origGraphPatternNotTriplesParserRule['name'],
  RuleDefReturn<typeof origGraphPatternNotTriplesParserRule> | PatternLateral
> = {
  name: 'graphPatternNotTriples',
  impl: $ => C => $.OR2<RuleDefReturn<typeof graphPatternNotTriples>>([
    { ALT: () => $.SUBRULE(lateralGraphPattern) },
    { ALT: () => origGraphPatternNotTriplesParserRule.impl($)(C) },
  ]),
  gImpl: ($) => (ast, C) => {
    if (ast.subType === 'lateral') {
      $.SUBRULE(lateralGraphPattern, ast)
    } else {
      origGraphPatternNotTriplesGeneratorRule.gImpl($)(ast, C);
    }
  }
};

const lateralGraphPattern: T11.SparqlRule<'lateralGraphPattern', PatternLateral> = {
  name: 'lateralGraphPattern',
  impl: ({ CONSUME, SUBRULE, ACTION }) => (C) => {
    const token = CONSUME(lateral);
    const group = SUBRULE(origGroupGraphPatternParserRule);
    return ACTION(() => ({
      type: 'pattern',
      subType: 'lateral',
      patterns: group.patterns,
      loc: C.astFactory.sourceLocation(token, group),
    } satisfies PatternLateral));
  },
  gImpl: ({ SUBRULE, PRINT_WORD }) => (ast, {astFactory: F}) => {
    F.printFilter(ast, () => PRINT_WORD('LATERAL'));
    SUBRULE(origGroupGraphPatternGeneratorRule, F.patternGroup(<T11.Pattern[]> ast.patterns, ast.loc));
  }
};


// ===============================
// ========== Algebra ============
// ===============================

// toAlgebra

const origTranslateGraphPattern = toAlgebra11Builder.getRule('translateGraphPattern');
const origAccumulateGroupGraphPattern = toAlgebra11Builder.getRule('accumulateGroupGraphPattern');

export const accumulateGroupGraphPattern: AlgebraIndir<'accumulateGroupGraphPattern', Algebra.Operation | Lateral, [Algebra.Operation, Pattern]> = {
  name: 'accumulateGroupGraphPattern',
  fun: $ => (C, algebraOp, pattern) => {
    // If the subtype is lateral, handle it, otherwise fall though to the original implementation
    if (pattern.subType === 'lateral') {
      return {
        type: 'lateral',
        input: [
          algebraOp,
          $.SUBRULE(origTranslateGraphPattern, C.astFactory.patternGroup(<never[]> pattern.patterns, pattern.loc)),
        ],
      } satisfies Lateral;
    }else {
      return origAccumulateGroupGraphPattern.fun($)(C, algebraOp, pattern);
    }
  },
};

// fromAlgebra
const origTranslateAlgPatternNew = toAst11Builder.getRule('translatePatternNew');
const origOperationAlgInputAsPatternList = toAst11Builder.getRule('operationInputAsPatternList');

export const translateAlgPatternNewReplace: AstIndir<
  (typeof origTranslateAlgPatternNew)['name'],
  Pattern | Pattern[],
  [Algebra.Operation | Lateral]
> = {
  name: 'translatePatternNew',
  fun: ($) => (C, op) => {
    if (op.type === 'lateral') {
      return $.SUBRULE(translateAlgLateral, op)
    } else {
      return origTranslateAlgPatternNew.fun($)(C, op);
    }
  }
}

export const translateAlgLateral: AstIndir<'translateLateral', Pattern[], [Lateral]> = {
  name: 'translateLateral',
  fun: ({ SUBRULE }) => ({ astFactory: F }, op) =>
    [
      SUBRULE(translateAlgPatternNewReplace, op.input[0]),
      {
        type: 'pattern',
        subType: 'lateral',
        patterns: SUBRULE(origOperationAlgInputAsPatternList, op.input[1]),
        loc: F.gen(),
      } satisfies PatternLateral
    ].flat(),
};


export const lateralAlgebraBuilder = IndirBuilder
  .create(toAlgebra11Builder)
  .patchRule(accumulateGroupGraphPattern);

export const lateralAstBuilder = IndirBuilder
  .create(toAst11Builder)
  .addRule(translateAlgLateral)
  .patchRule(translateAlgPatternNewReplace);


export const lateralLexer = LexerBuilder
  .create(lex11.sparql11LexerBuilder)
  .add(lateral);

export const lateralParserBuilder = ParserBuilder.create(sparql11ParserBuilder)
  .patchRule(graphPatternNotTriples)
  .addRule(lateralGraphPattern);



