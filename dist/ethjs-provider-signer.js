 /* eslint-disable */ 
 /* eslint-disable */ 
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SignerProvider", [], factory);
	else if(typeof exports === 'object')
		exports["SignerProvider"] = factory();
	else
		root["SignerProvider"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var HTTPProvider = __webpack_require__(1);

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
  if (!(this instanceof SignerProvider)) {
    throw new Error('[ethjs-provider-signer] the SignerProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new SignerProvider(...));`).');
  }
  if (typeof options !== 'object') {
    throw new Error('[ethjs-provider-signer] the SignerProvider requires an options object be provided with the \'privateKey\' property specified, you provided type ' + typeof options + '.');
  }
  if (typeof options.signTransaction !== 'function') {
    throw new Error('[ethjs-provider-signer] the SignerProvider requires an options object be provided with the \'signTransaction\' property specified, you provided type ' + typeof options.privateKey + ' (e.g. \'const eth = new Eth(new SignerProvider("http://ropsten.infura.io", { privateKey: (account, cb) => cb(null, \'some private key\') }));\').');
  }

  var self = this;
  self.options = options;
  self.timeout = options.timeout || 0;
  self.provider = new HTTPProvider(path, self.timeout);
}

/**
 * Send async override
 *
 * @method sendAsync
 * @param {payload} payload the input data payload
 * @param {Function} callback the send async callback
 * @callback {Object} output the XMLHttpRequest payload
 */
SignerProvider.prototype.sendAsync = function (payload, callback) {
  // eslint-disable-line
  var self = this;
  if (payload.method === 'eth_sendTransaction') {
    self.options.signTransaction(payload.params[0], function (keyError, signedHexPayload) {
      // eslint-disable-line
      if (!keyError) {
        // create new output payload
        var outputPayload = Object.assign({}, {
          id: payload.id,
          jsonrpc: payload.jsonrpc,
          method: 'eth_sendRawTransaction',
          params: [signedHexPayload]
        });

        // send payload
        self.provider.sendAsync(outputPayload, callback);
      } else {
        return callback(new Error('[ethjs-provider-signer] while signing your sendTransaction payload: ' + JSON.stringify(keyError)), null);
      }
    });
  } else {
    self.provider.sendAsync(payload, callback);
  }
};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

/**
 * @original-authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

// workaround to use httpprovider in different envs
var XHR2 = __webpack_require__(2);

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result, host) {
  var message = !!result && !!result.error && !!result.error.message ? '[ethjs-provider-http] ' + result.error.message : '[ethjs-provider-http] Invalid JSON RPC response from host provider ' + host + ': ' + JSON.stringify(result, null, 2);
  return new Error(message);
}

/**
 * HttpProvider should be used to send rpc calls over http
 */
function HttpProvider(host, timeout) {
  if (!(this instanceof HttpProvider)) {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new HttpProvider());`).');
  }
  if (typeof host !== 'string') {
    throw new Error('[ethjs-provider-http] the HttpProvider instance requires that the host be specified (e.g. `new HttpProvider("http://localhost:8545")` or via service like infura `new HttpProvider("http://ropsten.infura.io")`)');
  }

  var self = this;
  self.host = host;
  self.timeout = timeout || 0;
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.sendAsync = function (payload, callback) {
  // eslint-disable-line
  var self = this;
  var request = new XHR2(); // eslint-disable-line

  request.timeout = self.timeout;
  request.open('POST', self.host, true);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.timeout !== 1) {
      var result = request.responseText; // eslint-disable-line
      var error = null; // eslint-disable-line

      try {
        result = JSON.parse(result);
      } catch (jsonError) {
        error = invalidResponseError(request.responseText, self.host);
      }

      callback(error, result);
    }
  };

  request.ontimeout = function () {
    callback('[ethjs-provider-http] CONNECTION TIMEOUT: http request timeout after ' + self.timeout + ' ms. (i.e. your connect has timed out for whatever reason, check your provider).', null);
  };

  try {
    request.send(JSON.stringify(payload));
  } catch (error) {
    callback('[ethjs-provider-http] CONNECTION ERROR: Couldn\'t connect to node \'' + self.host + '\': ' + JSON.stringify(error, null, 2), null);
  }
};

module.exports = HttpProvider;

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = XMLHttpRequest;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ])
});
;
//# sourceMappingURL=ethjs-provider-signer.js.map