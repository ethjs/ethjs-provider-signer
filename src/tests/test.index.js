const assert = require('chai').assert;
const HTTPProvider = require('ethjs-provider-http'); // eslint-disable-line
const SignerProvider = require('../index.js'); // eslint-disable-line
const Eth = require('ethjs-query'); // eslint-disable-line
const Web3 = require('web3'); // eslint-disable-line
const HttpProvider = require('ethjs-provider-http');
const TestRPC = require('ethereumjs-testrpc');
const sign = require('ethjs-signer').sign;
const server = TestRPC.server({
  accounts: [{
    secretKey: '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33',
    balance: '0x0000000000000056bc75e2d63100000',
  }],
});
server.listen(5012);

describe('SignerProvider', () => {
  describe('constructor', () => {
    it('should construct properly', (done) => {
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => {
          const sigpack = sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33');

          cb(null, sigpack);
        },
      });

      assert.equal(typeof provider, 'object');
      assert.equal(typeof sign, 'function');
      assert.equal(typeof provider.options, 'object');
      assert.equal(typeof provider.options.signTransaction, 'function');
      assert.equal(provider.timeout, 0);

      setTimeout(() => {
        done();
      }, 3000);
    });

    it('should throw errors when improperly constructed', () => {
      assert.throws(() => SignerProvider('http://localhost:5012', {}), Error); // eslint-disable-line
      assert.throws(() => new SignerProvider('http://localhost:5012', 22), Error);
      assert.throws(() => new SignerProvider('http://localhost:5012', {}), Error);
      assert.throws(() => new SignerProvider('http://localhost:5012'), Error);
    });
  });

  describe('functionality', () => {
    it('should perform normally for calls', (done) => {
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accounts, 'object');
        assert.equal(Array.isArray(accounts), true);

        eth.getBalance(accounts[0], (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');

          done();
        });
      });
    });

    it('should perform normally for calls with tx count and gas price', (done) => {
      const eth = new Eth(new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
      }));

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accounts, 'object');
        assert.equal(Array.isArray(accounts), true);

        eth.getBalance(accounts[0], (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');

          done();
        });
      });
    });

    it('should reconstruct sendTransaction as sendRawTransaction', (done) => {
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts), true);

        eth.sendTransaction({
          from: accounts[0],
          to: '0xc55c58355a32c095c70748374673829241807487',
          data: '0x',
          value: 5000,
          gas: 300000,
        }, (txError, txHash) => {
          assert.equal(txError, null);
          assert.equal(typeof txHash, 'string');

          setTimeout(() => {
            eth.getBalance('0xc55c58355a32c095c70748374673829241807487')
            .then((balanceResult) => {
              assert.equal(typeof balanceResult, 'object');
              assert.equal(balanceResult.toNumber(10), 5000);

              done();
            });
          }, 500);
        });
      });
    });

    it('should handle invalid nonce', (done) => {
      const baseProvider = new HttpProvider('http://localhost:5012');
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(new Error('account does not have permission')),
        provider: function Provider() {
          const self = this;
          self.sendAsync = (payload, cb) => {
            if (payload.method === 'eth_getTransactionCount') {
              cb(new Error('invalid nonce'), null);
            } else {
              baseProvider.sendAsync(payload, cb);
            }
          };
        },
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts), true);
        done();
      });
    });

    it('should handle valid accounts option', (done1) => {
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
        accounts: (cb) => cb(null, ['0xc55c58355a32c095c70748374673829241807487']),
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts1) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts1), true);

        done1();
      });
    });

    it('should handle invalid gas price', (done) => {
      const baseProvider = new HttpProvider('http://localhost:5012');
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
        provider: function Provider() {
          const self = this;
          self.sendAsync = (payload, cb) => {
            if (payload.method === 'eth_gasPrice') {
              cb(new Error('invalid nonce'), null);
            } else {
              baseProvider.sendAsync(payload, cb);
            }
          };
        },
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts), true);

        eth.sendTransaction({
          from: accounts[0],
          to: '0xc55c58355a32c095c70748374673829241807487',
          data: '0x',
          gas: 300000,
        }).catch((txError) => {
          assert.equal(typeof txError, 'object');

          done();
        });
      });
    });

    it('should handle invalid tx count', (done) => {
      const baseProvider = new HttpProvider('http://localhost:5012');
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(null, sign(rawTx, '0xc55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33')),
        provider: function Provider() {
          const self = this;
          self.sendAsync = (payload, cb) => {
            if (payload.method === 'eth_getTransactionCount') {
              cb(new Error('invalid nonce'), null);
            } else {
              baseProvider.sendAsync(payload, cb);
            }
          };
        },
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts), true);

        eth.sendTransaction({
          from: accounts[0],
          to: '0xc55c58355a32c095c70748374673829241807487',
          data: '0x',
          gas: 300000,
        }).catch((txError) => {
          assert.equal(typeof txError, 'object');

          done();
        });
      });
    });

    it('should throw an error when key error is provided', (done) => {
      const provider = new SignerProvider('http://localhost:5012', {
        signTransaction: (rawTx, cb) => cb(new Error('account does not have permission')),
      });
      const eth = new Eth(provider);

      eth.accounts((accountsError, accounts) => {
        assert.equal(accountsError, null);
        assert.equal(Array.isArray(accounts), true);

        eth.sendTransaction({
          from: accounts[0],
          to: '0xc55c58355a32c095c70748374673829241807487',
          data: '0x',
          gas: 300000,
        }).catch((txError) => {
          assert.equal(typeof txError, 'object');

          done();
        });
      });
    });
  });
});
