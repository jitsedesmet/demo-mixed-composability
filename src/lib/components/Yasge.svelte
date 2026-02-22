<script lang="ts">
  // https://docs.triply.cc/yasgui-api/#yasgui-api-reference
  // https://www.youtube.com/watch?v=Y5IiSdcqdeQ&themeRefresh=1
  import Yasqe from "@triply/yasqe";
  import {QueryEngine} from "@comunica/query-sparql-file";
  import type {ActionReturn} from "svelte/action";
  import type {Bindings} from "@rdfjs/types";

  interface Props {
    query: string | undefined;
    bindings?: Bindings[];
    queryDone?: boolean;
    queryRunning?: boolean;
    queryStartTime?: number;
  }
  let {
    query = $bindable(),
    bindings = $bindable<Bindings[]>([]),
    queryDone = $bindable(false),
    queryRunning = $bindable(false),
    queryStartTime = $bindable(0),
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
      }
    });

    if (startQuery !== undefined) yasqe.setValue(startQuery);

    yasqe.on('query', async () => {
      query = yasqe.getValue() as string;
      error = undefined;
      try {
        bindings = [];
        queryDone = false;
        queryRunning = true;
        queryStartTime = Date.now();
        const bindingStream = await engine.queryBindings(query, {
          sources: ["https://fragments.dbpedia.org/2016-04/en"]
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
<div use:yasge={{ query }} class="yasge"></div>

<style>
    :global {
        @import "@triply/yasqe/build/yasqe.min.css";
    }
    .myError {
        display: flex;
        padding: 0.25em;
        background: rgba(255, 65, 54, 0.66);
        border-radius: 0.25em 0.25em 0 0;
        color: black;
    }
    .myError span {
        flex: 1;
        padding: 0 0 0 10px;
        align-self: center;
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
