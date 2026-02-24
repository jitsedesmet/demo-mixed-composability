"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuerySourceHdt = void 0;
const utils_algebra_1 = require("@comunica/utils-algebra");
const utils_metadata_1 = require("@comunica/utils-metadata");
const asynciterator_1 = require("asynciterator");
const HdtIterator_1 = require("./HdtIterator");
const AF = new utils_algebra_1.AlgebraFactory();
/**
 * A query source over an HDT file.
 */
class QuerySourceHdt {
    referenceValue;
    hdtPath;
    hdtDocument;
    dataFactory;
    bindingsFactory;
    maxBufferSize;
    selectorShape;
    constructor(hdtPath, hdtDocument, dataFactory, bindingsFactory, maxBufferSize) {
        this.hdtPath = hdtPath;
        this.referenceValue = hdtPath;
        this.hdtDocument = hdtDocument;
        this.dataFactory = dataFactory;
        this.bindingsFactory = bindingsFactory;
        this.maxBufferSize = maxBufferSize;
        this.selectorShape = {
            type: 'operation',
            operation: {
                operationType: 'pattern',
                pattern: AF.createPattern(this.dataFactory.variable('s'), this.dataFactory.variable('p'), this.dataFactory.variable('o')),
            },
            variablesOptional: [
                this.dataFactory.variable('s'),
                this.dataFactory.variable('p'),
                this.dataFactory.variable('o'),
            ],
        };
        ;
    }
    async getFilterFactor(_context) {
        return 1;
    }
    async getSelectorShape() {
        return this.selectorShape;
    }
    queryBindings(operation, _context) {
        if (!(0, utils_algebra_1.isKnownOperation)(operation, utils_algebra_1.Algebra.Types.PATTERN)) {
            throw new Error(`Attempted to pass non-pattern operation '${operation.type}' to QuerySourceRdfJs`);
        }
        let it;
        if (operation.graph.termType === 'NamedNode') {
            it = new asynciterator_1.ArrayIterator([], { autoStart: false });
            it.setProperty('metadata', {
                state: new utils_metadata_1.MetadataValidationState(),
                cardinality: { type: 'exact', value: 0 },
                variables: [],
            });
        }
        else {
            // Create an iterator over the HDT document
            it = new HdtIterator_1.HdtIterator(this.hdtDocument, this.bindingsFactory, operation.subject, operation.predicate, operation.object, { autoStart: false, maxBufferSize: this.maxBufferSize });
        }
        return it;
    }
    queryQuads(_operation, _context) {
        throw new Error('queryQuads is not implemented in QuerySourceHdt');
    }
    queryBoolean(_operation, _context) {
        throw new Error('queryBoolean is not implemented in QuerySourceHdt');
    }
    queryVoid(_operation, _context) {
        throw new Error('queryVoid is not implemented in QuerySourceHdt');
    }
    toString() {
        return `QuerySourceHdt(${this.hdtPath})`;
    }
    dispose() {
        return this.hdtDocument.close();
    }
}
exports.QuerySourceHdt = QuerySourceHdt;
//# sourceMappingURL=QuerySourceHdt.js.map