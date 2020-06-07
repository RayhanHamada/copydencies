#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const meow_1 = tslib_1.__importDefault(require("meow"));
const index_1 = tslib_1.__importDefault(require("./index"));
const promptMsg = `format: $copyden <dest> <source> [--onlyDep | --onlyDev | --both] [--asDep | --asDev | --asEach]
flag for source dependency:
--onlyDep   : copy only source's dependencies
--onlyDev   : copy only source's devDependencies
--both      : copy both source's dependencies and devDependencies (default)

flag for destination dependency
--asDep     : paste as dest's dependencies
--asDev     : paste as dest's devDependencies
--asEach    : paste as dest's dependencies and devDependencies (default)
`;
const promptFlags = {
    onlyDep: {
        type: 'boolean',
    },
    onlyDev: {
        type: 'boolean',
    },
    both: {
        type: 'boolean',
    },
    asDep: {
        type: 'boolean',
    },
    asDev: {
        type: 'boolean',
    },
    asEach: {
        type: 'boolean',
    },
};
const cli = meow_1.default(promptMsg, {
    flags: promptFlags,
    inferType: true,
    autoHelp: true,
});
/**
 * check for input error
 */
if (cli.input.length < 1) {
    console.log(`Argument for destination package expected`);
    cli.showHelp();
    process.exit(1);
}
else if (cli.input.length < 2) {
    console.log(`Argument for source package expected`);
    cli.showHelp(1);
    process.exit(1);
}
/**
 * for catched invalid flags
 */
const invalidFlag = (flag) => {
    console.log(`Invalid ${flag} flag !`);
    cli.showHelp();
    process.exit(1);
};
/**
 * get destination and source path
 */
const dest = cli.input[0];
const source = cli.input[1];
let copyFlag = 'both';
let pasteFlag = 'asEach';
if (cli.flags.onlyDep)
    copyFlag = 'onlyDep';
// only copy dependencies
else if (cli.flags.onlyDev)
    copyFlag = 'onlyDev';
// only copy devDependencies
else if (!cli.flags.both)
    invalidFlag('copy'); // catch invalid flag
if (cli.flags.asDep)
    pasteFlag = 'asDep';
// paste as dependencies
else if (cli.flags.asDev)
    pasteFlag = 'asDev';
// paste as devDependencies
else if (!cli.flags.both)
    invalidFlag('paste'); // catch
index_1.default(dest, source, copyFlag, pasteFlag);
