const Tx = require('ethereumjs-tx');
const ethUtil = require('ethjs-util');
const HTTPProvider = require('ethjs-provider-http');

module.exports = SignerProvider;

function SignerProvider(path, options) {
  if (!(this instanceof SignerProvider)) { throw new Error('[ethjs-provider-signer] the SignerProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new SignerProvider(...));`).'); }
  if (typeof options !== 'object') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'privateKey' property specified, you provided type ${typeof options}.`); }
  if (typeof options.signTransaction !== 'function') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'signTransaction' property specified, you provided type ${typeof options.privateKey} (e.g. 'const eth = new Eth(new SignerProvider("http://ropsten.infura.io", { privateKey: (account, cb) => cb(null, 'some private key') }));').`); }

  const self = this;
  self.options = options;
  self.timeout = options.timeout || 0;
  self.provider = new HTTPProvider(path, self.timeout);
}

// fix ethereumjs-tx rawTx object
function shimEthereumJSTxObject(rawTx) {
  const rawTxMutation = Object.assign({}, rawTx);

  // fix rawTx gaslimit
  if (typeof rawTxMutation.gas === 'string') {
    rawTxMutation.gasLimit = rawTxMutation.gas;
    delete rawTxMutation.gas;
  }

  // return new mutated raw tx object
  return rawTxMutation;
}

SignerProvider.sign = function signTx(rawTx, privateKey) {
  // format raw tx data
  const shimmedRawTx = Object.assign({}, shimEthereumJSTxObject(rawTx));

  // sign tx object, serilize, convert to hex, privateKey not stored in temp data
  const signedHexPayload = new Tx(shimmedRawTx);
  signedHexPayload.sign(new Buffer(ethUtil.stripHexPrefix(privateKey), 'hex'));

  // ensure hex is prefixed
  return `0x${signedHexPayload.serialize().toString('hex')}`;
};

SignerProvider.prototype.sendAsync = function (payload, callback) { // eslint-disable-line
  const self = this;
  if (payload.method === 'eth_sendTransaction') {
    self.options.signTransaction(payload.params[0], (keyError, signedHexPayload) => { // eslint-disable-line
      if (!keyError) {
        // create new output payload
        const outputPayload = Object.assign({}, {
          id: payload.id,
          jsonrpc: payload.jsonrpc,
          method: 'eth_sendRawTransaction',
          params: [signedHexPayload],
        });

        // send payload
        self.provider.sendAsync(outputPayload, callback);
      } else {
        return callback(new Error(`[ethjs-provider-signer] while signing your sendTransaction payload: ${JSON.stringify(keyError)}`), null);
      }
    });
  } else {
    self.provider.sendAsync(payload, callback);
  }
};
