"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
async function default_1(dest, source, copyFlag = 'both', pasteFlag = 'asEach') {
    const _dest = path_1.default.resolve(process.cwd(), dest);
    const _source = path_1.default.resolve(process.cwd(), source);
    /**
     * check if destination and source exists
     */
    if (!fs_1.default.existsSync(_dest)) {
        console.error('Destination not exists !');
        process.exit(1);
    }
    if (!fs_1.default.existsSync(_source)) {
        console.error('Source not exists !');
        process.exit(1);
    }
    /**
     * read source file
     */
    let parsedSource;
    await fs_1.default.promises.readFile(_source, { encoding: 'utf-8' }).then(val => {
        try {
            parsedSource = JSON.parse(val);
        }
        catch (e) {
            console.error('json cannot be decoded !');
            process.exit(1);
        }
    });
    /**
     * read other data from destination
     */
    let parsedDest;
    await fs_1.default.promises.readFile(_dest, { encoding: 'utf-8' }).then(async (val) => {
        try {
            parsedDest = JSON.parse(val);
        }
        catch (e) {
            console.log(`failed to parse destination`);
            process.exit(1);
        }
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
         * write to destination file
         */
        try {
            const newDestContent = JSON.stringify({ ...parsedDest, ...pack });
            await fs_1.default.promises.writeFile(_dest, newDestContent).then(() => {
                console.log(`success copying dependencies to destination`);
            });
        }
        catch (e) {
            console.log('error when stringify dest');
            process.exit(1);
        }
    });
}
exports.default = default_1;
