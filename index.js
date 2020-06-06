"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
async function copyden(dest, source, copyFlag = 'both', pasteFlag = 'asEach') {
    let _dest, _source;
    try {
        _dest = path_1.default.resolve(process.cwd(), dest);
    }
    catch (e) {
        console.log(`dest path failed to be resolved, please check your dest path !`);
        process.exit(1);
    }
    try {
        _source = path_1.default.resolve(process.cwd(), source);
    }
    catch (e) {
        console.log(`source path failed to be resolved, please check your source path !`);
        process.exit(1);
    }
    /**
     * check if destination and source exists
     */
    if (!fs_1.default.existsSync(_dest)) {
        console.error(`${dest} not exists !`);
        process.exit(1);
    }
    if (!fs_1.default.existsSync(_source) && !fs_1.default.lstatSync(_source).isFile()) {
        console.error(`${dest} not exists !`);
        process.exit(1);
    }
    /**
     * check if destination and source is a file
     */
    if (!fs_1.default.lstatSync(_dest).isFile()) {
        console.error(`${dest} is not a file`);
        process.exit(1);
    }
    if (!fs_1.default.lstatSync(_source).isFile()) {
        console.error(`${source} is not a file`);
        process.exit(1);
    }
    /**
     * read destination
     */
    let parsedDest = {};
    await fs_1.default.promises
        .readFile(_dest, { encoding: 'utf-8' })
        .then(async (val) => {
        try {
            parsedDest = JSON.parse(val);
        }
        catch (e) {
            console.log(`failed to parse destination, please check your destination package.json !`);
            process.exit(1);
        }
    })
        .catch(() => {
        console.log(`failed to read dest`);
        process.exit(1);
    });
    /**
     * read source file
     */
    // @ts-ignore
    let parsedSource = {};
    await fs_1.default.promises
        .readFile(_source, { encoding: 'utf-8' })
        .then(val => {
        try {
            parsedSource = JSON.parse(val);
        }
        catch (e) {
            console.error('json cannot be decoded !');
            process.exit(1);
        }
    })
        .catch(() => {
        console.log(`failed to read source`);
        process.exit(1);
    });
    /**
     * check for copy flag
     */
    let pack;
    if (copyFlag === 'onlyDep') {
        /**
         * if we just want to copy the dependencies
         */
        pack = {
            dependencies: parsedSource.dependencies,
        };
    }
    else if (copyFlag === 'onlyDev') {
        /**
         * if we just want to copy the devDependencies
         */
        pack = {
            devDependencies: parsedSource.devDependencies,
        };
    }
    else if (copyFlag !== 'both') {
        /**
         * catch invalid flag here
         */
        console.log(`Invalid Flag !`);
        process.exit(1);
    }
    else {
        /**
         * if we want to copy both (default)
         */
        pack = {
            dependencies: parsedSource.dependencies,
            devDependencies: parsedSource.devDependencies,
        };
    }
    /**
     * check for paste flag
     */
    if (pasteFlag === 'asDep') {
        /**
         * if we only want to paste it to dependencies
         */
        pack = {
            dependencies: {
                ...pack.dependencies,
                ...pack.devDependencies,
            },
            devDependencies: {},
        };
    }
    else if (pasteFlag === 'asDev') {
        /**
         * if we only want to paste it to devDependencies
         */
        pack = {
            dependencies: {},
            devDependencies: {
                ...pack.dependencies,
                ...pack.devDependencies,
            },
        };
    }
    else if (pasteFlag !== 'asEach') {
        /**
         * catch invalid flag here
         */
        console.log(`Invalid paste flag`);
        process.exit(1);
    }
    else {
        /**
         * do nothing
         */
    }
    /**
     * stringify dest's new content
     */
    let newDestContent;
    try {
        newDestContent = JSON.stringify({ ...parsedDest, ...pack });
    }
    catch (e) {
        console.log('error when stringify dest');
        process.exit(1);
    }
    /**
     * write new content to destination
     */
    await fs_1.default.promises.writeFile(_dest, newDestContent).then(() => {
        console.log(`success copying dependencies to destination`);
    });
}
exports.default = copyden;
