import meow from 'meow';
import fs from 'fs';
import path from 'path';
import { AppFlags, Package } from './types';
import {} from 'prettier';

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
    default: true,
    type: 'boolean',
  },
  asDep: {
    type: 'boolean',
  },
  asDev: {
    type: 'boolean',
  },
  asEach: {
    default: true,
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
 * check if destination and source exists
 */
const dest = path.resolve(process.cwd(), cli.input[0]);
const source = path.resolve(process.cwd(), cli.input[1]);

if (!fs.existsSync(dest)) {
  console.error('Destination not exists !');
  process.exit(1);
}

if (!fs.existsSync(source)) {
  console.error('Source not exists !');
  process.exit(1);
}

/**
 * read source file
 */
let parsedSource: Package;

fs.promises.readFile(source, { encoding: 'utf-8' }).then((val) => {
  try {
    parsedSource = JSON.parse(val);
  } catch (e) {
    console.error('json cannot be decoded !');
    process.exit(1);
  }

  /**
   * check for copy flag
   */
  let pack: Package;

  if (cli.flags.onlyDep) {
    /**
     * if we just want to copy the dependencies
     */
    pack = {
      dependencies: parsedSource.dependencies,
    };
  } else if (cli.flags.onlyDev) {
    /**
     * if we just want to copy the devDependencies
     */
    pack = {
      devDependencies: parsedSource.devDependencies,
    };
  } else if (cli.flags.both) {
    /**
     * if we want to copy both (default)
     */
    pack = {
      dependencies: parsedSource.dependencies,
      devDependencies: parsedSource.devDependencies,
    };
  } else {
    console.log(`Invalid flag`);
    cli.showHelp();
    process.exit(1);
  }

  /* 
  check for paste flag
  */
  if (cli.flags.asDep) {
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
  } else if (cli.flags.asDev) {
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
  } else if (cli.flags.asEach) {
    /**
     * do nothing
     */
  } else {
    console.log(`Invalid flag`);
    cli.showHelp();
    process.exit(1);
  }

  /**
   * read other data from destination
   */
  let parsedDest: Package;
  fs.promises.readFile(dest, { encoding: 'utf-8' }).then((val) => {
    try {
      parsedDest = JSON.parse(val);
    } catch (e) {
      console.log(`failed to parse destination`);
      process.exit(1);
    }

    /**
     * write to destination file
     */
    try {
      const stringifiedDest = JSON.stringify({ ...parsedDest, ...pack });

      fs.promises.writeFile(dest, stringifiedDest).then(() => {
        console.log(`success copying dependencies to destination`);
      });
    } catch (e) {
      console.log('error when stringify dest');
      process.exit(1);
    }
  });
});
