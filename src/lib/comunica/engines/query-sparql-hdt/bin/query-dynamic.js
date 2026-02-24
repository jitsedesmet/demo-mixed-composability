#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable node/no-path-concat */
const runner_cli_1 = require("@comunica/runner-cli");
(0, runner_cli_1.runArgsInProcess)(`${__dirname}/../`, `${__dirname}/../config/config-default.json`);
//# sourceMappingURL=query-dynamic.js.map