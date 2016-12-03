const Tx = require('ethereumjs-tx');
const ethUtil = require('ethjs-util');
const HTTPProvider = require('ethjs-provider-http');

module.exports = SignerProvider;

function SignerProvider(path, options) {
  if (!(this instanceof SignerProvider)) { throw new Error('[ethjs-provider-signer] the SignerProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new SignerProvider(...));`).'); }
  if (typeof options !== 'object') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'privateKey' property specified, you provided type ${typeof options}.`); }
  if (typeof options.privateKey !== 'function') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'privateKey' property specified, you provided type ${typeof options.privateKey} (e.g. 'const eth = new Eth(new SignerProvider("http://ropsten.infura.io", { privateKey: (account, cb) => cb(null, 'some private key') }));').`); }

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

SignerProvider.prototype.sendAsync = function (payload, callback) { // eslint-disable-line
  const self = this;
  if (payload.method === 'eth_sendTransaction') {
    self.options.privateKey(payload.params[0].from, (keyError, privateKey) => { // eslint-disable-line
      if (!keyError) {
        try {
          // create new output payload
          const outputPayload = Object.assign({}, {
            id: payload.id,
            jsonrpc: payload.jsonrpc,
            method: 'eth_sendRawTransaction',
            params: [],
          });

          // format raw tx data
          const rawTx = Object.assign({}, shimEthereumJSTxObject(payload.params[0]));

          // sign tx object, serilize, convert to hex, privateKey not stored in temp data
          const signedHexPayload = new Tx(rawTx);
          signedHexPayload.sign(new Buffer(ethUtil.stripHexPrefix(privateKey), 'hex'));

          // ensure hex is prefixed
          outputPayload.params = [`0x${signedHexPayload.serialize().toString('hex')}`];

          // send payload
          self.provider.sendAsync(outputPayload, callback);
        } catch (errorWhileSigning) {
          return callback(new Error(`[ethjs-provider-signer] while signing your sendTransaction payload: ${JSON.stringify(errorWhileSigning)}`), null);
        }
      } else {
        return callback(new Error(`[ethjs-provider-signer] while signing your sendTransaction payload: ${JSON.stringify(keyError)}`), null);
      }
    });
  } else {
    self.provider.sendAsync(payload, callback);
  }
};
