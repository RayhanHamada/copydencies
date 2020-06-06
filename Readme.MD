# Copydencies

a package for copying dependencies from one package.json to another package.json

# Install

## For CLI use

use this if you want to use this package only in your terminal

```sh
// with npm
npm i -g copydencies

// or with yarn
yarn global add copydencies
```

## For programatic use

use this if you want to use this package in your code

```
// with npm
npm i copydencies

// with yarn
yarn add copydencies
```

# Usage

## CLI use

here is the command format

```
copyden <dest> <source> [--onlyDep | --onlyDev | --both] [--asDep | --asDev | --asEach]

format: $copyden <dest> <source> [--onlyDep | --onlyDev | --both] [--asDep | --asDev | --asEach]

flag for source dependency:
--onlyDep   : copy only source's dependencies
--onlyDev   : copy only source's devDependencies
--both      : copy both source's dependencies and devDependencies (default)

flag for destination dependency
--asDep     : paste as dest's dependencies
--asDev     : paste as dest's devDependencies
--asEach    : paste as dest's dependencies and devDependencies (default)
```

```
// you could do this

// this means you want only the dependencies from package1.json and copy it to package2.json as devDependencies
copyden ./package2.json ./package1.json --onlyDep --asDev

```

## Programatical use

In case you want to use it in your code, you also could do it.

first install it as your project dependency (although you may already have it installed global, i still recommend u to do this)

```
npm i copydencies

// or with yarn

yarn add copydencies
```

and u could use it in your code

```ts
// import with es6 import statement like this
import copyden from 'copydencies';
// or with regular require import
const copyden = require('copydencies').default; 

// and use it like this

copyden('./package2.json', './package1.json', 'onlyDep', 'asDev');

// and copyden also returns Promise<void>, so you could do
copyden('./package2.json', './package1.json', 'onlyDep', 'asDev').then(() => {
  // do something here...
});
```
