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
  signTransaction: (rawTx, cb) => cb(null, SignerProvider.sign(rawTx, '0x...privateKey...')),
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
-   `options` **Object** the options object where the `signTransaction` method and `timeout` property is specified.

Example options **Object**:

```js
const options = {
  signTransaction: (rawTx, cb) => {
    if (rawTx.from === '0x...') {
      cb(null, SignerProvider.sign(rawTx, '0x...privateKey...'));
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
const eth = new Eth(new SignerProvider('http://ropsten.infura.io', {
  signTransaction: (rawTx, cb) => cb(null, SignerProvider.sign(rawTx, '0x...privateKey...')),
}));

eth.sendTransaction({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  gas: 300000,
  data: '0x...',
}, cb);

// results null 0x... (transaction hash)
```

### SignerProvider.sign

[index.js:ethjs-provider-signer](../../../blob/master/src/index.js "Source code on GitHub")

Intakes an Ethereum RPC standard raw transaction object and Ethereum standard private key as a hexified alphanumeric string. Outputs signed transaction data as a hex string.

**Parameters**

-   `rawTx` **Object** the raw transaction object (i.e. `{ from: '0x..', to: '0x..', data: '0x', gas: 300000 }`)
-   `privateKey` **String** the options object where the `signTransaction` method and `timeout` property is specified.

Result signed transaction data **String**

```js
const SignerProvider = require('ethjs-provider-signer');

const signedHexData = SignerProvider.sign({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  gas: 300000,
  data: '0x',
}, '0xd35c58355a1sc095c7074837467382924180748768s2258ef5f7fa384e6fcb3s');

// result '0xbd685c98ec39490f50d15c67ba2a8e9b5b1d6d7601fca80b295e7d717446bd8b7127ea4871e996cdc8cae7690408b4e800f60ddac49d2ad34180e68f1da0aaf001';
```

## Browser Builds

`ethjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/ethjs-provider-signer.js` or `dist/ethjs-provider-signer.min.js` directly into an HTML file to start using this module. Note, an `SignerProvider` object is made available globally.

```html
<script type="text/javascript" src="ethjs-provider-signer.min.js"></script>
<script type="text/javascript">
new SignerProvider(...);
</script>
```

Note, even though `ethjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

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
