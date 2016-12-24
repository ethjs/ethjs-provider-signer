## ethjs-provider-signer

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-provider-signer">
    <img src="https://david-dm.org/ethjs/ethjs-provider-signer.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/ethjs/ethjs-provider-signer#info=devDependencies">
    <img src="https://david-dm.org/ethjs/ethjs-provider-signer/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/ethjs/ethjs-provider-signer">
    <img src="https://travis-ci.org/ethjs/ethjs-provider-signer.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/ethjs-provider-signer">
    <img src="http://img.shields.io/npm/v/ethjs-provider-signer.svg"
    alt="NPM version" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/ethjs/ethjs-provider-signer">
    <img src="https://coveralls.io/repos/github/ethjs/ethjs-provider-signer/badge.svg" alt="Test Coverage" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A simple web3 standard provider that signs sendTransaction payloads.

## Install

```
npm install --save ethjs-provider-signer
```

## Usage

```js
const SignerProvider = require('ethjs-provider-signer');
const sign = require('ethjs-signer').sign;
const Eth = require('ethjs-query');
const provider = new SignerProvider('https://ropsten.infura.io', {
  signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0x...privateKey...')),
  accounts: (cb) => cb(null, ['0x407d73d8a49eeb85d32cf465507dd71d507100c1']),
});
const eth = new Eth(provider);

eth.sendTransaction({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  gas: 300000,
  data: '0x...',
}, cb);

// results null 0x... (transaction hash)
```

## About

A simple wrapper module for `ethjs-provider-http` which allows you to sign sendTransaction payloads. It simply takes the sendTransaction data, signs it, and changes the payload method from `eth_sendTransaction` to `eth_sendRawTransaction`, then sends the payload.

The `signTransaction` method is called everytime a payload must be signed. It provides the raw transaction data, a handy raw transaction signing method and a callback to be fired. The callback must return a single signed alphanumeric hex data payload of the signed raw transaction.

`ethjs-provider-signer` works well with `ethjs-signer`, a simple module for signing raw transactions. You may also bring your own signer from packages like `ethereumjs-signer`.

Note, the `nonce` and `gasPrice` get auto-filled by default (by using the `getTransactionCount` and `gasPrice` RPC calls). However, if these properties are specified in the raw tx object, the raw tx object props will override the default `nonce` and `gasPrice` values provided.

## Contributing

Please help better the ecosystem by submitting issues and pull requests to `ethjs-provider-signer`. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard and the unix philosophy.

## Guides

You'll find more detailed information on using `ethjs-provider-signer` and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to `ethjs-provider-signer` and writing your own code and coverage.

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

- Create, enhance, and debug ethjs rules (see our guide to ["Working on rules"](./github/CONTRIBUTING.md)).
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making `ethjs-provider-signer` better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools, like modules for encoding or contracts.
- Spread the word.

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) docs before helping out.

We communicate via [issues](https://github.com/ethjs/ethjs-provider-signer/issues) and [pull requests](https://github.com/ethjs/ethjs-provider-signer/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/ethjs/ethjs-provider-signer/master/LICENSE)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
