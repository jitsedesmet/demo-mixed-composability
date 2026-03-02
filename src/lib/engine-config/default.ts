import type {FileDescription} from "./engineConfTypes";

export const defaultConfig: FileDescription = {
  name: "config-default.json",
  body: new URL("https://raw.githubusercontent.com/comunica/comunica/d222adb412a5605dad68414c4a7ee953dae13d84/engines/config-query-sparql/config/config-default.json"),
}
