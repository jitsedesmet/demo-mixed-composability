import type {
  ActorFunctionFactory,
  IActionFunctionFactory,
  IActorFunctionFactoryOutput,
} from '@comunica/bus-function-factory';
import { BusFunctionFactory } from '@comunica/bus-function-factory';
import type { IActorReply, IActorTest, IBusArgs } from '@comunica/core';
import { ActionContextKey } from '@comunica/core';

export const functionFactoryDeactivateKey = new ActionContextKey<string[]>('@local/bus-function-factory:deactivate');

/**
 * Bus inspired by BusIndexed but specific for function factory.
 *
 * The implementation differs. In BusIndexed, each actor is indexed only once.
 * Here, a single actor can be indexed multiple times.
 */
export class BusFunctionFactorySelective extends BusFunctionFactory {
  public constructor(args: IBusArgs) {
    super(args);
  }

  public override publish(action: IActionFunctionFactory):
  IActorReply<ActorFunctionFactory, IActionFunctionFactory, IActorTest, IActorFunctionFactoryOutput>[] {
    const actionId = this.getActionIdentifier(action);
    if (actionId && (action.context.get(functionFactoryDeactivateKey) ?? []).includes(actionId)) {
      // Mimic not supporting this operation
      return [];
    }
    return super.publish(action);
  }
}
