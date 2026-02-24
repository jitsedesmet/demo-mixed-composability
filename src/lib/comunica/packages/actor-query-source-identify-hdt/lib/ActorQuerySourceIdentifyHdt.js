"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQuerySourceIdentifyHdt = void 0;
const bus_query_source_identify_1 = require("@comunica/bus-query-source-identify");
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const utils_bindings_factory_1 = require("@comunica/utils-bindings-factory");
const HDT = require("hdt");
const QuerySourceHdt_1 = require("./QuerySourceHdt");
/**
 * A comunica Hdt Query Source Identify Actor.
 */
class ActorQuerySourceIdentifyHdt extends bus_query_source_identify_1.ActorQuerySourceIdentify {
    httpInvalidator;
    createdSources = [];
    mediatorMergeBindingsContext;
    maxBufferSize;
    constructor(args) {
        super(args);
        this.httpInvalidator = args.httpInvalidator;
        this.mediatorMergeBindingsContext = args.mediatorMergeBindingsContext;
        this.maxBufferSize = args.maxBufferSize;
        this.httpInvalidator.addInvalidateListener(({ url }) => {
            if (!url) {
                // eslint-disable-next-line ts/no-floating-promises
                this.clearCache();
            }
        });
    }
    async test(action) {
        const source = action.querySourceUnidentified;
        if (source.type !== 'hdt') {
            return (0, core_1.failTest)(`${this.name} requires a single query source with hdt type to be present in the context.`);
        }
        if (typeof source.value !== 'string') {
            return (0, core_1.failTest)(`${this.name} received an invalid hdt query source.`);
        }
        return (0, core_1.passTestVoid)();
    }
    async run(action) {
        const dataFactory = action.context.getSafe(context_entries_1.KeysInitQuery.dataFactory);
        const path = action.querySourceUnidentified.value;
        const source = new QuerySourceHdt_1.QuerySourceHdt(path, await HDT.fromFile(path), dataFactory, await utils_bindings_factory_1.BindingsFactory.create(this.mediatorMergeBindingsContext, action.context, dataFactory), this.maxBufferSize);
        this.createdSources.push(new WeakRef(source));
        return {
            querySource: {
                source,
                context: action.querySourceUnidentified.context ?? new core_1.ActionContext(),
            },
        };
    }
    async clearCache() {
        for (const source of this.createdSources) {
            await source.deref()?.dispose();
        }
        this.createdSources = [];
    }
}
exports.ActorQuerySourceIdentifyHdt = ActorQuerySourceIdentifyHdt;
//# sourceMappingURL=ActorQuerySourceIdentifyHdt.js.map