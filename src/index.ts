/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import { CopyFlag, PasteFlag, Package } from './types';
import fs from 'fs';

async function copyden(
  dest: string,
  source: string,
  copyFlag: CopyFlag = 'both',
  pasteFlag: PasteFlag = 'asEach'
): Promise<void> {
  let _dest: string, _source: string;
  try {
    _dest = path.resolve(process.cwd(), dest);
  } catch (e) {
    console.log(
      `dest path failed to be resolved, please check your dest path !`
    );
    process.exit(1);
  }
  try {
    _source = path.resolve(process.cwd(), source);
  } catch (e) {
    console.log(
      `source path failed to be resolved, please check your source path !`
    );
    process.exit(1);
  }

  /**
   * check if destination and source exists
   */
  if (!fs.existsSync(_dest)) {
    console.error(`${dest} not exists !`);
    process.exit(1);
  }

  if (!fs.existsSync(_source) && !fs.lstatSync(_source).isFile()) {
    console.error(`${dest} not exists !`);
    process.exit(1);
  }

  /**
   * check if destination and source is a file
   */
  if (!fs.lstatSync(_dest).isFile()) {
    console.error(`${dest} is not a file`);
    process.exit(1);
  }

  if (!fs.lstatSync(_source).isFile()) {
    console.error(`${source} is not a file`);
    process.exit(1);
  }

  /**
   * read destination
   */
  let parsedDest: Package = {};
  await fs.promises
    .readFile(_dest, { encoding: 'utf-8' })
    .then(async val => {
      try {
        parsedDest = JSON.parse(val);
      } catch (e) {
        console.log(
          `failed to parse destination, please check your destination package.json !`
        );
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
  let parsedSource: Package = {};
  await fs.promises
    .readFile(_source, { encoding: 'utf-8' })
    .then(val => {
      try {
        parsedSource = JSON.parse(val);
      } catch (e) {
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
  let pack: Package;

  if (copyFlag === 'onlyDep') {
    /**
     * if we just want to copy the dependencies
     */
    pack = {
      dependencies: parsedSource.dependencies,
    };
  } else if (copyFlag === 'onlyDev') {
    /**
     * if we just want to copy the devDependencies
     */
    pack = {
      devDependencies: parsedSource.devDependencies,
    };
  } else if (copyFlag !== 'both') {
    /**
     * catch invalid flag here
     */
    console.log(`Invalid Flag !`);
    process.exit(1);
  } else {
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
    };
  } else if (pasteFlag === 'asDev') {
    /**
     * if we only want to paste it to devDependencies
     */
    pack = {
      devDependencies: {
        ...pack.dependencies,
        ...pack.devDependencies,
      },
    };
  } else if (pasteFlag !== 'asEach') {
    /**
     * catch invalid flag here
     */
    console.log(`Invalid paste flag`);
    process.exit(1);
  } else {
    /**
     * do nothing
     */
  }

  /**
   * stringify dest's new content
   */
  let newDestContent: string;
  try {
    newDestContent = JSON.stringify({ ...parsedDest, ...pack });
  } catch (e) {
    console.log('error when stringify dest');
    process.exit(1);
  }

  /**
   * write new content to destination
   */
  await fs.promises.writeFile(_dest, newDestContent).then(() => {
    console.log(`success copying dependencies to destination`);
  });
}

export default copyden;
