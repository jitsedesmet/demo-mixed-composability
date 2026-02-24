import type { BindingsStream, ComunicaDataFactory, FragmentSelectorShape, IActionContext, IQuerySource } from '@comunica/types';
import { Algebra } from '@comunica/utils-algebra';
import type { BindingsFactory } from '@comunica/utils-bindings-factory';
import type * as RDF from '@rdfjs/types';
import type { AsyncIterator } from 'asynciterator';
import type * as HDT from 'hdt';
/**
 * A query source over an HDT file.
 */
export declare class QuerySourceHdt implements IQuerySource {
    referenceValue: string;
    protected readonly hdtPath: string;
    protected readonly hdtDocument: HDT.Document;
    private readonly dataFactory;
    private readonly bindingsFactory;
    private readonly maxBufferSize;
    private readonly selectorShape;
    constructor(hdtPath: string, hdtDocument: HDT.Document, dataFactory: ComunicaDataFactory, bindingsFactory: BindingsFactory, maxBufferSize: number);
    getFilterFactor(_context: IActionContext): Promise<number>;
    getSelectorShape(): Promise<FragmentSelectorShape>;
    queryBindings(operation: Algebra.Operation, _context: IActionContext): BindingsStream;
    queryQuads(_operation: Algebra.Operation, _context: IActionContext): AsyncIterator<RDF.Quad>;
    queryBoolean(_operation: Algebra.Ask, _context: IActionContext): Promise<boolean>;
    queryVoid(_operation: Algebra.Operation, _context: IActionContext): Promise<void>;
    toString(): string;
    dispose(): Promise<void>;
}
