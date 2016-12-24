const HTTPProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');

module.exports = SignerProvider;

/**
 * Signer provider constructor
 *
 * @method SignerProvider
 * @param {String} path the input data payload
 * @param {Object} options the send async callback
 * @returns {Object} provider instance
 */
function SignerProvider(path, options) {
  if (!(this instanceof SignerProvider)) { throw new Error('[ethjs-provider-signer] the SignerProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new SignerProvider(...));`).'); }
  if (typeof options !== 'object') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'privateKey' property specified, you provided type ${typeof options}.`); }
  if (typeof options.signTransaction !== 'function') { throw new Error(`[ethjs-provider-signer] the SignerProvider requires an options object be provided with the 'signTransaction' property specified, you provided type ${typeof options.privateKey} (e.g. 'const eth = new Eth(new SignerProvider("http://ropsten.infura.io", { privateKey: (account, cb) => cb(null, 'some private key') }));').`); }

  const self = this;
  self.options = Object.assign({
    provider: HTTPProvider,
  }, options);
  self.timeout = options.timeout || 0;
  self.provider = new self.options.provider(path, self.timeout); // eslint-disable-line
  self.rpc = new EthRPC(self.provider);
}

/**
 * Send async override
 *
 * @method sendAsync
 * @param {payload} payload the input data payload
 * @param {Function} callback the send async callback
 * @callback {Object} output the XMLHttpRequest payload
 */
SignerProvider.prototype.sendAsync = function (payload, callback) { // eslint-disable-line
  const self = this;
  if (payload.method === 'eth_accounts' && self.options.accounts) {
    self.options.accounts((accountsError, accounts) => {
      // create new output payload
      const inputPayload = Object.assign({}, {
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result: accounts,
      });

      callback(accountsError, inputPayload);
    });
  } else if (payload.method === 'eth_sendTransaction') {
    // get the nonce, if any
    self.rpc.sendAsync({ method: 'eth_getTransactionCount', params: [payload.params[0].from, 'latest'] }, (nonceError, nonce) => { // eslint-disable-line
      if (nonceError) {
        return callback(new Error(`[ethjs-provider-signer] while getting nonce: ${nonceError}`), null);
      }

      // get the gas price, if any
      self.rpc.sendAsync({ method: 'eth_gasPrice' }, (gasPriceError, gasPrice) => { // eslint-disable-line
        if (gasPriceError) {
          return callback(new Error(`[ethjs-provider-signer] while getting gasPrice: ${gasPriceError}`), null);
        }

        // build raw tx payload with nonce and gasprice as defaults to be overriden
        const rawTxPayload = Object.assign({
          nonce,
          gasPrice,
        }, payload.params[0]);

        // sign transaction with raw tx payload
        self.options.signTransaction(rawTxPayload, (keyError, signedHexPayload) => { // eslint-disable-line
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
            callback(new Error(`[ethjs-provider-signer] while signing your transaction payload: ${JSON.stringify(keyError)}`), null);
          }
        });
      });
    });
  } else {
    self.provider.sendAsync(payload, callback);
  }
};
