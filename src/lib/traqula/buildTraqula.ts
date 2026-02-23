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

export function getActiveConfigs(selected: Set<string>): FullTraqulaConfig[] {
  return [...selected]
    .filter(opt => opt in OPTION_TO_CONFIG)
    .map(opt => OPTION_TO_CONFIG[opt]);
}

function deduplicateImports(imports: string[]): string[] {
  return [...new Set(imports)];
}

// ========================
// Code string generation
// ========================

export function generateLexerCode(configs: FullTraqulaConfig[]): string {
  const imports = deduplicateImports([
    "import { LexerBuilder } from '@traqula/core';",
    "import { lex as lex11 } from '@traqula/rules-sparql-1-1';",
    ...configs.flatMap(c => c.lexer.imports),
  ]);

  const chain: string[] = [];
  for (const config of configs) {
    for (const { strBefore, strTokens } of config.lexer.toAddBefore) {
      chain.push(`.addBefore(${strBefore}, ${strTokens})`);
    }
    for (const { str } of config.lexer.toAdd) {
      chain.push(`.add(${str})`);
    }
    for (const { str } of config.lexer.toDelete) {
      chain.push(`.delete(${str})`);
    }
  }

  const base = 'LexerBuilder.create(lex11.sparql11LexerBuilder)';
  const varDecl = chain.length === 0
    ? `const myLexer = ${base};`
    : `const myLexer = ${base}\n${chain.map(c => `  ${c}`).join('\n')};`;

  return [...imports, '', varDecl].join('\n');
}

export function generateParserCode(configs: FullTraqulaConfig[]): string {
  const imports = deduplicateImports([
    "import { ParserBuilder } from '@traqula/core';",
    "import { sparql11ParserBuilder } from '@traqula/parser-sparql-1-1';",
    "import { lex as lex11 } from '@traqula/rules-sparql-1-1';",
    ...configs.flatMap(c => c.parser.imports),
  ]);

  const chain: string[] = [];
  for (const config of configs) {
    for (const { str } of config.parser.toAdd) {
      chain.push(`.addRule(${str})`);
    }
    for (const { str } of config.parser.toPatch) {
      chain.push(`.patchRule(${str})`);
    }
    for (const { str } of config.parser.toDelete) {
      chain.push(`.deleteRule(${str})`);
    }
  }
  chain.push(`.build({ tokenVocabulary: myLexer.tokenVocabulary })`);

  const base = 'ParserBuilder.create(sparql11ParserBuilder)';
  const varDecl = `const myParser = ${base}\n${chain.map(c => `  ${c}`).join('\n')};`;

  return [...imports, '', varDecl].join('\n');
}

export function generateGeneratorCode(configs: FullTraqulaConfig[]): string {
  const imports = deduplicateImports([
    "import { GeneratorBuilder } from '@traqula/core';",
    "import { sparql11GeneratorBuilder } from '@traqula/generator-sparql-1-1';",
    ...configs.flatMap(c => c.generator.imports),
  ]);

  const chain: string[] = [];
  for (const config of configs) {
    for (const { str } of config.generator.toAdd) {
      chain.push(`.addRule(${str})`);
    }
    for (const { str } of config.generator.toPatch) {
      chain.push(`.patchRule(${str})`);
    }
  }
  chain.push(`.build()`);

  const base = 'GeneratorBuilder.create(sparql11GeneratorBuilder)';
  const varDecl = `const myGenerator = ${base}\n${chain.map(c => `  ${c}`).join('\n')};`;

  return [...imports, '', varDecl].join('\n');
}

export function generateToAlgebraCode(configs: FullTraqulaConfig[]): string {
  const imports = deduplicateImports([
    "import { IndirBuilder } from '@traqula/core';",
    "import { toAlgebra11Builder } from '@traqula/algebra-sparql-1-1';",
    ...configs.flatMap(c => c.toAlgebra.imports),
  ]);

  const chain: string[] = [];
  for (const config of configs) {
    for (const { str } of config.toAlgebra.toAdd) {
      chain.push(`.addRule(${str})`);
    }
    for (const { str } of config.toAlgebra.toPatch) {
      chain.push(`.patchRule(${str})`);
    }
  }
  chain.push(`.build()`);

  const base = 'IndirBuilder.create(toAlgebra11Builder)';
  const varDecl = `const myToAlgebra = ${base}\n${chain.map(c => `  ${c}`).join('\n')};`;

  return [...imports, '', varDecl].join('\n');
}

export function generateToAstCode(configs: FullTraqulaConfig[]): string {
  const imports = deduplicateImports([
    "import { IndirBuilder } from '@traqula/core';",
    "import { toAst11Builder } from '@traqula/algebra-sparql-1-1';",
    ...configs.flatMap(c => c.toAst.imports),
  ]);

  const chain: string[] = [];
  for (const config of configs) {
    for (const { str } of config.toAst.toAdd) {
      chain.push(`.addRule(${str})`);
    }
    for (const { str } of config.toAst.toPatch) {
      chain.push(`.patchRule(${str})`);
    }
  }
  chain.push(`.build()`);

  const base = 'IndirBuilder.create(toAst11Builder)';
  const varDecl = `const myToAst = ${base}\n${chain.map(c => `  ${c}`).join('\n')};`;

  return [...imports, '', varDecl].join('\n');
}

// ========================
// Actual component builders
// ========================

export function buildLexer(configs: FullTraqulaConfig[]): LexerBuilder {
  let builder: any = LexerBuilder.create(lex11.sparql11LexerBuilder);
  for (const config of configs) {
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

export function buildParser(configs: FullTraqulaConfig[], lexer: LexerBuilder) {
  let builder: any = ParserBuilder.create(sparql11ParserBuilder);
  for (const config of configs) {
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

export function buildGenerator(configs: FullTraqulaConfig[]) {
  let builder: any = GeneratorBuilder.create(sparql11GeneratorBuilder);
  for (const config of configs) {
    for (const { rule } of config.generator.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.generator.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}

export function buildToAlgebra(configs: FullTraqulaConfig[]) {
  let builder: any = IndirBuilder.create(toAlgebra11Builder);
  for (const config of configs) {
    for (const { rule } of config.toAlgebra.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.toAlgebra.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}

export function buildToAst(configs: FullTraqulaConfig[]) {
  let builder: any = IndirBuilder.create(toAst11Builder);
  for (const config of configs) {
    for (const { rule } of config.toAst.toAdd) {
      builder = (builder as any).addRule(rule);
    }
    for (const { rule } of config.toAst.toPatch) {
      builder = (builder as any).patchRule(rule);
    }
  }
  return (builder as any).build();
}
