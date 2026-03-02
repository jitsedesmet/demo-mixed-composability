import type { FileDescription } from "$lib/engine-config/engineConfTypes";

export const tripleConfig: FileDescription = {
  name: "function-factory/actors/term-function-triple.json",
  body: new URL("https://github.com/comunica/comunica/raw/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/function-factory/actors/term-function-triple.json"),
  prefixForImport: "ccqs:config",
}

export const isTripleConfig: FileDescription = {
  name: "function-factory/actors/term-function-is-triple.json",
  body: new URL("https://github.com/comunica/comunica/raw/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/function-factory/actors/term-function-is-triple.json"),
  prefixForImport: "ccqs:config",
}

export const subjectConfig: FileDescription = {
  name: "function-factory/actors/term-function-subject.json",
  body: new URL("https://github.com/comunica/comunica/raw/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/function-factory/actors/term-function-subject.json"),
  prefixForImport: "ccqs:config",
}

export const predicateConfig: FileDescription = {
  name: "function-factory/actors/term-function-predicate.json",
  body: new URL("https://github.com/comunica/comunica/raw/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/function-factory/actors/term-function-predicate.json"),
  prefixForImport: "ccqs:config",
}

export const objectConfig: FileDescription = {
  name: "function-factory/actors/term-function-object.json",
  body: new URL("https://github.com/comunica/comunica/raw/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/function-factory/actors/term-function-object.json"),
  prefixForImport: "ccqs:config",
}

export const sparql12Descriptions = [
  tripleConfig,
  isTripleConfig,
  subjectConfig,
  predicateConfig,
  objectConfig,
]
