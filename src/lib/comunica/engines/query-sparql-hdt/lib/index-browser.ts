/* eslint-disable unicorn/filename-case */
/* eslint-enable unicorn/filename-case */
import { QueryEngineBase } from '@comunica/actor-init-query';
import type { ActorInitQueryBase } from '@comunica/actor-init-query';

// eslint-disable-next-line ts/no-require-imports,ts/no-var-requires,import/extensions
const engineBrowser = require('../engine-browser.js');

/**
 * A Comunica SPARQL query engine for browser environments (without native HDT support).
 */
export class QueryEngine extends QueryEngineBase {
  public constructor(engine: ActorInitQueryBase = engineBrowser()) {
    super(engine);
  }
}
export { QueryEngineFactory } from './QueryEngineFactory';
