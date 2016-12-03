# User Guide

All information for developers using `ethjs-provider-signer` should consult this document.

## Install

```
npm install --save ethjs-provider-signer
```

## Usage

```js
const SignerProvider = require('ethjs-provider-signer');
const Eth = require('ethjs-query');
const provider = new SignerProvider('http://ropsten.infura.io', {
  privateKey: (account, cb) => cb(null, '0x...privateKey...'),
});
const eth = new Eth(provider);

eth.sendTransaction({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  gas: 300000,
  data: '0x...',
}, cb);

// results null 0x... (transaction hash)
```

## API Design

### constructor

[index.js:ethjs-provider-signer](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a `provider` URL specified as a string, and an options object where the `privateKey` method is specified.

**Parameters**

-   `provider` **String** the URL path to your local Http RPC enabled Ethereum node (e.g. `http://localhost:8545`) or a service node system like [Infura.io](http://infura.io) (e.g. `http://ropsten.infura.io`).
-   `options` **Object** the options object where the `privateKey` method and `timeout` property is specified.

Example options **Object**:

```js
const options = {
  privateKey: (account, cb) => {
    if (account) {
      cb(null, '0x...privateKey...');
    } else {
      cb('some error');
    }
  },
  timeout: 400,
};
```

Result `SignerProvider` **Object**.

```js
const SignerProvider = require('ethjs-provider-signer');
const Eth = require('ethjs-query');
const provider = new SignerProvider('http://ropsten.infura.io', {
  privateKey: (account, cb) => cb(null, '0x...privateKey...'),
});
const eth = new Eth(provider);

eth.sendTransaction({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  gas: 300000,
  data: '0x...',
}, cb);

// results null 0x... (transaction hash)
```

## Other Awesome Modules, Tools and Frameworks

 - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum swiss army knife **Ethereum Foundation**
 - [ethereumjs](https://github.com/ethereumjs) -- critical ethereumjs infrastructure **Ethereum Foundation**
 - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE **Ethereum Foundation**
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.
