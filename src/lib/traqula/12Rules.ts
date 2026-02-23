import { lex as lex11, gram as gram11 } from '@traqula/rules-sparql-1-1';
import { gram as gram12, lex as lex12 } from '@traqula/rules-sparql-1-2';
import type {FullTraqulaConfig} from "$lib/traqula/types";
import { translateTerm12, translateTripleCollection12, translateTripleNesting12, inScopeVariables, translateAlgTerm12} from '@traqula/algebra-transformations-1-2';

const imports: string[] = [
  "import { lex as lex11, gram as gram11 } from '@traqula/rules-sparql-1-1';",
  "import { lex as lex12, gram as gram12 } from '@traqula/rules-sparql-1-2';",
  "import type * as T12 from '@traqula/rules-sparql-1-2';",
  "import { translateTerm12, translateTripleCollection12, translateTripleNesting12, inScopeVariables, translateAlgTerm12 } from '@traqula/algebra-transformations-1-2';",
];

export const config12: FullTraqulaConfig = {
  lexer: {
    imports,
    toAddBefore: [
      {
        before: lex11.symbols.logicAnd,
        strBefore: "lex11.symbols.logicAnd",
        tokens: [
          lex12.tilde,
          lex12.annotationOpen,
          lex12.annotationClose,
          lex12.tripleTermOpen,
          lex12.tripleTermClose,
          lex12.reificationOpen,
          lex12.reificationClose,
          lex12.version,
        ],
        strTokens: '\n    ' + [
            "lex12.tilde",
            "lex12.annotationOpen",
            "lex12.annotationClose",
            "lex12.tripleTermOpen",
            "lex12.tripleTermClose",
            "lex12.reificationOpen",
            "lex12.reificationClose",
            "lex12.version",
        ].join(',\n    ') + '\n  '
      }, {
        before: lex11.builtIn.langmatches,
        strBefore: "lex11.builtIn.langmatches",
        tokens: [
          lex12.buildInLangDir,
          lex12.buildInStrLangDir,
          lex12.buildInHasLangDir,
          lex12.buildInHasLang,
          lex12.buildInIsTRIPLE,
          lex12.buildInTRIPLE,
          lex12.buildInSUBJECT,
          lex12.buildInPREDICATE,
          lex12.buildInOBJECT,
        ],
        strTokens: '\n    ' + [
          "lex12.buildInLangDir",
          "lex12.buildInStrLangDir",
          "lex12.buildInHasLangDir",
          "lex12.buildInHasLang",
          "lex12.buildInIsTRIPLE",
          "lex12.buildInTRIPLE",
          "lex12.buildInSUBJECT",
          "lex12.buildInPREDICATE",
          "lex12.buildInOBJECT",
        ].join(',\n    ') + '\n  '
      }, {
        before: lex11.terminals.langTag,
        strBefore: "lex11.terminals.langTag",
        tokens: [lex12.LANG_DIR],
        strTokens: "lex12.LANG_DIR",
      }
    ],
    toAdd: [],
    toDelete: [{ token: lex11.terminals.langTag, str: "lex11.terminals.langTag" }],
  },
  parser: {
    imports,
    toAdd: [
      {rule: gram12.reifiedTripleBlock, str: "gram12.reifiedTripleBlock"},
      {rule: gram12.reifiedTripleBlockPath, str: "gram12.reifiedTripleBlockPath"},
      {rule: gram12.reifier, str: "gram12.reifier"},
      {rule: gram12.varOrReifierId, str: "gram12.varOrReifierId"},
      {rule: gram12.annotation, str: "gram12.annotation"},
      {rule: gram12.annotationPath, str: "gram12.annotationPath"},
      {rule: gram12.annotationBlockPath, str: "gram12.annotationBlockPath"},
      {rule: gram12.annotationBlock, str: "gram12.annotationBlock"},
      {rule: gram12.reifiedTriple, str: "gram12.reifiedTriple"},
      {rule: gram12.reifiedTripleSubject, str: "gram12.reifiedTripleSubject"},
      {rule: gram12.reifiedTripleObject, str: "gram12.reifiedTripleObject"},
      {rule: gram12.tripleTerm, str: "gram12.tripleTerm"},
      {rule: gram12.tripleTermSubject, str: "gram12.tripleTermSubject"},
      {rule: gram12.tripleTermObject, str: "gram12.tripleTermObject"},
      {rule: gram12.tripleTermData, str: "gram12.tripleTermData"},
      {rule: gram12.tripleTermDataSubject, str: "gram12.tripleTermDataSubject"},
      {rule: gram12.tripleTermDataObject, str: "gram12.tripleTermDataObject"},
      {rule: gram12.exprTripleTerm, str: "gram12.exprTripleTerm"},
      {rule: gram12.exprTripleTermSubject, str: "gram12.exprTripleTermSubject"},
      {rule: gram12.exprTripleTermObject, str: "gram12.exprTripleTermObject"},
      {rule: gram12.versionDecl, str: "gram12.versionDecl"},
      {rule: gram12.versionSpecifier, str: "gram12.versionSpecifier"},
      {rule: gram12.buildInLangDir, str: "gram12.buildInLangDir"},
      {rule: gram12.buildInLangStrDir, str: "gram12.buildInLangStrDir"},
      {rule: gram12.buildInHasLang, str: "gram12.buildInHasLang"},
      {rule: gram12.buildInHasLangDir, str: "gram12.buildInHasLangDir"},
      {rule: gram12.buildInIsTriple, str: "gram12.buildInIsTriple"},
      {rule: gram12.buildInTriple, str: "gram12.buildInTriple"},
      {rule: gram12.buildInSubject, str: "gram12.buildInSubject"},
      {rule: gram12.buildInPredicate, str: "gram12.buildInPredicate"},
      {rule: gram12.buildInObject, str: "gram12.buildInObject"},
    ],
    toPatch: [
      {rule: gram12.dataBlockValue, str: "gram12.dataBlockValue"},
      {rule: gram12.triplesSameSubject, str: "gram12.triplesSameSubject"},
      {rule: gram12.triplesSameSubjectPath, str: "gram12.triplesSameSubjectPath"},
      {rule: gram12.object, str: "gram12.object"},
      {rule: gram12.objectPath, str: "gram12.objectPath"},
      {rule: gram12.graphNode, str: "gram12.graphNode"},
      {rule: gram12.graphNodePath, str: "gram12.graphNodePath"},
      {rule: gram12.varOrTerm, str: "gram12.varOrTerm"},
      {rule: gram12.primaryExpression, str: "gram12.primaryExpression"},
      {rule: gram12.builtInCall, str: "gram12.builtInCall"},
      {rule: gram12.rdfLiteral, str: "gram12.rdfLiteral"},
      {rule: gram12.unaryExpression, str: "gram12.unaryExpression"},
      {rule: gram12.prologue, str: "gram12.prologue"},
    ],
    toDelete: [{ rule: gram11.graphTerm.name, str: "gram11.graphTerm.name"}],
    context: "T12.SparqlContext"
  },
  generator: {
    imports,
    toAdd: [
      {rule: gram12.tripleTerm, str: "gram12.tripleTerm"},
      {rule: gram12.reifiedTriple, str: "gram12.reifiedTriple"},
      {rule: gram12.annotationBlockPath, str: "gram12.annotationBlockPath"},
      {rule: gram12.annotationPath, str: "gram12.annotationPath"},
      {rule: gram12.versionDecl, str: "gram12.versionDecl"},
    ],
    toPatch: [
      {rule: gram12.prologue, str: "gram12.prologue"},
      {rule: gram12.graphNodePath, str: "gram12.graphNodePath"},
      {rule: gram12.generateTriplesBlock, str: "gram12.generateTriplesBlock"},
      {rule: gram12.generateGraphTerm, str: "gram12.generateGraphTerm"},
    ],
    context: "T12.SparqlGeneratorContext"
  },
  toAlgebra: {
    imports,
    toAdd: [],
    toPatch: [
      { rule: translateTerm12, str: "translateTerm12" },
      { rule: translateTripleCollection12, str: "translateTripleCollection12" },
      { rule: translateTripleNesting12, str: "translateTripleNesting12" },
      { rule: inScopeVariables, str: "inScopeVariables" },
    ],
    context: "AlgebraContext",
  },
  toAst: {
    imports,
    toAdd: [],
    toPatch: [{rule: translateAlgTerm12, str: "translateAlgTerm12"}],
    context: "AstContext",
  }
}
