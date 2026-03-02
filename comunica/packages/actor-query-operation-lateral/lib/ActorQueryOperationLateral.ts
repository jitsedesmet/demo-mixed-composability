import type { IActionQueryOperation, IActorQueryOperationTypedMediatedArgs } from '@comunica/bus-query-operation';
import { ActorQueryOperationTypedMediated } from '@comunica/bus-query-operation';
import type { MediatorRdfMetadataAccumulate } from '@comunica/bus-rdf-metadata-accumulate';
import { KeysInitQuery } from '@comunica/context-entries';
import type { IActorTest, TestResult } from '@comunica/core';
import { failTest, ActionContextKey, passTestVoid } from '@comunica/core';
import type {
  BindingsStream,
  IActionContext,
  IQueryOperationResult,
  IQueryOperationResultBindings,
  MetadataBindings,
  MetadataQuads,
  MetadataVariable,
} from '@comunica/types';
import type { Algebra } from '@comunica/utils-algebra';
import { AlgebraFactory } from '@comunica/utils-algebra';
import { MetadataValidationState } from '@comunica/utils-metadata';
import { BindingsFactory } from '@comunica/utils-bindings-factory';
import { getSafeBindings, materializeOperation } from '@comunica/utils-query-operation';
import type * as RDF from '@rdfjs/types';
import { MultiTransformIterator, TransformIterator } from 'asynciterator';

export type Lateral = {
  type: 'lateral';
  input: [Algebra.Operation, Algebra.Operation];
};

export const lateralDisableKey = new ActionContextKey<boolean>('@local/actor-query-operation-lateral:disable');

/**
 * A comunica Union Query Operation Actor.
 */
export class ActorQueryOperationLateral extends ActorQueryOperationTypedMediated<Lateral> {
  public readonly mediatorRdfMetadataAccumulate: MediatorRdfMetadataAccumulate;

  public constructor(args: IActorQueryOperationLateralArgs) {
    super(args, 'lateral');
    this.mediatorRdfMetadataAccumulate = args.mediatorRdfMetadataAccumulate;
  }

  /**
   * Takes the union of the given double array variables.
   * Uniqueness is guaranteed.
   * @param {string[][]} variables Double array of variables to take the union of.
   * @return {string[]} The union of the given variables.
   */
  public static unionVariables(variables: MetadataVariable[][]): MetadataVariable[] {
    const variablesIndexed: Record<string, { variable: RDF.Variable; canBeUndef: boolean; occurrences: number }> = {};
    for (const variablesA of variables) {
      for (const variable of variablesA) {
        if (!variablesIndexed[variable.variable.value]) {
          variablesIndexed[variable.variable.value] = {
            variable: variable.variable,
            canBeUndef: variable.canBeUndef,
            occurrences: 0,
          };
        }
        const entry = variablesIndexed[variable.variable.value];
        entry.canBeUndef = entry.canBeUndef || variable.canBeUndef;
        entry.occurrences++;
      }
    }
    return Object.values(variablesIndexed)
      .map(entry => entry.occurrences === variables.length ?
          { variable: entry.variable, canBeUndef: entry.canBeUndef } :
          { variable: entry.variable, canBeUndef: true });
  }

  /**
   * Takes the union of the given metadata array.
   * It will ensure that the cardinality metadata value is properly calculated.
   * @param {{[p: string]: any}[]} metadatas Array of metadata.
   * @param bindings If the union of the variables field should also be taken.
   * @param context The action context
   * @param mediatorRdfMetadataAccumulate Mediator for metadata accumulation
   * @return {{[p: string]: any}} Union of the metadata.
   */
  public static async unionMetadata<
    Bindings extends boolean,
    M extends (Bindings extends true ? MetadataBindings : MetadataQuads),
  >(
    metadatas: M[],
    bindings: Bindings,
    context: IActionContext,
    mediatorRdfMetadataAccumulate: MediatorRdfMetadataAccumulate,
    // eslint-disable-next-line function-paren-newline
  ): Promise<M> {
    let accumulatedMetadata: M = <M> (await mediatorRdfMetadataAccumulate
      .mediate({ mode: 'initialize', context })).metadata;

    // Accumulate cardinality
    for (const appendingMetadata of metadatas) {
      accumulatedMetadata = <any> {
        ...appendingMetadata,
        ...(await mediatorRdfMetadataAccumulate
          .mediate({
            mode: 'append',
            accumulatedMetadata: <any> accumulatedMetadata,
            appendingMetadata: <any> appendingMetadata,
            context,
          })).metadata,
      };
    }

    // Create new metadata state
    accumulatedMetadata.state = new MetadataValidationState();

    // Propagate metadata invalidations
    const invalidateListener = (): void => accumulatedMetadata.state.invalidate();
    for (const metadata of metadatas) {
      metadata.state.addInvalidateListener(invalidateListener);
    }

    // Union variables
    if (bindings) {
      const variables: MetadataVariable[][] = metadatas.map(metadata => metadata.variables);
      accumulatedMetadata.variables = ActorQueryOperationLateral.unionVariables(variables);
    }

    return accumulatedMetadata;
  }

  public override async test(action: IActionQueryOperation): Promise<TestResult<IActorTest>> {
    if (action.context.get(lateralDisableKey) ?? false) {
      return failTest('');
    }
    return super.test(action);
  }

  public async testOperation(_operation: Lateral, _context: IActionContext): Promise<TestResult<IActorTest>> {
    return passTestVoid();
  }

  public async runOperation(operation: Lateral, context: IActionContext):
  Promise<IQueryOperationResult> {
    // Evaluate the LHS to get a stream of bindings
    const leftResult: IQueryOperationResultBindings = getSafeBindings(
      await this.mediatorQueryOperation.mediate({ operation: operation.input[0], context }),
    );

    // Get factories needed for materializing RHS with LHS bindings
    const dataFactory = context.getSafe(KeysInitQuery.dataFactory);
    const algebraFactory = new AlgebraFactory(dataFactory);
    const bindingsFactory = new BindingsFactory(dataFactory);

    // For each LHS binding, inject it into the RHS pattern, evaluate, and merge results
    const bindingsStream: BindingsStream = new MultiTransformIterator(leftResult.bindingsStream, {
      autoStart: false,
      multiTransform: (lhsBinding: RDF.Bindings) => {
        const materializedRhs = materializeOperation(
          operation.input[1],
          lhsBinding,
          algebraFactory,
          bindingsFactory,
        );
        return new TransformIterator<RDF.Bindings>(
          async () => {
            const rhsResult: IQueryOperationResultBindings = getSafeBindings(
              await this.mediatorQueryOperation.mediate({ operation: materializedRhs, context }),
            );
            // Merge each RHS binding with the LHS binding (null means skip on conflict)
            return rhsResult.bindingsStream.map(
              (rhsBinding: RDF.Bindings) => lhsBinding.merge(rhsBinding) ?? null,
            );
          },
          { maxBufferSize: 128, autoStart: false },
        );
      },
    });

    // Compute metadata: cardinality is LHS × RHS, variables are LHS ∪ RHS (RHS all canBeUndef)
    const metadata: () => Promise<MetadataBindings> = () => Promise.all([
      leftResult.metadata(),
      this.mediatorQueryOperation
        .mediate({ operation: operation.input[1], context })
        .then((r: IQueryOperationResult) => getSafeBindings(r).metadata()),
    ]).then(([ lhsMeta, rhsMeta ]: MetadataBindings[]) => {
      const cardinality = {
        type: (lhsMeta.cardinality.type === 'exact' && rhsMeta.cardinality.type === 'exact') ?
          'exact' as const :
          'estimate' as const,
        value: lhsMeta.cardinality.value * rhsMeta.cardinality.value,
      };

      // LHS variables keep their canBeUndef; RHS variables are always canBeUndef in lateral
      const lhsVarNames = new Set(lhsMeta.variables.map((v: MetadataVariable) => v.variable.value));
      const rhsVarsCanBeUndef: MetadataVariable[] = rhsMeta.variables
        .filter((v: MetadataVariable) => !lhsVarNames.has(v.variable.value))
        .map((v: MetadataVariable) => ({ variable: v.variable, canBeUndef: true }));
      const variables: MetadataVariable[] = [ ...lhsMeta.variables, ...rhsVarsCanBeUndef ];

      const state = new MetadataValidationState();
      lhsMeta.state.addInvalidateListener(() => state.invalidate());
      rhsMeta.state.addInvalidateListener(() => state.invalidate());

      return { ...lhsMeta, variables, cardinality, state };
    });

    return { type: 'bindings', bindingsStream, metadata };
  }
}

export interface IActorQueryOperationLateralArgs extends IActorQueryOperationTypedMediatedArgs {
  mediatorRdfMetadataAccumulate: MediatorRdfMetadataAccumulate;
}
