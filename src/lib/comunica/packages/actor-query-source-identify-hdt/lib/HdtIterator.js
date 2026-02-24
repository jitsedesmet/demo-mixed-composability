"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdtIterator = void 0;
const utils_metadata_1 = require("@comunica/utils-metadata");
const asynciterator_1 = require("asynciterator");
/**
 * Iterates over an HDT document in chunks for a triple pattern query.
 */
class HdtIterator extends asynciterator_1.BufferedIterator {
    hdtDocument;
    bindingsFactory;
    subject;
    predicate;
    object;
    position;
    constructor(hdtDocument, bindingsFactory, subject, predicate, object, options) {
        super(options);
        this.hdtDocument = hdtDocument;
        this.bindingsFactory = bindingsFactory;
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.position = 0;
        const variables = [];
        if (subject.termType === 'Variable') {
            variables.push({ variable: subject, canBeUndef: false });
        }
        if (predicate.termType === 'Variable' && !variables.some(variable => variable.variable.equals(predicate))) {
            variables.push({ variable: predicate, canBeUndef: false });
        }
        if (object.termType === 'Variable' && !variables.some(variable => variable.variable.equals(object))) {
            variables.push({ variable: object, canBeUndef: false });
        }
        this.hdtDocument.countTriples(subject, predicate, object)
            .then(({ totalCount, hasExactCount }) => {
            this.setProperty('metadata', {
                state: new utils_metadata_1.MetadataValidationState(),
                cardinality: { type: hasExactCount ? 'exact' : 'estimate', value: totalCount },
                variables,
            });
        })
            .catch(error => this.destroy(error));
    }
    _read(count, done) {
        if (this.hdtDocument.closed) {
            this.close();
            return done();
        }
        this.hdtDocument.searchBindings(this.bindingsFactory, this.subject, this.predicate, this.object, { offset: this.position, limit: count }).then((searchResult) => {
            for (const b of searchResult.bindings) {
                this._push(b);
            }
            if (searchResult.bindings.length < count) {
                this.close();
            }
            done();
        })
            .catch((error) => {
            this.emit('error', error);
            return done();
        });
        this.position += count;
    }
}
exports.HdtIterator = HdtIterator;
//# sourceMappingURL=HdtIterator.js.map