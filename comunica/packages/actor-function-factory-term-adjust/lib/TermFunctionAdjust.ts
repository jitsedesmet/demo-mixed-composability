import { TermFunctionBase } from '@comunica/bus-function-factory';
import type { DayTimeDurationLiteral } from '@comunica/utils-expression-evaluator';
import { DateTimeLiteral, declare, TypeURL, DateLiteral, TimeLiteral } from '@comunica/utils-expression-evaluator';

/**
 * https://github.com/w3c/sparql-dev/blob/main/SEP/SEP-0002/sep-0002.md
 * https://www.w3.org/TR/xpath-functions/#func-adjust-dateTime-to-timezone
 */
export class TermFunctionAdjust extends TermFunctionBase {
  public constructor() {
    super({
      arity: 2,
      operator: 'adjust',
      overloads: declare('adjust')
        // ExprEval.context.getSafe(KeysExpressionEvaluator.defaultTimeZone)
        .set(
          [ TypeURL.XSD_DATE_TIME, TypeURL.XSD_DAY_TIME_DURATION ],
          () =>
            ([ date, timezone ]: [DateTimeLiteral, DayTimeDurationLiteral]) =>
              new DateTimeLiteral({ ...date.typedValue }),
        ).set(
          [ TypeURL.XSD_DATE, TypeURL.XSD_DAY_TIME_DURATION ],
          () => ([ date, timezone ]: [DateLiteral, DayTimeDurationLiteral]) =>
            new DateLiteral({ ...date.typedValue }),
        ).set(
          [ TypeURL.XSD_TIME, TypeURL.XSD_DAY_TIME_DURATION ],
          () => ([ date, timezone ]: [TimeLiteral, DayTimeDurationLiteral]) =>
            new TimeLiteral({ ...date.typedValue }),
        ).collect(),
    });
  }
}
