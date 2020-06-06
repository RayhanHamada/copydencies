import meow from 'meow';

import { AppFlags, CopyFlag, PasteFlag } from './types';
import copydencies from './index';

const promptMsg = `format: $copyden <dest> <source> [--onlyDep | --onlyDev | --both] [--asDep | --asDev | --asEach]
flag for source dependency:
--onlyDep   : copy only dependencies
--onlyDev   : copy only devDependencies
--both      : copy both (default)

flag for destination dependency
--asDep     : paste as dependencies
--asDev     : paste as devDependencies
--asEach    : paste as each (default)
`;

const promptFlags: AppFlags = {
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

const cli = meow<AppFlags>(promptMsg, {
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
} else if (cli.input.length < 2) {
  console.log(`Argument for source package expected`);
  cli.showHelp(1);
  process.exit(1);
}

/**
 * for catched invalid flags
 */
const invalidFlag = (flag: 'copy' | 'paste') => {
  console.log(`Invalid ${flag} flag !`);
  cli.showHelp();
  process.exit(1);
};

/**
 * get destination and source path
 */
const dest = cli.input[0];
const source = cli.input[1];
let copyFlag: CopyFlag = 'both';
let pasteFlag: PasteFlag = 'asEach';

if (cli.flags.onlyDep) copyFlag = 'onlyDep';
// only copy dependencies
else if (cli.flags.onlyDev) copyFlag = 'onlyDev';
// only copy devDependencies
else if (!cli.flags.both) invalidFlag('copy'); // catch invalid flag

if (cli.flags.asDep) pasteFlag = 'asDep';
// paste as dependencies
else if (cli.flags.asDev) pasteFlag = 'asDev';
// paste as devDependencies
else if (!cli.flags.both) invalidFlag('paste'); // catch

copydencies(dest, source, copyFlag, pasteFlag);
