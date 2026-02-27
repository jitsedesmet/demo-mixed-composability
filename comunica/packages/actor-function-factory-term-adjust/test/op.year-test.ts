import { toAlgebra } from '@traqula/algebra-sparql-1-2';
import { Parser } from '@traqula/parser-sparql-1-1-adjust';
import { ActorFunctionFactoryTermAdjust } from '../lib';
import { runFuncTestTable } from './util';
import { dateTyped, dateTimeTyped, dayTimeDurationTyped, timeTyped } from './util/Aliases';
import { Notation } from './util/TestTable';

describe('evaluation of \'ADJUST\'', () => {
  const parser = new Parser({ lexerConfig: { positionTracking: 'full' }});
  runFuncTestTable({
    registeredActors: [
      args => new ActorFunctionFactoryTermAdjust(args),
    ],
    arity: 2,
    notation: Notation.Function,
    toAlgebraParse: query => toAlgebra(parser.parse(query)),
    operation: 'ADJUST',
    testTable: `
    '${dateTyped('2010-06-21Z')}' '${dayTimeDurationTyped('-PT10H')}' = '${dateTyped('2010-06-21Z')}'
    '${dateTimeTyped('2010-06-21T10:00:00Z')}' '${dayTimeDurationTyped('-PT10H')}' = '${dateTimeTyped('2010-06-21T10:00:00Z')}'
    '${timeTyped('10:00:00Z')}' '${dayTimeDurationTyped('-PT10H')}' = '${timeTyped('10:00:00Z')}'
  `,
  });
});
