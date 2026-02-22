import type * as T11 from '@traqula/rules-sparql-1-1';
import {Algebra} from "@traqula/algebra-transformations-1-1";

export type Pattern = T11.Pattern | PatternLateral;
export type PatternLateral = T11.PatternBase & {
  subType: 'lateral';
  patterns: Pattern[];
};

export type Lateral = {
  type: 'lateral';
  input: [Algebra.Operation, Algebra.Operation];
};
