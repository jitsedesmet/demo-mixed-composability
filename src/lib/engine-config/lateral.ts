import type {FileDescription} from "./engineConfTypes";

export const lateralActor: FileDescription = {
  name: "query-operation/actors/query/lateral.json",
  body: new URL("https://github.com/jitsedesmet/demo-mixed-composability/raw/refs/heads/main/comunica/engines/config-query-sparql/config/query-operation/actors/query/lateral.json"),
  prefixForImport: "lcqs:config",
}

export const lateralDescriptions = [lateralActor];
