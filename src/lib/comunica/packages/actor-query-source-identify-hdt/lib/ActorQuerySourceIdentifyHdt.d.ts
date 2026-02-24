import type { ActorHttpInvalidateListenable } from '@comunica/bus-http-invalidate';
import type { MediatorMergeBindingsContext } from '@comunica/bus-merge-bindings-context';
import type { IActionQuerySourceIdentify, IActorQuerySourceIdentifyOutput, IActorQuerySourceIdentifyArgs } from '@comunica/bus-query-source-identify';
import { ActorQuerySourceIdentify } from '@comunica/bus-query-source-identify';
import type { IActorTest, TestResult } from '@comunica/core';
/**
 * A comunica Hdt Query Source Identify Actor.
 */
export declare class ActorQuerySourceIdentifyHdt extends ActorQuerySourceIdentify {
    readonly httpInvalidator: ActorHttpInvalidateListenable;
    private createdSources;
    readonly mediatorMergeBindingsContext: MediatorMergeBindingsContext;
    readonly maxBufferSize: number;
    constructor(args: IActorQuerySourceIdentifyHdtArgs);
    test(action: IActionQuerySourceIdentify): Promise<TestResult<IActorTest>>;
    run(action: IActionQuerySourceIdentify): Promise<IActorQuerySourceIdentifyOutput>;
    clearCache(): Promise<any>;
}
export interface IActorQuerySourceIdentifyHdtArgs extends IActorQuerySourceIdentifyArgs {
    /**
     * An actor that listens to HTTP invalidation events
     * @default {<default_invalidator> a <npmd:@comunica/bus-http-invalidate/^5.0.0/components/ActorHttpInvalidateListenable.jsonld#ActorHttpInvalidateListenable>}
     */
    httpInvalidator: ActorHttpInvalidateListenable;
    /**
     * A mediator for creating binding context merge handlers
     */
    mediatorMergeBindingsContext: MediatorMergeBindingsContext;
    /**
     * The maximum number of triples that can be retrieved from HDT files in a single call.
     * @default {128}
     */
    maxBufferSize: number;
}
