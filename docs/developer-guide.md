# Developer Guide

All information regarding contributing to and progressing `ethjs-provider-signer` module can be found in this document.

## Install
```
npm install --save ethjs-provider-signer
```

## Install from Source

```
git clone http://github.com/ethjs/ethjs-provider-signer
npm install
```

## Test
```
npm test
```

## Travis-ci and Coveralls Testing

Note, this will generate the coveralls report locally.

```
npm run test-travis
```

## Folder Structure

All module source code is found in the `src` directory. All module helper scripts can be found in the `scripts` folder. These will not need to be touched, and are purely configuration for this repository.

```
./ethjs-provider-signer
  ./.github
  ./coverage
  ./docs
  ./src
    ./tests
```

## Dependancies

 - "xhr2": "0.1.3" -- https://www.npmjs.com/package/xhr2

## NPM Practice

Across all `ethjs-` repos, we enforce version hardening (i.e. "0.0.3" not "^0.0.3"). We want to reduce potential hazardous install changes from dependancies as much as possible to ensure package preformace, testing, security and design. Please make sure all your commits and PR's are version hardend if you are installing or removing new packages.

## Chanelog

All relevant changes are notated in the `CHANGELOG.md` file, moniter this file for changes to this repository.

## Travis-ci and Coveralls Practice

Across all `ethjs-` repos, we enforce mandatory travis-ci and coveralls testing. We never `commit to master`. As a general policy, Coveralls.io results must always be above 95% for any `ethjs-` PR or commit. We want to ensure complete coverage across the board.

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard. Please read more about contributing to `ethjs-provider-signer` in the `.github/CONTRIBUTING.md`.

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 weifund. For more information see LICENSE.
