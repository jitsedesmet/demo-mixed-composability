import type * as RDF from '@rdfjs/types';
import type { BufferedIteratorOptions } from 'asynciterator';
import { BufferedIterator } from 'asynciterator';
import type * as HDT from 'hdt';
/**
 * Iterates over an HDT document in chunks for a triple pattern query.
 */
export declare class HdtIterator extends BufferedIterator<RDF.Bindings> {
    protected readonly hdtDocument: HDT.Document;
    protected readonly bindingsFactory: RDF.BindingsFactory;
    protected readonly subject: RDF.Term;
    protected readonly predicate: RDF.Term;
    protected readonly object: RDF.Term;
    protected position: number;
    constructor(hdtDocument: HDT.Document, bindingsFactory: RDF.BindingsFactory, subject: RDF.Term, predicate: RDF.Term, object: RDF.Term, options: BufferedIteratorOptions);
    _read(count: number, done: () => void): void;
}
