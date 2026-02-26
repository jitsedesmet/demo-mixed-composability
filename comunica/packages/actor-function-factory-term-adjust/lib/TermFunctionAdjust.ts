import { TermFunctionBase } from '@comunica/bus-function-factory';
import type { DateLiteral, DayTimeDurationLiteral } from '@comunica/utils-expression-evaluator';
import { declare, integer, TypeURL } from '@comunica/utils-expression-evaluator';

/**
 * https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md
 * https://www.w3.org/TR/xpath-functions/#func-adjust-dateTime-to-timezone
 */
export class TermFunctionAdjust extends TermFunctionBase {
  public constructor() {
    super({
      arity: 1,
      operator: 'adjust',
      overloads: declare('adjust')
        // ExprEval.context.getSafe(KeysExpressionEvaluator.defaultTimeZone)
        .set([ TypeURL.XSD_DATE_TIME ], () => ([ date ]: [DateLiteral]) =>
          integer(date.typedValue.year))
        .set([ TypeURL.XSD_DATE_TIME, TypeURL.XSD_DAY_TIME_DURATION ], () =>
          ([ date, timezone ]: [DateLiteral, DayTimeDurationLiteral]) => integer(date.typedValue.year))
        .collect(),
    });
  }
}
