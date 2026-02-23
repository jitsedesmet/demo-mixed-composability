/* eslint-disable @typescript-eslint/no-explicit-any */
import { LexerBuilder, ParserBuilder, GeneratorBuilder, IndirBuilder } from '@traqula/core';
import { lex as lex11 } from '@traqula/rules-sparql-1-1';
import { sparql11ParserBuilder } from '@traqula/parser-sparql-1-1';
import { sparql11GeneratorBuilder } from '@traqula/generator-sparql-1-1';
import { toAlgebra11Builder, toAst11Builder } from '@traqula/algebra-sparql-1-1';
import type { FullTraqulaConfig } from './types';
import { config12 } from './12Rules';
import { configAdjust } from './adjustRules';
import { configLateral } from './lateral/lateralRules';

const OPTION_TO_CONFIG: Record<string, FullTraqulaConfig> = {
  'SPARQL 1.2': config12,
  'Built-in Adjust': configAdjust,
  'Lateral operation': configLateral,
};

const OPTION_TO_COMMENT: Record<string, string> = {
  'SPARQL 1.2': 'SPARQL 1.2',
  'Built-in Adjust': 'ADJUST',
  'Lateral operation': 'LATERAL',
};

export type ActiveConfig = { label: string; config: FullTraqulaConfig };

export function getActiveConfigs(selected: Set<string>): ActiveConfig[] {
  return [...selected]
    .filter(opt => opt in OPTION_TO_CONFIG)
    .map(opt => ({ label: OPTION_TO_COMMENT[opt], config: OPTION_TO_CONFIG[opt] }));
}

function deduplicateImports(imports: string[]): string[] {
  return [...new Set(imports)];
}

// ========================
// Code string generation
// ========================

export function generateLexerCode(activeConfigs: ActiveConfig[]): string {
  const imports = deduplicateImports([
    "import { LexerBuilder } from '@traqula/core';",
    "import { lex as lex11 } from '@traqula/rules-sparql-1-1';",
    ...activeConfigs.flatMap(({ config }) => config.lexer.imports),
  ]);

  const chain: string[] = [];
  for (const { label, config } of activeConfigs) {
    const configChain: string[] = [];
    for (const { strBefore, strTokens } of config.lexer.toAddBefore) {
      configChain.push(`.addBefore(${strBefore}, ${strTokens})`);
    }
    for (const { str } of config.lexer.toAdd) {
      configChain.push(`.add(${str})`);
    }
    for (const { str } of config.lexer.toDelete) {
      configChain.push(`.delete(${str})`);
    }
    if (configChain.length > 0) {
      chain.push(`// ${label}`, ...configChain);
    }
  }

  const base = 'LexerBuilder.create(lex11.sparql11LexerBuilder)';
  const varDecl = chain.length === 0
    ? `const myLexer = ${base};`
    : `const myLexer = ${base}\n${chain.map(c => `  ${c}`).join('\n')}`;

  return [...imports, '', varDecl].join('\n');
}

export function generateParserCode(activeConfigs: ActiveConfig[]): string {
  const imports = deduplicateImports([
    "import { ParserBuilder } from '@traqula/core';",
    "import { sparql11ParserBuilder } from '@traqula/parser-sparql-1-1';",
    ...activeConfigs.flatMap(({ config }) => config.parser.imports),
  ]);

  const chain: string[] = [];
  for (const { label, config } of activeConfigs) {
    const configChain: string[] = [];
    for (const { str } of config.parser.toAdd) {
      configChain.push(`.addRule(${str})`);
    }
    for (const { str } of config.parser.toPatch) {
      configChain.push(`.patchRule(${str})`);
    }
    for (const { str } of config.parser.toDelete) {
      configChain.push(`.deleteRule(${str})`);
    }
    if (configChain.length > 0) {
      chain.push(`// ${label}`, ...configChain);
    }
  }

  const base = 'ParserBuilder.create(sparql11ParserBuilder)';
  const varDecl = chain.length === 0
    ? `const myParser = ${base};`
    : `const myParser = ${base}\n${chain.map(c => `  ${c}`).join('\n')}`;

  return [...imports, '', varDecl].join('\n');
}

export function generateGeneratorCode(activeConfigs: ActiveConfig[]): string {
  const imports = deduplicateImports([
    "import { GeneratorBuilder } from '@traqula/core';",
    "import { sparql11GeneratorBuilder } from '@traqula/generator-sparql-1-1';",
    ...activeConfigs.flatMap(({ config }) => config.generator.imports),
  ]);

  const chain: string[] = [];
  for (const { label, config } of activeConfigs) {
    const configChain: string[] = [];
    for (const { str } of config.generator.toAdd) {
      configChain.push(`.addRule(${str})`);
    }
    for (const { str } of config.generator.toPatch) {
      configChain.push(`.patchRule(${str})`);
    }
    if (configChain.length > 0) {
      chain.push(`// ${label}`, ...configChain);
    }
  }

  const base = 'GeneratorBuilder.create(sparql11GeneratorBuilder)';
  const varDecl = chain.length === 0
    ? `const myGenerator = ${base};`
    : `const myGenerator = ${base}\n${chain.map(c => `  ${c}`).join('\n')}`;

  return [...imports, '', varDecl].join('\n');
}

export function generateToAlgebraCode(activeConfigs: ActiveConfig[]): string {
  const imports = deduplicateImports([
    "import { IndirBuilder } from '@traqula/core';",
    "import { toAlgebra11Builder } from '@traqula/algebra-sparql-1-1';",
    ...activeConfigs.flatMap(({ config }) => config.toAlgebra.imports),
  ]);

  const chain: string[] = [];
  for (const { label, config } of activeConfigs) {
    const configChain: string[] = [];
    for (const { str } of config.toAlgebra.toAdd) {
      configChain.push(`.addRule(${str})`);
    }
    for (const { str } of config.toAlgebra.toPatch) {
      configChain.push(`.patchRule(${str})`);
    }
    if (configChain.length > 0) {
      chain.push(`// ${label}`, ...configChain);
    }
  }

  const base = 'IndirBuilder.create(toAlgebra11Builder)';
  const varDecl = chain.length === 0
    ? `const myToAlgebra = ${base};`
    : `const myToAlgebra = ${base}\n${chain.map(c => `  ${c}`).join('\n')}`;

  return [...imports, '', varDecl].join('\n');
}

export function generateToAstCode(activeConfigs: ActiveConfig[]): string {
  const imports = deduplicateImports([
    "import { IndirBuilder } from '@traqula/core';",
    "import { toAst11Builder } from '@traqula/algebra-sparql-1-1';",
    ...activeConfigs.flatMap(({ config }) => config.toAst.imports),
  ]);

  const chain: string[] = [];
  for (const { label, config } of activeConfigs) {
    const configChain: string[] = [];
    for (const { str } of config.toAst.toAdd) {
      configChain.push(`.addRule(${str})`);
    }
    for (const { str } of config.toAst.toPatch) {
      configChain.push(`.patchRule(${str})`);
    }
    if (configChain.length > 0) {
      chain.push(`// ${label}`, ...configChain);
    }
  }

  const base = 'IndirBuilder.create(toAst11Builder)';
  const varDecl = chain.length === 0
    ? `const myToAst = ${base};`
    : `const myToAst = ${base}\n${chain.map(c => `  ${c}`).join('\n')}`;

  return [...imports, '', varDecl].join('\n');
}

// ========================
// Actual component builders
// ========================

export function buildLexer(activeConfigs: ActiveConfig[]): LexerBuilder {
  let builder: any = LexerBuilder.create(lex11.sparql11LexerBuilder);
  for (const { config } of activeConfigs) {
    for (const { before, tokens } of config.lexer.toAddBefore) {
      builder = (builder as any).addBefore(before, ...tokens);
    }
    for (const { token } of config.lexer.toAdd) {
      builder = (builder as any).add(token);
    }
    for (const { token } of config.lexer.toDelete) {
      builder = (builder as any).delete(token);
    }
  }
  return builder as LexerBuilder;
}

export function buildParser(activeConfigs: ActiveConfig[], lexer: LexerBuilder) {
  let builder: any = ParserBuilder.create(sparql11ParserBuilder);
  for (const { config } of activeConfigs) {
    for (const { rule } of config.parser.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.parser.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
    for (const { rule } of config.parser.toDelete) {
      builder = (builder as any).deleteRule(rule);
    }
  }
  return (builder as any).build({ tokenVocabulary: lexer.tokenVocabulary });
}

export function buildGenerator(activeConfigs: ActiveConfig[]) {
  let builder: any = GeneratorBuilder.create(sparql11GeneratorBuilder);
  for (const { config } of activeConfigs) {
    for (const { rule } of config.generator.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.generator.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}

export function buildToAlgebra(activeConfigs: ActiveConfig[]) {
  let builder: any = IndirBuilder.create(toAlgebra11Builder);
  for (const { config } of activeConfigs) {
    for (const { rule } of config.toAlgebra.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.toAlgebra.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}

export function buildToAst(activeConfigs: ActiveConfig[]) {
  let builder: any = IndirBuilder.create(toAst11Builder);
  for (const { config } of activeConfigs) {
    for (const { rule } of config.toAst.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.toAst.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}
