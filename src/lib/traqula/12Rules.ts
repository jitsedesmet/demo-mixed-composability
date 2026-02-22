import type {
  ContextWidenGeneric,
  GeneratorToAdd, GeneratorToPatch,
  LexerDelete,
  LexerTokensBefore,
  ParserToAdd
} from "$lib/traqula/types";
import { lex as lex11 } from '@traqula/rules-sparql-1-1';
import { gram as gram12, lex as lex12 } from '@traqula/rules-sparql-1-2';

const parserContext: ContextWidenGeneric = {
  import: "import type * as T12 from '@traqula/rules-sparql-1-2';",
  name: "T12.SparqlContext",
}

const generatorContext: ContextWidenGeneric = {
  import: "import type * as T12 from '@traqula/rules-sparql-1-2';",
  name: "T12.SparqlGeneratorContext"
}


const lexerRulesBefore: LexerTokensBefore = [
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
    strTokens: [
      [
        lex12.tilde,
        lex12.annotationOpen,
        lex12.annotationClose,
        lex12.tripleTermOpen,
        lex12.tripleTermClose,
        lex12.reificationOpen,
        lex12.reificationClose,
        lex12.version,
      ]
    ].join(',\n    ')
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
    strTokens: [
      lex12.buildInLangDir,
      lex12.buildInStrLangDir,
      lex12.buildInHasLangDir,
      lex12.buildInHasLang,
      lex12.buildInIsTRIPLE,
      lex12.buildInTRIPLE,
      lex12.buildInSUBJECT,
      lex12.buildInPREDICATE,
      lex12.buildInOBJECT,
    ].join(',\n    ')
  }, {
    before: lex11.terminals.langTag,
    strBefore: "lex11.terminals.langTag",
    tokens: [lex12.LANG_DIR],
    strTokens: "lex12.LANG_DIR",
  }
]

const deleteTokens: LexerDelete = [
  { token: lex11.terminals.langTag, str: "lex11.terminals.langTag" }
]

const parserRulesToAdd: ParserToAdd = [
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
];

const generatorRulesToAdd: GeneratorToAdd = [
  {rule: gram12.tripleTerm, str: "gram12.tripleTerm"},
  {rule: gram12.reifiedTriple, str: "gram12.reifiedTriple"},
  {rule: gram12.annotationBlockPath, str: "gram12.annotationBlockPath"},
  {rule: gram12.annotationPath, str: "gram12.annotationPath"},
  {rule: gram12.versionDecl, str: "gram12.versionDecl"},
]

const generatorRuleToPatch: GeneratorToPatch = [
  {rule: gram12.prologue, str: "gram12.prologue"},
  {rule: gram12.graphNodePath, str: "gram12.graphNodePath"},
  {rule: gram12.generateTriplesBlock, str: "gram12.generateTriplesBlock"},
  {rule: gram12.generateGraphTerm, str: "gram12.generateGraphTerm"},
]
