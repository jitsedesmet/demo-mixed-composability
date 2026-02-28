import type { IActorFunctionFactoryArgs } from '@comunica/bus-function-factory';
import { ActorFunctionFactory } from '@comunica/bus-function-factory';

/**
 * A comunica actor for function factory events.
 *
 * Actor types:
 * * Input:  IActionFunctions: A request to receive a function implementation for a given function name
 * and potentially the function arguments.
 * * Test:   <none>
 * * Output: IActorFunctionsOutput: A function implementation.
 *
 * @see IActionFunctionFactory
 * @see IActorFunctionFactoryOutput
 */
export abstract class ActorFunctionFactorySelective<TS = undefined> extends ActorFunctionFactory<TS> {
  /* eslint-disable max-len */
  /**
   * @param args -
   * \ @defaultNested {<default_bus> a <lbff:components/BusFunctionFactorySelective.jsonld#BusFunctionFactorySelective>} bus
   * \ @defaultNested {Creation of function evaluator failed: no configured actor was able to evaluate function ${action.functionName}} busFailMessage
   */
  /* eslint-enable max-len */
  public constructor(args: IActorFunctionFactoryArgs<TS>) {
    super(args);
  }
}
