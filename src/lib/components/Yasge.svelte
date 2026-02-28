<script lang="ts">
  // https://docs.triply.cc/yasgui-api/#yasgui-api-reference
  // https://www.youtube.com/watch?v=Y5IiSdcqdeQ&themeRefresh=1
  import Yasqe from "@triply/yasqe";
  import {QueryEngine} from "@local/query-sparql";
  import type {ActionReturn} from "svelte/action";
  import type {Bindings} from "@rdfjs/types";
  import {
    buildGenerator,
    buildLexer,
    buildParser,
    buildToAlgebra,
    buildToAst,
    getActiveConfigs
  } from "$lib/traqula/buildTraqula";
  import {alterQuery} from "$lib/helpers.svelte";
  import {replaceState} from "$app/navigation";
  import {parserKey, toAlgebraKey} from "@local/actor-query-parse-sparql";
  import {lateralSupportKey} from "@local/actor-query-operation-lateral";
  import {adjustSupportKey} from "@local/actor-function-factory-term-adjust";
  import {functionFactoryDeactivateKey} from "@local/bus-function-factory";

  interface Props {
    query: string | undefined;
    bindings?: Bindings[];
    queryDone?: boolean;
    queryRunning?: boolean;
    queryStartTime?: number;
    parserComposition?: Set<string>;
    engineComposition?: Set<string>;
    sources?: string[];
  }
  let {
    query = $bindable(),
    bindings = $bindable<Bindings[]>([]),
    queryDone = $bindable(false),
    queryRunning = $bindable(false),
    queryStartTime = $bindable(0),
    parserComposition = $bindable(new Set<string>()),
    engineComposition = $bindable(new Set<string>()),
    sources = ["https://fragments.dbpedia.org/2016-04/en"],
  }: Props = $props();
  let error = $state<string | undefined>(undefined);
  const engine = new QueryEngine();
  interface YasgeContext {
    query: string | undefined;
  }
  function yasge(element: HTMLElement, { query: startQuery }: Props): ActionReturn<YasgeContext> {
    const yasqe = new Yasqe(element, {
      editorHeight: '40svh',
      requestConfig: {
        method: "GET",
        endpoint: "https://fragments.dbpedia.org/2016-04/en",
      }
    });

    if (startQuery !== undefined) yasqe.setValue(startQuery);

    yasqe.on('query', async () => {
      query = yasqe.getValue() as string;
      replaceState(alterQuery('query', query), {});
      error = undefined;
      try {
        bindings = [];
        queryDone = false;
        queryRunning = true;
        queryStartTime = Date.now();

        const configs = getActiveConfigs(parserComposition);
        const lexer = buildLexer(configs);
        const bindingStream = await engine.queryBindings(query, {
          sources: sources,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [parserKey.name]: buildParser(configs, lexer) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          generator: buildGenerator(configs) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toAst: buildToAst(configs) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [toAlgebraKey.name]: buildToAlgebra(configs) as any,
          [lateralSupportKey.name]: engineComposition.has('Lateral operation'),
          [adjustSupportKey.name]: engineComposition.has('Built-in Adjust'),
          [functionFactoryDeactivateKey.name]: ['langmatches'],
        });
        bindingStream.on('data', (binding: Bindings) => {
          bindings.push(binding);
        });
        bindingStream.on('error', (err: Error) => {
          error = err.message;
          queryRunning = false;
          console.error(err);
        });
        bindingStream.on('end', () => {
          queryDone = true;
          queryRunning = false;
        })
      } catch (err: unknown) {
        error = (err as Error).message;
        queryRunning = false;
        console.error(err);
      }
    });

    return {
      update({ query: newQuery }) {
        if (newQuery !== undefined) {
          error = undefined;
          yasqe.setValue(newQuery);
        }
        query = undefined;
      },
      destroy() {
        yasqe.destroy();
      }
    };
  }
</script>


<div use:yasge={{ query }} class="yasge"></div>
{#if error}
    <div class="myError">
        <span>
            {error}
        </span>
        <button aria-label="close error" onclick={() => error = undefined}>
            <svg viewBox="0 0 10 10" height="0.75em">
                <path stroke-linecap="round" stroke-linejoin="round" d="M 0 0 L 10 10 M 0 10 L 10 0" />
            </svg>
        </button>
    </div>
{/if}

<style>
    :global {
        @import "@triply/yasqe/build/yasqe.min.css";
    }
    .myError {
        display: flex;
        padding: 0.25em;
        background: rgba(255, 65, 54, 0.66);
        border-radius: 0.25em;
        color: black;
    }
    .myError span {
        flex: 1;
        padding: 0 0 0 10px;
        align-self: center;
        white-space: pre-wrap;
        font-family: monospace;
    }
    .myError button {
        padding: 0 10px;
        background: none;
        border: none;
        box-shadow: none;
    }
    svg {
    /*    thickness*/
        stroke-width: 1;
        color: black;
        stroke: black;
    }

</style>
