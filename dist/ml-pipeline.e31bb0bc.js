// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backend = hn;
exports.buffer = er;
exports.customGrad = oa;
exports.deprecationWarn = Xe;
exports.disableDeprecationWarnings = je;
exports.dispose = tn;
exports.disposeVariables = Ye;
exports.enableDebugMode = Ke;
exports.enableProdMode = qe;
exports.engine = $e;
exports.env = i;
exports.fill = Hn;
exports.findBackend = un;
exports.findBackendFactory = cn;
exports.getBackend = an;
exports.getGradient = h;
exports.getKernel = l;
exports.getKernelsForBackend = f;
exports.grad = Zo;
exports.grads = ta;
exports.keep = en;
exports.linspace = qn;
exports.memory = Qe;
exports.nextFrame = ap;
exports.ones = zn;
exports.op = An;
exports.print = nr;
exports.profile = Je;
exports.range = Kn;
exports.ready = on;
exports.registerBackend = ln;
exports.registerGradient = p;
exports.registerKernel = d;
exports.removeBackend = sn;
exports.scalar = On;
exports.setBackend = rn;
exports.setPlatform = fn;
exports.sumOutType = Dt;
exports.tensor = Fn;
exports.tensor1d = Mn;
exports.tensor2d = Bn;
exports.tensor3d = Pn;
exports.tensor4d = Ln;
exports.tensor5d = Wn;
exports.tensor6d = Un;
exports.tidy = Ze;
exports.time = nn;
exports.unregisterGradient = g;
exports.unregisterKernel = v;
exports.valueAndGrad = ea;
exports.valueAndGrads = na;
exports.variable = Vn;
exports.variableGrads = ra;
exports.zeros = Gn;
exports.floorDiv = exports.floor = exports.fft = exports.eye = exports.expm1 = exports.expandDims = exports.exp = exports.erf = exports.equalStrict = exports.equal = exports.elu = exports.dropout = exports.dot = exports.divStrict = exports.divNoNan = exports.div = exports.diag = exports.depthwiseConv2d = exports.depthToSpace = exports.cumsum = exports.cosh = exports.cos = exports.conv3dTranspose = exports.conv3d = exports.conv2dTranspose = exports.conv2d = exports.conv1d = exports.concat4d = exports.concat3d = exports.concat2d = exports.concat1d = exports.concat = exports.complex = exports.clone = exports.clipByValue = exports.ceil = exports.cast = exports.browser = exports.broadcastTo = exports.booleanMaskAsync = exports.batchToSpaceND = exports.batchNormalization4d = exports.batchNormalization3d = exports.batchNormalization2d = exports.batchNormalization = exports.batchNorm4d = exports.batchNorm3d = exports.batchNorm2d = exports.batchNorm = exports.basicLSTMCell = exports.backend_util = exports.avgPool3d = exports.avgPool = exports.atanh = exports.atan2 = exports.atan = exports.asinh = exports.asin = exports.argMin = exports.argMax = exports.any = exports.all = exports.addStrict = exports.addN = exports.add = exports.acosh = exports.acos = exports.abs = exports.Variable = exports.Transpose = exports.Tile = exports.TensorBuffer = exports.Tensor = exports.SquaredDifference = exports.Square = exports.SGDOptimizer = exports.Reduction = exports.Rank = exports.RMSPropOptimizer = exports.PadV2 = exports.Optimizer = exports.OneHot = exports.NonMaxSuppressionV5 = exports.MomentumOptimizer = exports.MaxPoolWithArgmax = exports.KernelBackend = exports.Identity = exports.FusedBatchNorm = exports.FromPixels = exports.Environment = exports.ENV = exports.Div = exports.DataStorage = exports.BroadcastTo = exports.AddN = exports.Add = exports.AdamaxOptimizer = exports.AdamOptimizer = exports.AdagradOptimizer = exports.AdadeltaOptimizer = void 0;
exports.signal = exports.sign = exports.sigmoid = exports.setdiff1dAsync = exports.serialization = exports.separableConv2d = exports.selu = exports.scatter_util = exports.scatterND = exports.rsqrt = exports.round = exports.rfft = exports.reverse4d = exports.reverse3d = exports.reverse2d = exports.reverse1d = exports.reverse = exports.reshape = exports.relu6 = exports.relu = exports.reciprocal = exports.real = exports.randomUniform = exports.randomNormal = exports.randomGamma = exports.rand = exports.prod = exports.prelu = exports.powStrict = exports.pow = exports.pool = exports.pad4d = exports.pad3d = exports.pad2d = exports.pad1d = exports.pad = exports.outerProduct = exports.onesLike = exports.oneHot = exports.notEqualStrict = exports.notEqual = exports.norm = exports.neg = exports.multinomial = exports.multiRNNCell = exports.mulStrict = exports.mul = exports.movingAverage = exports.moments = exports.modStrict = exports.mod = exports.minimumStrict = exports.minimum = exports.min = exports.mean = exports.maximumStrict = exports.maximum = exports.maxPoolWithArgmax = exports.maxPool3d = exports.maxPool = exports.max = exports.math = exports.matMul = exports.losses = exports.logicalXor = exports.logicalOr = exports.logicalNot = exports.logicalAnd = exports.logSumExp = exports.logSoftmax = exports.logSigmoid = exports.log1p = exports.log = exports.localResponseNormalization = exports.linalg = exports.lessStrict = exports.lessEqualStrict = exports.lessEqual = exports.less = exports.leakyRelu = exports.isNaN = exports.isInf = exports.isFinite = exports.irfft = exports.io = exports.inTopKAsync = exports.image = exports.imag = exports.ifft = exports.hannWindow = exports.hammingWindow = exports.greaterStrict = exports.greaterEqualStrict = exports.greaterEqual = exports.greater = exports.gather_util = exports.gatherND = exports.gather = exports.fused = exports.frame = void 0;
exports.zerosLike = exports.whereAsync = exports.where = exports.webgl = exports.version_core = exports.util = exports.unstack = exports.unsortedSegmentSum = exports.truncatedNormal = exports.transpose = exports.train = exports.topk = exports.tile = exports.test_util = exports.tensor_util = exports.tanh = exports.tan = exports.sum = exports.subStrict = exports.sub = exports.stridedSlice = exports.stft = exports.step = exports.stack = exports.squeeze = exports.squaredDifferenceStrict = exports.squaredDifference = exports.square = exports.sqrt = exports.split = exports.spectral = exports.sparseToDense = exports.spaceToBatchND = exports.softplus = exports.softmax = exports.slice_util = exports.slice4d = exports.slice3d = exports.slice2d = exports.slice1d = exports.slice = exports.sinh = exports.sin = void 0;

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var t = function (e, n) {
  return (t = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (t, e) {
    t.__proto__ = e;
  } || function (t, e) {
    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
  })(e, n);
};

function e(e, n) {
  function r() {
    this.constructor = e;
  }

  t(e, n), e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
}

function n(t, e, n, r) {
  return new (n || (n = Promise))(function (o, a) {
    function i(t) {
      try {
        u(r.next(t));
      } catch (t) {
        a(t);
      }
    }

    function s(t) {
      try {
        u(r.throw(t));
      } catch (t) {
        a(t);
      }
    }

    function u(t) {
      t.done ? o(t.value) : new n(function (e) {
        e(t.value);
      }).then(i, s);
    }

    u((r = r.apply(t, e || [])).next());
  });
}

function r(t, e) {
  var n,
      r,
      o,
      a,
      i = {
    label: 0,
    sent: function () {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return a = {
    next: s(0),
    throw: s(1),
    return: s(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function () {
    return this;
  }), a;

  function s(a) {
    return function (s) {
      return function (a) {
        if (n) throw new TypeError("Generator is already executing.");

        for (; i;) try {
          if (n = 1, r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, a[1])).done) return o;

          switch (r = 0, o && (a = [2 & a[0], o.value]), a[0]) {
            case 0:
            case 1:
              o = a;
              break;

            case 4:
              return i.label++, {
                value: a[1],
                done: !1
              };

            case 5:
              i.label++, r = a[1], a = [0];
              continue;

            case 7:
              a = i.ops.pop(), i.trys.pop();
              continue;

            default:
              if (!(o = (o = i.trys).length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
                i = 0;
                continue;
              }

              if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                i.label = a[1];
                break;
              }

              if (6 === a[0] && i.label < o[1]) {
                i.label = o[1], o = a;
                break;
              }

              if (o && i.label < o[2]) {
                i.label = o[2], i.ops.push(a);
                break;
              }

              o[2] && i.ops.pop(), i.trys.pop();
              continue;
          }

          a = e.call(t, i);
        } catch (t) {
          a = [6, t], r = 0;
        } finally {
          n = o = 0;
        }

        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([a, s]);
    };
  }
}

var o = function () {
  function t(t) {
    this.global = t, this.flags = {}, this.flagRegistry = {}, this.urlFlags = {}, this.populateURLFlags();
  }

  return t.prototype.setPlatform = function (t, e) {
    null != this.platform && console.warn("Platform " + this.platformName + " has already been set. Overwriting the platform with " + e + "."), this.platformName = t, this.platform = e;
  }, t.prototype.registerFlag = function (t, e, n) {
    if (this.flagRegistry[t] = {
      evaluationFn: e,
      setHook: n
    }, null != this.urlFlags[t]) {
      var r = this.urlFlags[t];
      console.warn("Setting feature override from URL " + t + ": " + r + "."), this.set(t, r);
    }
  }, t.prototype.get = function (t) {
    return t in this.flags ? this.flags[t] : (this.flags[t] = this.evaluateFlag(t), this.flags[t]);
  }, t.prototype.getNumber = function (t) {
    return this.get(t);
  }, t.prototype.getBool = function (t) {
    return this.get(t);
  }, t.prototype.getFlags = function () {
    return this.flags;
  }, Object.defineProperty(t.prototype, "features", {
    get: function () {
      return this.flags;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.set = function (t, e) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot set flag " + t + " as it has not been registered.");
    this.flags[t] = e, null != this.flagRegistry[t].setHook && this.flagRegistry[t].setHook(e);
  }, t.prototype.evaluateFlag = function (t) {
    if (null == this.flagRegistry[t]) throw new Error("Cannot evaluate flag '" + t + "': no evaluation function found.");
    return this.flagRegistry[t].evaluationFn();
  }, t.prototype.setFlags = function (t) {
    this.flags = Object.assign({}, t);
  }, t.prototype.reset = function () {
    this.flags = {}, this.urlFlags = {}, this.populateURLFlags();
  }, t.prototype.populateURLFlags = function () {
    var t = this;

    if (void 0 !== this.global && void 0 !== this.global.location && void 0 !== this.global.location.search) {
      var e,
          n,
          r = (e = this.global.location.search, n = {}, e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, function (t) {
        for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];

        return a(n, e[0], e[1]), e.join("=");
      }), n);
      if ("tfjsflags" in r) r.tfjsflags.split(",").forEach(function (e) {
        var n = e.split(":"),
            r = n[0],
            o = n[1];

        t.urlFlags[r] = function (t, e) {
          if ("true" === (e = e.toLowerCase()) || "false" === e) return "true" === e;
          if ("" + +e === e) return +e;
          throw new Error("Could not parse value flag value " + e + " for flag " + t + ".");
        }(r, o);
      });
    }
  }, t;
}();

exports.Environment = o;

function a(t, e, n) {
  t[decodeURIComponent(e)] = decodeURIComponent(n || "");
}

function i() {
  return s;
}

var s = null;
exports.ENV = s;
var u = new Map(),
    c = new Map();

function l(t, e) {
  var n = m(t, e);
  return u.get(n);
}

function h(t) {
  return c.get(t);
}

function f(t) {
  for (var e = u.entries(), n = [];;) {
    var r = e.next(),
        o = r.done,
        a = r.value;
    if (o) break;
    var i = a[0],
        s = a[1];
    i.split("_")[0] === t && n.push(s);
  }

  return n;
}

function d(t) {
  var e = t.kernelName,
      n = t.backendName,
      r = m(e, n);
  if (u.has(r)) throw new Error("The kernel '" + e + "' for backend '" + n + "' is already registered");
  u.set(r, t);
}

function p(t) {
  var e = t.kernelName;
  c.has(e) && console.warn("Overriding the gradient for '" + e + "'"), c.set(e, t);
}

function v(t, e) {
  var n = m(t, e);
  if (!u.has(n)) throw new Error("The kernel '" + t + "' for backend '" + e + "' is not registered");
  u.delete(n);
}

function g(t) {
  if (!c.has(t)) throw new Error("The gradient '" + t + "' for backend is not registered");
  c.delete(t);
}

function m(t, e) {
  return e + "_" + t;
}

function y(t) {
  for (var e = t.length, n = 0, r = 0; e > 0;) r = Math.random() * e | 0, n = t[--e], t[e] = t[r], t[r] = n;
}

function x(t, e, n) {
  return Math.max(t, Math.min(e, n));
}

function b(t) {
  return t % 2 == 0 ? t : t + 1;
}

function w(t) {
  for (var e = 0, n = 0; n < t.length; n++) e += t[n];

  return e;
}

function C(t, e) {
  if (!t) throw new Error("string" == typeof e ? e : e());
}

function E(t, e, n) {
  void 0 === n && (n = ""), C(S(t, e), function () {
    return n + " Shapes " + t + " and " + e + " must match";
  });
}

function R(t) {
  C(null != t, function () {
    return "The input to the tensor constructor must be a non-null value.";
  });
}

function I(t, e, n) {
  if (void 0 === e && (e = []), void 0 === n && (n = !1), null == e && (e = []), Array.isArray(t) || V(t) && !n) for (var r = 0; r < t.length; ++r) I(t[r], e, n);else e.push(t);
  return e;
}

function k(t) {
  if (0 === t.length) return 1;

  for (var e = t[0], n = 1; n < t.length; n++) e *= t[n];

  return e;
}

function S(t, e) {
  if (t === e) return !0;
  if (null == t || null == e) return !1;
  if (t.length !== e.length) return !1;

  for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;

  return !0;
}

function A(t) {
  return t % 1 == 0;
}

function T(t) {
  if (null != Math.tanh) return Math.tanh(t);
  if (t === 1 / 0) return 1;
  if (t === -1 / 0) return -1;
  var e = Math.exp(2 * t);
  return (e - 1) / (e + 1);
}

function D(t) {
  var e = Math.ceil(Math.sqrt(t));
  return [e, Math.ceil(t / e)];
}

function N(t, e) {
  return e <= t.length ? t : t + " ".repeat(e - t.length);
}

function F(t, e, n) {
  return void 0 === e && (e = function (t) {
    return 0;
  }), new Promise(function (r, o) {
    var a = 0,
        i = function () {
      if (t()) r();else {
        a++;
        var s = e(a);
        null != n && a >= n ? o() : setTimeout(i, s);
      }
    };

    i();
  });
}

function _(t, e) {
  for (var n = 1, r = -1, o = 0; o < t.length; ++o) if (t[o] >= 0) n *= t[o];else if (-1 === t[o]) {
    if (-1 !== r) throw Error("Shapes can only have 1 implicit size. Found -1 at dim " + r + " and dim " + o);
    r = o;
  } else if (t[o] < 0) throw Error("Shapes can not be < 0. Found " + t[o] + " at dim " + o);

  if (-1 === r) {
    if (e > 0 && e !== n) throw Error("Size(" + e + ") must match the product of shape " + t);
    return t;
  }

  if (0 === n) throw Error("Cannot infer the missing size in [" + t + "] when there are 0 elements");
  if (e % n != 0) throw Error("The implicit shape can't be a fractional number. Got " + e + " / " + n);
  var a = t.slice();
  return a[r] = e / n, a;
}

function O(t, e) {
  var n = e.length;
  return C((t = null == t ? e.map(function (t, e) {
    return e;
  }) : [].concat(t)).every(function (t) {
    return t >= -n && t < n;
  }), function () {
    return "All values in axis param must be in range [-" + n + ", " + n + ") but got axis " + t;
  }), C(t.every(function (t) {
    return A(t);
  }), function () {
    return "All values in axis param must be integers but got axis " + t;
  }), t.map(function (t) {
    return t < 0 ? n + t : t;
  });
}

function M(t, e) {
  for (var n = [], r = [], o = null != e && Array.isArray(e) && 0 === e.length, a = null == e || o ? null : O(e, t).sort(), i = 0, s = 0; s < t.length; ++s) {
    if (null != a) {
      if (a[i] === s && 1 !== t[s]) throw new Error("Can't squeeze axis " + s + " since its dim '" + t[s] + "' is not 1");
      (null == a[i] || a[i] > s) && 1 === t[s] && (n.push(t[s]), r.push(s)), a[i] <= s && i++;
    }

    1 !== t[s] && (n.push(t[s]), r.push(s));
  }

  return {
    newShape: n,
    keptDims: r
  };
}

function B(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else {
    if ("bool" !== t) throw new Error("Unknown data type " + t);
    n = new Uint8Array(e);
  }
  return n;
}

function P(t, e) {
  var n = null;
  if (null == t || "float32" === t) n = new Float32Array(e);else if ("int32" === t) n = new Int32Array(e);else if ("bool" === t) n = new Uint8Array(e);else {
    if ("string" !== t) throw new Error("Unknown data type " + t);
    n = new Array(e);
  }
  return n;
}

function L(t, e) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    if (isNaN(r) || !isFinite(r)) throw Error("A tensor of type " + e + " being uploaded contains " + r + ".");
  }
}

function W(t) {
  return "bool" === t || "complex64" === t || "float32" === t || "int32" === t || "string" === t;
}

function U(t, e) {
  return "complex64" !== e && ("float32" !== e || "complex64" === t) && ("int32" !== e || "float32" === t || "complex64" === t) && ("bool" !== e || "bool" !== t);
}

function V(t) {
  return t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array;
}

function z(t) {
  if ("float32" === t || "int32" === t) return 4;
  if ("complex64" === t) return 8;
  if ("bool" === t) return 1;
  throw new Error("Unknown dtype " + t);
}

function G(t) {
  if (null == t) return 0;
  var e = 0;
  return t.forEach(function (t) {
    return e += t.length;
  }), e;
}

function H(t) {
  return "string" == typeof t || t instanceof String;
}

function q(t) {
  return "boolean" == typeof t;
}

function K(t) {
  return "number" == typeof t;
}

function j(t) {
  return Array.isArray(t) ? j(t[0]) : t instanceof Float32Array ? "float32" : t instanceof Int32Array || t instanceof Uint8Array ? "int32" : K(t) ? "float32" : H(t) ? "string" : q(t) ? "bool" : "float32";
}

function X(t) {
  return !!(t && t.constructor && t.call && t.apply);
}

function Y(t, e) {
  for (var n = e; n < t; ++n) if (t % n == 0) return n;

  return t;
}

function $(t) {
  var e = t.length;
  if (e < 2) return [];
  var n = new Array(e - 1);
  n[e - 2] = t[e - 1];

  for (var r = e - 3; r >= 0; --r) n[r] = n[r + 1] * t[r + 1];

  return n;
}

function Q(t, e, n) {
  if ("string" === e) throw new Error("Cannot convert a string[] to a TypedArray");
  if (Array.isArray(t) && (t = I(t)), n && L(t, e), function (t, e) {
    return t instanceof Float32Array && "float32" === e || t instanceof Int32Array && "int32" === e || t instanceof Uint8Array && "bool" === e;
  }(t, e)) return t;
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);

  if ("bool" === e) {
    for (var r = new Uint8Array(t.length), o = 0; o < r.length; ++o) 0 !== Math.round(t[o]) && (r[o] = 1);

    return r;
  }

  throw new Error("Unknown data type " + e);
}

function J(t, e) {
  if (0 === t.length) return e[0];
  var n = t.reduce(function (t, e) {
    return t * e;
  });
  if (0 === n) return [];
  if (n !== e.length) throw new Error("[" + t + "] does not match the input size.");
  return function t(e, n, r) {
    var o = new Array();
    if (1 === n.length) for (var a = n[0], i = 0; i < a; i++) o[i] = r[e + i];else {
      a = n[0];
      var s = n.slice(1),
          u = s.reduce(function (t, e) {
        return t * e;
      });

      for (i = 0; i < a; i++) o[i] = t(e + i * u, s, r);
    }
    return o;
  }(0, t, e);
}

function Z(t, e) {
  for (var n = tt(t, e), r = 0; r < n.length; r++) n[r] = 1;

  return n;
}

function tt(t, e) {
  if (null == e || "float32" === e || "complex64" === e) return new Float32Array(t);
  if ("int32" === e) return new Int32Array(t);
  if ("bool" === e) return new Uint8Array(t);
  throw new Error("Unknown data type " + e);
}

function et() {
  return i().platform.now();
}

function nt(t) {
  t.forEach(function (e) {
    C(Number.isInteger(e) && e >= 0, function () {
      return "Tensor must have a shape comprised of positive integers but got shape [" + t + "].";
    });
  });
}

function rt(t, e) {
  return void 0 === e && (e = "utf-8"), e = e || "utf-8", i().platform.encode(t, e);
}

function ot(t, e) {
  return void 0 === e && (e = "utf-8"), e = e || "utf-8", i().platform.decode(t, e);
}

function at(t, e, n) {
  if (0 === e) return 0;
  if (1 === e) return t[0];

  for (var r = t[t.length - 1], o = 0; o < t.length - 1; ++o) r += n[o] * t[o];

  return r;
}

function it(t, e, n) {
  if (0 === e) return [];
  if (1 === e) return [t];

  for (var r = new Array(e), o = 0; o < r.length - 1; ++o) r[o] = Math.floor(t / n[o]), t -= r[o] * n[o];

  return r[r.length - 1] = t, r;
}

var st = Object.freeze({
  shuffle: y,
  clamp: x,
  nearestLargerEven: b,
  sum: w,
  randUniform: function (t, e) {
    var n = Math.random();
    return e * n + (1 - n) * t;
  },
  distSquared: function (t, e) {
    for (var n = 0, r = 0; r < t.length; r++) {
      var o = Number(t[r]) - Number(e[r]);
      n += o * o;
    }

    return n;
  },
  assert: C,
  assertShapesMatch: E,
  assertNonNull: R,
  flatten: I,
  sizeFromShape: k,
  isScalarShape: function (t) {
    return 0 === t.length;
  },
  arraysEqual: S,
  isInt: A,
  tanh: T,
  sizeToSquarishShape: D,
  createShuffledIndices: function (t) {
    for (var e = new Uint32Array(t), n = 0; n < t; ++n) e[n] = n;

    return y(e), e;
  },
  rightPad: N,
  repeatedTry: F,
  inferFromImplicitShape: _,
  parseAxisParam: O,
  squeezeShape: M,
  getTypedArrayFromDType: B,
  getArrayFromDType: P,
  checkConversionForErrors: L,
  isValidDtype: W,
  hasEncodingLoss: U,
  isTypedArray: V,
  bytesPerElement: z,
  bytesFromStringArray: G,
  isString: H,
  isBoolean: q,
  isNumber: K,
  inferDtype: j,
  isFunction: X,
  nearestDivisor: Y,
  computeStrides: $,
  toTypedArray: Q,
  toNestedArray: J,
  makeOnesTypedArray: Z,
  makeZerosTypedArray: tt,
  now: et,
  assertNonNegativeIntegerDimensions: nt,
  fetch: function (t, e) {
    return i().platform.fetch(t, e);
  },
  encodeString: rt,
  decodeString: ot,
  locToIndex: at,
  indexToLoc: it
}),
    ut = function () {
  function t(t, e) {
    this.backendTimer = t, this.logger = e, null == e && (this.logger = new ct());
  }

  return t.prototype.profileKernel = function (t, e, n) {
    var r,
        o = this,
        a = this.backendTimer.time(function () {
      r = n();
    });
    return r.forEach(function (n) {
      n.data().then(function (r) {
        !function (t, e, n) {
          if ("float32" !== e) return !1;

          for (var r = 0; r < t.length; r++) {
            var o = t[r];
            if (isNaN(o) || !isFinite(o)) return console.warn("Found " + o + " in the result of '" + n + "'"), !0;
          }
        }(r, n.dtype, t), a.then(function (a) {
          var i = "";
          null != a.getExtraProfileInfo && (i = a.getExtraProfileInfo()), o.logger.logKernelProfile(t, n, r, a.kernelMs, e, i);
        });
      });
    }), r;
  }, t;
}();

exports.util = st;

var ct = function () {
  function t() {}

  return t.prototype.logKernelProfile = function (t, e, n, r, o, a) {
    var i = "number" == typeof r ? N(r + "ms", 9) : r.error,
        s = N(t, 25),
        u = e.rank,
        c = e.size,
        l = N(e.shape.toString(), 14),
        h = "";

    for (var f in o) {
      var d = o[f].shape || e.shape,
          p = d.length;
      h += f + ": " + p + "D " + (p > 0 ? d : "") + " ";
    }

    console.log("%c" + s + "\t%c" + i + "\t%c" + u + "D " + l + "\t%c" + c + "\t%c" + h + "\t%c" + a, "font-weight:bold", "color:red", "color:blue", "color: orange", "color: green", "color: steelblue");
  }, t;
}();

var lt = 20,
    ht = 3,
    ft = 7;

function dt(t, e, n, r) {
  var o = $(e),
      a = function (t, e, n, r) {
    var o = k(e),
        a = r[r.length - 1],
        i = new Array(a).fill(0),
        s = e.length,
        u = "complex64" === n ? gt(t) : t;
    if (s > 1) for (var c = 0; c < o / a; c++) for (var l = c * a, h = 0; h < a; h++) i[h] = Math.max(i[h], pt(u[l + h], 0, n).length);
    return i;
  }(t, e, n, o),
      i = e.length,
      s = function t(e, n, r, o, a, i) {
    void 0 === i && (i = !0);
    var s = "complex64" === r ? 2 : 1,
        u = n[0],
        c = n.length;

    if (0 === c) {
      return "complex64" === r ? [pt(gt(e)[0], 0, r)] : "bool" === r ? [vt(e[0])] : [e[0].toString()];
    }

    if (1 === c) {
      if (u > lt) {
        var l = ht * s,
            h = Array.from(e.slice(0, l)),
            f = Array.from(e.slice((u - ht) * s, u * s));
        return "complex64" === r && (h = gt(h), f = gt(f)), ["[" + h.map(function (t, e) {
          return pt(t, a[e], r);
        }).join(", ") + ", ..., " + f.map(function (t, e) {
          return pt(t, a[u - ht + e], r);
        }).join(", ") + "]"];
      }

      return ["[" + ("complex64" === r ? gt(e) : Array.from(e)).map(function (t, e) {
        return pt(t, a[e], r);
      }).join(", ") + "]"];
    }

    var d = n.slice(1),
        p = o.slice(1),
        v = o[0] * s,
        g = [];

    if (u > lt) {
      for (var m = 0; m < ht; m++) {
        var y = (x = m * v) + v;
        g.push.apply(g, t(e.slice(x, y), d, r, p, a, !1));
      }

      g.push("...");

      for (m = u - ht; m < u; m++) {
        y = (x = m * v) + v;
        g.push.apply(g, t(e.slice(x, y), d, r, p, a, m === u - 1));
      }
    } else for (m = 0; m < u; m++) {
      var x;
      y = (x = m * v) + v;
      g.push.apply(g, t(e.slice(x, y), d, r, p, a, m === u - 1));
    }

    var b = 2 === c ? "," : "";
    g[0] = "[" + g[0] + b;

    for (m = 1; m < g.length - 1; m++) g[m] = " " + g[m] + b;

    var w = ",\n";

    for (m = 2; m < c; m++) w += "\n";

    return g[g.length - 1] = " " + g[g.length - 1] + "]" + (i ? "" : w), g;
  }(t, e, n, o, a),
      u = ["Tensor"];

  return r && (u.push("  dtype: " + n), u.push("  rank: " + i), u.push("  shape: [" + e + "]"), u.push("  values:")), u.push(s.map(function (t) {
    return "    " + t;
  }).join("\n")), u.join("\n");
}

function pt(t, e, n) {
  return N(Array.isArray(t) ? parseFloat(t[0].toFixed(ft)) + " + " + parseFloat(t[1].toFixed(ft)) + "j" : H(t) ? "'" + t + "'" : "bool" === n ? vt(t) : parseFloat(t.toFixed(ft)).toString(), e);
}

function vt(t) {
  return 0 === t ? "false" : "true";
}

function gt(t) {
  for (var e = [], n = 0; n < t.length; n += 2) e.push([t[n], t[n + 1]]);

  return e;
}

var mt = function () {
  function t(t, e, n) {
    var r = this;

    if (this.dtype = e, this.shape = t.slice(), this.size = k(t), null != n) {
      var o = n.length;
      C(o === this.size, function () {
        return "Length of values '" + o + "' does not match the size inferred by the shape '" + r.size + "'.";
      });
    }

    if ("complex64" === e) throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");
    this.values = n || P(e, this.size), this.strides = $(t);
  }

  return t.prototype.set = function (t) {
    for (var e = this, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];

    0 === n.length && (n = [0]), C(n.length === this.rank, function () {
      return "The number of provided coordinates (" + n.length + ") must match the rank (" + e.rank + ")";
    });
    var o = this.locToIndex(n);
    this.values[o] = t;
  }, t.prototype.get = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    0 === t.length && (t = [0]);

    for (var n = 0, r = 0, o = t; r < o.length; r++) {
      var a = o[r];

      if (a < 0 || a >= this.shape[n]) {
        var i = "Requested out of range element at " + t + ".   Buffer shape=" + this.shape;
        throw new Error(i);
      }

      n++;
    }

    for (var s = t[t.length - 1], u = 0; u < t.length - 1; ++u) s += this.strides[u] * t[u];

    return this.values[s];
  }, t.prototype.locToIndex = function (t) {
    if (0 === this.rank) return 0;
    if (1 === this.rank) return t[0];

    for (var e = t[t.length - 1], n = 0; n < t.length - 1; ++n) e += this.strides[n] * t[n];

    return e;
  }, t.prototype.indexToLoc = function (t) {
    if (0 === this.rank) return [];
    if (1 === this.rank) return [t];

    for (var e = new Array(this.shape.length), n = 0; n < e.length - 1; ++n) e[n] = Math.floor(t / this.strides[n]), t -= e[n] * this.strides[n];

    return e[e.length - 1] = t, e;
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.toTensor = function () {
    return yt().makeTensor(this.values, this.shape, this.dtype);
  }, t;
}(),
    yt = null,
    xt = null,
    bt = null;

exports.TensorBuffer = mt;

var wt = function () {
  function t(t, e, n, r) {
    this.kept = !1, this.isDisposedInternal = !1, this.shape = t.slice(), this.dtype = e || "float32", this.size = k(t), this.strides = $(t), this.dataId = n, this.id = r, this.rankType = this.rank < 5 ? this.rank.toString() : "higher";
  }

  return t.prototype.flatten = function () {
    return this.throwIfDisposed(), this.as1D();
  }, t.prototype.asScalar = function () {
    return this.throwIfDisposed(), C(1 === this.size, function () {
      return "The array must have only 1 element.";
    }), this.reshape([]);
  }, t.prototype.as1D = function () {
    return this.throwIfDisposed(), this.reshape([this.size]);
  }, t.prototype.as2D = function (t, e) {
    return this.throwIfDisposed(), this.reshape([t, e]);
  }, t.prototype.as3D = function (t, e, n) {
    return this.throwIfDisposed(), this.reshape([t, e, n]);
  }, t.prototype.as4D = function (t, e, n, r) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r]);
  }, t.prototype.as5D = function (t, e, n, r, o) {
    return this.throwIfDisposed(), this.reshape([t, e, n, r, o]);
  }, t.prototype.asType = function (t) {
    return this.throwIfDisposed(), xt.cast(this, t);
  }, Object.defineProperty(t.prototype, "rank", {
    get: function () {
      return this.shape.length;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.buffer = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, xt.buffer(this.shape, this.dtype, t)];
        }
      });
    });
  }, t.prototype.bufferSync = function () {
    return xt.buffer(this.shape, this.dtype, this.dataSync());
  }, t.prototype.array = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.data()];

          case 1:
            return t = e.sent(), [2, J(this.shape, t)];
        }
      });
    });
  }, t.prototype.arraySync = function () {
    return J(this.shape, this.dataSync());
  }, t.prototype.data = function () {
    return n(this, void 0, void 0, function () {
      var t, e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return this.throwIfDisposed(), t = yt().read(this.dataId), "string" !== this.dtype ? [3, 2] : [4, t];

          case 1:
            e = n.sent();

            try {
              return [2, e.map(function (t) {
                return ot(t);
              })];
            } catch (t) {
              throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().");
            }

            n.label = 2;

          case 2:
            return [2, t];
        }
      });
    });
  }, t.prototype.dataSync = function () {
    this.throwIfDisposed();
    var t = yt().readSync(this.dataId);
    if ("string" === this.dtype) try {
      return t.map(function (t) {
        return ot(t);
      });
    } catch (t) {
      throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().");
    }
    return t;
  }, t.prototype.bytes = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return this.throwIfDisposed(), [4, yt().read(this.dataId)];

          case 1:
            return t = e.sent(), "string" === this.dtype ? [2, t] : [2, new Uint8Array(t.buffer)];
        }
      });
    });
  }, t.prototype.dispose = function () {
    this.isDisposed || (yt().disposeTensor(this), this.isDisposedInternal = !0);
  }, Object.defineProperty(t.prototype, "isDisposed", {
    get: function () {
      return this.isDisposedInternal;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.throwIfDisposed = function () {
    if (this.isDisposed) throw new Error("Tensor is disposed.");
  }, t.prototype.toFloat = function () {
    return this.asType("float32");
  }, t.prototype.toInt = function () {
    return this.asType("int32");
  }, t.prototype.toBool = function () {
    return this.asType("bool");
  }, t.prototype.print = function (t) {
    return void 0 === t && (t = !1), xt.print(this, t);
  }, t.prototype.reshape = function (t) {
    return this.throwIfDisposed(), xt.reshape(this, t);
  }, t.prototype.reshapeAs = function (t) {
    return this.throwIfDisposed(), this.reshape(t.shape);
  }, t.prototype.expandDims = function (t) {
    return void 0 === t && (t = 0), xt.expandDims(this, t);
  }, t.prototype.cumsum = function (t, e, n) {
    return void 0 === t && (t = 0), void 0 === e && (e = !1), void 0 === n && (n = !1), xt.cumsum(this, t, e, n);
  }, t.prototype.squeeze = function (t) {
    return this.throwIfDisposed(), xt.squeeze(this, t);
  }, t.prototype.clone = function () {
    return this.throwIfDisposed(), xt.clone(this);
  }, t.prototype.toString = function (t) {
    return void 0 === t && (t = !1), dt(this.dataSync(), this.shape, this.dtype, t);
  }, t.prototype.gather = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), xt.gather(this, t, e);
  }, t.prototype.matMul = function (t, e, n) {
    return void 0 === e && (e = !1), void 0 === n && (n = !1), this.throwIfDisposed(), xt.matMul(this, t, e, n);
  }, t.prototype.dot = function (t) {
    return this.throwIfDisposed(), xt.dot(this, t);
  }, t.prototype.norm = function (t, e, n) {
    return void 0 === t && (t = "euclidean"), void 0 === e && (e = null), void 0 === n && (n = !1), this.throwIfDisposed(), xt.norm(this, t, e, n);
  }, t.prototype.slice = function (t, e) {
    return this.throwIfDisposed(), xt.slice(this, t, e);
  }, t.prototype.reverse = function (t) {
    return this.throwIfDisposed(), xt.reverse(this, t);
  }, t.prototype.concat = function (e, n) {
    return void 0 === n && (n = 0), this.throwIfDisposed(), e instanceof t && (e = [e]), xt.concat([this].concat(e), n);
  }, t.prototype.split = function (t, e) {
    return void 0 === e && (e = 0), this.throwIfDisposed(), xt.split(this, t, e);
  }, t.prototype.stack = function (t, e) {
    return void 0 === e && (e = 0), xt.stack([this, t], e);
  }, t.prototype.unstack = function (t) {
    return void 0 === t && (t = 0), xt.unstack(this, t);
  }, t.prototype.batchNormalization = function (t, e, n, r, o) {
    return void 0 === n && (n = .001), bt("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon"), this.batchNorm(t, e, o, r, n);
  }, t.prototype.all = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.all(this, t, e);
  }, t.prototype.any = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.any(this, t, e);
  }, t.prototype.logSumExp = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.logSumExp(this, t, e);
  }, t.prototype.sum = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.sum(this, t, e);
  }, t.prototype.prod = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.prod(this, t, e);
  }, t.prototype.mean = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.mean(this, t, e);
  }, t.prototype.min = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.min(this, t, e);
  }, t.prototype.max = function (t, e) {
    return void 0 === t && (t = null), void 0 === e && (e = !1), this.throwIfDisposed(), xt.max(this, t, e);
  }, t.prototype.argMin = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), xt.argMin(this, t);
  }, t.prototype.argMax = function (t) {
    return void 0 === t && (t = null), this.throwIfDisposed(), xt.argMax(this, t);
  }, t.prototype.cast = function (t) {
    return this.throwIfDisposed(), xt.cast(this, t);
  }, t.prototype.addStrict = function (t) {
    return this.throwIfDisposed(), xt.addStrict(this, t);
  }, t.prototype.atan2 = function (t) {
    return this.throwIfDisposed(), xt.atan2(this, t);
  }, t.prototype.sub = function (t) {
    return this.throwIfDisposed(), xt.sub(this, t);
  }, t.prototype.subStrict = function (t) {
    return this.throwIfDisposed(), xt.subStrict(this, t);
  }, t.prototype.pow = function (t) {
    return this.throwIfDisposed(), xt.pow(this, t);
  }, t.prototype.powStrict = function (t) {
    return this.throwIfDisposed(), xt.powStrict(this, t);
  }, t.prototype.mul = function (t) {
    return this.throwIfDisposed(), xt.mul(this, t);
  }, t.prototype.mulStrict = function (t) {
    return this.throwIfDisposed(), xt.mulStrict(this, t);
  }, t.prototype.floorDiv = function (t) {
    return this.throwIfDisposed(), xt.floorDiv(this, t);
  }, t.prototype.divStrict = function (t) {
    return this.throwIfDisposed(), xt.divStrict(this, t);
  }, t.prototype.minimum = function (t) {
    return this.throwIfDisposed(), xt.minimum(this, t);
  }, t.prototype.minimumStrict = function (t) {
    return this.throwIfDisposed(), xt.minimumStrict(this, t);
  }, t.prototype.maximum = function (t) {
    return this.throwIfDisposed(), xt.maximum(this, t);
  }, t.prototype.maximumStrict = function (t) {
    return this.throwIfDisposed(), xt.maximumStrict(this, t);
  }, t.prototype.mod = function (t) {
    return this.throwIfDisposed(), xt.mod(this, t);
  }, t.prototype.modStrict = function (t) {
    return this.throwIfDisposed(), xt.modStrict(this, t);
  }, t.prototype.squaredDifferenceStrict = function (t) {
    return this.throwIfDisposed(), xt.squaredDifferenceStrict(this, t);
  }, t.prototype.notEqual = function (t) {
    return this.throwIfDisposed(), xt.notEqual(this, t);
  }, t.prototype.notEqualStrict = function (t) {
    return this.throwIfDisposed(), xt.notEqualStrict(this, t);
  }, t.prototype.less = function (t) {
    return this.throwIfDisposed(), xt.less(this, t);
  }, t.prototype.lessStrict = function (t) {
    return this.throwIfDisposed(), xt.lessStrict(this, t);
  }, t.prototype.equal = function (t) {
    return this.throwIfDisposed(), xt.equal(this, t);
  }, t.prototype.equalStrict = function (t) {
    return this.throwIfDisposed(), xt.equalStrict(this, t);
  }, t.prototype.lessEqual = function (t) {
    return this.throwIfDisposed(), xt.lessEqual(this, t);
  }, t.prototype.lessEqualStrict = function (t) {
    return this.throwIfDisposed(), xt.lessEqualStrict(this, t);
  }, t.prototype.greater = function (t) {
    return this.throwIfDisposed(), xt.greater(this, t);
  }, t.prototype.greaterStrict = function (t) {
    return this.throwIfDisposed(), xt.greaterStrict(this, t);
  }, t.prototype.greaterEqual = function (t) {
    return this.throwIfDisposed(), xt.greaterEqual(this, t);
  }, t.prototype.greaterEqualStrict = function (t) {
    return this.throwIfDisposed(), xt.greaterEqualStrict(this, t);
  }, t.prototype.logicalAnd = function (t) {
    return this.throwIfDisposed(), xt.logicalAnd(this, t);
  }, t.prototype.logicalOr = function (t) {
    return this.throwIfDisposed(), xt.logicalOr(this, t);
  }, t.prototype.logicalNot = function () {
    return this.throwIfDisposed(), xt.logicalNot(this);
  }, t.prototype.logicalXor = function (t) {
    return this.throwIfDisposed(), xt.logicalXor(this, t);
  }, t.prototype.where = function (t, e) {
    return this.throwIfDisposed(), xt.where(t, this, e);
  }, t.prototype.neg = function () {
    return this.throwIfDisposed(), xt.neg(this);
  }, t.prototype.ceil = function () {
    return this.throwIfDisposed(), xt.ceil(this);
  }, t.prototype.floor = function () {
    return this.throwIfDisposed(), xt.floor(this);
  }, t.prototype.sign = function () {
    return this.throwIfDisposed(), xt.sign(this);
  }, t.prototype.isNaN = function () {
    return this.throwIfDisposed(), xt.isNaN(this);
  }, t.prototype.isInf = function () {
    return this.throwIfDisposed(), xt.isInf(this);
  }, t.prototype.isFinite = function () {
    return this.throwIfDisposed(), xt.isFinite(this);
  }, t.prototype.exp = function () {
    return this.throwIfDisposed(), xt.exp(this);
  }, t.prototype.expm1 = function () {
    return this.throwIfDisposed(), xt.expm1(this);
  }, t.prototype.log = function () {
    return this.throwIfDisposed(), xt.log(this);
  }, t.prototype.log1p = function () {
    return this.throwIfDisposed(), xt.log1p(this);
  }, t.prototype.sqrt = function () {
    return this.throwIfDisposed(), xt.sqrt(this);
  }, t.prototype.rsqrt = function () {
    return this.throwIfDisposed(), xt.rsqrt(this);
  }, t.prototype.square = function () {
    return this.throwIfDisposed(), xt.square(this);
  }, t.prototype.reciprocal = function () {
    return this.throwIfDisposed(), xt.reciprocal(this);
  }, t.prototype.abs = function () {
    return this.throwIfDisposed(), xt.abs(this);
  }, t.prototype.clipByValue = function (t, e) {
    return this.throwIfDisposed(), xt.clipByValue(this, t, e);
  }, t.prototype.relu = function () {
    return this.throwIfDisposed(), xt.relu(this);
  }, t.prototype.relu6 = function () {
    return this.throwIfDisposed(), xt.relu6(this);
  }, t.prototype.elu = function () {
    return this.throwIfDisposed(), xt.elu(this);
  }, t.prototype.selu = function () {
    return this.throwIfDisposed(), xt.selu(this);
  }, t.prototype.leakyRelu = function (t) {
    return void 0 === t && (t = .2), this.throwIfDisposed(), xt.leakyRelu(this, t);
  }, t.prototype.prelu = function (t) {
    return this.throwIfDisposed(), xt.prelu(this, t);
  }, t.prototype.sigmoid = function () {
    return this.throwIfDisposed(), xt.sigmoid(this);
  }, t.prototype.logSigmoid = function () {
    return this.throwIfDisposed(), xt.logSigmoid(this);
  }, t.prototype.softplus = function () {
    return this.throwIfDisposed(), xt.softplus(this);
  }, t.prototype.zerosLike = function () {
    return this.throwIfDisposed(), xt.zerosLike(this);
  }, t.prototype.onesLike = function () {
    return this.throwIfDisposed(), xt.onesLike(this);
  }, t.prototype.sin = function () {
    return this.throwIfDisposed(), xt.sin(this);
  }, t.prototype.cos = function () {
    return this.throwIfDisposed(), xt.cos(this);
  }, t.prototype.tan = function () {
    return this.throwIfDisposed(), xt.tan(this);
  }, t.prototype.asin = function () {
    return this.throwIfDisposed(), xt.asin(this);
  }, t.prototype.acos = function () {
    return this.throwIfDisposed(), xt.acos(this);
  }, t.prototype.atan = function () {
    return this.throwIfDisposed(), xt.atan(this);
  }, t.prototype.sinh = function () {
    return this.throwIfDisposed(), xt.sinh(this);
  }, t.prototype.cosh = function () {
    return this.throwIfDisposed(), xt.cosh(this);
  }, t.prototype.tanh = function () {
    return this.throwIfDisposed(), xt.tanh(this);
  }, t.prototype.asinh = function () {
    return this.throwIfDisposed(), xt.asinh(this);
  }, t.prototype.acosh = function () {
    return this.throwIfDisposed(), xt.acosh(this);
  }, t.prototype.atanh = function () {
    return this.throwIfDisposed(), xt.atanh(this);
  }, t.prototype.erf = function () {
    return this.throwIfDisposed(), xt.erf(this);
  }, t.prototype.round = function () {
    return this.throwIfDisposed(), xt.round(this);
  }, t.prototype.step = function (t) {
    return void 0 === t && (t = 0), this.throwIfDisposed(), xt.step(this, t);
  }, t.prototype.softmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), xt.softmax(this, t);
  }, t.prototype.logSoftmax = function (t) {
    return void 0 === t && (t = -1), this.throwIfDisposed(), xt.logSoftmax(this, t);
  }, t.prototype.resizeBilinear = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), xt.image.resizeBilinear(this, t, e);
  }, t.prototype.resizeNearestNeighbor = function (t, e) {
    return void 0 === e && (e = !1), this.throwIfDisposed(), xt.image.resizeNearestNeighbor(this, t, e);
  }, t.prototype.conv1d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NWC"), void 0 === o && (o = 1), this.throwIfDisposed(), xt.conv1d(this, t, e, n, r, o, a);
  }, t.prototype.conv2d = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), xt.conv2d(this, t, e, n, r, o, a);
  }, t.prototype.conv2dTranspose = function (t, e, n, r, o) {
    return this.throwIfDisposed(), xt.conv2dTranspose(this, t, e, n, r, o);
  }, t.prototype.depthwiseConv2D = function (t, e, n, r, o, a) {
    return void 0 === r && (r = "NHWC"), void 0 === o && (o = [1, 1]), this.throwIfDisposed(), xt.depthwiseConv2d(this, t, e, n, r, o, a);
  }, t.prototype.separableConv2d = function (t, e, n, r, o, a) {
    return void 0 === o && (o = [1, 1]), void 0 === a && (a = "NHWC"), this.throwIfDisposed(), xt.separableConv2d(this, t, e, n, r, o, a);
  }, t.prototype.avgPool = function (t, e, n, r) {
    return this.throwIfDisposed(), xt.avgPool(this, t, e, n, r);
  }, t.prototype.maxPool = function (t, e, n, r) {
    return this.throwIfDisposed(), xt.maxPool(this, t, e, n, r);
  }, t.prototype.localResponseNormalization = function (t, e, n, r) {
    return void 0 === t && (t = 5), void 0 === e && (e = 1), void 0 === n && (n = 1), void 0 === r && (r = .5), xt.localResponseNormalization(this, t, e, n, r);
  }, t.prototype.pool = function (t, e, n, r, o) {
    return this.throwIfDisposed(), xt.pool(this, t, e, n, r, o);
  }, t.prototype.variable = function (t, e, n) {
    return void 0 === t && (t = !0), this.throwIfDisposed(), yt().makeVariable(this, t, e, n);
  }, t.prototype.unsortedSegmentSum = function (t, e) {
    return this.throwIfDisposed(), xt.unsortedSegmentSum(this, t, e);
  }, t.prototype.batchToSpaceND = function (t, e) {
    return this.throwIfDisposed(), xt.batchToSpaceND(this, t, e);
  }, t.prototype.spaceToBatchND = function (t, e) {
    return this.throwIfDisposed(), xt.spaceToBatchND(this, t, e);
  }, t.prototype.topk = function (t, e) {
    return void 0 === t && (t = 1), void 0 === e && (e = !0), this.throwIfDisposed(), xt.topk(this, t, e);
  }, t.prototype.stridedSlice = function (t, e, n, r, o, a, i, s) {
    return void 0 === r && (r = 0), void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), this.throwIfDisposed(), xt.stridedSlice(this, t, e, n, r, o, a, i, s);
  }, t.prototype.depthToSpace = function (t, e) {
    return this.throwIfDisposed(), xt.depthToSpace(this, t, e);
  }, t.prototype.fft = function () {
    return this.throwIfDisposed(), xt.spectral.fft(this);
  }, t.prototype.ifft = function () {
    return this.throwIfDisposed(), xt.spectral.ifft(this);
  }, t.prototype.rfft = function () {
    return this.throwIfDisposed(), xt.spectral.rfft(this);
  }, t.prototype.irfft = function () {
    return this.throwIfDisposed(), xt.spectral.irfft(this);
  }, t;
}();

exports.Tensor = wt;
Object.defineProperty(wt, Symbol.hasInstance, {
  value: function (t) {
    return !!t && null != t.dataId && null != t.shape && null != t.dtype;
  }
});

var Ct,
    Et,
    Rt,
    It,
    kt,
    St = function (t) {
  function n(e, n, r, o) {
    var a = t.call(this, e.shape, e.dtype, e.dataId, o) || this;
    return a.trainable = n, a.name = r, a;
  }

  return e(n, t), n.prototype.assign = function (t) {
    if (t.dtype !== this.dtype) throw new Error("dtype of the new value (" + t.dtype + ") and previous value (" + this.dtype + ") must match");
    if (!S(t.shape, this.shape)) throw new Error("shape of the new value (" + t.shape + ") and previous value (" + this.shape + ") must match");
    yt().disposeTensor(this), this.dataId = t.dataId, yt().incRef(this, null);
  }, n.prototype.dispose = function () {
    yt().disposeVariable(this), this.isDisposedInternal = !0;
  }, n;
}(wt);

exports.Variable = St;
exports.Rank = Ct;
Object.defineProperty(St, Symbol.hasInstance, {
  value: function (t) {
    return t instanceof wt && null != t.assign && t.assign instanceof Function;
  }
}), function (t) {
  t.R0 = "R0", t.R1 = "R1", t.R2 = "R2", t.R3 = "R3", t.R4 = "R4", t.R5 = "R5", t.R6 = "R6";
}(Ct || (exports.Rank = Ct = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "int32", t.complex64 = "complex64";
}(Et || (Et = {})), function (t) {
  t.float32 = "float32", t.int32 = "int32", t.bool = "bool", t.complex64 = "complex64";
}(Rt || (Rt = {})), function (t) {
  t.float32 = "float32", t.int32 = "float32", t.bool = "float32", t.complex64 = "complex64";
}(It || (It = {})), function (t) {
  t.float32 = "complex64", t.int32 = "complex64", t.bool = "complex64", t.complex64 = "complex64";
}(kt || (kt = {}));
var At = {
  float32: It,
  int32: Et,
  bool: Rt,
  complex64: kt
};

function Tt(t, e) {
  if ("string" === t || "string" === e) {
    if ("string" === t && "string" === e) return "string";
    throw new Error("Can not upcast " + t + " with " + e);
  }

  return At[t][e];
}

function Dt(t) {
  return Tt(t, "int32");
}

function Nt(t, e) {
  if (t.dtype === e.dtype) return [t, e];
  var n = Tt(t.dtype, e.dtype);
  return [t.cast(n), e.cast(n)];
}

function Ft(t, e) {
  C(t.dtype === e.dtype, function () {
    return "The dtypes of the first(" + t.dtype + ") and second(" + e.dtype + ") input must match";
  });
}

function _t(t) {
  var e = [];
  return function t(e, n, r) {
    if (null == e) return;
    if (e instanceof wt) return void n.push(e);
    if (o = e, !Array.isArray(o) && "object" != typeof o) return;
    var o;
    var a = e;

    for (var i in a) {
      var s = a[i];
      r.has(s) || (r.add(s), t(s, n, r));
    }
  }(t, e, new Set()), e;
}

var Ot,
    Mt = Object.freeze({
  makeTypesMatch: Nt,
  assertTypesMatch: Ft,
  isTensorInList: function (t, e) {
    return e.some(function (e) {
      return e.id === t.id;
    });
  },
  getTensorsInContainer: _t
}),
    Bt = function () {
  function t() {
    this.registeredVariables = {}, this.nextTapeNodeId = 0, this.numBytes = 0, this.numTensors = 0, this.numStringTensors = 0, this.numDataBuffers = 0, this.gradientDepth = 0, this.kernelDepth = 0, this.scopeStack = [], this.numDataMovesStack = [], this.nextScopeId = 0, this.tensorInfo = new WeakMap(), this.profiling = !1, this.activeProfile = {
      newBytes: 0,
      newTensors: 0,
      peakBytes: 0,
      kernels: [],
      result: null
    };
  }

  return t.prototype.dispose = function () {
    for (var t in this.registeredVariables) this.registeredVariables[t].dispose();
  }, t;
}(),
    Pt = function () {
  function t(t) {
    this.ENV = t, this.registry = {}, this.registryFactory = {}, this.pendingBackendInitId = 0, this.state = new Bt();
  }

  return t.prototype.ready = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (null != this.pendingBackendInit) return [2, this.pendingBackendInit.then(function () {})];
            if (null != this.backendInstance) return [2];
            t = this.getSortedBackends(), e = 0, r.label = 1;

          case 1:
            return e < t.length ? (n = t[e], [4, this.initializeBackend(n).success]) : [3, 5];

          case 2:
            return r.sent() ? [4, this.setBackend(n)] : [3, 4];

          case 3:
            return r.sent(), [2];

          case 4:
            return e++, [3, 1];

          case 5:
            throw new Error("Could not initialize any backends, all backend initializations failed.");
        }
      });
    });
  }, Object.defineProperty(t.prototype, "backend", {
    get: function () {
      if (null != this.pendingBackendInit) throw new Error("Backend '" + this.backendName + "' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");

      if (null == this.backendInstance) {
        var t = this.initializeBackendsAndReturnBest(),
            e = t.name;
        if (t.asyncInit) throw new Error("The highest priority backend '" + e + "' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");
        this.setBackend(e);
      }

      return this.backendInstance;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.backendNames = function () {
    return Object.keys(this.registryFactory);
  }, t.prototype.findBackend = function (t) {
    if (!(t in this.registry)) {
      if (!(t in this.registryFactory)) return null;
      if (this.initializeBackend(t).asyncInit) return null;
    }

    return this.registry[t];
  }, t.prototype.findBackendFactory = function (t) {
    return t in this.registryFactory ? this.registryFactory[t].factory : null;
  }, t.prototype.registerBackend = function (t, e, n) {
    return void 0 === n && (n = 1), t in this.registryFactory ? (console.warn(t + " backend was already registered. Reusing existing backend factory."), !1) : (this.registryFactory[t] = {
      factory: e,
      priority: n
    }, !0);
  }, t.prototype.setBackend = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (null == this.registryFactory[t]) throw new Error("Backend name '" + t + "' not found in registry");
            return this.backendName = t, null != this.registry[t] ? [3, 4] : (this.backendInstance = null, e = this.initializeBackend(t), n = e.success, e.asyncInit ? [4, n] : [3, 2]);

          case 1:
            return o = r.sent(), [3, 3];

          case 2:
            o = n, r.label = 3;

          case 3:
            if (!o) return [2, !1];
            r.label = 4;

          case 4:
            return this.backendInstance = this.registry[t], this.setupRegisteredKernels(), this.profiler = new ut(this.backendInstance), [2, !0];
        }
      });
    });
  }, t.prototype.setupRegisteredKernels = function () {
    var t = this;
    f(this.backendName).forEach(function (e) {
      null != e.setupFunc && e.setupFunc(t.backendInstance);
    });
  }, t.prototype.disposeRegisteredKernels = function (t) {
    var e = this;
    f(t).forEach(function (n) {
      null != n.disposeFunc && n.disposeFunc(e.registry[t]);
    });
  }, t.prototype.initializeBackend = function (t) {
    var e = this,
        n = this.registryFactory[t];
    if (null == n) throw new Error("Cannot initialize backend " + t + ", no registration found.");

    try {
      var r = n.factory();

      if (Promise.resolve(r) === r) {
        var o = ++this.pendingBackendInitId,
            a = r.then(function (n) {
          return !(o < e.pendingBackendInitId) && (e.registry[t] = n, e.pendingBackendInit = null, !0);
        }).catch(function (n) {
          return !(o < e.pendingBackendInitId) && (e.pendingBackendInit = null, console.warn("Initialization of backend " + t + " failed"), console.warn(n.stack || n.message), !1);
        });
        return this.pendingBackendInit = a, {
          success: a,
          asyncInit: !0
        };
      }

      return this.registry[t] = r, {
        success: !0,
        asyncInit: !1
      };
    } catch (e) {
      return console.warn("Initialization of backend " + t + " failed"), console.warn(e.stack || e.message), {
        success: !1,
        asyncInit: !1
      };
    }
  }, t.prototype.removeBackend = function (t) {
    if (!(t in this.registryFactory)) throw new Error(t + " backend not found in registry");
    this.backendName === t && null != this.pendingBackendInit && this.pendingBackendInitId++, t in this.registry && (this.disposeRegisteredKernels(t), this.registry[t].dispose(), delete this.registry[t]), delete this.registryFactory[t], this.backendName === t && (this.pendingBackendInit = null, this.backendName = null, this.backendInstance = null);
  }, t.prototype.getSortedBackends = function () {
    var t = this;
    if (0 === Object.keys(this.registryFactory).length) throw new Error("No backend found in registry.");
    return Object.keys(this.registryFactory).sort(function (e, n) {
      return t.registryFactory[n].priority - t.registryFactory[e].priority;
    });
  }, t.prototype.initializeBackendsAndReturnBest = function () {
    for (var t = this.getSortedBackends(), e = 0; e < t.length; e++) {
      var n = t[e],
          r = this.initializeBackend(n),
          o = r.success,
          a = r.asyncInit;
      if (a || o) return {
        name: n,
        asyncInit: a
      };
    }

    throw new Error("Could not initialize any backends, all backend initializations failed.");
  }, t.prototype.moveData = function (t, e) {
    var n = this.state.tensorInfo.get(e),
        r = n.backend,
        o = this.readSync(e);
    r.disposeData(e), n.backend = t, t.move(e, o, n.shape, n.dtype), this.shouldCheckForMemLeaks() && this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1]++;
  }, t.prototype.tidy = function (t, e) {
    var n,
        r = this,
        o = null;

    if (null == e) {
      if ("function" != typeof t) throw new Error("Please provide a function to tidy()");
      e = t;
    } else {
      if ("string" != typeof t && !(t instanceof String)) throw new Error("When calling with two arguments, the first argument to tidy() must be a string");
      if ("function" != typeof e) throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");
      o = t;
    }

    return this.scopedRun(function () {
      return r.startScope(o);
    }, function () {
      return r.endScope(n);
    }, function () {
      return (n = e()) instanceof Promise && console.error("Cannot return a Promise inside of tidy."), n;
    });
  }, t.prototype.scopedRun = function (t, e, n) {
    t();

    try {
      var r = n();
      return e(), r;
    } catch (t) {
      throw e(), t;
    }
  }, t.prototype.nextTensorId = function () {
    return t.nextTensorId++;
  }, t.prototype.nextVariableId = function () {
    return t.nextVariableId++;
  }, t.prototype.clone = function (t) {
    var e = this.makeTensorFromDataId(t.dataId, t.shape, t.dtype),
        n = {
      x: t
    };
    return this.addTapeNode(this.state.activeScope.name, n, [e], function (t) {
      return {
        x: function () {
          return t.toFloat();
        }
      };
    }, [], {}), e;
  }, t.prototype.runKernel = function (t, e, n, r, o) {
    return this.runKernelFunc(null, e, null, t, n, r, o);
  }, t.prototype.shouldCheckForMemLeaks = function () {
    return this.ENV.getBool("IS_TEST");
  }, t.prototype.checkKernelForMemLeak = function (t, e, n) {
    var r = this.backend.numDataIds(),
        o = 0;
    n.forEach(function (t) {
      o += "complex64" === t.dtype ? 3 : 1;
    });
    var a = this.state.numDataMovesStack[this.state.numDataMovesStack.length - 1],
        i = r - e - o - a;
    if (i > 0) throw new Error("Backend '" + this.backendName + "' has an internal memory leak (" + i + " data ids) after running '" + t + "'");
  }, t.prototype.runKernelFunc = function (t, e, n, r, o, a, i) {
    var s,
        u = this,
        c = [],
        h = this.isTapeOn();
    null == r && (r = null != this.state.activeScope ? this.state.activeScope.name : "");
    var f,
        d = this.state.numBytes,
        p = this.state.numTensors;
    this.shouldCheckForMemLeaks() && this.state.numDataMovesStack.push(0);
    var v,
        g = l(r, this.backendName);
    if (null != g) f = function () {
      var t = u.backend.numDataIds();
      v = g.kernelFunc({
        inputs: e,
        attrs: o,
        backend: u.backend
      });
      var n = Array.isArray(v) ? v : [v];
      u.shouldCheckForMemLeaks() && u.checkKernelForMemLeak(r, t, n);
      var s = n.map(function (t) {
        var e = t.dataId,
            n = t.shape,
            r = t.dtype;
        return u.makeTensorFromDataId(e, n, r);
      });

      if (h) {
        var l = u.getTensorsForGradient(r, e, s);

        if (null == l) {
          null == i && (i = []);
          var f = s.filter(function (t, e) {
            return i[e];
          });
          l = (a || []).slice().concat(f);
        }

        c = u.saveTensorsForBackwardMode(l);
      }

      return s;
    };else {
      var m = function (t) {
        h && (c = t.map(function (t) {
          return u.keep(u.clone(t));
        }));
      };

      f = function () {
        var e = u.backend.numDataIds();
        v = u.tidy(function () {
          return t(u.backend, m);
        });
        var n = Array.isArray(v) ? v : [v];
        return u.shouldCheckForMemLeaks() && u.checkKernelForMemLeak(r, e, n), n;
      };
    }
    return this.scopedRun(function () {
      return u.state.kernelDepth++;
    }, function () {
      return u.state.kernelDepth--;
    }, function () {
      s = u.ENV.getBool("DEBUG") ? u.profiler.profileKernel(r, e, function () {
        return f();
      }) : f();
    }), h && this.addTapeNode(r, e, s, n, c, o), this.state.profiling && this.state.activeProfile.kernels.push({
      name: r,
      bytesAdded: this.state.numBytes - d,
      totalBytesSnapshot: this.state.numBytes,
      tensorsAdded: this.state.numTensors - p,
      totalTensorsSnapshot: this.state.numTensors,
      inputShapes: Object.keys(e).map(function (t) {
        return e[t].shape;
      }),
      outputShapes: s.map(function (t) {
        return t.shape;
      })
    }), Array.isArray(v) ? s : s[0];
  }, t.prototype.saveTensorsForBackwardMode = function (t) {
    var e = this;
    return t.map(function (t) {
      return e.keep(e.clone(t));
    });
  }, t.prototype.getTensorsForGradient = function (t, e, n) {
    var r = h(t);

    if (null != r) {
      var o = r.inputsToSave || [],
          a = r.outputsToSave || [],
          i = void 0;
      r.saveAllInputs ? (C(Array.isArray(e), function () {
        return "saveAllInputs is true, expected inputs to be an array.";
      }), i = Object.keys(e).map(function (t) {
        return e[t];
      })) : i = o.map(function (t) {
        return e[t];
      });
      var s = n.filter(function (t, e) {
        return a[e];
      });
      return i.concat(s);
    }

    return null;
  }, t.prototype.makeTensor = function (t, e, n, r) {
    if (null == t) throw new Error("Values passed to engine.makeTensor() are null");
    n = n || "float32", r = r || this.backend;
    var o = t;
    "string" === n && H(t[0]) && (o = t.map(function (t) {
      return rt(t);
    }));
    var a = r.write(o, e, n),
        i = new wt(e, n, a, this.nextTensorId());

    if (this.incRef(i, r), "string" === n) {
      var s = this.state.tensorInfo.get(a),
          u = G(o);
      this.state.numBytes += u - s.bytes, s.bytes = u;
    }

    return i;
  }, t.prototype.makeTensorFromDataId = function (t, e, n, r) {
    var o = new wt(e, n = n || "float32", t, this.nextTensorId());
    return this.incRef(o, r), o;
  }, t.prototype.makeVariable = function (t, e, n, r) {
    void 0 === e && (e = !0), n = n || this.nextVariableId().toString(), null != r && r !== t.dtype && (t = t.asType(r));
    var o = new St(t, e, n, this.nextTensorId());
    if (null != this.state.registeredVariables[o.name]) throw new Error("Variable with name " + o.name + " was already registered");
    return this.state.registeredVariables[o.name] = o, this.incRef(o, this.backend), o;
  }, t.prototype.incRef = function (t, e) {
    var n = this.state.tensorInfo.has(t.dataId) ? this.state.tensorInfo.get(t.dataId).refCount : 0;

    if (this.state.numTensors++, "string" === t.dtype && this.state.numStringTensors++, 0 === n) {
      this.state.numDataBuffers++;
      var r = 0;
      "complex64" !== t.dtype && "string" !== t.dtype && (r = t.size * z(t.dtype)), this.state.tensorInfo.set(t.dataId, {
        backend: e || this.backend,
        dtype: t.dtype,
        shape: t.shape,
        bytes: r,
        refCount: 0
      }), this.state.numBytes += r;
    }

    this.state.tensorInfo.get(t.dataId).refCount++, t instanceof St || this.track(t);
  }, t.prototype.disposeTensor = function (t) {
    if (this.state.tensorInfo.has(t.dataId)) {
      this.state.numTensors--, "string" === t.dtype && this.state.numStringTensors--;
      var e = this.state.tensorInfo.get(t.dataId);
      e.refCount <= 1 ? ("complex64" !== t.dtype && (this.state.numBytes -= e.bytes), this.state.numDataBuffers--, e.backend.disposeData(t.dataId), this.state.tensorInfo.delete(t.dataId)) : this.state.tensorInfo.get(t.dataId).refCount--;
    }
  }, t.prototype.disposeVariables = function () {
    for (var t in this.state.registeredVariables) {
      var e = this.state.registeredVariables[t];
      this.disposeVariable(e);
    }
  }, t.prototype.disposeVariable = function (t) {
    this.disposeTensor(t), null != this.state.registeredVariables[t.name] && delete this.state.registeredVariables[t.name];
  }, t.prototype.memory = function () {
    var t = this.backend.memory();
    return t.numTensors = this.state.numTensors, t.numDataBuffers = this.state.numDataBuffers, t.numBytes = this.state.numBytes, this.state.numStringTensors > 0 && (t.unreliable = !0, null == t.reasons && (t.reasons = []), t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")), t;
  }, t.prototype.profile = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        return this.state.profiling = !0, e = this.state.numBytes, n = this.state.numTensors, this.state.activeProfile.kernels = [], this.state.activeProfile.result = t(), this.state.profiling = !1, this.state.activeProfile.peakBytes = Math.max.apply(Math, this.state.activeProfile.kernels.map(function (t) {
          return t.totalBytesSnapshot;
        })), this.state.activeProfile.newBytes = this.state.numBytes - e, this.state.activeProfile.newTensors = this.state.numTensors - n, [2, this.state.activeProfile];
      });
    });
  }, t.prototype.isTapeOn = function () {
    return this.state.gradientDepth > 0 && 0 === this.state.kernelDepth;
  }, t.prototype.addTapeNode = function (t, e, n, r, o, a) {
    var i = this,
        s = {
      id: this.state.nextTapeNodeId++,
      kernelName: t,
      inputs: e,
      outputs: n,
      saved: o
    },
        u = h(t);
    null != u && (r = u.gradFunc), null != r && (s.gradient = function (t) {
      return t = t.map(function (t, e) {
        if (null == t) {
          var r = n[e],
              o = tt(r.size, r.dtype);
          return i.makeTensor(o, r.shape, r.dtype);
        }

        return t;
      }), r(t.length > 1 ? t : t[0], o, a);
    }), this.state.activeTape.push(s);
  }, t.prototype.keep = function (t) {
    return t.kept = !0, t;
  }, t.prototype.startTape = function () {
    0 === this.state.gradientDepth && (this.state.activeTape = []), this.state.gradientDepth++;
  }, t.prototype.endTape = function () {
    this.state.gradientDepth--;
  }, t.prototype.startScope = function (t) {
    var e = {
      track: [],
      name: "unnamed scope",
      id: this.state.nextScopeId++
    };
    t && (e.name = t), this.state.scopeStack.push(e), this.state.activeScope = e;
  }, t.prototype.endScope = function (t) {
    for (var e = this, n = _t(t), r = new Set(n.map(function (t) {
      return t.id;
    })), o = 0; o < this.state.activeScope.track.length; o++) {
      var a = this.state.activeScope.track[o];
      a.kept || r.has(a.id) || a.dispose();
    }

    var i = this.state.scopeStack.pop();
    this.state.activeScope = 0 === this.state.scopeStack.length ? null : this.state.scopeStack[this.state.scopeStack.length - 1], n.forEach(function (t) {
      t.kept || t.scopeId !== i.id || e.track(t);
    });
  }, t.prototype.gradients = function (t, e, n, r) {
    var o = this;
    if (void 0 === r && (r = !1), C(e.length > 0, function () {
      return "gradients() received an empty list of xs.";
    }), null != n && "float32" !== n.dtype) throw new Error("dy must have 'float32' dtype, but has '" + n.dtype + "'");
    var a = this.scopedRun(function () {
      return o.startTape();
    }, function () {
      return o.endTape();
    }, function () {
      return o.tidy("forward", t);
    });
    C(a instanceof wt, function () {
      return "The result y returned by f() must be a tensor.";
    });

    var i = function (t, e, n) {
      for (var r = {}, o = {}, a = 0; a < e.length; a++) r[e[a].id] = !0;

      for (a = 0; a < t.length; a++) {
        var i = (p = t[a]).inputs;

        for (var s in i) {
          for (var u = i[s], c = !1, l = 0; l < e.length; l++) if (r[u.id]) {
            p.outputs.forEach(function (t) {
              return r[t.id] = !0;
            }), c = !0, o[p.id] = !0;
            break;
          }

          if (c) break;
        }
      }

      var h = {};
      h[n.id] = !0;
      var f = {};

      for (a = t.length - 1; a >= 0; a--) for (i = (p = t[a]).inputs, l = 0; l < p.outputs.length; l++) if (h[p.outputs[l].id]) {
        for (var s in i) h[i[s].id] = !0, f[p.id] = !0;

        break;
      }

      var d = [];

      for (a = 0; a < t.length; a++) {
        var p;

        if (o[(p = t[a]).id] && f[p.id]) {
          var v = {};

          for (var s in p.inputs) {
            var g = p.inputs[s];
            r[g.id] && (v[s] = g);
          }

          var m = Object.assign({}, p);
          m.inputs = v, m.outputs = p.outputs, d.push(m);
        }
      }

      return d;
    }(this.state.activeTape, e, a);

    if (!r && 0 === i.length && e.length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");
    return this.tidy("backward", function () {
      var t,
          r,
          s = {};
      s[a.id] = null == n ? (t = a.shape, r = Z(k(t), "float32"), Lt.makeTensor(r, t, "float32")) : n, function (t, e, n) {
        for (var r = function (r) {
          var o = e[r],
              a = [];
          if (o.outputs.forEach(function (e) {
            var n = t[e.id];
            null != n ? a.push(n) : a.push(null);
          }), null == o.gradient) throw new Error("Cannot compute gradient: gradient function not found for " + o.kernelName + ".");

          var i = o.gradient(a),
              s = function (e) {
            if (!(e in i)) throw new Error("Cannot backprop through input " + e + ". Available gradients found: " + Object.keys(i) + ".");
            var r = n(function () {
              return i[e]();
            });
            if ("float32" !== r.dtype) throw new Error("Error in gradient for op " + o.kernelName + ". The gradient of input " + e + " must have 'float32' dtype, but has '" + r.dtype + "'");
            var a = o.inputs[e];
            if (!S(r.shape, a.shape)) throw new Error("Error in gradient for op " + o.kernelName + ". The gradient of input '" + e + "' has shape '" + r.shape + "', which does not match the shape of the input '" + a.shape + "'");
            if (null == t[a.id]) t[a.id] = r;else {
              var s = t[a.id];
              t[a.id] = s.add(r), s.dispose();
            }
          };

          for (var u in o.inputs) s(u);
        }, o = e.length - 1; o >= 0; o--) r(o);
      }(s, i, function (t) {
        return o.tidy(t);
      });
      var u = e.map(function (t) {
        return s[t.id];
      });
      return 0 === o.state.gradientDepth && (o.state.activeTape.forEach(function (t) {
        for (var e = 0, n = t.saved; e < n.length; e++) {
          n[e].dispose();
        }
      }), o.state.activeTape = null), {
        value: a,
        grads: u
      };
    });
  }, t.prototype.customGrad = function (t) {
    var e = this;
    return C(X(t), function () {
      return "The f passed in customGrad(f) must be a function.";
    }), function () {
      for (var n, r = [], o = 0; o < arguments.length; o++) r[o] = arguments[o];

      C(r.every(function (t) {
        return t instanceof wt;
      }), function () {
        return "The args passed in customGrad(f)(x1, x2,...) must all be tensors";
      });
      var a = {};
      return r.forEach(function (t, e) {
        a[e] = t;
      }), e.runKernelFunc(function (e, o) {
        return C((n = t.apply(void 0, r.concat([o]))).value instanceof wt, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.value` is a tensor";
        }), C(X(n.gradFunc), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function.";
        }), n.value;
      }, a, function (t, e) {
        var o = n.gradFunc(t, e),
            a = Array.isArray(o) ? o : [o];
        C(a.length === r.length, function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...).";
        }), C(a.every(function (t) {
          return t instanceof wt;
        }), function () {
          return "The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.";
        });
        var i = {};
        return a.forEach(function (t, e) {
          i[e] = function () {
            return t;
          };
        }), i;
      });
    };
  }, t.prototype.readSync = function (t) {
    return this.state.tensorInfo.get(t).backend.readSync(t);
  }, t.prototype.read = function (t) {
    return this.state.tensorInfo.get(t).backend.read(t);
  }, t.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return e = et(), [4, this.backend.time(t)];

          case 1:
            return (n = r.sent()).wallMs = et() - e, [2, n];
        }
      });
    });
  }, t.prototype.track = function (t) {
    return null != this.state.activeScope && (t.scopeId = this.state.activeScope.id, this.state.activeScope.track.push(t)), t;
  }, Object.defineProperty(t.prototype, "registeredVariables", {
    get: function () {
      return this.state.registeredVariables;
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.reset = function () {
    for (var t in this.pendingBackendInitId++, this.state.dispose(), this.ENV.reset(), this.state = new Bt(), this.registry) this.disposeRegisteredKernels(t), this.registry[t].dispose(), delete this.registry[t];

    this.backendName = null, this.backendInstance = null, this.pendingBackendInit = null;
  }, t.nextTensorId = 0, t.nextVariableId = 0, t;
}();

exports.tensor_util = Mt;

var Lt = function () {
  var t = function () {
    if (null == Ot) {
      var t = void 0;
      if ("undefined" != typeof window) t = window;else if ("undefined" != typeof global) t = global;else if ("undefined" != typeof process) t = process;else {
        if ("undefined" == typeof self) throw new Error("Could not find a global object");
        t = self;
      }
      Ot = t;
    }

    return Ot;
  }();

  if (null == t._tfengine) {
    var e = new o(t);
    t._tfengine = new Pt(e);
  }

  return function (t) {
    exports.ENV = s = t;
  }(t._tfengine.ENV), yt = function () {
    return t._tfengine;
  }, t._tfengine;
}();

function Wt() {
  return "undefined" != typeof window && null != window.document || "undefined" != typeof WorkerGlobalScope;
}

var Ut = i();
Ut.registerFlag("DEBUG", function () {
  return !1;
}, function (t) {
  t && console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.");
}), Ut.registerFlag("IS_BROWSER", function () {
  return Wt();
}), Ut.registerFlag("IS_NODE", function () {
  return "undefined" != typeof process && void 0 !== process.versions && void 0 !== process.versions.node;
}), Ut.registerFlag("IS_CHROME", function () {
  return "undefined" != typeof navigator && null != navigator && null != navigator.userAgent && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}), Ut.registerFlag("PROD", function () {
  return !1;
}), Ut.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY", function () {
  return Ut.getBool("DEBUG");
}), Ut.registerFlag("DEPRECATION_WARNINGS_ENABLED", function () {
  return !0;
}), Ut.registerFlag("IS_TEST", function () {
  return !1;
});
var Vt,
    zt,
    Gt,
    Ht = {},
    qt = {
  alpha: !1,
  antialias: !1,
  premultipliedAlpha: !1,
  preserveDrawingBuffer: !1,
  depth: !1,
  stencil: !1,
  failIfMajorPerformanceCaveat: !0
};

function Kt(t, e) {
  Ht[t] = e;
}

function jt(t) {
  t in Ht || (Ht[t] = function (t) {
    if (1 !== t && 2 !== t) throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");

    var e = function (t) {
      if ("undefined" != typeof OffscreenCanvas && 2 === t) return new OffscreenCanvas(300, 150);
      if ("undefined" != typeof document) return document.createElement("canvas");
      throw new Error("Cannot create a canvas in this context");
    }(t);

    if (e.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(), delete Ht[t];
    }, !1), 1 === t) return e.getContext("webgl", qt) || e.getContext("experimental-webgl", qt);
    return e.getContext("webgl2", qt);
  }(t));
  var e = Ht[t];
  return e.isContextLost() ? (delete Ht[t], jt(t)) : (e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.disable(e.BLEND), e.disable(e.DITHER), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SAMPLE_COVERAGE), e.enable(e.SCISSOR_TEST), e.enable(e.CULL_FACE), e.cullFace(e.BACK), Ht[t]);
}

function Xt(t, e) {
  return [e, t];
}

function Yt(t) {
  var e = k(t);
  return D(Math.ceil(e / 4));
}

function $t(t, e) {
  return [Math.max(1, Math.ceil(e / 2)), Math.max(1, Math.ceil(t / 2))];
}

function Qt(t, e) {
  var n,
      r,
      o,
      a,
      s,
      u,
      c,
      l,
      h,
      f = t;
  return 2 === i().getNumber("WEBGL_VERSION") ? (n = f.R32F, r = f.R16F, o = f.RGBA16F, a = f.RGBA32F, s = f.RED, u = 4, c = 1, l = f.HALF_FLOAT, h = f.FLOAT) : (n = t.RGBA, r = t.RGBA, o = t.RGBA, a = f.RGBA, s = t.RGBA, u = 4, c = 4, l = null != e ? e.HALF_FLOAT_OES : null, h = t.FLOAT), {
    internalFormatFloat: n,
    internalFormatHalfFloat: r,
    internalFormatPackedHalfFloat: o,
    internalFormatPackedFloat: a,
    textureFormatFloat: s,
    downloadTextureFormat: t.RGBA,
    downloadUnpackNumChannels: u,
    defaultNumChannels: c,
    textureTypeHalfFloat: l,
    textureTypeFloat: h
  };
}

function Jt(t, e, n) {
  var r = n();
  return e && function (t) {
    var e = t.getError();
    if (e !== t.NO_ERROR) throw new Error("WebGL Error: " + ne(t, e));
  }(t), r;
}

!function (t) {
  t[t.DENSE = 0] = "DENSE", t[t.SHARED_BATCH = 1] = "SHARED_BATCH";
}(Vt || (Vt = {})), function (t) {
  t[t.RENDER = 0] = "RENDER", t[t.UPLOAD = 1] = "UPLOAD", t[t.PIXELS = 2] = "PIXELS", t[t.DOWNLOAD = 3] = "DOWNLOAD";
}(zt || (zt = {})), function (t) {
  t[t.UNPACKED_FLOAT16 = 0] = "UNPACKED_FLOAT16", t[t.UNPACKED_FLOAT32 = 1] = "UNPACKED_FLOAT32", t[t.PACKED_4X1_UNSIGNED_BYTE = 2] = "PACKED_4X1_UNSIGNED_BYTE", t[t.PACKED_2X2_FLOAT32 = 3] = "PACKED_2X2_FLOAT32", t[t.PACKED_2X2_FLOAT16 = 4] = "PACKED_2X2_FLOAT16";
}(Gt || (Gt = {}));
var Zt = 5.96e-8,
    te = 65504;

function ee(t) {
  return !!(i().getBool("WEBGL_RENDER_FLOAT32_ENABLED") || 0 === t || Zt < Math.abs(t) && Math.abs(t) < te);
}

function ne(t, e) {
  switch (e) {
    case t.NO_ERROR:
      return "NO_ERROR";

    case t.INVALID_ENUM:
      return "INVALID_ENUM";

    case t.INVALID_VALUE:
      return "INVALID_VALUE";

    case t.INVALID_OPERATION:
      return "INVALID_OPERATION";

    case t.INVALID_FRAMEBUFFER_OPERATION:
      return "INVALID_FRAMEBUFFER_OPERATION";

    case t.OUT_OF_MEMORY:
      return "OUT_OF_MEMORY";

    case t.CONTEXT_LOST_WEBGL:
      return "CONTEXT_LOST_WEBGL";

    default:
      return "Unknown error code " + e;
  }
}

function re(t, e, n) {
  return ke(t, e, function () {
    return t.getExtension(n);
  }, 'Extension "' + n + '" not supported on this browser.');
}

function oe(t, e, n) {
  var r = ke(t, e, function () {
    return t.createShader(t.VERTEX_SHADER);
  }, "Unable to create vertex WebGLShader.");
  if (Jt(t, e, function () {
    return t.shaderSource(r, n);
  }), Jt(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw console.log(t.getShaderInfoLog(r)), new Error("Failed to compile vertex shader.");
  return r;
}

function ae(t, e, n) {
  var r = ke(t, e, function () {
    return t.createShader(t.FRAGMENT_SHADER);
  }, "Unable to create fragment WebGLShader.");
  if (Jt(t, e, function () {
    return t.shaderSource(r, n);
  }), Jt(t, e, function () {
    return t.compileShader(r);
  }), !1 === t.getShaderParameter(r, t.COMPILE_STATUS)) throw function (t, e) {
    var n = ue.exec(e);
    if (null == n) return console.log("Couldn't parse line number in error: " + e), void console.log(t);

    for (var r = +n[1], o = t.split("\n"), a = o.length.toString().length + 2, i = o.map(function (t, e) {
      return N((e + 1).toString(), a) + t;
    }), s = 0, u = 0; u < i.length; u++) s = Math.max(i[u].length, s);

    var c = i.slice(0, r - 1),
        l = i.slice(r - 1, r),
        h = i.slice(r);
    console.log(c.join("\n")), console.log(e.split("\n")[0]), console.log("%c " + N(l[0], s), "border:1px solid red; background-color:#e3d2d2; color:#a61717"), console.log(h.join("\n"));
  }(n, t.getShaderInfoLog(r)), new Error("Failed to compile fragment shader.");
  return r;
}

var ie,
    se,
    ue = /ERROR: [0-9]+:([0-9]+):/g;

function ce(t, e) {
  return ke(t, e, function () {
    return t.createProgram();
  }, "Unable to create WebGLProgram.");
}

function le(t, e, n) {
  if (Jt(t, e, function () {
    return t.linkProgram(n);
  }), !1 === t.getProgramParameter(n, t.LINK_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Failed to link vertex and fragment shaders.");
}

function he(t, e, n) {
  if (Jt(t, e, function () {
    return t.validateProgram(n);
  }), !1 === t.getProgramParameter(n, t.VALIDATE_STATUS)) throw console.log(t.getProgramInfoLog(n)), new Error("Shader program validation failed.");
}

function fe(t, e, n) {
  var r = ke(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Jt(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), Jt(t, e, function () {
    return t.bufferData(t.ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function de(t, e, n) {
  var r = ke(t, e, function () {
    return t.createBuffer();
  }, "Unable to create WebGLBuffer");
  return Jt(t, e, function () {
    return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, r);
  }), Jt(t, e, function () {
    return t.bufferData(t.ELEMENT_ARRAY_BUFFER, n, t.STATIC_DRAW);
  }), r;
}

function pe(t, e) {
  return ke(t, e, function () {
    return t.createTexture();
  }, "Unable to create WebGLTexture.");
}

function ve(t, e) {
  var n = i().getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (t <= 0 || e <= 0) {
    var r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " is invalid.");
  }

  if (t > n || e > n) {
    r = "[" + t + "x" + e + "]";
    throw new Error("Requested texture size " + r + " greater than WebGL maximum on this browser / GPU " + ("[" + n + "x" + n + "]") + ".");
  }
}

function ge(t, e) {
  return ke(t, e, function () {
    return t.createFramebuffer();
  }, "Unable to create WebGLFramebuffer.");
}

function me(t, e, n, r, o, a, i, s) {
  var u = t.getAttribLocation(n, r);
  return -1 !== u && (Jt(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, o);
  }), Jt(t, e, function () {
    return t.vertexAttribPointer(u, a, t.FLOAT, !1, i, s);
  }), Jt(t, e, function () {
    return t.enableVertexAttribArray(u);
  }), !0);
}

function ye(t, e, n, r) {
  Se(t, r), Jt(t, e, function () {
    return t.activeTexture(t.TEXTURE0 + r);
  }), Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  });
}

function xe(t, e, n, r) {
  return ke(t, e, function () {
    return t.getUniformLocation(n, r);
  }, 'uniform "' + r + '" not present in program.');
}

function be(t, e, n) {
  return t.getUniformLocation(e, n);
}

function we(t, e, n, r, o, a) {
  Jt(t, e, function () {
    return ye(t, e, r, a);
  }), Jt(t, e, function () {
    return t.uniform1i(o, a);
  });
}

function Ce(t, e, n, r) {
  Jt(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, r);
  }), Jt(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
  });
}

function Ee(t, e, n) {
  Jt(t, e, function () {
    return t.bindFramebuffer(t.FRAMEBUFFER, n);
  }), Jt(t, e, function () {
    return t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, null, 0);
  });
}

function Re(t) {
  var e = t.checkFramebufferStatus(t.FRAMEBUFFER);
  if (e !== t.FRAMEBUFFER_COMPLETE) throw new Error("Error binding framebuffer: " + Ie(t, e));
}

function Ie(t, e) {
  switch (e) {
    case t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
      return "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";

    case t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
      return "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";

    case t.FRAMEBUFFER_UNSUPPORTED:
      return "FRAMEBUFFER_UNSUPPORTED";

    default:
      return "unknown error " + e;
  }
}

function ke(t, e, n, r) {
  var o = Jt(t, e, function () {
    return n();
  });
  if (null == o) throw new Error(r);
  return o;
}

function Se(t, e) {
  var n = t.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1,
      r = e + t.TEXTURE0;
  if (r < t.TEXTURE0 || r > n) throw new Error("textureUnit must be in " + ("[gl.TEXTURE0, gl.TEXTURE" + n + "]") + ".");
}

function Ae(t, e) {
  return void 0 === e && (e = 2), k(t.slice(0, t.length - e));
}

function Te(t) {
  if (0 === t.length) throw Error("Cannot get rows and columns of an empty shape array.");
  return [t.length > 1 ? t[t.length - 2] : 1, t[t.length - 1]];
}

function De(t) {
  var e = [1, 1, 1];
  return 0 === t.length || 1 === t.length && 1 === t[0] || (e = [Ae(t)].concat(Te(t))), e;
}

function Ne(t, e) {
  var n;
  void 0 === e && (e = !1);
  var r = i().getNumber("WEBGL_MAX_TEXTURE_SIZE");

  if (e && (r *= 2, 1 === (t = t.map(function (e, n) {
    return n >= t.length - 2 ? b(t[n]) : t[n];
  })).length && (t = [2, t[0]])), 2 !== t.length) {
    var o = M(t);
    t = o.newShape;
  }

  var a = k(t);
  if (t.length <= 1 && a <= r) return [1, a];
  if (2 === t.length && t[0] <= r && t[1] <= r) return t;
  if (3 === t.length && t[0] * t[1] <= r && t[2] <= r) return [t[0] * t[1], t[2]];
  if (3 === t.length && t[0] <= r && t[1] * t[2] <= r) return [t[0], t[1] * t[2]];
  if (4 === t.length && t[0] * t[1] * t[2] <= r && t[3] <= r) return [t[0] * t[1] * t[2], t[3]];
  if (4 === t.length && t[0] <= r && t[1] * t[2] * t[3] <= r) return [t[0], t[1] * t[2] * t[3]];

  if (e) {
    var s = Ae(t),
        u = 2,
        c = 2;
    return t.length && (u = (n = Te(t))[0], c = n[1]), D(a = s * (u / 2) * (c / 2)).map(function (t) {
      return 2 * t;
    });
  }

  return D(a);
}

function Fe(t) {
  return t % 2 == 0;
}

function _e(t, e) {
  if (S(t = t.slice(-2), e = e.slice(-2))) return !0;
  if (!t.length || !e.length) return !0;
  if (0 === t[0] || 0 === t[1] || 0 === e[0] || 0 === e[1]) return !0;

  if (t.length !== e.length) {
    var n = t.slice(-1)[0],
        r = e.slice(-1)[0];
    if (n === r) return !0;
    if (Fe(n) && Fe(r) && (1 === t[0] || 1 === e[0])) return !0;
  }

  return t[1] === e[1] && Fe(t[0]) && Fe(e[0]);
}

function Oe(t) {
  if (null == ie) {
    var e = jt(t);
    ie = e.getParameter(e.MAX_TEXTURE_SIZE);
  }

  return ie;
}

function Me(t) {
  if (null == se) {
    var e = jt(t);
    se = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);
  }

  return Math.min(16, se);
}

function Be(t) {
  if (0 === t) return 0;
  var e = jt(t);
  return Pe(e, "EXT_disjoint_timer_query_webgl2") && 2 === t ? 2 : Pe(e, "EXT_disjoint_timer_query") ? 1 : 0;
}

function Pe(t, e) {
  return null != t.getExtension(e);
}

function Le(t) {
  try {
    if (null != jt(t)) return !0;
  } catch (t) {
    return !1;
  }

  return !1;
}

function We(t) {
  if (0 === t) return !1;
  var e = jt(t);

  if (1 === t) {
    if (!Pe(e, "OES_texture_float")) return !1;
  } else if (!Pe(e, "EXT_color_buffer_float")) return !1;

  return Ve(e);
}

function Ue(t) {
  if (0 === t) return !1;
  var e = jt(t);

  if (1 !== t) {
    if (Pe(e, "EXT_color_buffer_float")) return Ve(e);

    if (Pe(e, "EXT_color_buffer_half_float")) {
      var n = e.getExtension("EXT_color_buffer_half_float");
      return function (t, e) {
        var n = Qt(t, e),
            r = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, r);
        t.texImage2D(t.TEXTURE_2D, 0, n.internalFormatHalfFloat, 1, 1, 0, n.textureFormatFloat, n.textureTypeHalfFloat, null);
        var o = t.createFramebuffer();
        t.bindFramebuffer(t.FRAMEBUFFER, o), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, r, 0);
        var a = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE;
        return t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteTexture(r), t.deleteFramebuffer(o), a;
      }(e, n);
    }

    return !1;
  }

  return !!Pe(e, "OES_texture_float") && !!Pe(e, "WEBGL_color_buffer_float") && Ve(e);
}

function Ve(t) {
  var e = Qt(t),
      n = t.createTexture();
  t.bindTexture(t.TEXTURE_2D, n);
  t.texImage2D(t.TEXTURE_2D, 0, e.internalFormatFloat, 1, 1, 0, e.textureFormatFloat, e.textureTypeFloat, null);
  var r = t.createFramebuffer();
  t.bindFramebuffer(t.FRAMEBUFFER, r), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, n, 0);
  var o = t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE;
  return t.bindTexture(t.TEXTURE_2D, null), t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteTexture(n), t.deleteFramebuffer(r), o;
}

function ze(t) {
  return 2 === t && null != jt(t).fenceSync;
}

var Ge = Object.freeze({
  callAndCheck: Jt,
  canBeRepresented: ee,
  getWebGLErrorMessage: ne,
  getExtensionOrThrow: re,
  createVertexShader: oe,
  createFragmentShader: ae,
  createProgram: ce,
  linkProgram: le,
  validateProgram: he,
  createStaticVertexBuffer: fe,
  createStaticIndexBuffer: de,
  getNumChannels: function () {
    return 2 === i().getNumber("WEBGL_VERSION") ? 1 : 4;
  },
  createTexture: pe,
  validateTextureSize: ve,
  createFramebuffer: ge,
  bindVertexBufferToProgramAttribute: me,
  bindTextureUnit: ye,
  unbindTextureUnit: function (t, e, n) {
    Se(t, n), Jt(t, e, function () {
      return t.activeTexture(t.TEXTURE0 + n);
    }), Jt(t, e, function () {
      return t.bindTexture(t.TEXTURE_2D, null);
    });
  },
  getProgramUniformLocationOrThrow: xe,
  getProgramUniformLocation: be,
  bindTextureToProgramUniformSampler: we,
  bindCanvasToFramebuffer: function (t, e) {
    Jt(t, e, function () {
      return t.bindFramebuffer(t.FRAMEBUFFER, null);
    }), Jt(t, e, function () {
      return t.viewport(0, 0, t.canvas.width, t.canvas.height);
    }), Jt(t, e, function () {
      return t.scissor(0, 0, t.canvas.width, t.canvas.height);
    });
  },
  bindColorTextureToFramebuffer: Ce,
  unbindColorTextureFromFramebuffer: Ee,
  validateFramebuffer: Re,
  getFramebufferErrorMessage: Ie,
  getBatchDim: Ae,
  getRowsCols: Te,
  getShapeAs3D: De,
  getTextureShapeFromLogicalShape: Ne,
  isReshapeFree: _e,
  getWebGLMaxTextureSize: Oe,
  resetMaxTextureSize: function () {
    ie = null;
  },
  resetMaxTexturesInShader: function () {
    se = null;
  },
  getMaxTexturesInShader: Me,
  getWebGLDisjointQueryTimerVersion: Be,
  hasExtension: Pe,
  isWebGLVersionEnabled: Le,
  isCapableOfRenderingToFloatTexture: We,
  isDownloadFloatTextureEnabled: Ue,
  isWebGLFenceEnabled: ze
}),
    He = i();

function qe() {
  i().set("PROD", !0);
}

function Ke() {
  i().set("DEBUG", !0);
}

function je() {
  i().set("DEPRECATION_WARNINGS_ENABLED", !1), console.warn("TensorFlow.js deprecation warnings have been disabled.");
}

function Xe(t) {
  i().getBool("DEPRECATION_WARNINGS_ENABLED") && console.warn(t + " You can disable deprecation warnings with tf.disableDeprecationWarnings().");
}

function Ye() {
  Lt.disposeVariables();
}

function $e() {
  return Lt;
}

function Qe() {
  return Lt.memory();
}

function Je(t) {
  return Lt.profile(t);
}

function Ze(t, e) {
  return Lt.tidy(t, e);
}

function tn(t) {
  _t(t).forEach(function (t) {
    return t.dispose();
  });
}

function en(t) {
  return Lt.keep(t);
}

function nn(t) {
  return Lt.time(t);
}

function rn(t) {
  return Lt.setBackend(t);
}

function on() {
  return Lt.ready();
}

function an() {
  return Lt.backendName;
}

function sn(t) {
  Lt.removeBackend(t);
}

function un(t) {
  return Lt.findBackend(t);
}

function cn(t) {
  return Lt.findBackendFactory(t);
}

function ln(t, e, n) {
  return void 0 === n && (n = 1), Lt.registerBackend(t, e, n);
}

function hn() {
  return Lt.backend;
}

function fn(t, e) {
  i().setPlatform(t, e);
}

function dn() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

  i().getBool("IS_TEST") || console.warn.apply(console, t);
}

function pn(t, e) {
  var n = t;
  if (V(t)) return "string" === e ? [] : [t.length];
  if (!Array.isArray(t)) return [];

  for (var r = []; Array.isArray(n) || V(n) && "string" !== e;) r.push(n.length), n = n[0];

  return Array.isArray(t) && i().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY") && function t(e, n, r) {
    if (r = r || [], !Array.isArray(e) && !V(e)) return void C(0 === n.length, function () {
      return "Element arr[" + r.join("][") + "] is a primitive, but should be an array/TypedArray of " + n[0] + " elements";
    });
    C(n.length > 0, function () {
      return "Element arr[" + r.join("][") + "] should be a primitive, but is an array of " + e.length + " elements";
    }), C(e.length === n[0], function () {
      return "Element arr[" + r.join("][") + "] should have " + n[0] + " elements, but has " + e.length + " elements";
    });

    for (var o = n.slice(1), a = 0; a < e.length; ++a) t(e[a], o, r.concat(a));
  }(t, r, []), r;
}

function vn(t, e, n, r) {
  if (null != t && ("numeric" !== t && t !== e || "numeric" === t && "string" === e)) throw new Error("Argument '" + n + "' passed to '" + r + "' must be " + t + " tensor, but got " + e + " tensor");
}

function gn(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), t instanceof wt) return vn(r, t.dtype, e, n), t;
  var o = j(t);

  if ("string" !== o && ["bool", "int32", "float32"].indexOf(r) >= 0 && (o = r), vn(r, o, e, n), null == t || !V(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) {
    var a = null == t ? "null" : t.constructor.name;
    throw new Error("Argument '" + e + "' passed to '" + n + "' must be a Tensor or TensorLike, but got '" + a + "'");
  }

  var s = pn(t, o);
  V(t) || Array.isArray(t) || (t = [t]);
  var u = "string" !== o ? Q(t, o, i().getBool("DEBUG")) : I(t, [], !0);
  return Lt.makeTensor(u, s, o);
}

function mn(t, e, n, r) {
  if (void 0 === r && (r = "numeric"), !Array.isArray(t)) throw new Error("Argument " + e + " passed to " + n + " must be a `Tensor[]` or `TensorLike[]`");
  return t.map(function (t, r) {
    return gn(t, e + "[" + r + "]", n);
  }, r);
}

function yn(t, e) {
  for (var n = 0; n < t.length; ++n) if (t[t.length - n - 1] !== e - 1 - n) return !1;

  return !0;
}

function xn(t, e, n) {
  for (var r = t.length + e.length, o = [], a = 0, i = 0, s = 0; s < r; s++) -1 === n.indexOf(s) ? o.push(t[a++]) : o.push(e[i++]);

  return o;
}

function bn(t, e) {
  for (var n = [], r = t.length, o = 0; o < r; o++) -1 === e.indexOf(o) && n.push(t[o]);

  return [n, e.map(function (e) {
    return t[e];
  })];
}

function wn(t, e) {
  return xn(t, e.map(function (t) {
    return 1;
  }), e);
}

function Cn(t, e, n) {
  C(yn(e, n), function () {
    return t + " supports only inner-most axes for now. Got axes " + e + " and rank-" + n + " input.";
  });
}

function En(t, e) {
  if (yn(t, e)) return null;

  for (var n = [], r = 0; r < e; ++r) -1 === t.indexOf(r) && n.push(r);

  return t.forEach(function (t) {
    return n.push(t);
  }), n;
}

function Rn(t) {
  return t.map(function (t, e) {
    return [e, t];
  }).sort(function (t, e) {
    return t[1] - e[1];
  }).map(function (t) {
    return t[0];
  });
}

function In(t, e) {
  for (var n = [], r = e - t; r < e; ++r) n.push(r);

  return n;
}

function kn(t, e) {
  var n = t[0].length;
  t.forEach(function (t, e) {
    C(t.length === n, function () {
      return "Error in concat" + n + "D: rank of tensors[" + e + "] must be the same as the rank of the rest (" + n + ")";
    });
  }), C(e >= 0 && e < n, function () {
    return "Error in concat" + n + "D: axis must be between 0 and " + (n - 1) + ".";
  });
  var r = t[0];
  t.forEach(function (t, o) {
    for (var a = 0; a < n; a++) C(a === e || t[a] === r[a], function () {
      return "Error in concat" + n + "D: Shape of tensors[" + o + "] (" + t + ") does not match the shape of the rest (" + r + ") along the non-concatenated axis " + o + ".";
    });
  });
}

function Sn(t, e) {
  for (var n = t[0].slice(), r = 1; r < t.length; r++) n[e] += t[r][e];

  return n;
}

function An(t) {
  var e = Object.keys(t);
  if (1 !== e.length) throw new Error("Please provide an object with a single key (operation name) mapping to a function. Got an object with " + e.length + " keys.");
  var n = e[0],
      r = t[n];
  n.endsWith("_") && (n = n.substring(0, n.length - 1));

  var o = function () {
    for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];

    Lt.startScope(n);

    try {
      var o = r.apply(void 0, t);
      return o instanceof Promise && console.error("Cannot return a Promise inside of tidy."), Lt.endScope(o), o;
    } catch (t) {
      throw Lt.endScope(null), t;
    }
  };

  return Object.defineProperty(o, "name", {
    value: n,
    configurable: !0
  }), o;
}

He.registerFlag("HAS_WEBGL", function () {
  return He.getNumber("WEBGL_VERSION") > 0;
}), He.registerFlag("WEBGL_VERSION", function () {
  return Le(2) ? 2 : Le(1) ? 1 : 0;
}), He.registerFlag("WEBGL_BUFFER_SUPPORTED", function () {
  return 2 === He.get("WEBGL_VERSION");
}), He.registerFlag("WEBGL_CPU_FORWARD", function () {
  return !0;
}), He.registerFlag("WEBGL_FORCE_F16_TEXTURES", function () {
  return !1;
}), He.registerFlag("WEBGL_PACK", function () {
  return He.getBool("HAS_WEBGL");
}), He.registerFlag("WEBGL_PACK_NORMALIZATION", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_CLIP", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_DEPTHWISECONV", function () {
  return !1;
}), He.registerFlag("WEBGL_PACK_BINARY_OPERATIONS", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_UNARY_OPERATIONS", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_PACK_REDUCE", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_LAZILY_UNPACK", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_CONV_IM2COL", function () {
  return He.getBool("WEBGL_PACK");
}), He.registerFlag("WEBGL_MAX_TEXTURE_SIZE", function () {
  return Oe(He.getNumber("WEBGL_VERSION"));
}), He.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER", function () {
  return Me(He.getNumber("WEBGL_VERSION"));
}), He.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION", function () {
  var t = He.getNumber("WEBGL_VERSION");
  return 0 === t ? 0 : Be(t);
}), He.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE", function () {
  return He.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 && (t = navigator.userAgent || navigator.vendor || window.opera, !(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))));
  var t;
}), He.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE", function () {
  return We(He.getNumber("WEBGL_VERSION"));
}), He.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED", function () {
  return !He.getBool("WEBGL_FORCE_F16_TEXTURES") && He.getBool("WEBGL_RENDER_FLOAT32_CAPABLE");
}), He.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED", function () {
  return Ue(He.getNumber("WEBGL_VERSION"));
}), He.registerFlag("WEBGL_FENCE_API_ENABLED", function () {
  return ze(He.getNumber("WEBGL_VERSION"));
}), He.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM", function () {
  return He.getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? 4 : 0;
}), bt = Xe;
var Tn = An({
  complex_: function (t, e) {
    var n = gn(t, "real", "complex"),
        r = gn(e, "imag", "complex");
    return E(n.shape, r.shape, "real and imag shapes, " + n.shape + " and " + r.shape + ", must match in call to tf.complex()."), Lt.runKernelFunc(function (t) {
      return t.complex(n, r);
    }, {
      $real: n,
      $imag: r
    });
  }
}),
    Dn = An({
  real_: function (t) {
    var e = gn(t, "input", "real");
    return Lt.runKernelFunc(function (t) {
      return t.real(e);
    }, {
      $input: e
    });
  }
}),
    Nn = An({
  imag_: function (t) {
    var e = gn(t, "input", "imag");
    return Lt.runKernelFunc(function (t) {
      return t.imag(e);
    }, {
      $input: e
    });
  }
});
exports.imag = Nn;
exports.real = Dn;
exports.complex = Tn;

function Fn(t, e, n) {
  return _n(t, e, pn(t, n), n);
}

function _n(t, e, n, r) {
  if (null == r && (r = j(t)), "complex64" === r) throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");
  if (!V(t) && !Array.isArray(t) && "number" != typeof t && "boolean" != typeof t && "string" != typeof t) throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");

  if (null != e) {
    nt(e);
    var o = k(e),
        a = k(n);
    C(o === a, function () {
      return "Based on the provided shape, [" + e + "], the tensor should have " + o + " values but has " + a;
    });

    for (var s = 0; s < n.length; ++s) {
      var u = n[s],
          c = s !== n.length - 1 || u !== k(e.slice(s));
      C(n[s] === e[s] || !c, function () {
        return "Error creating a new Tensor. Inferred shape (" + n + ") does not match the provided shape (" + e + "). ";
      });
    }
  }

  return V(t) || Array.isArray(t) || (t = [t]), e = e || n, t = "string" !== r ? Q(t, r, i().getBool("DEBUG")) : I(t, [], !0), Lt.makeTensor(t, e, r);
}

function On(t, e) {
  if ((V(t) && "string" !== e || Array.isArray(t)) && "complex64" !== e) throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");
  if ("string" === e && V(t) && !(t instanceof Uint8Array)) throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");
  return _n(t, [], [], e);
}

function Mn(t, e) {
  R(t);
  var n = pn(t, e);
  if (1 !== n.length) throw new Error("tensor1d() requires values to be a flat/TypedArray");
  return _n(t, null, n, e);
}

function Bn(t, e, n) {
  if (R(t), null != e && 2 !== e.length) throw new Error("tensor2d() requires shape to have two numbers");
  var r = pn(t, n);
  if (2 !== r.length && 1 !== r.length) throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");
  return _n(t, e, r, n);
}

function Pn(t, e, n) {
  if (R(t), null != e && 3 !== e.length) throw new Error("tensor3d() requires shape to have three numbers");
  var r = pn(t, n);
  if (3 !== r.length && 1 !== r.length) throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");
  return _n(t, e, r, n);
}

function Ln(t, e, n) {
  if (R(t), null != e && 4 !== e.length) throw new Error("tensor4d() requires shape to have four numbers");
  var r = pn(t, n);
  if (4 !== r.length && 1 !== r.length) throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");
  return _n(t, e, r, n);
}

function Wn(t, e, n) {
  if (R(t), null != e && 5 !== e.length) throw new Error("tensor5d() requires shape to have five numbers");
  var r = pn(t, n);
  if (5 !== r.length && 1 !== r.length) throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");
  return _n(t, e, r, n);
}

function Un(t, e, n) {
  if (R(t), null != e && 6 !== e.length) throw new Error("tensor6d() requires shape to have six numbers");
  var r = pn(t, n);
  if (6 !== r.length && 1 !== r.length) throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");
  if (1 === r.length && null == e) throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");
  return _n(t, e = e || r, r, n);
}

function Vn(t, e, n, r) {
  return void 0 === e && (e = !0), Lt.makeVariable(t, e, n, r);
}

function zn(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = zn(t, "float32"),
        r = Gn(t, "float32");
    return Tn(n, r);
  }

  var o = Z(k(t), e);
  return Lt.makeTensor(o, t, e);
}

function Gn(t, e) {
  if (void 0 === e && (e = "float32"), "complex64" === e) {
    var n = Gn(t, "float32"),
        r = Gn(t, "float32");
    return Tn(n, r);
  }

  var o = tt(k(t), e);
  return Lt.makeTensor(o, t, e);
}

function Hn(t, e, n) {
  return Lt.runKernelFunc(function (r) {
    return r.fill(t, e, n);
  }, {});
}

function qn(t, e, n) {
  if (n <= 0) throw new Error("The number of values should be positive.");
  return Lt.runKernelFunc(function (r) {
    return r.linspace(t, e, n);
  }, {});
}

function Kn(t, e, n, r) {
  if (void 0 === n && (n = 1), void 0 === r && (r = "float32"), 0 === n) throw new Error("Cannot have a step of zero");
  if (t === e || t < e && n < 0 || e < t && n > 1) return Gn([0], r);
  var o = tt(Math.abs(Math.ceil((e - t) / n)), r);
  e < t && 1 === n && (n = -1), o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + n;

  return Mn(o, r);
}

var jn = An({
  onesLike_: function (t) {
    var e = gn(t, "x", "onesLike");

    if ("complex64" === e.dtype) {
      var n = jn(Dn(e)),
          r = Xn(Nn(e));
      return Tn(n, r);
    }

    return Lt.runKernelFunc(function (t) {
      return t.onesLike(e);
    }, {
      x: e
    }, function (t, e) {
      return {
        x: function () {
          return Xn(t);
        }
      };
    }, "OnesLike");
  }
}),
    Xn = An({
  zerosLike_: function (t) {
    var e = gn(t, "x", "zerosLike");
    return Lt.runKernelFunc(function (t) {
      return t.zerosLike(e);
    }, {
      x: e
    }, function (t, e) {
      return {
        x: function () {
          return Xn(t);
        }
      };
    }, "ZerosLike");
  }
});
exports.zerosLike = Xn;
exports.onesLike = jn;
var Yn = An({
  concat_: function (t, e) {
    void 0 === e && (e = 0), C(t.length >= 1, function () {
      return "Pass at least one tensor to concat";
    });
    var n = mn(t, "tensors", "concat");
    "complex64" === n[0].dtype && n.forEach(function (t) {
      if ("complex64" !== t.dtype) throw new Error("Cannot concatenate complex64 tensors with a tensor\n          with dtype " + t.dtype + ". ");
    }), e = O(e, n[0].shape)[0];
    var r = Sn(n.map(function (t) {
      return t.shape;
    }), e);
    if (0 === k(r)) return Fn([], r);
    if (1 === (n = n.filter(function (t) {
      return t.size > 0;
    })).length) return n[0];
    var o = n.map(function (t) {
      return t.shape;
    });
    kn(o, e);
    var a = n,
        i = {
      axis: e
    };
    return Lt.runKernelFunc(function (t) {
      return t.concat(n, e);
    }, a, function (t) {
      var n = o.map(function (t) {
        return t[e];
      });
      return tr(t, n, e).map(function (t) {
        return function () {
          return t;
        };
      });
    }, "Concat", i);
  }
}),
    $n = An({
  concat1d_: function (t) {
    return Yn(t, 0);
  }
}),
    Qn = An({
  concat2d_: function (t, e) {
    return Yn(t, e);
  }
}),
    Jn = An({
  concat3d_: function (t, e) {
    return Yn(t, e);
  }
}),
    Zn = An({
  concat4d_: function (t, e) {
    return Yn(t, e);
  }
}),
    tr = An({
  split_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r,
        o = gn(t, "x", "split");
    return n = O(n, o.shape)[0], "number" == typeof e ? (C(o.shape[n] % e == 0, function () {
      return "Number of splits must evenly divide the axis.";
    }), r = new Array(e).fill(o.shape[n] / e)) : (C(o.shape[n] === e.reduce(function (t, e) {
      return t + e;
    }), function () {
      return "The sum of sizes must match the size of the axis dimension.";
    }), r = e), Lt.runKernelFunc(function (t) {
      return t.split(o, r, n);
    }, {
      $x: o
    }, function (t) {
      return {
        $x: function () {
          return Yn(t, n);
        }
      };
    });
  }
});
exports.split = tr;
exports.concat4d = Zn;
exports.concat3d = Jn;
exports.concat2d = Qn;
exports.concat1d = $n;
exports.concat = Yn;

function er(t, e, n) {
  return void 0 === e && (e = "float32"), e = e || "float32", nt(t), new mt(t, e, n);
}

function nr(t, e) {
  void 0 === e && (e = !1), console.log(t.toString(e));
}

var rr = An({
  batchToSpaceND_: function (t, e, n) {
    var r = gn(t, "x", "batchToSpaceND"),
        o = e.reduce(function (t, e) {
      return t * e;
    });
    return C(r.rank >= 1 + e.length, function () {
      return "input rank is " + r.rank + " but should be > than blockShape.length " + e.length;
    }), C(n.length === e.length, function () {
      return "crops.length is " + n.length + " but should be equal to blockShape.length  " + e.length;
    }), C(r.shape[0] % o == 0, function () {
      return "input tensor batch is " + r.shape[0] + " but is not divisible by the product of the elements of blockShape " + e.join(" * ") + " === " + o;
    }), Lt.runKernelFunc(function (t) {
      return t.batchToSpaceND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.spaceToBatchND(e, n);
        }
      };
    });
  }
}),
    or = An({
  cast_: function (t, e) {
    var n = gn(t, "x", "cast");
    if (!W(e)) throw new Error("Failed to cast to unknown dtype " + e);
    if ("string" === e && "string" !== n.dtype || "string" !== e && "string" === n.dtype) throw new Error("Only strings can be casted to strings");
    var r = {
      dtype: e
    };
    return Lt.runKernelFunc(function (t) {
      return t.cast(n, e);
    }, {
      x: n
    }, function (t) {
      return {
        x: function () {
          return t.clone();
        }
      };
    }, "Cast", r);
  }
}),
    ar = An({
  cumsum_: function (t, e, n, r) {
    void 0 === e && (e = 0), void 0 === n && (n = !1), void 0 === r && (r = !1);
    var o = gn(t, "x", "cumsum"),
        a = En([e |= 0], o.rank),
        i = o;
    null != a && (i = o.transpose(a));
    var s = In(1, o.rank)[0],
        u = Lt.runKernelFunc(function (t) {
      return t.cumsum(i, s, n, r);
    }, {
      permutedX: i
    }, function (t) {
      return {
        permutedX: function () {
          return t.cumsum(e, n, !r);
        }
      };
    });
    return null != a && (u = u.transpose(a)), u;
  }
}),
    ir = An({
  depthToSpace_: function (t, e, n) {
    void 0 === n && (n = "NHWC");
    var r = gn(t, "x", "depthToSpace"),
        o = "NHWC" === n ? r.shape[1] : r.shape[2],
        a = "NHWC" === n ? r.shape[2] : r.shape[3],
        i = "NHWC" === n ? r.shape[3] : r.shape[1];
    return C(o * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + o + " and " + e + "  for depthToSpace with input shape\n      " + r.shape;
    }), C(a * e >= 0, function () {
      return "Negative dimension size caused by overflow when multiplying\n      " + a + " and " + e + " for depthToSpace with input shape\n          " + r.shape;
    }), C(i % (e * e) == 0, function () {
      return "Dimension size must be evenly divisible by " + e * e + " but is " + i + " for depthToSpace with input shape " + r.shape;
    }), Lt.runKernelFunc(function (t) {
      return t.depthToSpace(r, e, n);
    }, {
      $x: r
    });
  }
}),
    sr = An({
  expandDims_: function (t, e) {
    void 0 === e && (e = 0);
    var n = gn(t, "x", "expandDims", null);
    C(e <= n.rank, function () {
      return "Axis must be <= rank of the tensor";
    });
    var r = n.shape.slice();
    return e < 0 && (C(-(n.rank + 1) <= e, function () {
      return "Axis must be in the interval [" + -(n.rank + 1) + ", " + n.rank + "]";
    }), e = n.rank + e + 1), r.splice(e, 0, 1), ur(n, r);
  }
}),
    ur = An({
  reshape_: function (t, e) {
    var n = gn(t, "x", "reshape", null);
    e = _(e, n.size), C(n.size === k(e), function () {
      return "new shape and old shape must have the same number of elements.";
    });
    var r = {
      shape: e
    };
    return Lt.runKernelFunc(function (t) {
      return t.reshape(n, e);
    }, {
      x: n
    }, function (t) {
      return {
        x: function () {
          return t.reshape(n.shape);
        }
      };
    }, "Reshape", r);
  }
}),
    cr = An({
  spaceToBatchND_: function (t, e, n) {
    var r = gn(t, "x", "spaceToBatchND");
    return C(r.rank >= 1 + e.length, function () {
      return "input rank " + r.rank + " should be > than [blockShape] " + e.length;
    }), C(n.length === e.length, function () {
      return "paddings.shape[0] " + n.length + " must be equal to [blockShape] " + e.length;
    }), C(r.shape.reduce(function (t, r, o) {
      return o > 0 && o <= e.length ? t && (r + n[o - 1][0] + n[o - 1][1]) % e[o - 1] == 0 : t;
    }, !0), function () {
      return "input spatial dimensions " + r.shape.slice(1) + " with paddings " + n.toString() + " must be divisible by blockShapes " + e.toString();
    }), Lt.runKernelFunc(function (t) {
      return t.spaceToBatchND(r, e, n);
    }, {
      $x: r
    }, function (t) {
      return {
        $x: function () {
          return t.batchToSpaceND(e, n);
        }
      };
    });
  }
}),
    lr = An({
  squeeze_: function (t, e) {
    var n = gn(t, "x", "squeeze");
    return ur(n, M(n.shape, e).newShape);
  }
}),
    hr = An({
  stack_: function (t, e) {
    void 0 === e && (e = 0);
    var n = mn(t, "tensors", "stack");
    if (C(n.length >= 1, function () {
      return "Pass at least one tensor to tf.stack";
    }), 1 === n.length) return n[0].expandDims(e);
    var r = n[0].rank,
        o = n[0].shape,
        a = n[0].dtype;
    C(e <= r, function () {
      return "Axis must be <= rank of the tensor";
    }), n.forEach(function (t) {
      E(o, t.shape, "All tensors passed to stack must have matching shapes");
    }), n.forEach(function (t) {
      C(a === t.dtype, function () {
        return "All tensors passed to stack must have matching dtypes";
      });
    });
    var i = n.map(function (t) {
      return t.expandDims(e);
    });
    return Yn(i, e);
  }
}),
    fr = An({
  unstack_: function (t, e) {
    void 0 === e && (e = 0), e = e || 0;
    var n = gn(t, "x", "unstack");
    C(e >= -n.shape.length && e < n.shape.length, function () {
      return "Axis = " + e + " is not in [-" + n.shape.length + ", " + n.shape.length + ")";
    }), e < 0 && (e += n.shape.length);
    var r = {
      axis: e
    };
    return Lt.runKernelFunc(function (t) {
      return t.unstack(n, e);
    }, {
      x: n
    }, function (t) {
      return {
        x: function () {
          return hr(t, e);
        }
      };
    }, "Unpack", r);
  }
}),
    dr = function (t, e) {
  return n(this, void 0, void 0, function () {
    var n, o, a, i, s, u, c, l, h, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = gn(t, "x", "setdiff1d"), o = gn(e, "y", "setdiff1d"), C(n.dtype === o.dtype, function () {
            return "x and y should have the same dtype, but got x (" + n.dtype + ") and y (" + o.dtype + ").";
          }), C(1 === n.rank, function () {
            return "x should be 1D tensor, but got x (" + n.shape + ").";
          }), C(1 === o.rank, function () {
            return "y should be 1D tensor, but got y (" + o.shape + ").";
          }), [4, n.data()];

        case 1:
          return a = r.sent(), [4, o.data()];

        case 2:
          for (i = r.sent(), s = new Set(i), u = 0, h = 0; h < a.length; h++) s.has(a[h]) || u++;

          for (c = new mt([u], n.dtype), l = new mt([u], "int32"), h = 0, f = 0; h < a.length; h++) s.has(a[h]) || (c.values[f] = a[h], l.values[f] = h, f++);

          return [2, [c.toTensor(), l.toTensor()]];
      }
    });
  });
};

exports.setdiff1dAsync = dr;
exports.unstack = fr;
exports.stack = hr;
exports.squeeze = lr;
exports.spaceToBatchND = cr;
exports.reshape = ur;
exports.expandDims = sr;
exports.depthToSpace = ir;
exports.cumsum = ar;
exports.cast = or;
exports.batchToSpaceND = rr;

function pr(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  if (r) (o = o.concat(e.slice(0))).push(t[0] / n), o = o.concat(t.slice(1));else {
    o = o.concat(t[0]);

    for (var a = e.length, i = 0; i < a; ++i) o = o.concat([t[i + 1] / e[i], e[i]]);

    o = o.concat(t.slice(a + 1));
  }
  return o;
}

function vr(t, e, n) {
  void 0 === n && (n = !0);
  var r = [];

  if (n) {
    r.push(e);

    for (var o = e + 1; o < t; ++o) o <= 2 * e ? (r.push(o), r.push(o - (e + 1))) : r.push(o);
  } else {
    var a = [],
        i = [];

    for (o = 1; o < t; ++o) o >= 2 * e + 1 || o % 2 == 1 ? i.push(o) : a.push(o);

    r.push.apply(r, a), r.push(0), r.push.apply(r, i);
  }

  return r;
}

function gr(t, e, n, r) {
  void 0 === r && (r = !0);
  var o = [];
  r ? o.push(t[0] / n) : o.push(t[0] * n);

  for (var a = 1; a < t.length; ++a) a <= e.length ? r ? o.push(e[a - 1] * t[a]) : o.push(t[a] / e[a - 1]) : o.push(t[a]);

  return o;
}

function mr(t, e) {
  for (var n = [0], r = 0; r < e; ++r) n.push(t[r][0]);

  return n;
}

function yr(t, e, n) {
  for (var r = t.slice(0, 1), o = 0; o < n; ++o) r.push(t[o + 1] - e[o][0] - e[o][1]);

  return r;
}

var xr = "Add",
    br = "AddN",
    wr = "Div",
    Cr = "FusedBatchNorm",
    Er = "SquaredDifference",
    Rr = "Square",
    Ir = "Transpose",
    kr = "NonMaxSuppressionV5",
    Sr = "BroadcastTo",
    Ar = "OneHot",
    Tr = "Identity",
    Dr = "Tile",
    Nr = "PadV2",
    Fr = "FromPixels",
    _r = "MaxPoolWithArgmax";
exports.MaxPoolWithArgmax = _r;
exports.FromPixels = Fr;
exports.PadV2 = Nr;
exports.Tile = Dr;
exports.Identity = Tr;
exports.OneHot = Ar;
exports.BroadcastTo = Sr;
exports.NonMaxSuppressionV5 = kr;
exports.Transpose = Ir;
exports.Square = Rr;
exports.SquaredDifference = Er;
exports.FusedBatchNorm = Cr;
exports.Div = wr;
exports.AddN = br;
exports.Add = xr;
var Or = An({
  add_: function (t, e) {
    var n,
        r = gn(t, "a", "add"),
        o = gn(e, "b", "add");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = {
      a: r,
      b: o
    };
    return Lt.runKernelFunc(function (t, e) {
      var n = t.add(r, o);
      return e([r, o]), n;
    }, a, null, xr);
  }
});
exports.add = Or;

function Mr(t, e) {
  for (var n = t.length, r = [], o = 0; o < n; o++) {
    var a = n - 1 - o,
        i = t[a] || 1;
    (e[e.length - 1 - o] || 1) > 1 && 1 === i && r.unshift(a);
  }

  return r;
}

function Br(t, e) {
  for (var n = [], r = 0; r < e.length; r++) {
    var o = t[t.length - r - 1],
        a = e.length - r - 1,
        i = e[a];
    (null == o || 1 === o && i > 1) && n.unshift(a);
  }

  return n;
}

function Pr(t, e) {
  for (var n = [], r = Math.max(t.length, e.length), o = 0; o < r; o++) {
    var a = t[t.length - o - 1];
    null == a && (a = 1);
    var i = e[e.length - o - 1];
    if (null == i && (i = 1), 1 === a) n.unshift(i);else if (1 === i) n.unshift(a);else {
      if (a !== i) throw Error("Operands could not be broadcast together with shapes " + t + " and " + e + ".");
      n.unshift(a);
    }
  }

  return n;
}

var Lr = An({
  abs_: function (t) {
    var e = gn(t, "x", "abs");
    return "complex64" === e.dtype ? Lt.runKernelFunc(function (t) {
      return t.complexAbs(e);
    }, {
      $x: e
    }) : Lt.runKernelFunc(function (t, n) {
      var r = t.abs(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return t.mul(n.toFloat().step(-1));
        }
      };
    }, "Abs");
  }
}),
    Wr = An({
  acos_: function (t) {
    var e = gn(t, "x", "acos");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.acos(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(On(1).sub(n.toFloat().square()).sqrt()).neg();
        }
      };
    });
  }
}),
    Ur = An({
  acosh_: function (t) {
    var e = gn(t, "x", "acosh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.acosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(n.toFloat().square().sub(1).sqrt());
        }
      };
    });
  }
}),
    Vr = An({
  asin_: function (t) {
    var e = gn(t, "x", "asin");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.asin(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(On(1).sub(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    zr = An({
  asinh_: function (t) {
    var e = gn(t, "x", "asinh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.asinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.divStrict(On(1).add(n.toFloat().square()).sqrt());
        }
      };
    });
  }
}),
    Gr = An({
  atan_: function (t) {
    var e = gn(t, "x", "atan");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.atan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().square().add(1));
        }
      };
    });
  }
}),
    Hr = An({
  atanh_: function (t) {
    var e = gn(t, "x", "atanh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.atanh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(On(1).sub(n.toFloat().square()));
        }
      };
    });
  }
}),
    qr = An({
  ceil_: function (t) {
    var e = gn(t, "x", "ceil");
    return Lt.runKernelFunc(function (t) {
      return t.ceil(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    Kr = An({
  clipByValue_: function (t, e, n) {
    var r = gn(t, "x", "clipByValue");
    C(e <= n, function () {
      return "Error in clip: min (" + e + ") must be less than or equal to max (" + n + ").";
    });
    var o = [r],
        a = {
      min: e,
      max: n
    };
    return Lt.runKernelFunc(function (t, o) {
      var a = t.clip(r, e, n);
      return o([r]), a;
    }, {
      x: r
    }, function (t, r) {
      var o = r[0];
      return {
        x: function () {
          return t.where(o.greaterEqual(e).logicalAnd(o.lessEqual(n)), Xn(t));
        }
      };
    }, "ClipByValue", a, o);
  }
}),
    jr = An({
  cos_: function (t) {
    var e = gn(t, "x", "cos"),
        n = [e];
    return Lt.runKernelFunc(function (t, n) {
      var r = t.cos(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return n.toFloat().sin().neg().mul(t);
        }
      };
    }, "Cos", {}, n);
  }
}),
    Xr = An({
  cosh_: function (t) {
    var e = gn(t, "x", "cosh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.cosh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().sinh().mulStrict(t);
        }
      };
    });
  }
}),
    Yr = An({
  erf_: function (t) {
    var e = gn(t, "x", "erf");
    return C("int32" === e.dtype || "float32" === e.dtype, function () {
      return "Input dtype must be `int32` or `float32`.";
    }), "int32" === e.dtype && (e = e.toFloat()), Lt.runKernelFunc(function (t, n) {
      var r = t.erf(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.square().neg().exp().mul(2 / Math.sqrt(Math.PI)));
        }
      };
    });
  }
}),
    $r = An({
  exp_: function (t) {
    var e = gn(t, "x", "exp");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.exp(e);
      return n([r]), r;
    }, {
      x: e
    }, function (t, e) {
      return {
        x: function () {
          return t.mulStrict(e[0]);
        }
      };
    }, "Exp", {}, [], [!0]);
  }
}),
    Qr = An({
  expm1_: function (t) {
    var e = gn(t, "x", "expm1");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.expm1(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.exp());
        }
      };
    });
  }
}),
    Jr = An({
  floor_: function (t) {
    var e = gn(t, "x", "floor");
    return Lt.runKernelFunc(function (t) {
      return t.floor(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    Zr = An({
  log_: function (t) {
    var e = gn(t, "x", "log"),
        n = [e];
    return Lt.runKernelFunc(function (t, n) {
      var r = t.log(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return t.div(n.toFloat());
        }
      };
    }, "Log", {}, n);
  }
}),
    to = An({
  log1p_: function (t) {
    var e = gn(t, "x", "log1p");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.log1p(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.add(1));
        }
      };
    });
  }
}),
    eo = An({
  logSigmoid_: function (t) {
    var e = gn(t, "x", "logSigmoid");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.softplus(e.neg()).neg();
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.neg().sigmoid());
        }
      };
    });
  }
}),
    no = An({
  neg_: function (t) {
    var e = gn(t, "x", "neg"),
        n = [e];
    return Lt.runKernelFunc(function (t) {
      return t.neg(e);
    }, {
      x: e
    }, function (t) {
      return {
        x: function () {
          return t.neg();
        }
      };
    }, "Neg", {}, n);
  }
}),
    ro = An({
  reciprocal_: function (t) {
    var e = gn(t, "x", "reciprocal");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.reciprocal(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.square().neg());
        }
      };
    });
  }
}),
    oo = An({
  round_: function (t) {
    var e = gn(t, "x", "round");
    return Lt.runKernelFunc(function (t) {
      return t.round(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    ao = An({
  rsqrt_: function (t) {
    var e = gn(t, "x", "rsqrt"),
        n = [e];
    return Lt.runKernelFunc(function (t, n) {
      var r = t.rsqrt(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return t.div(n.pow(1.5).mul(2)).neg();
        }
      };
    }, "Rsqrt", {}, n);
  }
}),
    io = An({
  sigmoid_: function (t) {
    var e = gn(t, "x", "sigmoid");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.sigmoid(e);
      return n([r]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return t.mul(n.mul(On(1).sub(n)));
        }
      };
    }, "Sigmoid");
  }
}),
    so = An({
  sign_: function (t) {
    var e = gn(t, "x", "sign");
    return Lt.runKernelFunc(function (t) {
      return t.sign(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    uo = An({
  isNaN_: function (t) {
    var e = gn(t, "x", "isNaN");
    return Lt.runKernelFunc(function (t) {
      return t.isNaN(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    co = An({
  isInf_: function (t) {
    var e = gn(t, "x", "isInf");
    return Lt.runKernelFunc(function (t) {
      return t.isInf(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    lo = An({
  isFinite_: function (t) {
    var e = gn(t, "x", "isFinite");
    return Lt.runKernelFunc(function (t) {
      return t.isFinite(e);
    }, {
      $x: e
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    ho = An({
  sin_: function (t) {
    var e = gn(t, "x", "sin"),
        n = [e];
    return Lt.runKernelFunc(function (t, n) {
      var r = t.sin(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return n.toFloat().cos().mul(t);
        }
      };
    }, "Sin", {}, n);
  }
}),
    fo = An({
  sinh_: function (t) {
    var e = gn(t, "x", "sinh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.sinh(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return n.toFloat().cosh().mulStrict(t);
        }
      };
    });
  }
}),
    po = An({
  softplus_: function (t) {
    var e = gn(t, "x", "softplus");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.softplus(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.mul(n.sigmoid());
        }
      };
    });
  }
}),
    vo = An({
  sqrt_: function (t) {
    var e = gn(t, "x", "sqrt");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.sqrt(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.toFloat().sqrt().mul(2));
        }
      };
    });
  }
}),
    go = An({
  step_: function (t, e) {
    void 0 === e && (e = 0);
    var n = gn(t, "x", "step");
    return Lt.runKernelFunc(function (t) {
      return t.step(n, e);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return Xn(t);
        }
      };
    });
  }
}),
    mo = An({
  tan_: function (t) {
    var e = gn(t, "x", "tan");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.tan(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return t.div(n.cos().square());
        }
      };
    });
  }
}),
    yo = An({
  tanh_: function (t) {
    var e = gn(t, "x", "tanh");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.tanh(e);
      return n([r]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return On(1).sub(n.square()).mulStrict(t);
        }
      };
    }, "Tanh", {}, null, [!0]);
  }
});
exports.tanh = yo;
exports.tan = mo;
exports.step = go;
exports.sqrt = vo;
exports.softplus = po;
exports.sinh = fo;
exports.sin = ho;
exports.isFinite = lo;
exports.isInf = co;
exports.isNaN = uo;
exports.sign = so;
exports.sigmoid = io;
exports.rsqrt = ao;
exports.round = oo;
exports.reciprocal = ro;
exports.neg = no;
exports.logSigmoid = eo;
exports.log1p = to;
exports.log = Zr;
exports.floor = Jr;
exports.expm1 = Qr;
exports.exp = $r;
exports.erf = Yr;
exports.cosh = Xr;
exports.cos = jr;
exports.clipByValue = Kr;
exports.ceil = qr;
exports.atanh = Hr;
exports.atan = Gr;
exports.asinh = zr;
exports.asin = Vr;
exports.acosh = Ur;
exports.acos = Wr;
exports.abs = Lr;

var xo = An({
  addStrict_: function (t, e) {
    var n = gn(t, "a", "addStrict"),
        r = gn(e, "b", "addStrict");
    return E(n.shape, r.shape, "Error in addStrict: "), n.add(r);
  }
}),
    bo = An({
  atan2_: function (t, e) {
    var n,
        r = gn(t, "a", "atan2"),
        o = gn(e, "b", "atan2");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape);
    return Lt.runKernelFunc(function (t, e) {
      var n = t.atan2(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = Or(n.square(), r.square()),
              o = t.mul(r.div(e)),
              i = Br(n.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(n.shape);
        },
        $b: function () {
          var e = Or(n.square(), r.square()),
              o = no(t.mul(n.div(e))),
              i = Br(r.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(r.shape);
        }
      };
    });
  }
}),
    wo = An({
  divStrict_: function (t, e) {
    var n = gn(t, "a", "div"),
        r = gn(e, "b", "div");
    return E(n.shape, r.shape, "Error in divideStrict: "), n.div(r);
  }
}),
    Co = An({
  floorDiv_: function (t, e) {
    var n,
        r = gn(t, "a", "floorDiv"),
        o = gn(e, "b", "floorDiv");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape);
    return Lt.runKernelFunc(function (t, e) {
      var n = t.floorDiv(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        a: function () {
          var e = t.div(r.toFloat()),
              o = Br(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        b: function () {
          var e = t.mul(n.toFloat()),
              o = Br(r.shape, a);
          o.length > 0 && (e = e.sum(o).reshape(r.shape));
          var i = r.square();
          return e.div(i.toFloat()).neg();
        }
      };
    }, "FloorDiv");
  }
}),
    Eo = An({
  maximum_: function (t, e) {
    var n,
        r = gn(t, "a", "maximum"),
        o = gn(e, "b", "maximum");
    return n = Nt(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), Pr(r.shape, o.shape), Lt.runKernelFunc(function (t, e) {
      var n = t.maximum(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        a: function () {
          return t.mul(n.greaterEqual(r).toFloat());
        },
        b: function () {
          return t.mul(n.less(r).toFloat());
        }
      };
    }, "Maximum");
  }
}),
    Ro = An({
  maximumStrict_: function (t, e) {
    var n = gn(t, "a", "maximumStrict"),
        r = gn(e, "b", "maximumStrict");
    return E(n.shape, r.shape, "Error in maximumStrict: "), n.maximum(r);
  }
}),
    Io = An({
  minimum_: function (t, e) {
    var n,
        r = gn(t, "a", "minimum"),
        o = gn(e, "b", "minimum");
    return n = Nt(r, o), r = n[0], o = n[1], "bool" === r.dtype && (r = r.toInt(), o = o.toInt()), Pr(r.shape, o.shape), Lt.runKernelFunc(function (t, e) {
      var n = t.minimum(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        a: function () {
          return t.mul(n.lessEqual(r).toFloat());
        },
        b: function () {
          return t.mul(n.greater(r).toFloat());
        }
      };
    }, "Minimum");
  }
}),
    ko = An({
  minimumStrict_: function (t, e) {
    var n = gn(t, "a", "minimumStrict"),
        r = gn(e, "b", "minimumStrict");
    return E(n.shape, r.shape, "Error in minimumStrict: "), n.minimum(r);
  }
}),
    So = An({
  mod_: function (t, e) {
    var n,
        r = gn(t, "a", "mod"),
        o = gn(e, "b", "mod");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape);
    return Lt.runKernelFunc(function (t, e) {
      var n = t.mod(r, o);
      return e([r, o]), n;
    }, {
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        $a: function () {
          var e = Br(n.shape, a);
          return e.length > 0 ? t.sum(e).reshape(n.shape) : t;
        },
        $b: function () {
          var e = t.mul(n.div(r).floor().neg()),
              o = Br(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    });
  }
}),
    Ao = An({
  modStrict_: function (t, e) {
    var n = gn(t, "a", "modStrict"),
        r = gn(e, "b", "modStrict");
    return E(n.shape, r.shape, "Error in modStrict: "), n.mod(r);
  }
}),
    To = An({
  mul_: function (t, e) {
    var n,
        r = gn(t, "a", "mul"),
        o = gn(e, "b", "mul");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape);
    return Lt.runKernelFunc(function (t, e) {
      var n = t.multiply(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        a: function () {
          var e = t.mul(r.toFloat()),
              o = Br(n.shape, a);
          return o.length > 0 ? e.sum(o).reshape(n.shape) : e;
        },
        b: function () {
          var e = t.mul(n.toFloat()),
              o = Br(r.shape, a);
          return o.length > 0 ? e.sum(o).reshape(r.shape) : e;
        }
      };
    }, "Mul");
  }
}),
    Do = An({
  mulStrict_: function (t, e) {
    var n = gn(t, "a", "mul"),
        r = gn(e, "b", "mul");
    return E(n.shape, r.shape, "Error in multiplyStrict: "), n.mul(r);
  }
}),
    No = An({
  pow_: function (t, e) {
    var n,
        r = gn(t, "base", "pow"),
        o = gn(e, "exp", "pow");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape),
        i = [r, o];
    return Lt.runKernelFunc(function (t, e) {
      var n = t.pow(r, o);
      return e([r, o, n]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = e[2];
      return {
        a: function () {
          var e = r.toFloat(),
              o = t.mul(e.mul(n.pow(e.sub(On(1))))),
              i = Br(n.shape, a);
          return i.length > 0 && (o = o.sum(i)), o.reshape(n.shape);
        },
        b: function () {
          var e = n.greater(0),
              i = n.log().where(e, Xn(n)),
              s = t.mul(o.mul(i)),
              u = Br(r.shape, a);
          return u.length > 0 && (s = s.sum(u)), s.reshape(r.shape);
        }
      };
    }, "Pow", {}, i, [!0]);
  }
}),
    Fo = An({
  powStrict_: function (t, e) {
    return E(t.shape, e.shape, "Error in powStrict: "), t.pow(e);
  }
}),
    _o = An({
  squaredDifferenceStrict_: function (t, e) {
    var n = gn(t, "a", "squaredDifferenceStrict"),
        r = gn(e, "b", "squaredDifferenceStrict");
    return E(n.shape, r.shape, "Error in squaredDifferenceStrict: "), n.squaredDifference(r);
  }
}),
    Oo = An({
  sub_: function (t, e) {
    var n,
        r = gn(t, "a", "sub"),
        o = gn(e, "b", "sub");
    n = Nt(r, o), r = n[0], o = n[1];
    var a = Pr(r.shape, o.shape);
    return Lt.runKernelFunc(function (t) {
      return t.subtract(r, o);
    }, {
      a: r,
      b: o
    }, function (t) {
      return {
        a: function () {
          var e = t,
              n = Br(r.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
        },
        b: function () {
          var e = t,
              n = Br(o.shape, a);
          return n.length > 0 && (e = e.sum(n)), e.neg().reshape(o.shape);
        }
      };
    }, "Sub");
  }
}),
    Mo = An({
  subStrict_: function (t, e) {
    var n = gn(t, "a", "subStrict"),
        r = gn(e, "b", "subStrict");
    return E(n.shape, r.shape, "Error in subStrict: "), n.sub(r);
  }
});

exports.subStrict = Mo;
exports.sub = Oo;
exports.squaredDifferenceStrict = _o;
exports.powStrict = Fo;
exports.pow = No;
exports.mulStrict = Do;
exports.mul = To;
exports.modStrict = Ao;
exports.mod = So;
exports.minimumStrict = ko;
exports.minimum = Io;
exports.maximumStrict = Ro;
exports.maximum = Eo;
exports.floorDiv = Co;
exports.divStrict = wo;
exports.atan2 = bo;
exports.addStrict = xo;
var Bo = An({
  div_: function (t, e) {
    var n,
        r = gn(t, "a", "div"),
        o = gn(e, "b", "div");
    if (n = Nt(r, o), r = n[0], o = n[1], "int32" === r.dtype && "int32" === o.dtype) return Co(r, o);
    var a = {
      a: r,
      b: o
    };
    return Lt.runKernelFunc(function (t, e) {
      var n = t.realDivide(r, o);
      return e([r, o]), n;
    }, a, null, wr, {});
  }
});
exports.div = Bo;

function Po(t, e) {
  if (t.rank < 1) throw new Error("tf.gatherND() expects the input to be rank 1 or higher, but the rank was " + t.rank + ".");
  if (e.rank < 1) throw new Error("tf.gatherND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if ("int32" !== e.dtype) throw new Error("tf.gatherND() expects the indices to be int32 type, but the dtype was " + e.dtype + ".");
  if (e.shape[e.rank - 1] > t.rank) throw new Error("index innermost dimension length must be <= tensor rank; saw: " + e.shape[e.rank - 1] + " vs. " + t.rank);
  if (0 === t.size) throw new Error("Requested more than 0 entries, but input is empty. Input shape: " + t.shape + ".");

  for (var n = e.shape, r = n[n.length - 1], o = 1, a = 0; a < n.length - 1; ++a) o *= n[a];

  var i = t.shape,
      s = n.slice();
  s.pop();
  var u = 1;

  for (a = r; a < t.rank; ++a) u *= i[a], s.push(i[a]);

  var c = $(t.shape).map(function (t) {
    return t / u;
  }).concat([1]).slice(0, r);
  return [s, o, u, c];
}

var Lo = Object.freeze({
  prepareAndValidate: Po
}),
    Wo = 30;
exports.gather_util = Lo;

function Uo(t) {
  return t <= Wo ? t : Y(t, Math.floor(Math.sqrt(t)));
}

function Vo(t, e, n) {
  var r = e.rank > 1 ? e.shape[e.rank - 1] : 1,
      o = e.rank > 1 ? e.rank - 1 : 1,
      a = "Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: " + n.shape + ", indices.shape: " + e.shape + ", shape: " + t + ", sliceDim: " + r + ", and batchDim: " + o + ".";
  if (n.rank < o) throw new Error(a + " update.rank < " + o + ". ");
  if (t.length < r + (n.rank - o)) throw new Error(a + " Output shape length < " + (r + (n.rank - o)));
  if (n.rank !== o + t.length - r) throw new Error(a + " update.rank != " + (o + t.length - r));

  for (var i = 0; i < o; ++i) if (n.shape[i] !== e.shape[i]) throw new Error(a + " updates.shape[" + i + "] (" + n.shape[i] + ") != indices.shape[" + i + "] (" + e.shape[i] + ").");

  for (i = 0; i < n.rank - o; ++i) if (n.shape[i + o] !== t[i + r]) throw new Error(a + " updates.shape[" + (i + o) + "] (" + n.shape[i + o] + ") != shape[" + (i + o) + "] (" + t[i + o] + ")");
}

function zo(t, e, n) {
  if (e.rank < 1) throw new Error("tf.scatterND() expects the indices to be rank 1 or higher, but the rank was " + e.rank + ".");
  if (t.rank < 1) throw new Error("tf.scatterND() expects the updates to be rank 1 or higher, but the rank was " + t.rank + ".");
  if ("int32" !== e.dtype) throw new Error("The dtype of 'indices' should be int32, but got dtype: " + e.dtype);
  if (n.length < 1) throw new Error("Output rank must be greater or equal to 1, but got shape: " + n);

  if (0 === n.length) {
    if (0 === e.size) throw new Error("Indices specified for empty output. indices shape: " + e.shape);
    if (0 === t.size) throw new Error("Updates specified for empty output. updates shape: " + t.shape);
  }

  Vo(n, e, t);
}

function Go(t, e, n) {
  for (var r = e.shape.length, o = r > 1 ? e.shape[r - 1] : 1, a = n.length, i = 1, s = o; s < a; ++s) i *= n[s];

  var u = o < 1 ? 1 : o;
  return {
    sliceRank: o,
    numUpdates: k(e.shape) / u,
    sliceSize: i,
    strides: $(n.slice(0, o)).concat([1]),
    outputSize: k(n)
  };
}

var Ho = Object.freeze({
  validateUpdateShape: Vo,
  validateInput: zo,
  calculateShapes: Go
});
exports.scatter_util = Ho;

function qo(t, e, n) {
  C(t.rank === e.length, function () {
    return "Error in slice" + t.rank + "D: Length of begin " + e + " must match the rank of the array (" + t.rank + ").";
  }), C(t.rank === n.length, function () {
    return "Error in slice" + t.rank + "D: Length of size " + n + " must match the rank of the array (" + t.rank + ").";
  });

  for (var r = function (r) {
    C(e[r] + n[r] <= t.shape[r], function () {
      return "Error in slice" + t.rank + "D: begin[" + r + "] + size[" + r + "] (" + (e[r] + n[r]) + ") would overflow input.shape[" + r + "] (" + t.shape[r] + ")";
    });
  }, o = 0; o < t.rank; ++o) r(o);
}

function Ko(t) {
  for (var e = [], n = 0; t > 0;) 1 & t && e.push(n), t /= 2, n++;

  return e;
}

function jo(t, e, n) {
  for (var r = [], o = 0; o < t.length; o++) r[o] = Math.ceil((e[o] - t[o]) / n[o]);

  return r;
}

function Xo(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = x(0, a, s - 1);
}

function Yo(t, e, n, r, o) {
  var a = e[o],
      i = n[o] || 1;
  (t & 1 << o || null == a) && (a = i > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER);
  var s = r[o];
  return a < 0 && (a += s), a = i > 0 ? x(0, a, s) : x(-1, a, s - 1);
}

function $o(t, e, n) {
  for (var r = n.length, o = 0; o < n.length; o++) if (n[o] > 1) {
    r = o;
    break;
  }

  for (o = r + 1; o < n.length; o++) if (e[o] > 0 || n[o] !== t[o]) return !1;

  return !0;
}

function Qo(t, e) {
  for (var n = t.length > 0 ? t[t.length - 1] : 1, r = 0; r < t.length - 1; r++) n += t[r] * e[r];

  return n;
}

var Jo = Object.freeze({
  assertParamsValid: qo,
  maskToAxes: Ko,
  computeOutShape: jo,
  startForAxis: Xo,
  stopForAxis: Yo,
  isSliceContinous: $o,
  computeFlatOffset: Qo
});
exports.slice_util = Jo;

function Zo(t) {
  return C(X(t), function () {
    return "The f passed in grad(f) must be a function";
  }), function (e, n) {
    var r = gn(e, "x", "tf.grad", null),
        o = null != n ? gn(n, "dy", "tf.grad") : null;
    return Lt.tidy(function () {
      var e = Lt.gradients(function () {
        return t(r);
      }, [r], o),
          n = e.value,
          a = e.grads;
      return null != o && E(n.shape, o.shape, "The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"), aa(a), a[0];
    });
  };
}

function ta(t) {
  return C(X(t), function () {
    return "The f passed in grads(f) must be a function";
  }), function (e, n) {
    C(Array.isArray(e), function () {
      return "The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s";
    });
    var r = mn(e, "args", "tf.grads", null),
        o = null != n ? gn(n, "dy", "tf.grads") : null;
    return Lt.tidy(function () {
      var e = Lt.gradients(function () {
        return t.apply(void 0, r);
      }, r, o),
          n = e.value,
          a = e.grads;
      return null != o && E(n.shape, o.shape, "The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), aa(a), a;
    });
  };
}

function ea(t) {
  return C(X(t), function () {
    return "The f passed in valueAndGrad(f) must be a function";
  }), function (e, n) {
    C(e instanceof wt, function () {
      return "The x passed in valueAndGrad(f)(x) must be a tensor";
    }), C(null == n || n instanceof wt, function () {
      return "The dy passed in valueAndGrad(f)(x, dy) must be a tensor";
    });
    var r = Lt.gradients(function () {
      return t(e);
    }, [e], n),
        o = r.grads,
        a = r.value;
    return aa(o), {
      grad: o[0],
      value: a
    };
  };
}

function na(t) {
  return C(X(t), function () {
    return "The f passed in valueAndGrads(f) must be a function";
  }), function (e, n) {
    C(Array.isArray(e) && e.every(function (t) {
      return t instanceof wt;
    }), function () {
      return "The args passed in valueAndGrads(f)(args) must be array of tensors";
    }), C(null == n || n instanceof wt, function () {
      return "The dy passed in valueAndGrads(f)(args, dy) must be a tensor";
    });
    var r = Lt.gradients(function () {
      return t.apply(void 0, e);
    }, e, n);
    return null != n && E(r.value.shape, n.shape, "The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"), aa(r.grads), r;
  };
}

function ra(t, e) {
  C(X(t), function () {
    return "The f passed in variableGrads(f) must be a function";
  }), C(null == e || Array.isArray(e) && e.every(function (t) {
    return t instanceof St;
  }), function () {
    return "The varList passed in variableGrads(f, varList) must be an array of variables";
  });
  var n = null != e;
  if (!n) for (var r in e = [], Lt.registeredVariables) e.push(Lt.registeredVariables[r]);
  var o = n ? e.filter(function (t) {
    return !t.trainable;
  }) : null,
      a = e.length;
  C((e = e.filter(function (t) {
    return t.trainable;
  })).length > 0, function () {
    return "variableGrads() expects at least one of the input variables to be trainable, but none of the " + a + " variables is trainable.";
  });
  var i = Lt.gradients(t, e, null, !0),
      s = i.value,
      u = i.grads;
  C(u.some(function (t) {
    return null != t;
  }), function () {
    return "Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize().";
  }), C(0 === s.rank, function () {
    return "The f passed in variableGrads(f) must return a scalar, but it returned a rank-" + s.rank + " tensor";
  });
  var c = {};
  return e.forEach(function (t, e) {
    null != u[e] && (c[t.name] = u[e]);
  }), null != o && o.forEach(function (t) {
    return c[t.name] = null;
  }), {
    value: s,
    grads: c
  };
}

function oa(t) {
  return Lt.customGrad(t);
}

function aa(t) {
  if (t.filter(function (t) {
    return null == t;
  }).length > 0) throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that\n    the f you passed encloses all operations that lead from x to y.");
}

var ia = An({
  softmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = gn(t, "logits", "softmax", "float32");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and dim was " + e);
    return Lt.runKernelFunc(function (t, r) {
      var o = t.softmax(n, e);
      return r([o]), o;
    }, {
      logits: n
    }, function (t, n) {
      var r = n[0],
          o = t.mul(r);
      return {
        logits: function () {
          return o.sub(o.sum([e], !0).mul(r));
        }
      };
    }, "Softmax", {
      dim: e
    }, [], [!0]);
  }
}),
    sa = An({
  logSoftmax_: function (t, e) {
    void 0 === e && (e = -1);
    var n = gn(t, "logits", "logSoftmax");
    if (-1 === e && (e = n.rank - 1), e !== n.rank - 1) throw Error("Log Softmax along a non-last dimension is not yet supported. Logits was rank " + n.rank + " and axis was " + e);
    return oa(function (t, n) {
      var r = t.max(e, !0),
          o = t.sub(r),
          a = o.toFloat().sub(o.exp().sum(e, !0).log());
      n([a]);
      return {
        value: a,
        gradFunc: function (t, n) {
          var r = n[0].exp();
          return t.sub(t.sum(e, !0).mul(r));
        }
      };
    })(n);
  }
});
exports.logSoftmax = sa;
exports.softmax = ia;

var ua = An({
  transpose_: function (t, e) {
    var n = gn(t, "x", "transpose");
    if (null == e && (e = n.shape.map(function (t, e) {
      return e;
    }).reverse()), C(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of perm " + e + ".";
    }), e.forEach(function (t) {
      C(t >= 0 && t < n.rank, function () {
        return "All entries in 'perm' must be between 0 and " + (n.rank - 1) + " but got " + e;
      });
    }), n.rank <= 1) return n.clone();
    var r = {
      perm: e
    };
    return Lt.runKernelFunc(function (t) {
      return t.transpose(n, e);
    }, {
      x: n
    }, null, "Transpose", r);
  }
}),
    ca = function () {
  function t(t, e) {
    this.backend = t, this.dataMover = e, this.data = new WeakMap(), this.dataIdsCount = 0;
  }

  return t.prototype.get = function (t) {
    return this.data.has(t) || this.dataMover.moveData(this.backend, t), this.data.get(t);
  }, t.prototype.set = function (t, e) {
    this.dataIdsCount++, this.data.set(t, e);
  }, t.prototype.has = function (t) {
    return this.data.has(t);
  }, t.prototype.delete = function (t) {
    return this.dataIdsCount--, this.data.delete(t);
  }, t.prototype.numDataIds = function () {
    return this.dataIdsCount;
  }, t;
}(),
    la = function () {
  function t() {}

  return t.prototype.time = function (t) {
    return ha("time");
  }, t.prototype.read = function (t) {
    return ha("read");
  }, t.prototype.readSync = function (t) {
    return ha("readSync");
  }, t.prototype.numDataIds = function () {
    return ha("numDataIds");
  }, t.prototype.disposeData = function (t) {
    return ha("disposeData");
  }, t.prototype.write = function (t, e, n) {
    return ha("write");
  }, t.prototype.move = function (t, e, n, r) {
    return ha("move");
  }, t.prototype.memory = function () {
    return ha("memory");
  }, t.prototype.floatPrecision = function () {
    return ha("floatPrecision");
  }, t.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, t.prototype.batchMatMul = function (t, e, n, r) {
    return ha("batchMatMul");
  }, t.prototype.fusedBatchMatMul = function (t) {
    t.a, t.b, t.transposeA, t.transposeB, t.bias, t.activation, t.preluActivationWeights;
    return ha("fusedBatchMatMul");
  }, t.prototype.slice = function (t, e, n) {
    return ha("slice");
  }, t.prototype.stridedSlice = function (t, e, n, r) {
    return ha("stridedSlice");
  }, t.prototype.unstack = function (t, e) {
    return ha("unstack");
  }, t.prototype.reverse = function (t, e) {
    return ha("reverse");
  }, t.prototype.concat = function (t, e) {
    return ha("concat");
  }, t.prototype.neg = function (t) {
    return ha("neg");
  }, t.prototype.add = function (t, e) {
    return ha("add");
  }, t.prototype.addN = function (t) {
    return ha("addN");
  }, t.prototype.subtract = function (t, e) {
    return ha("subtract");
  }, t.prototype.multiply = function (t, e) {
    return ha("multiply");
  }, t.prototype.realDivide = function (t, e) {
    return ha("realDivide");
  }, t.prototype.floorDiv = function (t, e) {
    return ha("floorDiv");
  }, t.prototype.sum = function (t, e) {
    return ha("sum");
  }, t.prototype.prod = function (t, e) {
    return ha("prod");
  }, t.prototype.unsortedSegmentSum = function (t, e, n) {
    return ha("unsortedSegmentSum");
  }, t.prototype.argMin = function (t, e) {
    return ha("argMin");
  }, t.prototype.argMax = function (t, e) {
    return ha("argMax");
  }, t.prototype.equal = function (t, e) {
    return ha("equal");
  }, t.prototype.notEqual = function (t, e) {
    return ha("notEqual");
  }, t.prototype.less = function (t, e) {
    return ha("less");
  }, t.prototype.lessEqual = function (t, e) {
    return ha("lessEqual");
  }, t.prototype.greater = function (t, e) {
    return ha("greater");
  }, t.prototype.greaterEqual = function (t, e) {
    return ha("greaterEqual");
  }, t.prototype.logicalNot = function (t) {
    return ha("logicalNot");
  }, t.prototype.logicalAnd = function (t, e) {
    return ha("logicalAnd");
  }, t.prototype.logicalOr = function (t, e) {
    return ha("logicalOr");
  }, t.prototype.where = function (t) {
    return ha("where");
  }, t.prototype.select = function (t, e, n) {
    return ha("select");
  }, t.prototype.topk = function (t, e, n) {
    return ha("topk");
  }, t.prototype.min = function (t, e) {
    return ha("min");
  }, t.prototype.minimum = function (t, e) {
    return ha("minimum");
  }, t.prototype.mod = function (t, e) {
    return ha("mod");
  }, t.prototype.max = function (t, e) {
    return ha("max");
  }, t.prototype.maximum = function (t, e) {
    return ha("maximum");
  }, t.prototype.all = function (t, e) {
    return ha("all");
  }, t.prototype.any = function (t, e) {
    return ha("any");
  }, t.prototype.squaredDifference = function (t, e) {
    return ha("squaredDifference");
  }, t.prototype.ceil = function (t) {
    return ha("ceil");
  }, t.prototype.floor = function (t) {
    return ha("floor");
  }, t.prototype.round = function (t) {
    return ha("round");
  }, t.prototype.sign = function (t) {
    return ha("sign");
  }, t.prototype.isNaN = function (t) {
    return ha("isNaN");
  }, t.prototype.isInf = function (t) {
    return ha("isInf");
  }, t.prototype.isFinite = function (t) {
    return ha("isFinite");
  }, t.prototype.pow = function (t, e) {
    return ha("pow");
  }, t.prototype.exp = function (t) {
    return ha("exp");
  }, t.prototype.expm1 = function (t) {
    return ha("expm1");
  }, t.prototype.softmax = function (t, e) {
    return ha("softmax");
  }, t.prototype.log = function (t) {
    return ha("log");
  }, t.prototype.log1p = function (t) {
    return ha("log1p");
  }, t.prototype.sqrt = function (t) {
    return ha("sqrt");
  }, t.prototype.rsqrt = function (t) {
    return ha("rsqrt");
  }, t.prototype.square = function (t) {
    return ha("square");
  }, t.prototype.reciprocal = function (t) {
    return ha("reciprocal");
  }, t.prototype.relu = function (t) {
    return ha("relu");
  }, t.prototype.relu6 = function (t) {
    return ha("relu6");
  }, t.prototype.prelu = function (t, e) {
    return ha("prelu");
  }, t.prototype.elu = function (t) {
    return ha("elu");
  }, t.prototype.eluDer = function (t, e) {
    return ha("eluDer");
  }, t.prototype.selu = function (t) {
    return ha("selu");
  }, t.prototype.int = function (t) {
    return ha("int");
  }, t.prototype.clip = function (t, e, n) {
    return ha("clip");
  }, t.prototype.abs = function (t) {
    return ha("abs");
  }, t.prototype.complexAbs = function (t) {
    return ha("complexAbs");
  }, t.prototype.sigmoid = function (t) {
    return ha("sigmoid");
  }, t.prototype.softplus = function (t) {
    return ha("softplus");
  }, t.prototype.sin = function (t) {
    return ha("sin");
  }, t.prototype.cos = function (t) {
    return ha("cos");
  }, t.prototype.tan = function (t) {
    return ha("tan");
  }, t.prototype.asin = function (t) {
    return ha("asin");
  }, t.prototype.acos = function (t) {
    return ha("acos");
  }, t.prototype.atan = function (t) {
    return ha("atan");
  }, t.prototype.atan2 = function (t, e) {
    return ha("atan2");
  }, t.prototype.sinh = function (t) {
    return ha("sinh");
  }, t.prototype.cosh = function (t) {
    return ha("cosh");
  }, t.prototype.tanh = function (t) {
    return ha("tanh");
  }, t.prototype.asinh = function (t) {
    return ha("asinh");
  }, t.prototype.acosh = function (t) {
    return ha("acosh");
  }, t.prototype.atanh = function (t) {
    return ha("atanh");
  }, t.prototype.erf = function (t) {
    return ha("erf");
  }, t.prototype.step = function (t, e) {
    return ha("step");
  }, t.prototype.fusedConv2d = function (t) {
    t.input, t.filter, t.convInfo, t.bias, t.activation, t.preluActivationWeights;
    return ha("fusedConv2d");
  }, t.prototype.conv2d = function (t, e, n) {
    return ha("conv2d");
  }, t.prototype.conv2dDerInput = function (t, e, n) {
    return ha("conv2dDerInput");
  }, t.prototype.conv2dDerFilter = function (t, e, n) {
    return ha("conv2dDerFilter");
  }, t.prototype.fusedDepthwiseConv2D = function (t) {
    t.input, t.filter, t.convInfo, t.bias, t.activation, t.preluActivationWeights;
    return ha("fusedDepthwiseConv2D");
  }, t.prototype.depthwiseConv2D = function (t, e, n) {
    return ha("depthwiseConv2D");
  }, t.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    return ha("depthwiseConv2DDerInput");
  }, t.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    return ha("depthwiseConv2DDerFilter");
  }, t.prototype.conv3d = function (t, e, n) {
    return ha("conv3d");
  }, t.prototype.conv3dDerInput = function (t, e, n) {
    return ha("conv3dDerInput");
  }, t.prototype.conv3dDerFilter = function (t, e, n) {
    return ha("conv3dDerFilter");
  }, t.prototype.maxPool = function (t, e) {
    return ha("maxPool");
  }, t.prototype.maxPoolBackprop = function (t, e, n, r) {
    return ha("maxPoolBackprop");
  }, t.prototype.avgPool = function (t, e) {
    return ha("avgPool");
  }, t.prototype.avgPoolBackprop = function (t, e, n) {
    return ha("avgPoolBackprop");
  }, t.prototype.avgPool3d = function (t, e) {
    return ha("avgPool3d");
  }, t.prototype.avgPool3dBackprop = function (t, e, n) {
    return ha("avgPool3dBackprop");
  }, t.prototype.maxPool3d = function (t, e) {
    return ha("maxPool3d");
  }, t.prototype.maxPool3dBackprop = function (t, e, n, r) {
    return ha("maxPool3dBackprop");
  }, t.prototype.reshape = function (t, e) {
    return ha("reshape");
  }, t.prototype.cast = function (t, e) {
    return ha("cast");
  }, t.prototype.tile = function (t, e) {
    return ha("tile");
  }, t.prototype.pad = function (t, e, n) {
    return ha("pad");
  }, t.prototype.transpose = function (t, e) {
    return ha("transpose");
  }, t.prototype.gather = function (t, e, n) {
    return ha("gather");
  }, t.prototype.gatherND = function (t, e) {
    return ha("gatherND");
  }, t.prototype.scatterND = function (t, e, n) {
    return ha("scatterND");
  }, t.prototype.batchToSpaceND = function (t, e, n) {
    return ha("batchToSpaceND");
  }, t.prototype.spaceToBatchND = function (t, e, n) {
    return ha("spaceToBatchND");
  }, t.prototype.resizeBilinear = function (t, e, n, r) {
    return ha("resizeBilinear");
  }, t.prototype.resizeBilinearBackprop = function (t, e, n) {
    return ha("resizeBilinearBackprop");
  }, t.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    return ha("resizeNearestNeighbor");
  }, t.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    return ha("resizeNearestNeighborBackprop");
  }, t.prototype.batchNormalization = function (t, e, n, r, o, a) {
    return ha("batchNormalization");
  }, t.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    return ha("localResponseNormalization4D");
  }, t.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    return ha("LRNGrad");
  }, t.prototype.multinomial = function (t, e, n, r) {
    return ha("multinomial");
  }, t.prototype.oneHot = function (t, e, n, r) {
    return ha("oneHot");
  }, t.prototype.cumsum = function (t, e, n, r) {
    return ha("cumsum");
  }, t.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return ha("nonMaxSuppression");
  }, t.prototype.fft = function (t) {
    return ha("fft");
  }, t.prototype.ifft = function (t) {
    return ha("ifft");
  }, t.prototype.complex = function (t, e) {
    return ha("complex");
  }, t.prototype.real = function (t) {
    return ha("real");
  }, t.prototype.imag = function (t) {
    return ha("imag");
  }, t.prototype.cropAndResize = function (t, e, n, r, o, a) {
    return ha("cropAndResize");
  }, t.prototype.depthToSpace = function (t, e, n) {
    return ha("depthToSpace");
  }, t.prototype.split = function (t, e, n) {
    return ha("split");
  }, t.prototype.sparseToDense = function (t, e, n, r) {
    return ha("sparseToDense");
  }, t.prototype.diag = function (t) {
    return ha("diag");
  }, t.prototype.fill = function (t, e, n) {
    return ha("fill");
  }, t.prototype.onesLike = function (t) {
    return ha("onesLike");
  }, t.prototype.zerosLike = function (t) {
    return ha("zerosLike");
  }, t.prototype.linspace = function (t, e, n) {
    return ha("linspace");
  }, t.prototype.dispose = function () {
    return ha("dispose");
  }, t;
}();

exports.KernelBackend = la;
exports.DataStorage = ca;
exports.transpose = ua;

function ha(t) {
  throw new Error("'" + t + "' not yet implemented or not found in the registry. Did you forget to import the kernel?");
}

function fa(t, e, n, r, o, a, i) {
  void 0 === i && (i = "channelsLast");
  var s,
      u = ma(e),
      c = u[0],
      l = u[1];
  if ("channelsLast" === i) s = [c, l, t[3], t[3]];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    s = [c, l, t[1], t[1]];
  }
  return pa(t, s, n, r, o, a, !1, i);
}

function da(t, e, n, r, o, a, i) {
  void 0 === i && (i = "NDHWC");
  var s,
      u,
      c = ya(e),
      l = c[0],
      h = c[1],
      f = c[2];
  if ("NDHWC" === i) u = "channelsLast", s = [l, h, f, t[4], t[4]];else {
    if ("NCDHW" !== i) throw new Error("Unknown dataFormat " + i);
    u = "channelsFirst", s = [l, h, f, t[1], t[1]];
  }
  return va(t, s, n, r, o, !1, u, a);
}

function pa(t, e, n, r, o, a, i, s) {
  void 0 === i && (i = !1), void 0 === s && (s = "channelsLast");
  var u = [-1, -1, -1, -1],
      c = u[0],
      l = u[1],
      h = u[2],
      f = u[3];
  if ("channelsLast" === s) c = t[0], l = t[1], h = t[2], f = t[3];else {
    if ("channelsFirst" !== s) throw new Error("Unknown dataFormat " + s);
    c = t[0], f = t[1], l = t[2], h = t[3];
  }

  var d,
      p = e[0],
      v = e[1],
      g = e[3],
      m = ma(n),
      y = m[0],
      x = m[1],
      b = ma(r),
      w = b[0],
      E = b[1],
      R = xa(p, w),
      I = xa(v, E),
      k = function (t, e, n, r, o, a, i, s) {
    var u, c, l;

    if ("number" == typeof t) {
      u = {
        top: t,
        bottom: t,
        left: t,
        right: t,
        type: 0 === t ? "VALID" : "NUMBER"
      };

      var h = function (t, e, n, r, o) {
        null == r && (r = ga(t, e, n));
        var a = t[0],
            i = t[1],
            s = ba((a - e + 2 * r) / n + 1, o);
        C(A(s), function () {
          return "The output # of rows (" + s + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var u = ba((i - e + 2 * r) / n + 1, o);
        return C(A(u), function () {
          return "The output # of columns (" + u + ") must be an integer. Change the stride and/or zero pad parameters";
        }), [s, u];
      }([e, n], a, r, t, s);

      c = h[0], l = h[1];
    } else if ("same" === t) {
      c = Math.ceil(e / r), l = Math.ceil(n / o);
      var f = Math.max(0, (c - 1) * r + a - e),
          d = Math.max(0, (l - 1) * o + i - n),
          p = Math.floor(f / 2),
          v = f - p,
          g = Math.floor(d / 2);
      u = {
        top: p,
        bottom: v,
        left: g,
        right: d - g,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      u = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        type: "VALID"
      }, c = Math.ceil((e - a + 1) / r), l = Math.ceil((n - i + 1) / o);
    }

    return {
      padInfo: u,
      outHeight: c,
      outWidth: l
    };
  }(o, l, h, y, x, R, I, a),
      S = k.padInfo,
      T = k.outHeight,
      D = k.outWidth,
      N = i ? g * f : g;

  return "channelsFirst" === s ? d = [c, N, T, D] : "channelsLast" === s && (d = [c, T, D, N]), {
    batchSize: c,
    dataFormat: s,
    inHeight: l,
    inWidth: h,
    inChannels: f,
    outHeight: T,
    outWidth: D,
    outChannels: N,
    padInfo: S,
    strideHeight: y,
    strideWidth: x,
    filterHeight: p,
    filterWidth: v,
    effectiveFilterHeight: R,
    effectiveFilterWidth: I,
    dilationHeight: w,
    dilationWidth: E,
    inShape: t,
    outShape: d,
    filterShape: e
  };
}

function va(t, e, n, r, o, a, i, s) {
  void 0 === a && (a = !1), void 0 === i && (i = "channelsLast");
  var u = [-1, -1, -1, -1, -1],
      c = u[0],
      l = u[1],
      h = u[2],
      f = u[3],
      d = u[4];
  if ("channelsLast" === i) c = t[0], l = t[1], h = t[2], f = t[3], d = t[4];else {
    if ("channelsFirst" !== i) throw new Error("Unknown dataFormat " + i);
    c = t[0], d = t[1], l = t[2], h = t[3], f = t[4];
  }

  var p,
      v = e[0],
      g = e[1],
      m = e[2],
      y = e[4],
      x = ya(n),
      b = x[0],
      w = x[1],
      E = x[2],
      R = ya(r),
      I = R[0],
      k = R[1],
      S = R[2],
      T = xa(v, I),
      D = xa(g, k),
      N = xa(m, S),
      F = function (t, e, n, r, o, a, i, s, u, c, l) {
    var h, f, d, p;

    if ("number" == typeof t) {
      h = {
        top: t,
        bottom: t,
        left: t,
        right: t,
        front: t,
        back: t,
        type: 0 === t ? "VALID" : "NUMBER"
      };

      var v = function (t, e, n, r, o, a) {
        null == o && (o = ga(t, e, r));
        var i = t[0],
            s = t[1],
            u = t[2],
            c = ba((i - e + 2 * o) / r + 1, a);
        C(A(c), function () {
          return "The output # of depths (" + c + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var l = ba((s - e + 2 * o) / r + 1, a);
        C(A(l), function () {
          return "The output # of rows (" + l + ") must be an integer. Change the stride and/or zero pad parameters";
        });
        var h = ba((u - e + 2 * o) / r + 1, a);
        return C(A(h), function () {
          return "The output # of columns (" + h + ") must be an integer. Change the stride and/or zero pad parameters";
        }), [c, l, h, n];
      }([e, n, r, 1], s, 1, o, t, l);

      f = v[0], d = v[1], p = v[2];
    } else if ("same" === t) {
      f = Math.ceil(e / o), d = Math.ceil(n / a), p = Math.ceil(r / i);
      var g = (f - 1) * o + s - e,
          m = (d - 1) * a + u - n,
          y = (p - 1) * i + c - r,
          x = Math.floor(g / 2),
          b = g - x,
          w = Math.floor(m / 2),
          E = m - w,
          R = Math.floor(y / 2);
      h = {
        top: w,
        bottom: E,
        left: R,
        right: y - R,
        front: x,
        back: b,
        type: "SAME"
      };
    } else {
      if ("valid" !== t) throw Error("Unknown padding parameter: " + t);
      h = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        front: 0,
        back: 0,
        type: "VALID"
      }, f = Math.ceil((e - s + 1) / o), d = Math.ceil((n - u + 1) / a), p = Math.ceil((r - c + 1) / i);
    }

    return {
      padInfo: h,
      outDepth: f,
      outHeight: d,
      outWidth: p
    };
  }(o, l, h, f, b, w, E, T, D, N, s),
      _ = F.padInfo,
      O = F.outDepth,
      M = F.outHeight,
      B = F.outWidth,
      P = a ? y * d : y;

  return "channelsFirst" === i ? p = [c, P, O, M, B] : "channelsLast" === i && (p = [c, O, M, B, P]), {
    batchSize: c,
    dataFormat: i,
    inDepth: l,
    inHeight: h,
    inWidth: f,
    inChannels: d,
    outDepth: O,
    outHeight: M,
    outWidth: B,
    outChannels: P,
    padInfo: _,
    strideDepth: b,
    strideHeight: w,
    strideWidth: E,
    filterDepth: v,
    filterHeight: g,
    filterWidth: m,
    effectiveFilterDepth: T,
    effectiveFilterHeight: D,
    effectiveFilterWidth: N,
    dilationDepth: I,
    dilationHeight: k,
    dilationWidth: S,
    inShape: t,
    outShape: p,
    filterShape: e
  };
}

function ga(t, e, n, r) {
  void 0 === r && (r = 1);
  var o = xa(e, r);
  return Math.floor((t[0] * (n - 1) - n + o) / 2);
}

function ma(t) {
  return "number" == typeof t ? [t, t, t] : 2 === t.length ? [t[0], t[1], 1] : t;
}

function ya(t) {
  return "number" == typeof t ? [t, t, t] : t;
}

function xa(t, e) {
  return e <= 1 ? t : t + (t - 1) * (e - 1);
}

function ba(t, e) {
  if (!e) return t;

  switch (e) {
    case "round":
      return Math.round(t);

    case "ceil":
      return Math.ceil(t);

    case "floor":
      return Math.floor(t);

    default:
      throw new Error("Unknown roundingMode " + e);
  }
}

function wa(t) {
  var e = ma(t),
      n = e[0],
      r = e[1],
      o = e[2];
  return 1 === n && 1 === r && 1 === o;
}

function Ca(t, e) {
  return wa(t) || wa(e);
}

function Ea(t) {
  if ("NHWC" === t) return "channelsLast";
  if ("NCHW" === t) return "channelsFirst";
  throw new Error("Unknown dataFormat " + t);
}

function Ra(t, e, n) {
  if ("complex64" === e) {
    if ("complex64" === t.dtype) return t.clone();
    var r = Gn(t.shape),
        o = t.toFloat(),
        a = n.complex(o, r);
    return r.dispose(), o.dispose(), a;
  }

  if (!U(t.dtype, e)) return Lt.makeTensorFromDataId(t.dataId, t.shape, e);

  if ("complex64" === t.dtype) {
    var i = n.real(t);
    a = i.cast(e);
    return i.dispose(), a;
  }

  if ("int32" === e) return n.int(t);

  if ("bool" === e) {
    var s = On(0, t.dtype);
    a = n.notEqual(t, s);
    return s.dispose(), a;
  }

  throw new Error("Error in Cast: failed to cast " + t.dtype + " to " + e);
}

function Ia(t, e) {
  return Lt.makeTensorFromDataId(t.dataId, e, t.dtype);
}

function ka(t, e, n) {
  var r = (e - t) / (n - 1),
      o = tt(n, "float32");
  o[0] = t;

  for (var a = 1; a < o.length; a++) o[a] = o[a - 1] + r;

  return Mn(o, "float32");
}

var Sa = Object.freeze({
  castTensor: Ra,
  reshapeTensor: Ia,
  linspaceImpl: ka,
  upcastType: Tt,
  axesAreInnerMostDims: yn,
  combineLocations: xn,
  computeOutAndReduceShapes: bn,
  expandShapeToKeepDim: wn,
  assertAxesAreInnerMostDims: Cn,
  getAxesPermutation: En,
  getUndoAxesPermutation: Rn,
  getInnerMostAxes: In,
  getBroadcastDims: Mr,
  getReductionAxes: Br,
  assertAndGetBroadcastShape: Pr,
  assertParamsConsistent: kn,
  computeOutShape: Sn,
  computePool2DInfo: fa,
  computePool3DInfo: da,
  computeConv2DInfo: pa,
  computeConv3DInfo: va,
  computeDefaultPad: ga,
  tupleValuesAreOne: wa,
  eitherStridesOrDilationsAreOne: Ca,
  convertConv2DDataFormat: Ea,
  PARALLELIZE_THRESHOLD: Wo,
  computeOptimalWindowSize: Uo
});
exports.backend_util = Sa;

function Aa(t, e) {
  if (t.length !== e.length) throw new Error("Cannot merge real and imag arrays of different lengths. real:" + t.length + ", imag: " + e.length + ".");

  for (var n = new Float32Array(2 * t.length), r = 0; r < n.length; r += 2) n[r] = t[r / 2], n[r + 1] = e[r / 2];

  return n;
}

function Ta(t, e) {
  return {
    real: t[2 * e],
    imag: t[2 * e + 1]
  };
}

function Da(t, e, n, r) {
  t[2 * r] = e, t[2 * r + 1] = n;
}

function Na(t, e, n) {
  var r = (n ? 2 : -2) * Math.PI * (t / e);
  return {
    real: Math.cos(r),
    imag: Math.sin(r)
  };
}

function Fa(t, e, n) {
  var r = function (t, e, n) {
    return function (t, e, n) {
      var r = 0,
          o = t.length,
          a = 0,
          i = !1;

      for (; r < o;) {
        var s = n(e, t[a = r + (o - r >>> 1)]);
        s > 0 ? r = a + 1 : (o = a, i = !s);
      }

      return i ? r : -r - 1;
    }(t, e, n || _a);
  }(t, e, n),
      o = r < 0 ? -(r + 1) : r;

  t.splice(o, 0, e);
}

function _a(t, e) {
  return t > e ? 1 : t < e ? -1 : 0;
}

function Oa(t, e, n, r, o) {
  return Ba(t, e, n, r, o, 0).selectedIndices;
}

function Ma(t, e, n, r, o, a) {
  var i = Ba(t, e, n, r, o, a, !0);
  return i.numValidOutputs.dispose(), {
    selectedIndices: i.selectedIndices,
    selectedScores: i.selectedScores
  };
}

function Ba(t, e, n, r, o, a, i, s) {
  void 0 === i && (i = !1), void 0 === s && (s = !1);

  for (var u = Array.from(e).map(function (t, e) {
    return {
      score: t,
      boxIndex: e,
      suppressBeginIndex: 0
    };
  }).filter(function (t) {
    return t.score > o;
  }).sort(Wa), c = a > 0 ? -.5 / a : 0, l = [], h = []; l.length < n && u.length > 0;) {
    var f = u.pop(),
        d = f.score,
        p = f.boxIndex,
        v = f.suppressBeginIndex;
    if (d < o) break;

    for (var g = !1, m = l.length - 1; m >= v; --m) {
      var y = Pa(t, p, l[m]);

      if (y >= r) {
        g = !0;
        break;
      }

      if (f.score = f.score * La(r, c, y), f.score <= o) break;
    }

    f.suppressBeginIndex = l.length, g || (f.score === d ? (l.push(p), h.push(f.score)) : f.score > o && Fa(u, f, Wa));
  }

  var x = l.length;
  return s && (l.fill(0, x), h.fill(0, x)), {
    selectedIndices: Mn(l, "int32"),
    selectedScores: Mn(h, "float32"),
    numValidOutputs: On(x, "int32")
  };
}

function Pa(t, e, n) {
  var r = t.subarray(4 * e, 4 * e + 4),
      o = t.subarray(4 * n, 4 * n + 4),
      a = Math.min(r[0], r[2]),
      i = Math.min(r[1], r[3]),
      s = Math.max(r[0], r[2]),
      u = Math.max(r[1], r[3]),
      c = Math.min(o[0], o[2]),
      l = Math.min(o[1], o[3]),
      h = Math.max(o[0], o[2]),
      f = Math.max(o[1], o[3]),
      d = (s - a) * (u - i),
      p = (h - c) * (f - l);
  if (d <= 0 || p <= 0) return 0;
  var v = Math.max(a, c),
      g = Math.max(i, l),
      m = Math.min(s, h),
      y = Math.min(u, f),
      x = Math.max(m - v, 0) * Math.max(y - g, 0);
  return x / (d + p - x);
}

function La(t, e, n) {
  var r = Math.exp(e * n * n);
  return n <= t ? r : 0;
}

function Wa(t, e) {
  return t.score - e.score || t.score === e.score && e.boxIndex - t.boxIndex;
}

function Ua(t, e, n) {
  var r = new Array(t.rank).fill(0),
      o = t.shape.slice();
  return e.map(function (e) {
    o[n] = e;
    var a = t.slice(r, o);
    return r[n] += e, a;
  });
}

function Va(t, e) {
  for (var n = new Array(t.rank), r = 0; r < n.length; r++) n[r] = t.shape[r] * e[r];

  var o = er(n, t.dtype);

  for (r = 0; r < o.values.length; ++r) {
    for (var a = o.indexToLoc(r), i = new Array(t.rank), s = 0; s < i.length; s++) i[s] = a[s] % t.shape[s];

    var u = t.locToIndex(i);
    o.values[r] = t.values[u];
  }

  return o.toTensor();
}

function za(t, e, n, r, o) {
  for (var a = e[e.length - 1], i = [t.length / a, a], s = i[0], u = i[1], c = B(n, s * r), l = B("int32", s * r), h = 0; h < s; h++) {
    for (var f = h * u, d = t.subarray(f, f + u), p = [], v = 0; v < d.length; v++) p.push({
      value: d[v],
      index: v
    });

    p.sort(function (t, e) {
      return e.value - t.value;
    });
    var g = h * r,
        m = c.subarray(g, g + r),
        y = l.subarray(g, g + r);

    for (v = 0; v < r; v++) m[v] = p[v].value, y[v] = p[v].index;
  }

  var x = e.slice();
  return x[x.length - 1] = r, [Fn(c, x, n), Fn(l, x, "int32")];
}

function Ga(t, e) {
  for (var n = [], r = 0; r < e.length; r++) e[r] && n.push(r);

  var o = er(t, "int32"),
      a = er([n.length, t.length], "int32");

  for (r = 0; r < n.length; r++) {
    var i = o.indexToLoc(n[r]),
        s = r * t.length;
    a.values.set(i, s);
  }

  return a.toTensor();
}

var Ha = function (t, e) {
  this.outputShape = [], this.outputShape = t, this.variableNames = e.map(function (t, e) {
    return "T" + e;
  });
  var n = [];
  this.variableNames.forEach(function (t) {
    n.push("float v" + t + " = get" + t + "AtOutCoords();");
  });
  var r = this.variableNames.map(function (t) {
    return "v" + t;
  }).join(" + ");
  this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        float result = " + r + ";\n        setOutput(result);\n      }\n    ";
},
    qa = function (t, e) {
  this.outputShape = [], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t, this.variableNames = e.map(function (t, e) {
    return "T" + e;
  });
  var n = [];
  this.variableNames.forEach(function (t) {
    n.push("vec4 v" + t + " = get" + t + "AtOutCoords();");
  });
  var r = this.variableNames.map(function (t) {
    return "v" + t;
  }).join(" + ");
  this.userCode = "\n      void main() {\n        " + n.join("\n        ") + "\n\n        vec4 result = " + r + ";\n        setOutput(result);\n      }\n    ";
},
    Ka = function (t, e, n) {
  this.variableNames = ["A"];
  var r = t.windowSize,
      o = t.batchSize,
      a = t.inSize,
      i = Math.ceil(a / r);
  n || this.variableNames.push("bestIndicesA"), this.outputShape = [o, i];
  var s = "max" === e ? ">" : "<",
      u = n ? "inOffset + i;" : "round(getBestIndicesA(batch, inOffset + i));";
  this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + r + ";\n\n        int bestIndex = inOffset;\n        float bestValue = getA(batch, bestIndex);\n\n        for (int i = 0; i < " + r + "; i++) {\n          int inIdx = " + u + ";\n          float candidate = getA(batch, inIdx);\n          if (candidate " + s + " bestValue) {\n            bestValue = candidate;\n            bestIndex = inIdx;\n          }\n        }\n        setOutput(float(bestIndex));\n      }\n    ";
};

function ja(t, e) {
  return ["x", "y", "z", "w", "u", "v"].slice(0, e).map(function (e) {
    return t + "." + e;
  });
}

function Xa(t, e) {
  return 1 === e ? [t] : ja(t, e);
}

function Ya() {
  var t, e, n, r, o, a, s, u, c, l;
  return 2 === i().getNumber("WEBGL_VERSION") ? (t = "#version 300 es", e = "in", n = "out", r = "in", o = "texture", a = "outputColor", s = "out vec4 outputColor;", u = "\n      bool isnan_custom(float val) {\n        return (val > 0.0 || val < 0.0) ? false : val != 0.0;\n      }\n\n      bvec4 isnan_custom(vec4 val) {\n        return bvec4(isnan_custom(val.x),\n          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));\n      }\n\n      #define isnan(value) isnan_custom(value)\n    ", c = "", l = "\n      #define round(value) newRound(value)\n      int newRound(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 newRound(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    ") : (t = "", e = "attribute", n = "varying", r = "varying", o = "texture2D", a = "gl_FragColor", s = "", u = "\n      #define isnan(value) isnan_custom(value)\n      bool isnan_custom(float val) {\n        return (val > 0. || val < 1. || val == 0.) ? false : true;\n      }\n      bvec4 isnan_custom(vec4 val) {\n        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));\n      }\n    ", c = "\n      uniform float INFINITY;\n\n      bool isinf(float val) {\n        return abs(val) == INFINITY;\n      }\n      bvec4 isinf(vec4 val) {\n        return equal(abs(val), vec4(INFINITY));\n      }\n    ", l = "\n      int round(float value) {\n        return int(floor(value + 0.5));\n      }\n\n      ivec4 round(vec4 value) {\n        return ivec4(floor(value + vec4(0.5)));\n      }\n    "), {
    version: t,
    attribute: e,
    varyingVs: n,
    varyingFs: r,
    texture2D: o,
    output: a,
    defineOutput: s,
    defineSpecialNaN: u,
    defineSpecialInf: c,
    defineRound: l
  };
}

function $a(t, e, n) {
  void 0 === n && (n = "index");
  var r = $(e);
  return r.map(function (e, o) {
    return "int " + t[o] + " = " + n + " / " + e + "; " + (o === r.length - 1 ? "int " + t[o + 1] + " = " + n + " - " + t[o] + " * " + e : "index -= " + t[o] + " * " + e) + ";";
  }).join("");
}

function Qa(t) {
  var e = $(t).map(function (t) {
    return t.toString();
  });
  return "\n  int getFlatIndex(ivec3 coords) {\n    return coords.x * " + e[0] + " + coords.y * " + e[1] + " + coords.z;\n  }\n";
}

var Ja = "\n  const float FLOAT_MAX = 1.70141184e38;\n  const float FLOAT_MIN = 1.17549435e-38;\n\n  lowp vec4 encode_float(highp float v) {\n    if (isnan(v)) {\n      return vec4(255, 255, 255, 255);\n    }\n\n    highp float av = abs(v);\n\n    if(av < FLOAT_MIN) {\n      return vec4(0.0, 0.0, 0.0, 0.0);\n    } else if(v > FLOAT_MAX) {\n      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n    } else if(v < -FLOAT_MAX) {\n      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n    }\n\n    highp vec4 c = vec4(0,0,0,0);\n\n    highp float e = floor(log2(av));\n    highp float m = exp2(fract(log2(av))) - 1.0;\n\n    c[2] = floor(128.0 * m);\n    m -= c[2] / 128.0;\n    c[1] = floor(32768.0 * m);\n    m -= c[1] / 32768.0;\n    c[0] = floor(8388608.0 * m);\n\n    highp float ebias = e + 127.0;\n    c[3] = floor(ebias / 2.0);\n    ebias -= c[3] * 2.0;\n    c[2] += floor(ebias) * 128.0;\n\n    c[3] += 128.0 * step(0.0, -v);\n\n    return c / 255.0;\n  }\n";

function Za(t, e, n, r) {
  var o = [];
  t.forEach(function (t) {
    var e = k(t.shapeInfo.logicalShape);
    t.shapeInfo.isUniform ? o.push("uniform float " + t.name + (e > 1 ? "[" + e + "]" : "") + ";") : (o.push("uniform sampler2D " + t.name + ";"), o.push("uniform int offset" + t.name + ";"));
  });

  var a,
      i,
      s = o.join("\n"),
      u = t.map(function (t) {
    return function (t, e, n) {
      void 0 === n && (n = !1);
      var r = "";
      r += n ? ei(t) : ti(t);
      var o = t.shapeInfo.logicalShape,
          a = e.logicalShape;
      o.length <= a.length && (r += n ? function (t, e) {
        var n,
            r = t.name,
            o = r.charAt(0).toUpperCase() + r.slice(1),
            a = "get" + o + "AtOutCoords",
            i = t.shapeInfo.logicalShape.length,
            s = e.logicalShape.length,
            u = Mr(t.shapeInfo.logicalShape, e.logicalShape),
            c = ui(s),
            l = s - i,
            h = ["x", "y", "z", "w", "u", "v"];
        n = 0 === i ? "" : s < 2 && u.length >= 1 ? "coords = 0;" : u.map(function (t) {
          return "coords." + h[t + l] + " = 0;";
        }).join("\n");
        var f = "";
        f = s < 2 && i > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + h[e + l];
        }).join(", ");
        var d = "return outputValue;",
            p = 1 === k(t.shapeInfo.logicalShape),
            v = 1 === k(e.logicalShape);

        if (1 !== i || p || v) {
          if (p && !v) d = 1 === s ? "\n        return vec4(outputValue.x, outputValue.x, 0., 0.);\n      " : "\n        return vec4(outputValue.x);\n      ";else if (u.length) {
            var g = i - 2,
                m = i - 1;
            u.indexOf(g) > -1 && u.indexOf(m) > -1 ? d = "return vec4(outputValue.x);" : u.indexOf(g) > -1 ? d = "return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);" : u.indexOf(m) > -1 && (d = "return vec4(outputValue.xx, outputValue.zz);");
          }
        } else d = "\n      return vec4(outputValue.xy, outputValue.xy);\n    ";

        return "\n    vec4 " + a + "() {\n      " + c + " coords = getOutputCoords();\n      " + n + "\n      vec4 outputValue = get" + o + "(" + f + ");\n      " + d + "\n    }\n  ";
      }(t, e) : function (t, e) {
        var n = t.name,
            r = n.charAt(0).toUpperCase() + n.slice(1),
            o = "get" + r + "AtOutCoords",
            a = e.texShape,
            i = t.shapeInfo.texShape,
            s = t.shapeInfo.logicalShape.length,
            u = e.logicalShape.length;
        if (!t.shapeInfo.isUniform && s === u && null == t.shapeInfo.flatOffset && S(i, a)) return "\n      float " + o + "() {\n        return sampleTexture(" + n + ", resultUV);\n      }\n    ";
        var c,
            l = ui(u),
            h = Mr(t.shapeInfo.logicalShape, e.logicalShape),
            f = u - s,
            d = ["x", "y", "z", "w", "u", "v"];
        c = 0 === s ? "" : u < 2 && h.length >= 1 ? "coords = 0;" : h.map(function (t) {
          return "coords." + d[t + f] + " = 0;";
        }).join("\n");
        var p = "";
        p = u < 2 && s > 0 ? "coords" : t.shapeInfo.logicalShape.map(function (t, e) {
          return "coords." + d[e + f];
        }).join(", ");
        return "\n    float " + o + "() {\n      " + l + " coords = getOutputCoords();\n      " + c + "\n      return get" + r + "(" + p + ");\n    }\n  ";
      }(t, e));
      return r;
    }(t, e, r);
  }).join("\n"),
      c = e.texShape,
      l = Ya(),
      h = function (t) {
    return "\n    float sampleTexture(sampler2D textureSampler, vec2 uv) {\n      return " + t.texture2D + "(textureSampler, uv).r;\n    }\n  ";
  }(l),
      f = function (t) {
    return t.version + "\n    precision highp float;\n    precision highp int;\n    precision highp sampler2D;\n    " + t.varyingFs + " vec2 resultUV;\n    " + t.defineOutput + "\n    const vec2 halfCR = vec2(0.5, 0.5);\n\n    struct ivec5\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n    };\n\n    struct ivec6\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n      int v;\n    };\n\n    uniform float NAN;\n    " + t.defineSpecialNaN + "\n    " + t.defineSpecialInf + "\n    " + t.defineRound + "\n\n    int imod(int x, int y) {\n      return x - y * (x / y);\n    }\n\n    int idiv(int a, int b, float sign) {\n      int res = a / b;\n      int mod = imod(a, b);\n      if (sign < 0. && mod != 0) {\n        res -= 1;\n      }\n      return res;\n    }\n\n    //Based on the work of Dave Hoskins\n    //https://www.shadertoy.com/view/4djSRW\n    #define HASHSCALE1 443.8975\n    float random(float seed){\n      vec2 p = resultUV * seed;\n      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n      p3 += dot(p3, p3.yzx + 19.19);\n      return fract((p3.x + p3.y) * p3.z);\n    }\n\n    " + ni + "\n    " + ri + "\n    " + oi + "\n  ";
  }(l);

  return e.isPacked ? (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (1 === n[0]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.x * " + n[1] + ".0);\n      }\n    ";
          if (1 === n[1]) return "\n      int getOutputCoords() {\n        return 2 * int(resultUV.y * " + n[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      return 2 * (resTexRC.x * " + n[1] + " + resTexRC.y);\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)];
          if (S(t, e)) return "\n      ivec2 getOutputCoords() {\n        return 2 * ivec2(resultUV.yx * vec2(" + n[0] + ", " + n[1] + "));\n      }\n    ";
          var r = Math.ceil(t[1] / 2);
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = t, r = e, o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)], a = Math.ceil(n[2] / 2), i = a * Math.ceil(n[1] / 2), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + o[0] + ", " + o[1] + "));\n      int index = resTexRC.x * " + o[1] + " + resTexRC.y;\n\n      int b = index / " + i + ";\n      index -= b * " + i + ";\n\n      int r = 2 * (index / " + a + ");\n      int c = imod(index, " + a + ") * 2;\n\n      return ivec3(b, r, c);\n    }\n  ";

      default:
        return function (t, e) {
          for (var n = [Math.ceil(e[0] / 2), Math.ceil(e[1] / 2)], r = Math.ceil(t[t.length - 1] / 2), o = r * Math.ceil(t[t.length - 2] / 2), a = o, i = "", s = "b, r, c", u = 2; u < t.length - 1; u++) a *= t[t.length - u - 1], i = "\n      int b" + u + " = index / " + a + ";\n      index -= b" + u + " * " + a + ";\n    " + i, s = "b" + u + ", " + s;

          return "\n    ivec" + t.length + " getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n\n      " + i + "\n\n      int b = index / " + o + ";\n      index -= b * " + o + ";\n\n      int r = 2 * (index / " + r + ");\n      int c = imod(index, " + r + ") * 2;\n\n      return ivec" + t.length + "(" + s + ");\n    }\n  ";
        }(t, e);
    }

    var n, r, o, a, i;
  }(e.logicalShape, c), i = function (t) {
    return "\n    void setOutput(vec4 val) {\n      " + t.output + " = val;\n    }\n  ";
  }(l)) : (a = function (t, e) {
    switch (t.length) {
      case 0:
        return "\n    int getOutputCoords() {\n      return 0;\n    }\n  ";

      case 1:
        return function (t, e) {
          if (1 === e[0]) return "\n      int getOutputCoords() {\n        return int(resultUV.x * " + e[1] + ".0);\n      }\n    ";
          if (1 === e[1]) return "\n      int getOutputCoords() {\n        return int(resultUV.y * " + e[0] + ".0);\n      }\n    ";
          return "\n    int getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      return resTexRC.x * " + e[1] + " + resTexRC.y;\n    }\n  ";
        }(0, e);

      case 2:
        return function (t, e) {
          if (S(t, e)) return "\n      ivec2 getOutputCoords() {\n        return ivec2(resultUV.yx * vec2(" + e[0] + ", " + e[1] + "));\n      }\n    ";
          if (1 === t[1]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(index, 0);\n      }\n    ";
          if (1 === t[0]) return "\n      ivec2 getOutputCoords() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n                               vec2(" + e[0] + ", " + e[1] + "));\n        int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n        return ivec2(0, index);\n      }\n    ";
          return "\n    ivec2 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      int r = index / " + t[1] + ";\n      int c = index - r * " + t[1] + ";\n      return ivec2(r, c);\n    }\n  ";
        }(t, e);

      case 3:
        return n = e, r = $a(["r", "c", "d"], t), "\n    ivec3 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n                             vec2(" + n[0] + ", " + n[1] + "));\n      int index = resTexRC.x * " + n[1] + " + resTexRC.y;\n      " + r + "\n      return ivec3(r, c, d);\n    }\n  ";

      case 4:
        return function (t, e) {
          var n = $a(["r", "c", "d", "d2"], t);
          return "\n    ivec4 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n      " + n + "\n      return ivec4(r, c, d, d2);\n    }\n  ";
        }(t, e);

      case 5:
        return function (t, e) {
          var n = $a(["r", "c", "d", "d2", "d3"], t);
          return "\n    ivec5 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx * vec2(" + e[0] + ",\n                             " + e[1] + "));\n\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec5 outShape = ivec5(r, c, d, d2, d3);\n      return outShape;\n    }\n  ";
        }(t, e);

      case 6:
        return function (t, e) {
          var n = $a(["r", "c", "d", "d2", "d3", "d4"], t);
          return "\n    ivec6 getOutputCoords() {\n      ivec2 resTexRC = ivec2(resultUV.yx *\n        vec2(" + e[0] + ", " + e[1] + "));\n      int index = resTexRC.x * " + e[1] + " + resTexRC.y;\n\n      " + n + "\n\n      ivec6 result = ivec6(r, c, d, d2, d3, d4);\n      return result;\n    }\n  ";
        }(t, e);

      default:
        throw new Error(t.length + "-D output sampling is not yet supported");
    }

    var n, r;
  }(e.logicalShape, c), i = function (t) {
    return "\n    void setOutput(float val) {\n      " + t.output + " = vec4(val, 0, 0, 0);\n    }\n  ";
  }(l)), r && (f += ai), [f, h, i, s, a, u, n].join("\n");
}

function ti(t) {
  var e = t.shapeInfo.logicalShape;

  switch (e.length) {
    case 0:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "float " + n + "() {return " + e + ";}";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === o && 1 === a) return "\n      float " + n + "() {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";
        var i = t.shapeInfo.texShape,
            s = i[0],
            u = i[1],
            c = ii(e);
        return "\n    float " + n + "() {\n      vec2 uv = uvFromFlat(" + s + ", " + u + ", " + c + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1);
        if (t.shapeInfo.isUniform) return "\n      float " + n + "(int index) {\n        " + si(t) + "\n      }\n    ";
        var r = t.shapeInfo.texShape,
            o = r[0],
            a = r[1];
        if (1 === a && 1 === o) return "\n      float " + n + "(int index) {\n        return sampleTexture(" + e + ", halfCR);\n      }\n    ";
        var i = ii(e);
        if (1 === a) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2(0.5, (float(index + " + i + ") + 0.5) / " + o + ".0);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        if (1 === o) return "\n      float " + n + "(int index) {\n        vec2 uv = vec2((float(index + " + i + ") + 0.5) / " + a + ".0, 0.5);\n        return sampleTexture(" + e + ", uv);\n      }\n    ";
        return "\n    float " + n + "(int index) {\n      vec2 uv = uvFromFlat(" + o + ", " + a + ", index + " + i + ");\n      return sampleTexture(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape;

        if (null != o && S(e, o)) {
          var a = o[0],
              i = o[1];
          return "\n    float " + r + "(int row, int col) {\n      vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        }

        var s = M(e),
            u = s.newShape,
            c = s.keptDims,
            l = u;

        if (l.length < e.length) {
          var h = ci(t, l);
          return "\n      " + ti(h) + "\n      float " + r + "(int row, int col) {\n        return " + r + "(" + li(["row", "col"], c) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col) {\n        int index = round(dot(vec2(row, col), vec2(" + e[1] + ", 1)));\n        " + si(t) + "\n      }\n    ";
        var f = o[0],
            d = o[1],
            p = ii(n);
        if (1 === d) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + p + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2(0.5, (index + 0.5) / " + f + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        if (1 === f) return "\n    float " + r + "(int row, int col) {\n      float index = dot(vec3(row, col, " + p + "), vec3(" + e[1] + ", 1, 1));\n      vec2 uv = vec2((index + 0.5) / " + d + ".0, 0.5);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        return "\n  float " + r + "(int row, int col) {\n    // Explicitly use integer operations as dot() only works on floats.\n    int index = row * " + e[1] + " + col + " + p + ";\n    vec2 uv = uvFromFlat(" + f + ", " + d + ", index);\n    return sampleTexture(" + n + ", uv);\n  }\n";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[1] * e[2],
            a = e[2],
            i = M(e),
            s = i.newShape,
            u = i.keptDims,
            c = s;

        if (c.length < e.length) {
          var l = ci(t, c);
          return "\n        " + ti(l) + "\n        float " + r + "(int row, int col, int depth) {\n          return " + r + "(" + li(["row", "col", "depth"], u) + ");\n        }\n      ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth) {\n        int index = round(dot(vec3(row, col, depth),\n                          vec3(" + o + ", " + a + ", 1)));\n        " + si(t) + "\n      }\n    ";
        var h = t.shapeInfo.texShape,
            f = h[0],
            d = h[1],
            p = t.shapeInfo.flatOffset;
        if (d === o && null == p) return "\n        float " + r + "(int row, int col, int depth) {\n          float texR = float(row);\n          float texC = dot(vec2(col, depth), vec2(" + a + ", 1));\n          vec2 uv = (vec2(texC, texR) + halfCR) /\n                     vec2(" + d + ".0, " + f + ".0);\n          return sampleTexture(" + n + ", uv);\n        }\n      ";
        if (d === a && null == p) return "\n    float " + r + "(int row, int col, int depth) {\n      float texR = dot(vec2(row, col), vec2(" + e[1] + ", 1));\n      float texC = float(depth);\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + d + ".0, " + f + ".0);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
        var v = ii(n);
        return "\n      float " + r + "(int row, int col, int depth) {\n        // Explicitly use integer operations as dot() only works on floats.\n        int index = row * " + o + " + col * " + a + " + depth + " + v + ";\n        vec2 uv = uvFromFlat(" + f + ", " + d + ", index);\n        return sampleTexture(" + n + ", uv);\n      }\n  ";
      }(t);

    case 4:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[3],
            a = e[2] * o,
            i = e[1] * a,
            s = M(e),
            u = s.newShape,
            c = s.keptDims;

        if (u.length < e.length) {
          var l = ci(t, u);
          return "\n      " + ti(l) + "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        return " + r + "(" + li(["row", "col", "depth", "depth2"], c) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        int index = round(dot(vec4(row, col, depth, depth2),\n                          vec4(" + i + ", " + a + ", " + o + ", 1)));\n        " + si(t) + "\n      }\n    ";
        var h = t.shapeInfo.flatOffset,
            f = t.shapeInfo.texShape,
            d = f[0],
            p = f[1];
        if (p === i && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = float(row);\n        float texC =\n            dot(vec3(col, depth, depth2),\n                vec3(" + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + p + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (p === o && null == h) return "\n      float " + r + "(int row, int col, int depth, int depth2) {\n        float texR = dot(vec3(row, col, depth),\n                         vec3(" + e[1] * e[2] + ", " + e[2] + ", 1));\n        float texC = float(depth2);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + p + ".0, " + d + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var v = ii(n);
        return "\n    float " + r + "(int row, int col, int depth, int depth2) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + i + " + col * " + a + " +\n          depth * " + o + " + depth2;\n      vec2 uv = uvFromFlat(" + d + ", " + p + ", index + " + v + ");\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 5:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = e[4],
            a = e[3] * o,
            i = e[2] * a,
            s = e[1] * i,
            u = M(e),
            c = u.newShape,
            l = u.keptDims;

        if (c.length < e.length) {
          var h = ci(t, c);
          return "\n      " + ti(h) + "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        return " + r + "(" + li(["row", "col", "depth", "depth2", "depth3"], l) + ");\n      }\n    ";
        }

        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float index = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + s + ", " + i + ", " + a + ", " + o + ")) +\n          depth3;\n        " + si(t) + "\n      }\n    ";
        var f = t.shapeInfo.flatOffset,
            d = t.shapeInfo.texShape,
            p = d[0],
            v = d[1];
        if (v === s && null == f) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n                         vec4(" + i + ", " + a + ", " + o + ", 1));\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + v + ".0, " + p + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (v === o && null == f) return "\n      float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n        float texR = dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] + ",\n               " + e[2] * e[3] + ", " + e[3] + ", 1));\n        int texC = depth3;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + v + ".0, " + p + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var g = ii(n);
        return "\n    float " + r + "(int row, int col, int depth, int depth2, int depth3) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + s + " + col * " + i + " + depth * " + a + " +\n          depth2 * " + o + " + depth3 + " + g + ";\n      vec2 uv = uvFromFlat(" + p + ", " + v + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    case 6:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = M(e),
            a = o.newShape,
            i = o.keptDims;

        if (a.length < e.length) {
          var s = ci(t, a);
          return "\n      " + ti(s) + "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        return " + r + "(" + li(["row", "col", "depth", "depth2", "depth3", "depth4"], i) + ");\n      }\n    ";
        }

        var u = e[5],
            c = e[4] * u,
            l = e[3] * c,
            h = e[2] * l,
            f = e[1] * h;
        if (t.shapeInfo.isUniform) return "\n      float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n        int index = round(dot(\n          vec4(row, col, depth, depth2),\n          vec4(" + f + ", " + h + ", " + l + ", " + c + ")) +\n          dot(\n            vec2(depth3, depth4),\n            vec2(" + u + ", 1)));\n        " + si(t) + "\n      }\n    ";
        var d = t.shapeInfo.flatOffset,
            p = t.shapeInfo.texShape,
            v = p[0],
            g = p[1];
        if (g === f && null == d) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        int texR = row;\n        float texC = dot(vec4(col, depth, depth2, depth3),\n          vec4(" + h + ", " + l + ", " + c + ", " + u + ")) +\n               float(depth4);\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                   vec2(" + g + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        if (g === u && null == d) return "\n      float " + r + "(int row, int col, int depth,\n                    int depth2, int depth3, int depth4) {\n        float texR = dot(vec4(row, col, depth, depth2),\n          vec4(" + e[1] * e[2] * e[3] * e[4] + ",\n               " + e[2] * e[3] * e[4] + ",\n               " + e[3] * e[4] + ",\n               " + e[4] + ")) + float(depth3);\n        int texC = depth4;\n        vec2 uv = (vec2(texC, texR) + halfCR) /\n                  vec2(" + g + ".0, " + v + ".0);\n        return sampleTexture(" + n + ", uv);\n      }\n    ";
        var m = ii(n);
        return "\n    float " + r + "(int row, int col, int depth,\n                  int depth2, int depth3, int depth4) {\n      // Explicitly use integer operations as dot() only works on floats.\n      int index = row * " + f + " + col * " + h + " + depth * " + l + " +\n          depth2 * " + c + " + depth3 * " + u + " + depth4 + " + m + ";\n      vec2 uv = uvFromFlat(" + v + ", " + g + ", index);\n      return sampleTexture(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      throw new Error(e.length + "-D input sampling is not yet supported");
  }
}

function ei(t) {
  var e, n, r;

  switch (t.shapeInfo.logicalShape.length) {
    case 0:
      return e = t.name, n = "get" + e.charAt(0).toUpperCase() + e.slice(1), r = Ya(), "\n    vec4 " + n + "() {\n      return " + r.texture2D + "(" + e + ", halfCR);\n    }\n  ";

    case 1:
      return function (t) {
        var e = t.name,
            n = "get" + e.charAt(0).toUpperCase() + e.slice(1),
            r = t.shapeInfo.texShape,
            o = [Math.ceil(r[0] / 2), Math.ceil(r[1] / 2)],
            a = Ya();
        return "\n    vec4 " + n + "(int index) {\n      vec2 uv = packedUVfrom1D(\n        " + o[0] + ", " + o[1] + ", index);\n      return " + a.texture2D + "(" + e + ", uv);\n    }\n  ";
      }(t);

    case 2:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = o[0],
            i = o[1],
            s = Ya();
        if (null != o && S(e, o)) return "\n      vec4 " + r + "(int row, int col) {\n        vec2 uv = (vec2(col, row) + halfCR) / vec2(" + i + ".0, " + a + ".0);\n\n        return " + s.texture2D + "(" + n + ", uv);\n      }\n    ";
        var u = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)],
            c = Math.ceil(e[1] / 2);
        return "\n    vec4 " + r + "(int row, int col) {\n      vec2 uv = packedUVfrom2D(" + c + ", " + u[0] + ", " + u[1] + ", row, col);\n      return " + s.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    case 3:
      return function (t) {
        var e = t.shapeInfo.logicalShape,
            n = t.name,
            r = "get" + n.charAt(0).toUpperCase() + n.slice(1),
            o = t.shapeInfo.texShape,
            a = [Math.ceil(o[0] / 2), Math.ceil(o[1] / 2)];

        if (1 === e[0]) {
          var i = e.slice(1),
              s = ci(t, i);
          return "\n        " + ei(s) + "\n        vec4 " + r + "(int b, int row, int col) {\n          return " + r + "(" + li(["b", "row", "col"], [1, 2]) + ");\n        }\n      ";
        }

        var u = a[0],
            c = a[1],
            l = Math.ceil(e[2] / 2),
            h = l * Math.ceil(e[1] / 2),
            f = Ya();
        return "\n    vec4 " + r + "(int b, int row, int col) {\n      vec2 uv = packedUVfrom3D(\n        " + u + ", " + c + ", " + h + ", " + l + ", b, row, col);\n      return " + f.texture2D + "(" + n + ", uv);\n    }\n  ";
      }(t);

    default:
      return function (t) {
        for (var e = t.shapeInfo.logicalShape, n = e.length, r = t.name, o = "get" + r.charAt(0).toUpperCase() + r.slice(1), a = t.shapeInfo.texShape, i = [Math.ceil(a[0] / 2), Math.ceil(a[1] / 2)], s = i[0], u = i[1], c = Math.ceil(e[n - 1] / 2), l = c * Math.ceil(e[n - 2] / 2), h = "int b, int row, int col", f = "b * " + l + " + (row / 2) * " + c + " + (col / 2)", d = 2; d < n - 1; d++) h = "int b" + d + ", " + h, l *= e[n - d - 1], f = "b" + d + " * " + l + " + " + f;

        var p = Ya();
        return "\n    vec4 " + o + "(" + h + ") {\n      int index = " + f + ";\n      int texR = index / " + u + ";\n      int texC = index - texR * " + u + ";\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + u + ", " + s + ");\n      return " + p.texture2D + "(" + r + ", uv);\n    }\n  ";
      }(t);
  }
}

var ni = "\nvec2 uvFromFlat(int texNumR, int texNumC, int index) {\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\nvec2 packedUVfrom1D(int texNumR, int texNumC, int index) {\n  int texelIndex = index / 2;\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    ri = "\nvec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,\n  int texNumC, int row, int col) {\n  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = texelIndex / texNumC;\n  int texC = texelIndex - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    oi = "\nvec2 packedUVfrom3D(int texNumR, int texNumC,\n    int texelsInBatch, int texelsInLogicalRow, int b,\n    int row, int col) {\n  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);\n  int texR = index / texNumC;\n  int texC = index - texR * texNumC;\n  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n}\n",
    ai = "\n  float getChannel(vec4 frag, vec2 innerDims) {\n    vec2 modCoord = mod(innerDims, 2.);\n    return modCoord.x == 0. ?\n      (modCoord.y == 0. ? frag.r : frag.g) :\n      (modCoord.y == 0. ? frag.b : frag.a);\n  }\n  float getChannel(vec4 frag, int dim) {\n    float modCoord = mod(float(dim), 2.);\n    return modCoord == 0. ? frag.r : frag.g;\n  }\n";

function ii(t) {
  return "offset" + t;
}

function si(t) {
  var e = t.name,
      n = k(t.shapeInfo.logicalShape);
  return n < 2 ? "return " + e + ";" : "\n    for (int i = 0; i < " + n + "; i++) {\n      if (i == index) {\n        return " + e + "[i];\n      }\n    }\n  ";
}

function ui(t) {
  if (t <= 1) return "int";
  if (2 === t) return "ivec2";
  if (3 === t) return "ivec3";
  if (4 === t) return "ivec4";
  if (5 === t) return "ivec5";
  if (6 === t) return "ivec6";
  throw Error("GPU for rank " + t + " is not yet supported");
}

function ci(t, e) {
  var n = JSON.parse(JSON.stringify(t));
  return n.shapeInfo.logicalShape = e, n;
}

function li(t, e) {
  return e.map(function (e) {
    return t[e];
  }).join(", ");
}

var hi = function (t, e, n, r) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, C(t.length > 2, function () {
    return "Packed arg" + (n.charAt(0).toUpperCase() + n.slice(1)) + " supports only inputs with rank above 2.";
  });
  var o = t[t.length - 1],
      a = Math.ceil(o / e);
  this.outputShape = t.slice(0, -1), a > 1 && this.outputShape.push(a), r || this.variableNames.push("bestIndicesA");
  var i,
      s,
      u = this.outputShape,
      c = u.length,
      l = ui(c),
      h = Xa("coords", c);

  if (1 === a) {
    var f = ui(s = c + 1);
    i = "\n        " + f + " sourceLocR = " + f + "(" + h.join() + ", 0);\n        ++" + h[c - 1] + ";\n        " + f + " sourceLocG = " + f + "(" + h.join() + ", 0);\n        ++" + h[c - 2] + ";\n        " + f + " sourceLocA = " + f + "(" + h.join() + ", 0);\n        --" + h[c - 1] + ";\n        " + f + " sourceLocB = " + f + "(" + h.join() + ", 0);\n        --" + h[c - 2] + ";";
  } else s = c, i = "\n        " + l + " sourceLocR = coords;\n        ++" + h[c - 1] + ";\n        " + l + " sourceLocG = coords;\n        ++" + h[c - 2] + ";\n        " + l + " sourceLocA = coords;\n        --" + h[c - 1] + ";\n        " + l + " sourceLocB = coords;\n        --" + h[c - 2] + ";";

  var d = ["x", "y", "z", "w", "u", "v"].slice(0, s),
      p = "." + d[s - 1],
      v = d.map(function (t) {
    return "int " + t;
  }),
      g = Xa("sourceLocR", s - 1).concat("inIdx.r"),
      m = Xa("sourceLocG", s - 1).concat("inIdx.g"),
      y = Xa("sourceLocB", s - 1).concat("inIdx.b"),
      x = Xa("sourceLocA", s - 1).concat("inIdx.a"),
      b = "max" === n ? "greaterThan" : "lessThan",
      w = r ? "" : "\n          inIdx = round(vec4(getBestIndicesAChannel(" + g.join() + "),\n                             getBestIndicesAChannel(" + m.join() + "),\n                             getBestIndicesAChannel(" + y.join() + "),\n                             getBestIndicesAChannel(" + x.join() + ")));",
      E = "vec4(\n            getAChannel(" + g.join() + "),\n            hasNextCol ? getAChannel(" + m.join() + ") : 0.,\n            hasNextRow ? getAChannel(" + y.join() + ") : 0.,\n            hasNextRow && hasNextCol ? getAChannel(" + x.join() + ") : 0.)",
      R = r ? "" : "\n      float getBestIndicesAChannel(" + v.join() + ") {\n        return getChannel(getBestIndicesA(" + d.join() + "),\n                                          vec2(" + d.slice(-2).join() + "));\n      }";
  this.userCode = "\n      float getAChannel(" + v.join() + ") {\n        return getChannel(getA(" + d.join() + "),\n                               vec2(" + d.slice(-2).join() + "));\n      }\n      " + R + "\n      void main() {\n        " + l + " coords = getOutputCoords();\n        bool hasNextCol = " + h[c - 1] + " < " + (u[c - 1] - 1) + ";\n        bool hasNextRow = " + h[c - 2] + " < " + (u[c - 2] - 1) + ";\n        " + i + "\n        ivec4 srcIdx = ivec4(sourceLocR" + p + ", sourceLocG" + p + ",\n          sourceLocB" + p + ", sourceLocA" + p + ") * " + e + ";\n        ivec4 inIdx = srcIdx;\n        vec4 bestIndex = vec4(inIdx);\n        vec4 bestValue = " + E + ";\n\n        for (int i = 0; i < " + e + "; i++) {\n          inIdx = srcIdx;\n          " + w + "\n          vec4 candidate = " + E + ";\n          bvec4 nan = isnan(candidate);\n          bvec4 replace = bvec4(\n            vec4(" + b + "(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));\n\n          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,\n                           replace.y  ? candidate.y : bestValue.y,\n                           replace.z  ? candidate.z : bestValue.z,\n                           replace.w  ? candidate.w : bestValue.w);\n          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));\n          srcIdx++;\n        }\n        setOutput(bestIndex);\n      }\n    ";
},
    fi = function (t) {
  this.variableNames = ["dy"], this.outputShape = t.inShape;
  var e = t.filterHeight,
      n = t.filterWidth,
      r = t.strideHeight,
      o = t.strideWidth,
      a = t.dilationHeight,
      i = t.dilationWidth,
      s = t.effectiveFilterHeight,
      u = t.effectiveFilterWidth,
      c = s - 1 - t.padInfo.top,
      l = u - 1 - t.padInfo.left,
      h = 1 / (e * n);
  this.userCode = "\n      const ivec2 pads = ivec2(" + c + ", " + l + ");\n      const float avgMultiplier = float(" + h + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + s + ";\n            wR += " + a + ") {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + u + ";\n            wC+= " + i + ") {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n\n            dotProd += dyValue * avgMultiplier;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    di = function (t) {
  this.variableNames = ["dy"], this.outputShape = t.inShape;
  var e = t.filterDepth,
      n = t.filterHeight,
      r = t.filterWidth,
      o = t.strideDepth,
      a = t.strideHeight,
      i = t.strideWidth,
      s = t.dilationDepth,
      u = t.dilationHeight,
      c = t.dilationWidth,
      l = t.effectiveFilterDepth,
      h = t.effectiveFilterHeight,
      f = t.effectiveFilterWidth,
      d = l - 1 - t.padInfo.front,
      p = h - 1 - t.padInfo.top,
      v = f - 1 - t.padInfo.left,
      g = 1 / (e * n * r);
  this.userCode = "\n      const ivec3 pads = ivec3(" + d + ", " + p + ", " + v + ");\n      const float avgMultiplier = float(" + g + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyDCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get\n        // dx(xD, xR, xC, ch).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int wD = 0; wD < " + l + ";\n            wD += " + s + ") {\n          float dyD = float(dyDCorner + wD) / " + o + ".0;\n\n          if (dyD < 0.0 || dyD >= " + t.outDepth + ".0 || fract(dyD) > 0.0) {\n            continue;\n          }\n          int idyD = int(dyD);\n\n          for (int wR = 0; wR < " + h + ";\n              wR += " + u + ") {\n            float dyR = float(dyRCorner + wR) / " + a + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n                fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            for (int wC = 0; wC < " + f + ";\n                wC += " + c + ") {\n              float dyC = float(dyCCorner + wC) / " + i + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              float dyValue = getDy(batch, idyD, idyR, idyC, ch);\n\n              dotProd += dyValue * avgMultiplier;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    pi = function (t, e, n, r, o, a) {
  this.outputShape = [], this.variableNames = ["x", "mean", "variance"], Pr(t, e), Pr(t, n);
  var i = "0.0";
  null != r && (Pr(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
  var s = "1.0";
  null != o && (Pr(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        float x = getXAtOutCoords();\n        float mean = getMeanAtOutCoords();\n        float variance = getVarianceAtOutCoords();\n        float offset = " + i + ";\n        float scale = " + s + ";\n        float inv = scale * inversesqrt(variance + float(" + a + "));\n        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));\n      }\n    ";
},
    vi = function (t, e, n, r, o, a) {
  this.packedInputs = !0, this.packedOutput = !0, this.variableNames = ["x", "mean", "variance"], Pr(t, e), Pr(t, n);
  var i = "vec4(0.0)";
  null != r && (Pr(t, r), this.variableNames.push("offset"), i = "getOffsetAtOutCoords()");
  var s = "vec4(1.0)";
  null != o && (Pr(t, o), this.variableNames.push("scale"), s = "getScaleAtOutCoords()"), this.outputShape = t, this.userCode = "\n      void main() {\n        vec4 offset = " + i + ";\n        vec4 scale = " + s + ";\n\n        vec4 x = getXAtOutCoords();\n        vec4 mean = getMeanAtOutCoords();\n        vec4 variance = getVarianceAtOutCoords();\n\n        vec4 inv = scale * inversesqrt(variance + vec4(" + a + "));\n\n        setOutput((x - mean) * inv + offset);\n      }\n    ";
},
    gi = "return areal * breal - aimag * bimag;",
    mi = "return areal * bimag + aimag * breal;",
    yi = function (t, e, n) {
  this.variableNames = ["AReal", "AImag", "BReal", "BImag"], this.outputShape = Pr(e, n), this.userCode = "\n      float binaryOpComplex(\n          float areal, float aimag, float breal, float bimag) {\n        " + t + "\n      }\n\n      void main() {\n        float areal = getARealAtOutCoords();\n        float aimag = getAImagAtOutCoords();\n        float breal = getBRealAtOutCoords();\n        float bimag = getBImagAtOutCoords();\n        setOutput(binaryOpComplex(areal, aimag, breal, bimag));\n      }\n    ";
},
    xi = "return a + b;",
    bi = "return a - b;",
    wi = "return a * b;",
    Ci = "\nif (a == b) {\n  return 1.0;\n};\nreturn a / b;",
    Ei = "return (a < 0.) ? b * a : a;",
    Ri = function (t, e, n) {
  this.variableNames = ["A", "B"], this.outputShape = Pr(e, n), this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + t + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
},
    Ii = "\n  // vec4 one = vec4(equal(a, b));\n  // return one + (vec4(1.0) - one) * a / b;\n  vec4 result = a / b;\n  if(a.x == b.x) {\n    result.x = 1.;\n  }\n  if(a.y == b.y) {\n    result.y = 1.;\n  }\n  if(a.z == b.z) {\n    result.z = 1.;\n  }\n  if(a.w == b.w) {\n    result.w = 1.;\n  }\n\n  return result;\n",
    ki = "\n  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));\n  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);\n",
    Si = function (t, e, n, r) {
  void 0 === r && (r = !1), this.variableNames = ["A", "B"], this.supportsBroadcasting = !0, this.packedInputs = !0, this.packedOutput = !0, this.outputShape = Pr(e, n);
  var o = this.outputShape.length,
      a = "";
  if (r) if (0 === o || 1 === k(this.outputShape)) a = "\n          result.y = 0.;\n          result.z = 0.;\n          result.w = 0.;\n        ";else if (a = "\n          " + ui(o) + " coords = getOutputCoords();\n        ", 1 === o) a += "\n            result.y = (coords + 1) >= " + this.outputShape[0] + " ? 0. : result.y;\n            result.z = 0.;\n            result.w = 0.;\n          ";else {
    var i = Xa("coords", o);
    a += "\n            bool nextRowOutOfBounds =\n              (" + i[o - 2] + " + 1) >= " + this.outputShape[o - 2] + ";\n            bool nextColOutOfBounds =\n              (" + i[o - 1] + " + 1) >= " + this.outputShape[o - 1] + ";\n            result.y = nextColOutOfBounds ? 0. : result.y;\n            result.z = nextRowOutOfBounds ? 0. : result.z;\n            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;\n          ";
  }
  this.userCode = "\n      vec4 binaryOperation(vec4 a, vec4 b) {\n        " + t + "\n      }\n\n      void main() {\n        vec4 a = getAAtOutCoords();\n        vec4 b = getBAtOutCoords();\n\n        vec4 result = binaryOperation(a, b);\n        " + a + "\n\n        setOutput(result);\n      }\n    ";
},
    Ai = function () {
  function t(t) {
    this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      uniform float minVal;\n      uniform float maxVal;\n\n      void main() {\n        float value = getAAtOutCoords();\n        if (isnan(value)) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, minVal, maxVal));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "minVal"), n.maxLoc = r.getUniformLocationNoThrow(o, "maxVal")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    Ti = function () {
  function t(t) {
    this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t, this.userCode = "\n      uniform float minVal;\n      uniform float maxVal;\n\n      void main() {\n        vec4 value = getAAtOutCoords();\n\n        if (any(isnan(value))) {\n          setOutput(value);\n          return;\n        }\n\n        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t, e) {
    var n = this;
    return function (r, o) {
      null == n.minLoc && (n.minLoc = r.getUniformLocationNoThrow(o, "minVal"), n.maxLoc = r.getUniformLocationNoThrow(o, "maxVal")), r.gl.uniform1f(n.minLoc, t), r.gl.uniform1f(n.maxLoc, e);
    };
  }, t;
}(),
    Di = function (t) {
  this.variableNames = ["real", "imag"], this.outputShape = t, this.userCode = "\n      void main() {\n        float re = abs(getRealAtOutCoords());\n        float im = abs(getImagAtOutCoords());\n        float mx = max(re, im);\n\n        // sadly the length function in glsl is not underflow-safe\n        // (at least not on Intel GPUs). So the safe solution is\n        // to ensure underflow-safety in all cases.\n        setOutput(\n          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))\n        );\n      }\n    ";
},
    Ni = function (t) {
  this.outputShape = [], this.outputShape = Sn(t, 1), this.variableNames = t.map(function (t, e) {
    return "T" + e;
  });
  var e = new Array(t.length - 1);
  e[0] = t[0][1];

  for (var n = 1; n < e.length; n++) e[n] = e[n - 1] + t[n][1];

  var r = ["if (yC < " + e[0] + ") setOutput(getT0(yR, yC));"];

  for (n = 1; n < e.length; n++) {
    var o = e[n - 1];
    r.push("else if (yC < " + e[n] + ") setOutput(getT" + n + "(yR, yC-" + o + "));");
  }

  var a = e.length,
      i = e[e.length - 1];
  r.push("else setOutput(getT" + a + "(yR, yC-" + i + "));"), this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int yR = coords.x;\n        int yC = coords.y;\n\n        " + r.join("\n        ") + "\n      }\n    ";
},
    Fi = function (t, e) {
  this.packedInputs = !0, this.packedOutput = !0, this.outputShape = [], this.outputShape = Sn(t, e);
  var n = this.outputShape,
      r = n.length,
      o = ui(r),
      a = Xa("coords", r),
      i = ["x", "y", "z", "w", "u", "v"].slice(0, r);
  this.variableNames = t.map(function (t, e) {
    return "T" + e;
  });
  var s = new Array(t.length - 1);
  s[0] = t[0][e];

  for (var u = 1; u < s.length; u++) s[u] = s[u - 1] + t[u][e];

  var c = i[e],
      l = i.slice(-2),
      h = i.join(),
      f = "if (" + c + " < " + s[0] + ") {\n        return getChannel(\n            getT0(" + h + "), vec2(" + l.join() + "));\n        }";

  for (u = 1; u < s.length; u++) {
    var d = s[u - 1];
    f += "\n        if (" + c + " < " + s[u] + "  && " + c + " >= " + s[u - 1] + ") {\n          return getChannel(\n            getT" + u + "(" + _i(i, c, d) + "),\n            vec2(" + _i(l, c, d) + "));\n        }";
  }

  var p = s.length,
      v = s[s.length - 1];
  f += "\n        return getChannel(\n          getT" + p + "(" + _i(i, c, v) + "),\n          vec2(" + _i(l, c, v) + "));", this.userCode = "\n      float getValue(" + i.map(function (t) {
    return "int " + t;
  }) + ") {\n        " + f + "\n      }\n\n      void main() {\n        " + o + " coords = getOutputCoords();\n        vec4 result = vec4(getValue(" + a + "), 0., 0., 0.);\n\n        " + a[r - 1] + " = " + a[r - 1] + " + 1;\n        if (" + a[r - 1] + " < " + n[r - 1] + ") {\n          result.g = getValue(" + a + ");\n        }\n\n        " + a[r - 2] + " = " + a[r - 2] + " + 1;\n        if (" + a[r - 2] + " < " + n[r - 2] + ") {\n          result.a = getValue(" + a + ");\n        }\n\n        " + a[r - 1] + " = " + a[r - 1] + " - 1;\n        if (" + a[r - 2] + " < " + n[r - 2] + " &&\n            " + a[r - 1] + " < " + n[r - 1] + ") {\n          result.b = getValue(" + a + ");\n        }\n        setOutput(result);\n      }\n    ";
};

function _i(t, e, n) {
  var r = t.indexOf(e);
  return t.map(function (t, e) {
    return e === r ? t + " - " + n : t;
  }).join();
}

var Oi = function (t) {
  this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
  var e = t.strideHeight,
      n = t.strideWidth,
      r = t.padInfo.top,
      o = t.padInfo.left,
      a = "channelsLast" === t.dataFormat;
  this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int d2 = coords.w;\n\n        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              if (" + a + ") {\n                float dyValue = getDy(b, yR, yC, d2);\n                float xValue = getX(b, xR, xC, d1);\n                dotProd += (xValue * dyValue);\n              } else {\n                float dyValue = getDy(b, d2, yR, yC);\n                float xValue = getX(b, d1, xR, xC);\n                dotProd += (xValue * dyValue);\n              }\n\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Mi = function (t) {
  this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
  var e = t.filterHeight,
      n = t.filterWidth,
      r = t.strideHeight,
      o = t.strideWidth,
      a = "channelsLast" === t.dataFormat,
      i = e - 1 - t.padInfo.top,
      s = n - 1 - t.padInfo.left,
      u = a ? 1 : 2,
      c = a ? 2 : 3,
      l = a ? 3 : 1;
  this.userCode = "\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[" + l + "];\n\n        ivec2 dyCorner = ivec2(coords[" + u + "], coords[" + c + "]) - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n\n              if (" + a + ") {\n                float xValue = getDy(batch, idyR, idyC, d2);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              } else {\n                float xValue = getDy(batch, d2, idyR, idyC);\n                float wValue = getW(wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Bi = function (t) {
  this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
  var e = t.strideDepth,
      n = t.strideHeight,
      r = t.strideWidth,
      o = t.padInfo.front,
      a = t.padInfo.top,
      i = t.padInfo.left;
  this.userCode = "\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int wF = coords.x;\n        int wR = coords.y;\n        int wC = coords.z;\n        int d1 = coords.w;\n        int d2 = coords.u;\n\n        float dotProd = 0.0;\n\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yF = 0; yF < " + t.outDepth + "; yF++) {\n            int xF = wF + yF * " + e + " - " + o + ";\n\n            if (xF < 0 || xF >= " + t.inDepth + ") {\n              continue;\n            }\n\n            for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n              int xR = wR + yR * " + n + " - " + a + ";\n\n              if (xR < 0 || xR >= " + t.inHeight + ") {\n                continue;\n              }\n\n              for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n                int xC = wC + yC * " + r + " - " + i + ";\n\n                if (xC < 0 || xC >= " + t.inWidth + ") {\n                  continue;\n                }\n\n                float dyValue = getDy(b, yF, yR, yC, d2);\n                float xValue = getX(b, xF, xR, xC, d1);\n                dotProd += (xValue * dyValue);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Pi = function (t) {
  this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
  var e = t.filterDepth,
      n = t.filterHeight,
      r = t.filterWidth,
      o = t.strideDepth,
      a = t.strideHeight,
      i = t.strideWidth,
      s = e - 1 - t.padInfo.front,
      u = n - 1 - t.padInfo.top,
      c = r - 1 - t.padInfo.left;
  this.userCode = "\n      const ivec3 pads = ivec3(" + s + ", " + u + ", " + c + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d1 = coords.u;\n\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyFCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + e + "; wF++) {\n          float dyF = float(dyFCorner + wF) / " + o + ".0;\n\n          if (dyF < 0.0 || dyF >= " + t.outDepth + ".0 || fract(dyF) > 0.0) {\n            continue;\n          }\n          int idyF = int(dyF);\n\n          int wFPerm = " + e + " - 1 - wF;\n\n          for (int wR = 0; wR < " + n + "; wR++) {\n            float dyR = float(dyRCorner + wR) / " + a + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n              fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            int wRPerm = " + n + " - 1 - wR;\n\n            for (int wC = 0; wC < " + r + "; wC++) {\n              float dyC = float(dyCCorner + wC) / " + i + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              int wCPerm = " + r + " - 1 - wC;\n\n              for (int d2 = 0; d2 < " + t.outChannels + "; d2++) {\n                float xValue = getDy(batch, idyF, idyR, idyC, d2);\n                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);\n                dotProd += xValue * wValue;\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Li = function (t) {
  this.variableNames = ["x", "dy"], this.outputShape = t.filterShape;
  var e = t.strideHeight,
      n = t.strideWidth,
      r = t.padInfo.top,
      o = t.padInfo.left,
      a = t.outChannels / t.inChannels;
  this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int wR = coords.x;\n        int wC = coords.y;\n        int d1 = coords.z;\n        int dm = coords.w;\n        int d2 = d1 * " + a + " + dm;\n\n        float dotProd = 0.0;\n\n        // TO DO: Vec4 over the batch size\n        for (int b = 0; b < " + t.batchSize + "; b++) {\n          for (int yR = 0; yR < " + t.outHeight + "; yR++) {\n            int xR = wR + yR * " + e + " - " + r + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int yC = 0; yC < " + t.outWidth + "; yC++) {\n              int xC = wC + yC * " + n + " - " + o + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float dyValue = getDy(b, yR, yC, d2);\n              float xValue = getX(b, xR, xC, d1);\n              dotProd += (xValue * dyValue);\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Wi = function (t) {
  this.variableNames = ["dy", "W"], this.outputShape = t.inShape;
  var e = t.filterHeight,
      n = t.filterWidth,
      r = t.strideHeight,
      o = t.strideWidth,
      a = e - 1 - t.padInfo.top,
      i = n - 1 - t.padInfo.left,
      s = t.outChannels / t.inChannels;
  this.userCode = "\n      const ivec2 pads = ivec2(" + a + ", " + i + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d1 = coords[3];\n        ivec2 dyCorner = coords.yz - pads;\n        int dyRCorner = dyCorner.x;\n        int dyCCorner = dyCorner.y;\n\n        float dotProd = 0.0;\n\n        for (int wR = 0; wR < " + e + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + r + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          int wRPerm = " + e + " - 1 - wR;\n\n          for (int wC = 0; wC < " + n + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + o + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            int wCPerm = " + n + " - 1 - wC;\n\n            // TO DO: Vec4 over the channelMul\n            for (int dm = 0; dm < " + s + "; dm++) {\n              int d2 = d1 * " + s + " + dm;\n              float xValue = getDy(batch, idyR, idyC, d2);\n              float wValue = getW(wRPerm, wCPerm, d1, dm);\n              dotProd += xValue * wValue;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Ui = function (t, e, n, r) {
  void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.outputShape = t.outShape;
  var o = t.padInfo.top,
      a = t.padInfo.left,
      i = t.strideHeight,
      s = t.strideWidth,
      u = t.dilationHeight,
      c = t.dilationWidth,
      l = t.filterHeight,
      h = t.filterWidth,
      f = 4 * Math.floor(t.inChannels / 4),
      d = t.inChannels % 4,
      p = "channelsLast" === t.dataFormat,
      v = p ? 1 : 2,
      g = p ? 2 : 3,
      m = p ? 3 : 1,
      y = "",
      x = "";
  n && (y = r ? "float activation(float a) {\n          float b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "\n          float activation(float x) {\n            " + n + "\n          }\n        ", x = "result = activation(result);");
  var b = e ? "result += getBiasAtOutCoords();" : "";
  e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + y + "\n\n      const ivec2 strides = ivec2(" + i + ", " + s + ");\n      const ivec2 pads = ivec2(" + o + ", " + a + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d2 = coords[" + m + "];\n\n        ivec2 xRCCorner =\n            ivec2(coords[" + v + "], coords[" + g + "]) * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + l + "; wR++) {\n          int xR = xRCorner + wR * " + u + ";\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + h + "; wC++) {\n            int xC = xCCorner + wC * " + c + ";\n\n            if (xC < 0 || xC >= " + t.inWidth + ") {\n              continue;\n            }\n\n            for (int d1 = 0; d1 < " + f + "; d1 += 4) {\n              vec4 wValues = vec4(\n                getW(wR, wC, d1, d2),\n                getW(wR, wC, d1 + 1, d2),\n                getW(wR, wC, d1 + 2, d2),\n                getW(wR, wC, d1 + 3, d2)\n              );\n\n              if (" + p + ") {\n                vec4 xValues = vec4(\n                  getX(batch, xR, xC, d1),\n                  getX(batch, xR, xC, d1 + 1),\n                  getX(batch, xR, xC, d1 + 2),\n                  getX(batch, xR, xC, d1 + 3)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec4 xValues = vec4(\n                  getX(batch, d1, xR, xC),\n                  getX(batch, d1 + 1, xR, xC),\n                  getX(batch, d1 + 2, xR, xC),\n                  getX(batch, d1 + 3, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n            }\n\n            if (" + (1 === d) + ") {\n\n              if (" + p + ") {\n                dotProd +=\n                    getX(batch, xR, xC, " + f + ") *\n                    getW(wR, wC, " + f + ", d2);\n              } else {\n                dotProd +=\n                    getX(batch, " + f + ", xR, xC) *\n                    getW(wR, wC, " + f + ", d2);\n              }\n\n            } else if (" + (2 === d) + ") {\n              vec2 wValues = vec2(\n                getW(wR, wC, " + f + ", d2),\n                getW(wR, wC, " + f + " + 1, d2)\n              );\n\n              if (" + p + ") {\n                vec2 xValues = vec2(\n                  getX(batch, xR, xC, " + f + "),\n                  getX(batch, xR, xC, " + f + " + 1)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec2 xValues = vec2(\n                  getX(batch, " + f + ", xR, xC),\n                  getX(batch, " + f + " + 1, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n\n            } else if (" + (3 === d) + ") {\n              vec3 wValues = vec3(\n                getW(wR, wC, " + f + ", d2),\n                getW(wR, wC, " + f + " + 1, d2),\n                getW(wR, wC, " + f + " + 2, d2)\n              );\n\n              if (" + p + ") {\n                vec3 xValues = vec3(\n                  getX(batch, xR, xC, " + f + "),\n                  getX(batch, xR, xC, " + f + " + 1),\n                  getX(batch, xR, xC, " + f + " + 2)\n                );\n                dotProd += dot(xValues, wValues);\n              } else {\n                vec3 xValues = vec3(\n                  getX(batch, " + f + ", xR, xC),\n                  getX(batch, " + f + " + 1, xR, xC),\n                  getX(batch, " + f + " + 2, xR, xC)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n\n            }\n          }\n        }\n\n        float result = dotProd;\n        " + b + "\n        " + x + "\n        setOutput(result);\n      }\n    ";
},
    Vi = function (t) {
  this.variableNames = ["x", "W"], this.outputShape = t.outShape;
  var e = t.padInfo.front,
      n = t.padInfo.top,
      r = t.padInfo.left,
      o = t.strideDepth,
      a = t.strideHeight,
      i = t.strideWidth,
      s = t.dilationDepth,
      u = t.dilationHeight,
      c = t.dilationWidth,
      l = t.filterDepth,
      h = t.filterHeight,
      f = t.filterWidth,
      d = 4 * Math.floor(t.inChannels / 4),
      p = t.inChannels % 4;
  this.userCode = "\n      const ivec3 strides = ivec3(" + o + ", " + a + ", " + i + ");\n      const ivec3 pads = ivec3(" + e + ", " + n + ", " + r + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int d2 = coords.u;\n\n        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n        int xFCorner = xFRCCorner.x;\n        int xRCorner = xFRCCorner.y;\n        int xCCorner = xFRCCorner.z;\n\n        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get\n        // y(yF, yR, yC, d2). ? = to be determined. : = across all\n        // values in that axis.\n        float dotProd = 0.0;\n        for (int wF = 0; wF < " + l + "; wF++) {\n          int xF = xFCorner + wF * " + s + ";\n\n          if (xF < 0 || xF >= " + t.inDepth + ") {\n            continue;\n          }\n\n          for (int wR = 0; wR < " + h + "; wR++) {\n            int xR = xRCorner + wR * " + u + ";\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + f + "; wC++) {\n              int xC = xCCorner + wC * " + c + ";\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              for (int d1 = 0; d1 < " + d + "; d1 += 4) {\n                vec4 xValues = vec4(\n                  getX(batch, xF, xR, xC, d1),\n                  getX(batch, xF, xR, xC, d1 + 1),\n                  getX(batch, xF, xR, xC, d1 + 2),\n                  getX(batch, xF, xR, xC, d1 + 3)\n                );\n                vec4 wValues = vec4(\n                  getW(wF, wR, wC, d1, d2),\n                  getW(wF, wR, wC, d1 + 1, d2),\n                  getW(wF, wR, wC, d1 + 2, d2),\n                  getW(wF, wR, wC, d1 + 3, d2)\n                );\n\n                dotProd += dot(xValues, wValues);\n              }\n\n              if (" + (1 === p) + ") {\n                dotProd +=\n                  getX(batch, xF, xR, xC, " + d + ") *\n                  getW(wF, wR, wC, " + d + ", d2);\n              } else if (" + (2 === p) + ") {\n                vec2 xValues = vec2(\n                  getX(batch, xF, xR, xC, " + d + "),\n                  getX(batch, xF, xR, xC, " + d + " + 1)\n                );\n                vec2 wValues = vec2(\n                  getW(wF, wR, wC, " + d + ", d2),\n                  getW(wF, wR, wC, " + d + " + 1, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              } else if (" + (3 === p) + ") {\n                vec3 xValues = vec3(\n                  getX(batch, xF, xR, xC, " + d + "),\n                  getX(batch, xF, xR, xC, " + d + " + 1),\n                  getX(batch, xF, xR, xC, " + d + " + 2)\n                );\n                vec3 wValues = vec3(\n                  getW(wF, wR, wC, " + d + ", d2),\n                  getW(wF, wR, wC, " + d + " + 1, d2),\n                  getW(wF, wR, wC, " + d + " + 2, d2)\n                );\n                dotProd += dot(xValues, wValues);\n              }\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    zi = function (t, e, n, r) {
  void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.outputShape = t.outShape;
  var o = t.inHeight,
      a = t.inWidth,
      i = t.padInfo.top,
      s = t.padInfo.left,
      u = t.strideHeight,
      c = t.strideWidth,
      l = t.dilationHeight,
      h = t.dilationWidth,
      f = t.filterHeight,
      d = t.filterWidth,
      p = t.outChannels / t.inChannels,
      v = "",
      g = "";
  n && (v = r ? "float activation(float a) {\n          float b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "\n          float activation(float x) {\n            " + n + "\n          }\n        ", g = "result = activation(result);");
  var m = e ? "result += getBiasAtOutCoords();" : "";
  e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + v + "\n\n      const ivec2 strides = ivec2(" + u + ", " + c + ");\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2 / " + p + ";\n        int q = d2 - d1 * " + p + ";\n\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.\n        for (int wR = 0; wR < " + f + "; wR++) {\n          int xR = xRCorner + wR * " + l + ";\n\n          if (xR < 0 || xR >= " + o + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + d + "; wC++) {\n            int xC = xCCorner + wC * " + h + ";\n\n            if (xC < 0 || xC >= " + a + ") {\n              continue;\n            }\n\n            float xVal = getX(batch, xR, xC, d1);\n            float wVal = getW(wR, wC, d1, q);\n            dotProd += xVal * wVal;\n          }\n        }\n\n        float result = dotProd;\n        " + m + "\n        " + g + "\n        setOutput(result);\n      }\n    ";
},
    Gi = function (t, e, n, r) {
  void 0 === e && (e = !1), void 0 === n && (n = null), void 0 === r && (r = !1), this.variableNames = ["x", "W"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t.outShape;

  for (var o = t.inHeight, a = t.inWidth, i = t.padInfo.top, s = t.padInfo.left, u = t.strideHeight, c = t.strideWidth, l = t.dilationHeight, h = t.dilationWidth, f = t.filterHeight, d = t.filterWidth, p = d, v = "int xR; int xC; int xCOffset;", g = 0; g < f; g++) for (var m = 0; m < d; m++) v += "\n          vec4 xTexelR" + g + "C" + 2 * m + " = vec4(0.);\n          vec4 wR" + g + "C" + m + " = vec4(0.);\n          vec4 xR" + g + "C" + m + " = vec4(0.);";

  for (g = 0; g < f; g++) for (var y = 0; y < p; y++) {
    if (v += "\n          xR = xRCorner + " + g * l + ";\n          xC = xCCorner + " + (m = 2 * y) * h + ";\n        ", 1 === c) {
      if (m < d && (v += s % 2 == 1 ? "\n                xCOffset = xC + 1;\n                if(xR >= 0 && xR < " + o + " && xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + m + " = getX(batch, xR, xCOffset, d1);\n\n                  // Need to manually clear unused channels in case\n                  // we're reading from recycled texture.\n                  if(xCOffset + 1 >= " + a + ") {\n                    xTexelR" + g + "C" + m + ".zw = vec2(0.);\n                  }\n                } else {\n                  xTexelR" + g + "C" + m + " = vec4(0.);\n                }\n\n                xCOffset = xC + 1 - 2;\n                if(xR >= 0 && xR < " + o + " && xCOffset >= 0 && xCOffset < " + a + ") {\n                  vec4 previous = getX(batch, xR, xCOffset, d1);\n\n                  // Need to manually clear unused channels in case\n                  // we're reading from recycled texture.\n                  if(xCOffset + 1 >= " + a + ") {\n                    previous.zw = vec2(0.);\n                  }\n\n                  xR" + g + "C" + m + " = vec4(previous.zw, xTexelR" + g + "C" + m + ".xy);\n                } else {\n                  xR" + g + "C" + m + " = vec4(0, 0, xTexelR" + g + "C" + m + ".xy);\n                }\n              " : "\n                if(xR >= 0 && xR < " + o + " && xC >= 0 && xC < " + a + ") {\n                  xTexelR" + g + "C" + m + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + g + "C" + m + " = vec4(0.);\n                }\n\n                xR" + g + "C" + m + " = xTexelR" + g + "C" + m + ";\n              ", m + 1 < d)) {
        var x = s % 2 == 0 ? b(h) : h;
        h % 2 == 0 && s % 2 == 1 || h % 2 != 0 && s % 2 != 1 ? (v += "\n                  xCOffset = xC + " + s % 2 + " + " + x + ";\n\n                  if(xR >= 0 && xR < " + o + " &&\n                    xCOffset >= 0 && xCOffset < " + a + ") {\n                    xTexelR" + g + "C" + (m + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n                ", h > 1 && (v += "\n                    xCOffset -= 2;\n                    if(xR >= 0 && xR < " + o + " &&\n                      xCOffset >= 0 && xCOffset < " + a + ") {\n                      xTexelR" + g + "C" + m + " = getX(batch, xR, xCOffset, d1);\n                    } else {\n                      xTexelR" + g + "C" + m + " = vec4(0.);\n                    }\n                  "), v += "\n                  xR" + g + "C" + (m + 1) + " = vec4(\n                    xTexelR" + g + "C" + m + ".zw, xTexelR" + g + "C" + (m + 2) + ".xy);\n                ") : v += "\n                  xCOffset = xC + " + x + ";\n\n                  if(xR >= 0 && xR < " + o + " &&\n                    xCOffset >= 0 && xCOffset < " + a + ") {\n                    xTexelR" + g + "C" + (m + 2) + " = getX(batch, xR, xCOffset, d1);\n                  }\n\n                  xR" + g + "C" + (m + 1) + " = xTexelR" + g + "C" + (m + 2) + ";\n                ";
      }
    } else m < d && (v += "\n              if(xR >= 0 && xR < " + o + ") {\n            ", s % 2 == 1 ? (v += "\n                xCOffset = xC + 1 - " + c + ";\n                if(xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + m + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + g + "C" + m + " = vec4(0.);\n                }\n\n                if(xC + 1 >= 0 && xC + 1 < " + a + ") {\n                  xTexelR" + g + "C" + (m + 2) + " = getX(batch, xR, xC + 1, d1);\n                } else {\n                  xTexelR" + g + "C" + (m + 2) + " = vec4(0.);\n                }\n\n                xR" + g + "C" + m + " = vec4(\n                  xTexelR" + g + "C" + m + ".zw, xTexelR" + g + "C" + (m + 2) + ".zw);\n              ", m + 1 < d && (v += "\n                  vec4 final = vec4(0.);\n                  xCOffset = xC + 1 + " + c + ";\n                  if(xCOffset >= 0 && xCOffset < " + a + ") {\n                    final = getX(batch, xR, xCOffset, d1);\n                  }\n                  xR" + g + "C" + (m + 1) + " = vec4(xTexelR" + g + "C" + (m + 2) + ".xy, final.xy);\n                ")) : (v += "\n                if(xC >= 0 && xC < " + a + ") {\n                  xTexelR" + g + "C" + m + " = getX(batch, xR, xC, d1);\n                } else {\n                  xTexelR" + g + "C" + m + " = vec4(0.);\n                }\n\n                xCOffset = xC + " + c + ";\n                if(xCOffset >= 0 && xCOffset < " + a + ") {\n                  xTexelR" + g + "C" + (m + 2) + " = getX(batch, xR, xCOffset, d1);\n                } else {\n                  xTexelR" + g + "C" + (m + 2) + " = vec4(0.);\n                }\n\n                xR" + g + "C" + m + " = vec4(\n                  xTexelR" + g + "C" + m + ".xy, xTexelR" + g + "C" + (m + 2) + ".xy);\n              ", m + 1 < d && (v += "\n                  xR" + g + "C" + (m + 1) + " = vec4(\n                    xTexelR" + g + "C" + m + ".zw, xTexelR" + g + "C" + (m + 2) + ".zw);\n                ")), v += "}");

    m < d && (v += "\n            vec4 wTexelR" + g + "C" + m + " = getW(" + g + ", " + m + ", d1, q);\n            wR" + g + "C" + m + " = vec4(wTexelR" + g + "C" + m + ".xz, wTexelR" + g + "C" + m + ".xz);\n          ", m + 1 < d && (v += "\n              vec4 wTexelR" + g + "C" + (m + 1) + " = getW(" + g + ", " + (m + 1) + ", d1, q);\n              wR" + g + "C" + (m + 1) + " =\n                vec4(wTexelR" + g + "C" + (m + 1) + ".xz, wTexelR" + g + "C" + (m + 1) + ".xz);"));
  }

  for (g = 0; g < f; g++) for (m = 0; m < d; m++) v += "dotProd += xR" + g + "C" + m + " * wR" + g + "C" + m + ";";

  var w = "",
      C = "";
  n && (w = r ? "vec4 activation(vec4 a) {\n          vec4 b = getPreluActivationWeightsAtOutCoords();\n          " + n + "\n        }" : "vec4 activation(vec4 x) {\n          " + n + "\n        }", C = "result = activation(result);");
  var E = e ? "result += getBiasAtOutCoords();" : "";
  e && this.variableNames.push("bias"), r && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + w + "\n\n      const ivec2 strides = ivec2(" + u + ", " + c + ");\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n\n        ivec4 coords = getOutputCoords();\n        int batch = coords.x;\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int d2 = coords.w;\n        int d1 = d2;\n        int q = 0;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        vec4 dotProd = vec4(0.);\n\n        " + v + "\n\n        vec4 result = dotProd;\n        " + E + "\n        " + C + "\n        setOutput(result);\n      }\n    ";
},
    Hi = function (t, e, n, r, o) {
  this.variableNames = ["Image", "Boxes", "BoxInd"], this.outputShape = [];
  var a = t[0],
      i = t[1],
      s = t[2],
      u = t[3],
      c = e[0],
      l = n[0],
      h = n[1];
  this.outputShape = [c, l, h, u];
  var f = "bilinear" === r ? 1 : 0,
      d = [i - 1 + ".0", s - 1 + ".0"],
      p = d[0],
      v = d[1],
      g = l > 1 ? ["" + (i - 1) / (l - 1), "(y2-y1) * height_ratio", "y1*" + p + " + float(y)*(height_scale)"] : ["0.0", "0.0", "0.5 * (y1+y2) * " + p],
      m = g[0],
      y = g[1],
      x = g[2],
      b = h > 1 ? ["" + (s - 1) / (h - 1), "(x2-x1) * width_ratio", "x1*" + v + " + float(x)*(width_scale)"] : ["0.0", "0.0", "0.5 * (x1+x2) * " + v],
      w = b[0],
      C = b[1],
      E = b[2];
  this.userCode = "\n      const float height_ratio = float(" + m + ");\n      const float width_ratio = float(" + w + ");\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int y = coords[1];\n        int x = coords[2];\n        int d = coords[3];\n\n        // get box vals\n        float y1 = getBoxes(b,0);\n        float x1 = getBoxes(b,1);\n        float y2 = getBoxes(b,2);\n        float x2 = getBoxes(b,3);\n\n        // get image in batch index\n        int bInd = round(getBoxInd(b));\n        if(bInd < 0 || bInd >= " + a + ") {\n          return;\n        }\n\n        float height_scale = " + y + ";\n        float width_scale = " + C + ";\n\n        float in_y = " + x + ";\n        if( in_y < 0.0 || in_y > " + p + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n        float in_x = " + E + ";\n        if( in_x < 0.0 || in_x > " + v + " ) {\n          setOutput(float(" + o + "));\n          return;\n        }\n\n        vec2 sourceFracIndexCR = vec2(in_x,in_y);\n        if(" + f + " == 1) {\n          // Compute the four integer indices.\n          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);\n          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));\n\n          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);\n          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);\n          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);\n          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);\n\n          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);\n\n          float top = topLeft + (topRight - topLeft) * fracCR.x;\n          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;\n          float newValue = top + (bottom - top) * fracCR.y;\n          setOutput(newValue);\n        } else {\n          // Compute the coordinators of nearest neighbor point.\n          ivec2 sourceNearestCR = ivec2(floor(\n            sourceFracIndexCR + vec2(0.5,0.5)));\n          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);\n          setOutput(newValue);\n        }\n      }\n    ";
},
    qi = function (t, e, n) {
  this.variableNames = ["x"], this.outputShape = t;
  var r = t.length,
      o = t[t.length - 1],
      a = n ? "<" : ">";

  this.userCode = "\n      int getIndex(int i) {\n        " + (n ? "return " + o + " -i - 1;" : "return i;") + "\n      }\n\n      void main() {\n        " + ui(r) + " coords = getOutputCoords();\n        int end = " + Ki(r, "coords") + ";\n        float val = 0.0;\n        for (int i = " + o + " - 1; i >= 0; i -= 1) {\n          int idx = getIndex(i);\n          if (idx " + a + " end) {\n            continue;\n          }\n          if (idx == end && " + e + ") {\n            continue;\n          }\n          " + Ki(r, "coords") + " = idx;\n          val += getX(" + function (t, e) {
    if (1 === t) return "" + e;
    if (2 === t) return e + ".x, " + e + ".y";
    if (3 === t) return e + ".x, " + e + ".y, " + e + ".z";
    if (4 === t) return e + ".x, " + e + ".y, " + e + ".z, " + e + ".w";
    throw Error("Cumulative sum for rank " + t + " is not yet supported");
  }(r, "coords") + ");\n        }\n        setOutput(val);\n      }\n    ";
};

function Ki(t, e) {
  if (1 === t) return "" + e;
  if (2 === t) return e + ".y";
  if (3 === t) return e + ".z";
  if (4 === t) return e + ".w";
  throw Error("Cumulative sum for rank " + t + " is not yet supported");
}

var ji = function (t) {
  this.variableNames = ["A"], this.packedInputs = !1, this.packedOutput = !0, this.outPackingScheme = Vt.DENSE;
  var e = Yt(t),
      n = Ya();
  this.outputShape = t, this.userCode = "\n      ivec3 outCoordsFromFlatIndex(int index) {\n        " + $a(["r", "c", "d"], t) + "\n        return ivec3(r, c, d);\n      }\n\n      void main() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n          vec2(" + e[0] + ", " + e[1] + "));\n        int index = 4 * (resTexRC.x * " + e[1] + " + resTexRC.y);\n\n        vec4 result = vec4(0.);\n\n        for (int i=0; i<4; i++) {\n          int flatIndex = index + i;\n          ivec3 rc = outCoordsFromFlatIndex(flatIndex);\n          result[i] = getA(rc.x, rc.y, rc.z);\n        }\n\n        " + n.output + " = result;\n      }\n    ";
},
    Xi = function (t) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outPackingScheme = Vt.DENSE;
  var e = Yt(t),
      n = Ya();
  this.outputShape = t, this.userCode = "\n      ivec3 outCoordsFromFlatIndex(int index) {\n        " + $a(["r", "c", "d"], t) + "\n        return ivec3(r, c, d);\n      }\n\n      void main() {\n        ivec2 resTexRC = ivec2(resultUV.yx *\n          vec2(" + e[0] + ", " + e[1] + "));\n        int index = 4 * (resTexRC.x * " + e[1] + " + resTexRC.y);\n\n        vec4 result = vec4(0.);\n\n        for (int i=0; i<4; i++) {\n          int flatIndex = index + i;\n          ivec3 rc = outCoordsFromFlatIndex(flatIndex);\n          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));\n        }\n\n        " + n.output + " = result;\n      }\n    ";
},
    Yi = function () {
  function t(t, e, n) {
    this.variableNames = ["x"], this.outputShape = [], this.outputShape = t, this.blockSize = e, this.dataFormat = n, this.userCode = "\n    void main() {\n      ivec4 coords = getOutputCoords();\n      int b = coords[0];\n      int h = " + this.getHeightCoordString() + ";\n      int w = " + this.getWidthCoordString() + ";\n      int d = " + this.getDepthCoordString() + ";\n\n      int in_h = h / " + e + ";\n      int offset_h = imod(h, " + e + ");\n      int in_w = w / " + e + ";\n      int offset_w = imod(w, " + e + ");\n      int offset_d = (offset_h * " + e + " + offset_w) *\n        " + this.getOutputDepthSize() + ";\n      int in_d = d + offset_d;\n\n      float result = " + this.getInputSamplingString() + ";\n      setOutput(result);\n    }\n  ";
  }

  return t.prototype.getHeightCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[1]" : "coords[2]";
  }, t.prototype.getWidthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[2]" : "coords[3]";
  }, t.prototype.getDepthCoordString = function () {
    return "NHWC" === this.dataFormat ? "coords[3]" : "coords[1]";
  }, t.prototype.getOutputDepthSize = function () {
    return "NHWC" === this.dataFormat ? this.outputShape[3] : this.outputShape[1];
  }, t.prototype.getInputSamplingString = function () {
    return "NHWC" === this.dataFormat ? "getX(b, in_h, in_w, in_d)" : "getX(b, in_d, in_h, in_w)";
  }, t;
}(),
    $i = function (t) {
  this.variableNames = ["X"], this.outputShape = [t, t], this.userCode = "\n      void main() {\n          ivec2 coords = getOutputCoords();\n          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;\n          setOutput(val);\n      }\n    ";
},
    Qi = function (t) {
  this.variableNames = ["A"], this.outTexUsage = zt.DOWNLOAD;
  var e = Ya();
  this.outputShape = t, this.userCode = "\n      " + Ja + "\n\n      void main() {\n        float x = getAAtOutCoords();\n        " + e.output + " = encode_float(x);\n      }\n    ";
},
    Ji = function (t) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !1, this.outTexUsage = zt.DOWNLOAD;
  var e = Ya();
  this.outputShape = t, this.userCode = "\n      " + Ja + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));\n        " + e.output + " = encode_float(x);\n      }\n    ";
},
    Zi = function (t, e, n) {
  void 0 === n && (n = !1), this.variableNames = ["A"];
  var r = Ya(),
      o = e[0],
      a = e[1];
  this.outputShape = t;
  var i = "result";
  n && (i = "floor(result * 255. + 0.5)"), this.userCode = "\n      " + Qa(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        int flatIndex = getFlatIndex(coords);\n        int offset = imod(flatIndex, 4);\n\n        flatIndex = idiv(flatIndex, 4, 1.);\n        \n        int r = flatIndex / " + a + ";\n        int c = imod(flatIndex, " + a + ");\n        vec2 uv = (vec2(c, r) + halfCR) / vec2(" + a + ".0, " + o + ".0);\n        vec4 values = " + r.texture2D + "(A, uv);\n\n        float result;\n\n        if(offset == 0) {\n          result = values[0];\n        } else if(offset == 1) {\n          result = values[1];\n        } else if(offset == 2) {\n          result = values[2];\n        } else {\n          result = values[3];\n        }\n\n        " + r.output + " = vec4(" + i + ", 0., 0., 0.);\n      }\n    ";
},
    ts = function (t, e, n) {
  void 0 === n && (n = !1), this.variableNames = ["A"], this.packedInputs = !1, this.packedOutput = !0;
  var r = Ya(),
      o = e[0],
      a = e[1];
  this.outputShape = t;
  var i = "",
      s = "result";
  n && (s = "floor(result * 255. + 0.5)");

  for (var u = 0; u <= 1; u++) for (var c = 0; c <= 1; c++) {
    var l = 2 * u + c;
    i += "\n          localCoords = coords;\n          if(localCoords[2] + " + c + " < " + t[2] + ") {\n            localCoords[2] += " + c + ";\n            if(localCoords[1] + " + u + " < " + t[1] + ") {\n              localCoords[1] += " + u + ";\n\n              flatIndex = getFlatIndex(localCoords);\n              offset = imod(flatIndex, 4);\n\n              flatIndex = idiv(flatIndex, 4, 1.);\n\n              r = flatIndex / " + a + ";\n              c = imod(flatIndex, " + a + ");\n              uv = (vec2(c, r) + halfCR) / vec2(" + a + ".0, " + o + ".0);\n              values = " + r.texture2D + "(A, uv);\n\n              if(offset == 0) {\n                result[" + l + "] = values[0];\n              } else if(offset == 1) {\n                result[" + l + "] = values[1];\n              } else if(offset == 2) {\n                result[" + l + "] = values[2];\n              } else {\n                result[" + l + "] = values[3];\n              }\n            }\n          }\n        ";
  }

  this.userCode = "\n      " + Qa(t) + "\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n\n        vec4 result = vec4(0.);\n        int flatIndex, r, c, offset;\n        ivec3 localCoords;\n        vec2 uv;\n        vec4 values;\n\n        " + i + "\n\n        " + r.output + " = " + s + ";\n      }\n    ";
},
    es = "return real * expR - imag * expI;",
    ns = "return real * expI + imag * expR;",
    rs = function (t, e, n) {
  this.variableNames = ["real", "imag"];
  var r = e[1];
  this.outputShape = e;
  var o = n ? "2.0 * " + Math.PI : "-2.0 * " + Math.PI,
      a = n ? r + ".0" : "1.0";
  this.userCode = "\n      const float exponentMultiplier = " + o + ";\n\n      float unaryOpComplex(float real, float expR, float imag, float expI) {\n        " + t + "\n      }\n\n      float mulMatDFT(int batch, int index) {\n        float indexRatio = float(index) / float(" + r + ");\n        float exponentMultiplierTimesIndexRatio =\n            exponentMultiplier * indexRatio;\n\n        float result = 0.0;\n\n        for (int i = 0; i < " + r + "; i++) {\n          // x = (-2|2 * PI / N) * index * i;\n          float x = exponentMultiplierTimesIndexRatio * float(i);\n          float expR = cos(x);\n          float expI = sin(x);\n          float real = getReal(batch, i);\n          float imag = getImag(batch, i);\n\n          result +=\n              unaryOpComplex(real, expR, imag, expI) / " + a + ";\n        }\n\n        return result;\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        setOutput(mulMatDFT(coords[0], coords[1]));\n      }\n    ";
},
    os = function () {
  function t(t, e) {
    this.outputShape = [], this.variableNames = ["x"], this.outputShape = t, this.userCode = "\n      uniform float value;\n      void main() {\n        // Input can be obtained from uniform value.\n        setOutput(value);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.valueLoc && (e.valueLoc = n.getUniformLocationNoThrow(r, "value")), n.gl.uniform1f(e.valueLoc, t);
    };
  }, t;
}(),
    as = function (t, e, n) {
  this.variableNames = ["A", "indices"];
  var r = t.slice();
  r[n] = e, this.outputShape = r, this.rank = r.length;

  var o = ui(this.rank),
      a = function (t, e) {
    var n = t.length;
    if (n > 4) throw Error("Gather for rank " + n + " is not yet supported");
    if (1 === n) return "int(getIndices(resRC))";

    for (var r = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], o = [], a = 0; a < t.length; a++) a === e ? o.push("int(getIndices(" + r[a] + "))") : o.push("" + r[a]);

    return o.join();
  }(t, n);

  this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
};

var is = function (t, e, n) {
  this.sliceDim = t, this.strides = e, this.variableNames = ["x", "indices"], this.outputShape = n;
  var r = ui(e.length),
      o = ui(n.length),
      a = this.sliceDim > 1 ? "strides[j]" : "strides";
  this.userCode = "\n        " + r + " strides = " + r + "(" + this.strides + ");\n         void main() {\n          " + o + " coords = getOutputCoords();\n          int flattenIndex = 0;\n          for (int j = 0; j < " + this.sliceDim + "; j++) {\n            int index = round(getIndices(coords[0], j));\n            flattenIndex += index * " + a + ";\n          }\n          setOutput(getX(flattenIndex, coords[1]));\n        }\n      ";
};

function ss(t, e) {
  var n = Ya();
  return oe(t, e, n.version + "\n    precision highp float;\n    " + n.attribute + " vec3 clipSpacePos;\n    " + n.attribute + " vec2 uv;\n    " + n.varyingVs + " vec2 resultUV;\n\n    void main() {\n      gl_Position = vec4(clipSpacePos, 1);\n      resultUV = uv;\n    }");
}

function us(t, e) {
  return fe(t, e, new Float32Array([-1, 1, 0, 0, 1, -1, -1, 0, 0, 0, 1, 1, 0, 1, 1, 1, -1, 0, 1, 0]));
}

function cs(t, e) {
  return de(t, e, new Uint16Array([0, 1, 2, 2, 1, 3]));
}

function ls(t, e, n, r, o, a, i) {
  ve(n, r);
  var s = pe(t, e),
      u = t.TEXTURE_2D;
  return Jt(t, e, function () {
    return t.bindTexture(u, s);
  }), Jt(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE);
  }), Jt(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }), Jt(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MIN_FILTER, t.NEAREST);
  }), Jt(t, e, function () {
    return t.texParameteri(u, t.TEXTURE_MAG_FILTER, t.NEAREST);
  }), Jt(t, e, function () {
    return t.texImage2D(u, 0, o, n, r, 0, a, i, null);
  }), Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  }), s;
}

function hs(t, e, n, r, o) {
  var a = Xt(n, r);
  return ls(t, e, a[0], a[1], o.internalFormatFloat, o.textureFormatFloat, t.FLOAT);
}

function fs(t, e, n, r, o) {
  var a = Xt(n, r);
  return ls(t, e, a[0], a[1], o.internalFormatHalfFloat, o.textureFormatFloat, o.textureTypeHalfFloat);
}

function ds(t, e, n, r, o) {
  var a = Xt(n, r);
  return ls(t, e, a[0], a[1], t.RGBA, t.RGBA, t.UNSIGNED_BYTE);
}

function ps(t, e, n, r, o) {
  var a = $t(n, r);
  return ls(t, e, a[0], a[1], o.internalFormatPackedFloat, t.RGBA, t.FLOAT);
}

function vs(t, e, n, r, o) {
  var a = $t(n, r);
  return ls(t, e, a[0], a[1], o.internalFormatPackedHalfFloat, t.RGBA, o.textureTypeHalfFloat);
}

function gs(t, e, n, r) {
  return Jt(t, e, function () {
    return t.bindBuffer(t.ARRAY_BUFFER, r);
  }), me(t, e, n, "clipSpacePos", r, 3, 20, 0) && me(t, e, n, "uv", r, 2, 20, 12);
}

function ms(t, e, n, r, o, a, i) {
  var s, u, c;
  Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  }), a instanceof Uint8Array ? (s = new Uint8Array(r * o * 4), u = t.UNSIGNED_BYTE, c = t.RGBA) : (s = new Float32Array(r * o * 4), u = t.FLOAT, c = i.internalFormatPackedFloat), s.set(a), Jt(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, c, r, o, 0, t.RGBA, u, s);
  }), Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function ys(t, e, n, r) {
  Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, n);
  }), r.data instanceof Uint8Array ? Jt(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, r.width, r.height, 0, t.RGBA, t.UNSIGNED_BYTE, r.data);
  }) : Jt(t, e, function () {
    return t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r);
  }), Jt(t, e, function () {
    return t.bindTexture(t.TEXTURE_2D, null);
  });
}

function xs(t, e, n, r, o) {
  var a = t.createBuffer();
  Jt(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, a);
  });
  var i = 16 * n * r;
  return Jt(t, e, function () {
    return t.bufferData(t.PIXEL_PACK_BUFFER, i, t.STREAM_READ);
  }), Jt(t, e, function () {
    return t.readPixels(0, 0, r, n, t.RGBA, t.FLOAT, 0);
  }), Jt(t, e, function () {
    return t.bindBuffer(t.PIXEL_PACK_BUFFER, null);
  }), a;
}

function bs(t, e, n) {
  var r = t,
      o = new Float32Array(n);
  return r.bindBuffer(r.PIXEL_PACK_BUFFER, e), r.getBufferSubData(r.PIXEL_PACK_BUFFER, 0, o), r.bindBuffer(r.PIXEL_PACK_BUFFER, null), o;
}

function ws(t, e, n, r, o) {
  var a = Xt(n, r),
      i = a[0],
      s = a[1],
      u = new Uint8Array(n * r * 4);
  return Jt(t, e, function () {
    return t.readPixels(0, 0, i, s, o.downloadTextureFormat, t.UNSIGNED_BYTE, u);
  }), new Float32Array(u.buffer);
}

function Cs(t, e, n, r, o, a, i, s) {
  var u = t,
      c = new Float32Array(function (t, e) {
    var n = $t(t, e);
    return n[0] * n[1] * 4;
  }(a, i));
  return u.bindBuffer(u.PIXEL_PACK_BUFFER, e), u.getBufferSubData(u.PIXEL_PACK_BUFFER, 0, c), u.bindBuffer(u.PIXEL_PACK_BUFFER, null), c;
}

function Es(t, e, n, r) {
  var o = new Float32Array(n * r * 4);
  return Jt(t, e, function () {
    return t.readPixels(0, 0, r, n, t.RGBA, t.FLOAT, o);
  }), o;
}

var Rs = Object.freeze({
  createVertexShader: ss,
  createVertexBuffer: us,
  createIndexBuffer: cs,
  createFloat32MatrixTexture: hs,
  createFloat16MatrixTexture: fs,
  createUnsignedBytesMatrixTexture: ds,
  createPackedMatrixTexture: ps,
  createFloat16PackedMatrixTexture: vs,
  bindVertexProgramAttributeStreams: gs,
  uploadDenseMatrixToTexture: ms,
  uploadPixelDataToTexture: ys,
  createBufferFromOutputTexture: xs,
  downloadFloat32MatrixFromBuffer: bs,
  downloadByteEncodedFloatMatrixFromOutputTexture: ws,
  downloadPackedMatrixFromBuffer: Cs,
  downloadMatrixFromPackedOutputTexture: Es
}),
    Is = function () {
  function t(t) {
    this.outputTexture = null, this.program = null, this.disposed = !1, this.vertexAttrsAreBound = !1, this.itemsToPoll = [];
    var e = i().getNumber("WEBGL_VERSION");
    null != t ? (this.gl = t, Kt(e, t)) : this.gl = jt(e);
    var n = "WEBGL_color_buffer_float";

    if (1 === i().getNumber("WEBGL_VERSION")) {
      if (this.textureFloatExtension = re(this.gl, this.debug, "OES_texture_float"), Pe(this.gl, "OES_texture_half_float")) this.textureHalfFloatExtension = re(this.gl, this.debug, "OES_texture_half_float");else if (i().get("WEBGL_FORCE_F16_TEXTURES")) throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");
      if (this.colorBufferFloatExtension = this.gl.getExtension(n), Pe(this.gl, "EXT_color_buffer_half_float")) this.colorBufferHalfFloatExtension = re(this.gl, this.debug, "EXT_color_buffer_half_float");else if (i().get("WEBGL_FORCE_F16_TEXTURES")) throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");
    } else if (n = "EXT_color_buffer_float", Pe(this.gl, n)) this.colorBufferFloatExtension = this.gl.getExtension(n);else {
      if (!Pe(this.gl, "EXT_color_buffer_half_float")) throw new Error("GL context does not support color renderable floats");
      this.colorBufferHalfFloatExtension = this.gl.getExtension("EXT_color_buffer_half_float");
    }

    this.vertexBuffer = us(this.gl, this.debug), this.indexBuffer = cs(this.gl, this.debug), this.framebuffer = ge(this.gl, this.debug), this.textureConfig = Qt(this.gl, this.textureHalfFloatExtension);
  }

  return Object.defineProperty(t.prototype, "debug", {
    get: function () {
      return i().getBool("DEBUG");
    },
    enumerable: !0,
    configurable: !0
  }), t.prototype.dispose = function () {
    var t = this;

    if (!this.disposed) {
      null != this.program && console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."), null != this.outputTexture && console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");
      var e = this.gl;
      Jt(e, this.debug, function () {
        return e.finish();
      }), Jt(e, this.debug, function () {
        return e.bindFramebuffer(e.FRAMEBUFFER, null);
      }), Jt(e, this.debug, function () {
        return e.deleteFramebuffer(t.framebuffer);
      }), Jt(e, this.debug, function () {
        return e.bindBuffer(e.ARRAY_BUFFER, null);
      }), Jt(e, this.debug, function () {
        return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
      }), Jt(e, this.debug, function () {
        return e.deleteBuffer(t.indexBuffer);
      }), this.disposed = !0;
    }
  }, t.prototype.createFloat32MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), hs(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createFloat16MatrixTexture = function (t, e) {
    return this.throwIfDisposed(), fs(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createUnsignedBytesMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), ds(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.uploadPixelDataToTexture = function (t, e) {
    this.throwIfDisposed(), ys(this.gl, this.debug, t, e);
  }, t.prototype.uploadDenseMatrixToTexture = function (t, e, n, r) {
    this.throwIfDisposed(), ms(this.gl, this.debug, t, e, n, r, this.textureConfig);
  }, t.prototype.createFloat16PackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), vs(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.createPackedMatrixTexture = function (t, e) {
    return this.throwIfDisposed(), ps(this.gl, this.debug, t, e, this.textureConfig);
  }, t.prototype.deleteMatrixTexture = function (t) {
    var e = this;
    this.throwIfDisposed(), this.outputTexture === t && (Ee(this.gl, this.debug, this.framebuffer), this.outputTexture = null), Jt(this.gl, this.debug, function () {
      return e.gl.deleteTexture(t);
    });
  }, t.prototype.downloadByteEncodedFloatMatrixFromOutputTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return ws(r.gl, r.debug, e, n, r.textureConfig);
    });
  }, t.prototype.downloadPackedMatrixFromBuffer = function (t, e, n, r, o, a) {
    return Cs(this.gl, t, 0, 0, 0, o, a, this.textureConfig);
  }, t.prototype.downloadFloat32MatrixFromBuffer = function (t, e) {
    return bs(this.gl, t, e);
  }, t.prototype.createBufferFromTexture = function (t, e, n) {
    this.bindTextureToFrameBuffer(t);
    var r = xs(this.gl, this.debug, e, n, this.textureConfig);
    return this.unbindTextureToFrameBuffer(), r;
  }, t.prototype.createAndWaitForFence = function () {
    var t = this.createFence(this.gl);
    return this.pollFence(t);
  }, t.prototype.createFence = function (t) {
    var e,
        n,
        r = this;

    if (i().getBool("WEBGL_FENCE_API_ENABLED")) {
      var o = t,
          a = o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE, 0);
      t.flush(), n = function () {
        var t = o.clientWaitSync(a, 0, 0);
        return t === o.ALREADY_SIGNALED || t === o.CONDITION_SATISFIED;
      }, e = a;
    } else i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") > 0 ? (e = this.beginQuery(), this.endQuery(), n = function () {
      return r.isQueryAvailable(e, i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
    }) : n = function () {
      return !0;
    };

    return {
      query: e,
      isFencePassed: n
    };
  }, t.prototype.downloadMatrixFromPackedTexture = function (t, e, n) {
    var r = this;
    return this.downloadMatrixDriver(t, function () {
      return Es(r.gl, r.debug, e, n);
    });
  }, t.prototype.createProgram = function (t) {
    this.throwIfDisposed();
    var e = this.gl,
        n = ae(e, this.debug, t),
        r = ss(e, this.debug),
        o = ce(e, this.debug);
    return Jt(e, this.debug, function () {
      return e.attachShader(o, r);
    }), Jt(e, this.debug, function () {
      return e.attachShader(o, n);
    }), le(e, this.debug, o), this.debug && he(e, this.debug, o), this.vertexAttrsAreBound || (this.setProgram(o), this.vertexAttrsAreBound = gs(e, this.debug, this.program, this.vertexBuffer)), o;
  }, t.prototype.deleteProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), t === this.program && (this.program = null), null != t && Jt(this.gl, this.debug, function () {
      return e.gl.deleteProgram(t);
    });
  }, t.prototype.setProgram = function (t) {
    var e = this;
    this.throwIfDisposed(), this.program = t, null != this.program && this.debug && he(this.gl, this.debug, this.program), Jt(this.gl, this.debug, function () {
      return e.gl.useProgram(t);
    });
  }, t.prototype.getUniformLocation = function (t, e, n) {
    return void 0 === n && (n = !0), this.throwIfDisposed(), n ? xe(this.gl, this.debug, t, e) : be(this.gl, t, e);
  }, t.prototype.getAttributeLocation = function (t, e) {
    var n = this;
    return this.throwIfDisposed(), Jt(this.gl, this.debug, function () {
      return n.gl.getAttribLocation(t, e);
    });
  }, t.prototype.getUniformLocationNoThrow = function (t, e) {
    return this.throwIfDisposed(), this.gl.getUniformLocation(t, e);
  }, t.prototype.setInputMatrixTexture = function (t, e, n) {
    this.throwIfDisposed(), this.throwIfNoProgram(), we(this.gl, this.debug, this.program, t, e, n);
  }, t.prototype.setOutputMatrixTexture = function (t, e, n) {
    this.setOutputMatrixTextureDriver(t, n, e);
  }, t.prototype.setOutputPackedMatrixTexture = function (t, e, n) {
    this.throwIfDisposed();
    var r = $t(e, n),
        o = r[0],
        a = r[1];
    this.setOutputMatrixTextureDriver(t, o, a);
  }, t.prototype.setOutputMatrixWriteRegion = function (t, e, n, r) {
    this.setOutputMatrixWriteRegionDriver(n, t, r, e);
  }, t.prototype.setOutputPackedMatrixWriteRegion = function (t, e, n, r) {
    throw new Error("setOutputPackedMatrixWriteRegion not implemented.");
  }, t.prototype.debugValidate = function () {
    null != this.program && he(this.gl, this.debug, this.program), Re(this.gl);
  }, t.prototype.executeProgram = function () {
    this.throwIfDisposed(), this.throwIfNoProgram();
    var t = this.gl;
    this.debug && this.debugValidate(), Jt(t, this.debug, function () {
      return t.drawElements(t.TRIANGLES, 6, t.UNSIGNED_SHORT, 0);
    });
  }, t.prototype.blockUntilAllProgramsCompleted = function () {
    var t = this;
    this.throwIfDisposed(), Jt(this.gl, this.debug, function () {
      return t.gl.finish();
    });
  }, t.prototype.getQueryTimerExtension = function () {
    return null == this.disjointQueryTimerExtension && (this.disjointQueryTimerExtension = re(this.gl, this.debug, 2 === i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION") ? "EXT_disjoint_timer_query_webgl2" : "EXT_disjoint_timer_query")), this.disjointQueryTimerExtension;
  }, t.prototype.getQueryTimerExtensionWebGL2 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.getQueryTimerExtensionWebGL1 = function () {
    return this.getQueryTimerExtension();
  }, t.prototype.beginQuery = function () {
    if (2 === i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.gl,
          e = this.getQueryTimerExtensionWebGL2(),
          n = t.createQuery();
      return t.beginQuery(e.TIME_ELAPSED_EXT, n), n;
    }

    var r = this.getQueryTimerExtensionWebGL1(),
        o = r.createQueryEXT();
    return r.beginQueryEXT(r.TIME_ELAPSED_EXT, o), o;
  }, t.prototype.endQuery = function () {
    if (2 !== i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")) {
      var t = this.getQueryTimerExtensionWebGL1();
      t.endQueryEXT(t.TIME_ELAPSED_EXT);
    } else {
      var e = this.gl,
          n = this.getQueryTimerExtensionWebGL2();
      e.endQuery(n.TIME_ELAPSED_EXT);
    }
  }, t.prototype.waitForQueryAndGetTime = function (t) {
    return n(this, void 0, void 0, function () {
      var e = this;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, F(function () {
              return e.disposed || e.isQueryAvailable(t, i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"));
            })];

          case 1:
            return n.sent(), [2, this.getQueryTime(t, i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))];
        }
      });
    });
  }, t.prototype.getQueryTime = function (t, e) {
    if (0 === e) return null;

    if (2 === e) {
      var n = this.gl;
      return n.getQueryParameter(t, n.QUERY_RESULT) / 1e6;
    }

    var r = this.getQueryTimerExtensionWebGL1();
    return r.getQueryObjectEXT(t, r.QUERY_RESULT_EXT) / 1e6;
  }, t.prototype.isQueryAvailable = function (t, e) {
    if (0 === e) return !0;

    if (2 === e) {
      var n = this.gl,
          r = this.getQueryTimerExtensionWebGL2(),
          o = n.getQueryParameter(t, n.QUERY_RESULT_AVAILABLE);
      return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
    }

    o = (r = this.getQueryTimerExtensionWebGL1()).getQueryObjectEXT(t, r.QUERY_RESULT_AVAILABLE_EXT);
    return null == this.disjoint && (this.disjoint = this.gl.getParameter(r.GPU_DISJOINT_EXT)), o && !this.disjoint;
  }, t.prototype.pollFence = function (t) {
    var e = this;
    return new Promise(function (n) {
      e.addItemToPoll(function () {
        return t.isFencePassed();
      }, function () {
        return n();
      });
    });
  }, t.prototype.pollItems = function () {
    for (var t = function (t) {
      for (var e = 0; e < t.length; ++e) {
        if (!t[e]()) break;
      }

      return e - 1;
    }(this.itemsToPoll.map(function (t) {
      return t.isDoneFn;
    })), e = 0; e <= t; ++e) {
      (0, this.itemsToPoll[e].resolveFn)();
    }

    this.itemsToPoll = this.itemsToPoll.slice(t + 1);
  }, t.prototype.addItemToPoll = function (t, e) {
    var n = this;
    this.itemsToPoll.push({
      isDoneFn: t,
      resolveFn: e
    }), this.itemsToPoll.length > 1 || F(function () {
      return n.pollItems(), 0 === n.itemsToPoll.length;
    });
  }, t.prototype.bindTextureToFrameBuffer = function (t) {
    this.throwIfDisposed(), Ce(this.gl, this.debug, t, this.framebuffer), this.debug && Re(this.gl);
  }, t.prototype.unbindTextureToFrameBuffer = function () {
    null != this.outputTexture ? (Ce(this.gl, this.debug, this.outputTexture, this.framebuffer), this.debug && Re(this.gl)) : Ee(this.gl, this.debug, this.framebuffer);
  }, t.prototype.downloadMatrixDriver = function (t, e) {
    this.bindTextureToFrameBuffer(t);
    var n = e();
    return this.unbindTextureToFrameBuffer(), n;
  }, t.prototype.setOutputMatrixTextureDriver = function (t, e, n) {
    this.throwIfDisposed();
    var r = this.gl;
    Ce(r, this.debug, t, this.framebuffer), this.debug && Re(r), this.outputTexture = t, Jt(r, this.debug, function () {
      return r.viewport(0, 0, e, n);
    }), Jt(r, this.debug, function () {
      return r.scissor(0, 0, e, n);
    });
  }, t.prototype.setOutputMatrixWriteRegionDriver = function (t, e, n, r) {
    var o = this;
    this.throwIfDisposed(), Jt(this.gl, this.debug, function () {
      return o.gl.scissor(t, e, n, r);
    });
  }, t.prototype.throwIfDisposed = function () {
    if (this.disposed) throw new Error("Attempted to use disposed GPGPUContext.");
  }, t.prototype.throwIfNoProgram = function () {
    if (null == this.program) throw new Error("No GPU program is currently set.");
  }, t;
}();

function ks(t, e) {
  if (t.length !== e.length) throw Error("Binary was compiled with " + t.length + " inputs, but was executed with " + e.length + " inputs");
  t.forEach(function (t, n) {
    var r = t.logicalShape,
        o = e[n],
        a = o.shape;
    if (!S(r, a)) throw Error("Binary was compiled with different shapes than the current args. Shapes " + r + " and " + a + " must match");

    if (!t.isUniform || !o.isUniform) {
      var i = t.texShape,
          s = o.isUniform ? null : o.texData.texShape;
      if (!S(i, s)) throw Error("Binary was compiled with different texture shapes than the current args. Shape " + i + " and " + s + " must match");
    }
  });
}

var Ss = function (t, e, n) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t;

  for (var r = n.filterWidth, o = n.inChannels, a = n.strideWidth, i = n.strideHeight, s = n.padInfo, u = n.outWidth, c = n.dilationWidth, l = n.dilationHeight, h = n.dataFormat, f = s.left, d = s.top, p = o * r, v = Ya(), g = "channelsLast" === h, m = g ? 0 : 1, y = g ? 1 : 2, x = "", b = 0; b <= 1; b++) for (var w = 0; w <= 1; w++) x += "\n          blockIndex = rc.y + " + w + ";\n          pos = rc.x + " + b + ";\n\n          if(blockIndex < " + t[1] + " && pos < " + t[0] + ") {\n            offsetY = int(blockIndex / (" + u + ")) * " + i + " - " + d + ";\n            d0 = offsetY + " + l + " * (pos / " + p + ");\n\n            if(d0 < " + e[m] + " && d0 >= 0) {\n\n              offsetX = int(mod(float(blockIndex), " + u + ".) * " + a + ". - " + f + ".);\n              d1 = offsetX + " + c + " * (int(mod(float(pos), " + p + ".) / " + o + ".));\n\n              if(d1 < " + e[y] + " && d1 >= 0) {\n\n                ch = int(mod(float(pos), " + o + ".));\n\n                if (" + g + ") {\n                  innerDims = vec2(d1, ch);\n                  result[" + (2 * b + w) + "] = getChannel(\n                    getA(d0, int(innerDims.x),\n                    int(innerDims.y)), innerDims);\n                } else {\n                  innerDims = vec2(d0, d1);\n                  result[" + (2 * b + w) + "] = getChannel(\n                    getA(ch, int(innerDims.x),\n                    int(innerDims.y)), innerDims);\n                }\n              }\n            }\n          }\n        ";

  this.userCode = "\n      void main() {\n        ivec2 rc = getOutputCoords();\n\n        vec4 result = vec4(0);\n\n        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;\n        vec2 innerDims;\n\n        " + x + "\n\n        " + v.output + " = result;\n      }\n    ";
},
    As = function (t, e, n, r, o) {
  this.variableNames = ["x"], this.outputShape = [];
  var a,
      i = e,
      s = t[3] - 1;
  this.outputShape = t;
  var u = "float(" + n + ") + float(" + r + ") * sum";
  a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n        int d = coords[3];\n        float x = getX(b, r, c, d);\n        float sum = 0.0;\n        for (int j = -" + i + "; j <= " + i + "; j++) {\n          int idx = d + j;\n          if (idx >= 0 && idx <=  " + s + ") {\n            float z = getX(b, r, c, idx);\n            sum += z * z;\n          }\n        }\n        float val = x * " + a + ";\n        setOutput(val);\n      }\n    ";
},
    Ts = function (t, e, n, r, o) {
  this.variableNames = ["inputImage", "outputImage", "dy"], this.outputShape = [], this.outputShape = t, this.depth = t[3], this.depthRadius = e, this.bias = n, this.alpha = r, this.beta = o, this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int r = coords[1];\n        int c = coords[2];\n\n        float result = 0.0;\n        for (int d = 0; d < " + this.depth + "; ++d) {\n          int depthBegin = int(max(0.0, float(d - " + e + ")));\n          int depthEnd = int(min(float(" + this.depth + "),\n              float(d + " + e + " + 1)));\n\n          const int MIN_DEPTH_BEGIN = 0;\n          const int MAX_DEPTH_END = " + this.depth + ";\n\n          float norm = 0.0;\n          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd) {\n              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);\n            }\n            else {\n              break;\n            }\n          }\n\n          norm = float(" + r + ") * norm + float(" + n + ");\n\n          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){\n            if (k < depthBegin){\n              continue;\n            }\n            else if (k >= depthBegin && k < depthEnd){\n              float dyi = -2.0 * float(" + r + ")\n                * float(" + o + ")\n                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)\n                / norm;\n              if (k == d) {\n                dyi += pow(norm, -1.0 * " + o + ");\n              }\n              if (k == coords[3]) {\n                dyi *= getDy(b, r, c, d);\n                result += dyi;\n              }\n            }\n            else {\n              break;\n            }\n          }\n      }\n      setOutput(result);\n      }\n    ";
},
    Ds = function (t, e, n, r, o) {
  this.variableNames = ["x"], this.outputShape = [], this.packedInputs = !0, this.packedOutput = !0;
  var a,
      i = e,
      s = t[3] - 1;
  this.outputShape = t;
  var u = "float(" + n + ") + float(" + r + ") * sum";
  a = .5 === o ? "inversesqrt(" + u + ")" : 1 === o ? "1.0/(" + u + ")" : "exp(log(" + u + ") * float(-" + o + "));", this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords.x;\n        int r = coords.y;\n        int c = coords.z;\n        int d = coords.w;\n\n        bool hasNextCol = d < " + this.outputShape[3] + ";\n        bool hasNextRow = c < " + this.outputShape[2] + ";\n\n        vec4 sum = vec4(0.);\n        vec4 xFragAtOutputCoords = getX(b, r, c, d);\n\n        vec4 xAtOutputCoords = vec4(\n          getChannel(xFragAtOutputCoords, vec2(c, d)),\n          hasNextCol ?\n            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,\n          hasNextRow ?\n            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0\n        );\n\n        int firstChannel = d - " + i + ";\n        vec2 cache = vec2(0.);\n        if(firstChannel >= 0){\n          vec4 firstChannelFrag = getX(b, r, c, firstChannel);\n          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));\n            if(hasNextRow){\n              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));\n            }\n        }\n\n        ivec2 depth = ivec2(d, d + 1);\n        for (int j = - " + i + "; j <= " + i + "; j++) {\n          ivec2 idx = depth + j;\n          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));\n          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(" + s + "));\n\n          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;\n          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;\n\n          if(depthInRange || depthPlusOneInRange){\n            vec4 z = vec4(0.);\n            vec4 xFragAtCurrentDepth;\n            z.xz = cache.xy;\n            if(depthPlusOneInRange && hasNextCol){\n              xFragAtCurrentDepth = idx.y != d ?\n                getX(b, r, c, idx.y) : xFragAtOutputCoords;\n              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));\n              if(hasNextRow){\n                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));\n              }\n            }\n            cache.xy = z.yw;\n            sum += z * z;\n          }\n        }\n        vec4 result = xAtOutputCoords * " + a + ";\n        setOutput(result);\n      }\n    ";
},
    Ns = function (t) {
  this.variableNames = ["dy", "maxPos"], this.outputShape = t.inShape;
  var e = t.strideHeight,
      n = t.strideWidth,
      r = t.dilationHeight,
      o = t.effectiveFilterHeight,
      a = t.effectiveFilterWidth,
      i = o - 1 - t.padInfo.top,
      s = a - 1 - t.padInfo.left,
      u = o * a - 1;
  this.userCode = "\n      const ivec2 pads = ivec2(" + i + ", " + s + ");\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n\n        ivec2 dyRCCorner = coords.yz - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + o + ";\n          wR += " + r + ") {\n          float dyR = float(dyRCorner + wR) / " + e + ".0;\n\n          if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + a + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + n + ".0;\n\n            if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(b, idyR, idyC, d);\n            int maxPosValue = " + u + " - int(getMaxPos(b, idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + a + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    Fs = function (t) {
  this.variableNames = ["dy", "maxPos"], this.outputShape = t.inShape;
  var e = t.strideDepth,
      n = t.strideHeight,
      r = t.strideWidth,
      o = t.dilationDepth,
      a = t.dilationHeight,
      i = t.dilationWidth,
      s = t.effectiveFilterDepth,
      u = t.effectiveFilterHeight,
      c = t.effectiveFilterWidth,
      l = s - 1 - t.padInfo.front,
      h = u - 1 - t.padInfo.top,
      f = c - 1 - t.padInfo.left,
      d = s * u * c - 1;
  this.userCode = "\n      const ivec3 pads = ivec3(" + l + ", " + h + ", " + f + ");\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;\n        int dyDCorner = dyCorner.x;\n        int dyRCorner = dyCorner.y;\n        int dyCCorner = dyCorner.z;\n\n        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get\n        // dx(xD, xR, xC, ch).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n\n        for (int wD = 0; wD < " + s + ";\n           wD += " + o + ") {\n          float dyD = float(dyDCorner + wD) / " + e + ".0;\n\n          if (dyD < 0.0 || dyD >= " + t.outDepth + ".0 || fract(dyD) > 0.0) {\n            continue;\n          }\n          int idyD = int(dyD);\n\n          for (int wR = 0; wR < " + u + ";\n              wR += " + a + ") {\n            float dyR = float(dyRCorner + wR) / " + n + ".0;\n\n            if (dyR < 0.0 || dyR >= " + t.outHeight + ".0 ||\n                fract(dyR) > 0.0) {\n              continue;\n            }\n            int idyR = int(dyR);\n\n            for (int wC = 0; wC < " + c + ";\n                wC += " + i + ") {\n              float dyC = float(dyCCorner + wC) / " + r + ".0;\n\n              if (dyC < 0.0 || dyC >= " + t.outWidth + ".0 ||\n                  fract(dyC) > 0.0) {\n                continue;\n              }\n              int idyC = int(dyC);\n\n              float dyValue = getDy(batch, idyD, idyR, idyC, ch);\n              int maxPosValue = " + d + " -\n                  int(getMaxPos(batch, idyD, idyR, idyC, ch));\n\n              // Get the current value, check it against the value from the\n              // position matrix.\n              int curPosValue =\n                  wD * " + u + " * " + c + " +\n                  wR * " + c + " + wC;\n              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n              dotProd += dyValue * mask;\n            }\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
},
    _s = function (t, e, n, r, o, a, i) {
  void 0 === n && (n = !1), void 0 === r && (r = !1), void 0 === o && (o = !1), void 0 === a && (a = null), void 0 === i && (i = !1), this.variableNames = ["matrixA", "matrixB"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = e;
  var s = n ? t[1] : t[2],
      u = Math.ceil(s / 2),
      c = n ? "i * 2, rc.y" : "rc.y, i * 2",
      l = r ? "rc.z, i * 2" : "i * 2, rc.z",
      h = n ? ["a.xxyy", "a.zzww"] : ["a.xxzz", "a.yyww"],
      f = r ? ["b.xzxz", "b.ywyw"] : ["b.xyxy", "b.zwzw"],
      d = "",
      p = "";
  a && (d = i ? "vec4 activation(vec4 a) {\n          vec4 b = getPreluActivationWeightsAtOutCoords();\n          " + a + "\n        }" : "vec4 activation(vec4 x) {\n          " + a + "\n        }", p = "result = activation(result);");
  var v = o ? "result += getBiasAtOutCoords();" : "";
  o && this.variableNames.push("bias"), i && this.variableNames.push("preluActivationWeights"), this.userCode = "\n      " + d + "\n\n      const float sharedDimension = " + u + ".0;\n\n      vec4 dot2x2ARowBCol(ivec3 rc) {\n        vec4 result = vec4(0);\n        for (int i = 0; i < " + u + "; i++) {\n          vec4 a = getMatrixA(rc.x, " + c + ");\n          vec4 b = getMatrixB(rc.x, " + l + ");\n\n          // These swizzled products need to be separately added.\n          // See: https://github.com/tensorflow/tfjs/issues/1735\n          result += (" + h[0] + " * " + f[0] + ");\n          result += (" + h[1] + " * " + f[1] + ");\n        }\n        return result;\n      }\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n        vec4 result = dot2x2ARowBCol(rc);\n\n        " + v + "\n\n        " + p + "\n\n        setOutput(result);\n      }\n    ";
},
    Os = function () {
  function t(t, e, n) {
    this.variableNames = ["probs"], this.outputShape = [t, n], this.userCode = "\n      uniform float seed;\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n\n        float r = random(seed);\n        float cdf = 0.0;\n\n        for (int i = 0; i < " + (e - 1) + "; i++) {\n          cdf += getProbs(batch, i);\n\n          if (r < cdf) {\n            setOutput(float(i));\n            return;\n          }\n        }\n\n        // If no other event happened, last event happened.\n        setOutput(float(" + (e - 1) + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    return function (n, r) {
      null == e.seedLoc && (e.seedLoc = n.getUniformLocation(r, "seed")), n.gl.uniform1f(e.seedLoc, t);
    };
  }, t;
}(),
    Ms = function (t, e, n, r) {
  this.variableNames = ["indices"], this.outputShape = [t, e], this.userCode = "\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int index = round(getIndices(coords.x));\n        setOutput(mix(float(" + r + "), float(" + n + "),\n                      float(index == coords.y)));\n      }\n    ";
},
    Bs = function (t) {
  this.variableNames = ["A"], this.packedInputs = !1, this.packedOutput = !0, this.outputShape = t;
  var e = t.length;
  if (0 === e) this.userCode = "\n        void main() {\n          setOutput(vec4(getA(), 0., 0., 0.));\n        }\n      ";else {
    var n = Xa("rc", e),
        r = ui(e),
        o = function (t, e, n) {
      if (1 === t) return "rc > " + e[0];

      for (var r = "", o = t - 2; o < t; o++) r += n[o] + " >= " + e[o], o < t - 1 && (r += "||");

      return r;
    }(e, t, n),
        a = function (t, e, n, r) {
      if (1 === t) return "";
      var o = r.slice(-2);
      return "\n    int r = " + o[0] + ";\n    int c = " + o[1] + ";\n    int rp1 = r + 1;\n    int cp1 = c + 1;\n\n    bool cEdge = cp1 >= " + e + ";\n    bool rEdge = rp1 >= " + n + ";\n  ";
    }(e, t[t.length - 1], t[t.length - 2], n),
        i = function (t, e) {
      var n = t.length,
          r = function (t, e) {
        for (var n = [], r = 0; r <= 1; r++) for (var o = 0; o <= 1; o++) {
          for (var a = (0 === r ? "r" : "rp1") + ", " + (0 === o ? "c" : "cp1"), i = 2; i < t; i++) a = e[e.length - 1 - i] + "," + a;

          n.push(a);
        }

        return n;
      }(n, e);

      return 1 === n ? "getA(rc),\n            rc + 1 >= " + t[0] + " ? 0. : getA(rc + 1),\n            0, 0" : "getA(" + r[0] + "),\n          cEdge ? 0. : getA(" + r[1] + "),\n          rEdge ? 0. : getA(" + r[2] + "),\n          rEdge || cEdge ? 0. : getA(" + r[3] + ")";
    }(t, n);

    this.userCode = "\n        void main() {\n          " + r + " rc = getOutputCoords();\n\n          if(" + o + ") {\n            setOutput(vec4(0));\n          } else {\n            " + a + "\n\n            setOutput(vec4(" + i + "));\n          }\n        }\n      ";
  }
};

var Ps = function (t, e, n) {
  this.variableNames = ["x"], this.outputShape = e.map(function (e, n) {
    return e[0] + t[n] + e[1];
  });
  var r = t.length,
      o = ui(r),
      a = e.map(function (t) {
    return t[0];
  }).join(","),
      i = e.map(function (e, n) {
    return e[0] + t[n];
  }).join(","),
      s = ["coords[0]", "coords[1]", "coords[2]", "coords[3]"].slice(0, r);
  this.userCode = 1 !== r ? "\n      " + o + " start = " + o + "(" + a + ");\n      " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outC = getOutputCoords();\n        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {\n          setOutput(float(" + n + "));\n        } else {\n          " + o + " coords = outC - start;\n          setOutput(getX(" + s + "));\n        }\n      }\n    " : "\n        int start = " + a + ";\n        int end = " + i + ";\n\n        void main() {\n          int outC = getOutputCoords();\n          if (outC < start || outC >= end) {\n            setOutput(float(" + n + "));\n          } else {\n            setOutput(getX(outC - start));\n          }\n        }\n      ";
},
    Ls = function (t, e, n) {
  this.variableNames = ["x"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = e.map(function (e, n) {
    return e[0] + t[n] + e[1];
  });

  for (var r = t.length, o = ui(r), a = e.map(function (t) {
    return t[0];
  }).join(","), i = e.map(function (e, n) {
    return e[0] + t[n];
  }).join(","), s = Xa("rc", r), u = Xa("source", r), c = s[r - 1] + " < " + this.outputShape[r - 1], l = 1 === r ? "source" : "vec2(" + u.slice(-2).join() + ")", h = [o + " rc = outputLoc;", s[r - 1] + " += 1;\n       if(" + c + ") {\n      ", 1 === r ? "" : "}\n       rc = outputLoc;\n       " + s[r - 2] + " += 1;\n       if(" + s[r - 2] + " < " + this.outputShape[r - 2] + ") {", 1 === r ? "" : "  " + s[r - 1] + " += 1;\n         if(" + c + ") {"], f = 1 === r ? "rc < start || rc >= end" : "any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))", d = "", p = 0, v = 1 === r ? 2 : 4; p < v; p++) d += "\n        " + h[p] + "\n        if (" + f + ") {\n          result[" + p + "] = float(" + n + ");\n        } else {\n          " + o + " source = rc - start;\n          result[" + p + "] = getChannel(getX(" + u.join() + "), " + l + ");\n        }\n      ";

  d += 1 === r ? "} " : "}}", this.userCode = "\n      const " + o + " start = " + o + "(" + a + ");\n      const " + o + " end = " + o + "(" + i + ");\n\n      void main() {\n        " + o + " outputLoc = getOutputCoords();\n        vec4 result = vec4(0.);\n        " + d + "\n        setOutput(result);\n      }\n    ";
},
    Ws = function (t, e, n, r, o) {
  if (void 0 === r && (r = !1), void 0 === o && (o = !1), this.variableNames = ["x"], "avg" === e && n) throw new Error("Cannot compute positions for average pool.");
  var a = t.filterWidth,
      i = t.strideHeight,
      s = t.strideWidth,
      u = t.dilationHeight,
      c = t.dilationWidth,
      l = t.effectiveFilterHeight,
      h = t.effectiveFilterWidth,
      f = t.padInfo.top,
      d = t.padInfo.left;
  this.outputShape = t.outShape;
  var p = "avg" === e,
      v = "((batch  * " + t.inHeight + " + xR) * " + t.inWidth + " + xC) * " + t.inChannels + " + d",
      g = "(xR * " + t.inWidth + " + xC) * " + t.inChannels + " + d",
      m = "0.0";
  if (p || (m = "-1.0 / 1e-20"), n) this.userCode = "\n        const ivec2 strides = ivec2(" + i + ", " + s + ");\n        const ivec2 pads = ivec2(" + f + ", " + d + ");\n\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int batch = coords[0];\n          int d = coords[3];\n\n          ivec2 xRCCorner = coords.yz * strides - pads;\n          int xRCorner = xRCCorner.x;\n          int xCCorner = xRCCorner.y;\n\n          // max/min x(?, ?, d) to get y(yR, yC, d).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n          float avgValue = 0.0;\n\n          for (int wR = 0; wR < " + l + ";\n              wR += " + u + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + h + ";\n                wC += " + c + ") {\n              int xC = xCCorner + wC;\n\n              if (xC < 0 || xC >= " + t.inWidth + ") {\n                continue;\n              }\n\n              float value = getX(batch, xR, xC, d);\n\n              // If a min / max value has already been found, use it. If not,\n              // use the current value.\n              float currMinMaxValue = mix(\n                  value, minMaxValue, minMaxValueFound);\n              if (value >= currMinMaxValue) {\n                minMaxValue = value;\n                minMaxValueFound = 1.0;\n                minMaxPosition = " + (r ? o ? v : g : "wR * " + h + " + wC") + ";\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";else {
    var y = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
    "avg" === e && (y = "avgValue / count");
    var x = 4 * Math.floor(a / 4),
        b = a % 4,
        w = "\n      if (" + p + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = max(values, minMaxValue);\n      }\n    ";
    this.userCode = "\n      const ivec2 strides = ivec2(" + i + ", " + s + ");\n      const ivec2 pads = ivec2(" + f + ", " + d + ");\n      const float initializationValue = " + m + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xR, int xC, int d) {\n        if (xC < 0 || xC >= " + t.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xR, xC, d);\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int batch = coords[0];\n        int d = coords[3];\n\n        ivec2 xRCCorner = coords.yz * strides - pads;\n        int xRCorner = xRCCorner.x;\n        int xCCorner = xRCCorner.y;\n\n        // max/min x(?, ?, d) to get y(yR, yC, d).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + m + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wR = 0; wR < " + l + ";\n            wR += " + u + ") {\n          int xR = xRCorner + wR;\n\n          if (xR < 0 || xR >= " + t.inHeight + ") {\n            continue;\n          }\n\n          for (int wC = 0; wC < " + x + "; wC += 4) {\n            int xC = xCCorner + wC * " + c + ";\n\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + c + ", d),\n              getValue(batch, xR, xC + 2 * " + c + ", d),\n              getValue(batch, xR, xC + 3 * " + c + ", d)\n            );\n\n            " + w + "\n          }\n\n          int xC = xCCorner + " + x + ";\n          if (" + (1 === b) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              initializationValue,\n              initializationValue,\n              initializationValue\n            );\n\n            " + w + "\n          } else if (" + (2 === b) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + c + ", d),\n              initializationValue,\n              initializationValue\n            );\n\n            " + w + "\n          } else if (" + (3 === b) + ") {\n            vec4 values = vec4(\n              getValue(batch, xR, xC, d),\n              getValue(batch, xR, xC + " + c + ", d),\n              getValue(batch, xR, xC + 2 * " + c + ", d),\n              initializationValue\n            );\n\n            " + w + "\n          }\n        }\n        setOutput(" + y + ");\n      }\n    ";
  }
},
    Us = function (t, e, n, r, o) {
  if (void 0 === r && (r = !1), void 0 === o && (o = !1), this.variableNames = ["x"], "avg" === e && n) throw new Error("Cannot compute positions for average pool.");
  var a = t.filterWidth,
      i = t.strideDepth,
      s = t.strideHeight,
      u = t.strideWidth,
      c = t.dilationDepth,
      l = t.dilationHeight,
      h = t.dilationWidth,
      f = t.effectiveFilterDepth,
      d = t.effectiveFilterHeight,
      p = t.effectiveFilterWidth,
      v = t.padInfo.front,
      g = t.padInfo.top,
      m = t.padInfo.left;
  this.outputShape = t.outShape;
  var y = "avg" === e,
      x = "0.0";
  if (y || (x = "-1.0 / 1e-20"), n) this.userCode = "\n        const ivec3 strides =\n            ivec3(" + i + ", " + s + ", " + u + ");\n        const ivec3 pads = ivec3(" + v + ", " + g + ", " + m + ");\n\n        void main() {\n          ivec5 coords = getOutputCoords();\n          int batch = coords.x;\n          int ch = coords.u;\n\n          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n          int xDCorner = xCorner.x;\n          int xRCorner = xCorner.y;\n          int xCCorner = xCorner.z;\n\n          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).\n          // ? = to be determined\n          float minMaxValue = 0.0;\n          float minMaxValueFound = 0.0;\n          int minMaxPosition = 0;\n\n          for (int wD = 0; wD < " + f + ";\n              wD += " + c + ") {\n            int xD = xDCorner + wD;\n\n            if (xD < 0 || xD >= " + t.inDepth + ") {\n              continue;\n            }\n\n            for (int wR = 0; wR < " + d + ";\n                wR += " + l + ") {\n              int xR = xRCorner + wR;\n\n              if (xR < 0 || xR >= " + t.inHeight + ") {\n                continue;\n              }\n\n              for (int wC = 0; wC < " + p + ";\n                  wC += " + h + ") {\n                int xC = xCCorner + wC;\n\n                if (xC < 0 || xC >= " + t.inWidth + ") {\n                  continue;\n                }\n\n                float value = getX(batch, xD, xR, xC, ch);\n\n                // If a min / max value has already been found, use it. If not,\n                // use the current value.\n                float currMinMaxValue = mix(\n                    value, minMaxValue, minMaxValueFound);\n                if (value >= currMinMaxValue) {\n                  minMaxValue = value;\n                  minMaxValueFound = 1.0;\n                  minMaxPosition = " + (r ? o ? "(((batch * " + t.inDepth + " + xD) * " + t.inHeight + " + xR) * " + t.inWidth + " + xC) * " + t.inChannels + " + ch" : "((xD * " + t.inHeight + " + xR) * " + t.inWidth + " + xC) * " + t.inChannels + " + ch" : "wD * " + d + " * " + p + " +\n                      wR * " + p + " + wC") + ";\n                }\n              }\n            }\n          }\n          setOutput(float(minMaxPosition));\n        }\n      ";else {
    var b = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
    "avg" === e && (b = "avgValue / count");
    var w = 4 * Math.floor(a / 4),
        C = a % 4,
        E = "\n      if (" + y + ") {\n        avgValue += dot(values, ones);\n      } else {\n        minMaxValue = max(values, minMaxValue);\n      }\n    ";
    this.userCode = "\n      const ivec3 strides =\n        ivec3(" + i + ", " + s + ", " + u + ");\n      const ivec3 pads = ivec3(" + v + ", " + g + ", " + m + ");\n      const float initializationValue = " + x + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float count = 0.0;\n\n      float getValue(int batch, int xD, int xR, int xC, int ch) {\n        if (xC < 0 || xC >= " + t.inWidth + ") {\n          return initializationValue;\n        }\n        count += 1.0;\n        return getX(batch, xD, xR, xC, ch);\n      }\n\n      void main() {\n        ivec5 coords = getOutputCoords();\n        int batch = coords.x;\n        int ch = coords.u;\n\n        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;\n        int xDCorner = xCorner.x;\n        int xRCorner = xCorner.y;\n        int xCCorner = xCorner.z;\n\n        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).\n        // ? = to be determined\n        vec4 minMaxValue = vec4(" + x + ");\n        float avgValue = 0.0;\n        count = 0.0;\n\n        for (int wD = 0; wD < " + f + ";\n            wD += " + c + ") {\n          int xD = xDCorner + wD;\n\n          if (xD < 0 || xD >= " + t.inDepth + ") {\n            continue;\n          }\n\n          for (int wR = 0; wR < " + d + ";\n            wR += " + l + ") {\n            int xR = xRCorner + wR;\n\n            if (xR < 0 || xR >= " + t.inHeight + ") {\n              continue;\n            }\n\n            for (int wC = 0; wC < " + w + "; wC += 4) {\n              int xC = xCCorner + wC * " + h + ";\n\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + h + ", ch),\n                getValue(batch, xD, xR, xC + 2 * " + h + ", ch),\n                getValue(batch, xD, xR, xC + 3 * " + h + ", ch)\n              );\n\n              " + E + "\n            }\n\n            int xC = xCCorner + " + w + ";\n            if (" + (1 === C) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                initializationValue,\n                initializationValue,\n                initializationValue\n              );\n\n              " + E + "\n            } else if (" + (2 === C) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + h + ", ch),\n                initializationValue,\n                initializationValue\n              );\n\n              " + E + "\n            } else if (" + (3 === C) + ") {\n              vec4 values = vec4(\n                getValue(batch, xD, xR, xC, ch),\n                getValue(batch, xD, xR, xC + " + h + ", ch),\n                getValue(batch, xD, xR, xC + 2 * " + h + ", ch),\n                initializationValue\n              );\n\n              " + E + "\n            }\n          }\n          setOutput(" + b + ");\n        }\n      }\n    ";
  }
},
    Vs = function (t, e) {
  this.variableNames = ["x"];
  var n = t.windowSize,
      r = t.batchSize,
      o = t.inSize,
      a = Math.ceil(o / n);
  this.outputShape = [r, a];
  var i = "0.0",
      s = "";
  "prod" === e ? i = "1.0" : "min" === e ? (i = "1.0 / 1e-20", s = "min") : "max" === e && (i = "-1.0 / 1e-20", s = "max");
  var u = e + "(" + e + "(" + e + "(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";
  "sum" === e ? u = "sumValue" : "prod" === e ? u = "prodValue" : "all" === e ? u = "allValue" : "any" === e && (u = "anyValue");
  var c = 4 * Math.floor(n / 4),
      l = n % 4,
      h = "\n      if (" + ("sum" === e) + ") {\n        sumValue += dot(values, ones);\n      } else if (" + ("prod" === e) + ") {\n        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);\n        prodValue *= tmp[0] * tmp[1];\n      } else {\n        minMaxValue = " + s + "(values, minMaxValue);\n      }\n    ",
      f = "vec4";
  "all" === e ? (i = "1.0", h = "\n        bool reducedAllValue = all(values);\n        float floatedReducedAllValue = float(reducedAllValue);\n        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);\n      ", f = "bvec4") : "any" === e && (i = "0.0", h = "\n        bool reducedAnyValue = any(values);\n        float floatedReducedAnyValue = float(reducedAnyValue);\n        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);\n      ", f = "bvec4");
  var d = "";
  o % n > 0 && (d = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      "), this.userCode = "\n      const float initializationValue = " + i + ";\n      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);\n\n      float getValue(int batch, int inIdx) {\n        " + d + "\n        return getX(batch, inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = outIdx * " + n + ";\n\n        vec4 minMaxValue = vec4(" + i + ");\n        float prodValue = 1.0;\n        float sumValue = 0.0;\n        float allValue = 1.0;\n        float anyValue = 0.0;\n\n        for (int i = 0; i < " + c + "; i += 4) {\n          int inIdx = inOffset + i;\n          " + f + " values = " + f + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          " + h + "\n        }\n\n        int inIdx = inOffset + " + c + ";\n        if (" + (1 === l) + ") {\n          " + f + " values = " + f + "(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (2 === l) + ") {\n          " + f + " values = " + f + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          " + h + "\n        } else if (" + (3 === l) + ") {\n          " + f + " values = " + f + "(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          " + h + "\n        }\n        setOutput(" + u + ");\n      }\n    ";
},
    zs = function (t, e) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t;

  for (var n = "", r = 0; r < 4; r++) {
    var o = "thisRC = rc;";
    r % 2 == 1 && (o += "thisRC.z += 1;"), r > 1 && (o += "thisRC.y += 1;"), n += "\n        " + o + "\n        " + (r > 0 ? "if(thisRC.y < rows && thisRC.z < cols){" : "") + "\n          int flatIndex = getFlatIndex(thisRC);\n\n          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);\n          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));\n\n          result[" + r + "] =\n            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);\n        " + (r > 0 ? "}" : "") + "\n      ";
  }

  this.userCode = "\n      \n    ivec3 inputCoordsFromReshapedOutCoords(int index) {\n      " + $a(["r", "c", "d"], e) + "\n      return ivec3(r, c, d);\n    }\n  \n      " + Qa(t) + "\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n\n        vec4 result = vec4(0.);\n\n        ivec3 thisRC;\n        int rows = " + t[1] + ";\n        int cols = " + t[2] + ";\n\n        " + n + "\n\n        setOutput(result);\n      }\n    ";
};

var Gs = function (t, e, n) {
  this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
  var r = e.shape,
      o = r[1],
      a = r[2],
      i = t.shape,
      s = i[1],
      u = i[2],
      c = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
      l = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
      h = c[0] / l[0],
      f = c[1] / l[1],
      d = 1 / h,
      p = 1 / f,
      v = 2 * Math.ceil(d) + 2,
      g = 2 * Math.ceil(p) + 2;
  this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + f + ");\n\n        const float invHeightScale = float(" + d + ");\n        const float invWidthScale = float(" + p + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + g + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(startRLerp - float(winHeight / 2));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(startCLerp - float(winWidth / 2));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float dxR = float(dyR) * heightScale;\n            int topDxRIndex = int(floor(dxR));\n            int bottomDxRIndex = int(min(ceil(dxR), " + (o - 1) + ".0));\n            float dxRLerp = dxR - float(topDxRIndex);\n            float inverseDxRLerp = 1.0 - dxRLerp;\n\n            float dxC = float(dyC) * widthScale;\n            int leftDxCIndex = int(floor(dxC));\n            int rightDxCIndex = int(min(ceil(dxC), " + (a - 1) + ".0));\n            float dxCLerp = dxC - float(leftDxCIndex);\n            float inverseDxCLerp = 1.0 - dxCLerp;\n\n            if (r == topDxRIndex && c == leftDxCIndex) {\n              // topLeft\n              accumulator +=\n                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;\n            }\n\n            if (r == topDxRIndex && c == rightDxCIndex) {\n              // topRight\n              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == leftDxCIndex) {\n              // bottomLeft\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;\n            }\n\n            if (r == bottomDxRIndex && c == rightDxCIndex) {\n              // bottomRight\n              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
},
    Hs = function (t, e, n, r) {
  this.variableNames = ["A"], this.outputShape = [];
  var o = t[0],
      a = t[1],
      i = t[2],
      s = t[3];
  this.outputShape = [o, e, n, s];
  var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
      c = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
  this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / c[0] + ",\n          " + u[1] / c[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);\n        ivec2 sourceCeilRC = ivec2(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);\n        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);\n        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);\n        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);\n\n        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);\n\n        float top = topLeft + (topRight - topLeft) * fracRC.y;\n        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;\n        float newValue = top + (bottom - top) * fracRC.x;\n\n        setOutput(newValue);\n      }\n    ";
},
    qs = function (t, e, n, r) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = [];
  var o = t[0],
      a = t[1],
      i = t[2],
      s = t[3];
  this.outputShape = [o, e, n, s];
  var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
      c = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n];
  this.userCode = "\n      const vec3 effectiveInputOverOutputRatioRC = vec3(\n          " + u[0] / c[0] + ",\n          " + u[1] / c[1] + ",\n          " + u[1] / c[1] + ");\n      const vec3 inputShapeRC = vec3(" + a + ".0, " + i + ".0,\n                                     " + i + ".0);\n\n      float getAValue(int b, int r, int c, int d) {\n        return getChannel(getA(b, r, c, d), vec2(c, d));\n      }\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        // Calculate values for next column in yRC.z.\n        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);\n\n        // Fractional source index.\n        vec3 sourceFracIndexRC = vec3(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the four integer indices.\n        ivec3 sourceFloorRC = ivec3(sourceFracIndexRC);\n        ivec3 sourceCeilRC = ivec3(\n          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));\n\n        // Should we calculate next column and row elements in 2x2 packed cell.\n        bool hasNextCol = d < " + (s - 1) + ";\n        bool hasNextRow = coords.z < " + (n - 1) + ";\n\n        // In parallel, construct four corners for all four components in\n        // packed 2x2 cell.\n        vec4 topLeft = vec4(\n          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 bottomLeft = vec4(\n          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);\n\n        vec4 topRight = vec4(\n          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec4 bottomRight = vec4(\n          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),\n          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)\n                     : 0.0,\n          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)\n                     : 0.0,\n          (hasNextRow && hasNextCol) ?\n            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);\n\n        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);\n\n        vec4 top = mix(topLeft, topRight, fracRC.yyzz);\n        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);\n        vec4 newValue = mix(top, bottom, fracRC.x);\n\n        setOutput(newValue);\n      }\n    ";
},
    Ks = function (t, e, n) {
  this.variableNames = ["dy"], this.outputShape = [], this.outputShape = e.shape;
  var r = e.shape,
      o = r[1],
      a = r[2],
      i = t.shape,
      s = i[1],
      u = i[2],
      c = [n && s > 1 ? o - 1 : o, n && u > 1 ? a - 1 : a],
      l = [n && s > 1 ? s - 1 : s, n && u > 1 ? u - 1 : u],
      h = c[0] / l[0],
      f = c[1] / l[1],
      d = 1 / h,
      p = 1 / f,
      v = 2 * Math.ceil(d) + 2,
      g = 2 * Math.ceil(p) + 2;
  this.userCode = "\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        int r = coords[1];\n        int c = coords[2];\n\n        float accumulator = 0.0;\n\n        const float heightScale = float(" + h + ");\n        const float widthScale = float(" + f + ");\n\n        const float invHeightScale = float(" + d + ");\n        const float invWidthScale = float(" + p + ");\n\n        const int winHeight = int(" + v + ");\n        const int winWidth = int(" + g + ");\n\n        // Compute bounds for where in dy we will look\n        float startRLerp = floor(float(r) * invHeightScale);\n        int startDyR = int(floor(startRLerp - float(winHeight / 2)));\n\n        float startCLerp = floor(float(c) * invWidthScale);\n        int startDyC = int(floor(startCLerp - float(winWidth / 2)));\n\n        // Loop over dy\n        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {\n          int dyR = dyROffset + startDyR;\n\n          // Guard against the window exceeding the bounds of dy\n          if (dyR < 0 || dyR >= " + s + ") {\n            continue;\n          }\n\n          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {\n            int dyC = dyCOffset + startDyC;\n\n            // Guard against the window exceeding the bounds of dy\n            if (dyC < 0 || dyC >= " + u + ") {\n              continue;\n            }\n\n            float sourceFracRow =\n              float(" + c[0] + ") *\n                (float(dyR) / float(" + l[0] + "));\n\n            float sourceFracCol =\n                float(" + c[1] + ") *\n                  (float(dyC) / float(" + l[1] + "));\n\n            int sourceNearestRow = int(min(\n                float(int(" + o + ") - 1),\n                " + n + " ? float(round(sourceFracRow)) :\n                                  float(floor(sourceFracRow))));\n\n            int sourceNearestCol = int(min(\n                float(int(" + a + ") - 1),\n                " + n + " ? float(round(sourceFracCol)) :\n                                  float(floor(sourceFracCol))));\n\n            if (r == sourceNearestRow && c == sourceNearestCol) {\n              accumulator += getDy(b, dyR, dyC, d);\n            }\n          }\n        }\n        // End loop over dy\n\n        setOutput(accumulator);\n      }\n    ";
},
    js = function (t, e, n, r) {
  this.variableNames = ["A"], this.outputShape = [];
  var o = t[0],
      a = t[1],
      i = t[2],
      s = t[3];
  this.outputShape = [o, e, n, s];
  var u = [r && e > 1 ? a - 1 : a, r && n > 1 ? i - 1 : i],
      c = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n],
      l = r ? "0.5" : "0.0";
  this.userCode = "\n      const vec2 effectiveInputOverOutputRatioRC = vec2(\n          " + u[0] / c[0] + ",\n          " + u[1] / c[1] + ");\n      const vec2 inputShapeRC = vec2(" + a + ".0, " + i + ".0);\n\n      void main() {\n        ivec4 coords = getOutputCoords();\n        int b = coords[0];\n        int d = coords[3];\n        ivec2 yRC = coords.yz;\n\n        // Fractional source index.\n        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;\n\n        // Compute the coordinators of nearest neighbor point.\n        ivec2 sourceNearestRC = ivec2(\n          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + " + l + ")));\n\n        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);\n\n        setOutput(newValue);\n      }\n    ";
},
    Xs = function (t, e) {
  this.variableNames = ["x"];
  var n = t.length;
  if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");

  if (this.outputShape = t, 1 !== n) {
    var r = t.map(function (n, r) {
      return function (n) {
        return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - coords[" + n + "] - 1" : "coords[" + n + "]";
      }(r);
    }).join(","),
        o = ui(n);
    this.userCode = "\n      void main() {\n        " + o + " coords = getOutputCoords();\n        setOutput(getX(" + r + "));\n      }\n    ";
  } else this.userCode = "\n        void main() {\n          int coord = getOutputCoords();\n          setOutput(getX(" + t[0] + " - coord - 1));\n        }\n      ";
},
    Ys = function (t, e) {
  this.variableNames = ["x"], this.packedInputs = !0, this.packedOutput = !0;
  var n = t.length;
  if (n > 4) throw new Error("WebGL backend: Reverse of rank-" + n + " tensor is not yet supported");
  this.outputShape = t;
  var r = Xa("rc", n),
      o = r[n - 1] + " + 1 < " + this.outputShape[n - 1],
      a = r[n - 2] + " + 1 < " + this.outputShape[n - 2],
      i = ui(n);

  function s(n) {
    var r = t.map(function (r, o) {
      return function (n, r) {
        return -1 !== e.indexOf(n) && 1 !== t[n] ? t[n] + " - " + r[n] + " - 1" : "" + r[n];
      }(o, n);
    });
    return "getChannel(getX(" + r.join(",") + "), vec2(" + r.slice(-2).join(",") + "))";
  }

  this.userCode = 1 === n ? "\n        void main(){\n          int rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = getChannel(getX(" + t[0] + " - rc - 1),\n            " + t[0] + " - rc - 1);\n          if(" + o + "){\n              result.g = getChannel(getX(" + t[0] + " - (rc  + 1) - 1),\n                " + t[0] + " - (rc  + 1) - 1);\n          }\n          setOutput(result);\n        }\n      " : "\n        void main() {\n          " + i + " rc = getOutputCoords();\n          vec4 result = vec4(0.);\n          result.r = " + function (t) {
    return s(t);
  }(r.slice()) + ";\n          if(" + o + "){\n            result.g = " + function (t) {
    return t[n - 1] = "(" + t[n - 1] + " + 1)", s(t);
  }(r.slice()) + ";\n          }\n          if(" + a + ") {\n            result.b = " + function (t) {
    return t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
  }(r.slice()) + ";\n            if(" + o + ") {\n              result.a = " + function (t) {
    return t[n - 1] = "(" + t[n - 1] + " + 1)", t[n - 2] = "(" + t[n - 2] + " + 1)", s(t);
  }(r.slice()) + ";\n            }\n          }\n          setOutput(result);\n        }\n    ";
},
    $s = function (t, e, n, r, o, a, i) {
  void 0 === i && (i = !0), this.variableNames = ["updates", "indices", "defaultValue"], this.outputShape = a;
  var s = ui(o.length),
      u = ui(a.length),
      c = "";
  1 === n ? c = "i" : 2 === n && (c = "i, j");
  var l = "getIndices(" + c + ")",
      h = "";
  1 === r ? h = "i" : 2 === r && (h = "i, coords[1]");
  var f = "getUpdates(" + h + ")",
      d = e > 1 ? "strides[j]" : "strides";
  this.userCode = "\n        " + s + " strides = " + s + "(" + o + ");\n\n        void main() {\n          " + u + " coords = getOutputCoords();\n          float sum = 0.0;\n          bool found = false;\n          for (int i = 0; i < " + t + "; i++) {\n            int flattenedIndex = 0;\n            for (int j = 0; j < " + e + "; j++) {\n              int index = round(" + l + ");\n              flattenedIndex += index * " + d + ";\n            }\n            if (flattenedIndex == coords[0]) {\n              sum += " + f + ";\n              found = true;\n            }\n          }\n          setOutput(mix(getDefaultValue(), sum, float(found)));\n        }\n      ";
},
    Qs = function (t, e) {
  this.variableNames = ["x", "segmentIds"];
  var n = t.windowSize,
      r = t.batchSize,
      o = t.inSize,
      a = t.numSegments,
      i = a * Math.ceil(o / n);
  this.outputShape = [r, i];
  var s = 4 * Math.floor(n / 4),
      u = n % 4,
      c = "\n        sumValue += dot(values, segFilter);\n    ",
      l = "";
  o % n > 0 && (l = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return initializationValue;\n        }\n      ");
  var h = "";
  o % n > 0 && (h = "\n        if (inIdx < 0 || inIdx >= " + o + ") {\n          return -1.0;\n        }\n      "), this.userCode = "\n      const float initializationValue = 0.0;\n\n      float getValue(int batch, int inIdx) {\n        " + l + "\n        return getX(batch, inIdx);\n      }\n\n      float getSegmentIdAtIndex(int inIdx) {\n        " + h + "\n        return getSegmentIds(inIdx);\n      }\n\n      void main() {\n        ivec2 coords = getOutputCoords();\n        int batch = coords[0];\n        int outIdx = coords[1];\n        int inOffset = int(floor(float(outIdx) / float(\n          " + a + ")) * float(" + n + "));\n        int currentSeg = int(mod(float(outIdx), float(" + a + ")));\n\n        float sumValue = 0.0;\n\n        for (int i = 0; i < " + s + "; i += 4) {\n          int inIdx = inOffset + i;\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            getValue(batch, inIdx + 3)\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0\n          );\n\n          " + c + "\n        }\n\n        int inIdx = inOffset + " + s + ";\n        if (" + (1 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            initializationValue,\n            initializationValue,\n            initializationValue\n          );\n\n          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            0,\n            0,\n            0\n          );\n\n          " + c + "\n        } else if (" + (2 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            initializationValue,\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n              0,\n              0\n          );\n\n          " + c + "\n        } else if (" + (3 === u) + ") {\n          vec4 values = vec4(\n            getValue(batch, inIdx),\n            getValue(batch, inIdx + 1),\n            getValue(batch, inIdx + 2),\n            initializationValue\n          );\n\n          vec4 segFilter = vec4(\n            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,\n            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,\n            0\n          );\n\n          " + c + "\n        }\n        setOutput(sumValue);\n      }\n    ";
},
    Js = function (t, e, n) {
  var r, o;
  if (this.variableNames = ["c", "a", "b"], this.outputShape = e, n > 4) throw Error("Where for rank " + n + " is not yet supported");
  if (1 === n) o = "resRC", r = "resRC";else {
    for (var a = ["resRC.x", "resRC.y", "resRC.z", "resRC.w"], i = [], s = [], u = 0; u < e.length; u++) s.push("" + a[u]), u < t && i.push("" + a[u]);

    r = i.join(), o = s.join();
  }
  var c = ui(n);
  this.userCode = "\n      void main() {\n        " + c + " resRC = getOutputCoords();\n        float cVal = getC(" + r + ");\n        if (cVal >= 1.0) {\n          setOutput(getA(" + o + "));\n        } else {\n          setOutput(getB(" + o + "));\n        }\n      }\n    ";
},
    Zs = function () {
  function t(t) {
    this.variableNames = ["source"], this.outputShape = t, this.rank = t.length;

    var e,
        n = ui(this.rank),
        r = "uniform int start[" + this.rank + "];",
        o = function (t) {
      if (1 === t) return "sourceLoc";
      if (t <= 6) return tu.slice(0, t).map(function (t) {
        return "sourceLoc." + t;
      }).join(",");
      throw Error("Slicing for rank " + t + " is not yet supported");
    }(this.rank);

    e = "\n        " + n + " sourceLoc;\n        " + n + " coords = getOutputCoords();\n        " + t.map(function (t, e) {
      return "sourceLoc." + tu[e] + " = start[" + e + "] + coords." + tu[e] + ";";
    }).join("\n") + "\n      ", this.userCode = "\n      " + r + "\n      void main() {\n        " + e + "\n        setOutput(getSource(" + o + "));\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    tu = ["x", "y", "z", "w", "u", "v"];

var eu = function () {
  function t(t) {
    this.variableNames = ["source"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t, this.rank = t.length;
    var e = ui(this.rank),
        n = Xa("coords", this.rank),
        r = Xa("sourceLoc", this.rank),
        o = 1 === this.rank ? "sourceLoc" : "vec2(" + r.slice(-2).join() + ")",
        a = "getChannel(getSource(" + r.join() + "), " + o + ")",
        i = "\n      result.x = " + a + ";\n      if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n        ++" + r[this.rank - 1] + ";\n        result.y = " + a + ";\n        --" + r[this.rank - 1] + ";\n      }\n    ",
        s = 1 === this.rank ? "" : "\n      --" + n[this.rank - 1] + ";\n      if (++" + n[this.rank - 2] + " < " + t[this.rank - 2] + ") {\n        ++" + r[this.rank - 2] + ";\n        result.z = " + a + ";\n        if (++" + n[this.rank - 1] + " < " + t[this.rank - 1] + ") {\n          ++" + r[this.rank - 1] + ";\n          result.w = " + a + ";\n        }\n      }\n    ",
        u = this.rank <= 4 ? "sourceLoc = coords +\n            " + e + "(" + t.map(function (t, e) {
      return "start[" + e + "]";
    }).join() + ");" : t.map(function (t, e) {
      return r[e] + " = " + n[e] + " + start[" + e + "];";
    }).join("\n");
    this.userCode = "\n      uniform int start[" + this.rank + "];\n      void main() {\n        " + e + " coords = getOutputCoords();\n        " + e + " sourceLoc;\n        " + u + "\n        vec4 result = vec4(0.);\n        " + i + "\n        " + s + "\n        setOutput(result);\n      }\n    ";
  }

  return t.prototype.getCustomSetupFunc = function (t) {
    var e = this;
    if (t.length !== this.rank) throw Error("The rank (" + this.rank + ") of the program must match the length of start (" + t.length + ")");
    return function (n, r) {
      null == e.startLoc && (e.startLoc = n.getUniformLocationNoThrow(r, "start"), null == e.startLoc) || n.gl.uniform1iv(e.startLoc, t);
    };
  }, t;
}(),
    nu = function (t, e, n) {
  this.variableNames = ["x"], this.outputShape = n;
  var r = n.length,
      o = ui(n.length),
      a = ui(n.length),
      i = "";
  if (1 === r) i = "coords * strides + begin";else {
    var s = 0;
    i = n.map(function (t, e) {
      return s++, 1 === n.length ? "coords * strides[" + e + "] + begin[" + e + "]" : "coords[" + (s - 1) + "] * strides[" + e + "] + begin[" + e + "]";
    }).join(",");
  }
  this.userCode = "\n      " + o + " begin = " + o + "(" + t + ");\n      " + o + " strides = " + o + "(" + e + ");\n\n      void main() {\n        " + a + " coords = getOutputCoords();\n        setOutput(getX(" + i + "));\n      }\n    ";
},
    ru = function () {
  function t(t) {
    this.gpgpu = t, this.numUsedTextures = 0, this.numFreeTextures = 0, this.freeTextures = {}, this.logEnabled = !1, this.usedTextures = {};
  }

  return t.prototype.acquireTexture = function (t, e, n) {
    var r,
        o = ou(e, n),
        a = au(t, o, n);

    if (a in this.freeTextures || (this.freeTextures[a] = []), a in this.usedTextures || (this.usedTextures[a] = []), this.freeTextures[a].length > 0) {
      this.numFreeTextures--, this.numUsedTextures++, this.log();
      var i = this.freeTextures[a].shift();
      return this.usedTextures[a].push(i), i;
    }

    return this.numUsedTextures++, this.log(), o === Gt.PACKED_2X2_FLOAT32 ? r = this.gpgpu.createPackedMatrixTexture(t[0], t[1]) : o === Gt.PACKED_2X2_FLOAT16 ? r = this.gpgpu.createFloat16PackedMatrixTexture(t[0], t[1]) : o === Gt.UNPACKED_FLOAT32 ? r = this.gpgpu.createFloat32MatrixTexture(t[0], t[1]) : o === Gt.UNPACKED_FLOAT16 ? r = this.gpgpu.createFloat16MatrixTexture(t[0], t[1]) : o === Gt.PACKED_4X1_UNSIGNED_BYTE && (r = this.gpgpu.createUnsignedBytesMatrixTexture(t[0], t[1])), this.usedTextures[a].push(r), r;
  }, t.prototype.releaseTexture = function (t, e, n, r) {
    if (null != this.freeTextures) {
      var o = au(e, ou(n, r), r);
      o in this.freeTextures || (this.freeTextures[o] = []), this.freeTextures[o].push(t), this.numFreeTextures++, this.numUsedTextures--;
      var a = this.usedTextures[o],
          i = a.indexOf(t);
      if (i < 0) throw new Error("Cannot release a texture that was never provided by this texture manager");
      a.splice(i, 1), this.log();
    }
  }, t.prototype.log = function () {
    if (this.logEnabled) {
      var t = this.numFreeTextures + this.numUsedTextures;
      console.log("Free/Used", this.numFreeTextures + " / " + this.numUsedTextures, "(" + t + ")");
    }
  }, t.prototype.getNumUsedTextures = function () {
    return this.numUsedTextures;
  }, t.prototype.getNumFreeTextures = function () {
    return this.numFreeTextures;
  }, t.prototype.dispose = function () {
    var t = this;

    if (null != this.freeTextures) {
      for (var e in this.freeTextures) this.freeTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      for (var e in this.usedTextures) this.usedTextures[e].forEach(function (e) {
        t.gpgpu.deleteMatrixTexture(e);
      });

      this.freeTextures = null, this.usedTextures = null, this.numUsedTextures = 0, this.numFreeTextures = 0;
    }
  }, t;
}();

function ou(t, e) {
  if (t === zt.UPLOAD) return Gt.PACKED_2X2_FLOAT32;
  if (t === zt.RENDER || null == t) return function (t) {
    return i().getBool("WEBGL_RENDER_FLOAT32_ENABLED") ? t ? Gt.PACKED_2X2_FLOAT32 : Gt.UNPACKED_FLOAT32 : t ? Gt.PACKED_2X2_FLOAT16 : Gt.UNPACKED_FLOAT16;
  }(e);
  if (t === zt.DOWNLOAD || t === zt.PIXELS) return Gt.PACKED_4X1_UNSIGNED_BYTE;
  throw new Error("Unknown logical texture type " + t);
}

function au(t, e, n) {
  return t[0] + "_" + t[1] + "_" + e + "_" + n;
}

var iu = function (t, e) {
  this.variableNames = ["A"];

  for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[r] * e[r];

  this.outputShape = n, this.rank = n.length;

  var o = ui(this.rank),
      a = function (t) {
    var e = t.length;
    if (e > 5) throw Error("Tile for rank " + e + " is not yet supported");
    if (1 === e) return "imod(resRC, " + t[0] + ")";

    for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u"], r = [], o = 0; o < t.length; o++) r.push("imod(" + n[o] + ", " + t[o] + ")");

    return r.join();
  }(t);

  this.userCode = "\n      void main() {\n        " + o + " resRC = getOutputCoords();\n        setOutput(getA(" + a + "));\n      }\n    ";
};

var su = 1.7580993408473768,
    uu = 1.0507009873554805,
    cu = function (t, e) {
  this.variableNames = ["A"], this.outputShape = t, this.userCode = "\n      float unaryOperation(float x) {\n        " + e + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
},
    lu = "if (isnan(x)) return x;",
    hu = "return x;",
    fu = "return abs(x);",
    du = lu + "\n  return (x < 0.0) ? 0.0 : x;\n",
    pu = lu + "\n  return (x < 0.0) ? 0.0 : min(6.0, x);\n",
    vu = "return (x >= 0.0) ? x : (exp(x) - 1.0);",
    gu = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + su + ";\n  float scale = " + uu + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";

var mu = "return -x;",
    yu = "return ceil(x);",
    xu = "return floor(x);",
    bu = "return exp(x);",
    wu = "return exp(x) - 1.0;",
    Cu = lu + "\n  return sin(x);\n",
    Eu = lu + "\n  return cos(x);\n",
    Ru = lu + "\n  if (abs(x) > 1.) {\n    return NAN;\n  }\n  return asin(x);\n",
    Iu = lu + "\n  if (abs(x) > 1.) {\n    return NAN;\n  }\n  return acos(x);\n",
    ku = lu + "\n  return atan(x);\n",
    Su = lu + "return log(x + sqrt(x * x + 1.0));",
    Au = lu + "\n  if (x < 1.0) return NAN;\n  return log(x + sqrt(x * x - 1.0));",
    Tu = lu + "\n  if ((x < -1.0) || (x > 1.0)) return NAN;\n  return (log(1.0 + x) - log(1.0 - x)) / 2.0;",
    Du = "return x;",
    Nu = "return x;",
    Fu = "\n  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));\n  bvec4 isNaN = isnan(x);\n\n  result.r = isNaN.r ? x.r : result.r;\n  result.g = isNaN.g ? x.g : result.g;\n  result.b = isNaN.b ? x.b : result.b;\n  result.a = isNaN.a ? x.a : result.a;\n\n  return result;\n",
    _u = "\n  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));\n  bvec4 isNaN = isnan(x);\n\n  result.r = isNaN.r ? x.r : result.r;\n  result.g = isNaN.g ? x.g : result.g;\n  result.b = isNaN.b ? x.b : result.b;\n  result.a = isNaN.a ? x.a : result.a;\n\n  return result;\n",
    Ou = "\n  vec4 result;\n\n  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);\n  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);\n  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);\n  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);\n\n  return result;\n",
    Mu = function (t, e) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0, this.outputShape = t, this.userCode = "\n      vec4 unaryOperation(vec4 x) {\n        " + e + "\n      }\n\n      void main() {\n        vec4 x = getAAtOutCoords();\n        vec4 y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
},
    Bu = function (t) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !1, this.outputShape = t;

  var e = t.length,
      n = Xa("rc", e),
      r = ui(e),
      o = function (t, e) {
    if (1 === t) return "rc";

    for (var n = "", r = 0; r < t; r++) n += e[r], r < t - 1 && (n += ",");

    return n;
  }(e, n),
      a = n.slice(-2),
      i = e <= 1 ? "rc" : "vec2(" + a.join(",") + ")";

  this.userCode = "\n      void main() {\n        " + r + " rc = getOutputCoords();\n        vec4 packedInput = getA(" + o + ");\n\n        setOutput(getChannel(packedInput, " + i + "));\n      }\n    ";
},
    Pu = {};

function Lu(t, e) {
  if (void 0 === e && (e = !1), "linear" === t) return e ? Nu : hu;
  if ("relu" === t) return e ? Fu : du;
  if ("elu" === t) return e ? Ou : vu;
  if ("relu6" === t) return e ? _u : pu;
  if ("prelu" === t) return e ? ki : Ei;
  throw new Error("Activation " + t + " has not been implemented for the WebGL backend.");
}

var Wu = 600;

var Uu = function (t) {
  function o(e) {
    var n,
        r = t.call(this) || this;
    if (r.pendingRead = new WeakMap(), r.pendingDisposal = new WeakSet(), r.dataRefCount = new WeakMap(), r.numBytesInGPU = 0, r.uploadWaitMs = 0, r.downloadWaitMs = 0, r.warnedAboutMemory = !1, r.pendingDeletes = 0, r.disposed = !1, !i().getBool("HAS_WEBGL")) throw new Error("WebGL is not supported on this device");

    if (null == e) {
      var o = jt(i().getNumber("WEBGL_VERSION"));
      r.binaryCache = (n = i().getNumber("WEBGL_VERSION")) in Pu ? Pu[n] : (Pu[n] = {}, Pu[n]), r.gpgpu = new Is(o), r.canvas = o.canvas, r.gpgpuCreatedLocally = !0;
    } else r.gpgpu = e, r.binaryCache = {}, r.gpgpuCreatedLocally = !1, r.canvas = e.gl.canvas;

    return r.textureManager = new ru(r.gpgpu), r.numMBBeforeWarning = null == i().global.screen ? 1024 : i().global.screen.height * i().global.screen.width * window.devicePixelRatio * Wu / 1024 / 1024, r.texData = new ca(r, Lt), r;
  }

  return e(o, t), o.prototype.numDataIds = function () {
    return this.texData.numDataIds() + (this.cpuBackend ? this.cpuBackend.numDataIds() : 0) - this.pendingDeletes;
  }, o.prototype.write = function (t, e, n) {
    if (i().getBool("DEBUG") && this.checkNumericalProblems(t), "complex64" === n && null != t) throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");
    var r = {};
    return this.texData.set(r, {
      shape: e,
      dtype: n,
      values: t,
      usage: zt.UPLOAD
    }), r;
  }, o.prototype.move = function (t, e, n, r) {
    if (i().getBool("DEBUG") && this.checkNumericalProblems(e), "complex64" === r) throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");
    this.texData.set(t, {
      shape: n,
      dtype: r,
      values: e,
      usage: zt.UPLOAD
    });
  }, o.prototype.readSync = function (t) {
    var e = this.texData.get(t),
        n = e.values,
        r = e.dtype,
        o = e.complexTensors,
        a = e.slice,
        i = e.shape,
        s = e.isPacked;

    if (null != a) {
      var u = void 0;
      u = s ? new Mu(i, Du) : new cu(i, Du);
      var c = this.runWebGLProgram(u, [{
        dataId: t,
        shape: i,
        dtype: r
      }], r),
          l = this.readSync(c.dataId);
      return this.disposeData(c.dataId), l;
    }

    if (null != n) return this.convertAndCacheOnCPU(t);
    if ("string" === r) return n;
    var h,
        f,
        d = null != this.activeTimers;
    (d && (h = et()), "complex64" === r) ? f = Aa(o.real.dataSync(), o.imag.dataSync()) : f = this.getValuesFromTexture(t);
    return d && (this.downloadWaitMs += et() - h), this.convertAndCacheOnCPU(t, f);
  }, o.prototype.read = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, s, u, c, l, h, f, d, p, v, g, m, y, x, b, w, C, E, R;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (this.pendingRead.has(t)) return e = this.pendingRead.get(t), [2, new Promise(function (t) {
              return e.push(t);
            })];
            if (n = this.texData.get(t), o = n.values, a = n.shape, s = n.slice, u = n.dtype, c = n.complexTensors, l = n.isPacked, null != s) return h = void 0, h = l ? new Mu(a, Du) : new cu(a, Du), f = this.runWebGLProgram(h, [{
              dataId: t,
              shape: a,
              dtype: u
            }], u), d = this.read(f.dataId), this.disposeData(f.dataId), [2, d];
            if (null != o) return [2, this.convertAndCacheOnCPU(t)];
            if (!i().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED") && 2 === i().getNumber("WEBGL_VERSION")) throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");
            return p = null, "complex64" !== u && i().get("WEBGL_BUFFER_SUPPORTED") && (v = this.decode(t), g = this.texData.get(v.dataId), p = (R = this.gpgpu).createBufferFromTexture.apply(R, [g.texture].concat(Yt(a)))), this.pendingRead.set(t, []), "complex64" === u ? [3, 2] : [4, this.gpgpu.createAndWaitForFence()];

          case 1:
            r.sent(), r.label = 2;

          case 2:
            return "complex64" !== u ? [3, 4] : [4, Promise.all([c.real.data(), c.imag.data()])];

          case 3:
            return y = r.sent(), x = y[0], b = y[1], m = Aa(x, b), [3, 5];

          case 4:
            null == p ? m = this.getValuesFromTexture(t) : (w = k(a), m = this.gpgpu.downloadFloat32MatrixFromBuffer(p, w)), r.label = 5;

          case 5:
            return null != v && this.disposeData(v.dataId), C = this.convertAndCacheOnCPU(t, m), E = this.pendingRead.get(t), this.pendingRead.delete(t), E.forEach(function (t) {
              return t(C);
            }), this.pendingDisposal.has(t) && (this.pendingDisposal.delete(t), this.disposeData(t), this.pendingDeletes--), [2, C];
        }
      });
    });
  }, o.prototype.checkNumericalProblems = function (t) {
    if (null != t) for (var e = 0; e < t.length; e++) {
      var n = t[e];

      if (!ee(n)) {
        if (i().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")) throw Error("The value " + n + " cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'");
        throw Error("The value " + n + " cannot be represented on this device.");
      }
    }
  }, o.prototype.getValuesFromTexture = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.shape,
        o = n.dtype,
        a = n.isPacked,
        s = k(r);

    if (i().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")) {
      var u = this.decode(t),
          c = this.texData.get(u.dataId),
          l = (e = this.gpgpu).downloadMatrixFromPackedTexture.apply(e, [c.texture].concat(Yt(r))).subarray(0, s);
      return this.disposeData(u.dataId), l;
    }

    var h = i().getBool("WEBGL_PACK") && !0 === a,
        f = h ? De(r) : r,
        d = h ? new Ji(f) : new Qi(f),
        p = this.runWebGLProgram(d, [{
      shape: f,
      dtype: o,
      dataId: t
    }], "float32"),
        v = this.texData.get(p.dataId),
        g = this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(v.texture, v.texShape[0], v.texShape[1]).subarray(0, s);
    return this.disposeData(p.dataId), g;
  }, o.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, s, u, c;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return e = this.activeTimers, n = [], o = !1, null == this.programTimersStack ? (this.programTimersStack = n, o = !0) : this.activeTimers.push(n), this.activeTimers = n, t(), a = I(this.activeTimers.map(function (t) {
              return t.query;
            })).filter(function (t) {
              return null != t;
            }), s = I(this.activeTimers.map(function (t) {
              return t.name;
            })).filter(function (t) {
              return null != t;
            }), this.activeTimers = e, o && (this.programTimersStack = null), u = {
              uploadWaitMs: this.uploadWaitMs,
              downloadWaitMs: this.downloadWaitMs,
              kernelMs: null,
              wallMs: null
            }, i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE") > 0 ? [4, Promise.all(a)] : [3, 2];

          case 1:
            return c = r.sent(), u.kernelMs = w(c), u.getExtraProfileInfo = function () {
              return c.map(function (t, e) {
                return {
                  name: s[e],
                  ms: t
                };
              }).map(function (t) {
                return t.name + ": " + t.ms;
              }).join(", ");
            }, [3, 3];

          case 2:
            u.kernelMs = {
              error: "WebGL query timers are not supported in this environment."
            }, r.label = 3;

          case 3:
            return this.uploadWaitMs = 0, this.downloadWaitMs = 0, [2, u];
        }
      });
    });
  }, o.prototype.memory = function () {
    return {
      unreliable: !1,
      numBytesInGPU: this.numBytesInGPU
    };
  }, o.prototype.startTimer = function () {
    return i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE") > 0 ? this.gpgpu.beginQuery() : {
      startMs: et(),
      endMs: null
    };
  }, o.prototype.endTimer = function (t) {
    return i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE") > 0 ? (this.gpgpu.endQuery(), t) : (t.endMs = et(), t);
  }, o.prototype.getQueryTime = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return i().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE") > 0 ? [2, this.gpgpu.waitForQueryAndGetTime(t)] : [2, (e = t).endMs - e.startMs];
      });
    });
  }, o.prototype.disposeData = function (t) {
    if (!this.pendingDisposal.has(t)) {
      if (this.pendingRead.has(t)) return this.pendingDisposal.add(t), void this.pendingDeletes++;

      if (this.texData.has(t)) {
        this.releaseGPUData(t);
        var e = this.texData.get(t).complexTensors;
        null != e && (e.real.dispose(), e.imag.dispose()), this.texData.delete(t);
      }
    }
  }, o.prototype.releaseGPUData = function (t) {
    var e = this.texData.get(t),
        n = e.texture,
        r = e.dtype,
        o = e.texShape,
        a = e.usage,
        i = e.isPacked,
        s = e.slice,
        u = s && s.origDataId || t,
        c = this.dataRefCount.get(u);
    c > 1 ? this.dataRefCount.set(u, c - 1) : (this.dataRefCount.delete(u), null != n && (this.numBytesInGPU -= this.computeBytes(o, r), this.textureManager.releaseTexture(n, o, a, i)));
    var l = this.texData.get(t);
    l.texture = null, l.texShape = null, l.isPacked = !1, l.slice = null;
  }, o.prototype.getTexture = function (t) {
    return this.uploadToGPU(t), this.texData.get(t).texture;
  }, o.prototype.getDataInfo = function (t) {
    return this.texData.get(t);
  }, o.prototype.getCPUBackend = function () {
    return i().getBool("WEBGL_CPU_FORWARD") ? (null == this.cpuBackend && (this.cpuBackend = Lt.findBackend("cpu")), this.cpuBackend) : null;
  }, o.prototype.shouldExecuteOnCPU = function (t, e) {
    var n = this;
    return void 0 === e && (e = 128), null != this.getCPUBackend() && t.every(function (t) {
      return null == n.texData.get(t.dataId).texture && k(t.shape) < e;
    });
  }, o.prototype.getGPGPUContext = function () {
    return this.gpgpu;
  }, o.prototype.complex = function (t, e) {
    var n = this.makeOutput(t.shape, "complex64");
    return this.texData.get(n.dataId).complexTensors = {
      real: Lt.keep(t.clone()),
      imag: Lt.keep(e.clone())
    }, n;
  }, o.prototype.real = function (t) {
    return this.texData.get(t.dataId).complexTensors.real.clone();
  }, o.prototype.imag = function (t) {
    return this.texData.get(t.dataId).complexTensors.imag.clone();
  }, o.prototype.slice = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.slice(t, e, n);
    if (0 === k(n)) return Fn([], n, t.dtype);
    var r = this.texData.get(t.dataId).isPacked,
        o = $o(t.shape, e, n);

    if (r || !o) {
      var a = i().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new eu(n) : new Zs(n),
          s = a.getCustomSetupFunc(e);
      return this.compileAndRun(a, [t], null, s);
    }

    return this.uploadToGPU(t.dataId), this.shallowSlice(t, e, n);
  }, o.prototype.shallowSlice = function (t, e, n) {
    var r = this.texData.get(t.dataId),
        o = this.makeOutput(n, t.dtype),
        a = this.texData.get(o.dataId);
    Object.assign(a, r), a.shape = n, a.dtype = t.dtype;
    var i = Qo(e, t.strides);
    r.slice && (i += r.slice.flatOffset), a.slice = {
      flatOffset: i,
      origDataId: r.slice && r.slice.origDataId || t.dataId
    };
    var s = this.dataRefCount.get(a.slice.origDataId) || 1;
    return this.dataRefCount.set(a.slice.origDataId, s + 1), o;
  }, o.prototype.stridedSlice = function (t, e, n, r) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.stridedSlice(t, e, n, r);
    var o = jo(e, n, r);
    if (o.some(function (t) {
      return 0 === t;
    })) return Fn([], o);
    var a = new nu(e, r, o);
    return this.compileAndRun(a, [t]);
  }, o.prototype.reverse = function (t, e) {
    var n = i().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Ys(t.shape, e) : new Xs(t.shape, e);
    return this.compileAndRun(n, [t]);
  }, o.prototype.concat = function (t, e) {
    if ("complex64" === t[0].dtype) {
      var n = t.map(function (t) {
        return Dn(t);
      }),
          r = t.map(function (t) {
        return Nn(t);
      });
      return Tn(this.concat(n, e), this.concat(r, e));
    }

    if (this.shouldExecuteOnCPU(t)) return this.cpuBackend.concat(t, e);
    if (1 === t.length) return t[0];

    if (t.length > i().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var o = Math.floor(t.length / 2),
          a = this.concat(t.slice(0, o), e),
          s = this.concat(t.slice(o), e);
      return this.concat([a, s], e);
    }

    if (i().getBool("WEBGL_PACK_ARRAY_OPERATIONS") && t[0].rank > 1) {
      var u = new Fi(t.map(function (t) {
        return t.shape;
      }), e);
      return this.compileAndRun(u, t);
    }

    var c = Sn(t.map(function (t) {
      return t.shape;
    }), e),
        l = t.map(function (t) {
      return t.as2D(-1, k(t.shape.slice(e)));
    }),
        h = new Ni(l.map(function (t) {
      return t.shape;
    }));
    return this.compileAndRun(h, l).reshape(c);
  }, o.prototype.neg = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.neg(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, mu, t.dtype);
    var e = new cu(t.shape, mu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.batchMatMul = function (t, e, n, r) {
    var o = n ? t.shape[2] : t.shape[1],
        a = r ? e.shape[1] : e.shape[2],
        i = n ? t.shape[1] : t.shape[2],
        s = t.shape[0];

    if ((1 === o || 1 === a) && i > 1e3) {
      n && (t = ua(t, [0, 2, 1])), r && (e = ua(e, [0, 2, 1]));
      var u = 1 === a ? t : t.as3D(s, i, 1),
          c = 1 === a ? 2 : 1,
          l = 1 === a ? e.as3D(s, 1, i) : e;
      return this.multiply(u, l).sum(c, !0);
    }

    var h = Tt(t.dtype, e.dtype),
        f = new _s(t.shape, [s, o, a], n, r);
    return this.compileAndRun(f, [t, e], h);
  }, o.prototype.fusedBatchMatMul = function (t) {
    var e = t.a,
        n = t.b,
        r = t.transposeA,
        o = t.transposeB,
        a = t.bias,
        i = t.activation,
        s = t.preluActivationWeights,
        u = r ? e.shape[2] : e.shape[1],
        c = o ? n.shape[1] : n.shape[2],
        l = e.shape[0],
        h = Tt(e.dtype, n.dtype),
        f = null != a,
        d = null != s,
        p = i ? Lu(i, !0) : null,
        v = new _s(e.shape, [l, u, c], r, o, f, p, d),
        g = [e, n];
    return a && g.push(a), s && g.push(s), this.compileAndRun(v, g, h);
  }, o.prototype.multiply = function (t, e) {
    if ("complex64" === t.dtype) {
      var n = this.texData.get(t.dataId),
          r = this.texData.get(e.dataId),
          o = new yi(gi, t.shape, e.shape),
          a = new yi(mi, t.shape, e.shape),
          s = [this.makeComplexComponentTensorInfo(t, n.complexTensors.real), this.makeComplexComponentTensorInfo(t, n.complexTensors.imag), this.makeComplexComponentTensorInfo(e, r.complexTensors.real), this.makeComplexComponentTensorInfo(e, r.complexTensors.imag)],
          u = this.compileAndRun(o, s),
          c = this.compileAndRun(a, s),
          l = this.complex(u, c);
      return u.dispose(), c.dispose(), l;
    }

    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.multiply(t, e);
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, wi, t.dtype);
    var h = new Ri(wi, t.shape, e.shape);
    return this.compileAndRun(h, [t, e], t.dtype);
  }, o.prototype.batchNormalization = function (t, e, n, r, o, a) {
    var s = [t, e, n],
        u = null;
    null != a && (u = a.shape, s.push(a));
    var c = null;

    if (null != o && (c = o.shape, s.push(o)), i().getBool("WEBGL_PACK_NORMALIZATION")) {
      var l = new vi(t.shape, e.shape, n.shape, u, c, r);
      return this.compileAndRun(l, s);
    }

    var h = new pi(t.shape, e.shape, n.shape, u, c, r);
    return this.compileAndRun(h, s);
  }, o.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    var a = i().getBool("WEBGL_PACK_NORMALIZATION") ? new Ds(t.shape, e, n, r, o) : new As(t.shape, e, n, r, o);
    return this.compileAndRun(a, [t]);
  }, o.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    var s = new Ts(e.shape, r, o, a, i);
    return this.compileAndRun(s, [e, n, t]);
  }, o.prototype.tile = function (t, e) {
    if ("string" === t.dtype) {
      var n = this.readSync(t.dataId).map(function (t) {
        return ot(t);
      });
      return Va(er(t.shape, t.dtype, n), e);
    }

    var r = new iu(t.shape, e);
    return this.compileAndRun(r, [t]);
  }, o.prototype.pad = function (t, e, n) {
    var r = i().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new Ls(t.shape, e, n) : new Ps(t.shape, e, n);
    return this.compileAndRun(r, [t]);
  }, o.prototype.gather = function (t, e, n) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.gather(t, e, n);
    var r = new as(t.shape, e.size, n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.batchToSpaceND = function (t, e, n) {
    C(t.rank <= 4, function () {
      return "batchToSpaceND for rank > 4 with a WebGL backend not implemented yet";
    });
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = pr(t.shape, e, r),
        a = vr(o.length, e.length),
        i = gr(t.shape, e, r),
        s = mr(n, e.length),
        u = yr(i, n, e.length);
    return ua(t.reshape(o), a).reshape(i).slice(s, u);
  }, o.prototype.spaceToBatchND = function (t, e, n) {
    C(t.rank <= 4, function () {
      return "spaceToBatchND for rank > 4 with a WebGL backend not implemented yet";
    });
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = pr(i.shape, e, r, !1),
        u = vr(s.length, e.length, !1),
        c = gr(i.shape, e, r, !1);
    return ua(i.reshape(s), u).reshape(c);
  }, o.prototype.reduce = function (t, e, n) {
    var r = t.shape[0],
        o = t.shape[1],
        a = Uo(o),
        i = new Vs({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e),
        s = this.compileAndRun(i, [t], n);
    return 1 === s.shape[1] ? s : this.reduce(s, e, n);
  }, o.prototype.argReduce = function (t, e, n) {
    void 0 === n && (n = null);
    var r = t.shape[0],
        o = t.shape[1];
    null != n && (r = n.shape[0], o = n.shape[1]);
    var a = Uo(o),
        i = new Ka({
      windowSize: a,
      inSize: o,
      batchSize: r
    }, e, null == n),
        s = [t];
    null != n && s.push(n);
    var u = this.compileAndRun(i, s, "int32");
    return 1 === u.shape[1] ? u : this.argReduce(t, e, u);
  }, o.prototype.argReducePacked = function (t, e, n) {
    void 0 === n && (n = null);
    var r = null != n ? n.shape : t.shape,
        o = Uo(r[r.length - 1]),
        a = new hi(r, o, e, null == n),
        i = null == n ? [t] : [t, n],
        s = this.compileAndRun(a, i, "int32");
    return s.rank === t.rank ? this.argReducePacked(t, e, s) : s;
  }, o.prototype.sum = function (t, e) {
    Cn("sum", e, t.rank);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o),
        i = Dt(t.dtype);
    return this.reduce(a, "sum", i).reshape(r);
  }, o.prototype.prod = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.prod(t, e);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o),
        i = Dt(t.dtype);
    return this.reduce(a, "prod", i).reshape(r);
  }, o.prototype.unsortedSegmentSum = function (t, e, n) {
    var r = 0,
        o = En([r], t.rank),
        a = t;
    null != o && (a = ua(t, o), r = In(1, t.rank)[0]);

    var i = function (t, e, n) {
      for (var r = [], o = t.length, a = 0; a < o; a++) a !== e ? r.push(t[a]) : r.push(n);

      return r;
    }(a.shape, r, n),
        s = k([a.shape[r]]),
        u = a.as2D(-1, s),
        c = Dt(t.dtype),
        l = this.segOpCompute(u, "unsortedSegmentSum", e, c, n).reshape(i);

    return null != o && (l = ua(l, Rn(o))), l;
  }, o.prototype.segOpCompute = function (t, e, n, r, o) {
    var a = t.shape[0],
        i = t.shape[1],
        s = function (t, e) {
      var n,
          r = !1;

      for (t <= Wo ? (n = t, r = !0) : n = Y(t, Math.floor(Math.sqrt(t))); !r;) n > e || n === t ? r = !0 : n = Y(t, n + 1);

      return n;
    }(i, o),
        u = new Qs({
      windowSize: s,
      inSize: i,
      batchSize: a,
      numSegments: o
    }, e),
        c = this.compileAndRun(u, [t, n], r);

    return c.shape[1] === o ? c : (n = Kn(0, o).tile([i / s]), this.segOpCompute(c, e, n, r, o));
  }, o.prototype.argMinMaxReduce = function (t, e, n) {
    var r = [e];

    if (Cn("arg" + n.charAt(0).toUpperCase() + n.slice(1), r, t.rank), !i().getBool("WEBGL_PACK_REDUCE") || t.rank <= 2) {
      var o = bn(t.shape, r),
          a = o[0],
          s = k(o[1]),
          u = t.as2D(-1, s);
      return this.argReduce(u, n).reshape(a);
    }

    return this.argReducePacked(t, n);
  }, o.prototype.argMin = function (t, e) {
    return this.argMinMaxReduce(t, e, "min");
  }, o.prototype.argMax = function (t, e) {
    return this.argMinMaxReduce(t, e, "max");
  }, o.prototype.cumsum = function (t, e, n, r) {
    if (e !== t.rank - 1) throw new Error("WebGL cumsum shader expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);
    var o = new qi(t.shape, n, r);
    return this.compileAndRun(o, [t]);
  }, o.prototype.equal = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(equal(a, b));\n", "bool");
    var n = new Ri("return float(a == b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.notEqual = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(notEqual(a, b));\n", "bool");
    var n = new Ri("return float(a != b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.less = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.less(t, e);
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThan(a, b));\n", "bool");
    var n = new Ri("return float(a < b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.lessEqual = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(lessThanEqual(a, b));\n", "bool");
    var n = new Ri("return float(a <= b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.greater = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.greater(t, e);
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThan(a, b));\n", "bool");
    var n = new Ri("return float(a > b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.greaterEqual = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(greaterThanEqual(a, b));\n", "bool");
    var n = new Ri("return float(a >= b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.logicalNot = function (t) {
    var e = new cu(t.shape, "return float(!(x >= 1.0));");
    return this.compileAndRun(e, [t]);
  }, o.prototype.logicalAnd = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return vec4(\n    vec4(greaterThanEqual(a, vec4(1.0))) *\n    vec4(greaterThanEqual(b, vec4(1.0))));\n", "bool");
    var n = new Ri("return float(a >= 1.0 && b >= 1.0);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.logicalOr = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  return min(\n    vec4(greaterThanEqual(a, vec4(1.0))) +\n    vec4(greaterThanEqual(b, vec4(1.0))),\n    vec4(1.0));\n", "bool");
    var n = new Ri("return float(a >= 1.0 || b >= 1.0);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "bool");
  }, o.prototype.select = function (t, e, n) {
    var r = new Js(t.rank, e.shape, e.rank);
    return this.compileAndRun(r, [t, e, n], Tt(e.dtype, n.dtype));
  }, o.prototype.where = function (t) {
    dn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");
    var e = t.dataSync();
    return Ga(t.shape, e);
  }, o.prototype.topk = function (t, e, n) {
    return za(t.dataSync(), t.shape, t.dtype, e);
  }, o.prototype.min = function (t, e) {
    Cn("min", e, t.rank);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "min", a.dtype).reshape(r);
  }, o.prototype.minimum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.minimum(t, e);
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  vec4 result = vec4(min(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new Ri("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return min(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.mod = function (t, e) {
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  vec4 result = mod(a, b);\n  vec4 isNaN = vec4(equal(b, vec4(0.0)));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new Ri("if (b == 0.0) return NAN;\n  return mod(a, b);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.max = function (t, e) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.max(t, e);
    Cn("max", e, t.rank);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "max", a.dtype).reshape(r);
  }, o.prototype.maximum = function (t, e) {
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.maximum(t, e);
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  vec4 result = vec4(max(a, b));\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new Ri("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return max(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.all = function (t, e) {
    Cn("all", e, t.rank);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "all", a.dtype).reshape(r);
  }, o.prototype.any = function (t, e) {
    Cn("any", e, t.rank);
    var n = bn(t.shape, e),
        r = n[0],
        o = k(n[1]),
        a = t.as2D(-1, o);
    return this.reduce(a, "any", a.dtype).reshape(r);
  }, o.prototype.floorDiv = function (t, e) {
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, "\n  ivec4 ia = round(a);\n  ivec4 ib = round(b);\n  bvec4 cond = notEqual(ib, ivec4(0));\n  ivec4 result = ivec4(0);\n  vec4 s = sign(a) * sign(b);\n\n  // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n  if (cond[0]) {\n    result[0] = idiv(ia[0], ib[0], s[0]);\n  }\n  if (cond[1]) {\n    result[1] = idiv(ia[1], ib[1], s[1]);\n  }\n  if (cond[2]) {\n    result[2] = idiv(ia[2], ib[2], s[2]);\n  }\n  if (cond[3]) {\n    result[3] = idiv(ia[3], ib[3], s[3]);\n  }\n  return vec4(result);\n", "int32");
    var n = new Ri("\n  float s = sign(a) * sign(b);\n  int ia = round(a);\n  int ib = round(b);\n  if (ib != 0) {\n    // Windows (D3D) wants guaranteed non-zero int division at compile-time.\n    return float(idiv(ia, ib, s));\n  } else {\n    return NAN;\n  }\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e], "int32");
  }, o.prototype.add = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, xi);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.add(t, e);
    var n = Tt(t.dtype, e.dtype);
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, xi, n);
    var r = new Ri(xi, t.shape, e.shape);
    return this.compileAndRun(r, [t, e], n);
  }, o.prototype.packedUnaryOp = function (t, e, n) {
    var r = new Mu(t.shape, e);
    return this.compileAndRun(r, [t], n);
  }, o.prototype.packedBinaryOp = function (t, e, n, r, o) {
    void 0 === o && (o = !1);
    var a = new Si(n, t.shape, e.shape, o);
    return this.compileAndRun(a, [t, e], r);
  }, o.prototype.complexSeparableBinaryOp = function (t, e, n) {
    var r = this,
        o = this.texData.get(t.dataId),
        a = this.texData.get(e.dataId),
        i = [[o.complexTensors.real, a.complexTensors.real], [o.complexTensors.imag, a.complexTensors.imag]].map(function (o) {
      var a = o[0],
          i = o[1],
          s = r.makeComplexComponentTensorInfo(t, a),
          u = r.makeComplexComponentTensorInfo(e, i),
          c = new Ri(n, t.shape, e.shape);
      return r.compileAndRun(c, [s, u], Tt(a.dtype, i.dtype));
    }),
        s = i[0],
        u = i[1],
        c = this.complex(s, u);
    return s.dispose(), u.dispose(), c;
  }, o.prototype.makeComplexComponentTensorInfo = function (t, e) {
    return {
      dataId: e.dataId,
      dtype: e.dtype,
      shape: t.shape
    };
  }, o.prototype.addN = function (t) {
    if (1 === t.length) return t[0];

    if (t.length > i().get("WEBGL_MAX_TEXTURES_IN_SHADER")) {
      var e = Math.floor(t.length / 2),
          n = this.addN(t.slice(0, e)),
          r = this.addN(t.slice(e));
      return this.addN([n, r]);
    }

    var o = t.map(function (t) {
      return t.dtype;
    }).reduce(function (t, e) {
      return Tt(t, e);
    }),
        a = t.map(function (t) {
      return t.shape;
    }),
        s = i().getBool("WEBGL_PACK") ? new qa(t[0].shape, a) : new Ha(t[0].shape, a);
    return this.compileAndRun(s, t, o);
  }, o.prototype.subtract = function (t, e) {
    if ("complex64" === t.dtype && "complex64" === e.dtype) return this.complexSeparableBinaryOp(t, e, bi);
    if (this.shouldExecuteOnCPU([t, e])) return this.cpuBackend.subtract(t, e);
    var n = Tt(t.dtype, e.dtype);
    if (i().getBool("WEBGL_PACK_BINARY_OPERATIONS")) return this.packedBinaryOp(t, e, bi, t.dtype);
    var r = new Ri(bi, t.shape, e.shape);
    return this.compileAndRun(r, [t, e], n);
  }, o.prototype.pow = function (t, e) {
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.\n  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));\n  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);\n  vec4 result = multiplier * pow(abs(a), b);\n\n  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS\n  bvec4 isExpZero = equal(b, vec4(0.0));\n  result.r = isExpZero.r ? 1.0 : result.r;\n  result.g = isExpZero.g ? 1.0 : result.g;\n  result.b = isExpZero.b ? 1.0 : result.b;\n  result.a = isExpZero.a ? 1.0 : result.a;\n\n  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new Ri("\nif(a < 0.0 && floor(b) < b){\n  return NAN;\n}\nif (b == 0.0) {\n  return 1.0;\n}\nreturn (round(mod(b, 2.0)) != 1) ?\n    pow(abs(a), b) : sign(a) * pow(abs(a), b);\n", t.shape, e.shape),
        r = Tt(t.dtype, e.dtype);
    return this.compileAndRun(n, [t, e], r);
  }, o.prototype.ceil = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.ceil(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, yu, t.dtype);
    var e = new cu(t.shape, yu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.floor = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.floor(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, xu, t.dtype);
    var e = new cu(t.shape, xu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.sign = function (t) {
    var e = new cu(t.shape, "\n  if (isnan(x)) { return 0.0; }\n  return sign(x);\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.isNaN = function (t) {
    var e = new cu(t.shape, "return float(isnan(x));");
    return this.compileAndRun(e, [t], "bool");
  }, o.prototype.isInf = function (t) {
    var e = new cu(t.shape, "return float(isinf(x));");
    return this.compileAndRun(e, [t], "bool");
  }, o.prototype.isFinite = function (t) {
    var e = new cu(t.shape, "return float(!isnan(x) && !isinf(x));");
    return this.compileAndRun(e, [t], "bool");
  }, o.prototype.round = function (t) {
    var e = new cu(t.shape, "\n  // OpenGL ES does not support round function.\n  // The algorithm is based on banker's rounding.\n  float base = floor(x);\n  if ((x - base) < 0.5) {\n    return floor(x);\n  } else if ((x - base) > 0.5) {\n    return ceil(x);\n  } else {\n    if (mod(base, 2.0) == 0.0) {\n      return base;\n    } else {\n      return base + 1.0;\n    }\n  }\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.exp = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.exp(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, bu, t.dtype);
    var e = new cu(t.shape, bu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.expm1 = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.expm1(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, wu, t.dtype);
    var e = new cu(t.shape, wu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.softmax = function (t, e) {
    var n = O([e], t.shape),
        r = this.max(t, n),
        o = wn(r.shape, n),
        a = this.subtract(t, r.reshape(o)),
        i = this.exp(a),
        s = this.sum(i, n).reshape(o);
    return Bo(i, s);
  }, o.prototype.log = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.log(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, "\n  vec4 result = log(x);\n  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));\n  result.r = isNaN.r == 1.0 ? NAN : result.r;\n  result.g = isNaN.g == 1.0 ? NAN : result.g;\n  result.b = isNaN.b == 1.0 ? NAN : result.b;\n  result.a = isNaN.a == 1.0 ? NAN : result.a;\n\n  return result;\n", t.dtype);
    var e = new cu(t.shape, "if (x < 0.0) return NAN;\n  return log(x);");
    return this.compileAndRun(e, [t]);
  }, o.prototype.log1p = function (t) {
    var e = new cu(t.shape, "return log(1.0 + x);");
    return this.compileAndRun(e, [t]);
  }, o.prototype.sqrt = function (t) {
    var e = new cu(t.shape, "return sqrt(x);");
    return this.compileAndRun(e, [t]);
  }, o.prototype.rsqrt = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.rsqrt(t);
    var e = new cu(t.shape, "return inversesqrt(x);");
    return this.compileAndRun(e, [t]);
  }, o.prototype.reciprocal = function (t) {
    var e = new cu(t.shape, "return 1.0 / x;");
    return this.compileAndRun(e, [t]);
  }, o.prototype.relu = function (t) {
    var e;
    return e = i().getBool("WEBGL_PACK") ? new Mu(t.shape, Fu) : new cu(t.shape, du), this.compileAndRun(e, [t]);
  }, o.prototype.relu6 = function (t) {
    var e;
    return e = i().getBool("WEBGL_PACK") ? new Mu(t.shape, _u) : new cu(t.shape, pu), this.compileAndRun(e, [t]);
  }, o.prototype.prelu = function (t, e) {
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si(ki, t.shape, e.shape) : new Ri(Ei, t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.elu = function (t) {
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, Ou, t.dtype);
    var e = new cu(t.shape, vu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.eluDer = function (t, e) {
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));\n  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));\n", t.shape, e.shape) : new Ri("return (b >= 1.0) ? a : a * (b + 1.0);", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.selu = function (t) {
    var e = new cu(t.shape, gu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.int = function (t) {
    var e = new cu(t.shape, "return float(int(x));");
    return this.compileAndRun(e, [t], "int32");
  }, o.prototype.clip = function (t, e, n) {
    var r,
        o = (r = i().getBool("WEBGL_PACK_CLIP") ? new Ti(t.shape) : new Ai(t.shape)).getCustomSetupFunc(e, n);
    return this.compileAndRun(r, [t], null, o);
  }, o.prototype.abs = function (t) {
    if (this.shouldExecuteOnCPU([t])) return this.cpuBackend.abs(t);
    if (i().getBool("WEBGL_PACK_UNARY_OPERATIONS")) return this.packedUnaryOp(t, fu, t.dtype);
    var e = new cu(t.shape, fu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.complexAbs = function (t) {
    var e = this.texData.get(t.dataId),
        n = new Di(t.shape),
        r = [this.makeComplexComponentTensorInfo(t, e.complexTensors.real), this.makeComplexComponentTensorInfo(t, e.complexTensors.imag)];
    return this.compileAndRun(n, r);
  }, o.prototype.sigmoid = function (t) {
    var e = new cu(t.shape, "return 1.0 / (1.0 + exp(-1.0 * x));");
    return this.compileAndRun(e, [t]);
  }, o.prototype.softplus = function (t) {
    var e = new cu(t.shape, "\n  float epsilon = 1.1920928955078125e-7;\n  float threshold = log(epsilon) + 2.0;\n\n  bool too_large = x > -threshold;\n  bool too_small = x < threshold;\n\n  float result;\n  float exp_x = exp(x);\n\n  if (too_large){\n    result = x;\n  }\n  else if (too_small){\n    result = exp_x;\n  }\n  else{\n    result = log(exp_x + 1.0);\n  }\n  return result;\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.sin = function (t) {
    var e = new cu(t.shape, Cu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.cos = function (t) {
    var e = new cu(t.shape, Eu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.tan = function (t) {
    var e = new cu(t.shape, "return tan(x);");
    return this.compileAndRun(e, [t]);
  }, o.prototype.asin = function (t) {
    var e = new cu(t.shape, Ru);
    return this.compileAndRun(e, [t]);
  }, o.prototype.acos = function (t) {
    var e = new cu(t.shape, Iu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.atan = function (t) {
    var e = new cu(t.shape, ku);
    return this.compileAndRun(e, [t]);
  }, o.prototype.atan2 = function (t, e) {
    var n = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("\n  vec4 result = atan(a, b);\n  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));\n  \n  result.r = isNaN.r > 0. ? NAN : result.r;\n  result.g = isNaN.g > 0. ? NAN : result.g;\n  result.b = isNaN.b > 0. ? NAN : result.b;\n  result.a = isNaN.a > 0. ? NAN : result.a;\n\n  return result;\n", t.shape, e.shape) : new Ri("\n  if (isnan(a)) return a;\n  if (isnan(b)) return b;\n\n  return atan(a, b);\n", t.shape, e.shape);
    return this.compileAndRun(n, [t, e]);
  }, o.prototype.sinh = function (t) {
    var e = new cu(t.shape, "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.cosh = function (t) {
    var e = new cu(t.shape, "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.tanh = function (t) {
    var e = new cu(t.shape, "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n");
    return this.compileAndRun(e, [t]);
  }, o.prototype.asinh = function (t) {
    var e = new cu(t.shape, Su);
    return this.compileAndRun(e, [t]);
  }, o.prototype.acosh = function (t) {
    var e = new cu(t.shape, Au);
    return this.compileAndRun(e, [t]);
  }, o.prototype.atanh = function (t) {
    var e = new cu(t.shape, Tu);
    return this.compileAndRun(e, [t]);
  }, o.prototype.erf = function (t) {
    var e = new cu(t.shape, '\n  // Error function is calculated approximately with elementary function.\n  // See "Handbook of Mathematical Functions with Formulas,\n  // Graphs, and Mathematical Tables", Abramowitz and Stegun.\n  float p = 0.3275911;\n  float a1 = 0.254829592;\n  float a2 = -0.284496736;\n  float a3 = 1.421413741;\n  float a4 = -1.453152027;\n  float a5 = 1.061405429;\n\n  float sign = sign(x);\n  x = abs(x);\n  float t = 1.0 / (1.0 + p * x);\n  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));\n');
    return this.compileAndRun(e, [t]);
  }, o.prototype.step = function (t, e) {
    var n = new cu(t.shape, function (t) {
      return void 0 === t && (t = 0), lu + "\n    return x > 0.0 ? 1.0 : float(" + t + ");\n  ";
    }(e));
    return this.compileAndRun(n, [t]);
  }, o.prototype.conv2dByMatMul = function (t, e, n, r, o, a) {
    var s = t.shape,
        u = this.texData.get(t.dataId),
        c = n.inChannels,
        l = s[0] * s[1] * s[2],
        h = n.outChannels,
        f = "channelsLast" === n.dataFormat,
        d = (1 === l || 1 === h) && c > 1e3,
        p = s[2] % 2 != 0 && !!u.isPacked;

    if (d || !i().getBool("WEBGL_LAZILY_UNPACK") || !i().getBool("WEBGL_PACK_BINARY_OPERATIONS") || !p) {
      var v = f ? s[0] * s[1] * s[2] : s[0] * s[2] * s[3],
          g = this.reshape(t, [1, v, n.inChannels]),
          m = this.reshape(e, [1, n.inChannels, n.outChannels]);
      return this.reshape(this.fusedBatchMatMul({
        a: g,
        b: m,
        transposeA: !1,
        transposeB: !1,
        bias: r,
        activation: o,
        preluActivationWeights: a
      }), n.outShape);
    }

    var y = f ? s[0] * s[1] * (s[2] + 1) : s[0] * s[2] * (s[3] + 1),
        x = {
      dataId: t.dataId,
      shape: [1, y, n.inChannels],
      dtype: t.dtype
    },
        b = u.shape;
    u.shape = u.shape.slice(), u.shape[u.shape.length - 2]++, C(_e(u.shape, x.shape), function () {
      return "packed reshape " + u.shape + " to " + x.shape + " isn't free";
    });
    var w = this.reshape(e, [1, n.inChannels, n.outChannels]),
        E = this.fusedBatchMatMul({
      a: x,
      b: w,
      transposeA: !1,
      transposeB: !1,
      bias: r,
      activation: o,
      preluActivationWeights: a
    }),
        R = this.texData.get(E.dataId);
    return C(R.isPacked, function () {
      return "batchMatMul result is expected to be packed";
    }), u.shape = b, R.shape = n.outShape, Lt.makeTensorFromDataId(E.dataId, n.outShape, E.dtype);
  }, o.prototype.conv2dWithIm2Row = function (t, e, n, r, o, a) {
    var i = n.filterWidth,
        s = n.filterHeight,
        u = n.inChannels,
        c = n.outWidth,
        l = n.outHeight,
        h = "channelsLast" === n.dataFormat,
        f = i * s * u,
        d = l * c,
        p = [f, d],
        v = t.squeeze([0]),
        g = e.reshape([1, f, -1]),
        m = new Ss(p, v.shape, n),
        y = this.compileAndRun(m, [v]).reshape([1, p[0], p[1]]),
        x = null != r,
        b = null != a,
        w = o ? Lu(o, !0) : null,
        C = new _s(y.shape, [1, d, n.outChannels], !0, !1, x, w, b),
        E = [y, g];
    r && E.push(r), b && E.push(a);
    var R = this.compileAndRun(C, E);
    return h ? R.reshape([1, l, c, n.outChannels]) : R.reshape([1, n.outChannels, l, c]);
  }, o.prototype.fusedConv2d = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        a = t.activation,
        s = t.preluActivationWeights;
    if (1 === r.filterHeight && 1 === r.filterWidth && 1 === r.dilationHeight && 1 === r.dilationWidth && 1 === r.strideHeight && 1 === r.strideWidth && ("SAME" === r.padInfo.type || "VALID" === r.padInfo.type)) return this.conv2dByMatMul(e, n, r, o, a, s);
    if (i().getBool("WEBGL_CONV_IM2COL") && 1 === e.shape[0]) return this.conv2dWithIm2Row(e, n, r, o, a, s);
    var u = null != o,
        c = null != s,
        l = a ? Lu(a, !1) : null,
        h = new Ui(r, u, l, c),
        f = [e, n];
    return o && f.push(o), s && f.push(s), this.compileAndRun(h, f);
  }, o.prototype.conv2d = function (t, e, n) {
    if (1 === n.filterHeight && 1 === n.filterWidth && 1 === n.dilationHeight && 1 === n.dilationWidth && 1 === n.strideHeight && 1 === n.strideWidth && ("SAME" === n.padInfo.type || "VALID" === n.padInfo.type)) return this.conv2dByMatMul(t, e, n);
    if (i().getBool("WEBGL_CONV_IM2COL") && 1 === t.shape[0]) return this.conv2dWithIm2Row(t, e, n);
    var r = new Ui(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.conv2dDerInput = function (t, e, n) {
    var r = new Mi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.conv2dDerFilter = function (t, e, n) {
    var r = new Oi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.fusedDepthwiseConv2D = function (t) {
    var e,
        n = t.input,
        r = t.filter,
        o = t.convInfo,
        a = t.bias,
        s = t.activation,
        u = t.preluActivationWeights,
        c = i().getBool("WEBGL_PACK_DEPTHWISECONV") && o.strideWidth <= 2 && o.outChannels / o.inChannels == 1,
        l = s ? Lu(s, c) : null,
        h = [n, r],
        f = null != a,
        d = null != u;
    return f && h.push(a), d && h.push(u), c ? (e = new Gi(o, f, l, d), this.compileAndRun(e, h)) : (e = new zi(o, f, l, d), this.compileAndRun(e, h));
  }, o.prototype.depthwiseConv2D = function (t, e, n) {
    var r;
    return i().getBool("WEBGL_PACK_DEPTHWISECONV") && n.strideWidth <= 2 && n.outChannels / n.inChannels == 1 ? (r = new Gi(n), this.compileAndRun(r, [t, e])) : (r = new zi(n), this.compileAndRun(r, [t, e]));
  }, o.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    var r = new Wi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    var r = new Li(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.conv3d = function (t, e, n) {
    var r = new Vi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.conv3dDerInput = function (t, e, n) {
    var r = new Pi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.conv3dDerFilter = function (t, e, n) {
    var r = new Bi(n);
    return this.compileAndRun(r, [t, e]);
  }, o.prototype.maxPool = function (t, e) {
    var n = new Ws(e, "max", !1);
    return this.compileAndRun(n, [t]);
  }, o.prototype.avgPool = function (t, e) {
    var n = new Ws(e, "avg", !1);
    return this.compileAndRun(n, [t], "float32");
  }, o.prototype.maxPoolBackprop = function (t, e, n, r) {
    var o = new Ws(r, "max", !0),
        a = this.compileAndRun(o, [e]),
        i = new Ns(r),
        s = this.compileAndRun(i, [t, a], e.dtype);
    return a.dispose(), s;
  }, o.prototype.avgPoolBackprop = function (t, e, n) {
    var r = new fi(n);
    return this.compileAndRun(r, [t], e.dtype);
  }, o.prototype.cast = function (t, e) {
    return Ra(t, e, this);
  }, o.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, o.prototype.avgPool3d = function (t, e) {
    var n = new Us(e, "avg", !1);
    return this.compileAndRun(n, [t], "float32");
  }, o.prototype.avgPool3dBackprop = function (t, e, n) {
    var r = new di(n);
    return this.compileAndRun(r, [t], e.dtype);
  }, o.prototype.maxPool3d = function (t, e) {
    var n = new Us(e, "max", !1);
    return this.compileAndRun(n, [t], "float32");
  }, o.prototype.maxPool3dBackprop = function (t, e, n, r) {
    var o = new Us(r, "max", !0),
        a = this.compileAndRun(o, [e]),
        i = new Fs(r),
        s = this.compileAndRun(i, [t, a], e.dtype);
    return a.dispose(), s;
  }, o.prototype.reshape = function (t, e) {
    var n = this.texData.get(t.dataId);

    if (n.isPacked && !_e(t.shape, e) && (null === n.texture || !_e(n.shape, e))) {
      var r = this.packedReshape(t, e);
      return Lt.makeTensorFromDataId(r.dataId, r.shape, r.dtype);
    }

    return Ia(t, e);
  }, o.prototype.resizeBilinear = function (t, e, n, r) {
    var o = i().getBool("WEBGL_PACK_IMAGE_OPERATIONS") ? new qs(t.shape, e, n, r) : new Hs(t.shape, e, n, r);
    return this.compileAndRun(o, [t], "float32");
  }, o.prototype.resizeBilinearBackprop = function (t, e, n) {
    var r = new Gs(t, e, n);
    return this.compileAndRun(r, [t]);
  }, o.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    var o = new js(t.shape, e, n, r);
    return this.compileAndRun(o, [t]);
  }, o.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    var r = new Ks(t, e, n);
    return this.compileAndRun(r, [t]);
  }, o.prototype.multinomial = function (t, e, n, r) {
    var o = e ? t : ia(t),
        a = o.shape[0],
        i = o.shape[1],
        s = new Os(a, i, n),
        u = s.getCustomSetupFunc(r);
    return this.compileAndRun(s, [o], "int32", u);
  }, o.prototype.oneHot = function (t, e, n, r) {
    var o = new Ms(t.size, e, n, r);
    return this.compileAndRun(o, [t]);
  }, o.prototype.diag = function (t) {
    var e = new $i(t.size);
    return this.compileAndRun(e, [t]);
  }, o.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return dn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead"), Oa(t.dataSync(), e.dataSync(), n, r, o);
  }, o.prototype.cropAndResize = function (t, e, n, r, o, a) {
    var i = new Hi(t.shape, e.shape, r, o, a);
    return this.compileAndRun(i, [t, e, n], "float32");
  }, o.prototype.depthToSpace = function (t, e, n) {
    C(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });
    var r = t.shape[0],
        o = "NHWC" === n ? t.shape[1] : t.shape[2],
        a = "NHWC" === n ? t.shape[2] : t.shape[3],
        i = "NHWC" === n ? t.shape[3] : t.shape[1],
        s = o * e,
        u = a * e,
        c = i / (e * e),
        l = new Yi("NHWC" === n ? [r, s, u, c] : [r, c, s, u], e, n);
    return this.compileAndRun(l, [t]);
  }, o.prototype.split = function (t, e, n) {
    return Ua(t, e, n);
  }, o.prototype.scatterND = function (t, e, n) {
    var r = Go(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        c = [u / i, i],
        l = t.reshape([a, o]),
        h = e.reshape([a, i]);
    if (0 === u) return Ia(Fn([]), n);
    var f = On(0),
        d = new $s(a, o, l.rank, h.rank, s, c);
    return this.compileAndRun(d, [h, l, f]).reshape(n);
  }, o.prototype.sparseToDense = function (t, e, n, r) {
    var o = Go(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.strides,
        u = o.outputSize,
        c = new $s(i, a, t.rank, e.rank, s, [u, 1], !1);
    return this.compileAndRun(c, [e, t, r]).reshape(n);
  }, o.prototype.fft = function (t) {
    return this.fftImpl(t, !1);
  }, o.prototype.ifft = function (t) {
    return this.fftImpl(t, !0);
  }, o.prototype.fftImpl = function (t, e) {
    var n = this.texData.get(t.dataId),
        r = new rs(es, t.shape, e),
        o = new rs(ns, t.shape, e),
        a = [this.makeComplexComponentTensorInfo(t, n.complexTensors.real), this.makeComplexComponentTensorInfo(t, n.complexTensors.imag)],
        i = this.compileAndRun(r, a),
        s = this.compileAndRun(o, a),
        u = this.complex(i, s).as2D(t.shape[0], t.shape[1]);
    return i.dispose(), s.dispose(), u;
  }, o.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = Po(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3],
        c = e.reshape([i, r]),
        l = t.reshape([t.size / s, s]),
        h = new is(r, u, [i, s]);
    return this.compileAndRun(h, [l, c]).reshape(a);
  }, o.prototype.fill = function (t, e, n) {
    if ("string" === (n = n || j(e))) {
      var r = P(n, k(t));
      return r.fill(e), Lt.makeTensor(r, t, n, this);
    }

    var o = new os(t, e),
        a = o.getCustomSetupFunc(e);
    return this.compileAndRun(o, [], n, a);
  }, o.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported under string dtype");
    return this.fill(t.shape, 1, t.dtype);
  }, o.prototype.zerosLike = function (t) {
    return this.fill(t.shape, "string" === t.dtype ? "" : 0, t.dtype);
  }, o.prototype.linspace = function (t, e, n) {
    return ka(t, e, n);
  }, o.prototype.makeTensorInfo = function (t, e) {
    var n = this.write(null, t, e);
    return this.texData.get(n).usage = null, {
      dataId: n,
      shape: t,
      dtype: e
    };
  }, o.prototype.makeOutput = function (t, e) {
    var n = this.makeTensorInfo(t, e).dataId;
    return Lt.makeTensorFromDataId(n, t, e, this);
  }, o.prototype.unpackTensor = function (t) {
    var e = new Bu(t.shape);
    return this.runWebGLProgram(e, [t], t.dtype);
  }, o.prototype.packTensor = function (t) {
    var e = new Bs(t.shape);
    return this.runWebGLProgram(e, [t], t.dtype, null, !0);
  }, o.prototype.packedReshape = function (t, e) {
    var n = [Ae(t.shape)].concat(Te(t.shape)),
        r = {
      dtype: t.dtype,
      shape: n,
      dataId: t.dataId
    },
        o = [Ae(e)].concat(Te(e)),
        a = new zs(o, n),
        i = this.runWebGLProgram(a, [r], t.dtype, null, !0);
    return {
      dataId: i.dataId,
      shape: e,
      dtype: i.dtype
    };
  }, o.prototype.decode = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.isPacked,
        o = n.shape,
        a = n.dtype,
        i = De(o);
    e = r ? new Xi(i) : new ji(i);
    return {
      dtype: a,
      shape: o,
      dataId: this.runWebGLProgram(e, [{
        shape: i,
        dtype: a,
        dataId: t
      }], a, null, !0).dataId
    };
  }, o.prototype.runWebGLProgram = function (t, e, n, r, o) {
    var a = this;
    void 0 === o && (o = !1);
    var s = this.makeTensorInfo(t.outputShape, n),
        u = this.texData.get(s.dataId);

    if (t.packedOutput && (u.isPacked = !0), t.outPackingScheme === Vt.DENSE) {
      var c = Yt(t.outputShape);
      u.texShape = c.map(function (t) {
        return 2 * t;
      });
    }

    if (null != t.outTexUsage && (u.usage = t.outTexUsage), 0 === k(s.shape)) return u.values = B(s.dtype, 0), s;
    var l = [],
        h = e.map(function (e) {
      if ("complex64" === e.dtype) throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");
      var n = a.texData.get(e.dataId);

      if (null == n.texture) {
        if (!t.packedInputs && k(e.shape) <= i().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM")) return {
          shape: e.shape,
          texData: null,
          isUniform: !0,
          uniformValues: n.values
        };
        t.packedInputs && (n.isPacked = !0, n.shape = e.shape);
      } else if (!!n.isPacked != !!t.packedInputs) e = n.isPacked ? a.unpackTensor(e) : a.packTensor(e), l.push(e), n = a.texData.get(e.dataId);else if (n.isPacked && !_e(n.shape, e.shape)) {
        var r = e,
            o = e.shape;
        e.shape = n.shape, e = a.packedReshape(e, o), l.push(e), n = a.texData.get(e.dataId), r.shape = o;
      }

      return a.uploadToGPU(e.dataId), {
        shape: e.shape,
        texData: n,
        isUniform: !1
      };
    });
    this.uploadToGPU(s.dataId);

    var f,
        d = {
      shape: s.shape,
      texData: u,
      isUniform: !1
    },
        p = function (t, e, n) {
      var r = "";
      e.concat(n).forEach(function (t) {
        var e = null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0,
            n = t.isUniform ? "uniform" : t.texData.texShape;
        r += t.shape + "_" + n + "_" + e;
      });
      var o = t.userCode,
          a = t.constructor.name;
      return a += "_" + r + "_" + o;
    }(t, h, d),
        v = this.getAndSaveBinary(p, function () {
      return function (t, e, n, r) {
        var o = e.userCode,
            a = n.map(function (t, n) {
          var r = {
            logicalShape: t.shape,
            texShape: t.isUniform ? null : t.texData.texShape,
            isUniform: t.isUniform,
            isPacked: !t.isUniform && t.texData.isPacked,
            flatOffset: null
          };
          return null != t.texData && null != t.texData.slice && t.texData.slice.flatOffset > 0 && (r.flatOffset = t.texData.slice.flatOffset), {
            name: e.variableNames[n],
            shapeInfo: r
          };
        }),
            s = a.map(function (t) {
          return t.shapeInfo;
        }),
            u = {
          logicalShape: r.shape,
          texShape: r.texData.texShape,
          isUniform: !1,
          isPacked: r.texData.isPacked,
          flatOffset: null
        },
            c = Za(a, u, o, e.packedInputs),
            l = t.createProgram(c),
            h = null,
            f = t.getUniformLocation(l, "NAN", !1);
        1 === i().getNumber("WEBGL_VERSION") && (h = t.getUniformLocation(l, "INFINITY", !1));

        for (var d = {}, p = 0; p < e.variableNames.length; p++) {
          var v = e.variableNames[p];
          d[v] = t.getUniformLocation(l, v, !1), d["offset" + v] = t.getUniformLocation(l, "offset" + v, !1);
        }

        return {
          program: e,
          source: c,
          webGLProgram: l,
          uniformLocations: d,
          inShapeInfos: s,
          outShapeInfo: u,
          infLoc: h,
          nanLoc: f
        };
      }(a.gpgpu, t, h, d);
    }),
        g = null != this.activeTimers;

    if (g && (f = this.startTimer()), function (t, e, n, r, o) {
      ks(e.inShapeInfos, n), ks([e.outShapeInfo], [r]);
      var a = r.texData.texture,
          s = r.texData.texShape;
      r.texData.isPacked ? t.setOutputPackedMatrixTexture(a, s[0], s[1]) : t.setOutputMatrixTexture(a, s[0], s[1]), t.setProgram(e.webGLProgram), 1 === i().getNumber("WEBGL_VERSION") && null !== e.infLoc && t.gl.uniform1f(e.infLoc, 1 / 0), null !== e.nanLoc && t.gl.uniform1f(e.nanLoc, NaN), n.forEach(function (n, r) {
        var o = e.program.variableNames[r],
            a = e.uniformLocations[o],
            i = e.uniformLocations["offset" + o];
        if (null != a) if (n.isUniform) {
          if (k(n.shape) < 2) t.gl.uniform1f(a, n.uniformValues[0]);else {
            var s = n.uniformValues;
            s instanceof Float32Array || (s = new Float32Array(s)), t.gl.uniform1fv(a, s);
          }
        } else null != n.texData.slice && null != i && t.gl.uniform1i(i, n.texData.slice.flatOffset), t.setInputMatrixTexture(n.texData.texture, a, r);
      }), null != o && o(t, e.webGLProgram), t.executeProgram();
    }(this.gpgpu, v, h, d, r), l.forEach(function (t) {
      return a.disposeData(t.dataId);
    }), g && (f = this.endTimer(f), this.activeTimers.push({
      name: t.constructor.name,
      query: this.getQueryTime(f)
    })), !i().getBool("WEBGL_LAZILY_UNPACK") && u.isPacked && !1 === o) {
      var m = this.unpackTensor(s);
      return this.disposeData(s.dataId), m;
    }

    return s;
  }, o.prototype.compileAndRun = function (t, e, n, r, o) {
    void 0 === o && (o = !1), n = n || e[0].dtype;
    var a = this.runWebGLProgram(t, e, n, r, o);
    return Lt.makeTensorFromDataId(a.dataId, a.shape, a.dtype);
  }, o.prototype.getAndSaveBinary = function (t, e) {
    return t in this.binaryCache || (this.binaryCache[t] = e()), this.binaryCache[t];
  }, o.prototype.getTextureManager = function () {
    return this.textureManager;
  }, o.prototype.dispose = function () {
    var t = this;

    if (!this.disposed) {
      if (!i().getBool("IS_TEST")) Object.keys(this.binaryCache).forEach(function (e) {
        t.gpgpu.deleteProgram(t.binaryCache[e].webGLProgram), delete t.binaryCache[e];
      });
      this.textureManager.dispose(), null != this.canvas && "undefined" != typeof HTMLCanvasElement && this.canvas instanceof HTMLCanvasElement ? this.canvas.remove() : this.canvas = null, this.gpgpuCreatedLocally && (this.gpgpu.program = null, this.gpgpu.dispose()), this.disposed = !0;
    }
  }, o.prototype.floatPrecision = function () {
    var t = this;
    return null == this.floatPrecisionValue && (this.floatPrecisionValue = Ze(function () {
      if (!i().get("WEBGL_RENDER_FLOAT32_ENABLED")) {
        var e = i().getBool("DEBUG");
        i().set("DEBUG", !1);
        var n = t.abs(On(1e-8)).dataSync()[0];
        if (i().set("DEBUG", e), n > 0) return 32;
      }

      return 16;
    })), this.floatPrecisionValue;
  }, o.prototype.epsilon = function () {
    return 32 === this.floatPrecision() ? 1e-7 : 1e-4;
  }, o.prototype.uploadToGPU = function (t) {
    var e,
        n = this.texData.get(t),
        r = n.shape,
        o = n.dtype,
        a = n.values,
        i = n.texture,
        s = n.usage,
        u = n.isPacked;

    if (null == i) {
      var c,
          l = null != this.activeTimers;
      l && (c = et());
      var h = n.texShape;

      if (null == h && (h = Ne(r, u), n.texShape = h), null != a) {
        var f = De(r),
            d = void 0,
            p = h[1],
            v = h[0],
            g = a instanceof Uint8Array;
        u ? (p = (e = $t(h[0], h[1]))[0], v = e[1], d = new ts(f, [v, p], g)) : d = new Zi(f, [v, p], g);
        var m = this.makeTensorInfo([v, p], o);
        this.texData.get(m.dataId).usage = g ? zt.PIXELS : zt.UPLOAD, this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(m.dataId), p, v, a);
        var y = this.runWebGLProgram(d, [m], o, null, !0),
            x = this.texData.get(y.dataId);
        n.texture = x.texture, n.texShape = x.texShape, n.isPacked = x.isPacked, n.usage = x.usage, this.disposeData(m.dataId), this.texData.delete(y.dataId), n.values = null, l && (this.uploadWaitMs += et() - c);
      } else {
        var b = this.acquireTexture(h, s, o, u);
        n.texture = b;
      }
    }
  }, o.prototype.convertAndCacheOnCPU = function (t, e) {
    var n = this.texData.get(t),
        r = n.dtype;
    return this.releaseGPUData(t), null != e && (n.values = function (t, e) {
      if ("float32" === e || "complex64" === e) return t;

      if ("int32" === e || "bool" === e) {
        for (var n = "int32" === e ? new Int32Array(t.length) : new Uint8Array(t.length), r = 0; r < n.length; ++r) n[r] = Math.round(t[r]);

        return n;
      }

      throw new Error("Unknown dtype " + e);
    }(e, r)), n.values;
  }, o.prototype.acquireTexture = function (t, e, n, r) {
    if (this.numBytesInGPU += this.computeBytes(t, n), !this.warnedAboutMemory && this.numBytesInGPU > 1024 * this.numMBBeforeWarning * 1024) {
      var o = (this.numBytesInGPU / 1024 / 1024).toFixed(2);
      this.warnedAboutMemory = !0, console.warn("High memory usage in GPU: " + o + " MB, most likely due to a memory leak");
    }

    return this.textureManager.acquireTexture(t, e, r);
  }, o.prototype.computeBytes = function (t, e) {
    return t[0] * t[1] * z(e);
  }, o;
}(la);

Wt() && Lt.registerBackend("webgl", function () {
  return new Uu();
}, 2);
"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;

function Vu(t, e) {
  return t(e = {
    exports: {}
  }, e.exports), e.exports;
}

var zu = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e,
          n = this,
          r = (e = 4022871197, function (t) {
        t = t.toString();

        for (var n = 0; n < t.length; n++) {
          var r = .02519603282416938 * (e += t.charCodeAt(n));
          r -= e = r >>> 0, e = (r *= e) >>> 0, e += 4294967296 * (r -= e);
        }

        return 2.3283064365386963e-10 * (e >>> 0);
      });
      n.next = function () {
        var t = 2091639 * n.s0 + 2.3283064365386963e-10 * n.c;
        return n.s0 = n.s1, n.s1 = n.s2, n.s2 = t - (n.c = 0 | t);
      }, n.c = 1, n.s0 = r(" "), n.s1 = r(" "), n.s2 = r(" "), n.s0 -= r(t), n.s0 < 0 && (n.s0 += 1), n.s1 -= r(t), n.s1 < 0 && (n.s1 += 1), n.s2 -= r(t), n.s2 < 0 && (n.s2 += 1), r = null;
    }

    function o(t, e) {
      return e.c = t.c, e.s0 = t.s0, e.s1 = t.s1, e.s2 = t.s2, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = n.next;
      return i.int32 = function () {
        return 4294967296 * n.next() | 0;
      }, i.double = function () {
        return i() + 11102230246251565e-32 * (2097152 * i() | 0);
      }, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.alea = a;
  }(0, t, !1);
}),
    Gu = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.next = function () {
        var t = e.x ^ e.x << 11;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w ^= e.w >>> 19 ^ t ^ t >>> 8;
      }, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor128 = a;
  }(0, t, !1);
}),
    Hu = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.x ^ e.x >>> 2;
        return e.x = e.y, e.y = e.z, e.z = e.w, e.w = e.v, (e.d = e.d + 362437 | 0) + (e.v = e.v ^ e.v << 4 ^ t ^ t << 1) | 0;
      }, e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.v = 0, t === (0 | t) ? e.x = t : n += t;

      for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), r == n.length && (e.d = e.x << 10 ^ e.x >>> 4), e.next();
    }

    function o(t, e) {
      return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e.v = t.v, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorwow = a;
  }(0, t, !1);
}),
    qu = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.x,
            o = e.i;
        return t = r[o], n = (t ^= t >>> 7) ^ t << 24, n ^= (t = r[o + 1 & 7]) ^ t >>> 10, n ^= (t = r[o + 3 & 7]) ^ t >>> 3, n ^= (t = r[o + 4 & 7]) ^ t << 7, t = r[o + 7 & 7], n ^= (t ^= t << 13) ^ t << 9, r[o] = n, e.i = o + 1 & 7, n;
      }, function (t, e) {
        var n,
            r = [];
        if (e === (0 | e)) r[0] = e;else for (e = "" + e, n = 0; n < e.length; ++n) r[7 & n] = r[7 & n] << 15 ^ e.charCodeAt(n) + r[n + 1 & 7] << 13;

        for (; r.length < 8;) r.push(0);

        for (n = 0; n < 8 && 0 === r[n]; ++n);

        for (8 == n ? r[7] = -1 : r[n], t.x = r, t.i = 0, n = 256; n > 0; --n) t.next();
      }(e, t);
    }

    function o(t, e) {
      return e.x = t.x.slice(), e.i = t.i, e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.x && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xorshift7 = a;
  }(0, t, !1);
}),
    Ku = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this;
      e.next = function () {
        var t,
            n,
            r = e.w,
            o = e.X,
            a = e.i;
        return e.w = r = r + 1640531527 | 0, n = o[a + 34 & 127], t = o[a = a + 1 & 127], n ^= n << 13, t ^= t << 17, n ^= n >>> 15, t ^= t >>> 12, n = o[a] = n ^ t, e.i = a, n + (r ^ r >>> 16) | 0;
      }, function (t, e) {
        var n,
            r,
            o,
            a,
            i,
            s = [],
            u = 128;

        for (e === (0 | e) ? (r = e, e = null) : (e += "\0", r = 0, u = Math.max(u, e.length)), o = 0, a = -32; a < u; ++a) e && (r ^= e.charCodeAt((a + 32) % e.length)), 0 === a && (i = r), r ^= r << 10, r ^= r >>> 15, r ^= r << 4, r ^= r >>> 13, a >= 0 && (i = i + 1640531527 | 0, o = 0 == (n = s[127 & a] ^= r + i) ? o + 1 : 0);

        for (o >= 128 && (s[127 & (e && e.length || 0)] = -1), o = 127, a = 512; a > 0; --a) r = s[o + 34 & 127], n = s[o = o + 1 & 127], r ^= r << 13, n ^= n << 17, r ^= r >>> 15, n ^= n >>> 12, s[o] = r ^ n;

        t.w = i, t.X = s, t.i = o;
      }(e, t);
    }

    function o(t, e) {
      return e.i = t.i, e.w = t.w, e.X = t.X.slice(), e;
    }

    function a(t, e) {
      null == t && (t = +new Date());

      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && (a.X && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.xor4096 = a;
  }(0, t, !1);
}),
    ju = Vu(function (t) {
  !function (t, e, n) {
    function r(t) {
      var e = this,
          n = "";
      e.next = function () {
        var t = e.b,
            n = e.c,
            r = e.d,
            o = e.a;
        return t = t << 25 ^ t >>> 7 ^ n, n = n - r | 0, r = r << 24 ^ r >>> 8 ^ o, o = o - t | 0, e.b = t = t << 20 ^ t >>> 12 ^ n, e.c = n = n - r | 0, e.d = r << 16 ^ n >>> 16 ^ o, e.a = o - t | 0;
      }, e.a = 0, e.b = 0, e.c = -1640531527, e.d = 1367130551, t === Math.floor(t) ? (e.a = t / 4294967296 | 0, e.b = 0 | t) : n += t;

      for (var r = 0; r < n.length + 20; r++) e.b ^= 0 | n.charCodeAt(r), e.next();
    }

    function o(t, e) {
      return e.a = t.a, e.b = t.b, e.c = t.c, e.d = t.d, e;
    }

    function a(t, e) {
      var n = new r(t),
          a = e && e.state,
          i = function () {
        return (n.next() >>> 0) / 4294967296;
      };

      return i.double = function () {
        do {
          var t = ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
        } while (0 === t);

        return t;
      }, i.int32 = n.next, i.quick = i, a && ("object" == typeof a && o(a, n), i.state = function () {
        return o(n, {});
      }), i;
    }

    e && e.exports ? e.exports = a : n && n.amd ? n(function () {
      return a;
    }) : this.tychei = a;
  }(0, t, !1);
}),
    Xu = Vu(function (t) {
  !function (e, n) {
    var r,
        o = this,
        a = 256,
        i = 6,
        s = "random",
        u = n.pow(a, i),
        c = n.pow(2, 52),
        l = 2 * c,
        h = a - 1;

    function f(t, h, f) {
      var m = [],
          y = v(function t(e, n) {
        var r,
            o = [],
            a = typeof e;
        if (n && "object" == a) for (r in e) try {
          o.push(t(e[r], n - 1));
        } catch (t) {}
        return o.length ? o : "string" == a ? e : e + "\0";
      }((h = 1 == h ? {
        entropy: !0
      } : h || {}).entropy ? [t, g(e)] : null == t ? function () {
        try {
          var t;
          return r && (t = r.randomBytes) ? t = t(a) : (t = new Uint8Array(a), (o.crypto || o.msCrypto).getRandomValues(t)), g(t);
        } catch (t) {
          var n = o.navigator,
              i = n && n.plugins;
          return [+new Date(), o, i, o.screen, g(e)];
        }
      }() : t, 3), m),
          x = new d(m),
          b = function () {
        for (var t = x.g(i), e = u, n = 0; t < c;) t = (t + n) * a, e *= a, n = x.g(1);

        for (; t >= l;) t /= 2, e /= 2, n >>>= 1;

        return (t + n) / e;
      };

      return b.int32 = function () {
        return 0 | x.g(4);
      }, b.quick = function () {
        return x.g(4) / 4294967296;
      }, b.double = b, v(g(x.S), e), (h.pass || f || function (t, e, r, o) {
        return o && (o.S && p(o, x), t.state = function () {
          return p(x, {});
        }), r ? (n[s] = t, e) : t;
      })(b, y, "global" in h ? h.global : this == n, h.state);
    }

    function d(t) {
      var e,
          n = t.length,
          r = this,
          o = 0,
          i = r.i = r.j = 0,
          s = r.S = [];

      for (n || (t = [n++]); o < a;) s[o] = o++;

      for (o = 0; o < a; o++) s[o] = s[i = h & i + t[o % n] + (e = s[o])], s[i] = e;

      (r.g = function (t) {
        for (var e, n = 0, o = r.i, i = r.j, s = r.S; t--;) e = s[o = h & o + 1], n = n * a + s[h & (s[o] = s[i = h & i + e]) + (s[i] = e)];

        return r.i = o, r.j = i, n;
      })(a);
    }

    function p(t, e) {
      return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e;
    }

    function v(t, e) {
      for (var n, r = t + "", o = 0; o < r.length;) e[h & o] = h & (n ^= 19 * e[h & o]) + r.charCodeAt(o++);

      return g(e);
    }

    function g(t) {
      return String.fromCharCode.apply(0, t);
    }

    if (n["seed" + s] = f, v(n.random(), e), t.exports) {
      t.exports = f;

      try {
        r = require("crypto");
      } catch (t) {}
    }
  }([], Math);
});
Xu.alea = zu, Xu.xor128 = Gu, Xu.xorwow = Hu, Xu.xorshift7 = qu, Xu.xor4096 = Ku, Xu.tychei = ju;
var Yu = Xu.alea;
var $u = An({
  addN_: function (t) {
    C(Array.isArray(t), function () {
      return "The argument passed to tf.addN() must be a list of tensors";
    }), C(t.length >= 1, function () {
      return "Must pass at least one tensor to tf.addN(), but got " + t.length;
    });
    var e = t.map(function (t, e) {
      return gn(t, "tensors" + e, "addN");
    }),
        n = e[0];
    e.forEach(function (t) {
      if (t.dtype !== n.dtype) throw new Error("All tensors passed to tf.addN() must have the same dtype");
    }), e.forEach(function (t) {
      if (!S(t.shape, n.shape)) throw new Error("All tensors passed to tf.addN() must have the same shape");
    });
    var r = e;
    return Lt.runKernelFunc(function (t, n) {
      return t.addN(e);
    }, r, null, "AddN");
  }
});
exports.addN = $u;

function Qu() {
  Xe("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon");
}

function Ju(t) {
  return 0 === t.rank || 1 === t.rank ? t.as4D(1, 1, 1, t.size) : 2 === t.rank ? t.as4D(1, 1, t.shape[0], t.shape[1]) : 3 === t.rank ? t.as4D(1, t.shape[0], t.shape[1], t.shape[2]) : t;
}

function Zu(t, e, n, r, o, a) {
  null == a && (a = .001);
  var i,
      s,
      u = gn(t, "x", "batchNorm"),
      c = gn(e, "mean", "batchNorm"),
      l = gn(n, "variance", "batchNorm");
  null != o && (i = gn(o, "scale", "batchNorm")), null != r && (s = gn(r, "offset", "batchNorm")), C(c.rank === l.rank, function () {
    return "Batch normalization gradient requires mean and variance to have equal ranks.";
  }), C(null == s || c.rank === s.rank, function () {
    return "Batch normalization gradient requires mean and offset to have equal ranks.";
  }), C(null == i || c.rank === i.rank, function () {
    return "Batch normalization gradient requires mean and scale to have equal ranks.";
  });
  var h = {
    x: u,
    scale: i,
    offset: s,
    mean: c,
    variance: l
  },
      f = {
    varianceEpsilon: a
  };
  return Lt.runKernelFunc(function (t, e) {
    var n = Ju(u),
        r = t.batchNormalization(n, tc(c), tc(l), a, tc(i), tc(s));
    return e([u, c, l, i]), r;
  }, h, null, "FusedBatchNorm", f).reshape(u.shape);
}

function tc(t) {
  return null == t ? null : 0 === t.rank ? t.as1D() : 1 === t.rank ? t : 2 === t.rank ? t.as4D(1, 1, t.shape[0], t.shape[1]) : 3 === t.rank ? t.as4D(1, t.shape[0], t.shape[1], t.shape[2]) : t;
}

var ec = An({
  batchNormalization_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), Qu(), Zu(t, e, n, a, o, r);
  }
}),
    nc = An({
  batchNorm_: Zu
});
exports.batchNorm = nc;
exports.batchNormalization = ec;

function rc(t, e, n, r, o, a) {
  var i,
      s,
      u = gn(t, "x", "batchNorm"),
      c = gn(e, "mean", "batchNorm"),
      l = gn(n, "variance", "batchNorm");
  return null != o && (i = gn(o, "scale", "batchNorm")), null != r && (s = gn(r, "offset", "batchNorm")), C(2 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), C(2 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank " + c.rank + ".";
  }), C(2 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank " + l.rank + ".";
  }), null != i && C(2 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank " + i.rank + ".";
  }), null != s && C(2 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank " + s.rank + ".";
  }), nc(u, c, l, s, i, a);
}

var oc = An({
  batchNormalization2d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), Qu(), rc(t, e, n, a, o, r);
  }
}),
    ac = An({
  batchNorm2d_: rc
});
exports.batchNorm2d = ac;
exports.batchNormalization2d = oc;

function ic(t, e, n, r, o, a) {
  var i,
      s,
      u = gn(t, "x", "batchNorm"),
      c = gn(e, "mean", "batchNorm"),
      l = gn(n, "variance", "batchNorm");
  return null != o && (i = gn(o, "scale", "batchNorm")), null != r && (s = gn(r, "offset", "batchNorm")), C(3 === u.rank, function () {
    return "Error in batchNorm3D: x must be rank 3 but got rank " + u.rank + ".";
  }), C(3 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank " + c.rank + ".";
  }), C(3 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank " + l.rank + ".";
  }), null != i && C(3 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank " + i.rank + ".";
  }), null != s && C(3 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank " + s.rank + ".";
  }), nc(u, c, l, s, i, a);
}

var sc = An({
  batchNormalization3d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), Qu(), ic(t, e, n, a, o, r);
  }
}),
    uc = An({
  batchNorm3d_: ic
});
exports.batchNorm3d = uc;
exports.batchNormalization3d = sc;

function cc(t, e, n, r, o, a) {
  var i,
      s,
      u = gn(t, "x", "batchNorm"),
      c = gn(e, "mean", "batchNorm"),
      l = gn(n, "variance", "batchNorm");
  return null != o && (i = gn(o, "scale", "batchNorm")), null != r && (s = gn(r, "offset", "batchNorm")), C(4 === u.rank, function () {
    return "Error in batchNorm4D: x must be rank 4 but got rank " + u.rank + ".";
  }), C(4 === c.rank || 1 === c.rank, function () {
    return "Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank " + c.rank + ".";
  }), C(4 === l.rank || 1 === l.rank, function () {
    return "Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank " + l.rank + ".";
  }), null != i && C(4 === i.rank || 1 === i.rank, function () {
    return "Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank " + i.rank + ".";
  }), null != s && C(4 === s.rank || 1 === s.rank, function () {
    return "Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank " + s.rank + ".";
  }), nc(u, c, l, s, i, a);
}

var lc = An({
  batchNormalization4d_: function (t, e, n, r, o, a) {
    return void 0 === r && (r = .001), Qu(), cc(t, e, n, a, o, r);
  }
}),
    hc = An({
  batchNorm4d_: cc
});
exports.batchNorm4d = hc;
exports.batchNormalization4d = lc;
var fc = An({
  broadcastTo_: function (t, e) {
    var n = gn(t, "broadcastTo", "x"),
        r = n.shape;
    if (e.some(function (t) {
      return !(t > 0) || t % 1 != 0;
    })) throw new Error("broadcastTo(): Invalid broadcast shape [" + e + "].");
    if (e.length < n.rank) throw new Error("broadcastTo(): shape.length=" + e.length + " < input.rank=" + n.rank + ".");

    if (e.length > n.rank) {
      for (var o = n.shape.slice(); o.length < e.length;) o.unshift(1);

      n = n.reshape(o);
    }

    for (var a = n.shape, i = Array.from(e), s = e.length - 1; s >= 0; s--) if (a[s] === e[s]) i[s] = 1;else if (1 !== n.shape[s]) throw new Error("broadcastTo(): [" + r + "] cannot be broadcast to [" + e + "].");

    var u = i.map(function (t, e) {
      return t > 1 ? e : -1;
    }).filter(function (t) {
      return t >= 0;
    });
    if (0 === u.length) return n.clone();
    var c = {
      x: n
    },
        l = {
      shape: e,
      inputShape: a
    };
    return Lt.runKernelFunc(function (t) {
      return t.tile(n, i);
    }, c, function (t) {
      return {
        x: function () {
          return t.sum(u, !0);
        }
      };
    }, Sr, l);
  }
});
exports.broadcastTo = fc;
var dc = An({
  clone_: function (t) {
    var e = gn(t, "x", "clone", null);
    return Lt.runKernelFunc(function () {
      return Lt.makeTensorFromDataId(e.dataId, e.shape, e.dtype);
    }, {
      x: e
    }, null, Tr);
  }
});
exports.clone = dc;

var pc = An({
  logicalAnd_: function (t, e) {
    var n = gn(t, "a", "logicalAnd", "bool"),
        r = gn(e, "b", "logicalAnd", "bool");
    return Pr(n.shape, r.shape), Lt.runKernelFunc(function (t) {
      return t.logicalAnd(n, r);
    }, {
      a: n,
      b: r
    }, null, "LogicalAnd");
  }
}),
    vc = An({
  logicalNot_: function (t) {
    var e = gn(t, "x", "logicalNot", "bool");
    return Lt.runKernelFunc(function (t) {
      return t.logicalNot(e);
    }, {
      $x: e
    });
  }
}),
    gc = An({
  logicalOr_: function (t, e) {
    var n = gn(t, "a", "logicalOr", "bool"),
        r = gn(e, "b", "logicalOr", "bool");
    return Pr(n.shape, r.shape), Lt.runKernelFunc(function (t) {
      return t.logicalOr(n, r);
    }, {
      $a: n,
      $b: r
    });
  }
}),
    mc = An({
  logicalXor_: function (t, e) {
    var n = gn(t, "a", "logicalXor", "bool"),
        r = gn(e, "b", "logicalXor", "bool");
    return Pr(n.shape, r.shape), gc(t, e).logicalAnd(pc(t, e).logicalNot());
  }
}),
    yc = An({
  where_: function (t, e, n) {
    var r = gn(e, "a", "where"),
        o = gn(n, "b", "where"),
        a = gn(t, "condition", "where", "bool");
    return E(r.shape, o.shape, "Error in where: "), 1 === a.rank ? C(a.shape[0] === r.shape[0], function () {
      return "The first dimension of `a` must match the size of `condition`.";
    }) : E(a.shape, o.shape, "Error in where: "), Lt.runKernelFunc(function (t, e) {
      var n = t.select(a, r, o);
      return e([a]), n;
    }, {
      $condition: a,
      $a: r,
      $b: o
    }, function (t, e) {
      var n = e[0];
      return {
        $condition: function () {
          return Xn(n).toFloat();
        },
        $a: function () {
          return t.mul(n.cast(t.dtype));
        },
        $b: function () {
          return t.mul(n.logicalNot().cast(t.dtype));
        }
      };
    });
  }
}),
    xc = function (t) {
  return n(this, void 0, void 0, function () {
    var e, n, o;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return [4, (e = gn(t, "condition", "whereAsync", "bool")).data()];

        case 1:
          return n = r.sent(), o = Ga(e.shape, n), t !== e && e.dispose(), [2, o];
      }
    });
  });
};

exports.whereAsync = xc;
exports.where = yc;
exports.logicalXor = mc;
exports.logicalOr = gc;
exports.logicalNot = vc;
exports.logicalAnd = pc;
var bc = An({
  divNoNan_: function (t, e) {
    var n,
        r = gn(t, "a", "div"),
        o = gn(e, "b", "div");
    r = (n = Nt(r, o))[0], o = n[1];
    var a = Bo(r, o),
        i = Xn(a),
        s = o.equal(i);
    return yc(s, i, a);
  }
});
exports.divNoNan = bc;
var wc = An({
  tile_: function (t, e) {
    var n = gn(t, "x", "tile", null);
    C(n.rank === e.length, function () {
      return "Error in transpose: rank of input " + n.rank + " must match length of reps " + e + ".";
    });
    var r = [n],
        o = {
      x: n
    },
        a = {
      reps: e
    };
    return Lt.runKernelFunc(function (t, r) {
      var o = t.tile(n, e);
      return r([n]), o;
    }, o, null, Dr, a, r);
  }
});
exports.tile = wc;
var Cc = An({
  eye_: function (t, e, n, r) {
    void 0 === r && (r = "float32"), null == e && (e = t);

    for (var o = er([t, e], r), a = t <= e ? t : e, i = 0; i < a; ++i) o.set(1, i, i);

    var s = o.toTensor().as2D(t, e);
    if (null == n) return s;
    if (1 === n.length) return wc(sr(s, 0), [n[0], 1, 1]);
    if (2 === n.length) return wc(sr(sr(s, 0), 0), [n[0], n[1], 1, 1]);
    if (3 === n.length) return wc(sr(sr(sr(s, 0), 0), 0), [n[0], n[1], n[2], 1, 1]);
    throw new Error("eye() currently supports only 1D and 2D batchShapes, but received " + n.length + "D.");
  }
});
exports.eye = Cc;
var Ec = An({
  multinomial_: function (t, e, n, r) {
    void 0 === r && (r = !1);
    var o = gn(t, "logits", "multinomial"),
        a = o.size,
        i = o.rank;
    if (a < 2) throw new Error("Error in multinomial: you need at least 2 outcomes, but got " + a + ".");
    if (i > 2) throw new Error("Rank of probabilities must be 1 or 2, but is " + i);
    n = n || Math.random();
    var s = 1 === i ? o.as2D(1, -1) : o,
        u = Lt.runKernelFunc(function (t) {
      return t.multinomial(s, r, e, n);
    }, {
      logits2D: s
    });
    return 1 === i ? u.as1D() : u;
  }
});
exports.multinomial = Ec;
var Rc = An({
  oneHot_: function (t, e, n, r) {
    if (void 0 === n && (n = 1), void 0 === r && (r = 0), e < 2) throw new Error("Error in oneHot: depth must be >=2, but it is " + e);
    var o = gn(t, "indices", "oneHot", "int32"),
        a = o.shape.concat([e]),
        i = {
      indices: o = o.flatten()
    },
        s = {
      depth: e,
      onValue: n,
      offValue: r
    };
    return Lt.runKernelFunc(function (t, a) {
      return a([o]), t.oneHot(o, e, n, r);
    }, i, null, Ar, s).reshape(a);
  }
});
exports.oneHot = Rc;
var Ic = An({
  pad_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = gn(t, "x", "pad");
    if (0 === r.rank) throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");
    var o = {
      paddings: e,
      constantValue: n
    },
        a = {
      x: r
    };
    return Lt.runKernelFunc(function (t, o) {
      return o([r]), t.pad(r, e, n);
    }, a, null, Nr, o);
  }
});
exports.pad = Ic;
var kc = An({
  pad1d_: function (t, e, n) {
    return void 0 === n && (n = 0), C(2 === e.length, function () {
      return "Invalid number of paddings. Must be length of 2.";
    }), Ic(t, [e], n);
  }
});
exports.pad1d = kc;
var Sc = An({
  pad2d_: function (t, e, n) {
    return void 0 === n && (n = 0), C(2 === e.length && 2 === e[0].length && 2 === e[1].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Ic(t, e, n);
  }
});
exports.pad2d = Sc;
var Ac = An({
  pad3d_: function (t, e, n) {
    return void 0 === n && (n = 0), C(3 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Ic(t, e, n);
  }
});
exports.pad3d = Ac;
var Tc = An({
  pad4d_: function (t, e, n) {
    return void 0 === n && (n = 0), C(4 === e.length && 2 === e[0].length && 2 === e[1].length && 2 === e[2].length && 2 === e[3].length, function () {
      return "Invalid number of paddings. Must be length of 2 each.";
    }), Ic(t, e, n);
  }
});
exports.pad4d = Tc;
var Dc = An({
  rand_: function (t, e, n) {
    var r = k(t),
        o = null;
    if (null == n || "float32" === n) o = new Float32Array(r);else if ("int32" === n) o = new Int32Array(r);else {
      if ("bool" !== n) throw new Error("Unknown data type " + n);
      o = new Uint8Array(r);
    }

    for (var a = 0; a < r; a++) o[a] = e();

    return Lt.makeTensor(o, t, n);
  }
}),
    Nc = .001,
    Fc = .1;
exports.rand = Dc;

function _c() {
  return 32 === Lt.backend.floatPrecision() ? Nc : Fc;
}

function Oc(t, e, n) {
  var r = !0;

  if ((V(t) || V(e)) && (r = !1), V(t) && V(e) && (r = !0), r) {
    var o = t.constructor.name,
        a = e.constructor.name;
    if (o !== a) throw new Error("Arrays are of different type. Actual: " + o + ". Expected: " + a);
  }

  if (Array.isArray(t) && Array.isArray(e)) {
    var i = pn(t),
        s = pn(e);
    if (!S(i, s)) throw new Error("Arrays have different shapes. Actual: [" + i + "]. Expected: [" + s + "]");
  }

  var u = V(t) ? t : I(t),
      c = V(e) ? e : I(e);
  if (u.length !== c.length) throw new Error("Arrays have different lengths actual: " + u.length + " vs expected: " + c.length + ".\nActual:   " + u + ".\nExpected: " + c + ".");

  for (var l = 0; l < c.length; ++l) {
    var h = u[l],
        f = c[l];
    if (!n(h, f)) throw new Error("Arrays differ: actual[" + l + "] = " + h + ", expected[" + l + "] = " + f + ".\nActual:   " + u + ".\nExpected: " + c + ".");
  }
}

function Mc(t, e, n) {
  return !isFinite(t) && !isFinite(e) || !(isNaN(t) || isNaN(e) || Math.abs(t - e) > n);
}

var Bc = Object.freeze({
  TEST_EPSILON_FLOAT16: Fc,
  expectArraysClose: function (t, e, n) {
    return null == n && (n = _c()), Oc(t, e, function (t, e) {
      return Mc(t, e, n);
    });
  },
  testEpsilon: _c,
  expectPromiseToFail: function (t, e) {
    t().then(function () {
      return e.fail();
    }, function () {
      return e();
    });
  },
  expectArraysEqual: function (t, e) {
    var n = "string" == typeof e || "number" == typeof e || "boolean" == typeof e ? [e] : e;
    return H(t) || H(t[0]) || H(e) || H(e[0]) ? Oc(t, n, function (t, e) {
      return t == e;
    }) : Oc(t, e, function (t, e) {
      return Mc(t, e, 0);
    });
  },
  expectNumbersClose: function (t, e, n) {
    if (null == n && (n = _c()), !Mc(t, e, n)) throw new Error("Numbers differ: actual === " + t + ", expected === " + e);
  },
  expectValuesInRange: function (t, e, n) {
    for (var r = 0; r < t.length; r++) if (t[r] < e || t[r] > n) throw new Error("Value out of range:" + t[r] + " low: " + e + ", high: " + n);
  },
  expectArrayBuffersEqual: function (t, e) {
    expect(new Float32Array(t)).toEqual(new Float32Array(e));
  }
}),
    Pc = function () {
  function t(t, e, n, r, o) {
    this.mean = t, this.stdDev = e, this.dtype = n, this.nextVal = NaN, this.truncated = r, this.truncated && (this.upper = this.mean + 2 * this.stdDev, this.lower = this.mean - 2 * this.stdDev);
    var a = o || Math.random();
    this.random = Yu(a.toString());
  }

  return t.prototype.nextValue = function () {
    if (!isNaN(this.nextVal)) {
      var t = this.nextVal;
      return this.nextVal = NaN, t;
    }

    for (var e, n, r = !1; !r;) {
      var o = void 0,
          a = void 0,
          i = void 0;

      do {
        i = (o = 2 * this.random() - 1) * o + (a = 2 * this.random() - 1) * a;
      } while (i >= 1 || 0 === i);

      var s = Math.sqrt(-2 * Math.log(i) / i);
      e = this.mean + this.stdDev * o * s, n = this.mean + this.stdDev * a * s, this.truncated && !this.isValidTruncated(e) || (r = !0);
    }

    return this.truncated && !this.isValidTruncated(n) || (this.nextVal = this.convertValue(n)), this.convertValue(e);
  }, t.prototype.convertValue = function (t) {
    return null == this.dtype || "float32" === this.dtype ? t : Math.round(t);
  }, t.prototype.isValidTruncated = function (t) {
    return t <= this.upper && t >= this.lower;
  }, t;
}(),
    Lc = function () {
  function t(t, e, n, r) {
    this.alpha = t, this.beta = 1 / e, this.dtype = n;
    var o = r || Math.random();
    this.randu = Yu(o.toString()), this.randn = new Pc(0, 1, n, !1, this.randu()), this.d = t < 1 ? t + 2 / 3 : t - 1 / 3, this.c = 1 / Math.sqrt(9 * this.d);
  }

  return t.prototype.nextValue = function () {
    for (var t, e, n, r, o, a;;) {
      do {
        r = this.randn.nextValue(), a = 1 + this.c * r;
      } while (a <= 0);

      if (a *= a * a, e = 1 - .331 * (t = r * r) * t, n = .5 * t + this.d * (1 - a + Math.log(a)), (o = this.randu()) < e || Math.log(o) < n) break;
    }

    return a = 1 / this.beta * this.d * a, this.alpha < 1 && (a *= Math.pow(this.randu(), 1 / this.alpha)), this.convertValue(a);
  }, t.prototype.convertValue = function (t) {
    return "float32" === this.dtype ? t : Math.round(t);
  }, t;
}(),
    Wc = function () {
  function t(t, e, n, r) {
    var o = this;
    if (void 0 === t && (t = 0), void 0 === e && (e = 1), this.canReturnFloat = function () {
      return null == o.dtype || "float32" === o.dtype;
    }, this.min = t, this.range = e - t, this.dtype = n, null == r && (r = Math.random()), "number" == typeof r && (r = r.toString()), !this.canReturnFloat() && this.range <= 1) throw new Error("The difference between " + t + " - " + e + " <= 1 and dtype is not float");
    this.random = Yu(r);
  }

  return t.prototype.convertValue = function (t) {
    return this.canReturnFloat() ? t : Math.round(t);
  }, t.prototype.nextValue = function () {
    return this.convertValue(this.min + this.range * this.random());
  }, t;
}();

exports.test_util = Bc;
var Uc = An({
  randomGamma_: function (t, e, n, r, o) {
    if (void 0 === n && (n = 1), void 0 === r && (r = "float32"), null == n && (n = 1), null == r && (r = "float32"), "float32" !== r && "int32" !== r) throw new Error("Unsupported data type " + r);

    for (var a = new Lc(e, n, r, o), i = er(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
});
exports.randomGamma = Uc;
var Vc = An({
  randomNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type " + r);

    for (var a = new Pc(e, n, r, !1, o), i = er(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
});
exports.randomNormal = Vc;
var zc = An({
  randomUniform_: function (t, e, n, r, o) {
    void 0 === e && (e = 0), void 0 === n && (n = 1), void 0 === r && (r = "float32");

    for (var a = er(t, r), i = new Wc(e, n, null, o), s = 0; s < a.values.length; s++) a.values[s] = i.nextValue();

    return a.toTensor();
  }
});
exports.randomUniform = zc;
var Gc = An({
  square_: function (t) {
    var e = gn(t, "x", "square"),
        n = [e];
    return Lt.runKernelFunc(function (t, n) {
      return n([e]), t.square(e);
    }, {
      x: e
    }, null, "Square", {}, n, []);
  }
});
exports.square = Gc;
var Hc = An({
  squaredDifference_: function (t, e) {
    var n,
        r = gn(t, "a", "squaredDifference"),
        o = gn(e, "b", "squaredDifference");
    n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape);
    var a = {
      a: r,
      b: o
    },
        i = [r, o];
    return Lt.runKernelFunc(function (t, e) {
      var n = t.squaredDifference(r, o);
      return e([r, o]), n;
    }, a, function (t, e) {
      var n = e[0],
          r = e[1],
          o = On(2);
      return {
        a: function () {
          return t.mul(n.sub(r).mul(o));
        },
        b: function () {
          return t.mul(r.sub(n).mul(o));
        }
      };
    }, Er, {}, i, []);
  }
});
exports.squaredDifference = Hc;
var qc = An({
  truncatedNormal_: function (t, e, n, r, o) {
    if (void 0 === e && (e = 0), void 0 === n && (n = 1), null != r && "bool" === r) throw new Error("Unsupported data type $ { dtype }");

    for (var a = new Pc(e, n, r, !0, o), i = er(t, r), s = 0; s < i.values.length; s++) i.values[s] = a.nextValue();

    return i.toTensor();
  }
});
exports.truncatedNormal = qc;
var Kc = An({
  equal_: function (t, e) {
    var n,
        r = gn(t, "a", "equal"),
        o = gn(e, "b", "equal");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t) {
      return t.equal(r, o);
    }, {
      $a: r,
      $b: o
    });
  }
}),
    jc = An({
  equalStrict_: function (t, e) {
    var n = gn(t, "a", "equalStrict"),
        r = gn(e, "b", "equalStrict");
    return E(n.shape, r.shape, "Error in equalStrict: "), n.equal(r);
  }
}),
    Xc = An({
  greater_: function (t, e) {
    var n,
        r = gn(t, "a", "greater"),
        o = gn(e, "b", "greater");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t) {
      return t.greater(r, o);
    }, {
      a: r,
      b: o
    }, null, "Greater");
  }
}),
    Yc = An({
  greaterEqual_: function (t, e) {
    var n,
        r = gn(t, "a", "greaterEqual"),
        o = gn(e, "b", "greaterEqual");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t, e) {
      var n = t.greaterEqual(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, function (t, e) {
      var n = e[0],
          r = e[1];
      return {
        a: function () {
          return Xn(n);
        },
        b: function () {
          return Xn(r);
        }
      };
    }, "GreaterEqual");
  }
}),
    $c = An({
  greaterEqualStrict_: function (t, e) {
    var n = gn(t, "a", "greaterEqualStrict"),
        r = gn(e, "b", "greaterEqualStrict");
    return E(n.shape, r.shape, "Error in greaterEqualStrict: "), n.greaterEqual(r);
  }
}),
    Qc = An({
  greaterStrict_: function (t, e) {
    var n = gn(t, "a", "greaterStrict"),
        r = gn(e, "b", "greaterStrict");
    return E(n.shape, r.shape, "Error in greaterStrict: "), n.greater(r);
  }
}),
    Jc = An({
  less_: function (t, e) {
    var n,
        r = gn(t, "a", "less"),
        o = gn(e, "b", "less");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t) {
      return t.less(r, o);
    }, {
      a: r,
      b: o
    }, null, "Less");
  }
}),
    Zc = An({
  lessEqual_: function (t, e) {
    var n,
        r = gn(t, "a", "lessEqual"),
        o = gn(e, "b", "lessEqual");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t, e) {
      var n = t.lessEqual(r, o);
      return e([r, o]), n;
    }, {
      a: r,
      b: o
    }, null, "LessEqual");
  }
}),
    tl = An({
  lessEqualStrict_: function (t, e) {
    var n = gn(t, "a", "lessEqualStrict"),
        r = gn(e, "b", "lessEqualStrict");
    return E(n.shape, r.shape, "Error in lessEqualStrict: "), n.lessEqual(r);
  }
}),
    el = An({
  lessStrict_: function (t, e) {
    var n = gn(t, "a", "lessStrict"),
        r = gn(e, "b", "lessStrict");
    return E(n.shape, r.shape, "Error in lessStrict: "), n.less(r);
  }
}),
    nl = An({
  notEqual_: function (t, e) {
    var n,
        r = gn(t, "a", "notEqual"),
        o = gn(e, "b", "notEqual");
    return n = Nt(r, o), r = n[0], o = n[1], Pr(r.shape, o.shape), Lt.runKernelFunc(function (t) {
      return t.notEqual(r, o);
    }, {
      a: r,
      b: o
    }, null, "NotEqual");
  }
}),
    rl = An({
  notEqualStrict_: function (t, e) {
    var n = gn(t, "a", "notEqualStrict"),
        r = gn(e, "b", "notEqualStrict");
    return E(n.shape, r.shape, "Error in notEqualStrict: "), n.notEqual(r);
  }
});
exports.notEqualStrict = rl;
exports.notEqual = nl;
exports.lessStrict = el;
exports.lessEqualStrict = tl;
exports.lessEqual = Zc;
exports.less = Jc;
exports.greaterStrict = Qc;
exports.greaterEqualStrict = $c;
exports.greaterEqual = Yc;
exports.greater = Xc;
exports.equalStrict = jc;
exports.equal = Kc;

function ol(t, e) {
  for (var n = [], r = t; r < e; ++r) n.push(r);

  return n;
}

function al(t) {
  for (var e = [], n = 0; n < t.length; ++n) for (var r = 0; r < t[n].length; ++r) e.push(t[n][r]);

  return e;
}

var il = An({
  gather_: function (t, e, n) {
    void 0 === n && (n = 0);
    var r = gn(t, "x", "gather"),
        o = gn(e, "indices", "gather", "int32");
    n = O(n, r.shape)[0];

    var a = function (t, e, n) {
      for (var r = t.shape[n], o = [], a = 1, i = 1, s = 0; s < n; s++) o.push(t.shape[s]), a *= t.shape[s];

      for (s = 0; s < e.rank; s++) o.push(e.shape[s]);

      for (s = n + 1; s < t.rank; s++) o.push(t.shape[s]), i *= t.shape[s];

      return {
        batchSize: a,
        sliceSize: i,
        dimSize: r,
        outputShape: o
      };
    }(r, o, n);

    return Lt.runKernelFunc(function (t, e) {
      var a = t.gather(r, o.flatten(), n);
      return e([o]), a;
    }, {
      x: r,
      indices: o
    }, function (t, e) {
      var o = e[0];
      return {
        x: function () {
          var e = r.shape,
              a = o.size,
              i = e.slice(0, n),
              s = i.length,
              u = e.slice(n, e.length).slice(1),
              c = u.length,
              l = ol(0, s),
              h = ol(s + 1, s + 1 + c),
              f = al([i, [a], u]),
              d = t.reshape(f),
              p = o.reshape([a]),
              v = al([[s], l, h]),
              g = d.transpose(v),
              m = sl(g, p, r.shape[n]),
              y = Rn(v);
          return m = m.transpose(y);
        },
        indices: function () {
          return o;
        }
      };
    }, "Gather", {
      axis: n
    }).reshape(a.outputShape);
  }
}),
    sl = An({
  unsortedSegmentSum_: function (t, e, n) {
    var r = gn(t, "x", "unsortedSegmentSum"),
        o = gn(e, "segmentIds", "unsortedSegmentSum", "int32");
    return C(A(n), function () {
      return "numSegments must be of dtype int";
    }), Lt.runKernelFunc(function (t, e) {
      var a = t.unsortedSegmentSum(r, o, n);
      return e([o]), a;
    }, {
      $x: r
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return function (t, e) {
            for (var n = Eo(e, Xn(e)), r = il(t, n), o = Yc(e, On(0, "int32")), a = r.rank - o.rank, i = 0; i < a; ++i) o = sr(o, i + 1);

            o = pc(o, zn(r.shape, "bool"));
            var s = Xn(r);
            return yc(o, r, s);
          }(t, n);
        }
      };
    });
  }
});
exports.unsortedSegmentSum = sl;
exports.gather = il;

var ul = function (t, e, o) {
  return n(this, void 0, void 0, function () {
    var n, a, i, s, u, c, l, h, f, d, p, v, g;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          for (n = gn(t, "tensor", "boolMask"), a = gn(e, "mask", "boolMask", "bool"), i = null == o ? 0 : o, s = a.rank, u = n.shape, C(s > 0, function () {
            return "mask cannot be scalar";
          }), E(u.slice(i, i + s), a.shape, "mask's shape must match the first K dimensions of tensor's shape,"), c = 1, l = i; l < i + s; l++) c *= u[l];

          return h = u.slice(0, i).concat([c], u.slice(i + s)), f = n.reshape(h), d = a.reshape([-1]), [4, xc(d)];

        case 1:
          return p = r.sent(), v = p.squeeze([1]), g = il(f, v, i), t !== n && n.dispose(), e !== a && a.dispose(), v.dispose(), f.dispose(), d.dispose(), p.dispose(), [2, g];
      }
    });
  });
};

exports.booleanMaskAsync = ul;

function cl(t, e, n, r, o, a, i) {
  void 0 === a && (a = "NHWC"), C(t.length === e.rank, function () {
    return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
  });
  var s = t,
      u = e,
      c = !1;
  3 === e.rank && (c = !0, u = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]), s = [1, t[0], t[1], t[2]]), C(4 === s.length, function () {
    return "Error in conv2dDerInput: inShape must be length 4, but got length " + s.length + ".";
  }), C(4 === u.rank, function () {
    return "Error in conv2dDerInput: dy must be rank 4, but got rank " + u.rank;
  }), C(4 === n.rank, function () {
    return "Error in conv2dDerInput: filter must be rank 4, but got rank " + n.rank;
  });
  var l = "NHWC" === a ? s[3] : s[1],
      h = "NHWC" === a ? u.shape[3] : u.shape[1];
  C(l === n.shape[2], function () {
    return "Error in conv2dDerInput: depth of input (" + l + ") must match input depth for filter " + n.shape[2] + ".";
  }), C(h === n.shape[3], function () {
    return "Error in conv2dDerInput: depth of output (" + h + ") must match output depth for filter " + n.shape[3] + ".";
  }), null != i && C(A(o), function () {
    return "Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + o + ".";
  });
  var f = Ea(a),
      d = pa(s, n.shape, r, 1, o, i, !1, f),
      p = Lt.runKernelFunc(function (t, e) {
    var r = t.conv2dDerInput(u, n, d);
    return e([n, u]), r;
  }, {
    dy4D: u,
    filter: n
  }, function (t, e) {
    var n = e[0],
        s = e[1];
    return {
      dy4D: function () {
        return dl(t, n, r, o, a, 1, i);
      },
      filter: function () {
        return vl(t, s, n.shape, r, o, a, i);
      }
    };
  });
  return c ? p.as3D(p.shape[1], p.shape[2], p.shape[3]) : p;
}

function ll(t) {
  var e = function (t) {
    return "number" == typeof t ? [t, t, t] : 2 === t.length ? [t[0], t[1], 1] : t;
  }(t),
      n = e[0],
      r = e[1],
      o = e[2];

  return 1 === n && 1 === r && 1 === o;
}

function hl(t, e, n, r, o) {
  C(t.length === e.rank, function () {
    return "Length of inShape (" + t.length + ") and rank of dy (" + e.rank + ") must match";
  });
  var a = t,
      i = e,
      s = !1;
  4 === e.rank && (s = !0, i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3]), a = [1, t[0], t[1], t[2], t[3]]);
  var u = a[4],
      c = i.shape[4];
  C(5 === a.length, function () {
    return "Error in conv3dDerInput: inShape must be length 5, but got length " + a.length + ".";
  }), C(5 === i.rank, function () {
    return "Error in conv3dDerInput: dy must be rank 5, but got rank " + i.rank;
  }), C(5 === n.rank, function () {
    return "Error in conv3dDerInput: filter must be rank 5, but got rank " + n.rank;
  }), C(u === n.shape[3], function () {
    return "Error in conv3dDerInput: depth of input (" + u + ") must match input depth for filter " + n.shape[3] + ".";
  }), C(c === n.shape[4], function () {
    return "Error in conv3dDerInput: depth of output (" + c + ") must match output depth for filter " + n.shape[4] + ".";
  });
  var l = va(a, n.shape, r, 1, o),
      h = Lt.runKernelFunc(function (t) {
    return t.conv3dDerInput(i, n, l);
  }, {
    dy5D: i
  });
  return s ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
}

var fl = An({
  conv1d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NWC"), void 0 === a && (a = 1);
    var s = gn(t, "x", "conv1d"),
        u = gn(e, "filter", "conv1d"),
        c = s,
        l = !1;
    2 === s.rank && (l = !0, c = s.as3D(1, s.shape[0], s.shape[1])), C(3 === c.rank, function () {
      return "Error in conv1d: input must be rank 3, but got rank " + c.rank + ".";
    }), C(3 === u.rank, function () {
      return "Error in conv1d: filter must be rank 3, but got rank " + u.rank + ".";
    }), null != i && C(A(r), function () {
      return "Error in conv1d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    }), C(c.shape[2] === u.shape[1], function () {
      return "Error in conv1d: depth of input (" + c.shape[2] + ") must match input depth for filter " + u.shape[1] + ".";
    }), C(Ca(n, a), function () {
      return "Error in conv1D: Either stride or dilation must be 1. Got stride " + n + " and dilation '" + a + "'";
    }), C("NWC" === o, function () {
      return "Error in conv1d: got dataFormat of " + o + " but only NWC is currently supported.";
    });
    var h = u.as4D(1, u.shape[0], u.shape[1], u.shape[2]),
        f = c.as4D(c.shape[0], 1, c.shape[1], c.shape[2]),
        d = dl(f, h, [1, n], r, "NHWC", [1, a], i);
    return l ? d.as2D(d.shape[2], d.shape[3]) : d.as3D(d.shape[0], d.shape[2], d.shape[3]);
  }
}),
    dl = An({
  conv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = gn(t, "x", "conv2d"),
        u = gn(e, "filter", "conv2d"),
        c = s,
        l = !1;
    3 === s.rank && (l = !0, c = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), C(4 === c.rank, function () {
      return "Error in conv2d: input must be rank 4, but got rank " + c.rank + ".";
    }), C(4 === u.rank, function () {
      return "Error in conv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), null != i && C(A(r), function () {
      return "Error in conv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    });
    var h = "NHWC" === o ? c.shape[3] : c.shape[1];
    C(h === u.shape[2], function () {
      return "Error in conv2d: depth of input (" + h + ") must match input depth for filter " + u.shape[2] + ".";
    }), C(Ca(n, a), function () {
      return "Error in conv2D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    });
    var f = Ea(o),
        d = pa(c.shape, u.shape, n, a, r, i, !1, f),
        p = [u, c],
        v = Lt.runKernelFunc(function (t, e) {
      var n = t.conv2d(c, u, d);
      return e([u, c]), n;
    }, {
      x: c,
      filter: u
    }, function (t, e) {
      var i = e,
          s = i[0],
          u = i[1];
      return C(wa(a), function () {
        return "Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      }), {
        x: function () {
          return gl(u.shape, t, s, n, r, o);
        },
        filter: function () {
          return vl(u, t, s.shape, n, r, o);
        }
      };
    }, "Conv2D", d, p);
    return l ? v.as3D(v.shape[1], v.shape[2], v.shape[3]) : v;
  }
}),
    pl = An({
  conv3d_: function (t, e, n, r, o, a) {
    void 0 === o && (o = "NDHWC"), void 0 === a && (a = [1, 1, 1]);
    var i = gn(t, "x", "conv3d"),
        s = gn(e, "filter", "conv3d"),
        u = i,
        c = !1;
    4 === i.rank && (c = !0, u = i.as5D(1, i.shape[0], i.shape[1], i.shape[2], i.shape[3])), C(5 === u.rank, function () {
      return "Error in conv3d: input must be rank 5, but got rank " + u.rank + ".";
    }), C(5 === s.rank, function () {
      return "Error in conv3d: filter must be rank 5, but got rank " + s.rank + ".";
    }), C(u.shape[4] === s.shape[3], function () {
      return "Error in conv3d: depth of input (" + u.shape[4] + ") must match input depth for filter " + s.shape[3] + ".";
    }), C(function (t, e) {
      return ll(t) || ll(e);
    }(n, a), function () {
      return "Error in conv3D: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), C("NDHWC" === o, function () {
      return "Error in conv3d: got dataFormat of " + o + " but only NDHWC is currently supported.";
    });
    var l = va(u.shape, s.shape, n, a, r),
        h = Lt.runKernelFunc(function (t, e) {
      var n = t.conv3d(u, s, l);
      return e([u, s]), n;
    }, {
      x: u,
      $filter: s
    }, function (t, e) {
      C(ll(a), function () {
        return "Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + a + "'";
      });
      var o = e[0],
          i = e[1];
      return {
        x: function () {
          return hl(o.shape, t, i, n, r);
        },
        $filter: function () {
          return function (t, e, n, r, o) {
            var a = t;
            4 === t.rank && (a = t.as5D(1, t.shape[0], t.shape[1], t.shape[2], t.shape[3]));
            var i = e;
            4 === i.rank && (i = e.as5D(1, e.shape[0], e.shape[1], e.shape[2], e.shape[3]));
            C(5 === a.rank, function () {
              return "Error in conv3dDerFilter: input must be rank 5, but got shape " + a.shape + ".";
            }), C(5 === i.rank, function () {
              return "Error in conv3dDerFilter: dy must be rank 5, but got shape " + i.shape + ".";
            }), C(5 === n.length, function () {
              return "Error in conv3dDerFilter: filterShape must be length 5, but got " + n + ".";
            }), C(a.shape[4] === n[3], function () {
              return "Error in conv3dDerFilter: depth of input " + a.shape[4] + ") must match input depth in filter (" + n[3] + ".";
            }), C(i.shape[4] === n[4], function () {
              return "Error in conv3dDerFilter: depth of dy (" + i.shape[4] + ") must match output depth for filter (" + n[4] + ").";
            });
            var s = va(a.shape, n, r, 1, o);
            return Lt.runKernelFunc(function (t) {
              return t.conv3dDerFilter(a, i, s);
            }, {
              x5D: a,
              dy5D: i
            });
          }(o, t, i.shape, n, r);
        }
      };
    });
    return c ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
  }
}),
    vl = An({
  conv2dDerFilter_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NHWC");
    var s = t;
    3 === t.rank && (s = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
    var u = e;
    3 === u.rank && (u = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), C(4 === s.rank, function () {
      return "Error in conv2dDerFilter: input must be rank 4, but got shape " + s.shape + ".";
    }), C(4 === u.rank, function () {
      return "Error in conv2dDerFilter: dy must be rank 4, but got shape " + u.shape + ".";
    }), C(4 === n.length, function () {
      return "Error in conv2dDerFilter: filterShape must be length 4, but got " + n + ".";
    });
    var c = "NHWC" === a ? s.shape[3] : s.shape[1],
        l = "NHWC" === a ? u.shape[3] : u.shape[1];
    C(c === n[2], function () {
      return "Error in conv2dDerFilter: depth of input " + c + ") must match input depth in filter (" + n[2] + ".";
    }), C(l === n[3], function () {
      return "Error in conv2dDerFilter: depth of dy (" + l + ") must match output depth for filter (" + n[3] + ").";
    }), null != i && C(A(o), function () {
      return "Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + o + ".";
    });
    var h = Ea(a),
        f = pa(s.shape, n, r, 1, o, i, !1, h);
    return Lt.runKernelFunc(function (t) {
      return t.conv2dDerFilter(s, u, f);
    }, {
      x4D: s,
      dy4D: u
    });
  }
}),
    gl = An({
  conv2dDerInput_: cl
}),
    ml = An({
  depthwiseConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === o && (o = "NHWC"), void 0 === a && (a = [1, 1]);
    var s = gn(t, "x", "depthwiseConv2d"),
        u = gn(e, "filter", "depthwiseConv2d"),
        c = s,
        l = !1;
    3 === s.rank && (l = !0, c = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), C(4 === c.rank, function () {
      return "Error in depthwiseConv2d: input must be rank 4, but got rank " + c.rank + ".";
    }), C(4 === u.rank, function () {
      return "Error in depthwiseConv2d: filter must be rank 4, but got rank " + u.rank + ".";
    }), C(c.shape[3] === u.shape[2], function () {
      return "Error in depthwiseConv2d: number of input channels (" + c.shape[3] + ") must match the inChannels dimension in filter " + u.shape[2] + ".";
    }), null == a && (a = [1, 1]), C(Ca(n, a), function () {
      return "Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + a + "'";
    }), null != i && C(A(r), function () {
      return "Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + r + ".";
    });
    var h = pa(c.shape, u.shape, n, a, r, i, !0),
        f = [c, u],
        d = Lt.runKernelFunc(function (t, e) {
      var n = t.depthwiseConv2D(c, u, h);
      return e([c, u]), n;
    }, {
      x: c,
      filter: u
    }, function (t, e) {
      C(wa(a), function () {
        return "Error in gradient of depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '" + a + "'";
      });
      var n = e[0],
          r = e[1];
      return {
        x: function () {
          return yl(n.shape, t, r, h);
        },
        filter: function () {
          return xl(n, t, r.shape, h);
        }
      };
    }, "DepthwiseConv2dNative", h, f);
    return l ? d.as3D(d.shape[1], d.shape[2], d.shape[3]) : d;
  }
}),
    yl = An({
  depthwiseConv2dDerInput_: function (t, e, n, r) {
    var o = e,
        a = !1;
    3 === e.rank && (a = !0, o = e.as4D(1, e.shape[0], e.shape[1], e.shape[2]));
    var i = Lt.runKernelFunc(function (t) {
      return t.depthwiseConv2DDerInput(o, n, r);
    }, {
      dy4D: o
    });
    return a ? i.as3D(i.shape[1], i.shape[2], i.shape[3]) : i;
  }
}),
    xl = An({
  depthwiseConv2dDerFilter_: function (t, e, n, r) {
    var o = t;
    3 === t.rank && (o = t.as4D(1, t.shape[0], t.shape[1], t.shape[2]));
    var a = e;
    return 3 === a.rank && (a = e.as4D(1, e.shape[0], e.shape[1], e.shape[2])), Lt.runKernelFunc(function (t) {
      return t.depthwiseConv2DDerFilter(o, a, r);
    }, {
      x4D: o,
      dy4D: a
    });
  }
}),
    bl = An({
  separableConv2d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = [1, 1]), void 0 === i && (i = "NHWC");
    var s = gn(t, "x", "separableConv2d"),
        u = gn(e, "depthwiseFilter", "separableConv2d"),
        c = gn(n, "pointwiseFilter", "separableConv2d"),
        l = s,
        h = !1;
    if (3 === s.rank && (h = !0, l = s.as4D(1, s.shape[0], s.shape[1], s.shape[2])), "NCHW" === i) throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");
    C(4 === l.rank, function () {
      return "Error in separableConv2d: input must be rank 4, but got rank " + l.rank + ".";
    }), C(4 === u.rank, function () {
      return "Error in separableConv2d: depthwise filter must be rank 4, but got rank " + u.rank + ".";
    }), C(4 === c.rank, function () {
      return "Error in separableConv2d: pointwise filter must be rank 4, but got rank " + u.rank + ".";
    }), C(1 === c.shape[0], function () {
      return "Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got " + c.shape[0] + ".";
    }), C(1 === c.shape[1], function () {
      return "Error in separableConv2d: the second dimension of pointwise filter must be 1, but got " + c.shape[1] + ".";
    });
    var f = u.shape[2],
        d = u.shape[3];
    C(c.shape[2] === f * d, function () {
      return "Error in separableConv2d: the third dimension of pointwise filter must be " + f * d + ", but got " + c.shape[2] + ".";
    });
    var p = ml(l, u, r, o, i, a),
        v = dl(p, c, 1, "valid", i);
    return h ? v.as3D(v.shape[1], v.shape[2], v.shape[3]) : v;
  }
}),
    wl = An({
  conv2dTranspose_: function (t, e, n, r, o, a) {
    return cl(n, gn(t, "x", "conv2dTranspose"), gn(e, "filter", "conv2dTranspose"), r, o, "NHWC", a);
  }
}),
    Cl = An({
  conv3dTranspose_: function (t, e, n, r, o) {
    return hl(n, gn(t, "x", "conv3dTranspose"), gn(e, "filter", "conv3dTranspose"), r, o);
  }
});
exports.conv3dTranspose = Cl;
exports.conv2dTranspose = wl;
exports.separableConv2d = bl;
exports.depthwiseConv2d = ml;
exports.conv3d = pl;
exports.conv2d = dl;
exports.conv1d = fl;
var El = An({
  matMul_: function (t, e, n, r) {
    var o;
    void 0 === n && (n = !1), void 0 === r && (r = !1);
    var a = gn(t, "a", "matMul"),
        i = gn(e, "b", "matMul");
    o = Nt(a, i), a = o[0], i = o[1];
    var s = n ? a.shape[a.rank - 2] : a.shape[a.rank - 1],
        u = r ? i.shape[i.rank - 1] : i.shape[i.rank - 2],
        c = n ? a.shape[a.rank - 1] : a.shape[a.rank - 2],
        l = r ? i.shape[i.rank - 2] : i.shape[i.rank - 1],
        h = a.shape.slice(0, -2),
        f = i.shape.slice(0, -2),
        d = k(h),
        p = k(f);
    C(a.rank >= 2 && i.rank >= 2 && a.rank === i.rank, function () {
      return "Error in matMul: inputs must have the same rank of at least 2, got ranks " + a.rank + " and " + i.rank + ".";
    }), C(S(h, f), function () {
      return "Error in matMul: outer dimensions (" + h + ") and (" + f + ") of Tensors with shapes " + a.shape + " and " + i.shape + " must match.";
    }), C(s === u, function () {
      return "Error in matMul: inner shapes (" + s + ") and (" + u + ") of Tensors with shapes " + a.shape + " and " + i.shape + " and transposeA=" + n + " and transposeB=" + r + " must match.";
    });
    var v = a.shape.slice(0, -2).concat([c, l]),
        g = n ? a.as3D(d, s, c) : a.as3D(d, c, s),
        m = r ? i.as3D(p, l, u) : i.as3D(p, u, l),
        y = {
      transposeA: n,
      transposeB: r
    };
    return Lt.runKernelFunc(function (t, e) {
      var o = t.batchMatMul(g, m, n, r);
      return e([g, m]), o;
    }, {
      a: g,
      b: m
    }, function (t, e) {
      var o = e,
          a = o[0],
          i = o[1];
      return n || r ? !n && r ? {
        a: function () {
          return t.matMul(i, !1, !1);
        },
        b: function () {
          return t.matMul(a, !0, !1);
        }
      } : n && !r ? {
        a: function () {
          return i.matMul(t, !1, !0);
        },
        b: function () {
          return a.matMul(t, !1, !1);
        }
      } : {
        a: function () {
          return i.matMul(t, !0, !0);
        },
        b: function () {
          return t.matMul(a, !0, !0);
        }
      } : {
        a: function () {
          return t.matMul(i, !1, !0);
        },
        b: function () {
          return a.matMul(t, !0, !1);
        }
      };
    }, "BatchMatMul", y).reshape(v);
  }
}),
    Rl = An({
  dot_: function (t, e) {
    var n = gn(t, "t1", "dot"),
        r = gn(e, "t2", "dot");
    C(!(1 !== n.rank && 2 !== n.rank || 1 !== r.rank && 2 !== r.rank), function () {
      return "Error in dot: inputs must all be rank 1 or 2, but got ranks " + n.rank + " and " + r.rank + ".";
    });
    var o = 1 === n.rank ? n.size : n.shape[1],
        a = 1 === r.rank ? r.size : r.shape[0];
    return C(o === a, function () {
      return "Error in dot: inner dimensions of inputs must match, but got " + o + " and " + a + ".";
    }), 1 === n.rank && 1 === r.rank ? n.as2D(1, -1).matMul(r.as2D(-1, 1)).asScalar() : 1 === n.rank && 2 === r.rank ? n.as2D(1, -1).matMul(r.as2D(r.shape[0], r.shape[1])).as1D() : 2 === n.rank && 1 === r.rank ? n.matMul(r.as2D(-1, 1)).as1D() : n.matMul(r.as2D(r.shape[0], r.shape[1]));
  }
}),
    Il = An({
  outerProduct_: function (t, e) {
    var n = gn(t, "v1", "outerProduct"),
        r = gn(e, "v2", "outerProduct");
    return C(1 === n.rank && 1 === r.rank, function () {
      return "Error in outerProduct: inputs must be rank 1, but got ranks " + n.rank + " and " + r.rank + ".";
    }), n.as2D(-1, 1).matMul(r.as2D(1, -1));
  }
});
exports.outerProduct = Il;
exports.dot = Rl;
exports.matMul = El;
var kl = An({
  reverse_: function (t, e) {
    var n = gn(t, "x", "reverse");
    if (0 === n.rank) return n.clone();
    var r = O(e, n.shape);
    return Lt.runKernelFunc(function (t) {
      return t.reverse(n, r);
    }, {
      $x: n
    }, function (t) {
      return {
        $x: function () {
          return t.reverse(r);
        }
      };
    }).reshapeAs(n);
  }
}),
    Sl = An({
  reverse1d_: function (t) {
    var e = gn(t, "x", "reverse");
    return C(1 === e.rank, function () {
      return "Error in reverse1D: x must be rank 1 but got rank " + e.rank + ".";
    }), kl(e, 0);
  }
}),
    Al = An({
  reverse2d_: function (t, e) {
    var n = gn(t, "x", "reverse");
    return C(2 === n.rank, function () {
      return "Error in reverse2D: x must be rank 2 but got rank " + n.rank + ".";
    }), kl(n, e);
  }
}),
    Tl = An({
  reverse3d_: function (t, e) {
    var n = gn(t, "x", "reverse");
    return C(3 === n.rank, function () {
      return "Error in reverse3D: x must be rank 3 but got rank " + n.rank + ".";
    }), kl(n, e);
  }
}),
    Dl = An({
  reverse4d_: function (t, e) {
    var n = gn(t, "x", "reverse");
    return C(4 === n.rank, function () {
      return "Error in reverse4D: x must be rank 4 but got rank " + n.rank + ".";
    }), kl(n, e);
  }
});
exports.reverse4d = Dl;
exports.reverse3d = Tl;
exports.reverse2d = Al;
exports.reverse1d = Sl;
exports.reverse = kl;

function Nl(t, e, n, r, o, a) {
  var i = gn(t, "x", "maxPool"),
      s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), null == r && (r = [1, 1]), C(4 === s.rank, function () {
    return "Error in maxPool: input must be rank 4 but got rank " + s.rank + ".";
  }), C(Ca(n, r), function () {
    return "Error in maxPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  }), null != a && C(A(o), function () {
    return "Error in maxPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var c = fa(s.shape, e, n, r, o, a);
  if (1 === c.filterWidth && 1 === c.filterHeight && S(c.inShape, c.outShape)) return i.clone();
  var l = [s],
      h = Lt.runKernelFunc(function (t, e) {
    var n = t.maxPool(s, c);
    return e([s, n]), n;
  }, {
    x: s
  }, function (t, a) {
    var i = a[0],
        s = a[1];
    return {
      x: function () {
        return function (t, e, n, r, o, a, i, s) {
          var u = gn(t, "dy", "maxPoolBackprop"),
              c = gn(e, "input", "maxPoolBackprop"),
              l = gn(n, "output", "maxPoolBackprop");
          C(c.rank === u.rank, function () {
            return "Rank of input (" + c.rank + ") does not match rank of dy (" + u.rank + ")";
          }), null == a && (a = [1, 1]);
          C(Ca(o, a), function () {
            return "Error in maxPoolBackProp: Either strides or dilations must be 1. Got strides " + o + " and dilations '" + a + "'";
          }), C(4 === u.rank, function () {
            return "Error in maxPoolBackprop: dy must be rank 4 but got rank " + u.rank + ".";
          }), C(4 === c.rank, function () {
            return "Error in maxPoolBackprop: input must be rank 4 but got rank " + c.rank + ".";
          }), null != s && C(A(i), function () {
            return "Error in maxPoolBackprop: pad must be an integer when using, dimRoundingMode " + s + " but got pad " + i + ".";
          });
          var h = fa(c.shape, r, o, a, i, s);
          return Lt.runKernelFunc(function (t) {
            return t.maxPoolBackprop(u, c, l, h);
          }, {
            $dy: u,
            $input: c
          });
        }(t, i, s, e, n, r, o);
      }
    };
  }, "MaxPool", c, l);
  return u ? h.as3D(h.shape[1], h.shape[2], h.shape[3]) : h;
}

function Fl(t, e, n, r, o, a) {
  var i = gn(t, "x", "avgPool", "float32");
  null == r && (r = [1, 1]), C(Ca(n, r), function () {
    return "Error in avgPool: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + r + "'";
  });
  var s = i,
      u = !1;
  3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), C(4 === s.rank, function () {
    return "Error in avgPool: x must be rank 4 but got rank " + s.rank + ".";
  }), null != a && C(A(o), function () {
    return "Error in avgPool: pad must be an integer when using, dimRoundingMode " + a + " but got pad " + o + ".";
  });
  var c = fa(s.shape, e, n, r, o, a);
  if (1 === c.filterWidth && 1 === c.filterHeight && S(c.inShape, c.outShape)) return i.clone();
  var l = Lt.runKernelFunc(function (t) {
    return t.avgPool(s, c);
  }, {
    x: s
  }, function (t) {
    return {
      x: function () {
        return function (t, e, n, r, o, a) {
          var i = gn(t, "dy", "avgPoolBackprop"),
              s = gn(e, "input", "avgPoolBackprop");
          C(s.rank === i.rank, function () {
            return "Rank of input (" + s.rank + ") does not match rank of dy (" + i.rank + ")";
          }), null == o && (o = [1, 1]);
          C(Ca(r, o), function () {
            return "Error in avgPoolBackprop: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + o + "'";
          });
          var u = s,
              c = i,
              l = !1;
          3 === s.rank && (l = !0, u = s.as4D(1, s.shape[0], s.shape[1], s.shape[2]), c = i.as4D(1, i.shape[0], i.shape[1], i.shape[2]));
          C(4 === c.rank, function () {
            return "Error in avgPoolBackprop: dy must be rank 4 but got rank " + c.rank + ".";
          }), C(4 === u.rank, function () {
            return "Error in avgPoolBackprop: input must be rank 4 but got rank " + u.rank + ".";
          });
          var h = fa(u.shape, n, r, o, a),
              f = Lt.runKernelFunc(function (t) {
            return t.avgPoolBackprop(c, u, h);
          }, {
            dy4D: c,
            input4D: u
          });
          if (l) return f.as3D(f.shape[1], f.shape[2], f.shape[3]);
          return f;
        }(t, s, e, n, r, o);
      }
    };
  }, "AvgPool", c);
  return l = l.cast(i.dtype), u ? l.as3D(l.shape[1], l.shape[2], l.shape[3]) : l;
}

var _l = An({
  maxPool_: function (t, e, n, r, o) {
    return Nl(t, e, n, 1, r, o);
  }
}),
    Ol = An({
  avgPool_: function (t, e, n, r, o) {
    return Fl(t, e, n, 1, r, o);
  }
}),
    Ml = An({
  pool_: function (t, e, n, r, o, a) {
    null == o && (o = [1, 1]), null == a && (a = 1), 0 === r && (r = "valid");
    var i = gn(t, "x", "maxPool"),
        s = i,
        u = !1;
    3 === i.rank && (u = !0, s = i.as4D(1, i.shape[0], i.shape[1], i.shape[2])), C(Ca(a, o), function () {
      return "Error in pool: Either strides or dilations must be 1. Got strides " + a + " and dilations '" + o + "'";
    });
    var c,
        l = fa(s.shape, e, a, o, r),
        h = [l.dilationHeight, l.dilationWidth];
    c = "same" === r ? function (t, e) {
      var n = t.map(function (t, n) {
        return t + (t - 1) * (e[n] - 1);
      }).map(function (t) {
        return t - 1;
      }),
          r = n.map(function (t) {
        return Math.floor(t / 2);
      }),
          o = n.map(function (t, e) {
        return t - r[e];
      });
      return n.map(function (t, e) {
        return [r[e], o[e]];
      });
    }([l.filterHeight, l.filterWidth], h) : [[0, 0], [0, 0]];

    var f = 1 === h[0] && 1 === h[1],
        d = function (t, e, n) {
      var r = n.map(function (t) {
        return t[0];
      }),
          o = n.map(function (t) {
        return t[1];
      }),
          a = t.concat(r, o),
          i = e.map(function (t, e) {
        return (t - a[e] % t) % t;
      }),
          s = o.map(function (t, e) {
        return t + i[e];
      }),
          u = e.map(function (t, e) {
        return [r[e], s[e]];
      }),
          c = e.map(function (t, e) {
        return [0, i[e]];
      });
      return [u, c];
    }([l.inHeight, l.inWidth], h, c),
        p = d[0],
        v = d[1],
        g = f ? r : "valid",
        m = f ? s : cr(s, h, p),
        y = ("avg" === n ? function () {
      return Fl(m, e, a, 1, g);
    } : function () {
      return Nl(m, e, a, 1, g);
    })(),
        x = f ? y : rr(y, h, v);

    return u ? x.as3D(x.shape[1], x.shape[2], x.shape[3]) : x;
  }
}),
    Bl = An({
  maxPool3d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NDHWC");
    var s = gn(t, "x", "maxPool3d"),
        u = s,
        c = !1;
    4 === s.rank && (c = !0, u = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3])), null == i && (i = [1, 1, 1]), C(5 === u.rank, function () {
      return "Error in maxPool3d: x must be rank 5 but got rank " + u.rank + ".";
    }), C("NDHWC" === a, function () {
      return "Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of " + a;
    }), C(Ca(n, i), function () {
      return "Error in maxPool3d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + i + "'";
    }), null != o && C(A(r), function () {
      return "Error in maxPool3d: pad must be an integer when using, dimRoundingMode " + o + " but got pad " + r + ".";
    });
    var l = da(u.shape, e, n, i, r, o, a),
        h = Lt.runKernelFunc(function (t, e) {
      var n = t.maxPool3d(u, l);
      return e([u, n]), n;
    }, {
      x: u
    }, function (t, a) {
      var s = a[0],
          u = a[1];
      return {
        x: function () {
          return function (t, e, n, r, o, a, i, s) {
            var u = gn(t, "dy", "maxPool3dBackprop"),
                c = gn(e, "input", "maxPool3dBackprop"),
                l = gn(n, "output", "maxPool3dBackprop"),
                h = u,
                f = c,
                d = l,
                p = !1;
            4 === c.rank && (p = !0, h = u.as5D(1, u.shape[0], u.shape[1], u.shape[2], u.shape[3]), f = c.as5D(1, c.shape[0], c.shape[1], c.shape[2], c.shape[3]), d = l.as5D(1, l.shape[0], l.shape[1], l.shape[2], l.shape[3]));
            C(5 === h.rank, function () {
              return "Error in maxPool3dBackprop: dy must be rank 5 but got rank " + h.rank + ".";
            }), C(5 === f.rank, function () {
              return "Error in maxPool3dBackprop: input must be rank 5 but got rank " + f.rank + ".";
            }), C(5 === d.rank, function () {
              return "Error in maxPool3dBackprop: output must be rank 5 but got rank " + d.rank + ".";
            }), null == a && (a = [1, 1, 1]);
            C(Ca(o, a), function () {
              return "Error in maxPool3dBackprop: Either strides or dilations must be 1. Got strides " + o + " and dilations '" + a + "'";
            }), null != s && C(A(i), function () {
              return "Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode " + s + " but got pad " + i + ".";
            });
            var v = da(f.shape, r, o, a, i, s),
                g = Lt.runKernelFunc(function (t) {
              return t.maxPool3dBackprop(h, f, d, v);
            }, {
              dy5D: h,
              input5D: f
            });
            if (p) return g.as4D(g.shape[1], g.shape[2], g.shape[3], g.shape[4]);
            return g;
          }(t, s, u, e, n, i, r, o);
        }
      };
    });
    return c ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
  }
}),
    Pl = An({
  avgPool3d_: function (t, e, n, r, o, a, i) {
    void 0 === a && (a = "NDHWC");
    var s = gn(t, "x", "avgPool3d", "float32"),
        u = s,
        c = !1;
    4 === s.rank && (c = !0, u = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3])), null == i && (i = [1, 1, 1]), C(5 === u.rank, function () {
      return "Error in avgPool3d: x must be rank 5 but got rank " + u.rank + ".";
    }), C("NDHWC" === a, function () {
      return "Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of " + a;
    }), C(Ca(n, i), function () {
      return "Error in avgPool3d: Either strides or dilations must be 1. Got strides " + n + " and dilations '" + i + "'";
    }), null != o && C(A(r), function () {
      return "Error in avgPool3d: pad must be an integer when using, dimRoundingMode " + o + " but got pad " + r + ".";
    });
    var l = da(u.shape, e, n, i, r, o, a),
        h = Lt.runKernelFunc(function (t) {
      return t.avgPool3d(u, l);
    }, {
      x: u
    }, function (t) {
      return {
        x: function () {
          return function (t, e, n, r, o, a, i) {
            var s = gn(t, "dy", "avgPool3dBackprop"),
                u = gn(e, "input", "avgPool3dBackprop"),
                c = s,
                l = u,
                h = !1;
            4 === u.rank && (h = !0, c = s.as5D(1, s.shape[0], s.shape[1], s.shape[2], s.shape[3]), l = u.as5D(1, u.shape[0], u.shape[1], u.shape[2], u.shape[3]));
            C(5 === c.rank, function () {
              return "Error in avgPool3dBackprop: dy must be rank 5 but got rank " + c.rank + ".";
            }), C(5 === l.rank, function () {
              return "Error in avgPool3dBackprop: input must be rank 5 but got rank " + l.rank + ".";
            }), null == o && (o = [1, 1, 1]);
            C(Ca(r, o), function () {
              return "Error in avgPool3dBackprop: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + o + "'";
            }), null != i && C(A(a), function () {
              return "Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode " + i + " but got pad " + a + ".";
            });
            var f = da(l.shape, n, r, o, a, i),
                d = Lt.runKernelFunc(function (t) {
              return t.avgPool3dBackprop(c, l, f);
            }, {
              dy5D: c,
              input5D: l
            });
            if (h) return d.as4D(d.shape[1], d.shape[2], d.shape[3], d.shape[4]);
            return d;
          }(t, u, e, n, i, r, o);
        }
      };
    });
    return h = h.cast(u.dtype), c ? h.as4D(h.shape[1], h.shape[2], h.shape[3], h.shape[4]) : h;
  }
}),
    Ll = An({
  maxPoolWithArgmax_: function (t, e, n, r, o) {
    void 0 === o && (o = !1);
    var a = gn(t, "x", "maxPoolWithArgmax"),
        i = {
      filterSize: e,
      strides: n,
      pad: r,
      includeBatchInIndex: o
    },
        s = Lt.runKernel("MaxPoolWithArgmax", {
      x: a
    }, i);
    return {
      result: s[0],
      indexes: s[1]
    };
  }
});

exports.maxPoolWithArgmax = Ll;
exports.avgPool3d = Pl;
exports.maxPool3d = Bl;
exports.pool = Ml;
exports.avgPool = Ol;
exports.maxPool = _l;
var Wl = An({
  slice_: function (t, e, n) {
    var r,
        o,
        a = gn(t, "x", "slice");
    if (0 === a.rank) throw new Error("Slicing scalar is not possible");
    (r = "number" == typeof e ? [e].concat(new Array(a.rank - 1).fill(0)) : e.length < a.rank ? e.concat(new Array(a.rank - e.length).fill(0)) : e.slice()).forEach(function (t) {
      C(-1 !== t, function () {
        return "slice() does not support negative begin indexing.";
      });
    }), o = (o = null == n ? new Array(a.rank).fill(-1) : "number" == typeof n ? [n].concat(new Array(a.rank - 1).fill(-1)) : n.length < a.rank ? n.concat(new Array(a.rank - n.length).fill(-1)) : n).map(function (t, e) {
      return t >= 0 ? t : (C(-1 === t, function () {
        return "Negative size values should be exactly -1 but got " + t + " for the slice() size at index " + e + ".";
      }), a.shape[e] - r[e]);
    }), qo(a, r, o);
    var i = a.shape,
        s = {
      begin: r,
      size: o
    };
    return Lt.runKernelFunc(function (t) {
      return t.slice(a, r, o);
    }, {
      x: a
    }, function (t) {
      for (var e = [], n = 0; n < t.rank; n++) e.push([r[n], i[n] - r[n] - o[n]]);

      return {
        x: function () {
          return Ic(t, e);
        }
      };
    }, "Slice", s);
  }
}),
    Ul = An({
  slice1d_: function (t, e, n) {
    var r = gn(t, "x", "slice1d");
    return C(1 === r.rank, function () {
      return "slice1d expects a rank-1 tensor, but got a rank-" + r.rank + " tensor";
    }), Wl(r, [e], [n]);
  }
}),
    Vl = An({
  slice2d_: function (t, e, n) {
    var r = gn(t, "x", "slice2d");
    return C(2 === r.rank, function () {
      return "slice2d expects a rank-2 tensor, but got a rank-" + r.rank + " tensor";
    }), Wl(r, e, n);
  }
}),
    zl = An({
  slice3d_: function (t, e, n) {
    var r = gn(t, "x", "slice3d");
    return C(3 === r.rank, function () {
      return "slice3d expects a rank-3 tensor, but got a rank-" + r.rank + " tensor";
    }), Wl(r, e, n);
  }
}),
    Gl = An({
  slice4d_: function (t, e, n) {
    var r = gn(t, "x", "slice4d");
    return C(4 === r.rank, function () {
      return "slice4d expects a rank-4 tensor, but got a rank-" + r.rank + " tensor";
    }), Wl(r, e, n);
  }
});
exports.slice4d = Gl;
exports.slice3d = zl;
exports.slice2d = Vl;
exports.slice1d = Ul;
exports.slice = Wl;

function Hl(t, e, n, r, o) {
  return e.rank < n.rank && (e = e.reshape(wn(e.shape, r))), t.rank < n.rank && (t = t.reshape(wn(t.shape, r))), {
    x: function () {
      var r = t.mul(n.equal(e).cast(t.dtype));
      return null == o ? r : r.transpose(o);
    }
  };
}

var ql = An({
  all_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "all", "bool"),
        o = O(e, r.shape),
        a = o,
        i = En(a, r.rank);
    null != i && (r = r.transpose(i), a = In(a.length, r.rank));
    var s = Lt.runKernelFunc(function (t) {
      return t.all(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = wn(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    Kl = An({
  any_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "any", "bool"),
        o = O(e, r.shape),
        a = o,
        i = En(a, r.rank);
    null != i && (r = r.transpose(i), a = In(a.length, r.rank));
    var s = Lt.runKernelFunc(function (t) {
      return t.any(r, a);
    }, {
      $x: r
    });

    if (n) {
      var u = wn(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    jl = An({
  argMax_: function (t, e) {
    void 0 === e && (e = 0);
    var n = gn(t, "x", "argMax");
    null == e && (e = 0);
    var r = O(e, n.shape),
        o = En(r, n.rank);
    null != o && (n = n.transpose(o), r = In(r.length, n.rank));
    var a = {
      axis: r[0]
    },
        i = [n];
    return Lt.runKernelFunc(function (t, e) {
      var o = t.argMax(n, r[0]);
      return e([n]), o;
    }, {
      x: n
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return Xn(n);
        }
      };
    }, "ArgMax", a, i);
  }
}),
    Xl = An({
  argMin_: function (t, e) {
    void 0 === e && (e = 0);
    var n = gn(t, "x", "argMin");
    null == e && (e = 0);
    var r = O(e, n.shape),
        o = En(r, n.rank);
    return null != o && (n = n.transpose(o), r = In(r.length, n.rank)), Lt.runKernelFunc(function (t, e) {
      var o = t.argMin(n, r[0]);
      return e([n]), o;
    }, {
      $x: n
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Xn(n);
        }
      };
    });
  }
}),
    Yl = An({
  logSumExp_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "logSumExp"),
        o = O(e, r.shape),
        a = r.max(o, !0),
        i = r.sub(a).exp().sum(o).log(),
        s = a.reshape(i.shape).add(i);

    if (n) {
      var u = wn(s.shape, o);
      return s.reshape(u);
    }

    return s;
  }
}),
    $l = An({
  max_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "max"),
        o = r,
        a = O(e, r.shape),
        i = a,
        s = En(i, r.rank);
    null != s && (r = r.transpose(s), i = In(i.length, r.rank));
    var u = [r],
        c = Lt.runKernelFunc(function (t, e) {
      var n = t.max(r, i);
      return e([o, n]), n;
    }, {
      x: r
    }, function (t, e) {
      return Hl(t, e[1], e[0], a, s);
    }, "Max", {
      axes: i
    }, u, [!0]);

    if (n) {
      var l = wn(c.shape, a);
      c = c.reshape(l);
    }

    return c;
  }
}),
    Ql = An({
  mean_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "mean"),
        o = O(e, r.shape),
        a = k(bn(r.shape, o)[1]);
    return oa(function (t) {
      var r = On(a);
      return {
        value: (r.dtype === t.dtype ? t : t.cast(r.dtype)).div(r).sum(e, n),
        gradFunc: function (e) {
          var n = t.shape.slice();
          return o.forEach(function (t) {
            n[t] = 1;
          }), e.reshape(n).mul(zn(t.shape, "float32")).div(a);
        }
      };
    })(r);
  }
}),
    Jl = An({
  min_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "min"),
        o = r,
        a = O(e, r.shape),
        i = a,
        s = En(i, r.rank);
    null != s && (r = r.transpose(s), i = In(i.length, r.rank));
    var u = [r],
        c = Lt.runKernelFunc(function (t, e) {
      var n = t.min(r, i);
      return e([o, n]), n;
    }, {
      x: r
    }, function (t, e) {
      return Hl(t, e[1], e[0], a, s);
    }, "Min", {
      axes: i
    }, u, [!0]);

    if (n) {
      var l = wn(c.shape, a);
      c = c.reshape(l);
    }

    return c;
  }
}),
    Zl = An({
  moments_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = O(e, (t = gn(t, "x", "moments")).shape),
        o = t.mean(r, n),
        a = o.shape;
    n || (a = wn(o.shape, r));
    var i = t.toFloat().sub(o.reshape(a)).square();
    return {
      mean: o,
      variance: i.mean(r, n)
    };
  }
}),
    th = An({
  sum_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "sum");
    "bool" === r.dtype && (r = r.toInt());
    var o = O(e, r.shape);
    return oa(function (t) {
      var e = En(o, t.rank),
          r = o,
          a = t;
      null != e && (a = t.transpose(e), r = In(r.length, t.rank));

      var i = function (e) {
        var n = t.shape.slice();
        return o.forEach(function (t) {
          n[t] = 1;
        }), e.reshape(n).mul(zn(t.shape, "float32"));
      },
          s = {
        axes: r
      },
          u = Lt.runKernelFunc(function (t) {
        return t.sum(a, r);
      }, {
        x: a
      }, function (t) {
        return {
          x: function () {
            return i(t);
          }
        };
      }, "Sum", s);

      if (n) {
        var c = wn(u.shape, o);
        u = u.reshape(c);
      }

      return {
        value: u,
        gradFunc: i
      };
    })(r);
  }
}),
    eh = An({
  prod_: function (t, e, n) {
    void 0 === e && (e = null), void 0 === n && (n = !1);
    var r = gn(t, "x", "prod");
    "bool" === r.dtype && (r = r.toInt());
    var o = O(e, r.shape),
        a = En(o, r.rank),
        i = o,
        s = r;
    null != a && (s = r.transpose(a), i = In(i.length, r.rank));
    var u = Lt.runKernelFunc(function (t) {
      return t.prod(s, i);
    }, {
      permutedX: s
    });

    if (n) {
      var c = wn(u.shape, o);
      u = u.reshape(c);
    }

    return u;
  }
});
exports.prod = eh;
exports.sum = th;
exports.moments = Zl;
exports.min = Jl;
exports.mean = Ql;
exports.max = $l;
exports.logSumExp = Yl;
exports.argMin = Xl;
exports.argMax = jl;
exports.any = Kl;
exports.all = ql;
var nh = An({
  elu_: function (t) {
    var e = gn(t, "x", "elu");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.elu(e);
      return n([r]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          return Lt.runKernelFunc(function (e) {
            return e.eluDer(t, n);
          }, {
            dy: t,
            y: n
          });
        }
      };
    });
  }
}),
    rh = An({
  leakyRelu_: function (t, e) {
    void 0 === e && (e = .2);
    var n = gn(t, "x", "leakyRelu");
    return Eo(On(e).mul(n), n);
  }
}),
    oh = An({
  prelu_: function (t, e) {
    var n = gn(t, "x", "prelu"),
        r = gn(e, "alpha", "prelu");
    return Lt.runKernelFunc(function (t, e) {
      var o = t.prelu(n, r);
      return e([n, r]), o;
    }, {
      x: n,
      alpha: r
    }, function (t, e) {
      var n = e[0],
          r = e[1],
          o = n.greater(0);
      return {
        x: function () {
          return yc(o, t, t.mul(r));
        },
        alpha: function () {
          var e = yc(o, Xn(t), t.mul(n)),
              a = Br(r.shape, t.shape);
          return a.length > 0 && (e = e.sum(a)), e.reshape(r.shape);
        }
      };
    }, "Prelu");
  }
}),
    ah = An({
  relu_: function (t) {
    var e = gn(t, "x", "relu");
    return "bool" === e.dtype ? e.toInt() : Lt.runKernelFunc(function (t, n) {
      var r = t.relu(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0];
      return {
        x: function () {
          return t.mulStrict(n.step().toFloat());
        }
      };
    }, "Relu");
  }
}),
    ih = An({
  relu6_: function (t) {
    var e = gn(t, "x", "relu6");
    return "bool" === e.dtype ? e.toInt() : Lt.runKernelFunc(function (t, n) {
      var r = t.relu6(e);
      return n([e]), r;
    }, {
      x: e
    }, function (t, e) {
      var n = e[0],
          r = n.lessEqual(6).mul(n.step());
      return {
        x: function () {
          return t.mulStrict(r.toFloat());
        }
      };
    }, "Relu6");
  }
}),
    sh = An({
  selu_: function (t) {
    var e = gn(t, "x", "selu");
    return Lt.runKernelFunc(function (t, n) {
      var r = t.selu(e);
      return n([e]), r;
    }, {
      $x: e
    }, function (t, e) {
      var n = e[0];
      return {
        $x: function () {
          var e = n.greater(On(0)),
              r = On(su),
              o = On(uu),
              a = t.mul(o),
              i = t.mul(r).mul(n.toFloat().exp());
          return yc(e, a, i);
        }
      };
    });
  }
});
exports.selu = sh;
exports.relu6 = ih;
exports.relu = ah;
exports.prelu = oh;
exports.leakyRelu = rh;
exports.elu = nh;
var uh = An({
  localResponseNormalization_: function (t, e, n, r, o) {
    void 0 === e && (e = 5), void 0 === n && (n = 1), void 0 === r && (r = 1), void 0 === o && (o = .5);
    var a = gn(t, "x", "localResponseNormalization");
    C(4 === a.rank || 3 === a.rank, function () {
      return "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + a.rank + ".";
    }), C(A(e), function () {
      return "Error in localResponseNormalization: depthRadius must be an integer but got depthRadius " + e + ".";
    });
    var i = a,
        s = !1;
    3 === a.rank && (s = !0, i = a.as4D(1, a.shape[0], a.shape[1], a.shape[2]));
    var u = Lt.runKernelFunc(function (t, a) {
      var s = t.localResponseNormalization4D(i, e, n, r, o);
      return a([i, s]), s;
    }, {
      x4D: i
    }, function (t, a) {
      var i = a[0],
          s = a[1];
      return {
        x4D: function () {
          return Lt.runKernelFunc(function (a) {
            return a.LRNGrad(t, i, s, e, n, r, o);
          }, {});
        }
      };
    });
    return s ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
});
exports.localResponseNormalization = uh;
var ch = An({
  norm_: function (t, e, n, r) {
    void 0 === e && (e = "euclidean"), void 0 === n && (n = null), void 0 === r && (r = !1);

    var o = function t(e, n, r) {
      void 0 === r && (r = null);
      if (0 === e.rank) return e.abs();
      if (1 !== e.rank && null === r) return t(e.reshape([-1]), n, r);

      if (1 === e.rank || "number" == typeof r || Array.isArray(r) && 1 === r.length) {
        if (1 === n) return e.abs().sum(r);
        if (n === 1 / 0) return e.abs().max(r);
        if (n === -1 / 0) return e.abs().min(r);
        if ("euclidean" === n || 2 === n) return e.abs().pow(On(2, "int32")).sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      if (Array.isArray(r) && 2 === r.length) {
        if (1 === n) return e.abs().sum(r[0]).max(r[1] - 1);
        if (n === 1 / 0) return e.abs().sum(r[1]).max(r[0]);
        if (n === -1 / 0) return e.abs().sum(r[1]).min(r[0]);
        if ("fro" === n || "euclidean" === n) return e.square().sum(r).sqrt();
        throw new Error("Error in norm: invalid ord value: " + n);
      }

      throw new Error("Error in norm: invalid axis: " + r);
    }(t = gn(t, "x", "norm"), e, n),
        a = o.shape;

    if (r) {
      var i = O(n, t.shape);
      a = wn(o.shape, i);
    }

    return o.reshape(a);
  }
});
exports.norm = ch;
var lh = An({
  basicLSTMCell_: function (t, e, n, r, o, a) {
    var i = gn(t, "forgetBias", "basicLSTMCell"),
        s = gn(e, "lstmKernel", "basicLSTMCell"),
        u = gn(n, "lstmBias", "basicLSTMCell"),
        c = gn(r, "data", "basicLSTMCell"),
        l = gn(o, "c", "basicLSTMCell"),
        h = gn(a, "h", "basicLSTMCell"),
        f = c.concat(h, 1).matMul(s).add(u),
        d = f.shape[0],
        p = f.shape[1] / 4,
        v = [d, p],
        g = f.slice([0, 0], v),
        m = f.slice([0, p], v),
        y = f.slice([0, 2 * p], v),
        x = f.slice([0, 3 * p], v),
        b = g.sigmoid().mulStrict(m.tanh()).addStrict(l.mulStrict(i.add(y).sigmoid())),
        w = b.tanh().mulStrict(x.sigmoid());
    return [b, w];
  }
}),
    hh = An({
  multiRNNCell_: function (t, e, n, r) {
    for (var o = gn(e, "data", "multiRNNCell"), a = mn(n, "c", "multiRNNCell"), i = mn(r, "h", "multiRNNCell"), s = o, u = [], c = 0; c < t.length; c++) {
      var l = t[c](s, a[c], i[c]);
      u.push(l[0]), u.push(l[1]), s = l[1];
    }

    var h = [],
        f = [];

    for (c = 0; c < u.length; c += 2) h.push(u[c]), f.push(u[c + 1]);

    return [h, f];
  }
});
exports.multiRNNCell = hh;
exports.basicLSTMCell = lh;
var fh = An({
  movingAverage_: function (t, e, n, r, o) {
    void 0 === o && (o = !0);
    var a = gn(t, "v", "movingAverage"),
        i = gn(e, "x", "movingAverage"),
        s = gn(n, "decay", "movingAverage");
    Ft(a, i), C(S(a.shape, i.shape), function () {
      return "Shape mismatch in v and x";
    });
    var u = On(1),
        c = u.sub(s),
        l = i.sub(a).mul(c);

    if (o) {
      C(null != r, function () {
        return "When using zeroDebias: true, step is required.";
      });
      var h = gn(r, "step", "movingAverage");
      l = l.div(u.sub(No(s, h)));
    }

    return a.add(l);
  }
});
exports.movingAverage = fh;
var dh = An({
  stridedSlice_: function (t, e, n, r, o, a, i, s, u) {
    if (void 0 === o && (o = 0), void 0 === a && (a = 0), void 0 === i && (i = 0), void 0 === s && (s = 0), void 0 === u && (u = 0), null == r && (r = new Array(e.length)), 0 !== i) throw new Error("ellipsis mask is not yet supported");
    var c = gn(t, "x", "stridedSlice"),
        l = Ko(s),
        h = c.shape.slice();
    l.forEach(function (t) {
      e[t] = 0, n[t] = 1, h.splice(t, 0, 1);
    }), c = c.reshape(h);

    for (var f = 0; f < c.rank; f++) e[f] = Xo(o, e, r, c.shape, f), n[f] = Yo(a, n, r, c.shape, f), r[f] = r[f] || 1;

    var d = Ko(u);
    d.forEach(function (t) {
      n[t] = e[t] + 1, r[t] = 1;
    });
    var p = jo(e, n, r),
        v = p.filter(function (t, e) {
      return -1 === d.indexOf(e);
    });
    return r.every(function (t) {
      return 1 === t;
    }) ? Wl(c, e, p).reshape(v) : Lt.runKernelFunc(function (t) {
      return t.stridedSlice(c, e, n, r);
    }, {
      $x: c
    }).reshape(v);
  }
});
exports.stridedSlice = dh;
var ph = An({
  topk_: function (t, e, n) {
    void 0 === e && (e = 1), void 0 === n && (n = !0);
    var r = gn(t, "x", "topk");
    if (0 === r.rank) throw new Error("topk() expects the input to be of rank 1 or higher");
    var o = r.shape[r.shape.length - 1];
    if (e > o) throw new Error("'k' passed to topk() must be <= the last dimension (" + o + ") but got " + e);
    var a = Lt.runKernelFunc(function (t) {
      return t.topk(r, e, n);
    }, {
      $x: r
    });
    return {
      values: a[0],
      indices: a[1]
    };
  }
});
exports.topk = ph;
var vh = An({
  scatterND_: function (t, e, n) {
    var r = gn(t, "indices", "scatterND", "int32"),
        o = gn(e, "updates", "scatterND");
    return zo(o, r, n), Lt.runKernelFunc(function (t) {
      return t.scatterND(r, o, n);
    }, {
      indices: r,
      updates: o
    }, null, "ScatterNd", {
      shape: n
    });
  }
});
exports.scatterND = vh;
var gh = An({
  fft_: function (t) {
    C("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.fft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return Lt.runKernelFunc(function (t) {
      return t.fft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    mh = An({
  ifft_: function (t) {
    C("complex64" === t.dtype, function () {
      return "The dtype for tf.spectral.ifft() must be complex64 but got " + t.dtype + ".";
    });
    var e = t.shape[t.shape.length - 1],
        n = t.size / e,
        r = t.as2D(n, e);
    return Lt.runKernelFunc(function (t) {
      return t.ifft(r);
    }, {
      input: t
    }).reshape(t.shape);
  }
}),
    yh = An({
  rfft_: function (t, e) {
    C("float32" === t.dtype, function () {
      return "The dtype for rfft() must be real value but got " + t.dtype;
    });
    var n,
        r = t.shape[t.shape.length - 1],
        o = t.size / r;

    if (null != e && e < r) {
      var a = t.shape.map(function (t) {
        return 0;
      }),
          i = t.shape.map(function (t) {
        return t;
      });
      i[t.shape.length - 1] = e, n = t.slice(a, i), r = e;
    } else if (null != e && e > r) {
      var s = t.shape.map(function (t) {
        return t;
      });
      s[t.shape.length - 1] = e - r, n = t.concat(Gn(s), t.shape.length - 1), r = e;
    } else n = t;

    var u = n.zerosLike(),
        c = Tn(n, u).as2D(o, r),
        l = gh(c),
        h = Math.floor(r / 2) + 1,
        f = Dn(l),
        d = Nn(l),
        p = f.split([h, r - h], f.shape.length - 1),
        v = d.split([h, r - h], d.shape.length - 1),
        g = n.shape.slice();
    return g[n.shape.length - 1] = h, Tn(p[0], v[0]).reshape(g);
  }
}),
    xh = An({
  irfft_: function (t) {
    var e = t.shape[t.shape.length - 1],
        n = t.size / e;

    if (e <= 2) {
      var r = t.as2D(n, e),
          o = mh(r);
      return Dn(o);
    }

    var a = [n, 2 * (e - 1)],
        i = Dn(t).as2D(n, e),
        s = Nn(t).as2D(n, e),
        u = i.slice([0, 1], [n, e - 2]).reverse(1),
        c = s.slice([0, 1], [n, e - 2]).reverse(1).mul(On(-1)),
        l = i.concat(u, 1),
        h = s.concat(c, 1);
    return r = Tn(l, h).as2D(a[0], a[1]), o = mh(r), Dn(o);
  }
}),
    bh = Object.freeze({
  fft: gh,
  ifft: mh,
  rfft: yh,
  irfft: xh
});
exports.spectral = bh;
exports.irfft = xh;
exports.rfft = yh;
exports.ifft = mh;
exports.fft = gh;
var wh = An({
  sparseToDense_: function (t, e, n, r) {
    void 0 === r && (r = 0);
    var o = gn(t, "sparseIndices", "sparseToDense", "int32"),
        a = gn(e, "sparseValues", "sparseToDense"),
        i = gn(r, "defaultValue", "sparseToDense", a.dtype);
    return function (t, e, n, r) {
      if ("int32" !== t.dtype) throw new Error("tf.sparseToDense() expects the indices to be int32 type, but the dtype was " + t.dtype + ".");
      if (t.rank > 2) throw new Error("sparseIndices should be a scalar, vector, or matrix, but got shape " + t.shape + ".");
      var o = t.rank > 0 ? t.shape[0] : 1,
          a = t.rank > 1 ? t.shape[1] : 1;
      if (n.length !== a) throw new Error("outputShape has incorrect number of elements:, " + n.length + ", should be: " + a + ".");
      var i = e.size;
      if (0 !== e.rank && (1 !== e.rank || i !== o)) throw new Error("sparseValues has incorrect shape " + e.shape + ", should be [] or [" + o + "]");
      if (e.dtype !== r.dtype) throw new Error("sparseValues.dtype must match defaultValues.dtype");
    }(o, a, n, i), Lt.runKernelFunc(function (t) {
      return t.sparseToDense(o, a, n, i);
    }, {
      $sparseIndices: o,
      $sparseValues: a,
      $defaultValue: i
    });
  }
});
exports.sparseToDense = wh;
var Ch = An({
  gatherND_: function (t, e) {
    var n = gn(e, "indices", "gatherND", "int32"),
        r = gn(t, "x", "gatherND");
    return Lt.runKernelFunc(function (t) {
      return t.gatherND(r, n);
    }, {
      x: r,
      indices: n
    }, null, "GatherNd");
  }
});
exports.gatherND = Ch;
var Eh = An({
  diag_: function (t) {
    var e = gn(t, "x", "diag").flatten(),
        n = t.shape.concat(t.shape);
    return Lt.runKernelFunc(function (t) {
      return t.diag(e);
    }, {
      $x: e
    }).reshape(n);
  }
});
exports.diag = Eh;
var Rh = An({
  dropout_: function (t, e, n, r) {
    var o = gn(t, "x", "dropout");
    if (C("float32" === o.dtype, function () {
      return "x has to be a floating point tensor since it's going to be scaled, but got a " + o.dtype + " tensor instead.";
    }), C(e >= 0 && e < 1, function () {
      return "rate must be a float in the range [0, 1), but got " + e + ".";
    }), 0 === e) return t instanceof wt ? o.clone() : o;

    var a = function (t, e) {
      if (null == e) return t.shape.slice();
      if (S(t.shape, e)) return e;

      if (t.shape.length === e.length) {
        for (var n = [], r = 0; r < t.shape.length; r++) null == e[r] && null != t.shape[r] ? n.push(t.shape[r]) : n.push(e[r]);

        return n;
      }

      return e;
    }(o, n),
        i = 1 - e,
        s = zc(a, 0, 1, "float32", r).add(i).floor().div(i);

    return o.mul(s);
  }
});
exports.dropout = Rh;

function Ih(t, e, n) {
  for (var r = 1 - t % 2, o = new Float32Array(t), a = 0; a < t; ++a) {
    var i = 2 * Math.PI * a / (t + r - 1);
    o[a] = e - n * Math.cos(i);
  }

  return Mn(o, "float32");
}

var kh = An({
  hannWindow_: function (t) {
    return Ih(t, .5, .5);
  }
}),
    Sh = An({
  hammingWindow_: function (t) {
    return Ih(t, .54, .46);
  }
}),
    Ah = An({
  frame_: function (t, e, n, r, o) {
    void 0 === r && (r = !1), void 0 === o && (o = 0);

    for (var a = 0, i = []; a + e <= t.size;) i.push(Wl(t, a, e)), a += n;

    if (r) for (; a < t.size;) {
      var s = a + e - t.size,
          u = Yn([Wl(t, a, e - s), Hn([s], o)]);
      i.push(u), a += n;
    }
    return 0 === i.length ? Bn([], [0, e]) : Yn(i).as2D(i.length, e);
  }
}),
    Th = An({
  stft_: function (t, e, n, r, o) {
    var a;
    void 0 === o && (o = kh), null == r && (a = e, r = Math.floor(Math.pow(2, Math.ceil(Math.log(a) / Math.log(2)))));

    for (var i = Ah(t, e, n), s = To(i, o(e)), u = [], c = 0; c < i.shape[0]; c++) u.push(yh(s.slice([c, 0], [1, e]), r));

    return Yn(u);
  }
}),
    Dh = Object.freeze({
  hannWindow: kh,
  hammingWindow: Sh,
  frame: Ah,
  stft: Th
});
exports.signal = Dh;
exports.stft = Th;
exports.frame = Ah;
exports.hammingWindow = Sh;
exports.hannWindow = kh;

var Nh,
    Fh = function (t, e, o) {
  return void 0 === o && (o = 1), n(this, void 0, void 0, function () {
    var n, a, i, s, u, c, l, h, f, d, p, v, g, m;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = gn(t, "predictions", "inTopK"), a = gn(e, "targets", "inTopK"), C(n.rank > 1, function () {
            return "inTopK() expects the predictions to be of rank 2 or higher, but got " + n.rank;
          }), C(n.rank - 1 === a.rank, function () {
            return "predictions rank should be 1 larger than targets rank, but got predictions rank " + n.rank + " and targets rank " + a.rank;
          }), E(n.shape.slice(0, n.shape.length - 1), a.shape, "predictions's shape should be align with the targets' shape, except the last dimension."), i = n.shape[n.shape.length - 1], C(o > 0 && o <= i, function () {
            return "'k' passed to inTopK() must be > 0 && <= the predictions last dimension (" + i + "), but got " + o;
          }), [4, n.data()];

        case 1:
          return s = r.sent(), [4, a.data()];

        case 2:
          for (u = r.sent(), c = [s.length / i, i], h = c[1], f = B("bool", l = c[0]), d = 0; d < l; d++) {
            for (p = d * h, v = s.subarray(p, p + h), g = [], m = 0; m < v.length; m++) g.push({
              value: v[m],
              index: m
            });

            for (g.sort(function (t, e) {
              return e.value - t.value;
            }), f[d] = 0, m = 0; m < o; m++) if (g[m].index === u[d]) {
              f[d] = 1;
              break;
            }
          }

          return t !== n && n.dispose(), e !== a && a.dispose(), [2, Fn(f, a.shape, "bool")];
      }
    });
  });
};

exports.inTopKAsync = Fh;
exports.Reduction = Nh;
!function (t) {
  t[t.NONE = 0] = "NONE", t[t.MEAN = 1] = "MEAN", t[t.SUM = 2] = "SUM", t[t.SUM_BY_NONZERO_WEIGHTS = 3] = "SUM_BY_NONZERO_WEIGHTS";
}(Nh || (exports.Reduction = Nh = {}));

var _h = An({
  absoluteDifference_: function (t, e, n, r) {
    void 0 === r && (r = Nh.SUM_BY_NONZERO_WEIGHTS);
    var o = gn(t, "labels", "absoluteDifference"),
        a = gn(e, "predictions", "absoluteDifference"),
        i = null;
    null != n && (i = gn(n, "weights", "absoluteDifference")), E(o.shape, a.shape, "Error in absoluteDifference: ");
    var s = o.sub(a).abs();
    return Oh(s, i, r);
  }
}),
    Oh = An({
  computeWeightedLoss_: function (t, e, n) {
    void 0 === n && (n = Nh.SUM_BY_NONZERO_WEIGHTS);
    var r = gn(t, "losses", "computeWeightedLoss"),
        o = null;
    null != e && (o = gn(e, "weights", "computeWeightedLoss"));
    var a = null == o ? r : r.mul(o);
    if (n === Nh.NONE) return a;
    if (n === Nh.SUM) return a.sum();

    if (n === Nh.MEAN) {
      if (null == o) return a.mean();
      var i = r.size / o.size,
          s = a.sum().div(o.sum());
      return i > 1 ? s.div(On(i)) : s;
    }

    if (n === Nh.SUM_BY_NONZERO_WEIGHTS) {
      if (null == o) return a.sum().div(On(r.size));
      var u = o.mul(zn(r.shape)).notEqual(On(0)).sum().toFloat();
      return a.sum().div(u);
    }

    throw Error("Unknown reduction: " + n);
  }
}),
    Mh = An({
  cosineDistance_: function (t, e, n, r, o) {
    void 0 === o && (o = Nh.SUM_BY_NONZERO_WEIGHTS);
    var a = gn(t, "labels", "cosineDistance"),
        i = gn(e, "predictions", "cosineDistance"),
        s = null;
    null != r && (s = gn(r, "weights", "cosineDistance")), E(a.shape, i.shape, "Error in cosineDistance: ");
    var u = On(1).sub(a.mul(i).sum(n, !0));
    return Oh(u, s, o);
  }
}),
    Bh = An({
  hingeLoss_: function (t, e, n, r) {
    void 0 === r && (r = Nh.SUM_BY_NONZERO_WEIGHTS);
    var o = gn(t, "labels", "hingeLoss"),
        a = gn(e, "predictions", "hingeLoss"),
        i = null;
    null != n && (i = gn(n, "weights", "hingeLoss")), E(o.shape, a.shape, "Error in hingeLoss: ");
    var s = On(1);
    o = On(2).mul(o).sub(s);
    var u = s.sub(o.mul(a)).relu();
    return Oh(u, i, r);
  }
}),
    Ph = An({
  huberLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1), void 0 === o && (o = Nh.SUM_BY_NONZERO_WEIGHTS);
    var a = gn(t, "labels", "huberLoss"),
        i = gn(e, "predictions", "huberLoss"),
        s = null;
    null != n && (s = gn(n, "weights", "huberLoss")), E(a.shape, i.shape, "Error in huberLoss: ");
    var u = On(r),
        c = i.sub(a).abs(),
        l = Io(c, u),
        h = c.sub(l),
        f = On(.5).mul(l.square()).add(u.mul(h));
    return Oh(f, s, o);
  }
}),
    Lh = An({
  logLoss_: function (t, e, n, r, o) {
    void 0 === r && (r = 1e-7), void 0 === o && (o = Nh.SUM_BY_NONZERO_WEIGHTS);
    var a = gn(t, "labels", "logLoss"),
        i = gn(e, "predictions", "logLoss"),
        s = null;
    null != n && (s = gn(n, "weights", "logLoss")), E(a.shape, i.shape, "Error in logLoss: ");
    var u = On(1),
        c = On(r),
        l = a.mul(i.add(c).log()).neg().sub(u.sub(a).mul(u.sub(i).add(c).log()));
    return Oh(l, s, o);
  }
}),
    Wh = An({
  meanSquaredError_: function (t, e, n, r) {
    void 0 === r && (r = Nh.SUM_BY_NONZERO_WEIGHTS);
    var o = gn(t, "labels", "meanSquaredError"),
        a = gn(e, "predictions", "meanSquaredError"),
        i = null;
    null != n && (i = gn(n, "weights", "meanSquaredError")), E(o.shape, a.shape, "Error in meanSquaredError: ");
    var s = o.squaredDifference(a);
    return Oh(s, i, r);
  }
}),
    Uh = An({
  sigmoidCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Nh.SUM_BY_NONZERO_WEIGHTS);
    var a = gn(t, "multiClassLabels", "sigmoidCrossEntropy"),
        i = gn(e, "logits", "sigmoidCrossEntropy"),
        s = null;

    if (null != n && (s = gn(n, "weights", "sigmoidCrossEntropy")), E(a.shape, i.shape, "Error in sigmoidCrossEntropy: "), r > 0) {
      var u = On(r),
          c = On(1),
          l = On(.5);
      a = a.mul(c.sub(u)).add(l.mul(u));
    }

    var h = function (t, e) {
      var n = gn(t, "labels", "sigmoidCrossEntropyWithLogits"),
          r = gn(e, "logits", "sigmoidCrossEntropyWithLogits");
      E(n.shape, r.shape, "Error in sigmoidCrossEntropyWithLogits: ");
      var o = r.relu(),
          a = r.mul(n),
          i = r.abs().neg().exp().log1p();
      return o.sub(a).add(i);
    }(a, i);

    return Oh(h, s, o);
  }
}),
    Vh = An({
  softmaxCrossEntropy_: function (t, e, n, r, o) {
    void 0 === r && (r = 0), void 0 === o && (o = Nh.SUM_BY_NONZERO_WEIGHTS);
    var a = gn(t, "onehotLabels", "softmaxCrossEntropy"),
        i = gn(e, "logits", "softmaxCrossEntropy"),
        s = null;

    if (null != n && (s = gn(n, "weights", "softmaxCrossEntropy")), E(a.shape, i.shape, "Error in softmaxCrossEntropy: "), r > 0) {
      var u = On(r),
          c = On(1),
          l = On(a.shape[1]);
      a = a.mul(c.sub(u)).add(u.div(l));
    }

    var h = function (t, e, n) {
      if (void 0 === n && (n = -1), -1 === n && (n = e.rank - 1), n !== e.rank - 1) throw Error("Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank " + e.rank + " and dim was " + n);
      return oa(function (t, e, r) {
        var o = e.logSumExp([n], !0),
            a = e.toFloat().sub(o);
        r([t, a]);
        return {
          value: a.mul(t).neg().sum([n]),
          gradFunc: function (t, e) {
            var r = e[0],
                o = e[1],
                a = wn(t.shape, [n]);
            return [t.reshape(a).mul(r.toFloat().sub(o.exp())), t.reshape(a).mul(o.exp().sub(r.toFloat()))];
          }
        };
      })(t, e);
    }(a, i);

    return Oh(h, s, o);
  }
}),
    zh = Object.freeze({
  get Reduction() {
    return Nh;
  },

  absoluteDifference: _h,
  computeWeightedLoss: Oh,
  cosineDistance: Mh,
  hingeLoss: Bh,
  huberLoss: Ph,
  logLoss: Lh,
  meanSquaredError: Wh,
  sigmoidCrossEntropy: Uh,
  softmaxCrossEntropy: Vh
});

exports.losses = zh;

function Gh(t, e) {
  return void 0 === e && (e = !1), Lt.tidy(function () {
    if (2 !== t.shape.length) throw new Error("qr2d() requires a 2D Tensor, but got a " + t.shape.length + "D Tensor.");

    for (var n = t.shape[0], r = t.shape[1], o = Cc(n), a = t.clone(), i = Bn([[1]], [1, 1]), s = i.clone(), u = n >= r ? r : n, c = function (t) {
      var e,
          u = a,
          c = s,
          l = o;
      e = Lt.tidy(function () {
        var e = a.slice([t, t], [n - t, 1]),
            u = e.norm(),
            c = a.slice([t, t], [1, 1]),
            l = Bn([[-1]]).where(c.greater(0), Bn([[1]])),
            h = c.sub(l.mul(u)),
            f = e.div(h);
        s = 1 === f.shape[0] ? i.clone() : i.concat(f.slice([1, 0], [f.shape[0] - 1, f.shape[1]]), 0);
        var d = l.matMul(h).div(u).neg(),
            p = a.slice([t, 0], [n - t, r]),
            v = d.mul(s),
            g = s.transpose();
        if (0 === t) a = p.sub(v.matMul(g.matMul(p)));else {
          var m = p.sub(v.matMul(g.matMul(p)));
          a = a.slice([0, 0], [t, r]).concat(m, 0);
        }
        var y = v.transpose(),
            x = o.slice([0, t], [n, o.shape[1] - t]);
        if (0 === t) o = x.sub(x.matMul(s).matMul(y));else {
          var b = x.sub(x.matMul(s).matMul(y));
          o = o.slice([0, 0], [n, t]).concat(b, 1);
        }
        return [s, a, o];
      }), s = e[0], a = e[1], o = e[2], tn([u, c, l]);
    }, l = 0; l < u; ++l) c(l);

    return !e && n > r && (o = o.slice([0, 0], [n, r]), a = a.slice([0, 0], [r, r])), [o, a];
  });
}

var Hh = An({
  bandPart_: function (t, e, n) {
    if (e % 1 != 0) throw new Error("bandPart(): numLower must be an integer, got " + e + ".");
    if (n % 1 != 0) throw new Error("bandPart(): numUpper must be an integer, got " + n + ".");
    var r = gn(t, "a", "bandPart");
    if (r.rank < 2) throw new Error("bandPart(): Rank must be at least 2, got " + r.rank + ".");
    var o = r.shape,
        a = r.shape.slice(-2),
        i = a[0],
        s = a[1];
    if (!(e <= i)) throw new Error("bandPart(): numLower (" + e + ") must not be greater than the number of rows (" + i + ").");
    if (!(n <= s)) throw new Error("bandPart(): numUpper (" + n + ") must not be greater than the number of columns (" + s + ").");
    e < 0 && (e = i), n < 0 && (n = s);
    var u = Kn(0, i, 1, "int32").reshape([-1, 1]),
        c = Kn(0, s, 1, "int32"),
        l = Oo(u, c),
        h = pc(l.lessEqual(On(+e, "int32")), l.greaterEqual(On(-n, "int32"))),
        f = Gn([i, s], r.dtype);
    return hr(fr(r.reshape([-1, i, s])).map(function (t) {
      return yc(h, t, f);
    })).reshape(o);
  }
}),
    qh = An({
  gramSchmidt_: function (t) {
    var e;

    if (Array.isArray(t)) {
      e = !1, C(null != t && t.length > 0, function () {
        return "Gram-Schmidt process: input must not be null, undefined, or empty";
      });

      for (var n = t[0].shape[0], r = function (e) {
        C(t[e].shape[0] === n, function () {
          return "Gram-Schmidt: Non-unique lengths found in the input vectors: (" + t[e].shape[0] + " vs. " + n + ")";
        });
      }, o = 1; o < t.length; ++o) r(o);
    } else e = !0, t = tr(t, t.shape[0], 0).map(function (t) {
      return lr(t, [0]);
    });

    C(t.length <= t[0].shape[0], function () {
      return "Gram-Schmidt: Number of vectors (" + t.length + ") exceeds number of dimensions (" + t[0].shape[0] + ").";
    });

    var a = [],
        i = t,
        s = function (t) {
      a.push(Lt.tidy(function () {
        var e = i[t];
        if (t > 0) for (var n = 0; n < t; ++n) {
          var r = th(a[n].mulStrict(e)).mul(a[n]);
          e = e.sub(r);
        }
        return e.div(ch(e, "euclidean"));
      }));
    };

    for (o = 0; o < t.length; ++o) s(o);

    return e ? hr(a, 0) : a;
  }
}),
    Kh = An({
  qr_: function (t, e) {
    if (void 0 === e && (e = !1), t.rank < 2) throw new Error("qr() requires input tensor to have a rank >= 2, but got rank " + t.rank);
    if (2 === t.rank) return Gh(t, e);
    var n = t.shape.slice(0, t.shape.length - 2).reduce(function (t, e) {
      return t * e;
    }),
        r = fr(t.reshape([n, t.shape[t.shape.length - 2], t.shape[t.shape.length - 1]]), 0),
        o = [],
        a = [];
    return r.forEach(function (t) {
      var n = Gh(t, e),
          r = n[0],
          i = n[1];
      o.push(r), a.push(i);
    }), [hr(o, 0).reshape(t.shape), hr(a, 0).reshape(t.shape)];
  }
}),
    jh = Object.freeze({
  bandPart: Hh,
  gramSchmidt: qh,
  qr: Kh
});
exports.linalg = jh;

function Xh(t, e, n, r, o, a) {
  null == r && (r = .5), null == o && (o = Number.NEGATIVE_INFINITY), null == a && (a = 0);
  var i = t.shape[0];
  return n = Math.min(n, i), C(0 <= r && r <= 1, function () {
    return "iouThreshold must be in [0, 1], but was '" + r + "'";
  }), C(2 === t.rank, function () {
    return "boxes must be a 2D tensor, but was of rank '" + t.rank + "'";
  }), C(4 === t.shape[1], function () {
    return "boxes must have 4 columns, but 2nd dimension was " + t.shape[1];
  }), C(1 === e.rank, function () {
    return "scores must be a 1D tensor";
  }), C(e.shape[0] === i, function () {
    return "scores has incompatible shape with boxes. Expected " + i + ", but was " + e.shape[0];
  }), C(0 <= a && a <= 1, function () {
    return "softNmsSigma must be in [0, 1], but was '" + a + "'";
  }), {
    maxOutputSize: n,
    iouThreshold: r,
    scoreThreshold: o,
    softNmsSigma: a
  };
}

var Yh = An({
  resizeBilinear_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = gn(t, "images", "resizeBilinear");
    C(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeBilinear: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), C(2 === e.length, function () {
      return "Error in resizeBilinear: new shape must 2D, but got shape " + e + ".";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = Lt.runKernelFunc(function (t, e) {
      return e([o]), t.resizeBilinear(o, i, s, n);
    }, {
      x: o
    }, function (t, e) {
      return {
        x: function () {
          return Lt.runKernelFunc(function (r) {
            return r.resizeBilinearBackprop(t, e[0], n);
          }, {});
        }
      };
    }, "ResizeBilinear", {
      alignCorners: n,
      newHeight: i,
      newWidth: s
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    $h = An({
  resizeNearestNeighbor_: function (t, e, n) {
    void 0 === n && (n = !1);
    var r = gn(t, "images", "resizeNearestNeighbor");
    C(3 === r.rank || 4 === r.rank, function () {
      return "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank " + r.rank + ".";
    }), C(2 === e.length, function () {
      return "Error in resizeNearestNeighbor: new shape must 2D, but got shape " + e + ".";
    }), C("float32" === r.dtype || "int32" === r.dtype, function () {
      return "`images` must have `int32` or `float32` as dtype";
    });
    var o = r,
        a = !1;
    3 === r.rank && (a = !0, o = r.as4D(1, r.shape[0], r.shape[1], r.shape[2]));
    var i = e[0],
        s = e[1],
        u = Lt.runKernelFunc(function (t, e) {
      return e([o]), t.resizeNearestNeighbor(o, i, s, n);
    }, {
      batchImages: o
    }, function (t, e) {
      return {
        batchImages: function () {
          return Lt.runKernelFunc(function (r) {
            return r.resizeNearestNeighborBackprop(t, e[0], n);
          }, {});
        }
      };
    });
    return a ? u.as3D(u.shape[1], u.shape[2], u.shape[3]) : u;
  }
}),
    Qh = An({
  nonMaxSuppression_: function (t, e, n, r, o) {
    void 0 === r && (r = .5), void 0 === o && (o = Number.NEGATIVE_INFINITY);
    var a = gn(t, "boxes", "nonMaxSuppression"),
        i = gn(e, "scores", "nonMaxSuppression"),
        s = Xh(a, i, n, r, o);
    n = s.maxOutputSize, r = s.iouThreshold, o = s.scoreThreshold;
    var u = {
      maxOutputSize: n,
      iouThreshold: r,
      scoreThreshold: o
    };
    return Lt.runKernelFunc(function (t) {
      return t.nonMaxSuppression(a, i, n, r, o);
    }, {
      boxes: a,
      scores: i
    }, null, "NonMaxSuppressionV3", u);
  }
}),
    Jh = function (t, e, o, a, i) {
  return void 0 === a && (a = .5), void 0 === i && (i = Number.NEGATIVE_INFINITY), n(this, void 0, void 0, function () {
    var n, s, u, c, l, h, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = gn(t, "boxes", "nonMaxSuppressionAsync"), s = gn(e, "scores", "nonMaxSuppressionAsync"), u = Xh(n, s, o, a, i), o = u.maxOutputSize, a = u.iouThreshold, i = u.scoreThreshold, [4, Promise.all([n.data(), s.data()])];

        case 1:
          return c = r.sent(), l = c[0], h = c[1], f = Oa(l, h, o, a, i), n !== t && n.dispose(), s !== e && s.dispose(), [2, f];
      }
    });
  });
},
    Zh = An({
  nonMaxSuppressionWithScore_: function (t, e, n, r, o, a) {
    void 0 === r && (r = .5), void 0 === o && (o = Number.NEGATIVE_INFINITY), void 0 === a && (a = 0);
    var i = gn(t, "boxes", "nonMaxSuppression"),
        s = gn(e, "scores", "nonMaxSuppression"),
        u = Xh(i, s, n, r, o, a),
        c = {
      maxOutputSize: n = u.maxOutputSize,
      iouThreshold: r = u.iouThreshold,
      scoreThreshold: o = u.scoreThreshold,
      softNmsSigma: a = u.softNmsSigma
    },
        l = Lt.runKernel("NonMaxSuppressionV5", {
      boxes: i,
      scores: s
    }, c);
    return {
      selectedIndices: l[0],
      selectedScores: l[1]
    };
  }
}),
    tf = function (t, e, o, a, i, s) {
  return void 0 === a && (a = .5), void 0 === i && (i = Number.NEGATIVE_INFINITY), void 0 === s && (s = 0), n(this, void 0, void 0, function () {
    var n, u, c, l, h, f, d;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return n = gn(t, "boxes", "nonMaxSuppressionAsync"), u = gn(e, "scores", "nonMaxSuppressionAsync"), c = Xh(n, u, o, a, i, s), o = c.maxOutputSize, a = c.iouThreshold, i = c.scoreThreshold, s = c.softNmsSigma, [4, Promise.all([n.data(), u.data()])];

        case 1:
          return l = r.sent(), h = l[0], f = l[1], d = Ma(h, f, o, a, i, s), n !== t && n.dispose(), u !== e && u.dispose(), [2, d];
      }
    });
  });
},
    ef = An({
  cropAndResize_: function (t, e, n, r, o, a) {
    var i = gn(t, "image", "cropAndResize"),
        s = gn(e, "boxes", "cropAndResize", "float32"),
        u = gn(n, "boxInd", "cropAndResize", "int32");
    o = o || "bilinear", a = a || 0;
    var c = s.shape[0];
    return C(4 === i.rank, function () {
      return "Error in cropAndResize: image must be rank 4,but got rank " + i.rank + ".";
    }), C(2 === s.rank && 4 === s.shape[1], function () {
      return "Error in cropAndResize: boxes must be have size [" + c + ",4] but had shape " + s.shape + ".";
    }), C(1 === u.rank && u.shape[0] === c, function () {
      return "Error in cropAndResize: boxInd must be have size [" + c + "] but had shape " + s.shape + ".";
    }), C(2 === r.length, function () {
      return "Error in cropAndResize: cropSize must be of length 2, but got length " + r.length + ".";
    }), C(r[0] >= 1 && r[1] >= 1, function () {
      return "cropSize must be atleast [1,1], but was " + r;
    }), C("bilinear" === o || "nearest" === o, function () {
      return "method must be bilinear or nearest, but was " + o;
    }), Lt.runKernelFunc(function (t, e) {
      return t.cropAndResize(i, s, u, r, o, a);
    }, {
      images: i,
      boxes: s,
      boxInd: u
    }, null, "CropAndResize", {
      method: o,
      extrapolationValue: a,
      cropSize: r
    });
  }
}),
    nf = Object.freeze({
  resizeBilinear: Yh,
  resizeNearestNeighbor: $h,
  nonMaxSuppression: Qh,
  nonMaxSuppressionAsync: Jh,
  nonMaxSuppressionWithScore: Zh,
  nonMaxSuppressionWithScoreAsync: tf,
  cropAndResize: ef
}),
    rf = function (t, e) {
  return !(t > 0) || "linear" === e;
},
    of = function (t, e, n) {
  if (null == n || "linear" === n) return t;
  if ("relu" === n) return t.mul(e.step());
  throw new Error("Gradient for activation " + n + " has not been implemented yet.");
},
    af = function (t, e) {
  var n = e,
      r = Br(t.shape, e.shape);
  return r.length > 0 && (n = n.sum(r)), n.reshape(t.shape);
},
    sf = function (t, e, n) {
  if ("linear" === e) return t;
  if ("relu" === e) return ah(t);
  if ("elu" === e) return nh(t);
  if ("relu6" === e) return ih(t);
  if ("prelu" === e) return oh(t, n);
  throw new Error("Unknown fused activation " + e + ".");
};

exports.image = nf;
var uf = An({
  fusedMatMul_: function (t) {
    var e,
        n = t.a,
        r = t.b,
        o = t.transposeA,
        a = void 0 !== o && o,
        i = t.transposeB,
        s = void 0 !== i && i,
        u = t.bias,
        c = t.activation,
        l = void 0 === c ? "linear" : c,
        h = t.preluActivationWeights;

    if (!1 === rf(Lt.state.gradientDepth, l)) {
      var f = El(n, r, a, s);
      return null != u && (f = Or(f, u)), sf(f, l, h);
    }

    var d = gn(n, "a", "fused matMul"),
        p = gn(r, "b", "fused matMul");
    e = Nt(d, p), d = e[0], p = e[1];
    var v = a ? d.shape[d.rank - 2] : d.shape[d.rank - 1],
        g = s ? p.shape[p.rank - 1] : p.shape[p.rank - 2],
        m = a ? d.shape[d.rank - 1] : d.shape[d.rank - 2],
        y = s ? p.shape[p.rank - 2] : p.shape[p.rank - 1],
        x = d.shape.slice(0, -2),
        b = p.shape.slice(0, -2),
        w = k(x),
        E = k(b);
    C(d.rank >= 2 && p.rank >= 2 && d.rank === p.rank, function () {
      return "Error in fused matMul: inputs must have the same rank of at least 2, got ranks " + d.rank + " and " + p.rank + ".";
    }), C(S(x, b), function () {
      return "Error in fused matMul: outer dimensions (" + x + ") and (" + b + ") of Tensors with shapes " + d.shape + " and " + p.shape + " must match.";
    }), C(v === g, function () {
      return "Error in fused matMul: inner shapes (" + v + ") and (" + g + ") of Tensors with shapes " + d.shape + " and " + p.shape + " and transposeA=" + a + " and transposeB=" + s + " must match.";
    });
    var R,
        I,
        A = d.shape.slice(0, -2).concat([m, y]),
        T = a ? d.as3D(w, v, m) : d.as3D(w, m, v),
        D = s ? p.as3D(E, y, g) : p.as3D(E, g, y);
    null != u && Pr(A, (R = Nt(R = gn(u, "bias", "fused matMul"), d)[0]).shape), null != h && (I = gn(h, "prelu weights", "fused matMul"));
    var N = {
      a: T,
      b: D
    };
    null != u && (N.bias = R), null != h && (N.preluActivationWeights = I);
    var F = [T, D];
    return Lt.runKernelFunc(function (t, e) {
      var n = t.fusedBatchMatMul({
        a: T,
        b: D,
        transposeA: a,
        transposeB: s,
        bias: R,
        activation: l,
        preluActivationWeights: I
      });
      return e([T, D, n]), n;
    }, N, function (t, e) {
      var n = e[0],
          r = e[1],
          o = e[2],
          i = of(t, o, l),
          c = {};
      return null != u && (c = {
        bias: function () {
          return af(R, i);
        }
      }), a || s ? !a && s ? Object.assign({
        a: function () {
          return i.matMul(r, !1, !1);
        },
        b: function () {
          return i.matMul(n, !0, !1);
        }
      }, c) : a && !s ? Object.assign({
        a: function () {
          return r.matMul(i, !1, !0);
        },
        b: function () {
          return n.matMul(i, !1, !1);
        }
      }, c) : Object.assign({
        a: function () {
          return r.matMul(i, !0, !0);
        },
        b: function () {
          return i.matMul(n, !0, !0);
        }
      }, c) : Object.assign({
        a: function () {
          return i.matMul(r, !1, !0);
        },
        b: function () {
          return n.matMul(i, !0, !1);
        }
      }, c);
    }, "_FusedMatMul", {
      transposeA: a,
      transposeB: s,
      activation: l
    }, F, [!0]).reshape(A);
  }
}),
    cf = An({
  fusedConv2d_: function (t) {
    var e = t.x,
        n = t.filter,
        r = t.strides,
        o = t.pad,
        a = t.dataFormat,
        i = void 0 === a ? "NHWC" : a,
        s = t.dilations,
        u = void 0 === s ? [1, 1] : s,
        c = t.dimRoundingMode,
        l = t.bias,
        h = t.activation,
        f = void 0 === h ? "linear" : h,
        d = t.preluActivationWeights;

    if (f = f || "linear", !1 === rf(Lt.state.gradientDepth, f)) {
      var p = dl(e, n, r, o, i, u, c);
      return null != l && (p = Or(p, l)), sf(p, f, d);
    }

    var v = gn(e, "x", "conv2d"),
        g = gn(n, "filter", "conv2d"),
        m = v,
        y = !1;
    3 === v.rank && (y = !0, m = v.as4D(1, v.shape[0], v.shape[1], v.shape[2])), C(4 === m.rank, function () {
      return "Error in fused conv2d: input must be rank 4, but got rank " + m.rank + ".";
    }), C(4 === g.rank, function () {
      return "Error in fused conv2d: filter must be rank 4, but got rank " + g.rank + ".";
    }), null != c && C(A(o), function () {
      return "Error in fused conv2d: pad must be an integer when using, dimRoundingMode " + c + " but got pad " + o + ".";
    }), C(m.shape[3] === g.shape[2], function () {
      return "Error in conv2d: depth of input (" + m.shape[3] + ") must match input depth for filter " + g.shape[2] + ".";
    }), C(Ca(r, u), function () {
      return "Error in conv2D: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + u + "'";
    }), C("NHWC" === i, function () {
      return "Error in conv2d: got dataFormat of " + i + " but only NHWC is currently supported.";
    });
    var x,
        b,
        w = pa(m.shape, g.shape, r, u, o, c);
    null != l && (x = Nt(x = gn(l, "bias", "fused conv2d"), v)[0], Pr(w.outShape, x.shape)), null != d && (b = gn(d, "prelu weights", "fused conv2d"));
    var E = {
      x: m,
      filter: g
    };
    null != l && (E.bias = x), null != d && (E.preluActivationWeights = b);
    var R = [g, m],
        I = Lt.runKernelFunc(function (t, e) {
      var n = t.fusedConv2d({
        input: m,
        filter: g,
        convInfo: w,
        bias: x,
        activation: f,
        preluActivationWeights: b
      });
      return e([g, m, n]), n;
    }, E, function (t, e) {
      var n = e,
          a = n[0],
          i = n[1],
          s = n[2],
          c = of(t, s, f);
      C(wa(u), function () {
        return "Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '" + u + "'";
      });
      var h = {};
      return null != l && (h = {
        bias: function () {
          return af(x, c);
        }
      }), Object.assign({
        x: function () {
          return gl(i.shape, c, a, r, o);
        },
        filter: function () {
          return vl(i, c, a.shape, r, o);
        }
      }, h);
    }, "FusedConv2D", {
      convInfo: w,
      activation: f
    }, R, [!0]);
    return y ? I.as3D(I.shape[1], I.shape[2], I.shape[3]) : I;
  }
}),
    lf = An({
  fusedDepthwiseConv2d_: function (t) {
    var e = t.x,
        n = t.filter,
        r = t.strides,
        o = t.pad,
        a = t.dataFormat,
        i = void 0 === a ? "NHWC" : a,
        s = t.dilations,
        u = void 0 === s ? [1, 1] : s,
        c = t.dimRoundingMode,
        l = t.bias,
        h = t.activation,
        f = void 0 === h ? "linear" : h,
        d = t.preluActivationWeights;

    if (!1 === rf(Lt.state.gradientDepth, f)) {
      var p = ml(e, n, r, o, i, u, c);
      return null != l && (p = Or(p, l)), sf(p, f, d);
    }

    var v = gn(e, "x", "depthwiseConv2d"),
        g = gn(n, "filter", "depthwiseConv2d"),
        m = v,
        y = !1;
    3 === v.rank && (y = !0, m = v.as4D(1, v.shape[0], v.shape[1], v.shape[2])), C(4 === m.rank, function () {
      return "Error in fused depthwiseConv2d: input must be rank 4, but got rank " + m.rank + ".";
    }), C(4 === g.rank, function () {
      return "Error in fused depthwiseConv2d: filter must be rank 4, but got rank " + g.rank + ".";
    }), C(m.shape[3] === g.shape[2], function () {
      return "Error in fused depthwiseConv2d: number of input channels (" + m.shape[3] + ") must match the inChannels dimension in filter " + g.shape[2] + ".";
    }), null == u && (u = [1, 1]), C(Ca(r, u), function () {
      return "Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides " + r + " and dilations '" + u + "'";
    }), null != c && C(A(o), function () {
      return "Error in fused depthwiseConv2d: pad must be an integer when using dimRoundingMode " + c + " but got pad " + o + ".";
    });
    var x,
        b,
        w = pa(m.shape, g.shape, r, u, o, c, !0);
    null != l && (x = Nt(x = gn(l, "bias", "fused conv2d"), v)[0], Pr(w.outShape, x.shape)), null != d && (b = gn(d, "prelu weights", "fused depthwiseConv2d"));
    var E = {
      x: m,
      filter: g
    };
    null != l && (E.bias = x), null != d && (E.preluActivationWeights = b);
    var R = [g, m],
        I = Lt.runKernelFunc(function (t, e) {
      var n = t.fusedDepthwiseConv2D({
        input: m,
        filter: g,
        convInfo: w,
        bias: x,
        activation: f,
        preluActivationWeights: b
      });
      return e([g, m, n]), n;
    }, E, function (t, e) {
      C(wa(u), function () {
        return "Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '" + u + "'";
      });
      var n = e[0],
          r = e[1],
          o = e[2],
          a = of(t, o, f),
          i = {};
      return null != l && (i = {
        bias: function () {
          return af(x, a);
        }
      }), Object.assign({
        x: function () {
          return yl(r.shape, a, n, w);
        },
        filter: function () {
          return xl(r, a, n.shape, w);
        }
      }, i);
    }, "FusedDepthwiseConv2D", {
      convInfo: w,
      activation: f
    }, R, [!0]);
    return y ? I.as3D(I.shape[1], I.shape[2], I.shape[3]) : I;
  }
}),
    hf = Object.freeze({
  matMul: uf,
  conv2d: cf,
  depthwiseConv2d: lf
}),
    ff = Object.freeze({
  image: nf,
  linalg: jh,
  losses: zh,
  spectral: bh,
  fused: hf,
  signal: Dh,
  add: Or,
  addN: $u,
  batchNorm: nc,
  batchNormalization: ec,
  batchNorm2d: ac,
  batchNormalization2d: oc,
  batchNorm3d: uc,
  batchNormalization3d: sc,
  batchNorm4d: hc,
  batchNormalization4d: lc,
  broadcastTo: fc,
  clone: dc,
  div: Bo,
  divNoNan: bc,
  eye: Cc,
  multinomial: Ec,
  oneHot: Rc,
  pad: Ic,
  pad1d: kc,
  pad2d: Sc,
  pad3d: Ac,
  pad4d: Tc,
  rand: Dc,
  randomGamma: Uc,
  randomNormal: Vc,
  randomUniform: zc,
  square: Gc,
  squaredDifference: Hc,
  tile: wc,
  truncatedNormal: qc,
  conv1d: fl,
  conv2d: dl,
  conv3d: pl,
  depthwiseConv2d: ml,
  separableConv2d: bl,
  conv2dTranspose: wl,
  conv3dTranspose: Cl,
  op: An,
  booleanMaskAsync: ul,
  complex: Tn,
  real: Dn,
  imag: Nn,
  concat: Yn,
  concat1d: $n,
  concat2d: Qn,
  concat3d: Jn,
  concat4d: Zn,
  split: tr,
  matMul: El,
  dot: Rl,
  outerProduct: Il,
  reverse: kl,
  reverse1d: Sl,
  reverse2d: Al,
  reverse3d: Tl,
  reverse4d: Dl,
  maxPool: _l,
  avgPool: Ol,
  pool: Ml,
  maxPool3d: Bl,
  avgPool3d: Pl,
  maxPoolWithArgmax: Ll,
  slice: Wl,
  slice1d: Ul,
  slice2d: Vl,
  slice3d: zl,
  slice4d: Gl,
  abs: Lr,
  acos: Wr,
  acosh: Ur,
  asin: Vr,
  asinh: zr,
  atan: Gr,
  atanh: Hr,
  ceil: qr,
  clipByValue: Kr,
  cos: jr,
  cosh: Xr,
  erf: Yr,
  exp: $r,
  expm1: Qr,
  floor: Jr,
  log: Zr,
  log1p: to,
  logSigmoid: eo,
  neg: no,
  reciprocal: ro,
  round: oo,
  rsqrt: ao,
  sigmoid: io,
  sign: so,
  isNaN: uo,
  isInf: co,
  isFinite: lo,
  sin: ho,
  sinh: fo,
  softplus: po,
  sqrt: vo,
  step: go,
  tan: mo,
  tanh: yo,
  all: ql,
  any: Kl,
  argMax: jl,
  argMin: Xl,
  logSumExp: Yl,
  max: $l,
  mean: Ql,
  min: Jl,
  moments: Zl,
  sum: th,
  prod: eh,
  equal: Kc,
  equalStrict: jc,
  greater: Xc,
  greaterEqual: Yc,
  greaterEqualStrict: $c,
  greaterStrict: Qc,
  less: Jc,
  lessEqual: Zc,
  lessEqualStrict: tl,
  lessStrict: el,
  notEqual: nl,
  notEqualStrict: rl,
  addStrict: xo,
  atan2: bo,
  divStrict: wo,
  floorDiv: Co,
  maximum: Eo,
  maximumStrict: Ro,
  minimum: Io,
  minimumStrict: ko,
  mod: So,
  modStrict: Ao,
  mul: To,
  mulStrict: Do,
  pow: No,
  powStrict: Fo,
  squaredDifferenceStrict: _o,
  sub: Oo,
  subStrict: Mo,
  elu: nh,
  leakyRelu: rh,
  prelu: oh,
  relu: ah,
  relu6: ih,
  selu: sh,
  logicalAnd: pc,
  logicalNot: vc,
  logicalOr: gc,
  logicalXor: mc,
  where: yc,
  whereAsync: xc,
  buffer: er,
  print: nr,
  batchToSpaceND: rr,
  cast: or,
  cumsum: ar,
  depthToSpace: ir,
  expandDims: sr,
  reshape: ur,
  spaceToBatchND: cr,
  squeeze: lr,
  stack: hr,
  unstack: fr,
  setdiff1dAsync: dr,
  fill: Hn,
  linspace: qn,
  ones: zn,
  range: Kn,
  scalar: On,
  tensor: Fn,
  tensor1d: Mn,
  tensor2d: Bn,
  tensor3d: Pn,
  tensor4d: Ln,
  tensor5d: Wn,
  tensor6d: Un,
  variable: Vn,
  zeros: Gn,
  onesLike: jn,
  zerosLike: Xn,
  transpose: ua,
  softmax: ia,
  logSoftmax: sa,
  localResponseNormalization: uh,
  norm: ch,
  gather: il,
  unsortedSegmentSum: sl,
  basicLSTMCell: lh,
  multiRNNCell: hh,
  movingAverage: fh,
  stridedSlice: dh,
  topk: ph,
  scatterND: vh,
  fft: gh,
  ifft: mh,
  rfft: yh,
  irfft: xh,
  sparseToDense: wh,
  gatherND: Ch,
  diag: Eh,
  dropout: Rh,
  hannWindow: kh,
  hammingWindow: Sh,
  frame: Ah,
  stft: Th,
  inTopKAsync: Fh
});
exports.fused = hf;

function df(t, e) {
  Array.isArray(t) || (t = [t]), t.forEach(function (t) {
    null != t && C("complex64" !== t.dtype, function () {
      return e + " does not support complex64 tensors.";
    });
  });
}

function pf(t, e, n, r, o, a) {
  for (var i = o.strideHeight, s = o.strideWidth, u = o.dilationHeight, c = o.dilationWidth, l = o.effectiveFilterHeight, h = o.effectiveFilterWidth, f = o.padInfo.top, d = o.padInfo.left, p = "max" === a ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, v = er(o.outShape, n), g = v.values, m = o.outShape[1] * o.outShape[2] * o.outShape[3], y = o.outShape[2] * o.outShape[3], x = o.outShape[3], b = 0; b < o.batchSize; ++b) for (var w = b * m, C = b * r[0], E = 0; E < o.inChannels; ++E) for (var R = 0; R < o.outHeight; ++R) for (var I = R * i - f, k = Math.max(0, I), S = Math.min(o.inHeight, l + I), A = w + R * y, T = 0; T < o.outWidth; ++T) {
    for (var D = T * s - d, N = Math.max(0, D), F = Math.min(o.inWidth, h + D), _ = p, O = 0, M = 0, B = k; B < S; B += u) {
      for (var P = C + B * r[1], L = N; L < F; L += c) {
        var W = t[P + L * r[2] + E];
        "max" === a && W > _ ? _ = W : "avg" === a && (O += W, M++);
      }

      if (isNaN(_)) break;
    }

    g[A + T * x + E] = "avg" === a ? O / M : _;
  }

  return v;
}

function vf(t, e, n, r, o, a) {
  void 0 === o && (o = !1), void 0 === a && (a = !1);

  for (var i = er(r.outShape, "int32"), s = r.strideHeight, u = r.strideWidth, c = r.dilationHeight, l = r.dilationWidth, h = r.effectiveFilterHeight, f = r.effectiveFilterWidth, d = r.padInfo.top, p = r.padInfo.left, v = er(e, n, t), g = 0; g < r.batchSize; ++g) for (var m = 0; m < r.inChannels; ++m) for (var y = 0; y < r.outHeight; ++y) {
    for (var x = y * s - d, b = x; b < 0;) b += c;

    for (var w = Math.min(r.inHeight, h + x), C = 0; C < r.outWidth; ++C) {
      for (var E = C * u - p, R = E; R < 0;) R += l;

      for (var I = Math.min(r.inWidth, f + E), k = Number.NEGATIVE_INFINITY, S = -1, A = b; A < w; A += c) for (var T = A - x, D = R; D < I; D += l) {
        var N = D - E,
            F = v.get(g, A, D, m);
        F > k && (k = F, S = o ? a ? ((g * r.inHeight + A) * r.inWidth + D) * r.inChannels + m : (A * r.inWidth + D) * r.inChannels + m : T * f + N);
      }

      i.set(S, g, y, C, m);
    }
  }

  return i;
}

function gf(t, e, n, r) {
  if ("linear" === n) return t.linear(e);
  if ("relu" === n) return t.relu(e);
  if ("elu" === n) return t.elu(e);
  if ("relu6" === n) return t.relu6(e);
  if ("prelu" === n) return t.prelu(e, r);
  throw new Error("Activation " + n + " has not been implemented for the CPU backend.");
}

var mf = function (t) {
  function o() {
    var e = t.call(this) || this;
    return e.blockSize = 48, e.firstUse = !0, e.data = new ca(e, Lt), e;
  }

  return e(o, t), o.prototype.write = function (t, e, n) {
    this.firstUse && (this.firstUse = !1, i().get("IS_NODE") && dn("\n============================\nHi there 👋. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.\n============================"));
    var r = {};
    return this.data.set(r, {
      values: t,
      dtype: n
    }), r;
  }, o.prototype.move = function (t, e, n, r) {
    this.data.set(t, {
      values: e,
      dtype: r
    });
  }, o.prototype.numDataIds = function () {
    return this.data.numDataIds();
  }, o.prototype.read = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        return [2, this.readSync(t)];
      });
    });
  }, o.prototype.readSync = function (t) {
    var e = this.data.get(t),
        n = e.dtype,
        r = e.complexTensors;
    return "complex64" === n ? Aa(this.readSync(r.real.dataId), this.readSync(r.imag.dataId)) : this.data.get(t).values;
  }, o.prototype.bufferSync = function (t) {
    var e = this.readSync(t.dataId),
        n = e;
    if ("string" === t.dtype) try {
      n = e.map(function (t) {
        return ot(t);
      });
    } catch (t) {
      throw new Error("Failed to decode encoded string bytes into utf-8");
    }
    return er(t.shape, t.dtype, n);
  }, o.prototype.makeOutput = function (t, e, n) {
    var r = this.write(t, e, n);
    return Lt.makeTensorFromDataId(r, e, n, this);
  }, o.prototype.disposeData = function (t) {
    if (this.data.has(t)) {
      var e = this.data.get(t).complexTensors;
      null != e && (e.real.dispose(), e.imag.dispose()), this.data.delete(t);
    }
  }, o.prototype.time = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return e = et(), t(), [2, {
          kernelMs: et() - e
        }];
      });
    });
  }, o.prototype.memory = function () {
    return {
      unreliable: !0,
      reasons: ["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]
    };
  }, o.prototype.complex = function (t, e) {
    var n = this.makeOutput(null, t.shape, "complex64");
    return this.data.get(n.dataId).complexTensors = {
      real: Lt.keep(t.clone()),
      imag: Lt.keep(e.clone())
    }, n;
  }, o.prototype.real = function (t) {
    return this.data.get(t.dataId).complexTensors.real.clone();
  }, o.prototype.imag = function (t) {
    return this.data.get(t.dataId).complexTensors.imag.clone();
  }, o.prototype.slice = function (t, e, n) {
    if (df(t, "slice"), $o(t.shape, e, n)) {
      var r = Qo(e, t.strides),
          o = k(n);
      return Fn(this.readSync(t.dataId).subarray(r, r + o), n, t.dtype);
    }

    for (var a = er(n, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s).map(function (t, n) {
        return t + e[n];
      });
      a.values[s] = i.get.apply(i, u);
    }

    return a.toTensor();
  }, o.prototype.stridedSlice = function (t, e, n, r) {
    df(t, "stridedSlice");
    var o = jo(e, n, r);
    if (o.some(function (t) {
      return 0 === t;
    })) return Fn([], o);

    for (var a = er(o, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; s++) {
      for (var u = a.indexToLoc(s), c = new Array(u.length), l = 0; l < c.length; l++) c[l] = u[l] * r[l] + e[l];

      a.set.apply(a, [i.get.apply(i, c)].concat(u));
    }

    return a.toTensor();
  }, o.prototype.diag = function (t) {
    for (var e = this.readSync(t.dataId), n = er([t.size, t.size], t.dtype), r = n.values, o = 0; o < e.length; o++) r[o * t.size + o] = e[o];

    return n.toTensor();
  }, o.prototype.unstack = function (t, e) {
    for (var n = t.shape[e], r = new Array(t.rank - 1), o = 0, a = 0; a < t.rank; a++) a !== e && (r[o++] = t.shape[a]);

    var i = new Array(t.rank).fill(0),
        s = t.shape.slice();
    s[e] = 1;
    var u = new Array(n);

    for (a = 0; a < u.length; a++) i[e] = a, u[a] = this.slice(t, i, s).reshape(r);

    return u;
  }, o.prototype.reverse = function (t, e) {
    df(t, "reverse");

    for (var n = er(t.shape, t.dtype), r = this.bufferSync(t), o = function (o) {
      var a = n.indexToLoc(o),
          i = a.slice();
      e.forEach(function (e) {
        return i[e] = t.shape[e] - 1 - i[e];
      }), n.set.apply(n, [r.get.apply(r, i)].concat(a));
    }, a = 0; a < n.size; a++) o(a);

    return n.toTensor();
  }, o.prototype.concat = function (t, e) {
    var n = this;

    if ("complex64" === t[0].dtype) {
      var r = t.map(function (t) {
        return Dn(t);
      }),
          o = t.map(function (t) {
        return Nn(t);
      });
      return Tn(this.concat(r, e), this.concat(o, e));
    }

    var a = t.map(function (t) {
      var n = k(t.shape.slice(e));
      return t.as2D(-1, n);
    }),
        i = Sn(a.map(function (t) {
      return t.shape;
    }), 1),
        s = er(i, t[0].dtype).values;

    if (1 === a[0].shape[0]) {
      var u = 0;
      a.forEach(function (t) {
        s.set(n.readSync(t.dataId), u), u += t.size;
      });
    } else {
      var c = 0;
      a.forEach(function (t) {
        for (var e = n.readSync(t.dataId), r = 0, o = 0; o < t.shape[0]; ++o) for (var a = o * i[1] + c, u = 0; u < t.shape[1]; ++u) s[a + u] = e[r++];

        c += t.shape[1];
      });
    }

    var l = Sn(t.map(function (t) {
      return t.shape;
    }), e);
    return Fn(s, l, t[0].dtype);
  }, o.prototype.neg = function (t) {
    return df(t, "neg"), this.multiply(On(-1), t);
  }, o.prototype.add = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t + n,
        imag: e + r
      };
    }) : this.broadcastedBinaryOp(t, e, Tt(t.dtype, e.dtype), function (t, e) {
      return t + e;
    });
  }, o.prototype.addN = function (t) {
    var e = this;
    df(t, "addN");

    for (var n = t.map(function (t) {
      return e.readSync(t.dataId);
    }), r = er(t[0].shape, t[0].dtype), o = r.values, a = 0; a < t.length; a++) for (var i = n[a], s = 0; s < o.length; s++) o[s] += i[s];

    return r.toTensor();
  }, o.prototype.softmax = function (t, e) {
    var n = O([e], t.shape),
        r = this.max(t, n),
        o = wn(r.shape, n),
        a = this.subtract(t, r.reshape(o)),
        i = this.exp(a),
        s = this.sum(i, n).reshape(o);
    return Bo(i, s);
  }, o.prototype.subtract = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t - n,
        imag: e - r
      };
    }) : this.broadcastedBinaryOp(t, e, Tt(t.dtype, e.dtype), function (t, e) {
      return t - e;
    });
  }, o.prototype.pow = function (t, e) {
    return df([t, e], "pow"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.pow(t, e);
    });
  }, o.prototype.batchMatMul = function (t, e, n, r) {
    df([t, e], "matMul");

    for (var o = n ? t.shape[1] : t.shape[2], a = n ? t.shape[2] : t.shape[1], i = r ? e.shape[1] : e.shape[2], s = t.shape[0], u = this.readSync(t.dataId), c = this.readSync(e.dataId), l = n ? [t.strides[0], 1, t.strides[1]] : [t.strides[0], t.strides[1], 1], h = l[0], f = l[1], d = l[2], p = r ? [1, e.strides[1], e.strides[0]] : [e.strides[1], 1, e.strides[0]], v = p[0], g = p[1], m = p[2], y = a * i, x = er([s, a, i], t.dtype), b = x.values, w = this.blockSize, C = 0; C < s; C++) for (var E = 0; E < a; E += w) for (var R = 0; R < i; R += w) for (var I = 0; I < o; I += w) for (var k = Math.min(E + w, a), S = Math.min(R + w, i), A = Math.min(I + w, o), T = E; T < k; T++) for (var D = R; D < S; D++) {
      for (var N = 0, F = I; F < A; F++) N += u[C * h + T * f + F * d] * c[F * v + D * g + C * m];

      b[C * y + (T * i + D)] += N;
    }

    return x.toTensor();
  }, o.prototype.fusedBatchMatMul = function (t) {
    var e = t.a,
        n = t.b,
        r = t.transposeA,
        o = t.transposeB,
        a = t.bias,
        i = t.activation,
        s = t.preluActivationWeights,
        u = this.batchMatMul(e, n, r, o);
    return a && (u = this.add(u, a)), i && (u = gf(this, u, i, s)), u;
  }, o.prototype.multiply = function (t, e) {
    return "complex64" === t.dtype || "complex64" === e.dtype ? this.broadcastedBinaryComplexOp(t.cast("complex64"), e.cast("complex64"), function (t, e, n, r) {
      return {
        real: t * n - e * r,
        imag: t * r + e * n
      };
    }) : this.broadcastedBinaryOp(t, e, Tt(t.dtype, e.dtype), function (t, e) {
      return t * e;
    });
  }, o.prototype.floorDiv = function (t, e) {
    df([t, e], "floorDiv");
    return this.broadcastedBinaryOp(t, e, "int32", function (t, e) {
      return Math.floor(t / e);
    });
  }, o.prototype.sum = function (t, e) {
    df(t, "sum"), Cn("sum", e, t.rank);

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, Tt(t.dtype, "int32")), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = 0, f = 0; f < i; ++f) h += u[l + f];

      s[c] = h;
    }

    return a;
  }, o.prototype.prod = function (t, e) {
    df(t, "sum");

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, Tt(t.dtype, "int32")), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = 1, f = 0; f < i; ++f) h *= u[l + f];

      s[c] = h;
    }

    return a;
  }, o.prototype.unsortedSegmentSum = function (t, e, n) {
    df(t, "unsortedSegmentSum");

    for (var r = [], o = t.rank - e.rank, a = 0; a < o; ++a) e = e.expandDims(a + 1);

    for (a = 0; a < n; ++a) {
      var i = On(a, "int32"),
          s = Kc(i, e).asType("float32").mul(t).sum(0);
      r.push(s);
    }

    return hr(r);
  }, o.prototype.argMin = function (t, e) {
    df(t, "argMin");
    var n = [e];
    Cn("argMin", n, t.rank);

    for (var r = bn(t.shape, n), o = r[0], a = r[1], i = Gn(o, "int32"), s = k(a), u = this.readSync(i.dataId), c = this.readSync(t.dataId), l = 0; l < u.length; ++l) {
      for (var h = l * s, f = c[h], d = 0, p = 0; p < s; ++p) {
        var v = c[h + p];
        v < f && (f = v, d = p);
      }

      u[l] = d;
    }

    return i;
  }, o.prototype.argMax = function (t, e) {
    df(t, "argMax");
    var n = [e];
    Cn("argMax", n, t.rank);

    for (var r = bn(t.shape, n), o = r[0], a = r[1], i = Gn(o, "int32"), s = k(a), u = this.readSync(i.dataId), c = this.readSync(t.dataId), l = 0; l < u.length; ++l) {
      for (var h = l * s, f = c[h], d = 0, p = 0; p < s; ++p) {
        var v = c[h + p];
        v > f && (f = v, d = p);
      }

      u[l] = d;
    }

    return i;
  }, o.prototype.cumsum = function (t, e, n, r) {
    if (df(t, "cumsum"), e !== t.rank - 1) throw new Error("backend.cumsum in CPU expects an inner-most axis=" + (t.rank - 1) + " but got axis=" + e);

    for (var o = Tt(t.dtype, "int32"), a = Gn(t.shape, o), i = this.readSync(a.dataId), s = this.readSync(t.dataId), u = t.shape[t.rank - 1], c = r ? function (t, e) {
      return t + u - e - 1;
    } : function (t, e) {
      return t + e;
    }, l = 0; l < s.length; l += u) for (var h = 0; h < u; h++) {
      var f = c(l, h);
      if (0 === h) i[f] = n ? 0 : s[f];else {
        var d = c(l, h - 1);
        i[f] = n ? s[d] + i[d] : s[f] + i[d];
      }
    }

    return a;
  }, o.prototype.equal = function (t, e) {
    return df([t, e], "equal"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t === e ? 1 : 0;
    });
  }, o.prototype.notEqual = function (t, e) {
    return df([t, e], "notEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t !== e ? 1 : 0;
    });
  }, o.prototype.less = function (t, e) {
    return df([t, e], "less"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t < e ? 1 : 0;
    });
  }, o.prototype.lessEqual = function (t, e) {
    return df([t, e], "lessEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t <= e ? 1 : 0;
    });
  }, o.prototype.greater = function (t, e) {
    return df([t, e], "greater"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t > e ? 1 : 0;
    });
  }, o.prototype.greaterEqual = function (t, e) {
    return df([t, e], "greaterEqual"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t >= e ? 1 : 0;
    });
  }, o.prototype.logicalNot = function (t) {
    df(t, "logicalNot");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) n[r] = e[r] ? 0 : 1;

    return this.makeOutput(n, t.shape, "bool");
  }, o.prototype.logicalAnd = function (t, e) {
    return df([t, e], "logicalAnd"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t && e;
    });
  }, o.prototype.logicalOr = function (t, e) {
    return df([t, e], "logicalOr"), this.broadcastedBinaryOp(t, e, "bool", function (t, e) {
      return t || e;
    });
  }, o.prototype.select = function (t, e, n) {
    df([t, e, n], "select");

    for (var r = this.readSync(t.dataId), o = this.readSync(e.dataId), a = this.readSync(n.dataId), i = Gn(e.shape, Tt(e.dtype, n.dtype)), s = this.readSync(i.dataId), u = 0, c = 0 === t.rank || t.rank > 1 || 1 === e.rank ? 1 : k(e.shape.slice(1)), l = 0; l < r.length; l++) for (var h = 0; h < c; h++) 1 === r[l] ? s[u++] = o[l] : s[u++] = a[l];

    return i;
  }, o.prototype.where = function (t) {
    df([t], "where");
    var e = this.readSync(t.dataId);
    return Ga(t.shape, e);
  }, o.prototype.topk = function (t, e, n) {
    return df(t, "topk"), za(this.readSync(t.dataId), t.shape, t.dtype, e);
  }, o.prototype.min = function (t, e) {
    df(t, "min"), Cn("min", e, t.rank);

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, t.dtype), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = u[l], f = 0; f < i; ++f) {
        var d = u[l + f];
        d < h && (h = d);
      }

      s[c] = h;
    }

    return a;
  }, o.prototype.minimum = function (t, e) {
    return df([t, e], "minimum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.min(t, e);
    });
  }, o.prototype.mod = function (t, e) {
    return df([t, e], "mod"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t % e;
      return t < 0 && e < 0 || t >= 0 && e >= 0 ? n : (n + e) % e;
    });
  }, o.prototype.max = function (t, e) {
    df(t, "max"), Cn("max", e, t.rank);

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, t.dtype), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = u[l], f = 0; f < i; ++f) {
        var d = u[l + f];
        d > h && (h = d);
      }

      s[c] = h;
    }

    return a;
  }, o.prototype.maximum = function (t, e) {
    return df([t, e], "maximum"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.max(t, e);
    });
  }, o.prototype.all = function (t, e) {
    df(t, "all"), Cn("all", e, t.rank);

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, t.dtype), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = u[l], f = 0; f < i; ++f) {
        var d = u[l + f];
        h = h && d;
      }

      s[c] = h;
    }

    return a;
  }, o.prototype.any = function (t, e) {
    df(t, "any"), Cn("any", e, t.rank);

    for (var n = bn(t.shape, e), r = n[0], o = n[1], a = Gn(r, t.dtype), i = k(o), s = this.readSync(a.dataId), u = this.readSync(t.dataId), c = 0; c < s.length; ++c) {
      for (var l = c * i, h = u[l], f = 0; f < i; ++f) {
        var d = u[l + f];
        h = h || d;
      }

      s[c] = h;
    }

    return a;
  }, o.prototype.squaredDifference = function (t, e) {
    return df([t, e], "squaredDifference"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      var n = t - e;
      return n * n;
    });
  }, o.prototype.ceil = function (t) {
    df(t, "ceil");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.ceil(e[r]);

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.floor = function (t) {
    df(t, "floor");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.floor(e[r]);

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.sign = function (t) {
    df(t, "x");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) e[r] < 0 ? n[r] = -1 : e[r] > 0 ? n[r] = 1 : n[r] = 0;

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.isNaN = function (t) {
    df(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isNaN(e[r]) && (n[r] = 1);

    return this.makeOutput(n, t.shape, "bool");
  }, o.prototype.isInf = function (t) {
    df(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Math.abs(e[r]) === 1 / 0 && (n[r] = 1);

    return this.makeOutput(n, t.shape, "bool");
  }, o.prototype.isFinite = function (t) {
    df(t, "x");

    for (var e = this.readSync(t.dataId), n = new Uint8Array(e.length), r = 0; r < e.length; ++r) Number.isFinite(e[r]) && (n[r] = 1);

    return this.makeOutput(n, t.shape, "bool");
  }, o.prototype.round = function (t) {
    df(t, "round");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = Math.floor(e[r]);
      e[r] - o < .5 ? n[r] = Math.floor(e[r]) : e[r] - o > .5 ? n[r] = Math.ceil(e[r]) : n[r] = o % 2 == 0 ? o : o + 1;
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.exp = function (t) {
    df(t, "exp");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.exp(e[r]);

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.expm1 = function (t) {
    df(t, "expm1");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = Math.expm1(e[r]);

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.log = function (t) {
    df(t, "log");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log(o);
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.log1p = function (t) {
    df(t, "log1p");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.log1p(o);
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.sqrt = function (t) {
    df(t, "sqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = Math.sqrt(o);
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.rsqrt = function (t) {
    df(t, "rsqrt");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) {
      var o = e[r];
      n[r] = 1 / Math.sqrt(o);
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.reciprocal = function (t) {
    df(t, "reciprocal");

    for (var e = this.readSync(t.dataId), n = new Float32Array(e.length), r = 0; r < e.length; ++r) n[r] = 1 / e[r];

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.linear = function (t) {
    return t;
  }, o.prototype.relu = function (t) {
    df(t, "relu");

    for (var e = Gn(t.shape, t.dtype), n = this.readSync(e.dataId), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) n[o] = Math.max(0, r[o]);

    return e;
  }, o.prototype.relu6 = function (t) {
    df(t, "relu");

    for (var e = Gn(t.shape, t.dtype), n = this.readSync(e.dataId), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) n[o] = Math.min(Math.max(0, r[o]), 6);

    return e;
  }, o.prototype.prelu = function (t, e) {
    return df([t, e], "prelu"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return t < 0 ? e * t : t;
    });
  }, o.prototype.elu = function (t) {
    df(t, "elu");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = n[r];
      e[r] = o >= 0 ? o : Math.exp(o) - 1;
    }

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.eluDer = function (t, e) {
    df([t, e], "eluDer");

    for (var n = new Float32Array(e.size), r = this.readSync(e.dataId), o = this.readSync(t.dataId), a = 0; a < r.length; ++a) {
      var i = r[a];
      n[a] = i >= 1 ? o[a] : o[a] * (i + 1);
    }

    return this.makeOutput(n, e.shape, "float32");
  }, o.prototype.selu = function (t) {
    df(t, "selu");

    for (var e = su, n = uu, r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i >= 0 ? n * i : e * (Math.exp(i) - 1);
    }

    return this.makeOutput(r, t.shape, "float32");
  }, o.prototype.clip = function (t, e, n) {
    df(t, "clip");

    for (var r = new Float32Array(t.size), o = this.readSync(t.dataId), a = 0; a < o.length; ++a) {
      var i = o[a];
      r[a] = i > n ? n : i < e ? e : i;
    }

    return this.makeOutput(r, t.shape, "float32");
  }, o.prototype.abs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.abs(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.complexAbs = function (t) {
    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < t.size; ++r) {
      var o = n[2 * r],
          a = n[2 * r + 1];
      e[r] = Math.hypot(o, a);
    }

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.int = function (t) {
    df(t, "int");

    for (var e = new Int32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = n[r];

    return this.makeOutput(e, t.shape, "int32");
  }, o.prototype.sigmoid = function (t) {
    df(t, "sigmoid");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = 1 / (1 + Math.exp(-n[r]));

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.softplus = function (t) {
    df(t, "softplus");

    for (var e = Math.log(1.1920928955078125e-7) + 2, n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o] > -e,
          i = r[o] < e,
          s = Math.exp(r[o]),
          u = void 0;
      u = i ? s : a ? r[o] : Math.log(1 + s), n[o] = u;
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.sin = function (t) {
    df(t, "sin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sin(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.cos = function (t) {
    df(t, "cos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cos(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.tan = function (t) {
    df(t, "tan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.tan(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.asin = function (t) {
    df(t, "asin");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asin(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.acos = function (t) {
    df(t, "acos");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acos(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.atan = function (t) {
    df(t, "atan");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atan(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.atan2 = function (t, e) {
    return df([t, e], "atan2"), this.broadcastedBinaryOp(t, e, t.dtype, function (t, e) {
      return Math.atan2(t, e);
    });
  }, o.prototype.sinh = function (t) {
    df(t, "sinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.sinh(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.cosh = function (t) {
    df(t, "cosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.cosh(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.tanh = function (t) {
    df(t, "tanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = T(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.asinh = function (t) {
    df(t, "asinh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.asinh(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.acosh = function (t) {
    df(t, "acosh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.acosh(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.atanh = function (t) {
    df(t, "atanh");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) e[r] = Math.atanh(n[r]);

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.erf = function (t) {
    df(t, "erf");

    for (var e = new Float32Array(t.size), n = this.readSync(t.dataId), r = 0; r < n.length; ++r) {
      var o = Math.sign(n[r]),
          a = Math.abs(n[r]),
          i = 1 / (1 + .3275911 * a);
      e[r] = o * (1 - ((((1.061405429 * i - 1.453152027) * i + 1.421413741) * i - .284496736) * i + .254829592) * i * Math.exp(-a * a));
    }

    return this.makeOutput(e, t.shape, "float32");
  }, o.prototype.step = function (t, e) {
    void 0 === e && (e = 0), df(t, "step");

    for (var n = new Float32Array(t.size), r = this.readSync(t.dataId), o = 0; o < r.length; ++o) {
      var a = r[o];
      isNaN(a) ? n[o] = NaN : n[o] = a > 0 ? 1 : e;
    }

    return this.makeOutput(n, t.shape, "float32");
  }, o.prototype.fusedConv2d = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        a = t.activation,
        i = t.preluActivationWeights,
        s = this.conv2d(e, n, r);
    return o && (s = this.add(s, o)), a && (s = gf(this, s, a, i)), s;
  }, o.prototype.conv2d = function (t, e, n) {
    df([t, e], "conv2d");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, c = "channelsLast" === n.dataFormat, l = er(n.outShape, t.dtype), h = t.strides[0], f = c ? t.strides[1] : t.strides[2], d = c ? t.strides[2] : 1, p = c ? 1 : t.strides[1], v = l.strides[0], g = c ? l.strides[1] : l.strides[2], m = c ? l.strides[2] : 1, y = c ? 1 : l.strides[1], x = this.readSync(t.dataId), b = this.readSync(e.dataId), w = l.values, C = 0; C < n.batchSize; ++C) for (var E = C * h, R = C * v, I = 0; I < n.outHeight; ++I) for (var k = R + I * g, S = I * n.strideHeight - u, A = 0; A < r; A++) {
      var T = S + A * a;
      if (!(T < 0 || T >= n.inHeight)) for (var D = A * e.strides[0], N = E + T * f, F = 0; F < n.outWidth; ++F) for (var _ = k + F * m, O = F * n.strideWidth - s, M = 0; M < o; M++) {
        var B = O + M * i;
        if (!(B < 0 || B >= n.inWidth)) for (var P = N + B * d, L = D + M * e.strides[1], W = 0; W < n.inChannels; ++W) {
          for (var U = x[P + W * p], V = 0; V < n.outChannels; ++V) w[_ + V * y] += U * b[L + V];

          L += n.outChannels;
        }
      }
    }

    return l.toTensor();
  }, o.prototype.conv3d = function (t, e, n) {
    for (var r = n.filterDepth, o = n.filterHeight, a = n.filterWidth, i = n.dilationDepth, s = n.dilationHeight, u = n.dilationWidth, c = n.padInfo.front, l = n.padInfo.left, h = n.padInfo.top, f = er(n.outShape, t.dtype), d = this.readSync(t.dataId), p = this.readSync(e.dataId), v = f.values, g = 0; g < n.batchSize; ++g) for (var m = g * t.strides[0], y = g * f.strides[0], x = 0; x < n.outDepth; ++x) for (var b = y + x * f.strides[1], w = x * n.strideDepth - c, C = 0; C < r; C++) {
      var E = w + C * i;
      if (!(E < 0 || E >= n.inDepth)) for (var R = C * e.strides[0], I = m + E * t.strides[1], k = 0; k < n.outHeight; ++k) for (var S = b + k * f.strides[2], A = k * n.strideHeight - h, T = 0; T < o; T++) {
        var D = A + T * s;
        if (!(D < 0 || D >= n.inHeight)) for (var N = R + T * e.strides[1], F = I + D * t.strides[2], _ = 0; _ < n.outWidth; ++_) for (var O = S + _ * n.outChannels, M = _ * n.strideWidth - l, B = 0; B < a; B++) {
          var P = M + B * u;
          if (!(P < 0 || P >= n.inWidth)) for (var L = N + B * e.strides[2], W = F + P * n.inChannels, U = L, V = 0; V < n.inChannels; ++V) {
            for (var z = d[W + V], G = 0; G < n.outChannels; ++G) v[O + G] += z * p[U + G];

            U += n.outChannels;
          }
        }
      }
    }

    return f.toTensor();
  }, o.prototype.conv2dDerInput = function (t, e, n) {
    df([t, e], "conv2dDerInput");

    for (var r = er(n.inShape, "float32"), o = r.values, a = this.readSync(t.dataId), i = this.readSync(e.dataId), s = e.strides, u = s[0], c = s[1], l = s[2], h = n.batchSize, f = n.filterHeight, d = n.filterWidth, p = n.inChannels, v = n.inHeight, g = n.inWidth, m = n.outChannels, y = n.outHeight, x = n.outWidth, b = n.strideHeight, w = n.strideWidth, C = n.dataFormat, E = f - 1 - n.padInfo.top, R = d - 1 - n.padInfo.left, I = "channelsLast" === C, k = r.strides[0], S = I ? r.strides[1] : r.strides[2], A = I ? r.strides[2] : 1, T = I ? 1 : r.strides[1], D = t.strides[0], N = I ? t.strides[1] : t.strides[2], F = I ? t.strides[2] : 1, _ = I ? 1 : t.strides[1], O = 0; O < h; ++O) for (var M = 0; M < p; ++M) for (var B = 0; B < v; ++B) for (var P = B - E, L = Math.max(0, Math.ceil(P / b)), W = Math.min(y, (f + P) / b), U = 0; U < g; ++U) {
      for (var V = U - R, z = Math.max(0, Math.ceil(V / w)), G = Math.min(x, (d + V) / w), H = 0, q = L; q < W; ++q) for (var K = q * b - P, j = z; j < G; ++j) for (var X = D * O + N * q + F * j, Y = u * (f - 1 - K) + c * (d - 1 - (j * w - V)) + l * M, $ = 0; $ < m; ++$) {
        H += a[X + _ * $] * i[Y + $];
      }

      o[k * O + S * B + A * U + T * M] = H;
    }

    return r.toTensor();
  }, o.prototype.conv3dDerInput = function (t, e, n) {
    for (var r = er(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], c = a[3], l = this.readSync(t.dataId), h = t.strides, f = h[0], d = h[1], p = h[2], v = h[3], g = this.readSync(e.dataId), m = e.strides, y = m[0], x = m[1], b = m[2], w = m[3], C = n.batchSize, E = n.filterDepth, R = n.filterHeight, I = n.filterWidth, k = n.inChannels, S = n.inDepth, A = n.inHeight, T = n.inWidth, D = n.outChannels, N = n.outDepth, F = n.outHeight, _ = n.outWidth, O = n.strideDepth, M = n.strideHeight, B = n.strideWidth, P = E - 1 - n.padInfo.front, L = R - 1 - n.padInfo.top, W = I - 1 - n.padInfo.left, U = 0; U < C; ++U) for (var V = 0; V < k; ++V) for (var z = 0; z < S; ++z) for (var G = z - P, H = Math.max(0, Math.ceil(G / O)), q = Math.min(N, (E + G) / O), K = 0; K < A; ++K) for (var j = K - L, X = Math.max(0, Math.ceil(j / M)), Y = Math.min(F, (R + j) / M), $ = 0; $ < T; ++$) {
      for (var Q = $ - W, J = Math.max(0, Math.ceil(Q / B)), Z = Math.min(_, (I + Q) / B), tt = 0, et = H; et < q; ++et) for (var nt = et * O - G, rt = X; rt < Y; ++rt) for (var ot = rt * M - j, at = J; at < Z; ++at) for (var it = f * U + d * et + p * rt + v * at, st = y * (E - 1 - nt) + x * (R - 1 - ot) + b * (I - 1 - (at * B - Q)) + w * V, ut = 0; ut < D; ++ut) {
        tt += l[it + ut] * g[st + ut];
      }

      o[i * U + s * z + u * K + c * $ + V] = tt;
    }

    return r.toTensor();
  }, o.prototype.conv2dDerFilter = function (t, e, n) {
    df([t, e], "conv2dDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = "channelsLast" === n.dataFormat, u = er(n.filterShape, "float32"), c = n.padInfo.left, l = n.padInfo.top, h = this.bufferSync(t), f = this.bufferSync(e), d = 0; d < a; ++d) for (var p = Math.max(0, Math.ceil((l - d) / r)), v = Math.min(n.outHeight, (n.inHeight + l - d) / r), g = 0; g < i; ++g) for (var m = Math.max(0, Math.ceil((c - g) / o)), y = Math.min(n.outWidth, (n.inWidth + c - g) / o), x = 0; x < n.inChannels; ++x) for (var b = 0; b < n.outChannels; ++b) {
      for (var w = 0, C = 0; C < n.batchSize; ++C) for (var E = p; E < v; ++E) for (var R = d + E * r - l, I = m; I < y; ++I) {
        var k = g + I * o - c;
        w += s ? h.get(C, R, k, x) * f.get(C, E, I, b) : h.get(C, x, R, k) * f.get(C, b, E, I);
      }

      u.set(w, d, g, x, b);
    }

    return u.toTensor();
  }, o.prototype.conv3dDerFilter = function (t, e, n) {
    for (var r = n.strideDepth, o = n.strideHeight, a = n.strideWidth, i = n.filterDepth, s = n.filterHeight, u = n.filterWidth, c = er(n.filterShape, "float32"), l = c.values, h = c.strides, f = h[0], d = h[1], p = h[2], v = h[3], g = this.readSync(e.dataId), m = e.strides, y = m[0], x = m[1], b = m[2], w = m[3], C = this.readSync(t.dataId), E = t.strides, R = E[0], I = E[1], k = E[2], S = E[3], A = n.padInfo.front, T = n.padInfo.left, D = n.padInfo.top, N = 0; N < i; ++N) for (var F = Math.max(0, Math.ceil((A - N) / r)), _ = Math.min(n.outDepth, (n.inDepth + A - N) / r), O = N * f, M = 0; M < s; ++M) for (var B = Math.max(0, Math.ceil((D - M) / o)), P = Math.min(n.outHeight, (n.inHeight + D - M) / o), L = M * d + O, W = 0; W < u; ++W) for (var U = Math.max(0, Math.ceil((T - W) / a)), V = Math.min(n.outWidth, (n.inWidth + T - W) / a), z = W * p + L, G = 0; G < n.inChannels; ++G) for (var H = G * v + z, q = 0; q < n.outChannels; ++q) {
      for (var K = 0, j = 0; j < n.batchSize; ++j) for (var X = j * R, Y = j * y, $ = F; $ < _; ++$) for (var Q = (N + $ * r - A) * I + X, J = $ * x + Y, Z = B; Z < P; ++Z) for (var tt = (M + Z * o - D) * k + Q, et = Z * b + J, nt = U; nt < V; ++nt) {
        var rt = nt * w + et;
        K += C[(W + nt * a - T) * S + tt + G] * g[rt + q];
      }

      l[H + q] = K;
    }

    return c.toTensor();
  }, o.prototype.fusedDepthwiseConv2D = function (t) {
    var e = t.input,
        n = t.filter,
        r = t.convInfo,
        o = t.bias,
        a = t.activation,
        i = t.preluActivationWeights,
        s = this.depthwiseConv2D(e, n, r);
    return o && (s = this.add(s, o)), a && (s = gf(this, s, a, i)), s;
  }, o.prototype.depthwiseConv2D = function (t, e, n) {
    df([t, e], "depthwiseConv2D");

    for (var r = n.filterHeight, o = n.filterWidth, a = n.dilationHeight, i = n.dilationWidth, s = n.padInfo.left, u = n.padInfo.top, c = n.outChannels / n.inChannels, l = er(n.outShape, t.dtype), h = this.readSync(t.dataId), f = this.readSync(e.dataId), d = l.values, p = 0; p < n.batchSize; ++p) for (var v = p * t.strides[0], g = p * l.strides[0], m = 0; m < n.outHeight; ++m) for (var y = g + m * l.strides[1], x = m * n.strideHeight - s, b = 0; b < r; ++b) {
      var w = x + b * a;
      if (!(w < 0 || w >= n.inHeight)) for (var C = b * e.strides[0], E = v + w * t.strides[1], R = 0; R < n.outWidth; ++R) for (var I = y + R * l.strides[2], k = R * n.strideWidth - u, S = 0; S < o; ++S) {
        var A = k + S * i;
        if (!(A < 0 || A >= n.inWidth)) for (var T = C + S * e.strides[1], D = E + A * n.inChannels, N = I, F = T, _ = 0; _ < n.inChannels; ++_) {
          for (var O = h[D + _], M = 0; M < c; ++M) d[N + M] += O * f[F + M];

          N += c, F += c;
        }
      }
    }

    return l.toTensor();
  }, o.prototype.depthwiseConv2DDerInput = function (t, e, n) {
    df([t, e], "depthwiseConv2DDerInput");

    for (var r = er(n.inShape, "float32"), o = r.values, a = r.strides, i = a[0], s = a[1], u = a[2], c = this.readSync(t.dataId), l = t.strides, h = l[0], f = l[1], d = l[2], p = this.readSync(e.dataId), v = e.strides, g = v[0], m = v[1], y = v[2], x = n.batchSize, b = n.filterHeight, w = n.filterWidth, C = n.inChannels, E = n.inHeight, R = n.inWidth, I = n.outChannels, k = n.outHeight, S = n.outWidth, A = n.strideHeight, T = n.strideWidth, D = b - 1 - n.padInfo.top, N = w - 1 - n.padInfo.left, F = I / C, _ = 0; _ < x; ++_) for (var O = 0; O < C; ++O) for (var M = 0; M < E; ++M) for (var B = M - D, P = Math.max(0, Math.ceil(B / A)), L = Math.min(k, (b + B) / A), W = 0; W < R; ++W) {
      for (var U = W - N, V = Math.max(0, Math.ceil(U / T)), z = Math.min(S, (w + U) / T), G = 0, H = P; H < L; ++H) for (var q = H * A - B, K = V; K < z; ++K) for (var j = h * _ + f * H + d * K, X = g * (b - 1 - q) + m * (w - 1 - (K * T - U)) + y * O, Y = 0; Y < F; ++Y) {
        G += c[j + (O * F + Y)] * p[X + Y];
      }

      o[i * _ + s * M + u * W + O] = G;
    }

    return r.toTensor();
  }, o.prototype.depthwiseConv2DDerFilter = function (t, e, n) {
    df([t, e], "depthwiseConv2DDerFilter");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = er(n.filterShape, "float32"), u = n.padInfo.left, c = n.padInfo.top, l = n.outChannels / n.inChannels, h = this.bufferSync(t), f = this.bufferSync(e), d = 0; d < a; ++d) for (var p = Math.max(0, Math.ceil((c - d) / r)), v = Math.min(n.outHeight, (n.inHeight + c - d) / r), g = 0; g < i; ++g) for (var m = Math.max(0, Math.ceil((u - g) / o)), y = Math.min(n.outWidth, (n.inWidth + u - g) / o), x = 0; x < n.outChannels; ++x) {
      for (var b = Math.trunc(x / l), w = x % l, C = 0, E = 0; E < n.batchSize; ++E) for (var R = p; R < v; ++R) for (var I = d + R * r - c, k = m; k < y; ++k) {
        var S = g + k * o - u;
        C += h.get(E, I, S, b) * f.get(E, R, k, x);
      }

      s.set(C, d, g, b, w);
    }

    return s.toTensor();
  }, o.prototype.tile = function (t, e) {
    return df(t, "tile"), Va(this.bufferSync(t), e);
  }, o.prototype.pad = function (t, e, n) {
    df(t, "pad");
    var r = e.map(function (e, n) {
      return e[0] + t.shape[n] + e[1];
    }),
        o = e.map(function (t) {
      return t[0];
    }),
        a = this.bufferSync(t),
        i = er(r, t.dtype);
    0 !== n && i.values.fill(n);

    for (var s = 0; s < t.size; s++) {
      var u = a.indexToLoc(s),
          c = u.map(function (t, e) {
        return t + o[e];
      });
      i.set.apply(i, [a.get.apply(a, u)].concat(c));
    }

    return i.toTensor();
  }, o.prototype.gather = function (t, e, n) {
    df([t, e], "gather");
    var r = t.shape.slice(),
        o = this.readSync(e.dataId);
    r[n] = o.length;

    for (var a = er(r, t.dtype), i = this.bufferSync(t), s = 0; s < a.size; ++s) {
      var u = a.indexToLoc(s),
          c = u.slice();
      c[n] = o[u[n]];
      var l = i.locToIndex(c);
      a.values[s] = i.values[l];
    }

    return a.toTensor();
  }, o.prototype.batchToSpaceND = function (t, e, n) {
    df([t], "batchToSpaceND");
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = pr(t.shape, e, r),
        a = vr(o.length, e.length),
        i = gr(t.shape, e, r),
        s = mr(n, e.length),
        u = yr(i, n, e.length);
    return ua(t.reshape(o), a).reshape(i).slice(s, u);
  }, o.prototype.spaceToBatchND = function (t, e, n) {
    df([t], "spaceToBatchND");
    var r = e.reduce(function (t, e) {
      return t * e;
    }),
        o = [[0, 0]];
    o.push.apply(o, n);

    for (var a = 1 + e.length; a < t.shape.length; ++a) o.push([0, 0]);

    var i = t.pad(o),
        s = pr(i.shape, e, r, !1),
        u = vr(s.length, e.length, !1),
        c = gr(i.shape, e, r, !1);
    return ua(i.reshape(s), u).reshape(c);
  }, o.prototype.maxPool = function (t, e) {
    return df(t, "maxPool"), pf(this.readSync(t.dataId), t.shape, t.dtype, t.strides, e, "max").toTensor();
  }, o.prototype.maxPoolBackprop = function (t, e, n, r) {
    df([e, n], "maxPoolBackprop");

    for (var o = this.readSync(e.dataId), a = er(r.outShape, e.dtype, vf(o, e.shape, e.dtype, r).values), i = r.strideHeight, s = r.strideWidth, u = r.dilationHeight, c = r.dilationWidth, l = r.effectiveFilterHeight, h = r.effectiveFilterWidth, f = h - 1 - r.padInfo.left, d = l - 1 - r.padInfo.top, p = er(e.shape, "float32"), v = this.bufferSync(t), g = 0; g < r.batchSize; ++g) for (var m = 0; m < r.inChannels; ++m) for (var y = 0; y < r.inHeight; ++y) for (var x = 0; x < r.inWidth; ++x) {
      for (var b = y - d, w = x - f, C = 0, E = 0; E < l; E += u) {
        var R = (b + E) / i;
        if (!(R < 0 || R >= r.outHeight || Math.floor(R) !== R)) for (var I = 0; I < h; I += c) {
          var k = (w + I) / s;

          if (!(k < 0 || k >= r.outWidth || Math.floor(k) !== k)) {
            var S = l * h - 1 - a.get(g, R, k, m) === E * h + I ? 1 : 0;
            if (0 !== S) C += v.get(g, R, k, m) * S;
          }
        }
      }

      p.set(C, g, y, x, m);
    }

    return p.toTensor();
  }, o.prototype.avgPoolBackprop = function (t, e, n) {
    df([t, e], "avgPoolBackprop");

    for (var r = n.strideHeight, o = n.strideWidth, a = n.filterHeight, i = n.filterWidth, s = n.dilationHeight, u = n.dilationWidth, c = n.effectiveFilterHeight, l = n.effectiveFilterWidth, h = l - 1 - n.padInfo.left, f = c - 1 - n.padInfo.top, d = er(e.shape, "float32"), p = 1 / (a * i), v = this.bufferSync(t), g = 0; g < n.batchSize; ++g) for (var m = 0; m < n.inChannels; ++m) for (var y = 0; y < n.inHeight; ++y) for (var x = 0; x < n.inWidth; ++x) {
      for (var b = y - f, w = x - h, C = 0, E = 0; E < c; E += s) {
        var R = (b + E) / r;
        if (!(R < 0 || R >= n.outHeight || Math.floor(R) !== R)) for (var I = 0; I < l; I += u) {
          var k = (w + I) / o;
          if (!(k < 0 || k >= n.outWidth || Math.floor(k) !== k)) C += v.get(g, R, k, m);
        }
      }

      d.set(C * p, g, y, x, m);
    }

    return d.toTensor();
  }, o.prototype.pool3d = function (t, e, n) {
    df(t, "pool3d");

    for (var r = e.strideDepth, o = e.strideHeight, a = e.strideWidth, i = e.dilationDepth, s = e.dilationHeight, u = e.dilationWidth, c = e.effectiveFilterDepth, l = e.effectiveFilterHeight, h = e.effectiveFilterWidth, f = e.padInfo.front, d = e.padInfo.top, p = e.padInfo.left, v = "max" === n ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY, g = this.readSync(t.dataId), m = er(e.outShape, t.dtype), y = m.values, x = e.outShape[1] * e.outShape[2] * e.outShape[3] * e.outShape[4], b = e.outShape[2] * e.outShape[3] * e.outShape[4], w = e.outShape[3] * e.outShape[4], C = e.outShape[4], E = 0; E < e.batchSize; ++E) for (var R = E * x, I = E * t.strides[0], k = 0; k < e.inChannels; ++k) for (var S = 0; S < e.outDepth; ++S) {
      for (var A = S * r - f, T = A; T < 0;) T += i;

      for (var D = Math.min(e.inDepth, c + A), N = R + S * b, F = 0; F < e.outHeight; ++F) {
        for (var _ = F * o - d, O = _; O < 0;) O += s;

        for (var M = Math.min(e.inHeight, l + _), B = N + F * w, P = 0; P < e.outWidth; ++P) {
          for (var L = P * a - p, W = L; W < 0;) W += u;

          for (var U = Math.min(e.inWidth, h + L), V = B + P * C, z = v, G = 0, H = 0, q = T; q < D; q += i) {
            for (var K = I + q * t.strides[1], j = O; j < M; j += s) {
              for (var X = K + j * t.strides[2], Y = W; Y < U; Y += u) {
                var $ = g[X + Y * t.strides[3] + k];
                if ("max" === n && $ > z ? z = $ : "avg" === n && (G += $, H++), isNaN(z)) break;
              }

              if (isNaN(z)) break;
            }

            if (isNaN(z)) break;
          }

          y[V + k] = "avg" === n ? G / H : z;
        }
      }
    }

    return m.toTensor();
  }, o.prototype.avgPool3d = function (t, e) {
    return df(t, "avgPool3d"), this.pool3d(t, e, "avg").toFloat();
  }, o.prototype.avgPool3dBackprop = function (t, e, n) {
    df([t, e], "avgPool3dBackprop");

    for (var r = n.strideDepth, o = n.strideHeight, a = n.strideWidth, i = n.filterDepth, s = n.filterHeight, u = n.filterWidth, c = n.dilationDepth, l = n.dilationHeight, h = n.dilationWidth, f = n.effectiveFilterDepth, d = n.effectiveFilterHeight, p = n.effectiveFilterWidth, v = f - 1 - n.padInfo.front, g = p - 1 - n.padInfo.left, m = d - 1 - n.padInfo.top, y = er(e.shape, "float32"), x = 1 / (i * s * u), b = this.bufferSync(t), w = 0; w < n.batchSize; ++w) for (var C = 0; C < n.inChannels; ++C) for (var E = 0; E < n.inDepth; ++E) for (var R = 0; R < n.inHeight; ++R) for (var I = 0; I < n.inWidth; ++I) {
      for (var k = E - v, S = R - m, A = I - g, T = 0, D = 0; D < f; D += c) {
        var N = (k + D) / r;
        if (!(N < 0 || N >= n.outDepth || Math.floor(N) !== N)) for (var F = 0; F < d; F += l) {
          var _ = (S + F) / o;

          if (!(_ < 0 || _ >= n.outHeight || Math.floor(_) !== _)) for (var O = 0; O < p; O += h) {
            var M = (A + O) / a;
            if (!(M < 0 || M >= n.outWidth || Math.floor(M) !== M)) T += b.get(w, N, _, M, C);
          }
        }
      }

      y.set(T * x, w, E, R, I, C);
    }

    return y.toTensor();
  }, o.prototype.maxPool3d = function (t, e) {
    return df(t, "maxPool3d"), this.pool3d(t, e, "max").toFloat();
  }, o.prototype.maxPool3dPositions = function (t, e) {
    for (var n = er(e.outShape, "int32"), r = e.strideDepth, o = e.strideHeight, a = e.strideWidth, i = e.dilationDepth, s = e.dilationHeight, u = e.dilationWidth, c = e.effectiveFilterDepth, l = e.effectiveFilterHeight, h = e.effectiveFilterWidth, f = e.padInfo.front, d = e.padInfo.top, p = e.padInfo.left, v = this.bufferSync(t), g = 0; g < e.batchSize; ++g) for (var m = 0; m < e.inChannels; ++m) for (var y = 0; y < e.outDepth; ++y) {
      for (var x = y * r - f, b = x; b < 0;) b += i;

      for (var w = Math.min(e.inDepth, c + x), C = 0; C < e.outHeight; ++C) {
        for (var E = C * o - d, R = E; R < 0;) R += s;

        for (var I = Math.min(e.inHeight, l + E), k = 0; k < e.outWidth; ++k) {
          for (var S = k * a - p, A = S; A < 0;) A += u;

          for (var T = Math.min(e.inWidth, h + S), D = Number.NEGATIVE_INFINITY, N = -1, F = b; F < w; F += i) for (var _ = F - x, O = R; O < I; O += s) for (var M = O - E, B = A; B < T; B += u) {
            var P = B - S,
                L = v.get(g, F, O, B, m);
            L >= D && (D = L, N = _ * l * h + M * l + P);
          }

          n.set(N, g, y, C, k, m);
        }
      }
    }

    return n.toTensor();
  }, o.prototype.maxPool3dBackprop = function (t, e, n, r) {
    df([e, n], "maxPool3dBackprop");

    for (var o = this.maxPool3dPositions(e, r), a = r.strideDepth, i = r.strideHeight, s = r.strideWidth, u = r.dilationDepth, c = r.dilationHeight, l = r.dilationWidth, h = r.effectiveFilterDepth, f = r.effectiveFilterHeight, d = r.effectiveFilterWidth, p = h - 1 - r.padInfo.front, v = d - 1 - r.padInfo.left, g = f - 1 - r.padInfo.top, m = er(e.shape, "float32"), y = this.bufferSync(o), x = this.bufferSync(t), b = 0; b < r.batchSize; ++b) for (var w = 0; w < r.inChannels; ++w) for (var C = 0; C < r.inDepth; ++C) for (var E = 0; E < r.inHeight; ++E) for (var R = 0; R < r.inWidth; ++R) {
      for (var I = C - p, k = E - g, S = R - v, A = 0, T = 0; T < h; T += u) {
        var D = (I + T) / a;
        if (!(D < 0 || D >= r.outDepth || Math.floor(D) !== D)) for (var N = 0; N < f; N += c) {
          var F = (k + N) / i;
          if (!(F < 0 || F >= r.outHeight || Math.floor(F) !== F)) for (var _ = 0; _ < d; _ += l) {
            var O = (S + _) / s;

            if (!(O < 0 || O >= r.outWidth || Math.floor(O) !== O)) {
              var M = h * f * d - 1 - y.get(b, D, F, O, w) === T * f * d + N * d + _ ? 1 : 0;
              if (0 !== M) A += x.get(b, D, F, O, w) * M;
            }
          }
        }
      }

      m.set(A, b, C, E, R, w);
    }

    return m.toTensor();
  }, o.prototype.cast = function (t, e) {
    return Ra(t, e, this);
  }, o.prototype.reshape = function (t, e) {
    return Ia(t, e);
  }, o.prototype.avgPool = function (t, e) {
    return df(t, "avgPool"), df(t, "maxPool"), pf(this.readSync(t.dataId), t.shape, t.dtype, t.strides, e, "avg").toTensor().toFloat();
  }, o.prototype.resizeBilinear = function (t, e, n, r) {
    df(t, "resizeBilinear");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], c = this.readSync(t.dataId), l = new Float32Array(k([a, e, n, u])), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], f = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], d = 0, p = h[0] / f[0], v = h[1] / f[1], g = 0; g < a; g++) for (var m = 0; m < e; m++) for (var y = p * m, x = Math.floor(y), b = y - x, w = Math.min(i - 1, Math.ceil(y)), C = g * t.strides[0] + x * t.strides[1], E = g * t.strides[0] + w * t.strides[1], R = 0; R < n; R++) for (var I = v * R, S = Math.floor(I), A = I - S, T = Math.min(s - 1, Math.ceil(I)), D = C + S * t.strides[2], N = E + S * t.strides[2], F = C + T * t.strides[2], _ = E + T * t.strides[2], O = 0; O < u; O++) {
      var M = c[D + O],
          B = c[N + O],
          P = M + (c[F + O] - M) * A,
          L = P + (B + (c[_ + O] - B) * A - P) * b;
      l[d++] = L;
    }

    return Fn(l, [a, e, n, u]);
  }, o.prototype.resizeBilinearBackprop = function (t, e, n) {
    df([t, e], "resizeBilinearBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, c = u[1], l = u[2], h = new Float32Array(o * a * i * s), f = [n && c > 1 ? a - 1 : a, n && l > 1 ? i - 1 : i], d = [n && c > 1 ? c - 1 : c, n && l > 1 ? l - 1 : l], p = f[0] / d[0], v = f[1] / d[1], g = this.readSync(t.dataId), m = 0, y = 0; y < o; y++) for (var x = y * e.strides[0], b = 0; b < c; b++) for (var w = b * p, C = Math.floor(w), E = Math.min(Math.ceil(w), a - 1), R = x + C * e.strides[1], I = x + E * e.strides[1], k = w - C, S = 1 - k, A = 0; A < l; A++) for (var T = A * v, D = Math.floor(T), N = Math.min(Math.ceil(T), i - 1), F = T - D, _ = 1 - F, O = R + D * e.strides[2], M = R + N * e.strides[2], B = I + D * e.strides[2], P = I + N * e.strides[2], L = S * _, W = S * F, U = k * _, V = k * F, z = 0; z < s; z++) {
      var G = g[m++];
      h[O + z] += G * L, h[M + z] += G * W, h[B + z] += G * U, h[P + z] += G * V;
    }

    return Ln(h, [o, i, a, s], e.dtype);
  }, o.prototype.resizeNearestNeighbor = function (t, e, n, r) {
    df(t, "resizeNearestNeighbor");

    for (var o = t.shape, a = o[0], i = o[1], s = o[2], u = o[3], c = this.readSync(t.dataId), l = new Float32Array(a * e * n * u), h = [r && e > 1 ? i - 1 : i, r && n > 1 ? s - 1 : s], f = [r && e > 1 ? e - 1 : e, r && n > 1 ? n - 1 : n], d = h[0] / f[0], p = h[1] / f[1], v = 0, g = 0; g < a; g++) for (var m = g * t.strides[0], y = 0; y < e; y++) for (var x = d * y, b = m + Math.min(i - 1, r ? Math.round(x) : Math.floor(x)) * t.strides[1], w = 0; w < n; w++) for (var C = p * w, E = b + Math.min(s - 1, r ? Math.round(C) : Math.floor(C)) * t.strides[2], R = 0; R < u; R++) {
      var I = c[E + R];
      l[v++] = I;
    }

    return Fn(l, [a, e, n, u], t.dtype);
  }, o.prototype.resizeNearestNeighborBackprop = function (t, e, n) {
    df([t, e], "resizeNearestNeighborBackprop");

    for (var r = e.shape, o = r[0], a = r[1], i = r[2], s = r[3], u = t.shape, c = u[1], l = u[2], h = new Float32Array(o * a * i * s), f = this.readSync(t.dataId), d = [n && c > 1 ? a - 1 : a, n && l > 1 ? i - 1 : i], p = [n && c > 1 ? c - 1 : c, n && l > 1 ? l - 1 : l], v = d[0] / p[0], g = d[1] / p[1], m = 1 / v, y = 1 / g, x = 2 * Math.ceil(m) + 2, b = 2 * Math.ceil(y) + 2, w = 0; w < o; w++) for (var C = w * e.strides[0], E = 0; E < a; E++) for (var R = C + E * e.strides[1], I = Math.floor(E * m), k = Math.floor(I - x / 2), S = 0; S < i; S++) for (var A = R + S * e.strides[2], T = Math.floor(S * y), D = Math.floor(T - b / 2), N = 0; N < s; N++) {
      for (var F = 0, _ = 0; _ < x; _++) {
        var O = _ + k;

        if (!(O < 0 || O >= c)) {
          var M = C + O * t.strides[1],
              B = O * v;
          if (E === Math.min(a - 1, n ? Math.round(B) : Math.floor(B))) for (var P = 0; P < b; P++) {
            var L = P + D;

            if (!(L < 0 || L >= l)) {
              var W = M + L * t.strides[2],
                  U = L * g;
              S === Math.min(i - 1, n ? Math.round(U) : Math.floor(U)) && (F += f[W + N]);
            }
          }
        }
      }

      h[A + N] = F;
    }

    return Ln(h, e.shape, e.dtype);
  }, o.prototype.batchNormalization = function (t, e, n, r, o, a) {
    df([t, e, n, o, a], "batchNorm");

    for (var i = this.readSync(t.dataId), s = this.readSync(e.dataId), u = this.readSync(n.dataId), c = o ? this.readSync(o.dataId) : new Float32Array([1]), l = a ? this.readSync(a.dataId) : new Float32Array([0]), h = new Float32Array(i.length), f = l.length, d = c.length, p = u.length, v = s.length, g = 0, m = 0, y = 0, x = 0, b = 0; b < i.length; ++b) h[b] = l[g++] + (i[b] - s[m++]) * c[y++] / Math.sqrt(u[x++] + r), g >= f && (g = 0), m >= v && (m = 0), y >= d && (y = 0), x >= p && (x = 0);

    return Ln(h, t.shape);
  }, o.prototype.localResponseNormalization4D = function (t, e, n, r, o) {
    df(t, "localResponseNormalization4D");
    var a = t.shape[3],
        i = a - 1,
        s = this.readSync(t.dataId),
        u = t.size,
        c = new Float32Array(u);

    function l(t) {
      for (var n = t % a, r = t - n + Math.max(0, n - e), o = t - n + Math.min(n + e, i), u = 0; r <= o; r++) {
        var c = s[r];
        u += c * c;
      }

      return u;
    }

    for (var h = 0; h < u; h++) {
      var f = l(h),
          d = s[h] * Math.pow(n + r * f, -o);
      c[h] = d;
    }

    return Ln(c, t.shape);
  }, o.prototype.LRNGrad = function (t, e, n, r, o, a, i) {
    df(t, "LRNGrad");

    for (var s = t.shape[3], u = this.readSync(t.dataId), c = this.readSync(e.dataId), l = this.readSync(n.dataId), h = new Float32Array(t.size), f = t.size, d = 0; d < f; d++) {
      for (var p = d % s, v = d - p + Math.max(0, p - r), g = d - p + Math.min(s, p + r + 1), m = 0, y = v; y < g; y++) m += Math.pow(c[y], 2);

      m = a * m + o;

      for (y = v; y < g; y++) {
        var x = -2 * a * i * c[y] * l[d] / m;
        d === y && (x += Math.pow(m, -i)), x *= u[d], h[y] += x;
      }
    }

    return Ln(h, t.shape);
  }, o.prototype.multinomial = function (t, e, n, r) {
    df(t, "multinomial");

    for (var o = e ? t : ia(t), a = o.shape[0], i = o.shape[1], s = Gn([a, n], "int32"), u = this.readSync(s.dataId), c = this.readSync(o.dataId), l = 0; l < a; ++l) {
      var h = l * i,
          f = new Float32Array(i - 1);
      f[0] = c[h];

      for (var d = 1; d < f.length; ++d) f[d] = f[d - 1] + c[h + d];

      for (var p = Yu(r.toString()), v = l * n, g = 0; g < n; ++g) {
        var m = p();
        u[v + g] = f.length;

        for (var y = 0; y < f.length; y++) if (m < f[y]) {
          u[v + g] = y;
          break;
        }
      }
    }

    return s;
  }, o.prototype.oneHot = function (t, e, n, r) {
    df(t, "oneHot");
    var o = new Float32Array(t.size * e);
    o.fill(r);

    for (var a = this.readSync(t.dataId), i = 0; i < t.size; ++i) a[i] >= 0 && a[i] < e && (o[i * e + a[i]] = n);

    return Bn(o, [t.size, e], "int32");
  }, o.prototype.nonMaxSuppression = function (t, e, n, r, o) {
    return df(t, "nonMaxSuppression"), Oa(this.readSync(t.dataId), this.readSync(e.dataId), n, r, o);
  }, o.prototype.fft = function (t) {
    return this.fftBatch(t, !1);
  }, o.prototype.ifft = function (t) {
    return this.fftBatch(t, !0);
  }, o.prototype.fftBatch = function (t, e) {
    for (var n = t.shape[0], r = t.shape[1], o = er(t.shape, "float32"), a = er(t.shape, "float32"), i = Dn(t).as2D(n, r), s = Nn(t).as2D(n, r), u = 0; u < n; u++) for (var c = i.slice([u, 0], [1, r]), l = s.slice([u, 0], [1, r]), h = Tn(c, l), f = this.readSync(this.fftImpl(h, e).dataId), d = 0; d < r; d++) {
      var p = Ta(f, d);
      o.values[u * r + d] = p.real, a.values[u * r + d] = p.imag;
    }

    return Tn(o.toTensor(), a.toTensor()).as2D(n, r);
  }, o.prototype.fftImpl = function (t, e) {
    var n = t.as1D(),
        r = n.size;

    if (this.isExponentOf2(r)) {
      var o = this.fftRadix2(n, r, e).as2D(t.shape[0], t.shape[1]);
      return e && (o = Tn(Dn(o).div(On(r)), Nn(o).div(On(r)))), o;
    }

    var a = this.readSync(t.dataId),
        i = function (t) {
      for (var e = new Float32Array(t.length / 2), n = new Float32Array(t.length / 2), r = 0; r < t.length; r += 2) e[r / 2] = t[r], n[r / 2] = t[r + 1];

      return {
        real: e,
        imag: n
      };
    }(this.fourierTransformByMatmul(a, r, e));

    return Tn(i.real, i.imag).as2D(t.shape[0], t.shape[1]);
  }, o.prototype.isExponentOf2 = function (t) {
    return 0 == (t & t - 1);
  }, o.prototype.fftRadix2 = function (t, e, n) {
    if (1 === e) return t;

    var r = this.readSync(t.dataId),
        o = e / 2,
        a = function (t) {
      for (var e = Math.ceil(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 0; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        i = Tn(a.real, a.imag).as1D(),
        s = function (t) {
      for (var e = Math.floor(t.length / 4), n = new Float32Array(e), r = new Float32Array(e), o = 2; o < t.length; o += 4) n[Math.floor(o / 4)] = t[o], r[Math.floor(o / 4)] = t[o + 1];

      return {
        real: n,
        imag: r
      };
    }(r),
        u = Tn(s.real, s.imag).as1D();

    i = this.fftRadix2(i, o, n), u = this.fftRadix2(u, o, n);

    var c = function (t, e) {
      for (var n = new Float32Array(t / 2), r = new Float32Array(t / 2), o = 0; o < Math.ceil(t / 2); o++) {
        var a = (e ? 2 : -2) * Math.PI * (o / t);
        n[o] = Math.cos(a), r[o] = Math.sin(a);
      }

      return {
        real: n,
        imag: r
      };
    }(e, n),
        l = Tn(c.real, c.imag).mul(u),
        h = i.add(l),
        f = i.sub(l),
        d = Dn(h).concat(Dn(f)),
        p = Nn(h).concat(Nn(f));

    return Tn(d, p).as1D();
  }, o.prototype.fourierTransformByMatmul = function (t, e, n) {
    for (var r = new Float32Array(2 * e), o = 0; o < e; o++) {
      for (var a = 0, i = 0, s = 0; s < e; s++) {
        var u = Na(o * s, e, n),
            c = Ta(t, s);
        a += c.real * u.real - c.imag * u.imag, i += c.real * u.imag + c.imag * u.real;
      }

      n && (a /= e, i /= e), Da(r, a, i, o);
    }

    return r;
  }, o.prototype.depthToSpace = function (t, e, n) {
    C("NHWC" === n, function () {
      return "Only NHWC dataFormat supported on CPU for depthToSpace. Got " + n;
    }), C(e > 1, function () {
      return "blockSize should be > 1 for depthToSpace, but was: " + e;
    });

    for (var r = t.shape[0], o = t.shape[1], a = t.shape[2], i = t.shape[3], s = o * e, u = a * e, c = i / (e * e), l = this.readSync(t.dataId), h = new Float32Array(r * s * u * c), f = 0, d = 0; d < r; ++d) for (var p = 0; p < s; ++p) for (var v = Math.floor(p / e), g = p % e, m = 0; m < u; ++m) for (var y = Math.floor(m / e), x = (g * e + m % e) * c, b = 0; b < c; ++b) {
      var w = b + x + i * (y + a * (v + o * d));
      h[f++] = l[w];
    }

    return Ln(h, [r, s, u, c]);
  }, o.prototype.broadcastedBinaryOp = function (t, e, n, r) {
    var o = Pr(t.shape, e.shape),
        a = er(o, n),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = Mr(t.shape, o),
        c = Mr(e.shape, o),
        l = a.values;
    if (u.length + c.length === 0) for (var h = 0; h < l.length; ++h) l[h] = r(i[h % i.length], s[h % s.length]);else {
      var f = this.bufferSync(t),
          d = this.bufferSync(e),
          p = function (n) {
        var o = a.indexToLoc(n),
            h = o.slice(-t.rank);
        u.forEach(function (t) {
          return h[t] = 0;
        });
        var p = f.locToIndex(h),
            v = o.slice(-e.rank);
        c.forEach(function (t) {
          return v[t] = 0;
        });
        var g = d.locToIndex(v);
        l[n] = r(i[p], s[g]);
      };

      for (h = 0; h < l.length; ++h) p(h);
    }
    return a.toTensor();
  }, o.prototype.broadcastedBinaryComplexOp = function (t, e, n) {
    var r = Pr(t.shape, e.shape),
        o = er(r, "float32"),
        a = er(r, "float32"),
        i = this.readSync(t.dataId),
        s = this.readSync(e.dataId),
        u = Mr(t.shape, r),
        c = Mr(e.shape, r),
        l = o.values,
        h = a.values;
    if (u.length + c.length === 0) for (var f = 0; f < l.length; f++) {
      var d = f % i.length,
          p = f % s.length,
          v = n(i[2 * d], i[2 * d + 1], s[2 * p], s[2 * p + 1]);
      l[f] = v.real, h[f] = v.imag;
    } else {
      var g = this.bufferSync(this.data.get(t.dataId).complexTensors.real),
          m = this.bufferSync(this.data.get(e.dataId).complexTensors.real),
          y = function (r) {
        var a = o.indexToLoc(r),
            f = a.slice(-t.rank);
        u.forEach(function (t) {
          return f[t] = 0;
        });
        var d = g.locToIndex(f),
            p = a.slice(-e.rank);
        c.forEach(function (t) {
          return p[t] = 0;
        });
        var v = m.locToIndex(p),
            y = n(i[2 * d], i[2 * d + 1], s[2 * v], s[2 * v + 1]);
        l[r] = y.real, h[r] = y.imag;
      };

      for (f = 0; f < l.length; f++) y(f);
    }
    return this.complex(o.toTensor(), a.toTensor());
  }, o.prototype.split = function (t, e, n) {
    return Ua(t, e, n);
  }, o.prototype.dispose = function () {}, o.prototype.floatPrecision = function () {
    return 32;
  }, o.prototype.epsilon = function () {
    return 1e-7;
  }, o.prototype.cropAndResize = function (t, e, n, r, o, a) {
    for (var i = t.shape, s = i[0], u = i[1], c = i[2], l = i[3], h = e.shape[0], f = r[0], d = r[1], p = er([h, f, d, l], "float32"), v = this.readSync(e.dataId), g = this.readSync(n.dataId), m = this.readSync(t.dataId), y = t.strides, x = p.strides, b = 0; b < h; b++) {
      var w = 4 * b,
          C = v[w],
          E = v[w + 1],
          R = v[w + 2],
          I = v[w + 3],
          k = g[b];
      if (!(k >= s)) for (var S = f > 1 ? (R - C) * (u - 1) / (f - 1) : 0, A = d > 1 ? (I - E) * (c - 1) / (d - 1) : 0, T = 0; T < f; T++) {
        var D = f > 1 ? C * (u - 1) + T * S : .5 * (C + R) * (u - 1);
        if (D < 0 || D > u - 1) for (var N = 0; N < d; N++) for (var F = 0; F < l; F++) {
          var _ = F + N * x[2] + T * x[1] + b * x[0];

          p.values[_] = a;
        } else if ("bilinear" === o) {
          var O = Math.floor(D),
              M = Math.ceil(D),
              B = D - O;

          for (N = 0; N < d; N++) {
            if ((q = d > 1 ? E * (c - 1) + N * A : .5 * (E + I) * (c - 1)) < 0 || q > c - 1) for (F = 0; F < l; F++) {
              _ = F + N * x[2] + T * x[1] + b * x[0];
              p.values[_] = a;
            } else {
              var P = Math.floor(q),
                  L = Math.ceil(q),
                  W = q - P;

              for (F = 0; F < l; F++) {
                var U = m[_ = F + P * y[2] + O * y[1] + k * y[0]],
                    V = m[_ = F + L * y[2] + O * y[1] + k * y[0]],
                    z = m[_ = F + P * y[2] + M * y[1] + k * y[0]],
                    G = U + (V - U) * W,
                    H = z + (m[_ = F + L * y[2] + M * y[1] + k * y[0]] - z) * W;
                _ = F + N * x[2] + T * x[1] + b * x[0], p.values[_] = G + (H - G) * B;
              }
            }
          }
        } else for (N = 0; N < d; ++N) {
          var q;
          if ((q = d > 1 ? E * (c - 1) + N * A : .5 * (E + I) * (c - 1)) < 0 || q > c - 1) for (F = 0; F < l; F++) {
            _ = F + N * x[2] + T * x[1] + b * x[0];
            p.values[_] = a;
          } else {
            var K = Math.round(q),
                j = Math.round(D);

            for (F = 0; F < l; F++) {
              var X = F + K * y[2] + j * y[1] + k * y[0],
                  Y = F + N * x[2] + T * x[1] + b * x[0];
              p.values[Y] = m[X];
            }
          }
        }
      }
    }

    return p.toTensor();
  }, o.prototype.sparseToDense = function (t, e, n, r) {
    var o = Go(0, t, n),
        a = o.sliceRank,
        i = o.numUpdates,
        s = o.sliceSize,
        u = o.strides,
        c = o.outputSize;
    return this.scatter(t, e, n, c, s, i, a, u, r, !1);
  }, o.prototype.gatherND = function (t, e) {
    var n = e.shape,
        r = n[n.length - 1],
        o = Po(t, e),
        a = o[0],
        i = o[1],
        s = o[2],
        u = o[3];
    if (0 === i) return Fn([], a, t.dtype);

    for (var c = new mt([i, s], t.dtype), l = this.readSync(e.dataId), h = this.readSync(t.dataId), f = 0; f < i; f++) {
      for (var d = [], p = 0, v = 0; v < r; v++) {
        var g = l[f * r + v];
        p += g * u[v], d.push(g);
      }

      if (p < 0 || p >= t.size / s) throw new Error("Invalid indices: " + d + " does not index into " + t.shape);

      for (var m = 0; m < s; m++) c.values[f * s + m] = h[p * s + m];
    }

    return c.toTensor().reshape(a);
  }, o.prototype.scatterND = function (t, e, n) {
    var r = Go(0, t, n),
        o = r.sliceRank,
        a = r.numUpdates,
        i = r.sliceSize,
        s = r.strides,
        u = r.outputSize,
        c = On(0);
    return this.scatter(t, e, n, u, i, a, o, s, c, !0);
  }, o.prototype.fill = function (t, e, n) {
    var r = P(n = n || j(e), k(t));
    return r.fill(e), Lt.makeTensor(r, t, n, this);
  }, o.prototype.onesLike = function (t) {
    if ("string" === t.dtype) throw new Error("onesLike is not supported for string tensors");
    return this.fill(t.shape, 1, t.dtype);
  }, o.prototype.zerosLike = function (t) {
    var e = P(t.dtype, k(t.shape));
    return this.makeOutput(e, t.shape, t.dtype);
  }, o.prototype.linspace = function (t, e, n) {
    return ka(t, e, n);
  }, o.prototype.scatter = function (t, e, n, r, o, a, i, s, u, c) {
    var l = [r / o, o],
        h = this.readSync(t.dataId),
        f = this.readSync(e.dataId);
    if (0 === r) return Fn([], n, e.dtype);
    var d = new mt(l, e.dtype);
    d.values.fill(this.readSync(u.dataId)[0]);

    for (var p = 0; p < a; p++) {
      for (var v = [], g = 0, m = 0; m < i; m++) {
        var y = h[p * i + m];
        v.push(y), g += y * s[m];
      }

      if (g < 0 || g >= r / o) throw new Error("Invalid indices: " + v + " does not index into " + n);

      for (var x = 0; x < o; x++) c ? d.values[g * o + x] += f[p * o + x] : d.values[g * o + x] = 0 === e.rank ? f[0] : f[p * o + x];
    }

    return d.toTensor().reshape(n);
  }, o;
}(la);

function yf(t, e) {
  return {
    kernelName: t,
    backendName: "cpu",
    kernelFunc: function (n) {
      var r = n.inputs,
          o = n.backend,
          a = r,
          i = a.a,
          s = a.b,
          u = o;
      df([i, s], t);
      var c = u.data.get(i.dataId).values,
          l = u.data.get(s.dataId).values,
          h = e(i.shape, s.shape, c, l, i.dtype),
          f = h[0],
          d = h[1];
      return {
        dataId: u.write(f, d, i.dtype),
        shape: d,
        dtype: i.dtype
      };
    }
  };
}

function xf(t) {
  return function (e, n, r, o, a) {
    var i = Pr(e, n),
        s = i.length,
        u = $(i),
        c = B(a, k(i)),
        l = e.length,
        h = n.length,
        f = $(e),
        d = $(n),
        p = Mr(e, i),
        v = Mr(n, i);
    if (p.length + v.length === 0) for (var g = 0; g < c.length; ++g) c[g] = t(r[g % r.length], o[g % o.length]);else {
      var m = function (e) {
        var n = it(e, s, u),
            a = n.slice(-l);
        p.forEach(function (t) {
          return a[t] = 0;
        });
        var i = at(a, l, f),
            g = n.slice(-h);
        v.forEach(function (t) {
          return g[t] = 0;
        });
        var m = at(g, h, d);
        c[e] = t(r[i], o[m]);
      };

      for (g = 0; g < c.length; ++g) m(g);
    }
    return [c, i];
  };
}

Lt.registerBackend("cpu", function () {
  return new mf();
}, 1);
var bf = xf(function (t, e) {
  return t / e;
}),
    wf = yf(wr, bf);
var Cf = {
  kernelName: "MaxPoolWithArgmax",
  backendName: "cpu",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.attrs,
        r = t.backend,
        o = e.x,
        a = n,
        i = a.filterSize,
        s = a.strides,
        u = a.pad,
        c = a.includeBatchInIndex,
        l = r;
    df(o, "MaxPoolWithArgmax");

    var h = l.data.get(o.dataId).values,
        f = fa(o.shape, i, s, [1, 1], u),
        d = function (t, e, n, r, o) {
      var a = pf(t, 0, n, $(e), o, "max"),
          i = vf(t, e, n, o, !0, r);
      return [a.values, i.values];
    }(h, o.shape, o.dtype, c, f),
        p = d[0],
        v = d[1],
        g = l.write(p, f.outShape, o.dtype),
        m = l.write(v, f.outShape, o.dtype);

    return [{
      dataId: g,
      shape: f.outShape,
      dtype: o.dtype
    }, {
      dataId: m,
      shape: f.outShape,
      dtype: "int32"
    }];
  }
},
    Ef = {
  kernelName: "NonMaxSuppressionV5",
  backendName: "cpu",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = t.attrs,
        o = e,
        a = o.boxes,
        i = o.scores,
        s = r,
        u = s.maxOutputSize,
        c = s.iouThreshold,
        l = s.scoreThreshold,
        h = s.softNmsSigma,
        f = n;
    df(a, "NonMaxSuppressionWithScore");
    var d = Ma(f.data.get(a.dataId).values, f.data.get(i.dataId).values, u, c, l, h);
    return [d.selectedIndices, d.selectedScores];
  }
},
    Rf = {
  kernelName: "Square",
  backendName: "cpu",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = e.x,
        o = n;
    df(r, "square");

    for (var a = o.data.get(r.dataId).values, i = new Float32Array(a.length), s = 0; s < a.length; ++s) {
      var u = a[s];
      i[s] = u * u;
    }

    return {
      dataId: o.write(i, r.shape, r.dtype),
      shape: r.shape,
      dtype: r.dtype
    };
  }
},
    If = xf(function (t, e) {
  var n = t - e;
  return n * n;
});

function kf(t, e, n, r, o) {
  for (var a = k(e), i = e.length, s = $(e), u = $(o), c = B(n, k(o)), l = 0; l < a; ++l) {
    for (var h = it(l, i, s), f = new Array(h.length), d = 0; d < f.length; d++) f[d] = h[r[d]];

    c[at(f, i, u)] = t[l];
  }

  return c;
}

for (var Sf = 0, Af = [Ef, Rf, yf(Er, If), wf, {
  kernelName: "Transpose",
  backendName: "cpu",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.attrs,
        r = t.backend,
        o = e.x,
        a = n.perm,
        i = r;
    df(o, "transpose");

    for (var s = o.shape.length, u = new Array(s), c = 0; c < u.length; c++) u[c] = o.shape[a[c]];

    var l = kf(i.data.get(o.dataId).values, o.shape, o.dtype, a, u);
    return {
      dataId: i.write(l, u, o.dtype),
      shape: u,
      dtype: o.dtype
    };
  }
}, Cf]; Sf < Af.length; Sf++) {
  d(Af[Sf]);
}

var Tf,
    Df = function (t) {
  this.variableNames = ["A"];
  var e = Ya(),
      n = t[0],
      r = t[1];
  this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(" + r + ".0, " + n + ".0);\n\n        vec4 values = " + e.texture2D + "(A, uv);\n        float value;\n        if (depth == 0) {\n          value = values.r;\n        } else if (depth == 1) {\n          value = values.g;\n        } else if (depth == 2) {\n          value = values.b;\n        } else if (depth == 3) {\n          value = values.a;\n        }\n\n        setOutput(floor(value * 255.0 + 0.5));\n      }\n    ";
},
    Nf = function (t) {
  this.variableNames = ["A"], this.packedInputs = !1, this.packedOutput = !0;
  var e = Ya(),
      n = t[0],
      r = t[1];
  this.outputShape = t, this.userCode = "\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int texR = coords[0];\n        int texC = coords[1];\n        int depth = coords[2];\n\n        vec4 result = vec4(0.);\n\n        for(int row=0; row<=1; row++) {\n          for(int col=0; col<=1; col++) {\n            texC = coords[1] + row;\n            depth = coords[2] + col;\n\n            vec2 uv = (vec2(texC, texR) + halfCR) /\n                       vec2(" + r + ".0, " + n + ".0);\n            vec4 values = " + e.texture2D + "(A, uv);\n            float value;\n            if (depth == 0) {\n              value = values.r;\n            } else if (depth == 1) {\n              value = values.g;\n            } else if (depth == 2) {\n              value = values.b;\n            } else if (depth == 3) {\n              value = values.a;\n            }\n\n            result[row * 2 + col] = floor(value * 255.0 + 0.5);\n          }\n        }\n\n        " + e.output + " = result;\n      }\n    ";
};

var Ff = function (t, e) {
  this.variableNames = ["A"];

  for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

  this.outputShape = n, this.rank = n.length;

  var o = ui(this.rank),
      a = function (t) {
    var e = t.length;
    if (e > 6) throw Error("Transpose for rank " + e + " is not yet supported");

    for (var n = ["resRC.x", "resRC.y", "resRC.z", "resRC.w", "resRC.u", "resRC.v"], r = new Array(e), o = 0; o < t.length; o++) r[t[o]] = n[o];

    return r.join();
  }(e);

  this.userCode = "\n    void main() {\n      " + o + " resRC = getOutputCoords();\n      setOutput(getA(" + a + "));\n    }\n    ";
};

var _f = function (t, e) {
  this.variableNames = ["A"], this.packedInputs = !0, this.packedOutput = !0;

  for (var n = new Array(t.length), r = 0; r < n.length; r++) n[r] = t[e[r]];

  if (this.outputShape = n, this.rank = n.length, this.rank > 6) throw Error("Packed transpose for rank " + this.rank + " is not yet supported.");
  var o = ui(this.rank),
      a = ja("rc", this.rank),
      i = new Array(this.rank);

  for (r = 0; r < e.length; r++) i[e[r]] = a[r];

  var s = "vec2(" + i.slice(-2).join() + ")",
      u = "++" + a[this.rank - 1] + " < " + n[this.rank - 1],
      c = "getChannel(getA(" + i.join() + "), " + s + ")";
  this.userCode = "\n    void main() {\n      " + o + " rc = getOutputCoords();\n      vec4 result = vec4(0.);\n      result[0] = " + c + ";\n      if(" + u + ") {\n        result[1] = " + c + ";\n      }\n      --" + a[this.rank - 1] + ";\n      if(++" + a[this.rank - 2] + " < " + n[this.rank - 2] + ") {\n        result[2] = " + c + ";\n        if(" + u + ") {\n          result[3] = " + c + ";\n        }\n      }\n      setOutput(result);\n    }\n    ";
};

for (var Of = 0, Mf = [{
  kernelName: "FromPixels",
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = t.attrs,
        o = e.pixels,
        a = r.numChannels,
        s = "undefined" != typeof HTMLVideoElement && o instanceof HTMLVideoElement,
        u = "undefined" != typeof HTMLImageElement && o instanceof HTMLImageElement,
        c = s ? [o.videoWidth, o.videoHeight] : [o.width, o.height],
        l = c[0],
        h = c[1],
        f = [h, l],
        d = [h, l, a];
    (u || s) && (null == Tf && (Tf = document.createElement("canvas").getContext("2d")), Tf.canvas.width = l, Tf.canvas.height = h, Tf.drawImage(o, 0, 0, l, h), o = Tf.canvas);
    var p = n.makeTensorInfo(f, "int32");
    n.texData.get(p.dataId).usage = zt.PIXELS, n.gpgpu.uploadPixelDataToTexture(n.getTexture(p.dataId), o);
    var v = i().getBool("WEBGL_PACK") ? new Nf(d) : new Df(d),
        g = n.runWebGLProgram(v, [p], "int32");
    return n.disposeData(p.dataId), g;
  }
}, {
  kernelName: wr,
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = e;
    return function (t, e, n) {
      var r = new Ri(Ci, t.shape, e.shape);
      return i().getBool("WEBGL_PACK_BINARY_OPERATIONS") && (r = new Si(Ii, t.shape, e.shape, !0)), n.runWebGLProgram(r, [t, e], "float32");
    }(r.a, r.b, n);
  }
}, {
  kernelName: "NonMaxSuppressionV5",
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = t.attrs;
    dn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");
    var o = e,
        a = o.boxes,
        i = o.scores,
        s = r,
        u = s.maxOutputSize,
        c = s.iouThreshold,
        l = s.scoreThreshold,
        h = s.softNmsSigma,
        f = n,
        d = Ma(f.readSync(a.dataId), f.readSync(i.dataId), u, c, l, h);
    return [d.selectedIndices, d.selectedScores];
  }
}, {
  kernelName: "Square",
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = e.x,
        o = n,
        a = new cu(r.shape, "return x * x;");
    return o.runWebGLProgram(a, [r], r.dtype);
  }
}, {
  kernelName: Er,
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.backend,
        r = e,
        o = r.a,
        a = r.b,
        s = n,
        u = i().getBool("WEBGL_PACK_BINARY_OPERATIONS") ? new Si("return (a - b) * (a - b);", o.shape, a.shape) : new Ri("return (a - b) * (a - b);", o.shape, a.shape);
    return s.compileAndRun(u, [o, a]);
  }
}, {
  kernelName: "Transpose",
  backendName: "webgl",
  kernelFunc: function (t) {
    for (var e, n = t.inputs, r = t.attrs, o = t.backend, a = n.x, s = r.perm, u = o, c = a.shape.length, l = new Array(c), h = 0; h < l.length; h++) l[h] = a.shape[s[h]];

    if (u.shouldExecuteOnCPU([a])) {
      var f = kf(u.texData.get(a.dataId).values, a.shape, a.dtype, s, l);
      e = u.makeTensorInfo(l, a.dtype), u.texData.get(e.dataId).values = f;
    } else e = function (t, e, n) {
      var r = i().getBool("WEBGL_PACK_ARRAY_OPERATIONS") ? new _f(t.shape, e) : new Ff(t.shape, e);
      return n.runWebGLProgram(r, [t], t.dtype);
    }(a, s, u);

    return e;
  }
}, {
  kernelName: "MaxPoolWithArgmax",
  backendName: "webgl",
  kernelFunc: function (t) {
    var e = t.inputs,
        n = t.attrs,
        r = t.backend,
        o = e.x,
        a = n,
        i = a.filterSize,
        s = a.strides,
        u = a.pad,
        c = a.includeBatchInIndex,
        l = r;
    C(4 === o.shape.length, function () {
      return "Error in maxPool: input must be rank 4 but got rank " + o.shape.length + ".";
    });
    var h = [1, 1];
    C(Ca(s, h), function () {
      return "Error in maxPool: Either strides or dilations must be 1. Got strides " + s + " and dilations '" + h + "'";
    });

    var f = fa(o.shape, i, s, h, u),
        d = function (t, e, n, r) {
      var o = new Ws(n, "max", !1),
          a = r.runWebGLProgram(o, [t], "float32");
      return o = new Ws(n, "max", !0, !0, e), [a, r.runWebGLProgram(o, [t], "float32")];
    }(o, c, f, l);

    return [d[0], d[1]];
  }
}]; Of < Mf.length; Of++) {
  d(Mf[Of]);
}

for (var Bf = 0, Pf = [{
  kernelName: xr,
  inputsToSave: ["a", "b"],
  gradFunc: function (t, e) {
    var n = e[0],
        r = e[1],
        o = Pr(n.shape, r.shape);
    return {
      a: function () {
        var e = t,
            r = Br(n.shape, o);
        return r.length > 0 && (e = e.sum(r)), e.reshape(n.shape);
      },
      b: function () {
        var e = t,
            n = Br(r.shape, o);
        return n.length > 0 && (e = e.sum(n)), e.reshape(r.shape);
      }
    };
  }
}, {
  kernelName: "AddN",
  saveAllInputs: !0,
  gradFunc: function (t, e) {
    var n = {};
    return e.forEach(function (e, r) {
      n[r] = function () {
        return t.clone();
      };
    }), n;
  }
}, {
  kernelName: Sr,
  gradFunc: function (t, e, n) {
    for (var r = n, o = r.inputShape, a = r.shape, i = Array.from(a), s = o.length - 1; s >= 0; s--) if (o[s] === a[s]) i[s] = 1;else if (1 !== o[s]) throw new Error("broadcastTo(): [" + o + "] cannot be broadcast to [" + a + "].");

    var u = [];

    for (s = 0; s < i.length; s++) i[s] > 1 && u.push(s);

    return {
      x: function () {
        return t.sum(u, !0);
      }
    };
  }
}, {
  kernelName: wr,
  inputsToSave: ["a", "b"],
  gradFunc: function (t, e) {
    var n = e[0],
        r = e[1],
        o = Pr(n.shape, r.shape);
    return {
      a: function () {
        var e = Bo(t, r.toFloat()),
            a = Br(n.shape, o);
        return a.length > 0 ? th(e, a).reshape(n.shape) : e;
      },
      b: function () {
        var e = t.mul(n.toFloat()),
            a = Br(r.shape, o);
        a.length > 0 && (e = th(e, a).reshape(r.shape));
        var i = Gc(r);
        return no(Bo(e, i.toFloat()));
      }
    };
  }
}, {
  kernelName: "FusedBatchNorm",
  inputsToSave: ["x", "mean", "variance", "scale"],
  gradFunc: function (t, e, n) {
    var r = n.varianceEpsilon,
        o = e[0],
        a = e[1],
        i = e[2],
        s = e[3],
        u = Ju(o),
        c = null == s ? On(1) : s,
        l = Br(a.shape, u.shape),
        h = [];

    if (1 === a.rank) {
      for (var f = 0; f < u.shape.length - 1; ++f) h.push(u.shape[f]);

      h.push(1);
    }

    var d = Oo(o, a),
        p = To(t, c),
        v = ao(Or(i, On(r))),
        g = To(To(To(v, v), v), On(-.5));
    return {
      x: function () {
        return 1 === a.rank ? ur(To(To(t, wc(v.as4D(1, 1, 1, a.shape[0]), h)), c), o.shape) : ur(To(To(t, v), c), o.shape);
      },
      mean: function () {
        var t = To(To(v, On(-1)), p);
        return 1 === a.rank && (t = th(t, l)), ur(t, a.shape);
      },
      variance: function () {
        var t = To(To(g, d), p);
        return 1 === a.rank && (t = th(t, l)), ur(t, a.shape);
      },
      scale: function () {
        var e = To(d, v),
            n = To(t, e);
        return 1 === a.rank && (n = th(n, l)), ur(n, a.shape);
      },
      offset: function () {
        var e = t;
        return 1 === a.rank && (e = th(e, l)), ur(e, a.shape);
      }
    };
  }
}, {
  kernelName: Tr,
  gradFunc: function (t) {
    return {
      x: function () {
        return t.toFloat();
      }
    };
  }
}, {
  kernelName: Ar,
  inputsToSave: ["indices"],
  gradFunc: function (t, e) {
    var n = e[0];
    return {
      indices: function () {
        return Gn(n.shape, "float32");
      }
    };
  }
}, {
  kernelName: Nr,
  inputsToSave: ["x"],
  gradFunc: function (t, e, n) {
    var r = e[0],
        o = n.paddings.map(function (t) {
      return t[0];
    });
    return {
      x: function () {
        return t.slice(o, r.shape);
      }
    };
  }
}, {
  kernelName: "Square",
  inputsToSave: ["x"],
  gradFunc: function (t, e) {
    var n = e[0];
    return {
      x: function () {
        return t.mul(n.toFloat().mul(2));
      }
    };
  }
}, {
  kernelName: Er,
  inputsToSave: ["a", "b"],
  gradFunc: function (t, e) {
    var n = e[0],
        r = e[1],
        o = On(2);
    return {
      a: function () {
        return To(t, To(o, Oo(n, r)));
      },
      b: function () {
        return To(t, To(o, Oo(r, n)));
      }
    };
  }
}, {
  kernelName: Dr,
  inputsToSave: ["x"],
  gradFunc: function (t, e, n) {
    var r = e[0],
        o = n.reps;
    return {
      x: function () {
        var e = Xn(r);
        if (1 === r.rank) for (var n = 0; n < o[0]; ++n) e = e.add(t.slice([n * r.shape[0]], [r.shape[0]]));else if (2 === r.rank) for (n = 0; n < o[0]; ++n) for (var a = 0; a < o[1]; ++a) e = e.add(t.slice([n * r.shape[0], a * r.shape[1]], [r.shape[0], r.shape[1]]));else if (3 === r.rank) for (n = 0; n < o[0]; ++n) for (a = 0; a < o[1]; ++a) for (var i = 0; i < o[2]; ++i) e = e.add(t.slice([n * r.shape[0], a * r.shape[1], i * r.shape[2]], [r.shape[0], r.shape[1], r.shape[2]]));else {
          if (4 !== r.rank) throw new Error("Gradient for tile operation is not implemented for rank-" + r.rank + " tensors yet.");

          for (n = 0; n < o[0]; ++n) for (a = 0; a < o[1]; ++a) for (i = 0; i < o[2]; ++i) for (var s = 0; s < o[3]; ++s) e = e.add(t.slice([n * r.shape[0], a * r.shape[1], i * r.shape[2], s * r.shape[3]], [r.shape[0], r.shape[1], r.shape[2], r.shape[3]]));
        }
        return e;
      }
    };
  }
}, {
  kernelName: "Transpose",
  gradFunc: function (t, e, n) {
    var r = Rn(n.perm);
    return {
      x: function () {
        return ua(t, r);
      }
    };
  }
}]; Bf < Pf.length; Bf++) {
  p(Pf[Bf]);
}

var Lf = function () {
  function t() {}

  return t.prototype.fetch = function (t, e) {
    return fetch(t, e);
  }, t.prototype.now = function () {
    return performance.now();
  }, t.prototype.encode = function (t, e) {
    if ("utf-8" !== e && "utf8" !== e) throw new Error("Browser's encoder only supports utf-8, but got " + e);
    return null == this.textEncoder && (this.textEncoder = new TextEncoder()), this.textEncoder.encode(t);
  }, t.prototype.decode = function (t, e) {
    return new TextDecoder(e).decode(t);
  }, t;
}();

i().get("IS_BROWSER") && i().setPlatform("browser", new Lf());

var Wf,
    Uf = function () {
  return require("node-fetch");
},
    Vf = function () {
  function t() {
    this.util = require("util"), this.textEncoder = new this.util.TextEncoder();
  }

  return t.prototype.fetch = function (t, e) {
    return null != i().global.fetch ? i().global.fetch(t, e) : (null == Wf && (Wf = Uf()), Wf(t, e));
  }, t.prototype.now = function () {
    var t = process.hrtime();
    return 1e3 * t[0] + t[1] / 1e6;
  }, t.prototype.encode = function (t, e) {
    if ("utf-8" !== e && "utf8" !== e) throw new Error("Node built-in encoder only supports utf-8, but got " + e);
    return this.textEncoder.encode(t);
  }, t.prototype.decode = function (t, e) {
    return 0 === t.length ? "" : new this.util.TextDecoder(e).decode(t);
  }, t;
}();

i().get("IS_NODE") && i().setPlatform("node", new Vf());
var zf = {
  float32: 4,
  int32: 4,
  uint16: 2,
  uint8: 1,
  bool: 1
},
    Gf = 4;

function Hf(t, e) {
  for (var n = {}, r = 0, o = function (e) {
    var o = e.name,
        a = e.dtype,
        i = e.shape,
        s = k(i),
        u = void 0;

    if (("quantization" in e)) {
      var c = e.quantization;
      if ("uint8" !== c.dtype && "uint16" !== c.dtype) throw new Error("Weight " + e.name + " has unknown quantization dtype " + c.dtype + ". Supported quantization dtypes are: 'uint8' and 'uint16'.");
      var l = zf[c.dtype],
          h = t.slice(r, r + s * l),
          f = "uint8" === c.dtype ? new Uint8Array(h) : new Uint16Array(h);
      if ("float32" === a) u = Float32Array.from(f, function (t) {
        return t * c.scale + c.min;
      });else {
        if ("int32" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = Int32Array.from(f, function (t) {
          return Math.round(t * c.scale + c.min);
        });
      }
      r += s * l;
    } else if ("string" === a) {
      var d = k(e.shape);
      u = [];

      for (var p = 0; p < d; p++) {
        var v = new Uint32Array(t.slice(r, r + Gf))[0];
        r += Gf;
        var g = new Uint8Array(t.slice(r, r + v));
        u.push(g), r += v;
      }
    } else {
      var m = zf[a];
      h = t.slice(r, r + s * m);
      if ("float32" === a) u = new Float32Array(h);else if ("int32" === a) u = new Int32Array(h);else {
        if ("bool" !== a) throw new Error("Unsupported dtype in weight '" + o + "': " + a);
        u = new Uint8Array(h);
      }
      r += s * m;
    }

    n[o] = Fn(u, i, a);
  }, a = 0, i = e; a < i.length; a++) {
    o(i[a]);
  }

  return n;
}

function qf(t) {
  if (null === t) throw new Error("Invalid input value: " + JSON.stringify(t));
  var e = 0,
      n = [];
  t.forEach(function (t) {
    if (e += t.byteLength, n.push(t.byteLength === t.buffer.byteLength ? t : new t.constructor(t)), !(t instanceof Float32Array || t instanceof Int32Array || t instanceof Uint8Array)) throw new Error("Unsupported TypedArray subtype: " + t.constructor.name);
  });
  var r = new Uint8Array(e),
      o = 0;
  return n.forEach(function (t) {
    r.set(new Uint8Array(t.buffer), o), o += t.byteLength;
  }), r.buffer;
}

var Kf = "undefined" != typeof Buffer && ("undefined" == typeof Blob || "undefined" == typeof atob || "undefined" == typeof btoa);

function jf(t) {
  return Kf ? Buffer.byteLength(t) : new Blob([t]).size;
}

function Xf(t) {
  var e = 0;
  t.forEach(function (t) {
    e += t.byteLength;
  });
  var n = new Uint8Array(e),
      r = 0;
  return t.forEach(function (t) {
    n.set(new Uint8Array(t), r), r += t.byteLength;
  }), n.buffer;
}

function Yf(t) {
  for (t = t.trim(); t.endsWith("/");) t = t.slice(0, t.length - 1);

  var e = t.split("/");
  return e[e.length - 1];
}

function $f(t) {
  if (t.modelTopology instanceof ArrayBuffer) throw new Error("Expected JSON model topology, received ArrayBuffer.");
  return {
    dateSaved: new Date(),
    modelTopologyType: "JSON",
    modelTopologyBytes: null == t.modelTopology ? 0 : jf(JSON.stringify(t.modelTopology)),
    weightSpecsBytes: null == t.weightSpecs ? 0 : jf(JSON.stringify(t.weightSpecs)),
    weightDataBytes: null == t.weightData ? 0 : t.weightData.byteLength
  };
}

var Qf = function () {
  function t() {
    this.saveRouters = [], this.loadRouters = [];
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerSaveRouter = function (e) {
    t.getInstance().saveRouters.push(e);
  }, t.registerLoadRouter = function (e) {
    t.getInstance().loadRouters.push(e);
  }, t.getSaveHandlers = function (e) {
    return t.getHandlers(e, "save");
  }, t.getLoadHandlers = function (e, n) {
    return t.getHandlers(e, "load", n);
  }, t.getHandlers = function (e, n, r) {
    var o = [];
    return ("load" === n ? t.getInstance().loadRouters : t.getInstance().saveRouters).forEach(function (t) {
      var n = t(e, r);
      null !== n && o.push(n);
    }), o;
  }, t;
}(),
    Jf = "://",
    Zf = function () {
  function t() {
    this.managers = {};
  }

  return t.getInstance = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.registerManager = function (e, n) {
    C(null != e, function () {
      return "scheme must not be undefined or null.";
    }), e.endsWith(Jf) && (e = e.slice(0, e.indexOf(Jf))), C(e.length > 0, function () {
      return "scheme must not be an empty string.";
    });
    var r = t.getInstance();
    C(null == r.managers[e], function () {
      return "A model store manager is already registered for scheme '" + e + "'.";
    }), r.managers[e] = n;
  }, t.getManager = function (t) {
    var e = this.getInstance().managers[t];
    if (null == e) throw new Error("Cannot find model manager for scheme '" + t + "'");
    return e;
  }, t.getSchemes = function () {
    return Object.keys(this.getInstance().managers);
  }, t;
}();

function td(t) {
  if (-1 === t.indexOf(Jf)) throw new Error("The url string provided does not contain a scheme. Supported schemes are: " + Zf.getSchemes().join(","));
  return {
    scheme: t.split(Jf)[0],
    path: t.split(Jf)[1]
  };
}

function ed(t, e, o) {
  return void 0 === o && (o = !1), n(this, void 0, void 0, function () {
    var n, a, i, s, u, c, l, h, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return C(t !== e, function () {
            return "Old path and new path are the same: '" + t + "'";
          }), C((n = Qf.getLoadHandlers(t)).length > 0, function () {
            return "Copying failed because no load handler is found for source URL " + t + ".";
          }), C(n.length < 2, function () {
            return "Copying failed because more than one (" + n.length + ") load handlers for source URL " + t + ".";
          }), a = n[0], C((i = Qf.getSaveHandlers(e)).length > 0, function () {
            return "Copying failed because no save handler is found for destination URL " + e + ".";
          }), C(i.length < 2, function () {
            return "Copying failed because more than one (" + n.length + ") save handlers for destination URL " + e + ".";
          }), s = i[0], u = td(t).scheme, c = td(t).path, l = u === td(t).scheme, [4, a.load()];

        case 1:
          return h = r.sent(), o && l ? [4, Zf.getManager(u).removeModel(c)] : [3, 3];

        case 2:
          r.sent(), r.label = 3;

        case 3:
          return [4, s.save(h)];

        case 4:
          return f = r.sent(), !o || l ? [3, 6] : [4, Zf.getManager(u).removeModel(c)];

        case 5:
          r.sent(), r.label = 6;

        case 6:
          return [2, f.modelArtifactsInfo];
      }
    });
  });
}

var nd = "models_store",
    rd = "model_info_store";

function od() {
  if (!i().getBool("IS_BROWSER")) throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");
  var t = window || self,
      e = t.indexedDB || t.mozIndexedDB || t.webkitIndexedDB || t.msIndexedDB || t.shimIndexedDB;
  if (null == e) throw new Error("The current browser does not appear to support IndexedDB.");
  return e;
}

function ad(t) {
  var e = t.result;
  e.createObjectStore(nd, {
    keyPath: "modelPath"
  }), e.createObjectStore(rd, {
    keyPath: "modelPath"
  });
}

var id = function () {
  function t(t) {
    if (this.indexedDB = od(), null == t || !t) throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");
    this.modelPath = t;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        return [2, this.databaseAction(this.modelPath, t)];
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return [2, this.databaseAction(this.modelPath)];
      });
    });
  }, t.prototype.databaseAction = function (t, e) {
    var n = this;
    return new Promise(function (t, r) {
      var o = n.indexedDB.open("tensorflowjs", 1);
      o.onupgradeneeded = function () {
        return ad(o);
      }, o.onsuccess = function () {
        var a = o.result;

        if (null == e) {
          var i = a.transaction(nd, "readonly"),
              s = i.objectStore(nd).get(n.modelPath);
          s.onsuccess = function () {
            if (null == s.result) return a.close(), r(new Error("Cannot find model with path '" + n.modelPath + "' in IndexedDB."));
            t(s.result.modelArtifacts);
          }, s.onerror = function (t) {
            return a.close(), r(s.error);
          }, i.oncomplete = function () {
            return a.close();
          };
        } else {
          var u,
              c = $f(e),
              l = a.transaction(rd, "readwrite"),
              h = l.objectStore(rd),
              f = h.put({
            modelPath: n.modelPath,
            modelArtifactsInfo: c
          });
          f.onsuccess = function () {
            var o = (u = a.transaction(nd, "readwrite")).objectStore(nd).put({
              modelPath: n.modelPath,
              modelArtifacts: e,
              modelArtifactsInfo: c
            });
            o.onsuccess = function () {
              return t({
                modelArtifactsInfo: c
              });
            }, o.onerror = function (t) {
              var e = (h = l.objectStore(rd)).delete(n.modelPath);
              e.onsuccess = function () {
                return a.close(), r(o.error);
              }, e.onerror = function (t) {
                return a.close(), r(o.error);
              };
            };
          }, f.onerror = function (t) {
            return a.close(), r(f.error);
          }, l.oncomplete = function () {
            null == u ? a.close() : u.oncomplete = function () {
              return a.close();
            };
          };
        }
      }, o.onerror = function (t) {
        return r(o.error);
      };
    });
  }, t.URL_SCHEME = "indexeddb://", t;
}(),
    sd = function (t) {
  return i().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(id.URL_SCHEME) ? (e = t.slice(id.URL_SCHEME.length), new id(e)) : null;
  var e;
};

Qf.registerSaveRouter(sd), Qf.registerLoadRouter(sd);

var ud = function () {
  function t() {
    this.indexedDB = od();
  }

  return t.prototype.listModels = function () {
    return n(this, void 0, void 0, function () {
      var t = this;
      return r(this, function (e) {
        return [2, new Promise(function (e, n) {
          var r = t.indexedDB.open("tensorflowjs", 1);
          r.onupgradeneeded = function () {
            return ad(r);
          }, r.onsuccess = function () {
            var t = r.result,
                o = t.transaction(rd, "readonly"),
                a = o.objectStore(rd).getAll();
            a.onsuccess = function () {
              for (var t = {}, n = 0, r = a.result; n < r.length; n++) {
                var o = r[n];
                t[o.modelPath] = o.modelArtifactsInfo;
              }

              e(t);
            }, a.onerror = function (e) {
              return t.close(), n(a.error);
            }, o.oncomplete = function () {
              return t.close();
            };
          }, r.onerror = function (t) {
            return n(r.error);
          };
        })];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return n(this, void 0, void 0, function () {
      var e = this;
      return r(this, function (n) {
        var r;
        return t = (r = t).startsWith(id.URL_SCHEME) ? r.slice(id.URL_SCHEME.length) : r, [2, new Promise(function (n, r) {
          var o = e.indexedDB.open("tensorflowjs", 1);
          o.onupgradeneeded = function () {
            return ad(o);
          }, o.onsuccess = function () {
            var e,
                a = o.result,
                i = a.transaction(rd, "readwrite"),
                s = i.objectStore(rd),
                u = s.get(t);
            u.onsuccess = function () {
              if (null == u.result) return a.close(), r(new Error("Cannot find model with path '" + t + "' in IndexedDB."));

              var o = s.delete(t),
                  i = function () {
                var o = (e = a.transaction(nd, "readwrite")).objectStore(nd).delete(t);
                o.onsuccess = function () {
                  return n(u.result.modelArtifactsInfo);
                }, o.onerror = function (t) {
                  return r(u.error);
                };
              };

              o.onsuccess = i, o.onerror = function (t) {
                return i(), a.close(), r(u.error);
              };
            }, u.onerror = function (t) {
              return a.close(), r(u.error);
            }, i.oncomplete = function () {
              null == e ? a.close() : e.oncomplete = function () {
                return a.close();
              };
            };
          }, o.onerror = function (t) {
            return r(o.error);
          };
        })];
      });
    });
  }, t;
}();

if (i().getBool("IS_BROWSER")) try {
  Zf.registerManager(id.URL_SCHEME, new ud());
} catch (t) {}
var cd = "/",
    ld = "tensorflowjs_models",
    hd = "info",
    fd = "model_topology",
    dd = "weight_specs",
    pd = "weight_data",
    vd = "model_metadata";

function gd(t) {
  return {
    info: [ld, t, hd].join(cd),
    topology: [ld, t, fd].join(cd),
    weightSpecs: [ld, t, dd].join(cd),
    weightData: [ld, t, pd].join(cd),
    modelMetadata: [ld, t, vd].join(cd)
  };
}

function md(t) {
  var e = t.split(cd);
  if (e.length < 3) throw new Error("Invalid key format: " + t);
  return e.slice(1, e.length - 1).join(cd);
}

var yd = function () {
  function t(t) {
    if (!i().getBool("IS_BROWSER") || "undefined" == typeof window || void 0 === window.localStorage) throw new Error("The current environment does not support local storage.");
    if (this.LS = window.localStorage, null == t || !t) throw new Error("For local storage, modelPath must not be null, undefined or empty.");
    this.modelPath = t, this.keys = gd(this.modelPath);
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o;
      return r(this, function (r) {
        if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");
        e = JSON.stringify(t.modelTopology), n = JSON.stringify(t.weightSpecs), o = $f(t);

        try {
          return this.LS.setItem(this.keys.info, JSON.stringify(o)), this.LS.setItem(this.keys.topology, e), this.LS.setItem(this.keys.weightSpecs, n), this.LS.setItem(this.keys.weightData, function (t) {
            if (Kf) return Buffer.from(t).toString("base64");

            for (var e = new Uint8Array(t), n = "", r = 0, o = e.length; r < o; r++) n += String.fromCharCode(e[r]);

            return btoa(n);
          }(t.weightData)), this.LS.setItem(this.keys.modelMetadata, JSON.stringify({
            format: t.format,
            generatedBy: t.generatedBy,
            convertedBy: t.convertedBy,
            userDefinedMetadata: t.userDefinedMetadata
          })), [2, {
            modelArtifactsInfo: o
          }];
        } catch (t) {
          throw this.LS.removeItem(this.keys.info), this.LS.removeItem(this.keys.topology), this.LS.removeItem(this.keys.weightSpecs), this.LS.removeItem(this.keys.weightData), this.LS.removeItem(this.keys.modelMetadata), new Error("Failed to save model '" + this.modelPath + "' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=" + o.modelTopologyBytes + ", weightSpecsBytes=" + o.weightSpecsBytes + ", weightDataBytes=" + o.weightDataBytes + ".");
        }

        return [2];
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s;
      return r(this, function (r) {
        if (null == (t = JSON.parse(this.LS.getItem(this.keys.info)))) throw new Error("In local storage, there is no model with name '" + this.modelPath + "'");
        if ("JSON" !== t.modelTopologyType) throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");
        if (e = {}, null == (n = JSON.parse(this.LS.getItem(this.keys.topology)))) throw new Error("In local storage, the topology of model '" + this.modelPath + "' is missing.");
        if (e.modelTopology = n, null == (o = JSON.parse(this.LS.getItem(this.keys.weightSpecs)))) throw new Error("In local storage, the weight specs of model '" + this.modelPath + "' are missing.");
        if (e.weightSpecs = o, null != (a = this.LS.getItem(this.keys.modelMetadata)) && (i = JSON.parse(a), e.format = i.format, e.generatedBy = i.generatedBy, e.convertedBy = i.convertedBy, e.userDefinedMetadata = i.userDefinedMetadata), null == (s = this.LS.getItem(this.keys.weightData))) throw new Error("In local storage, the binary weight values of model '" + this.modelPath + "' are missing.");
        return e.weightData = function (t) {
          if (Kf) {
            var e = Buffer.from(t, "base64");
            return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
          }

          for (var n = atob(t), r = new Uint8Array(n.length), o = 0; o < n.length; ++o) r.set([n.charCodeAt(o)], o);

          return r.buffer;
        }(s), [2, e];
      });
    });
  }, t.URL_SCHEME = "localstorage://", t;
}(),
    xd = function (t) {
  return i().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(yd.URL_SCHEME) ? (e = t.slice(yd.URL_SCHEME.length), new yd(e)) : null;
  var e;
};

Qf.registerSaveRouter(xd), Qf.registerLoadRouter(xd);

var bd = function () {
  function t() {
    C(i().getBool("IS_BROWSER"), function () {
      return "Current environment is not a web browser";
    }), C("undefined" == typeof window || void 0 !== window.localStorage, function () {
      return "Current browser does not appear to support localStorage";
    }), this.LS = window.localStorage;
  }

  return t.prototype.listModels = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i;
      return r(this, function (r) {
        for (t = {}, e = ld + cd, n = cd + hd, o = 0; o < this.LS.length; ++o) (a = this.LS.key(o)).startsWith(e) && a.endsWith(n) && (i = md(a), t[i] = JSON.parse(this.LS.getItem(a)));

        return [2, t];
      });
    });
  }, t.prototype.removeModel = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n;
      return r(this, function (r) {
        var o;
        if (t = (o = t).startsWith(yd.URL_SCHEME) ? o.slice(yd.URL_SCHEME.length) : o, e = gd(t), null == this.LS.getItem(e.info)) throw new Error("Cannot find model at path '" + t + "'");
        return n = JSON.parse(this.LS.getItem(e.info)), this.LS.removeItem(e.info), this.LS.removeItem(e.topology), this.LS.removeItem(e.weightSpecs), this.LS.removeItem(e.weightData), [2, n];
      });
    });
  }, t;
}();

if (i().getBool("IS_BROWSER")) try {
  Zf.registerManager(yd.URL_SCHEME, new bd());
} catch (t) {}
var wd = "model",
    Cd = ".json",
    Ed = ".weights.bin";

function Rd(t) {
  return new Promise(function (t) {
    return setTimeout(t);
  }).then(t);
}

var Id = function () {
  function t(e) {
    if (!i().getBool("IS_BROWSER")) throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");
    e.startsWith(t.URL_SCHEME) && (e = e.slice(t.URL_SCHEME.length)), null != e && 0 !== e.length || (e = wd), this.modelTopologyFileName = e + Cd, this.weightDataFileName = e + Ed;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, i, s;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if ("undefined" == typeof document) throw new Error("Browser downloads are not supported in this environment since `document` is not present");
            if (e = window.URL.createObjectURL(new Blob([t.weightData], {
              type: "application/octet-stream"
            })), !(t.modelTopology instanceof ArrayBuffer)) return [3, 1];
            throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");

          case 1:
            return n = [{
              paths: ["./" + this.weightDataFileName],
              weights: t.weightSpecs
            }], o = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              weightsManifest: n
            }, a = window.URL.createObjectURL(new Blob([JSON.stringify(o)], {
              type: "application/json"
            })), (i = null == this.jsonAnchor ? document.createElement("a") : this.jsonAnchor).download = this.modelTopologyFileName, i.href = a, [4, Rd(function () {
              return i.dispatchEvent(new MouseEvent("click"));
            })];

          case 2:
            return r.sent(), null == t.weightData ? [3, 4] : ((s = null == this.weightDataAnchor ? document.createElement("a") : this.weightDataAnchor).download = this.weightDataFileName, s.href = e, [4, Rd(function () {
              return s.dispatchEvent(new MouseEvent("click"));
            })]);

          case 3:
            r.sent(), r.label = 4;

          case 4:
            return [2, {
              modelArtifactsInfo: $f(t)
            }];
        }
      });
    });
  }, t.URL_SCHEME = "downloads://", t;
}(),
    kd = function () {
  function t(t) {
    if (null == t || t.length < 1) throw new Error("When calling browserFiles, at least 1 file is required, but received " + t);
    this.files = t;
  }

  return t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t,
          e,
          n = this;
      return r(this, function (r) {
        return t = this.files[0], e = this.files.slice(1), [2, new Promise(function (r, o) {
          var a = new FileReader();
          a.onload = function (a) {
            var i = JSON.parse(a.target.result),
                s = i.modelTopology;

            if (null != s) {
              0 === e.length && r({
                modelTopology: s
              });
              var u = i.weightsManifest;

              if (null != u) {
                var c;

                try {
                  c = n.checkManifestAndWeightFiles(u, e);
                } catch (t) {
                  return void o(t);
                }

                var l = [],
                    h = [],
                    f = [];
                u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    h.push(t), f.push(null);
                  }), l.push.apply(l, t.weights);
                }), u.forEach(function (t) {
                  t.paths.forEach(function (t) {
                    var e = new FileReader();
                    e.onload = function (e) {
                      var n = e.target.result,
                          o = h.indexOf(t);
                      f[o] = n, -1 === f.indexOf(null) && r({
                        modelTopology: s,
                        weightSpecs: l,
                        weightData: Xf(f),
                        format: i.format,
                        generatedBy: i.generatedBy,
                        convertedBy: i.convertedBy,
                        userDefinedMetadata: i.userDefinedMetadata
                      });
                    }, e.onerror = function (e) {
                      return o("Failed to weights data from file of path '" + t + "'.");
                    }, e.readAsArrayBuffer(c[t]);
                  });
                });
              } else o(new Error("weightManifest field is missing from file " + t.name));
            } else o(new Error("modelTopology field is missing from file " + t.name));
          }, a.onerror = function (e) {
            return o("Failed to read model topology and weights manifest JSON from file '" + t.name + "'. BrowserFiles supports loading Keras-style tf.Model artifacts only.");
          }, a.readAsText(t);
        })];
      });
    });
  }, t.prototype.checkManifestAndWeightFiles = function (t, e) {
    for (var n = [], r = e.map(function (t) {
      return Yf(t.name);
    }), o = {}, a = 0, i = t; a < i.length; a++) {
      i[a].paths.forEach(function (t) {
        var a = Yf(t);
        if (-1 !== n.indexOf(a)) throw new Error("Duplicate file basename found in weights manifest: '" + a + "'");
        if (n.push(a), -1 === r.indexOf(a)) throw new Error("Weight file with basename '" + a + "' is not provided.");
        o[t] = e[r.indexOf(a)];
      });
    }

    if (n.length !== e.length) throw new Error("Mismatch in the number of files in weights manifest (" + n.length + ") and the number of weight files provided (" + e.length + ").");
    return o;
  }, t;
}();

function Sd(t, e, n, r) {
  !function (t) {
    C(null != t && Array.isArray(t) && t.length > 0, function () {
      return "promises must be a none empty array";
    });
  }(t), function (t, e) {
    C(t >= 0 && t <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got startFraction " + t;
    }), C(e >= 0 && e <= 1, function () {
      return "Progress fraction must be in range [0, 1], but got endFraction " + e;
    }), C(e >= t, function () {
      return "startFraction must be no more than endFraction, but got startFraction " + t + " and endFraction " + e;
    });
  }(n = null == n ? 0 : n, r = null == r ? 1 : r);
  var o = 0;
  return Promise.all(t.map(function (a) {
    return a.then(function (a) {
      var i = n + ++o / t.length * (r - n);
      return e(i), a;
    }), a;
  }));
}

function Ad(t, e) {
  return n(this, void 0, void 0, function () {
    var n, o, a, s, u, c, l, h, f;
    return r(this, function (r) {
      switch (r.label) {
        case 0:
          return null == e && (e = {}), n = null == e.fetchFunc ? i().platform.fetch : e.fetchFunc, o = t.map(function (t) {
            return n(t, e.requestInit, {
              isBinary: !0
            });
          }), a = 0, s = .5, null != e.onProgress ? [3, 2] : [4, Promise.all(o)];

        case 1:
          return u = r.sent(), [3, 4];

        case 2:
          return [4, Sd(o, e.onProgress, a, s)];

        case 3:
          u = r.sent(), r.label = 4;

        case 4:
          return c = u.map(function (t) {
            return t.arrayBuffer();
          }), l = .5, h = 1, null != e.onProgress ? [3, 6] : [4, Promise.all(c)];

        case 5:
          return f = r.sent(), [3, 8];

        case 6:
          return [4, Sd(c, e.onProgress, l, h)];

        case 7:
          f = r.sent(), r.label = 8;

        case 8:
          return [2, f];
      }
    });
  });
}

function Td(t) {
  var e = this;
  return function (o, a, i) {
    return void 0 === a && (a = ""), n(e, void 0, void 0, function () {
      var e, n, s, u, c, l, h, f, d, p;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (e = o.map(function () {
              return !1;
            }), n = {}, s = null != i ? i.map(function () {
              return !1;
            }) : [], u = [], o.forEach(function (t, r) {
              var o = 0;
              t.weights.forEach(function (t) {
                var a = "quantization" in t ? t.quantization.dtype : t.dtype,
                    c = zf[a] * k(t.shape),
                    l = function () {
                  e[r] = !0, null == n[r] && (n[r] = []), n[r].push({
                    manifestEntry: t,
                    groupOffset: o,
                    sizeBytes: c
                  });
                };

                null != i ? i.forEach(function (e, n) {
                  e === t.name && (l(), s[n] = !0);
                }) : l(), u.push(t.name), o += c;
              });
            }), !s.every(function (t) {
              return t;
            })) throw c = i.filter(function (t, e) {
              return !s[e];
            }), new Error("Could not find weights in manifest with names: " + c.join(", ") + ". \nManifest JSON has weights with names: " + u.join(", ") + ".");
            return l = e.reduce(function (t, e, n) {
              return e && t.push(n), t;
            }, []), h = [], l.forEach(function (t) {
              o[t].paths.forEach(function (t) {
                var e = a + (a.endsWith("/") ? "" : "/") + t;
                h.push(e);
              });
            }), [4, t(h)];

          case 1:
            return f = r.sent(), d = {}, p = 0, l.forEach(function (t) {
              for (var e = o[t].paths.length, r = 0, a = 0; a < e; a++) r += f[p + a].byteLength;

              for (var i = new ArrayBuffer(r), s = new Uint8Array(i), u = 0, c = 0; c < e; c++) {
                var l = new Uint8Array(f[p + c]);
                s.set(l, u), u += l.byteLength;
              }

              n[t].forEach(function (t) {
                var e = Hf(i.slice(t.groupOffset, t.groupOffset + t.sizeBytes), [t.manifestEntry]);

                for (var n in e) d[n] = e[n];
              }), p += e;
            }), [2, d];
        }
      });
    });
  };
}

Qf.registerSaveRouter(function (t) {
  return i().getBool("IS_BROWSER") && !Array.isArray(t) && t.startsWith(Id.URL_SCHEME) ? function (t) {
    void 0 === t && (t = "model");
    return new Id(t);
  }(t.slice(Id.URL_SCHEME.length)) : null;
});

var Dd = function () {
  function t(t, e) {
    if (this.DEFAULT_METHOD = "POST", null == e && (e = {}), this.weightPathPrefix = e.weightPathPrefix, this.onProgress = e.onProgress, null != e.fetchFunc ? (C("function" == typeof e.fetchFunc, function () {
      return "Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)";
    }), this.fetch = e.fetchFunc) : this.fetch = i().platform.fetch, C(null != t && t.length > 0, function () {
      return "URL path for http must not be null, undefined or empty.";
    }), Array.isArray(t) && C(2 === t.length, function () {
      return "URL paths for http must have a length of 2, (actual length is " + t.length + ").";
    }), this.path = t, null != e.requestInit && null != e.requestInit.body) throw new Error("requestInit is expected to have no pre-existing body, but has one.");
    this.requestInit = e.requestInit || {};
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (t.modelTopology instanceof ArrayBuffer) throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");
            return (e = Object.assign({
              method: this.DEFAULT_METHOD
            }, this.requestInit)).body = new FormData(), n = [{
              paths: ["./model.weights.bin"],
              weights: t.weightSpecs
            }], o = {
              modelTopology: t.modelTopology,
              format: t.format,
              generatedBy: t.generatedBy,
              convertedBy: t.convertedBy,
              userDefinedMetadata: t.userDefinedMetadata,
              weightsManifest: n
            }, e.body.append("model.json", new Blob([JSON.stringify(o)], {
              type: "application/json"
            }), "model.json"), null != t.weightData && e.body.append("model.weights.bin", new Blob([t.weightData], {
              type: "application/octet-stream"
            }), "model.weights.bin"), [4, this.fetch(this.path, e)];

          case 1:
            if ((a = r.sent()).ok) return [2, {
              modelArtifactsInfo: $f(t),
              responses: [a]
            }];
            throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status " + a.status + ".");
        }
      });
    });
  }, t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s, u, c, l, h, f;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.fetch(this.path, this.requestInit)];

          case 1:
            if (!(t = r.sent()).ok) throw new Error("Request to " + this.path + " failed with status code " + t.status + ". Please verify this URL points to the model JSON of the model to load.");
            r.label = 2;

          case 2:
            return r.trys.push([2, 4,, 5]), [4, t.json()];

          case 3:
            return e = r.sent(), [3, 5];

          case 4:
            throw r.sent(), n = "Failed to parse model JSON of response from " + this.path + ".", this.path.endsWith(".pb") ? n += " Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository." : n += " Please make sure the server is serving valid JSON for this request.", new Error(n);

          case 5:
            if (o = e.modelTopology, a = e.weightsManifest, i = e.generatedBy, s = e.convertedBy, u = e.format, c = e.userDefinedMetadata, null == o && null == a) throw new Error("The JSON from HTTP path " + this.path + " contains neither model topology or manifest for weights.");
            return null == a ? [3, 7] : [4, this.loadWeights(a)];

          case 6:
            f = r.sent(), l = f[0], h = f[1], r.label = 7;

          case 7:
            return [2, {
              modelTopology: o,
              weightSpecs: l,
              weightData: h,
              userDefinedMetadata: c,
              generatedBy: i,
              convertedBy: s,
              format: u
            }];
        }
      });
    });
  }, t.prototype.loadWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e, n, o, a, i, s, u, c, l, h, f;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            for (e = Array.isArray(this.path) ? this.path[1] : this.path, n = function (t) {
              var e = t.lastIndexOf("/"),
                  n = t.lastIndexOf("?"),
                  r = t.substring(0, e),
                  o = n > e ? t.substring(n) : "";
              return [r + "/", o];
            }(e), o = n[0], a = n[1], i = this.weightPathPrefix || o, s = [], u = 0, c = t; u < c.length; u++) l = c[u], s.push.apply(s, l.weights);

            return h = [], t.forEach(function (t) {
              t.paths.forEach(function (t) {
                h.push(i + t + a);
              });
            }), [4, Ad(h, {
              requestInit: this.requestInit,
              fetchFunc: this.fetch,
              onProgress: this.onProgress
            })];

          case 1:
            return f = r.sent(), [2, [s, Xf(f)]];
        }
      });
    });
  }, t.URL_SCHEME_REGEX = /^https?:\/\//, t;
}();

function Nd(t) {
  return null != t.match(Dd.URL_SCHEME_REGEX);
}

var Fd = function (t, e) {
  if ("undefined" == typeof fetch) return null;
  return (Array.isArray(t) ? t.every(function (t) {
    return Nd(t);
  }) : Nd(t)) ? _d(t, {
    onProgress: e
  }) : null;
};

function _d(t, e) {
  return new Dd(t, e);
}

Qf.registerSaveRouter(Fd), Qf.registerLoadRouter(Fd);

var Od = function () {
  function t(t) {
    this.modelArtifacts = t;
  }

  return t.prototype.load = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return [2, this.modelArtifacts];
      });
    });
  }, t;
}(),
    Md = function () {
  function t(t) {
    this.saveHandler = t;
  }

  return t.prototype.save = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        return [2, this.saveHandler(t)];
      });
    });
  }, t;
}();

var Bd = Object.freeze({
  browserFiles: function (t) {
    return new kd(t);
  },
  browserHTTPRequest: function (t, e) {
    return _d(t, e);
  },
  concatenateArrayBuffers: Xf,
  decodeWeights: Hf,
  encodeWeights: function (t, e) {
    return n(this, void 0, void 0, function () {
      var o,
          a,
          i,
          s,
          u,
          c = this;
      return r(this, function (l) {
        switch (l.label) {
          case 0:
            for (o = [], a = [], i = Array.isArray(t) ? t.map(function (t) {
              return t.name;
            }) : Object.keys(t), s = function (s) {
              var u = i[s],
                  l = Array.isArray(t) ? t[s].tensor : t[u];
              if ("float32" !== l.dtype && "int32" !== l.dtype && "bool" !== l.dtype && "string" !== l.dtype) throw new Error("Unsupported dtype in weight '" + u + "': " + l.dtype);
              var h = {
                name: u,
                shape: l.shape,
                dtype: l.dtype
              };

              if ("string" === l.dtype) {
                var f = new Promise(function (t) {
                  return n(c, void 0, void 0, function () {
                    var e, n, o, a, i, s, u;
                    return r(this, function (r) {
                      switch (r.label) {
                        case 0:
                          return [4, l.bytes()];

                        case 1:
                          for (e = r.sent(), n = e.reduce(function (t, e) {
                            return t + e.length;
                          }, 0) + Gf * e.length, o = new Uint8Array(n), a = 0, i = 0; i < e.length; i++) s = e[i], u = new Uint8Array(new Uint32Array([s.length]).buffer), o.set(u, a), a += Gf, o.set(s, a), a += s.length;

                          return t(o), [2];
                      }
                    });
                  });
                });
                a.push(f);
              } else a.push(l.data());

              null != e && (h.group = e), o.push(h);
            }, u = 0; u < i.length; ++u) s(u);

            return [4, Promise.all(a)];

          case 1:
            return [2, {
              data: qf(l.sent()),
              specs: o
            }];
        }
      });
    });
  },
  fromMemory: function (t, e, n, r) {
    return 1 === arguments.length ? null != t.modelTopology || null != t.weightSpecs ? new Od(t) : (console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."), new Od({
      modelTopology: t
    })) : (console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."), new Od({
      modelTopology: t,
      weightSpecs: e,
      weightData: n,
      trainingConfig: r
    }));
  },
  getLoadHandlers: function (t, e) {
    return Qf.getLoadHandlers(t, e);
  },
  getModelArtifactsInfoForJSON: $f,
  getSaveHandlers: function (t) {
    return Qf.getSaveHandlers(t);
  },
  http: _d,
  isHTTPScheme: Nd,
  loadWeights: function (t, e, o, a) {
    return void 0 === e && (e = ""), n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return [2, Td(function (t) {
          return Ad(t, {
            requestInit: a
          });
        })(t, e, o)];
      });
    });
  },
  registerLoadRouter: function (t) {
    return Qf.registerLoadRouter(t);
  },
  registerSaveRouter: function (t) {
    return Qf.registerSaveRouter(t);
  },
  weightsLoaderFactory: Td,
  withSaveHandler: function (t) {
    return new Md(t);
  },
  copyModel: function (t, e) {
    return n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return !1, [2, ed(t, e, !1)];
      });
    });
  },
  listModels: function () {
    return n(this, void 0, void 0, function () {
      var t, e, n, o, a, i, s;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            t = Zf.getSchemes(), e = {}, n = 0, o = t, r.label = 1;

          case 1:
            return n < o.length ? (a = o[n], [4, Zf.getManager(a).listModels()]) : [3, 4];

          case 2:
            for (s in i = r.sent()) e[a + Jf + s] = i[s];

            r.label = 3;

          case 3:
            return n++, [3, 1];

          case 4:
            return [2, e];
        }
      });
    });
  },
  moveModel: function (t, e) {
    return n(this, void 0, void 0, function () {
      return r(this, function (n) {
        return !0, [2, ed(t, e, !0)];
      });
    });
  },
  removeModel: function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        return e = td(t), [2, Zf.getManager(e.scheme).removeModel(e.path)];
      });
    });
  }
});
exports.io = Bd;
var Pd,
    Ld = An({
  confusionMatrix_: function (t, e, n) {
    var r = gn(t, "labels", "confusionMatrix"),
        o = gn(e, "predictions", "confusionMatrix");
    C(null == n || n > 0 && Number.isInteger(n), function () {
      return "If provided, numClasses must be a positive integer, but got " + n;
    }), C(1 === r.rank, function () {
      return "Expected the rank of labels to be 1, but got " + r.rank;
    }), C(1 === o.rank, function () {
      return "Expected the rank of predictions to be 1, but got " + o.rank;
    }), C(r.shape[0] === o.shape[0], function () {
      return "Mismatch in the number of examples: " + r.shape[0] + " vs. " + o.shape[0] + ". Labels and predictions should have the same number of elements.";
    }), C(n > 0 && Number.isInteger(n), function () {
      return "numClasses is required to be a positive integer, but got " + n;
    });
    var a = Rc(r.asType("int32"), n),
        i = Rc(o.asType("int32"), n);
    return a.transpose().matMul(i).asType("int32");
  }
}),
    Wd = Object.freeze({
  confusionMatrix: Ld
});
exports.math = Wd;

var Ud = An({
  fromPixels_: function (t, e) {
    if (void 0 === e && (e = 3), e > 4) throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");
    if (null == t) throw new Error("pixels passed to tf.browser.fromPixels() can not be null");
    var n = !1,
        r = !1,
        o = !1,
        a = !1,
        i = !1;
    if (t.data instanceof Uint8Array) n = !0;else if ("undefined" != typeof ImageData && t instanceof ImageData) r = !0;else if ("undefined" != typeof HTMLVideoElement && t instanceof HTMLVideoElement) o = !0;else if ("undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement) a = !0;else {
      if (null == t.getContext) throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was " + t.constructor.name);
      i = !0;
    }

    if (o) {
      if (o && t.readyState < 2) throw new Error("The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.");
    }

    if (null != l("FromPixels", Lt.backendName)) return Lt.runKernel("FromPixels", {
      pixels: t
    }, {
      numChannels: e
    });
    var s,
        u,
        c = o ? [t.videoWidth, t.videoHeight] : [t.width, t.height],
        h = c[0],
        f = c[1];
    if (i ? s = t.getContext("2d").getImageData(0, 0, h, f).data : r || n ? s = t.data : (a || o) && (null == Pd && (Pd = document.createElement("canvas").getContext("2d")), Pd.canvas.width = h, Pd.canvas.height = f, Pd.drawImage(t, 0, 0, h, f), s = Pd.getImageData(0, 0, h, f).data), 4 === e) u = new Int32Array(s);else {
      var d = h * f;
      u = new Int32Array(d * e);

      for (var p = 0; p < d; p++) for (var v = 0; v < e; ++v) u[p * e + v] = s[4 * p + v];
    }
    return Pn(u, [f, h, e], "int32");
  }
}),
    Vd = Object.freeze({
  toPixels: function (t, e) {
    return n(this, void 0, void 0, function () {
      var n, o, a, i, s, u, c, l, h, f, d, p, v, g, m, y, x, b, w, C, E, R, I;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            if (n = gn(t, "img", "toPixels"), t instanceof wt || (n = n.toInt()), 2 !== n.rank && 3 !== n.rank) throw new Error("toPixels only supports rank 2 or 3 tensors, got rank " + n.rank + ".");
            if (o = n.shape.slice(0, 2), a = o[0], i = o[1], (s = 2 === n.rank ? 1 : n.shape[2]) > 4 || 2 === s) throw new Error("toPixels only supports depth of size 1, 3 or 4 but got " + s);
            return [4, n.data()];

          case 1:
            return u = r.sent(), c = n.min(), l = n.max(), [4, Promise.all([c.data(), l.data()])];

          case 2:
            if (h = r.sent(), f = h[0], d = h[1], p = f[0], v = d[0], c.dispose(), l.dispose(), "float32" === n.dtype) {
              if (p < 0 || v > 1) throw new Error("Tensor values for a float32 Tensor must be in the range [0 - 1] but got range [" + p + " - " + v + "].");
            } else {
              if ("int32" !== n.dtype) throw new Error("Unsupported type for toPixels: " + n.dtype + ". Please use float32 or int32 tensors.");
              if (p < 0 || v > 255) throw new Error("Tensor values for a int32 Tensor must be in the range [0 - 255] but got range [" + p + " - " + v + "].");
            }

            for (g = "float32" === n.dtype ? 255 : 1, m = new Uint8ClampedArray(i * a * 4), y = 0; y < a * i; ++y) x = void 0, b = void 0, w = void 0, C = void 0, 1 === s ? (x = u[y] * g, b = u[y] * g, w = u[y] * g, C = 255) : 3 === s ? (x = u[3 * y] * g, b = u[3 * y + 1] * g, w = u[3 * y + 2] * g, C = 255) : 4 === s && (x = u[4 * y] * g, b = u[4 * y + 1] * g, w = u[4 * y + 2] * g, C = u[4 * y + 3] * g), m[(E = 4 * y) + 0] = Math.round(x), m[E + 1] = Math.round(b), m[E + 2] = Math.round(w), m[E + 3] = Math.round(C);

            return null != e && (e.width = i, e.height = a, R = e.getContext("2d"), I = new ImageData(m, i, a), R.putImageData(I, 0, 0)), n !== t && n.dispose(), [2, m];
        }
      });
    });
  },
  fromPixels: Ud
}),
    zd = function () {
  function t() {}

  return t.prototype.getClassName = function () {
    return this.constructor.className;
  }, t.fromConfig = function (t, e) {
    return new t(e);
  }, t;
}(),
    Gd = function () {
  function t() {
    this.classNameMap = {};
  }

  return t.getMap = function () {
    return null == t.instance && (t.instance = new t()), t.instance;
  }, t.register = function (e) {
    t.getMap().classNameMap[e.className] = [e, e.fromConfig];
  }, t;
}();

exports.browser = Vd;

function Hd(t) {
  C(null != t.className, function () {
    return "Class being registered does not have the static className property defined.";
  }), C("string" == typeof t.className, function () {
    return "className is required to be a string, but got type " + typeof t.className;
  }), C(t.className.length > 0, function () {
    return "Class being registered has an empty-string as its className, which is disallowed.";
  }), Gd.register(t);
}

var qd = Object.freeze({
  Serializable: zd,
  SerializationMap: Gd,
  registerClass: Hd
}),
    Kd = "1.7.4";
exports.version_core = Kd;
exports.serialization = qd;

var jd = Object.freeze({
  gpgpu_util: Rs,
  webgl_util: Ge,
  forceHalfFloat: function () {
    i().set("WEBGL_FORCE_F16_TEXTURES", !0);
  },
  MathBackendWebGL: Uu,
  setWebGLContext: Kt,
  GPGPUContext: Is
}),
    Xd = function (t) {
  function o() {
    return null !== t && t.apply(this, arguments) || this;
  }

  return e(o, t), o.prototype.minimize = function (t, e, n) {
    void 0 === e && (e = !1);
    var r = this.computeGradients(t, n),
        o = r.value,
        a = r.grads;

    if (null != n) {
      var i = n.map(function (t) {
        return {
          name: t.name,
          tensor: a[t.name]
        };
      });
      this.applyGradients(i);
    } else this.applyGradients(a);

    return tn(a), e ? o : (o.dispose(), null);
  }, Object.defineProperty(o.prototype, "iterations", {
    get: function () {
      return null == this.iterations_ && (this.iterations_ = 0), this.iterations_;
    },
    enumerable: !0,
    configurable: !0
  }), o.prototype.incrementIterations = function () {
    this.iterations_ = this.iterations + 1;
  }, o.prototype.computeGradients = function (t, e) {
    return ra(t, e);
  }, o.prototype.dispose = function () {
    null != this.iterations_ && tn(this.iterations_);
  }, o.prototype.saveIterations = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        return null == this.iterations_ && (this.iterations_ = 0), [2, {
          name: "iter",
          tensor: On(this.iterations_, "int32")
        }];
      });
    });
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("getWeights() is not implemented for this optimizer yet.");
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("setWeights() is not implemented for this optimizer class " + this.getClassName());
      });
    });
  }, o.prototype.extractIterations = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return e = this, [4, t[0].tensor.data()];

          case 1:
            return e.iterations_ = n.sent()[0], [2, t.slice(1)];
        }
      });
    });
  }, o;
}(zd);

exports.Optimizer = Xd;
exports.webgl = jd;
Object.defineProperty(Xd, Symbol.hasInstance, {
  value: function (t) {
    return null != t.minimize && null != t.computeGradients && null != t.applyGradients;
  }
});

var Yd = function (t) {
  function o(e, n, r) {
    void 0 === r && (r = null);
    var o = t.call(this) || this;
    return o.learningRate = e, o.rho = n, o.epsilon = r, o.accumulatedGrads = [], o.accumulatedUpdates = [], null == r && (o.epsilon = Lt.backend.epsilon()), o;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Lt.registeredVariables[n];
      null == e.accumulatedGrads[r] && (e.accumulatedGrads[r] = {
        originalName: n + "/accum_grad",
        variable: Ze(function () {
          return Xn(o).variable(!1);
        })
      }), null == e.accumulatedUpdates[r] && (e.accumulatedUpdates[r] = {
        originalName: n + "/accum_var",
        variable: Ze(function () {
          return Xn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable,
            s = e.accumulatedUpdates[r].variable;
        Ze(function () {
          var t = i.mul(e.rho).add(a.square().mul(1 - e.rho)),
              n = s.add(e.epsilon).sqrt().div(i.add(e.epsilon).sqrt()).mul(a),
              r = s.mul(e.rho).add(n.square().mul(1 - e.rho));
          i.assign(t), s.assign(r);
          var u = n.mul(-e.learningRate).add(o);
          o.assign(u);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedUpdates && (tn(this.accumulatedGrads.map(function (t) {
      return t.variable;
    })), tn(this.accumulatedUpdates.map(function (t) {
      return t.variable;
    })));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedGrads.concat(this.accumulatedUpdates), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = t.length / 2, !1, this.accumulatedGrads = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedUpdates = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      rho: this.rho,
      epsilon: this.epsilon
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.rho, e.epsilon);
  }, o.className = "Adadelta", o;
}(Xd);

exports.AdadeltaOptimizer = Yd;
Hd(Yd);

var $d = function (t) {
  function o(e, n) {
    void 0 === n && (n = .1);
    var r = t.call(this) || this;
    return r.learningRate = e, r.initialAccumulatorValue = n, r.accumulatedGrads = [], r;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Lt.registeredVariables[n];

      if (null == e.accumulatedGrads[r]) {
        e.accumulatedGrads[r] = {
          originalName: n + "/accumulator",
          variable: Ze(function () {
            return Hn(o.shape, e.initialAccumulatorValue).variable(!1);
          })
        };
      }

      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedGrads[r].variable;
        Ze(function () {
          var t = i.add(a.square());
          i.assign(t);
          var n = a.div(t.add(Lt.backend.epsilon()).sqrt()).mul(-e.learningRate).add(o);
          o.assign(n);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedGrads && tn(this.accumulatedGrads.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulatedGrads.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulatedGrads = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      initialAccumulatorValue: this.initialAccumulatorValue
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.initialAccumulatorValue);
  }, o.className = "Adagrad", o;
}(Xd);

exports.AdagradOptimizer = $d;
Hd($d);

var Qd = function (t) {
  function o(e, n, r, o) {
    void 0 === o && (o = null);
    var a = t.call(this) || this;
    return a.learningRate = e, a.beta1 = n, a.beta2 = r, a.epsilon = o, a.accumulatedFirstMoment = [], a.accumulatedSecondMoment = [], Ze(function () {
      a.accBeta1 = On(n).variable(), a.accBeta2 = On(r).variable();
    }), null == o && (a.epsilon = Lt.backend.epsilon()), a;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Ze(function () {
      var r = Oo(1, e.accBeta1),
          o = Oo(1, e.accBeta2);
      n.forEach(function (n, a) {
        var i = Lt.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Ze(function () {
            return Xn(i).variable(!1);
          })
        }), null == e.accumulatedSecondMoment[a] && (e.accumulatedSecondMoment[a] = {
          originalName: n + "/v",
          variable: Ze(function () {
            return Xn(i).variable(!1);
          })
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              c = e.accumulatedSecondMoment[a].variable,
              l = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = c.mul(e.beta2).add(s.square().mul(1 - e.beta2)),
              f = l.div(r),
              d = h.div(o);
          u.assign(l), c.assign(h);
          var p = f.div(d.sqrt().add(e.epsilon)).mul(-e.learningRate).add(i);
          i.assign(p);
        }
      }), e.accBeta1.assign(e.accBeta1.mul(e.beta1)), e.accBeta2.assign(e.accBeta2.mul(e.beta2));
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.accBeta1.dispose(), this.accBeta2.dispose(), null != this.accumulatedFirstMoment && tn(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedSecondMoment && tn(this.accumulatedSecondMoment.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedFirstMoment.concat(this.accumulatedSecondMoment), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e,
          n = this;
      return r(this, function (r) {
        switch (r.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = r.sent(), Ze(function () {
              n.accBeta1.assign(No(n.beta1, n.iterations_ + 1)), n.accBeta2.assign(No(n.beta2, n.iterations_ + 1));
            }), e = t.length / 2, !1, this.accumulatedFirstMoment = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedSecondMoment = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon);
  }, o.className = "Adam", o;
}(Xd);

exports.AdamOptimizer = Qd;
Hd(Qd);

var Jd = function (t) {
  function o(e, n, r, o, a) {
    void 0 === o && (o = null), void 0 === a && (a = 0);
    var i = t.call(this) || this;
    return i.learningRate = e, i.beta1 = n, i.beta2 = r, i.epsilon = o, i.decay = a, i.accumulatedFirstMoment = [], i.accumulatedWeightedInfNorm = [], Ze(function () {
      i.iteration = On(0).variable(), i.accBeta1 = On(n).variable();
    }), null == o && (i.epsilon = Lt.backend.epsilon()), i;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this,
        n = Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t);
    Ze(function () {
      var r = Oo(1, e.accBeta1),
          o = Bo(-e.learningRate, e.iteration.mul(e.decay).add(1));
      n.forEach(function (n, a) {
        var i = Lt.registeredVariables[n];
        null == e.accumulatedFirstMoment[a] && (e.accumulatedFirstMoment[a] = {
          originalName: n + "/m",
          variable: Xn(i).variable(!1)
        }), null == e.accumulatedWeightedInfNorm[a] && (e.accumulatedWeightedInfNorm[a] = {
          originalName: n + "/v",
          variable: Xn(i).variable(!1)
        });
        var s = Array.isArray(t) ? t[a].tensor : t[n];

        if (null != s) {
          var u = e.accumulatedFirstMoment[a].variable,
              c = e.accumulatedWeightedInfNorm[a].variable,
              l = u.mul(e.beta1).add(s.mul(1 - e.beta1)),
              h = c.mul(e.beta2),
              f = s.abs(),
              d = h.maximum(f);
          u.assign(l), c.assign(d);
          var p = o.div(r).mul(l.div(d.add(e.epsilon))).add(i);
          i.assign(p);
        }
      }), e.iteration.assign(e.iteration.add(1)), e.accBeta1.assign(e.accBeta1.mul(e.beta1));
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.accBeta1.dispose(), this.iteration.dispose(), null != this.accumulatedFirstMoment && tn(this.accumulatedFirstMoment.map(function (t) {
      return t.variable;
    })), null != this.accumulatedWeightedInfNorm && tn(this.accumulatedWeightedInfNorm.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("getWeights() is not implemented for Adamax yet.");
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        throw new Error("setWeights() is not implemented for Adamax yet.");
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      beta1: this.beta1,
      beta2: this.beta2,
      epsilon: this.epsilon,
      decay: this.decay
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.beta1, e.beta2, e.epsilon, e.decay);
  }, o.className = "Adamax", o;
}(Xd);

exports.AdamaxOptimizer = Jd;
Hd(Jd);

var Zd = function (t) {
  function o(e) {
    var n = t.call(this) || this;
    return n.learningRate = e, n.setLearningRate(e), n;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != o) {
        var a = Lt.registeredVariables[n];
        Ze(function () {
          var t = e.c.mul(o).add(a);
          a.assign(t);
        });
      }
    }), this.incrementIterations();
  }, o.prototype.setLearningRate = function (t) {
    this.learningRate = t, null != this.c && this.c.dispose(), this.c = en(On(-t));
  }, o.prototype.dispose = function () {
    this.c.dispose();
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()]];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            if (0 !== (t = e.sent()).length) throw new Error("SGD optimizer does not have settable weights.");
            return [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate);
  }, o.className = "SGD", o;
}(Xd);

exports.SGDOptimizer = Zd;
Hd(Zd);

var tp = function (t) {
  function o(e, n, r) {
    void 0 === r && (r = !1);
    var o = t.call(this, e) || this;
    return o.learningRate = e, o.momentum = n, o.useNesterov = r, o.accumulations = [], o.m = On(o.momentum), o;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Lt.registeredVariables[n];

      if (null == e.accumulations[r]) {
        e.accumulations[r] = {
          originalName: n + "/momentum",
          variable: Ze(function () {
            return Xn(o).variable(!1);
          })
        };
      }

      var a = e.accumulations[r].variable,
          i = Array.isArray(t) ? t[r].tensor : t[n];
      null != i && Ze(function () {
        var t,
            n = e.m.mul(a).add(i);
        t = e.useNesterov ? e.c.mul(i.add(n.mul(e.m))).add(o) : e.c.mul(n).add(o), a.assign(n), o.assign(t);
      });
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    this.m.dispose(), null != this.accumulations && tn(this.accumulations.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.setMomentum = function (t) {
    this.momentum = t;
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      return r(this, function (t) {
        switch (t.label) {
          case 0:
            return [4, this.saveIterations()];

          case 1:
            return [2, [t.sent()].concat(this.accumulations.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = e.sent(), !1, this.accumulations = t.map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      momentum: this.momentum,
      useNesterov: this.useNesterov
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.momentum, e.useNesterov);
  }, o.className = "Momentum", o;
}(Zd);

exports.MomentumOptimizer = tp;
Hd(tp);

var ep = function (t) {
  function o(e, n, r, o, a) {
    void 0 === n && (n = .9), void 0 === r && (r = 0), void 0 === o && (o = null), void 0 === a && (a = !1);
    var i = t.call(this) || this;
    if (i.learningRate = e, i.decay = n, i.momentum = r, i.epsilon = o, i.accumulatedMeanSquares = [], i.accumulatedMoments = [], i.accumulatedMeanGrads = [], i.centered = a, null == o && (i.epsilon = Lt.backend.epsilon()), null == e) throw new Error("learningRate for RMSPropOptimizer must be defined.");
    return i;
  }

  return e(o, t), o.prototype.applyGradients = function (t) {
    var e = this;
    (Array.isArray(t) ? t.map(function (t) {
      return t.name;
    }) : Object.keys(t)).forEach(function (n, r) {
      var o = Lt.registeredVariables[n];
      null == e.accumulatedMeanSquares[r] && (e.accumulatedMeanSquares[r] = {
        originalName: n + "/rms",
        variable: Ze(function () {
          return Xn(o).variable(!1);
        })
      }), null == e.accumulatedMoments[r] && (e.accumulatedMoments[r] = {
        originalName: n + "/momentum",
        variable: Ze(function () {
          return Xn(o).variable(!1);
        })
      }), null == e.accumulatedMeanGrads[r] && e.centered && (e.accumulatedMeanGrads[r] = {
        originalName: n + "/mg",
        variable: Ze(function () {
          return Xn(o).variable(!1);
        })
      });
      var a = Array.isArray(t) ? t[r].tensor : t[n];

      if (null != a) {
        var i = e.accumulatedMeanSquares[r].variable,
            s = e.accumulatedMoments[r].variable;
        Ze(function () {
          var t = i.mul(e.decay).add(a.square().mul(1 - e.decay));

          if (e.centered) {
            var n = e.accumulatedMeanGrads[r].variable,
                u = n.mul(e.decay).add(a.mul(1 - e.decay)),
                c = s.mul(e.momentum).add(a.mul(e.learningRate).div(t.sub(u.square().add(e.epsilon)).sqrt()));
            i.assign(t), n.assign(u), s.assign(c);
            var l = o.sub(c);
            o.assign(l);
          } else {
            var h = i.mul(e.decay).add(a.square().mul(1 - e.decay));
            c = s.mul(e.momentum).add(a.mul(e.learningRate).div(h.add(e.epsilon).sqrt()));
            i.assign(h), s.assign(c);
            l = o.sub(c);
            o.assign(l);
          }
        });
      }
    }), this.incrementIterations();
  }, o.prototype.dispose = function () {
    null != this.accumulatedMeanSquares && tn(this.accumulatedMeanSquares.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMeanGrads && this.centered && tn(this.accumulatedMeanGrads.map(function (t) {
      return t.variable;
    })), null != this.accumulatedMoments && tn(this.accumulatedMoments.map(function (t) {
      return t.variable;
    }));
  }, o.prototype.getWeights = function () {
    return n(this, void 0, void 0, function () {
      var t;
      return r(this, function (e) {
        switch (e.label) {
          case 0:
            return t = this.accumulatedMeanSquares.concat(this.accumulatedMoments), this.centered && t.push.apply(t, this.accumulatedMeanGrads), [4, this.saveIterations()];

          case 1:
            return [2, [e.sent()].concat(t.map(function (t) {
              return {
                name: t.originalName,
                tensor: t.variable
              };
            }))];
        }
      });
    });
  }, o.prototype.setWeights = function (t) {
    return n(this, void 0, void 0, function () {
      var e;
      return r(this, function (n) {
        switch (n.label) {
          case 0:
            return [4, this.extractIterations(t)];

          case 1:
            return t = n.sent(), e = this.centered ? t.length / 3 : t.length / 2, !1, this.accumulatedMeanSquares = t.slice(0, e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.accumulatedMoments = t.slice(e, 2 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            }), this.centered && (this.accumulatedMeanGrads = t.slice(2 * e, 3 * e).map(function (t) {
              return {
                originalName: t.name,
                variable: t.tensor.variable(!1)
              };
            })), [2];
        }
      });
    });
  }, o.prototype.getConfig = function () {
    return {
      learningRate: this.learningRate,
      decay: this.decay,
      momentum: this.momentum,
      epsilon: this.epsilon,
      centered: this.centered
    };
  }, o.fromConfig = function (t, e) {
    return new t(e.learningRate, e.decay, e.momentum, e.epsilon, e.centered);
  }, o.className = "RMSProp", o;
}(Xd);

exports.RMSPropOptimizer = ep;
Hd(ep);

var np = function () {
  function t() {}

  return t.sgd = function (t) {
    return new Zd(t);
  }, t.momentum = function (t, e, n) {
    return void 0 === n && (n = !1), new tp(t, e, n);
  }, t.rmsprop = function (t, e, n, r, o) {
    return void 0 === e && (e = .9), void 0 === n && (n = 0), void 0 === r && (r = null), void 0 === o && (o = !1), new ep(t, e, n, r, o);
  }, t.adam = function (t, e, n, r) {
    return void 0 === t && (t = .001), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), new Qd(t, e, n, r);
  }, t.adadelta = function (t, e, n) {
    return void 0 === t && (t = .001), void 0 === e && (e = .95), void 0 === n && (n = null), new Yd(t, e, n);
  }, t.adamax = function (t, e, n, r, o) {
    return void 0 === t && (t = .002), void 0 === e && (e = .9), void 0 === n && (n = .999), void 0 === r && (r = null), void 0 === o && (o = 0), new Jd(t, e, n, r, o);
  }, t.adagrad = function (t, e) {
    return void 0 === e && (e = .1), new $d(t, e);
  }, t;
}(),
    rp = {
  sgd: np.sgd,
  momentum: np.momentum,
  adadelta: np.adadelta,
  adagrad: np.adagrad,
  rmsprop: np.rmsprop,
  adamax: np.adamax,
  adam: np.adam
},
    op = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : "undefined" != typeof setImmediate ? setImmediate : function (t) {
  return t();
};

exports.train = rp;

function ap() {
  return new Promise(function (t) {
    return op(function () {
      return t();
    });
  });
}

wt.prototype.add = function (t) {
  return Or(this, t);
}, wt.prototype.broadcastTo = function (t) {
  return fc(this, t);
}, wt.prototype.div = function (t) {
  return Bo(this, t);
}, wt.prototype.divNoNan = function (t) {
  return bc(this, t);
}, wt.prototype.squaredDifference = function (t) {
  return Hc(this, t);
}, wt.prototype.tile = function (t) {
  return wc(this, t);
}, wt.prototype.oneHot = function (t, e, n) {
  return void 0 === e && (e = 1), void 0 === n && (n = 0), Rc(this, t, e, n);
}, wt.prototype.transpose = function (t) {
  return ua(this, t);
}, wt.prototype.pad = function (t, e) {
  return Ic(this, t, e);
}, wt.prototype.batchNorm = function (t, e, n, r, o) {
  return nc(this, t, e, n, r, o);
}, xt = ff;
},{"crypto":"node_modules/parcel-bundler/src/builtins/_empty.js","node-fetch":"node_modules/parcel-bundler/src/builtins/_empty.js","util":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGraphModel = loadGraphModel;
exports.deregisterOp = deregisterOp;
exports.registerOp = registerOp;
exports.version_converter = exports.GraphModel = void 0;

var _tfjsCore = require("@tensorflow/tfjs-core");

/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var DataType,
    SaverDef,
    __assign = function () {
  return (__assign = Object.assign || function (e) {
    for (var t, a = 1, r = arguments.length; a < r; a++) for (var n in t = arguments[a]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);

    return e;
  }).apply(this, arguments);
};

function __awaiter(e, t, a, r) {
  return new (a || (a = Promise))(function (n, s) {
    function o(e) {
      try {
        u(r.next(e));
      } catch (e) {
        s(e);
      }
    }

    function p(e) {
      try {
        u(r.throw(e));
      } catch (e) {
        s(e);
      }
    }

    function u(e) {
      e.done ? n(e.value) : new a(function (t) {
        t(e.value);
      }).then(o, p);
    }

    u((r = r.apply(e, t || [])).next());
  });
}

function __generator(e, t) {
  var a,
      r,
      n,
      s,
      o = {
    label: 0,
    sent: function () {
      if (1 & n[0]) throw n[1];
      return n[1];
    },
    trys: [],
    ops: []
  };
  return s = {
    next: p(0),
    throw: p(1),
    return: p(2)
  }, "function" == typeof Symbol && (s[Symbol.iterator] = function () {
    return this;
  }), s;

  function p(s) {
    return function (p) {
      return function (s) {
        if (a) throw new TypeError("Generator is already executing.");

        for (; o;) try {
          if (a = 1, r && (n = 2 & s[0] ? r.return : s[0] ? r.throw || ((n = r.return) && n.call(r), 0) : r.next) && !(n = n.call(r, s[1])).done) return n;

          switch (r = 0, n && (s = [2 & s[0], n.value]), s[0]) {
            case 0:
            case 1:
              n = s;
              break;

            case 4:
              return o.label++, {
                value: s[1],
                done: !1
              };

            case 5:
              o.label++, r = s[1], s = [0];
              continue;

            case 7:
              s = o.ops.pop(), o.trys.pop();
              continue;

            default:
              if (!(n = (n = o.trys).length > 0 && n[n.length - 1]) && (6 === s[0] || 2 === s[0])) {
                o = 0;
                continue;
              }

              if (3 === s[0] && (!n || s[1] > n[0] && s[1] < n[3])) {
                o.label = s[1];
                break;
              }

              if (6 === s[0] && o.label < n[1]) {
                o.label = n[1], n = s;
                break;
              }

              if (n && o.label < n[2]) {
                o.label = n[2], o.ops.push(s);
                break;
              }

              n[2] && o.ops.pop(), o.trys.pop();
              continue;
          }

          s = t.call(e, o);
        } catch (e) {
          s = [6, e], r = 0;
        } finally {
          a = n = 0;
        }

        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([s, p]);
    };
  }
}

!function (e) {
  e[e.DT_INVALID = 0] = "DT_INVALID", e[e.DT_FLOAT = 1] = "DT_FLOAT", e[e.DT_DOUBLE = 2] = "DT_DOUBLE", e[e.DT_INT32 = 3] = "DT_INT32", e[e.DT_UINT8 = 4] = "DT_UINT8", e[e.DT_INT16 = 5] = "DT_INT16", e[e.DT_INT8 = 6] = "DT_INT8", e[e.DT_STRING = 7] = "DT_STRING", e[e.DT_COMPLEX64 = 8] = "DT_COMPLEX64", e[e.DT_INT64 = 9] = "DT_INT64", e[e.DT_BOOL = 10] = "DT_BOOL", e[e.DT_QINT8 = 11] = "DT_QINT8", e[e.DT_QUINT8 = 12] = "DT_QUINT8", e[e.DT_QINT32 = 13] = "DT_QINT32", e[e.DT_BFLOAT16 = 14] = "DT_BFLOAT16", e[e.DT_FLOAT_REF = 101] = "DT_FLOAT_REF", e[e.DT_DOUBLE_REF = 102] = "DT_DOUBLE_REF", e[e.DT_INT32_REF = 103] = "DT_INT32_REF", e[e.DT_UINT8_REF = 104] = "DT_UINT8_REF", e[e.DT_INT16_REF = 105] = "DT_INT16_REF", e[e.DT_INT8_REF = 106] = "DT_INT8_REF", e[e.DT_STRING_REF = 107] = "DT_STRING_REF", e[e.DT_COMPLEX64_REF = 108] = "DT_COMPLEX64_REF", e[e.DT_INT64_REF = 109] = "DT_INT64_REF", e[e.DT_BOOL_REF = 110] = "DT_BOOL_REF", e[e.DT_QINT8_REF = 111] = "DT_QINT8_REF", e[e.DT_QUINT8_REF = 112] = "DT_QUINT8_REF", e[e.DT_QINT32_REF = 113] = "DT_QINT32_REF", e[e.DT_BFLOAT16_REF = 114] = "DT_BFLOAT16_REF";
}(DataType || (DataType = {})), function (e) {
  !function (e) {
    e[e.LEGACY = 0] = "LEGACY", e[e.V1 = 1] = "V1", e[e.V2 = 2] = "V2";
  }(e.CheckpointFormatVersion || (e.CheckpointFormatVersion = {}));
}(SaverDef || (SaverDef = {}));
var CUSTOM_OPS = {};

function registerOp(e, t) {
  var a = {
    tfOpName: e,
    category: "custom",
    inputs: [],
    attrs: [],
    customExecutor: t
  };
  CUSTOM_OPS[e] = a;
}

function getRegisteredOp(e) {
  return CUSTOM_OPS[e];
}

function deregisterOp(e) {
  delete CUSTOM_OPS[e];
}

function getParamValue(e, t, a, r) {
  var n = t.inputParams[e];

  if (n && void 0 !== n.inputIndexStart) {
    var s = n.inputIndexStart,
        o = 0 === n.inputIndexEnd ? void 0 : void 0 === n.inputIndexEnd ? s + 1 : n.inputIndexEnd;
    if ("tensor" === n.type) return getTensor(t.inputNames[n.inputIndexStart], a, r);
    if ("tensors" === n.type) return t.inputNames.slice(s, o).map(function (e) {
      return getTensor(e, a, r);
    });
    var p = Array.prototype.slice.call(getTensor(t.inputNames.slice(s)[0], a, r).dataSync());
    return "number" === n.type ? p[0] : p;
  }

  var u = t.attrParams[e];
  return u && u.value;
}

function getTensor(e, t, a) {
  var r = parseNodeName(e),
      n = r[0],
      s = r[1],
      o = a.currentContextIds.find(function (e) {
    return !!t[getNodeNameWithContextId(n, e)];
  });
  return void 0 !== o ? t[getNodeNameWithContextId(n, o)][s] : void 0;
}

function getTensorsForCurrentContenxt(e, t, a) {
  return t[getNodeNameWithContextId(e, a.currentContextId)];
}

function getNodeNameAndIndex(e, t) {
  var a = parseNodeName(e),
      r = a[0],
      n = a[1];
  return [getNodeNameWithContextId(r, t && t.currentContextId), n];
}

function getNodeNameWithContextId(e, t) {
  return t ? e + "-" + t : e;
}

function parseNodeName(e) {
  var t = e.lastIndexOf(":");
  return -1 === t ? [e, 0] : [e.substring(0, t), Number(e.substring(t + 1))];
}

function split$1(e, t) {
  for (var a = [], r = 0; r < e.length; r += t) a.push(e.slice(r, r + t));

  return a;
}

var json = [{
  tfOpName: "Add",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AddV2",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AddN",
  category: "arithmetic",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "BiasAdd",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sub",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "RealDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Div",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "DivNoNan",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorDiv",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mul",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Maximum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Minimum",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }]
}, {
  tfOpName: "Pow",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "SquaredDifference",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Mod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "FloorMod",
  category: "arithmetic",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    arithmetic = Object.freeze({
  json: json
}),
    json$1 = [{
  tfOpName: "Abs",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atan2",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ceil",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ClipByValue",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "clip_value_min",
    name: "clipValueMin",
    type: "number"
  }, {
    tfName: "clip_value_max",
    name: "clipValueMax",
    type: "number"
  }]
}, {
  tfOpName: "Complex",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "real",
    type: "tensor"
  }, {
    start: 1,
    name: "imag",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ComplexAbs",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Cos",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Cosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Elu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Exp",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Floor",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Imag",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "Tout",
    name: "outputType",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Neg",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Real",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "Tout",
    name: "outputType",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Prelu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "alpha",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Relu6",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "clipValueMin",
    name: "clipValueMin",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "clipValueMax",
    name: "clipValueMax",
    type: "number",
    defaultValue: 6
  }]
}, {
  tfOpName: "Selu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sigmoid",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sin",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Rsqrt",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Square",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tan",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Tanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Sign",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Round",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Expm1",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Log1p",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Reciprocal",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Softplus",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Asinh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Acosh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Atanh",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Erf",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Prod",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axes",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LeakyRelu",
  category: "basic_math",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: .2
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    basicMath = Object.freeze({
  json: json$1
}),
    json$2 = [{
  tfOpName: "LoopCond",
  category: "control",
  inputs: [{
    start: 0,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Switch",
  category: "control",
  inputs: [{
    start: 0,
    name: "data",
    type: "tensor"
  }, {
    start: 1,
    name: "pred",
    type: "tensor"
  }]
}, {
  tfOpName: "Merge",
  category: "control",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }]
}, {
  tfOpName: "Enter",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "frame_name",
    name: "frameName",
    type: "string"
  }, {
    tfName: "is_constant",
    name: "isConstant",
    type: "bool"
  }]
}, {
  tfOpName: "Exit",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NextIteration",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "size",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }, {
    tfName: "dynamic_size",
    name: "dynamicSize",
    type: "bool"
  }, {
    tfName: "clear_after_read",
    name: "clearAfterRead",
    type: "bool"
  }, {
    tfName: "identical_element_shapes",
    name: "identicalElementShapes",
    type: "bool"
  }, {
    tfName: "tensor_array_name",
    name: "name",
    type: "string"
  }]
}, {
  tfOpName: "TensorArrayWriteV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayReadV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "index",
    type: "number"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArrayGatherV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape",
    name: "elementShape",
    type: "shape"
  }]
}, {
  tfOpName: "TensorArrayScatterV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "indices",
    type: "number[]"
  }, {
    start: 2,
    name: "tensor",
    type: "tensor"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArrayConcatV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "element_shape_except0",
    name: "elementShapeExcept0",
    type: "shape",
    notSupported: !0
  }]
}, {
  tfOpName: "TensorArraySplitV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "tensor",
    type: "tensor"
  }, {
    start: 2,
    name: "lengths",
    type: "number[]"
  }, {
    start: 3,
    name: "flowIn",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TensorArraySizeV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }, {
    start: 1,
    name: "flowIn",
    type: "number"
  }]
}, {
  tfOpName: "TensorArrayCloseV3",
  category: "control",
  inputs: [{
    start: 0,
    name: "tensorArrayId",
    type: "number"
  }]
}],
    control = Object.freeze({
  json: json$2
}),
    json$3 = [{
  tfOpName: "AvgPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPool",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPoolWithArgmax",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "include_batch_in_index",
    name: "includeBatchInIndex",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "AvgPool3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MaxPool3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }, {
    tfName: "ksize",
    name: "kernelSize",
    type: "number[]"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Conv1D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "stride",
    name: "stride",
    type: "number"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NWC"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "dilation",
    name: "dilation",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "Conv2D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "useCudnnOnGpu",
    name: "useCudnnOnGpu",
    type: "bool"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "_FusedConv2D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 2,
    end: 0,
    name: "args",
    type: "tensors"
  }],
  attrs: [{
    tfName: "num_args",
    name: "numArgs",
    type: "number"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "explicit_paddings",
    name: "explicitPaddings",
    type: "number[]",
    defaultValue: []
  }, {
    tfName: "use_cudnn_on_gpu",
    name: "useCudnnOnGpu",
    type: "bool",
    defaultValue: !0
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]",
    defaultValue: [1, 1, 1, 1]
  }, {
    tfName: "fused_ops",
    name: "fusedOps",
    type: "string[]",
    defaultValue: []
  }, {
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: 1e-4
  }]
}, {
  tfOpName: "Conv2DBackpropInput",
  category: "convolution",
  inputs: [{
    start: 2,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 0,
    name: "outputShape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "DepthwiseConv2d",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthwiseConv2dNative",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "input",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}, {
  tfOpName: "FusedDepthwiseConv2dNative",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }, {
    start: 2,
    end: 0,
    name: "args",
    type: "tensors"
  }],
  attrs: [{
    tfName: "num_args",
    name: "numArgs",
    type: "number"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]",
    defaultValue: [1, 1, 1, 1]
  }, {
    tfName: "fused_ops",
    name: "fusedOps",
    type: "string[]",
    defaultValue: []
  }]
}, {
  tfOpName: "Conv3D",
  category: "convolution",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "filter",
    type: "tensor"
  }],
  attrs: [{
    tfName: "strides",
    name: "strides",
    type: "number[]"
  }, {
    tfName: "padding",
    name: "pad",
    type: "string"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    defaultValue: "NHWC"
  }, {
    tfName: "dilations",
    name: "dilations",
    type: "number[]"
  }]
}],
    convolution = Object.freeze({
  json: json$3
}),
    json$4 = [{
  tfOpName: "Fill",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }, {
    start: 1,
    name: "value",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "LinSpace",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "num",
    type: "number"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "OneHot",
  category: "creation",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "depth",
    type: "number"
  }, {
    start: 2,
    name: "onValue",
    type: "number",
    defaultValue: 1
  }, {
    start: 3,
    name: "offValue",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    notSupported: !0
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Ones",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "OnesLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "RandomUniform",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "minval",
    name: "minval",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "maxval",
    name: "maxval",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "seed",
    name: "seed",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Range",
  category: "creation",
  inputs: [{
    start: 0,
    name: "start",
    type: "number"
  }, {
    start: 1,
    name: "stop",
    type: "number"
  }, {
    start: 2,
    name: "step",
    type: "number",
    defaultValue: 0
  }],
  attrs: [{
    tfName: "Tidx",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "TruncatedNormal",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "means",
    name: "mean",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "stddev",
    name: "stdDev",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "seed",
    name: "seed",
    type: "number"
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "T",
    name: "T",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "Zeros",
  category: "creation",
  inputs: [{
    start: 0,
    name: "shape",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ZerosLike",
  category: "creation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Multinomial",
  category: "creation",
  inputs: [{
    start: 0,
    name: "logits",
    type: "tensor"
  }, {
    start: 1,
    name: "numSamples",
    type: "number"
  }],
  attrs: [{
    tfName: "seed",
    name: "seed",
    type: "number"
  }, {
    tfName: "seed2",
    name: "seed2",
    type: "number"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype"
  }, {
    tfName: "output_dtype",
    name: "output_dtype",
    type: "dtype"
  }]
}],
    creation = Object.freeze({
  json: json$4
}),
    json$5 = [{
  tfOpName: "NonMaxSuppressionV2",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }]
}, {
  tfOpName: "NonMaxSuppressionV3",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }, {
    start: 4,
    name: "scoreThreshold",
    type: "number"
  }]
}, {
  tfOpName: "NonMaxSuppressionV5",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "boxes",
    type: "tensor"
  }, {
    start: 1,
    name: "scores",
    type: "tensor"
  }, {
    start: 2,
    name: "maxOutputSize",
    type: "number"
  }, {
    start: 3,
    name: "iouThreshold",
    type: "number"
  }, {
    start: 4,
    name: "scoreThreshold",
    type: "number"
  }, {
    start: 5,
    name: "softNmsSigma",
    type: "number"
  }]
}, {
  tfOpName: "Where",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ListDiff",
  category: "dynamic",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "y",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    dynamic = Object.freeze({
  json: json$5
}),
    json$6 = [{
  tfOpName: "TopKV2",
  category: "evaluation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "k",
    type: "number"
  }],
  attrs: [{
    tfName: "sorted",
    name: "sorted",
    type: "bool"
  }]
}],
    evaluation = Object.freeze({
  json: json$6
}),
    json$7 = [{
  tfOpName: "PlaceholderWithDefault",
  category: "graph",
  inputs: [{
    start: 0,
    name: "default",
    type: "tensor"
  }],
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Placeholder",
  category: "graph",
  attrs: [{
    tfName: "shape",
    name: "shape",
    type: "shape"
  }, {
    tfName: "dtype",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "Const",
  category: "graph"
}, {
  tfOpName: "Identity",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IdentityN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Snapshot",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Rank",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Size",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "Shape",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "ShapeN",
  category: "graph",
  inputs: [{
    start: 0,
    end: 0,
    name: "x",
    type: "tensors"
  }]
}, {
  tfOpName: "Print",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "data",
    type: "tensors"
  }],
  attrs: [{
    tfName: "message",
    name: "message",
    type: "string"
  }, {
    tfName: "first_n",
    name: "firstN",
    type: "number",
    notSupported: !0
  }, {
    tfName: "summarize",
    name: "summarize",
    type: "number",
    defaultValue: 3
  }]
}, {
  tfOpName: "NoOp",
  category: "graph",
  inputs: []
}, {
  tfOpName: "StopGradient",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "FakeQuantWithMinMaxVars",
  category: "graph",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "min",
    name: "min",
    type: "number"
  }, {
    tfName: "max",
    name: "max",
    type: "number"
  }]
}],
    graph = Object.freeze({
  json: json$7
}),
    json$8 = [{
  tfOpName: "ResizeBilinear",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "ResizeNearestNeighbor",
  category: "image",
  inputs: [{
    start: 0,
    name: "images",
    type: "tensor"
  }, {
    start: 1,
    name: "size",
    type: "number[]"
  }],
  attrs: [{
    tfName: "align_corners",
    name: "alignCorners",
    type: "bool"
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "CropAndResize",
  category: "image",
  inputs: [{
    start: 0,
    name: "image",
    type: "tensor"
  }, {
    start: 1,
    name: "boxes",
    type: "tensor"
  }, {
    start: 2,
    name: "boxInd",
    type: "tensor"
  }, {
    start: 3,
    name: "cropSize",
    type: "number[]"
  }],
  attrs: [{
    tfName: "method",
    name: "method",
    type: "string"
  }, {
    tfName: "extrapolation_value",
    name: "extrapolationValue",
    type: "number"
  }]
}],
    image$1 = Object.freeze({
  json: json$8
}),
    json$9 = [{
  tfOpName: "Equal",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "NotEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Greater",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "GreaterEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Less",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LessEqual",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalAnd",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalNot",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "LogicalOr",
  category: "logical",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Select",
  category: "logical",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }, {
    start: 1,
    name: "a",
    type: "tensor"
  }, {
    start: 2,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "SelectV2",
  category: "logical",
  inputs: [{
    start: 0,
    name: "condition",
    type: "tensor"
  }, {
    start: 1,
    name: "a",
    type: "tensor"
  }, {
    start: 2,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    logical = Object.freeze({
  json: json$9
}),
    json$10 = [{
  tfOpName: "_FusedMatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }, {
    start: 2,
    end: 0,
    name: "args",
    type: "tensors"
  }],
  attrs: [{
    tfName: "num_args",
    name: "numArgs",
    type: "number"
  }, {
    tfName: "fused_ops",
    name: "fusedOps",
    type: "string[]",
    defaultValue: []
  }, {
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: 1e-4
  }, {
    tfName: "transpose_a",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "transpose_b",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "MatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "transpose_a",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "transpose_b",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "BatchMatMul",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "adj_x",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "adj_y",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "BatchMatMulV2",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "a",
    type: "tensor"
  }, {
    start: 1,
    name: "b",
    type: "tensor"
  }],
  attrs: [{
    tfName: "adj_x",
    name: "transposeA",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "adj_y",
    name: "transposeB",
    type: "bool",
    defaultValue: !1
  }, {
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}, {
  tfOpName: "Transpose",
  category: "matrices",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "perm",
    type: "number[]"
  }],
  attrs: [{
    tfName: "T",
    name: "dtype",
    type: "dtype",
    notSupported: !0
  }]
}],
    matrices = Object.freeze({
  json: json$10
}),
    json$11 = [{
  tfOpName: "FusedBatchNorm",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "FusedBatchNormV2",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "FusedBatchNormV3",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "scale",
    type: "tensor"
  }, {
    start: 2,
    name: "offset",
    type: "tensor"
  }, {
    start: 3,
    name: "mean",
    type: "tensor"
  }, {
    start: 4,
    name: "variance",
    type: "tensor"
  }],
  attrs: [{
    tfName: "epsilon",
    name: "epsilon",
    type: "number",
    defaultValue: .001
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string",
    notSupported: !0
  }]
}, {
  tfOpName: "LRN",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "depth_radius",
    name: "radius",
    type: "number",
    defaultValue: 5
  }, {
    tfName: "bias",
    name: "bias",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "alpha",
    name: "alpha",
    type: "number",
    defaultValue: 1
  }, {
    tfName: "beta",
    name: "beta",
    type: "number",
    defaultValue: .5
  }]
}, {
  tfOpName: "Softmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "LogSoftmax",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "normalization",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !0,
    notSupported: !0
  }]
}],
    normalization = Object.freeze({
  json: json$11
}),
    json$12 = [{
  tfOpName: "Max",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Mean",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Min",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Sum",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "All",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "Any",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}, {
  tfOpName: "ArgMax",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "ArgMin",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Prod",
  category: "reduction",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }],
  attrs: [{
    tfName: "keep_dims",
    name: "keepDims",
    type: "bool"
  }]
}],
    reduction = Object.freeze({
  json: json$12
}),
    json$13 = [{
  tfOpName: "ConcatV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: -1,
    name: "tensors",
    type: "tensors"
  }, {
    start: -1,
    name: "axis",
    type: "number"
  }],
  attrs: [{
    tfName: "N",
    name: "n",
    type: "number",
    defaultValue: 2
  }]
}, {
  tfOpName: "Concat",
  category: "slice_join",
  inputs: [{
    start: 1,
    end: 0,
    name: "tensors",
    type: "tensors"
  }, {
    start: 0,
    name: "axis",
    type: "number"
  }],
  attrs: [{
    tfName: "N",
    name: "n",
    type: "number",
    defaultValue: 2
  }]
}, {
  tfOpName: "GatherV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Gather",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "Reverse",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "dims",
    type: "bool",
    notSupported: !0
  }]
}, {
  tfOpName: "ReverseV2",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "Slice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "size",
    type: "number[]"
  }]
}, {
  tfOpName: "StridedSlice",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "begin",
    type: "number[]"
  }, {
    start: 2,
    name: "end",
    type: "number[]"
  }, {
    start: 3,
    name: "strides",
    type: "number[]"
  }],
  attrs: [{
    tfName: "begin_mask",
    name: "beginMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "end_mask",
    name: "endMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "new_axis_mask",
    name: "newAxisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "ellipsis_mask",
    name: "ellipsisMask",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "shrink_axis_mask",
    name: "shrinkAxisMask",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Pack",
  category: "slice_join",
  inputs: [{
    start: 0,
    end: 0,
    name: "tensors",
    type: "tensors"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Unpack",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "tensor",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    tfName: "num",
    name: "num",
    type: "number",
    defaultValue: 0,
    notSupported: !0
  }]
}, {
  tfOpName: "Tile",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "reps",
    type: "number[]"
  }]
}, {
  tfOpName: "Split",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "axis",
    type: "number",
    defaultValue: 0
  }, {
    start: 1,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "num_split",
    name: "numOrSizeSplits",
    type: "number",
    defaultValue: 1
  }]
}, {
  tfOpName: "SplitV",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "numOrSizeSplits",
    type: "number[]"
  }, {
    start: 2,
    name: "axis",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "ScatterNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "indices",
    type: "tensor"
  }, {
    start: 1,
    name: "values",
    type: "tensor"
  }, {
    start: 2,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "GatherNd",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "indices",
    type: "tensor"
  }]
}, {
  tfOpName: "SparseToDense",
  category: "slice_join",
  inputs: [{
    start: 0,
    name: "sparseIndices",
    type: "tensor"
  }, {
    start: 1,
    name: "outputShape",
    type: "number[]"
  }, {
    start: 2,
    name: "sparseValues",
    type: "tensor"
  }, {
    start: 3,
    name: "defaultValue",
    type: "tensor"
  }],
  attrs: [{
    tfName: "validate_indices",
    name: "validateIndices",
    type: "bool",
    defaultValue: !1,
    notSupported: !0
  }]
}],
    sliceJoin = Object.freeze({
  json: json$13
}),
    json$14 = [{
  tfOpName: "FFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "IFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }]
}, {
  tfOpName: "RFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}, {
  tfOpName: "IRFFT",
  category: "spectral",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "fft_length",
    type: "number",
    notSupported: !0
  }]
}],
    spectral = Object.freeze({
  json: json$14
}),
    json$15 = [{
  tfOpName: "Cast",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "SrcT",
    name: "sdtype",
    type: "dtype",
    notSupported: !0
  }, {
    tfName: "DstT",
    name: "dtype",
    type: "dtype"
  }]
}, {
  tfOpName: "ExpandDims",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "axis",
    type: "number"
  }]
}, {
  tfOpName: "Pad",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }],
  attrs: [{
    tfName: "constant_value",
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "PadV2",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "padding",
    type: "number[]"
  }, {
    start: 2,
    name: "constantValue",
    type: "number",
    defaultValue: 0
  }]
}, {
  tfOpName: "Reshape",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "shape",
    type: "number[]"
  }]
}, {
  tfOpName: "Squeeze",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "axis",
    tfDeprecatedName: "squeeze_dims",
    name: "axis",
    type: "number[]"
  }]
}, {
  tfOpName: "SpaceToBatchND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "paddings",
    type: "number[]"
  }]
}, {
  tfOpName: "BatchToSpaceND",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }, {
    start: 1,
    name: "blockShape",
    type: "number[]"
  }, {
    start: 2,
    name: "crops",
    type: "number[]"
  }]
}, {
  tfOpName: "DepthToSpace",
  category: "transformation",
  inputs: [{
    start: 0,
    name: "x",
    type: "tensor"
  }],
  attrs: [{
    tfName: "block_size",
    name: "blockSize",
    type: "number"
  }, {
    tfName: "data_format",
    name: "dataFormat",
    type: "string"
  }]
}],
    transformation = Object.freeze({
  json: json$15
}),
    OperationMapper = function () {
  function e() {
    var e = [arithmetic, basicMath, control, convolution, creation, dynamic, evaluation, logical, image$1, graph, matrices, normalization, reduction, sliceJoin, spectral, transformation],
        t = [].concat.apply([], e.map(function (e) {
      return e.json;
    }));
    this.opMappers = t.reduce(function (e, t) {
      return e[t.tfOpName] = t, e;
    }, {});
  }

  return Object.defineProperty(e, "Instance", {
    get: function () {
      return this._instance || (this._instance = new this());
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.transformGraph = function (e, t) {
    var a = this;
    void 0 === t && (t = {});
    var r = [],
        n = [],
        s = e.node.reduce(function (e, t) {
      return e[t.name] = a.mapNode(t), t.op.startsWith("Placeholder") && r.push(e[t.name]), "Const" === t.op && n.push(e[t.name]), e;
    }, {}),
        o = [],
        p = [],
        u = {},
        i = {};
    null != t && (u = this.mapSignatureEntries(t.inputs), i = this.mapSignatureEntries(t.outputs));
    var m = Object.keys(s);
    return m.forEach(function (e) {
      var t = s[e];
      t.inputNames.forEach(function (e) {
        var a = getNodeNameAndIndex(e)[0];
        t.inputs.push(s[a]), s[a].children.push(t);
      });
    }), 0 === Object.keys(i).length ? m.forEach(function (e) {
      var t = s[e];
      0 === t.children.length && p.push(t);
    }) : Object.keys(i).forEach(function (e) {
      var t = getNodeNameAndIndex(e)[0],
          a = s[t];
      null != a && (a.signatureKey = i[e], p.push(a));
    }), Object.keys(u).length > 0 ? Object.keys(u).forEach(function (e) {
      var t = getNodeNameAndIndex(e)[0],
          a = s[t];
      a && (a.signatureKey = u[e], o.push(a));
    }) : o = r, {
      nodes: s,
      inputs: o,
      outputs: p,
      weights: n,
      placeholders: r,
      signature: t
    };
  }, e.prototype.mapSignatureEntries = function (e) {
    return Object.keys(e || {}).reduce(function (t, a) {
      return t[e[a].name] = a, t;
    }, {});
  }, e.prototype.mapNode = function (e) {
    var t = getRegisteredOp(e.op) || this.opMappers[e.op] || {};
    null == e.attr && (e.attr = {});
    var a = {
      name: e.name,
      op: e.op,
      category: t.category,
      inputNames: (e.input || []).map(function (e) {
        return e.startsWith("^") ? e.substr(1) : e;
      }),
      inputs: [],
      children: [],
      inputParams: {},
      attrParams: {},
      rawAttrs: e.attr
    };
    return null != t.inputs && (a.inputParams = t.inputs.reduce(function (e, t) {
      return e[t.name] = {
        type: t.type,
        inputIndexStart: t.start,
        inputIndexEnd: t.end
      }, e;
    }, {})), null != t.attrs && (a.attrParams = t.attrs.reduce(function (t, a) {
      var r = a.type,
          n = void 0;

      switch (a.type) {
        case "string":
          void 0 === (n = getStringParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "string[]":
          void 0 === (n = getStringArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getStringArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number":
          void 0 === (n = getNumberParam(e.attr, a.tfName, a.defaultValue || 0)) && a.tfDeprecatedName && (n = getNumberParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "number[]":
          void 0 === (n = getNumericArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getNumericArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool":
          void 0 === (n = getBoolParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "bool[]":
          void 0 === (n = getBoolArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getBoolArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape":
          void 0 === (n = getTensorShapeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "shape[]":
          void 0 === (n = getTensorShapeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getTensorShapeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype":
          void 0 === (n = getDtypeParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "dtype[]":
          void 0 === (n = getDtypeArrayParam(e.attr, a.tfName, a.defaultValue)) && a.tfDeprecatedName && (n = getDtypeArrayParam(e.attr, a.tfDeprecatedName, a.defaultValue));
          break;

        case "tensor":
        case "tensors":
          break;

        default:
          throw new Error("Unsupported param type: " + a.type + " for op: " + e.op);
      }

      return t[a.name] = {
        value: n,
        type: r
      }, t;
    }, {})), a;
  }, e;
}();

function decodeBase64(e) {
  var t = (0, _tfjsCore.env)().global;
  if (void 0 !== t.atob) return t.atob(e);
  if ("undefined" != typeof Buffer) return new Buffer(e, "base64").toString();
  throw new Error("Unable to decode base64 in this environment. Missing built-in atob() or Buffer()");
}

function parseStringParam(e, t) {
  var a = Array.isArray(e) ? String.fromCharCode.apply(null, e) : decodeBase64(e);
  return t ? a : a.toLowerCase();
}

function getStringParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return null != n ? parseStringParam(n.s, r) : a;
}

function getBoolParam(e, t, a) {
  var r = e[t];
  return r ? r.b : a;
}

function getNumberParam(e, t, a) {
  var r = e[t] || {},
      n = null != r.i ? r.i : null != r.f ? r.f : a;
  return "number" == typeof n ? n : parseInt(n, 10);
}

function parseDtypeParam(e) {
  switch ("string" == typeof e && (e = DataType[e]), e) {
    case DataType.DT_FLOAT:
      return "float32";

    case DataType.DT_INT32:
    case DataType.DT_INT64:
    case DataType.DT_INT8:
    case DataType.DT_UINT8:
      return "int32";

    case DataType.DT_BOOL:
      return "bool";

    case DataType.DT_DOUBLE:
      return "float32";

    case DataType.DT_STRING:
      return "string";

    default:
      return null;
  }
}

function getDtypeParam(e, t, a) {
  var r = e[t];
  return r && r.type ? parseDtypeParam(r.type) : a;
}

function getDtypeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.type ? r.list.type.map(function (e) {
    return parseDtypeParam(e);
  }) : a;
}

function parseTensorShapeParam(e) {
  if (!e.unknownRank) return null != e.dim ? e.dim.map(function (e) {
    return "number" == typeof e.size ? e.size : parseInt(e.size, 10);
  }) : [];
}

function getTensorShapeParam(e, t, a) {
  var r = e[t];
  return r && r.shape ? parseTensorShapeParam(r.shape) : a;
}

function getNumericArrayParam(e, t, a) {
  var r = e[t];
  return r ? ((r.list.f && r.list.f.length ? r.list.f : r.list.i) || []).map(function (e) {
    return "number" == typeof e ? e : parseInt(e, 10);
  }) : a;
}

function getStringArrayParam(e, t, a, r) {
  void 0 === r && (r = !1);
  var n = e[t];
  return n && n.list && n.list.s ? n.list.s.map(function (e) {
    return parseStringParam(e, r);
  }) : a;
}

function getTensorShapeArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.shape ? r.list.shape.map(function (e) {
    return parseTensorShapeParam(e);
  }) : a;
}

function getBoolArrayParam(e, t, a) {
  var r = e[t];
  return r && r.list && r.list.b ? r.list.b : a;
}

var NodeValueImpl = function () {
  function e(e, t, a) {
    var r = this;
    this.node = e, this.tensorMap = t, this.context = a, this.inputs = [], this.attrs = {}, this.inputs = e.inputNames.map(function (e) {
      return r.getInput(e);
    }), null != e.rawAttrs && (this.attrs = Object.keys(e.rawAttrs).reduce(function (e, t) {
      return e[t] = r.getAttr(t), e;
    }, {}));
  }

  return e.prototype.getInput = function (e) {
    return getTensor(e, this.tensorMap, this.context);
  }, e.prototype.getAttr = function (e, t) {
    var a = this.node.rawAttrs[e];
    if (null != a.tensor) return getTensor(e, this.tensorMap, this.context);
    if (null != a.i || null != a.f) return getNumberParam(this.node.rawAttrs, e, t);
    if (null != a.s) return getStringParam(this.node.rawAttrs, e, t);
    if (null != a.b) return getBoolParam(this.node.rawAttrs, e, t);
    if (null != a.shape) return getTensorShapeParam(this.node.rawAttrs, e, t);
    if (null != a.type) return getDtypeParam(this.node.rawAttrs, e, t);

    if (null != a.list) {
      if (null != a.list.i || null != a.list.f) return getNumericArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.s) return getStringArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.shape) return getTensorShapeArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.b) return getBoolArrayParam(this.node.rawAttrs, e, t);
      if (null != a.list.type) return getDtypeArrayParam(this.node.rawAttrs, e, t);
    }

    return t;
  }, e;
}(),
    executeOp = function (e, t, a) {
  switch (e.op) {
    case "BiasAdd":
    case "AddV2":
    case "Add":
      return [(0, _tfjsCore.add)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "AddN":
      return [(0, _tfjsCore.addN)(getParamValue("tensors", e, t, a))];

    case "FloorMod":
    case "Mod":
      return [(0, _tfjsCore.mod)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Mul":
      return [(0, _tfjsCore.mul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "RealDiv":
    case "Div":
      return [(0, _tfjsCore.div)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "DivNoNan":
      return [(0, _tfjsCore.divNoNan)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "FloorDiv":
      return [(0, _tfjsCore.floorDiv)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Sub":
      return [(0, _tfjsCore.sub)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Minimum":
      return [(0, _tfjsCore.minimum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Maximum":
      return [(0, _tfjsCore.maximum)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Pow":
      return [(0, _tfjsCore.pow)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "SquaredDifference":
      return [(0, _tfjsCore.squaredDifference)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$1 = function (e, t, a) {
  switch (e.op) {
    case "Abs":
    case "ComplexAbs":
      return [(0, _tfjsCore.abs)(getParamValue("x", e, t, a))];

    case "Acos":
      return [(0, _tfjsCore.acos)(getParamValue("x", e, t, a))];

    case "Acosh":
      return [(0, _tfjsCore.acosh)(getParamValue("x", e, t, a))];

    case "Asin":
      return [(0, _tfjsCore.asin)(getParamValue("x", e, t, a))];

    case "Asinh":
      return [(0, _tfjsCore.asinh)(getParamValue("x", e, t, a))];

    case "Atan":
      return [(0, _tfjsCore.atan)(getParamValue("x", e, t, a))];

    case "Atan2":
      return [(0, _tfjsCore.atan2)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

    case "Atanh":
      return [(0, _tfjsCore.atanh)(getParamValue("x", e, t, a))];

    case "Ceil":
      return [(0, _tfjsCore.ceil)(getParamValue("x", e, t, a))];

    case "Complex":
      return [(0, _tfjsCore.complex)(getParamValue("real", e, t, a), getParamValue("imag", e, t, a))];

    case "Cos":
      return [(0, _tfjsCore.cos)(getParamValue("x", e, t, a))];

    case "Cosh":
      return [(0, _tfjsCore.cosh)(getParamValue("x", e, t, a))];

    case "Elu":
      return [(0, _tfjsCore.elu)(getParamValue("x", e, t, a))];

    case "Erf":
      return [(0, _tfjsCore.erf)(getParamValue("x", e, t, a))];

    case "Exp":
      return [(0, _tfjsCore.exp)(getParamValue("x", e, t, a))];

    case "Expm1":
      return [(0, _tfjsCore.expm1)(getParamValue("x", e, t, a))];

    case "Floor":
      return [(0, _tfjsCore.floor)(getParamValue("x", e, t, a))];

    case "Log":
      return [(0, _tfjsCore.log)(getParamValue("x", e, t, a))];

    case "Log1p":
      return [(0, _tfjsCore.log1p)(getParamValue("x", e, t, a))];

    case "Imag":
      return [(0, _tfjsCore.imag)(getParamValue("x", e, t, a))];

    case "Neg":
      return [(0, _tfjsCore.neg)(getParamValue("x", e, t, a))];

    case "Reciprocal":
      return [(0, _tfjsCore.reciprocal)(getParamValue("x", e, t, a))];

    case "Real":
      return [(0, _tfjsCore.real)(getParamValue("x", e, t, a))];

    case "Relu":
      return [(0, _tfjsCore.relu)(getParamValue("x", e, t, a))];

    case "Round":
      return [(0, _tfjsCore.round)(getParamValue("x", e, t, a))];

    case "Selu":
      return [(0, _tfjsCore.selu)(getParamValue("x", e, t, a))];

    case "Sigmoid":
      return [(0, _tfjsCore.sigmoid)(getParamValue("x", e, t, a))];

    case "Sin":
      return [(0, _tfjsCore.sin)(getParamValue("x", e, t, a))];

    case "Sign":
      return [(0, _tfjsCore.sign)(getParamValue("x", e, t, a))];

    case "Sinh":
      return [(0, _tfjsCore.sinh)(getParamValue("x", e, t, a))];

    case "Softplus":
      return [(0, _tfjsCore.softplus)(getParamValue("x", e, t, a))];

    case "Sqrt":
      return [(0, _tfjsCore.sqrt)(getParamValue("x", e, t, a))];

    case "Square":
      return [(0, _tfjsCore.square)(getParamValue("x", e, t, a))];

    case "Tanh":
      return [(0, _tfjsCore.tanh)(getParamValue("x", e, t, a))];

    case "Tan":
      return [(0, _tfjsCore.tan)(getParamValue("x", e, t, a))];

    case "Relu6":
    case "ClipByValue":
      return [(0, _tfjsCore.clipByValue)(getParamValue("x", e, t, a), getParamValue("clipValueMin", e, t, a), getParamValue("clipValueMax", e, t, a))];

    case "Rsqrt":
      return [(0, _tfjsCore.rsqrt)(getTensor(e.inputNames[0], t, a))];

    case "Prod":
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), getParamValue("axes", e, t, a))];

    case "LeakyRelu":
      return [(0, _tfjsCore.leakyRelu)(getParamValue("x", e, t, a), getParamValue("alpha", e, t, a))];

    case "Prelu":
      return [(0, _tfjsCore.prelu)(getParamValue("x", e, t, a), getParamValue("alpha", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    TensorArray = function () {
  function e(t, a, r, n, s, o, p) {
    this.name = t, this.dtype = a, this.maxSize = r, this.elementShape = n, this.identicalElementShapes = s, this.dynamicSize = o, this.clearAfterRead = p, this.tensors = [], this.closed_ = !1, this.id = e.nextId++;
  }

  return Object.defineProperty(e.prototype, "closed", {
    get: function () {
      return this.closed_;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.clearAndClose = function () {
    this.tensors.forEach(function (e) {
      return e.tensor.dispose();
    }), this.tensors = [], this.closed_ = !0;
  }, e.prototype.size = function () {
    return this.tensors.length;
  }, e.prototype.read = function (e) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || e >= this.tensors.length) throw new Error("Tried to read from index " + e + ", but array size is: " + this.tensors.length);
    var t = this.tensors[e];
    if (t.cleared) throw new Error("TensorArray " + this.name + ": Could not read index " + e + " twice because it was cleared after a previous read (perhaps try setting clear_after_read = false?).");
    return this.clearAfterRead && (t.cleared = !0), t.read = !0, t.tensor;
  }, e.prototype.readMany = function (e) {
    var t = this;
    return e.map(function (e) {
      return t.read(e);
    });
  }, e.prototype.write = function (e, t) {
    if (this.closed_) throw new Error("TensorArray " + this.name + " has already been closed.");
    if (e < 0 || !this.dynamicSize && e >= this.maxSize) throw new Error("Tried to write to index " + e + ", but array is not resizeable and size is: " + this.maxSize);
    var a = this.tensors[e] || {};
    if (t.dtype !== this.dtype) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ",\n          because the value dtype is " + t.dtype + ", but TensorArray dtype is " + this.dtype + ".");
    if (0 !== this.size() || null != this.elementShape && 0 !== this.elementShape.length || (this.elementShape = t.shape), this.assertShapesMatchAllowUndefinedSize(this.elementShape, t.shape, "TensorArray " + this.name + ": Could not write to TensorArray index " + e + "."), a && a.read) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been read.");
    if (a && a.written) throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + e + ", because it has already been written.");
    a.tensor = t, a.written = !0, this.tensors[e] = a;
  }, e.prototype.writeMany = function (e, t) {
    var a = this;
    if (e.length !== t.length) throw new Error("TensorArray " + this.name + ": could not write multiple tensors,because the index size: " + e.length + " is not the same as tensors size: " + t.length + ".");
    e.forEach(function (e, r) {
      return a.write(e, t[r]);
    });
  }, e.prototype.gather = function (e, t) {
    if (t && t !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but gather requested dtype " + t);

    if (!e) {
      e = [];

      for (var a = 0; a < this.size(); a++) e.push(a);
    }

    if (0 === e.length) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));
    var r = this.readMany(e);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: "), (0, _tfjsCore.stack)(r, 0);
  }, e.prototype.concat = function (e) {
    if (e && e !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but concat requested dtype " + e);
    if (0 === this.size()) return (0, _tfjsCore.tensor)([], [0].concat(this.elementShape));

    for (var t = [], a = 0; a < this.size(); a++) t.push(a);

    var r = this.readMany(t);
    return this.assertShapesMatchAllowUndefinedSize(this.elementShape, r[0].shape, "TensorArray shape mismatch: tensor array shape (" + this.elementShape + ") vs first tensor shape (" + r[0].shape + ")"), (0, _tfjsCore.concat)(r, 0);
  }, e.prototype.scatter = function (e, t) {
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    if (e.length !== t.shape[0]) throw new Error("Expected len(indices) == tensor.shape[0], but saw: " + e.length + " vs. " + t.shape[0]);
    var a = Math.max.apply(Math, e);
    if (!this.dynamicSize && a >= this.maxSize) throw new Error("Max index must be < array size (" + a + "  vs. " + this.maxSize + ")");
    this.writeMany(e, (0, _tfjsCore.unstack)(t, 0));
  }, e.prototype.split = function (e, t) {
    var a = this;
    if (t.dtype !== this.dtype) throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + t.dtype);
    var r = 0,
        n = e.map(function (e) {
      return r += e;
    });
    if (r !== t.shape[0]) throw new Error("Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        " + r + ", and tensor's shape is: " + t.shape);
    if (!this.dynamicSize && e.length !== this.maxSize) throw new Error("TensorArray's size is not equal to the size of lengths (" + this.maxSize + " vs. " + e.length + "), and the TensorArray is not marked as dynamically resizeable");
    var s = 0 === r ? 0 : t.size / r,
        o = [];
    (0, _tfjsCore.tidy)(function () {
      t = t.reshape([1, r, s]);

      for (var p = 0; p < e.length; ++p) {
        var u = [0, 0 === p ? 0 : n[p - 1], 0],
            i = [1, e[p], s];
        o[p] = (0, _tfjsCore.slice)(t, u, i).reshape(a.elementShape);
      }

      return o;
    });

    for (var p = [], u = 0; u < e.length; u++) p[u] = u;

    this.writeMany(p, o);
  }, e.prototype.assertShapesMatchAllowUndefinedSize = function (e, t, a) {
    void 0 === a && (a = ""), _tfjsCore.util.assert(this.shapesEqualAllowUndefinedSize(e, t), function () {
      return a + " Shapes " + e + " and " + t + " must match";
    });
  }, e.prototype.shapesEqualAllowUndefinedSize = function (e, t) {
    if (e.length !== t.length) return !1;

    for (var a = 0; a < e.length; a++) if (-1 !== e[a] && -1 !== t[a] && e[a] !== t[a]) return !1;

    return !0;
  }, e.nextId = 0, e;
}(),
    _this = void 0,
    executeOp$2 = function (e, t, a) {
  return __awaiter(_this, void 0, void 0, function () {
    var r, n, s, o, p, u, i, m, l, c, d, y, f, g, h, N, x, V, b, P, T, v, O, S, _, w, A, D, E, I, M, C, k, z, F;

    return __generator(this, function (j) {
      switch (j.label) {
        case 0:
          switch (e.op) {
            case "LoopCond":
              return [3, 1];

            case "Switch":
              return [3, 2];

            case "Merge":
              return [3, 4];

            case "Enter":
              return [3, 5];

            case "Exit":
              return [3, 6];

            case "NextIteration":
              return [3, 7];

            case "TensorArrayV3":
              return [3, 8];

            case "TensorArrayWriteV3":
              return [3, 9];

            case "TensorArrayReadV3":
              return [3, 10];

            case "TensorArrayGatherV3":
              return [3, 11];

            case "TensorArrayScatterV3":
              return [3, 12];

            case "TensorArrayConcatV3":
              return [3, 13];

            case "TensorArraySplitV3":
              return [3, 14];

            case "TensorArraySizeV3":
              return [3, 15];

            case "TensorArrayCloseV3":
              return [3, 16];
          }

          return [3, 17];

        case 1:
          return [2, [getParamValue("pred", e, t, a).clone()]];

        case 2:
          return r = getParamValue("pred", e, t, a), n = getParamValue("data", e, t, a), [4, r.data()];

        case 3:
          return [2, j.sent()[0] ? [void 0, n.clone()] : [n.clone(), void 0]];

        case 4:
          return [2, (s = e.inputNames.find(function (e) {
            return void 0 !== getTensor(e, t, a);
          })) ? [getTensor(s, t, a).clone()] : void 0];

        case 5:
          return o = getParamValue("frameName", e, t, a), p = getParamValue("tensor", e, t, a), a.enterFrame(o), [2, [p.clone()]];

        case 6:
          return u = getParamValue("tensor", e, t, a), a.exitFrame(), [2, [u.clone()]];

        case 7:
          return i = getParamValue("tensor", e, t, a), a.nextIteration(), [2, [i.clone()]];

        case 8:
          return m = getParamValue("size", e, t, a), l = getParamValue("dtype", e, t, a), c = getParamValue("elementShape", e, t, a), d = getParamValue("dynamicSize", e, t, a), y = getParamValue("clearAfterRead", e, t, a), f = getParamValue("identicalElementShapes", e, t, a), g = getParamValue("name", e, t, a), h = new TensorArray(g, l, m, c, f, d, y), a.addTensorArray(h), [2, [(0, _tfjsCore.scalar)(h.id), (0, _tfjsCore.scalar)(1)]];

        case 9:
          return N = getParamValue("tensorArrayId", e, t, a), x = getParamValue("index", e, t, a), V = getParamValue("tensor", e, t, a), a.getTensorArray(N).write(x, V), [2, [(0, _tfjsCore.scalar)(1)]];

        case 10:
          return b = getParamValue("tensorArrayId", e, t, a), P = getParamValue("index", e, t, a), [2, [a.getTensorArray(b).read(P)]];

        case 11:
          return T = getParamValue("tensorArrayId", e, t, a), v = getParamValue("indices", e, t, a), O = getParamValue("dtype", e, t, a), [2, [a.getTensorArray(T).gather(v, O)]];

        case 12:
          return S = getParamValue("tensorArrayId", e, t, a), _ = getParamValue("indices", e, t, a), w = getParamValue("tensor", e, t, a), a.getTensorArray(S).scatter(_, w), [2, [(0, _tfjsCore.scalar)(1)]];

        case 13:
          return A = getParamValue("tensorArrayId", e, t, a), D = a.getTensorArray(A), E = getParamValue("dtype", e, t, a), [2, [D.concat(E)]];

        case 14:
          return I = getParamValue("tensorArrayId", e, t, a), M = getParamValue("tensor", e, t, a), C = getParamValue("lengths", e, t, a), a.getTensorArray(I).split(C, M), [2, [(0, _tfjsCore.scalar)(1)]];

        case 15:
          return k = getParamValue("tensorArrayId", e, t, a), z = a.getTensorArray(k), [2, [(0, _tfjsCore.scalar)(z.size(), "int32")]];

        case 16:
          return F = getParamValue("tensorArrayId", e, t, a), a.getTensorArray(F).clearAndClose(), [2, [(0, _tfjsCore.scalar)(0)]];

        case 17:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
},
    executeOp$3 = function (e, t, a) {
  switch (e.op) {
    case "Conv1D":
      var r = getParamValue("stride", e, t, a),
          n = getParamValue("pad", e, t, a),
          s = getParamValue("dataFormat", e, t, a).toUpperCase(),
          o = getParamValue("dilation", e, t, a);
      return [(0, _tfjsCore.conv1d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), r, n, s, o)];

    case "Conv2D":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase();
      var p = getParamValue("dilations", e, t, a);
      return [(0, _tfjsCore.conv2d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), [r[1], r[2]], n, s, [p[1], p[2]])];

    case "_FusedConv2D":
    case "FusedDepthwiseConv2dNative":
      var u = getParamValue("fusedOps", e, t, a),
          i = u[0],
          m = u[1],
          l = "biasadd" === i,
          c = "prelu" === m,
          d = "fusedbatchnorm" === i,
          y = getParamValue("numArgs", e, t, a);

      if (l) {
        if (c && 2 !== y) throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd and Prelu must have two extra arguments: bias and alpha.");
        if (!c && 1 !== y) throw new Error("FusedConv2d and DepthwiseConv2d with BiasAdd must have one extra argument: bias.");
      }

      if (d) throw new Error("FusedConv2d and DepthwiseConv2d with FusedBatchNorm is not supported.");
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase(), p = getParamValue("dilations", e, t, a);
      var f = getParamValue("args", e, t, a),
          g = f[0],
          h = f[1];
      return [("_FusedConv2D" === e.op ? _tfjsCore.fused.conv2d : _tfjsCore.fused.depthwiseConv2d)({
        x: getParamValue("x", e, t, a),
        filter: getParamValue("filter", e, t, a),
        strides: [r[1], r[2]],
        pad: n,
        dataFormat: s,
        dilations: [p[1], p[2]],
        bias: g,
        activation: m,
        preluActivationWeights: h
      })];

    case "Conv2DBackpropInput":
    case "Conv2dTranspose":
      var N = getParamValue("outputShape", e, t, a);
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a);
      return [(0, _tfjsCore.conv2dTranspose)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), N, [r[1], r[2]], n)];

    case "DepthwiseConv2dNative":
    case "DepthwiseConv2d":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), p = getParamValue("dilations", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthwiseConv2d)(getParamValue("input", e, t, a), getParamValue("filter", e, t, a), [r[1], r[2]], n, s, [p[1], p[2]])];

    case "Conv3D":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), s = getParamValue("dataFormat", e, t, a).toUpperCase(), p = getParamValue("dilations", e, t, a);
      return [(0, _tfjsCore.conv3d)(getParamValue("x", e, t, a), getParamValue("filter", e, t, a), [r[1], r[2], r[3]], n, s, [p[1], p[2], p[3]])];

    case "AvgPool":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a);
      var x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.avgPool)(getParamValue("x", e, t, a), [x[1], x[2]], [r[1], r[2]], n)];

    case "MaxPool":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.maxPool)(getParamValue("x", e, t, a), [x[1], x[2]], [r[1], r[2]], n)];

    case "MaxPoolWithArgmax":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      var V = getParamValue("includeBatchInIndex", e, t, a),
          b = (0, _tfjsCore.maxPoolWithArgmax)(getParamValue("x", e, t, a), [x[1], x[2]], [r[1], r[2]], n, V);
      return [b.result, b.indexes];

    case "AvgPool3D":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.avgPool3d)(getParamValue("x", e, t, a), [x[1], x[2], x[3]], [r[1], r[2], r[3]], n)];

    case "MaxPool3D":
      r = getParamValue("strides", e, t, a), n = getParamValue("pad", e, t, a), x = getParamValue("kernelSize", e, t, a);
      return [(0, _tfjsCore.maxPool3d)(getParamValue("x", e, t, a), [x[1], x[2], x[3]], [r[1], r[2], r[3]], n)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$4 = function (e, t, a) {
  switch (e.op) {
    case "Fill":
      var r = getParamValue("shape", e, t, a),
          n = getParamValue("dtype", e, t, a),
          s = getParamValue("value", e, t, a);
      return [(0, _tfjsCore.fill)(r, s, n)];

    case "LinSpace":
      var o = getParamValue("start", e, t, a),
          p = getParamValue("stop", e, t, a),
          u = getParamValue("num", e, t, a);
      return [(0, _tfjsCore.linspace)(o, p, u)];

    case "Multinomial":
      var i = getParamValue("logits", e, t, a),
          m = getParamValue("numSamples", e, t, a),
          l = getParamValue("seed", e, t, a);
      return [(0, _tfjsCore.multinomial)(i, m, l)];

    case "OneHot":
      var c = getParamValue("indices", e, t, a),
          d = getParamValue("depth", e, t, a),
          y = getParamValue("onValue", e, t, a),
          f = getParamValue("offValue", e, t, a);
      return [(0, _tfjsCore.oneHot)(c, d, y, f)];

    case "Ones":
      return [(0, _tfjsCore.ones)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "OnesLike":
      return [(0, _tfjsCore.onesLike)(getParamValue("x", e, t, a))];

    case "RandomUniform":
      return [(0, _tfjsCore.randomUniform)(getParamValue("shape", e, t, a), getParamValue("minval", e, t, a), getParamValue("maxval", e, t, a), getParamValue("dtype", e, t, a))];

    case "Range":
      o = getParamValue("start", e, t, a);
      var g = getParamValue("stop", e, t, a),
          h = getParamValue("step", e, t, a);
      return [(0, _tfjsCore.range)(o, g, h, getParamValue("dtype", e, t, a))];

    case "TruncatedNormal":
      r = getParamValue("shape", e, t, a);
      var N = getParamValue("mean", e, t, a),
          x = getParamValue("stdDev", e, t, a);
      l = getParamValue("seed", e, t, a);
      return [(0, _tfjsCore.truncatedNormal)(r, N, x, getParamValue("dtype", e, t, a), l)];

    case "Zeros":
      return [(0, _tfjsCore.zeros)(getParamValue("shape", e, t, a), getParamValue("dtype", e, t, a))];

    case "ZerosLike":
      return [(0, _tfjsCore.zerosLike)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    _this$1 = void 0,
    executeOp$5 = function (e, t, a) {
  return __awaiter(_this$1, void 0, void 0, function () {
    var r, n, s, o, p, u, i, m;
    return __generator(this, function (l) {
      switch (l.label) {
        case 0:
          switch (e.op) {
            case "NonMaxSuppressionV5":
            case "NonMaxSuppressionV3":
            case "NonMaxSuppressionV2":
              return [3, 1];

            case "Where":
              return [3, 5];

            case "ListDiff":
              return [3, 7];
          }

          return [3, 8];

        case 1:
          return r = getParamValue("boxes", e, t, a), n = getParamValue("scores", e, t, a), s = getParamValue("maxOutputSize", e, t, a), o = getParamValue("iouThreshold", e, t, a), p = getParamValue("scoreThreshold", e, t, a), "NonMaxSuppressionV5" !== e.op ? [3, 3] : (u = getParamValue("softNmsSigma", e, t, a), [4, _tfjsCore.image.nonMaxSuppressionWithScoreAsync(r, n, s, o, p, u)]);

        case 2:
          return [2, [(m = l.sent()).selectedIndices, m.selectedScores]];

        case 3:
          return [4, _tfjsCore.image.nonMaxSuppressionAsync(r, n, s, o, p)];

        case 4:
          return [2, [l.sent()]];

        case 5:
          return i = getParamValue("condition", e, t, a).asType("bool"), [4, (0, _tfjsCore.whereAsync)(i)];

        case 6:
          return m = [l.sent()], i.dispose(), [2, m];

        case 7:
          return [2, (0, _tfjsCore.setdiff1dAsync)(getParamValue("x", e, t, a), getParamValue("y", e, t, a))];

        case 8:
          throw TypeError("Node type " + e.op + " is not implemented");
      }
    });
  });
},
    executeOp$6 = function (e, t, a) {
  switch (e.op) {
    case "TopKV2":
      var r = getParamValue("x", e, t, a),
          n = getParamValue("k", e, t, a),
          s = getParamValue("sorted", e, t, a),
          o = (0, _tfjsCore.topk)(r, n, s);
      return [o.values, o.indices];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$7 = function (e, t, a) {
  switch (e.op) {
    case "Const":
      return t[e.name];

    case "PlaceholderWithDefault":
      var r = getParamValue("default", e, t, a);
      return [getTensor(e.name, t, a) || r];

    case "Placeholder":
      return [getTensor(e.name, t, a)];

    case "Identity":
    case "StopGradient":
    case "FakeQuantWithMinMaxVars":
      return [getParamValue("x", e, t, a).clone()];

    case "IdentityN":
      return getParamValue("x", e, t, a).map(function (e) {
        return e.clone();
      });

    case "Snapshot":
      return [getParamValue("x", e, t, a).clone()];

    case "Shape":
      return [(0, _tfjsCore.tensor1d)(getParamValue("x", e, t, a).shape, "int32")];

    case "ShapeN":
      return getParamValue("x", e, t, a).map(function (e) {
        return (0, _tfjsCore.tensor1d)(e.shape);
      });

    case "Size":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).size, "int32")];

    case "Rank":
      return [(0, _tfjsCore.scalar)(getParamValue("x", e, t, a).rank, "int32")];

    case "NoOp":
      return [(0, _tfjsCore.scalar)(1)];

    case "Print":
      var n = getParamValue("x", e, t, a),
          s = getParamValue("data", e, t, a),
          o = getParamValue("message", e, t, a),
          p = getParamValue("summarize", e, t, a);
      console.warn("The graph has a tf.print() operation,usually used for debugging, which slows down performance."), console.log(o);

      for (var u = 0; u < s.length; u++) console.log(Array.prototype.slice.call(s[u].dataSync()).slice(0, p));

      return [n];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$8 = function (e, t, a) {
  switch (e.op) {
    case "ResizeBilinear":
      var r = getParamValue("images", e, t, a),
          n = getParamValue("size", e, t, a),
          s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeBilinear(r, [n[0], n[1]], s)];

    case "ResizeNearestNeighbor":
      r = getParamValue("images", e, t, a), n = getParamValue("size", e, t, a), s = getParamValue("alignCorners", e, t, a);
      return [_tfjsCore.image.resizeNearestNeighbor(r, [n[0], n[1]], s)];

    case "CropAndResize":
      var o = getParamValue("image", e, t, a),
          p = getParamValue("boxes", e, t, a),
          u = getParamValue("boxInd", e, t, a),
          i = getParamValue("cropSize", e, t, a),
          m = getParamValue("method", e, t, a),
          l = getParamValue("extrapolationValue", e, t, a);
      return [_tfjsCore.image.cropAndResize(o, p, u, i, m, l)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$9 = function (e, t, a) {
  switch (e.op) {
    case "Equal":
      return [(0, _tfjsCore.equal)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "NotEqual":
      return [(0, _tfjsCore.notEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Greater":
      return [(0, _tfjsCore.greater)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "GreaterEqual":
      return [(0, _tfjsCore.greaterEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Less":
      return [(0, _tfjsCore.less)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LessEqual":
      return [(0, _tfjsCore.lessEqual)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalAnd":
      return [(0, _tfjsCore.logicalAnd)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "LogicalNot":
      return [(0, _tfjsCore.logicalNot)(getParamValue("a", e, t, a))];

    case "LogicalOr":
      return [(0, _tfjsCore.logicalOr)(getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    case "Select":
    case "SelectV2":
      return [(0, _tfjsCore.where)(getParamValue("condition", e, t, a), getParamValue("a", e, t, a), getParamValue("b", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$10 = function (e, t, a) {
  switch (e.op) {
    case "BatchMatMul":
    case "BatchMatMulV2":
    case "MatMul":
      return [(0, _tfjsCore.matMul)(getParamValue("a", e, t, a), getParamValue("b", e, t, a), getParamValue("transposeA", e, t, a), getParamValue("transposeB", e, t, a))];

    case "Transpose":
      return [(0, _tfjsCore.transpose)(getParamValue("x", e, t, a), getParamValue("perm", e, t, a))];

    case "_FusedMatMul":
      var r = getParamValue("fusedOps", e, t, a),
          n = r[0],
          s = r[1],
          o = "biasadd" === n,
          p = "prelu" === s,
          u = getParamValue("numArgs", e, t, a);

      if (o) {
        if (p && 2 !== u) throw new Error("Fused MatMul with BiasAdd and Prelu must have two extra arguments: bias and alpha.");
        if (!p && 1 !== u) throw new Error("Fused MatMul with BiasAdd must have one extra argument: bias.");
      }

      var i = getParamValue("args", e, t, a),
          m = i[0],
          l = i[1];
      return [_tfjsCore.fused.matMul({
        a: getParamValue("a", e, t, a),
        b: getParamValue("b", e, t, a),
        transposeA: getParamValue("transposeA", e, t, a),
        transposeB: getParamValue("transposeB", e, t, a),
        bias: m,
        activation: s,
        preluActivationWeights: l
      })];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$11 = function (e, t, a) {
  switch (e.op) {
    case "FusedBatchNorm":
    case "FusedBatchNormV2":
    case "FusedBatchNormV3":
      return [(0, _tfjsCore.batchNorm)(getParamValue("x", e, t, a), getParamValue("mean", e, t, a), getParamValue("variance", e, t, a), getParamValue("offset", e, t, a), getParamValue("scale", e, t, a), getParamValue("epsilon", e, t, a))];

    case "LRN":
      return [(0, _tfjsCore.localResponseNormalization)(getParamValue("x", e, t, a), getParamValue("radius", e, t, a), getParamValue("bias", e, t, a), getParamValue("alpha", e, t, a), getParamValue("beta", e, t, a))];

    case "Softmax":
      return [(0, _tfjsCore.softmax)(getParamValue("x", e, t, a))];

    case "LogSoftmax":
      return [(0, _tfjsCore.logSoftmax)(getParamValue("x", e, t, a))];

    case "SparseToDense":
      return [(0, _tfjsCore.sparseToDense)(getParamValue("sparseIndices", e, t, a), getParamValue("outputShape", e, t, a), getParamValue("sparseValues", e, t, a), getParamValue("defaultValue", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$12 = function (e, t, a) {
  switch (e.op) {
    case "Max":
      var r = getParamValue("axis", e, t, a),
          n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.max)(getParamValue("x", e, t, a), r, n)];

    case "Mean":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.mean)(getParamValue("x", e, t, a), r, n)];

    case "Min":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.min)(getParamValue("x", e, t, a), r, n)];

    case "Sum":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.sum)(getParamValue("x", e, t, a), r, n)];

    case "All":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.all)(getParamValue("x", e, t, a), r, n)];

    case "Any":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.any)(getParamValue("x", e, t, a), r, n)];

    case "ArgMax":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMax)(getParamValue("x", e, t, a), r)];

    case "ArgMin":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.argMin)(getParamValue("x", e, t, a), r)];

    case "Prod":
      r = getParamValue("axis", e, t, a), n = getParamValue("keepDims", e, t, a);
      return [(0, _tfjsCore.prod)(getParamValue("x", e, t, a), r, n)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$13 = function (e, t, a) {
  switch (e.op) {
    case "ConcatV2":
    case "Concat":
      var r = getParamValue("n", e, t, a),
          n = getParamValue("axis", e, t, a),
          s = getParamValue("tensors", e, t, a);
      return s = s.slice(0, r), [(0, _tfjsCore.concat)(s, n)];

    case "GatherV2":
    case "Gather":
      n = getParamValue("axis", e, t, a);
      var o = getParamValue("x", e, t, a),
          p = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gather)(o, p.asType("int32"), n)];

    case "ReverseV2":
    case "Reverse":
      n = getParamValue("axis", e, t, a), o = getParamValue("x", e, t, a);
      return [(0, _tfjsCore.reverse)(o, n)];

    case "Slice":
      var u = getParamValue("begin", e, t, a),
          i = getParamValue("size", e, t, a);
      return [(0, _tfjsCore.slice)(getParamValue("x", e, t, a), u, i)];

    case "StridedSlice":
      u = getParamValue("begin", e, t, a);
      var m = getParamValue("end", e, t, a),
          l = getParamValue("strides", e, t, a),
          c = getParamValue("beginMask", e, t, a),
          d = getParamValue("endMask", e, t, a),
          y = getParamValue("ellipsisMask", e, t, a),
          f = getParamValue("newAxisMask", e, t, a),
          g = getParamValue("shrinkAxisMask", e, t, a),
          h = getParamValue("x", e, t, a);
      if (1 === u.length && h.shape.length > 1) for (var N = 1; N < h.shape.length; N++) u.push(0), m.push(h.shape[N]), l.push(l[0]);
      return [(0, _tfjsCore.stridedSlice)(h, u, m, l, c, d, y, f, g)];

    case "Pack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensors", e, t, a),
            s = n[0].shape,
            o = n[0].squeeze().shape,
            p = n.map(function (e) {
          var t = _tfjsCore.util.arraysEqual(e.shape, s);

          if (!t && !_tfjsCore.util.arraysEqual(e.squeeze().shape, o)) throw new Error("the input tensors shape does not match");
          return t ? e : e.reshape(s);
        });
        return [(0, _tfjsCore.stack)(p, r)];
      });

    case "Unpack":
      return (0, _tfjsCore.tidy)(function () {
        var r = getParamValue("axis", e, t, a),
            n = getParamValue("tensor", e, t, a);
        return (0, _tfjsCore.unstack)(n, r);
      });

    case "Tile":
      var x = getParamValue("reps", e, t, a);
      return [(0, _tfjsCore.tile)(getParamValue("x", e, t, a), x)];

    case "Split":
    case "SplitV":
      n = getParamValue("axis", e, t, a);
      var V = getParamValue("numOrSizeSplits", e, t, a);
      return (0, _tfjsCore.split)(getParamValue("x", e, t, a), V, n);

    case "ScatterNd":
      p = getParamValue("indices", e, t, a);
      var b = getParamValue("values", e, t, a),
          P = getParamValue("shape", e, t, a);
      return [(0, _tfjsCore.scatterND)(p, b, P)];

    case "GatherNd":
      var T = getParamValue("x", e, t, a);
      p = getParamValue("indices", e, t, a);
      return [(0, _tfjsCore.gatherND)(T, p)];

    case "SparseToDense":
      p = getParamValue("sparseIndices", e, t, a), P = getParamValue("outputShape", e, t, a);
      var v = getParamValue("sparseValues", e, t, a),
          O = getParamValue("defaultValue", e, t, a);
      return [(0, _tfjsCore.sparseToDense)(p, v, P, v.dtype === O.dtype ? O : O.asType(v.dtype))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$14 = function (e, t, a) {
  switch (e.op) {
    case "FFT":
      return [(0, _tfjsCore.fft)(getParamValue("x", e, t, a))];

    case "IFFT":
      return [(0, _tfjsCore.ifft)(getParamValue("x", e, t, a))];

    case "RFFT":
      return [(0, _tfjsCore.rfft)(getParamValue("x", e, t, a))];

    case "IRFFT":
      return [(0, _tfjsCore.irfft)(getParamValue("x", e, t, a))];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
},
    executeOp$15 = function (e, t, a) {
  switch (e.op) {
    case "Cast":
      return [(0, _tfjsCore.cast)(getParamValue("x", e, t, a), getParamValue("dtype", e, t, a))];

    case "ExpandDims":
      var r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.expandDims)(getParamValue("x", e, t, a), r)];

    case "Squeeze":
      r = getParamValue("axis", e, t, a);
      return [(0, _tfjsCore.squeeze)(getParamValue("x", e, t, a), r)];

    case "Reshape":
      return [(0, _tfjsCore.reshape)(getParamValue("x", e, t, a), getParamValue("shape", e, t, a))];

    case "PadV2":
    case "Pad":
      return [(0, _tfjsCore.pad)(getParamValue("x", e, t, a), split$1(getParamValue("padding", e, t, a), 2), getParamValue("constantValue", e, t, a))];

    case "SpaceToBatchND":
      var n = getParamValue("blockShape", e, t, a),
          s = split$1(getParamValue("paddings", e, t, a), 2);
      return [(0, _tfjsCore.spaceToBatchND)(getParamValue("x", e, t, a), n, s)];

    case "BatchToSpaceND":
      n = getParamValue("blockShape", e, t, a);
      var o = split$1(getParamValue("crops", e, t, a), 2);
      return [(0, _tfjsCore.batchToSpaceND)(getParamValue("x", e, t, a), n, o)];

    case "DepthToSpace":
      var p = getParamValue("blockSize", e, t, a),
          u = getParamValue("dataFormat", e, t, a).toUpperCase();
      return [(0, _tfjsCore.depthToSpace)(getParamValue("x", e, t, a), p, u)];

    default:
      throw TypeError("Node type " + e.op + " is not implemented");
  }
};

function executeOp$16(e, t, a) {
  var r = function (e, t, a) {
    switch (e.category) {
      case "arithmetic":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp(e, t, a);
        });

      case "basic_math":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$1(e, t, a);
        });

      case "control":
        return executeOp$2(e, t, a);

      case "convolution":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$3(e, t, a);
        });

      case "creation":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$4(e, t, a);
        });

      case "dynamic":
        return executeOp$5(e, t, a);

      case "evaluation":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$6(e, t, a);
        });

      case "image":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$8(e, t, a);
        });

      case "graph":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$7(e, t, a);
        });

      case "logical":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$9(e, t, a);
        });

      case "matrices":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$10(e, t, a);
        });

      case "normalization":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$11(e, t, a);
        });

      case "reduction":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$12(e, t, a);
        });

      case "slice_join":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$13(e, t, a);
        });

      case "spectral":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$14(e, t, a);
        });

      case "transformation":
        return (0, _tfjsCore.tidy)(function () {
          return executeOp$15(e, t, a);
        });

      case "custom":
        var r = getRegisteredOp(e.op);
        if (r && r.customExecutor) return r.customExecutor(new NodeValueImpl(e, t, a));
        throw TypeError("Custom op " + e.op + " is not registered.");

      default:
        throw TypeError("Unknown op '" + e.op + "'. File an issue at https://github.com/tensorflow/tfjs/issues so we can add it, or register a custom execution with tf.registerOp()");
    }
  }(e, t, a);

  return r instanceof Promise ? r.then(function (e) {
    return [].concat(e);
  }) : [].concat(r);
}

var ExecutionContext = function () {
  function e(e, t) {
    this.weightMap = e, this.tensorArrayMap = t, this.rootContext = {
      id: 0,
      frameName: "",
      iterationId: 0
    }, this.contexts = [this.rootContext], this.lastId = 0, this.generateCurrentContextIds();
  }

  return e.prototype.newFrame = function (e, t) {
    return {
      id: e,
      frameName: t,
      iterationId: 0
    };
  }, Object.defineProperty(e.prototype, "currentContext", {
    get: function () {
      return this.contexts;
    },
    set: function (e) {
      this.contexts !== e && (this.contexts = e, this.generateCurrentContextIds());
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextId", {
    get: function () {
      return this._currentContextIds[0];
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "currentContextIds", {
    get: function () {
      return this._currentContextIds;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.generateCurrentContextIds = function () {
    for (var e = [], t = 0; t < this.contexts.length - 1; t++) {
      var a = this.contexts.slice(0, this.contexts.length - t);
      e.push(this.contextIdforContexts(a));
    }

    e.push(""), this._currentContextIds = e;
  }, e.prototype.contextIdforContexts = function (e) {
    return e ? e.map(function (e) {
      return 0 === e.id && 0 === e.iterationId ? "" : e.frameName + "-" + e.iterationId;
    }).join("/") : "";
  }, e.prototype.enterFrame = function (e) {
    this.contexts && (this.lastId++, this.contexts = this.contexts.slice(), this.contexts.push(this.newFrame(this.lastId, e)), this._currentContextIds.unshift(this.contextIdforContexts(this.contexts)));
  }, e.prototype.exitFrame = function () {
    if (!(this.contexts && this.contexts.length > 1)) throw new Error("Cannot exit frame, the context is empty");
    this.contexts = this.contexts.slice(), this.contexts.splice(-1), this.currentContextIds.shift();
  }, e.prototype.nextIteration = function () {
    if (!(this.contexts && this.contexts.length > 0)) throw new Error("Cannot increase frame iteration, the context is empty");
    this.contexts = this.contexts.slice(), this.lastId++;
    var e = Object.assign({}, this.contexts[this.contexts.length - 1]);
    e.iterationId += 1, e.id = this.lastId, this.contexts.splice(-1, 1, e), this._currentContextIds.splice(0, 1, this.contextIdforContexts(this.contexts));
  }, e.prototype.getWeight = function (e) {
    return this.weightMap[e];
  }, e.prototype.addTensorArray = function (e) {
    this.tensorArrayMap[e.id] = e;
  }, e.prototype.getTensorArray = function (e) {
    return this.tensorArrayMap[e];
  }, e;
}();

function getExecutionSubgraph(e, t, a) {
  for (var r = new Set(), n = [], s = null, o = null, p = new Set(), u = Object.keys(e).map(function (e) {
    return parseNodeName(e)[0];
  }), i = t.slice(); i.length > 0;) {
    var m = i.pop();
    (isControlFlow(m) || isDynamicShape(m)) && null == s && (o = (s = m).children.map(function (e) {
      return e.name;
    }).filter(function (e) {
      return r.has(e);
    })), r.add(m.name), null == a[m.name] && -1 === u.indexOf(m.name) && (0 !== m.inputs.length ? m.inputs.forEach(function (e) {
      p.has(e.name) || (p.add(e.name), i.push(e));
    }) : n.push(m.name));
  }

  return {
    inputs: e,
    outputs: t,
    usedNodes: r,
    missingInputs: n,
    dynamicNode: s,
    syncInputs: o
  };
}

function getNodesInTopologicalOrder(e, t, a) {
  var r = a.usedNodes,
      n = a.inputs,
      s = [];
  Object.keys(n).map(function (e) {
    return parseNodeName(e)[0];
  }).map(function (t) {
    return e.nodes[t];
  }).forEach(function (e) {
    r.has(e.name) && s.push(e);
  }), e.weights.forEach(function (e) {
    r.has(e.name) && s.push(e);
  });

  for (var o = new Set(), p = []; s.length > 0;) {
    var u = s.pop();
    o.add(u.name), t[u.name] || p.push(u), u.children.forEach(function (e) {
      !o.has(e.name) && r.has(e.name) && e.inputs.every(function (e) {
        return o.has(e.name);
      }) && s.push(e);
    });
  }

  return p;
}

var CONTROL_FLOW_OPS = ["Switch", "Merge", "Enter", "Exit", "NextIteration"],
    DYNAMIC_SHAPE_OPS = ["NonMaxSuppressionV2", "NonMaxSuppressionV3", "NonMaxSuppressionV5", "Where"];

function isControlFlow(e) {
  return CONTROL_FLOW_OPS.indexOf(e.op) >= 0;
}

function isDynamicShape(e) {
  return DYNAMIC_SHAPE_OPS.indexOf(e.op) >= 0;
}

var GraphExecutor = function () {
  function e(e) {
    this.graph = e, this.compiledMap = new Map(), this._weightMap = {}, this.SEPERATOR = ",", this._outputs = e.outputs, this._inputs = e.inputs, this._signature = e.signature;
  }

  return Object.defineProperty(e.prototype, "weightMap", {
    get: function () {
      return this._weightMap;
    },
    set: function (e) {
      var t = Object.keys(e).map(function (t) {
        return e[t].map(function (e) {
          return e.id;
        });
      });
      this.weightIds = [].concat.apply([], t), this._weightMap = e;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this._inputs.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this._outputs.map(function (e) {
        return {
          name: e.name,
          shape: e.attrParams.shape ? e.attrParams.shape.value : void 0,
          dtype: e.attrParams.dtype ? e.attrParams.dtype.value : void 0
        };
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this._inputs.map(function (e) {
        return e.signatureKey || e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this._outputs.map(function (e) {
        return e.signatureKey || e.name;
      });
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.getCompilationKey = function (e, t) {
    var a = e.map(function (e) {
      return e.name;
    }).sort(),
        r = t.map(function (e) {
      return e.name;
    }).sort();
    return a.join(this.SEPERATOR) + "--" + r.join(this.SEPERATOR);
  }, e.prototype.compile = function (e, t) {
    var a = getExecutionSubgraph(e, t, this.weightMap),
        r = a.missingInputs,
        n = a.dynamicNode,
        s = a.syncInputs;
    if (null != n) throw new Error("This execution contains the node '" + n.name + "', which has the dynamic op '" + n.op + "'. Please use model.executeAsync() instead. Alternatively, to avoid the dynamic ops, specify the inputs [" + s + "]");

    if (r.length > 0) {
      var o = t.map(function (e) {
        return e.name;
      }),
          p = Object.keys(e);
      throw new Error("Cannot compute the outputs [" + o + "] from the provided inputs [" + p + "]. Missing the following inputs: [" + r + "]");
    }

    return getNodesInTopologicalOrder(this.graph, this.weightMap, a);
  }, e.prototype.execute = function (e, t) {
    var a = this;
    e = this.mapInputs(e);
    var r = Object.keys(e).sort();
    this.checkInputs(e), this.checkInputShapeAndType(e), t = this.mapOutputs(t), this.checkOutputs(t);
    var n = r.map(function (e) {
      return a.graph.nodes[parseNodeName(e)[0]];
    }),
        s = t.map(function (e) {
      return a.graph.nodes[parseNodeName(e)[0]];
    }),
        o = this.getCompilationKey(n, s),
        p = this.compiledMap.get(o);
    null == p && (p = this.compile(e, s), this.compiledMap.set(o, p));
    var u = {};
    return (0, _tfjsCore.tidy)(function () {
      var r = new ExecutionContext(a._weightMap, u),
          n = __assign({}, a.weightMap);

      Object.keys(e).forEach(function (t) {
        var a = parseNodeName(t),
            r = a[0],
            s = [];
        s[a[1]] = e[t], n[r] = s;
      });

      for (var s = a.getFrozenTensorIds(n), o = {}, i = 0; i < p.length; i++) {
        var m = p[i];

        if (!n[m.name]) {
          var l = executeOp$16(m, n, r);
          if (l instanceof Promise) throw new Error("The execution of the op '" + m.op + "' returned a promise. Please use model.executeAsync() instead.");
          n[m.name] = l, a.checkTensorForDisposal(m.name, m, n, r, s, t, o);
        }
      }

      return t.map(function (e) {
        return getTensor(e, n, r);
      });
    });
  }, e.prototype.getFrozenTensorIds = function (e) {
    var t = [].concat.apply([], Object.keys(e).map(function (t) {
      return e[t];
    }).map(function (e) {
      return e.map(function (e) {
        return e.id;
      });
    }));
    return new Set(t);
  }, e.prototype.checkTensorForDisposal = function (e, t, a, r, n, s, o) {
    "control" !== t.category && -1 === s.indexOf(e) && (a[e].forEach(function (e) {
      null != e && (o[e.id] = (o[e.id] || 0) + t.children.length);
    }), t.inputs.forEach(function (e) {
      if ("control" !== e.category) {
        var t = getTensorsForCurrentContenxt(e.name, a, r);
        null != t && t.forEach(function (e) {
          if (e && !n.has(e.id)) {
            var t = o[e.id];
            1 === t ? (e.dispose(), delete o[e.id]) : null != t && o[e.id]--;
          }
        });
      }
    }));
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a,
          r,
          n,
          s,
          o,
          p,
          u = this;
      return __generator(this, function (i) {
        switch (i.label) {
          case 0:
            return e = this.mapInputs(e), this.checkInputs(e), this.checkInputShapeAndType(e), t = this.mapOutputs(t), this.checkOutputs(t), a = {}, r = new ExecutionContext(this._weightMap, a), [4, this.executeWithControlFlow(e, r, t)];

          case 1:
            return n = i.sent(), s = t.map(function (e) {
              return getTensor(e, n, r);
            }), o = new Set(s.map(function (e) {
              return e.id;
            })), p = new Set(Object.keys(e).map(function (t) {
              return e[t].id;
            })), Object.keys(n).forEach(function (e) {
              n[e].forEach(function (e) {
                !e || e.isDisposed || o.has(e.id) || p.has(e.id) || -1 !== u.weightIds.indexOf(e.id) || e.dispose();
              });
            }), [2, s];
        }
      });
    });
  }, e.prototype.executeWithControlFlow = function (e, t, a) {
    return __awaiter(this, void 0, void 0, function () {
      var r,
          n,
          s,
          o,
          p,
          u,
          i,
          m,
          l,
          c,
          d,
          y,
          f,
          g,
          h,
          N,
          x = this;
      return __generator(this, function (V) {
        switch (V.label) {
          case 0:
            r = Object.keys(e), n = r.map(function (e) {
              return x.graph.nodes[parseNodeName(e)[0]];
            }), s = a.map(function (e) {
              return x.graph.nodes[parseNodeName(e)[0]];
            }), o = getExecutionSubgraph(e, s, this.weightMap), p = o.usedNodes, u = o.missingInputs, i = o.dynamicNode, m = o.syncInputs, l = n.concat(this.graph.weights).map(function (e) {
              return {
                node: e,
                contexts: t.currentContext
              };
            }), c = __assign({}, this.weightMap), Object.keys(e).forEach(function (t) {
              var a = parseNodeName(t),
                  r = a[0],
                  n = [];
              n[a[1]] = e[t], c[r] = n;
            }), d = {}, y = this.getFrozenTensorIds(c), f = {}, V.label = 1;

          case 1:
            return l.length > 0 ? (g = this.processStack(n, l, t, c, f, y, a, d, p), [4, Promise.all(g)]) : [3, 3];

          case 2:
            return V.sent(), [3, 1];

          case 3:
            if (null == i && console.warn("This model execution did not contain any nodes with control flow or dynamic output shapes. You can use model.execute() instead."), (h = s.filter(function (e) {
              return !isControlFlow(e) && !getTensor(e.name, c, t);
            }).map(function (e) {
              return e.name;
            })).length > 0) throw N = "", null != i && (N = "Alternatively, to avoid the dynamic ops, use model.execute() and specify the inputs [" + m + "]"), new Error("Cannot compute the outputs [" + h + "] from the provided inputs [" + r + "]. Consider providing the following inputs: [" + u + "]. " + N);
            return [2, c];
        }
      });
    });
  }, e.prototype.processStack = function (e, t, a, r, n, s, o, p, u) {
    for (var i = this, m = [], l = function () {
      var l = t.pop();
      a.currentContext = l.contexts;
      var d = "";

      if ("Enter" === l.node.op && getParamValue("isConstant", l.node, r, a) && (d = getNodeNameAndIndex(l.node.name, a)[0]), -1 === e.indexOf(l.node)) {
        var y = executeOp$16(l.node, r, a);
        d || (d = getNodeNameAndIndex(l.node.name, a)[0]);
        var f = a.currentContext;
        y instanceof Promise ? m.push(y.then(function (e) {
          return r[d] = e, a.currentContext = f, i.checkTensorForDisposal(d, l.node, r, a, s, o, p), i.processChildNodes(l.node, t, a, r, n, u), e;
        })) : (r[d] = y, c.checkTensorForDisposal(d, l.node, r, a, s, o, p), c.processChildNodes(l.node, t, a, r, n, u));
      } else c.processChildNodes(l.node, t, a, r, n, u);
    }, c = this; t.length > 0;) l();

    return m;
  }, e.prototype.processChildNodes = function (e, t, a, r, n, s) {
    e.children.forEach(function (e) {
      var o = getNodeNameAndIndex(e.name, a)[0];
      !n[o] && s.has(e.name) && ("Merge" === e.op ? e.inputNames.some(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })) : e.inputNames.every(function (e) {
        return !!getTensor(e, r, a);
      }) && (n[o] = !0, t.push({
        contexts: a.currentContext,
        node: e
      })));
    });
  }, e.prototype.dispose = function () {
    var e = this;
    Object.keys(this.weightMap).forEach(function (t) {
      return e.weightMap[t].forEach(function (e) {
        return e.dispose();
      });
    });
  }, e.prototype.checkInputShapeAndType = function (e) {
    var t = this;
    Object.keys(e).forEach(function (a) {
      var r = e[a],
          n = parseNodeName(a)[0],
          s = t.graph.nodes[n];

      if (s.attrParams.shape && s.attrParams.shape.value) {
        var o = s.attrParams.shape.value,
            p = o.length === r.shape.length && r.shape.every(function (e, t) {
          return -1 === o[t] || o[t] === e;
        });

        _tfjsCore.util.assert(p, function () {
          return "The shape of dict['" + s.name + "'] provided in model.execute(dict) must be [" + o + "], but was [" + r.shape + "]";
        });
      }

      s.attrParams.dtype && s.attrParams.dtype.value && _tfjsCore.util.assert(r.dtype === s.attrParams.dtype.value, function () {
        return "The dtype of dict['" + s.name + "'] provided in model.execute(dict) must be " + s.attrParams.dtype.value + ", but was " + r.dtype;
      });
    });
  }, e.prototype.mapInputs = function (e) {
    var t = {};

    for (var a in e) {
      if (null != this._signature && null != this._signature.inputs && null != this._signature.inputs[a]) t[this._signature.inputs[a].name] = e[a];else t[a] = e[a];
    }

    return t;
  }, e.prototype.checkInputs = function (e) {
    var t = this,
        a = Object.keys(e).filter(function (e) {
      var a = parseNodeName(e)[0];
      return null == t.graph.nodes[a];
    });
    if (a.length > 0) throw new Error("The dict provided in model.execute(dict) has keys: [" + a + "] that are not part of graph");
  }, e.prototype.mapOutputs = function (e) {
    var t = this;
    return e.map(function (e) {
      return null != t._signature && null != t._signature.outputs && null != t._signature.outputs[e] ? t._signature.outputs[e].name : e;
    }, {});
  }, e.prototype.checkOutputs = function (e) {
    var t = this;
    e.forEach(function (e) {
      var a = parseNodeName(e)[0];
      if (!t.graph.nodes[a]) throw new Error("The output '" + e + "' is not found in the graph");
    });
  }, e;
}(),
    TFHUB_SEARCH_PARAM = "?tfjs-format=file",
    DEFAULT_MODEL_NAME = "model.json",
    GraphModel = function () {
  function e(e, t) {
    void 0 === t && (t = {}), this.modelUrl = e, this.loadOptions = t, this.version = "n/a", null == t && (this.loadOptions = {});
  }

  return Object.defineProperty(e.prototype, "modelVersion", {
    get: function () {
      return this.version;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputNodes", {
    get: function () {
      return this.executor.inputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputNodes", {
    get: function () {
      return this.executor.outputNodes;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "inputs", {
    get: function () {
      return this.executor.inputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "outputs", {
    get: function () {
      return this.executor.outputs;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e.prototype, "weights", {
    get: function () {
      return this.executor.weightMap;
    },
    enumerable: !0,
    configurable: !0
  }), e.prototype.findIOHandler = function () {
    var e = this.modelUrl;
    if (null != e.load) this.handler = e;else if (null != this.loadOptions.requestInit) this.handler = _tfjsCore.io.browserHTTPRequest(e, this.loadOptions);else {
      var t = _tfjsCore.io.getLoadHandlers(e, this.loadOptions.onProgress);

      if (0 === t.length) t.push(_tfjsCore.io.browserHTTPRequest(e, this.loadOptions));else if (t.length > 1) throw new Error("Found more than one (" + t.length + ") load handlers for URL '" + [e] + "'");
      this.handler = t[0];
    }
  }, e.prototype.load = function () {
    return __awaiter(this, void 0, void 0, function () {
      var e, t, a, r;
      return __generator(this, function (n) {
        switch (n.label) {
          case 0:
            if (this.findIOHandler(), null == this.handler.load) throw new Error("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");
            return e = this, [4, this.handler.load()];

          case 1:
            return e.artifacts = n.sent(), t = this.artifacts.modelTopology, a = {}, null != this.artifacts.userDefinedMetadata && (a = this.artifacts.userDefinedMetadata.signature), this.version = t.versions.producer + "." + t.versions.minConsumer, r = _tfjsCore.io.decodeWeights(this.artifacts.weightData, this.artifacts.weightSpecs), this.executor = new GraphExecutor(OperationMapper.Instance.transformGraph(t, a)), this.executor.weightMap = this.convertTensorMapToTensorsMap(r), [2, !0];
        }
      });
    });
  }, e.prototype.save = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var t;
      return __generator(this, function (a) {
        if ("string" == typeof e) {
          if (0 === (t = _tfjsCore.io.getSaveHandlers(e)).length) throw new Error("Cannot find any save handlers for URL '" + e + "'");
          if (t.length > 1) throw new Error("Found more than one (" + t.length + ") save handlers for URL '" + e + "'");
          e = t[0];
        }

        if (null == e.save) throw new Error("GraphModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");
        return [2, e.save(this.artifacts)];
      });
    });
  }, e.prototype.predict = function (e, t) {
    return this.execute(e, this.outputNodes);
  }, e.prototype.normalizeInputs = function (e) {
    if (!(e instanceof _tfjsCore.Tensor || Array.isArray(e))) return e;
    if ((e = Array.isArray(e) ? e : [e]).length !== this.inputNodes.length) throw new Error("Input tensor count mismatch,the graph model has " + this.inputNodes.length + " placeholders, while there are " + e.length + " input tensors.");
    return this.inputNodes.reduce(function (t, a, r) {
      return t[a] = e[r], t;
    }, {});
  }, e.prototype.normalizeOutputs = function (e) {
    return e = e || this.outputNodes, Array.isArray(e) ? e : [e];
  }, e.prototype.execute = function (e, t) {
    e = this.normalizeInputs(e), t = this.normalizeOutputs(t);
    var a = this.executor.execute(e, t);
    return a.length > 1 ? a : a[0];
  }, e.prototype.executeAsync = function (e, t) {
    return __awaiter(this, void 0, void 0, function () {
      var a;
      return __generator(this, function (r) {
        switch (r.label) {
          case 0:
            return e = this.normalizeInputs(e), t = this.normalizeOutputs(t), [4, this.executor.executeAsync(e, t)];

          case 1:
            return [2, (a = r.sent()).length > 1 ? a : a[0]];
        }
      });
    });
  }, e.prototype.convertTensorMapToTensorsMap = function (e) {
    return Object.keys(e).reduce(function (t, a) {
      return t[a] = [e[a]], t;
    }, {});
  }, e.prototype.dispose = function () {
    this.executor.dispose();
  }, e;
}();

exports.GraphModel = GraphModel;

function loadGraphModel(e, t) {
  return void 0 === t && (t = {}), __awaiter(this, void 0, void 0, function () {
    var a;
    return __generator(this, function (r) {
      switch (r.label) {
        case 0:
          if (null == e) throw new Error("modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model");
          return null == t && (t = {}), t.fromTFHub && null == e.load && (e.endsWith("/") || (e += "/"), e = "" + e + DEFAULT_MODEL_NAME + TFHUB_SEARCH_PARAM), [4, (a = new GraphModel(e, t)).load()];

        case 1:
          return r.sent(), [2, a];
      }
    });
  });
}

var version = "1.7.4";
exports.version_converter = version;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","buffer":"node_modules/buffer/index.js"}],"node_modules/@tensorflow/tfjs-automl/dist/tf-automl.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadImageClassification = loadImageClassification;
exports.loadObjectDetection = loadObjectDetection;
exports.version = exports.ObjectDetectionModel = exports.ImageClassificationModel = void 0;

var _tfjsCore = require("@tensorflow/tfjs-core");

var _tfjsConverter = require("@tensorflow/tfjs-converter");

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


function imageToTensor(img) {
  return img instanceof _tfjsCore.Tensor ? img : _tfjsCore.browser.fromPixels(img);
}
/** Loads and parses the dictionary. */


function loadDictionary(modelUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var lastIndexOfSlash, prefixUrl, dictUrl, response, text;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          lastIndexOfSlash = modelUrl.lastIndexOf('/');
          prefixUrl = lastIndexOfSlash >= 0 ? modelUrl.slice(0, lastIndexOfSlash + 1) : '';
          dictUrl = prefixUrl + "dict.txt";
          return [4
          /*yield*/
          , _tfjsCore.util.fetch(dictUrl)];

        case 1:
          response = _a.sent();
          return [4
          /*yield*/
          , response.text()];

        case 2:
          text = _a.sent();
          return [2
          /*return*/
          , text.trim().split('\n')];
      }
    });
  });
}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/** Input size as expected by the model. */


var IMG_SIZE = [224, 224]; // Constants used to normalize the image between -1 and 1.

var DIV_FACTOR = 127.5;
var SUB_FACTOR = 1;

var ImageClassificationModel =
/** @class */
function () {
  function ImageClassificationModel(graphModel, dictionary) {
    this.graphModel = graphModel;
    this.dictionary = dictionary;
  }

  ImageClassificationModel.prototype.classify = function (input, options) {
    return __awaiter(this, void 0, void 0, function () {
      var scores, probabilities, result;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            options = sanitizeOptions(options);
            scores = (0, _tfjsCore.tidy)(function () {
              var preprocessedImg = _this.preprocess(input, options);

              return _this.graphModel.predict(preprocessedImg);
            });
            return [4
            /*yield*/
            , scores.data()];

          case 1:
            probabilities = _a.sent();
            scores.dispose();
            result = Array.from(probabilities).map(function (prob, i) {
              return {
                label: _this.dictionary[i],
                prob: prob
              };
            });
            return [2
            /*return*/
            , result];
        }
      });
    });
  };

  ImageClassificationModel.prototype.preprocess = function (input, options) {
    // Preprocessing involves center crop and normalizing between [-1, 1].
    var img = imageToTensor(input);
    var croppedImg = options.centerCrop ? centerCropAndResize(img) : _tfjsCore.image.resizeBilinear(img, IMG_SIZE).expandDims();
    return croppedImg.div(DIV_FACTOR).sub(SUB_FACTOR);
  };

  return ImageClassificationModel;
}();

exports.ImageClassificationModel = ImageClassificationModel;

function loadImageClassification(modelUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, model, dict;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , Promise.all([(0, _tfjsConverter.loadGraphModel)(modelUrl), loadDictionary(modelUrl)])];

        case 1:
          _a = _b.sent(), model = _a[0], dict = _a[1];
          return [2
          /*return*/
          , new ImageClassificationModel(model, dict)];
      }
    });
  });
}

function sanitizeOptions(options) {
  options = options || {};

  if (options.centerCrop == null) {
    options.centerCrop = true;
  }

  return options;
}
/** Center crops an image */


function centerCropAndResize(img) {
  return (0, _tfjsCore.tidy)(function () {
    var _a = img.shape.slice(0, 2),
        height = _a[0],
        width = _a[1];

    var top = 0;
    var left = 0;

    if (height > width) {
      top = (height - width) / 2;
    } else {
      left = (width - height) / 2;
    }

    var size = Math.min(width, height);
    var boxes = [[top / height, left / width, (top + size) / height, (left + size) / width]];
    var boxIndices = [0];
    return _tfjsCore.image.cropAndResize(img.toFloat().expandDims(), boxes, boxIndices, IMG_SIZE);
  });
}
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


var DEFAULT_TOPK = 20;
var DEFAULT_IOU_THRESHOLD = 0.5;
var DEFAULT_SCORE_THRESHOLD = 0.5;
var INPUT_NODE_NAME = 'ToFloat';
var OUTPUT_NODE_NAMES = ['Postprocessor/convert_scores', 'Postprocessor/Decode/transpose_1'];

var ObjectDetectionModel =
/** @class */
function () {
  function ObjectDetectionModel(graphModel, dictionary) {
    this.graphModel = graphModel;
    this.dictionary = dictionary;
  }

  ObjectDetectionModel.prototype.detect = function (input, options) {
    return __awaiter(this, void 0, void 0, function () {
      var img, _a, height, width, feedDict, _b, scoresTensor, boxesTensor, _c, numBoxes, numClasses, _d, scores, boxes, _e, boxScores, boxLabels, selectedBoxesTensor, selectedBoxes, result;

      var _this = this;

      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            options = sanitizeOptions$1(options);
            img = (0, _tfjsCore.tidy)(function () {
              return _this.preprocess(input, options);
            });
            _a = [img.shape[1], img.shape[2]], height = _a[0], width = _a[1];
            feedDict = {};
            feedDict[INPUT_NODE_NAME] = img;
            return [4
            /*yield*/
            , this.graphModel.executeAsync(feedDict, OUTPUT_NODE_NAMES)];

          case 1:
            _b = _f.sent(), scoresTensor = _b[0], boxesTensor = _b[1];
            _c = scoresTensor.shape, numBoxes = _c[1], numClasses = _c[2];
            return [4
            /*yield*/
            , Promise.all([scoresTensor.data(), boxesTensor.data()])];

          case 2:
            _d = _f.sent(), scores = _d[0], boxes = _d[1];
            _e = calculateMostLikelyLabels(scores, numBoxes, numClasses), boxScores = _e.boxScores, boxLabels = _e.boxLabels;
            return [4
            /*yield*/
            , _tfjsCore.image.nonMaxSuppressionAsync(boxesTensor, boxScores, options.topk, options.iou, options.score)];

          case 3:
            selectedBoxesTensor = _f.sent();
            return [4
            /*yield*/
            , selectedBoxesTensor.data()];

          case 4:
            selectedBoxes = _f.sent();
            (0, _tfjsCore.dispose)([img, scoresTensor, boxesTensor, selectedBoxesTensor]);
            result = buildDetectedObjects(width, height, boxes, boxScores, boxLabels, selectedBoxes, this.dictionary);
            return [2
            /*return*/
            , result];
        }
      });
    });
  };

  ObjectDetectionModel.prototype.preprocess = function (input, options) {
    return imageToTensor(input).expandDims().toFloat();
  };

  return ObjectDetectionModel;
}();

exports.ObjectDetectionModel = ObjectDetectionModel;

function loadObjectDetection(modelUrl) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, model, dict;

    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4
          /*yield*/
          , Promise.all([(0, _tfjsConverter.loadGraphModel)(modelUrl), loadDictionary(modelUrl)])];

        case 1:
          _a = _b.sent(), model = _a[0], dict = _a[1];
          return [2
          /*return*/
          , new ObjectDetectionModel(model, dict)];
      }
    });
  });
}

function sanitizeOptions$1(options) {
  options = options || {};

  if (options.topk == null) {
    options.topk = DEFAULT_TOPK;
  }

  if (options.iou == null) {
    options.iou = DEFAULT_IOU_THRESHOLD;
  }

  if (options.score == null) {
    options.score = DEFAULT_SCORE_THRESHOLD;
  }

  return options;
}

function calculateMostLikelyLabels(scores, numBoxes, numClasses) {
  // Holds a score for each box.
  var boxScores = []; // Holds the label id for each box.

  var boxLabels = [];

  for (var i = 0; i < numBoxes; i++) {
    var maxScore = Number.MIN_VALUE;
    var mostLikelyLabel = -1;

    for (var j = 0; j < numClasses; j++) {
      var flatIndex = i * numClasses + j;
      var score = scores[flatIndex];

      if (score > maxScore) {
        maxScore = scores[flatIndex];
        mostLikelyLabel = j;
      }
    }

    boxScores[i] = maxScore;
    boxLabels[i] = mostLikelyLabel;
  }

  return {
    boxScores: boxScores,
    boxLabels: boxLabels
  };
}

function buildDetectedObjects(width, height, boxes, boxScores, boxLabels, selectedBoxes, dictionary) {
  var objects = []; // Each 2d rectangle is fully described with 4 coordinates.

  var numBoxCoords = 4;

  for (var i = 0; i < selectedBoxes.length; i++) {
    var boxIndex = selectedBoxes[i];

    var _a = Array.from(boxes.slice(boxIndex * numBoxCoords, boxIndex * numBoxCoords + numBoxCoords)),
        top_1 = _a[0],
        left = _a[1],
        bottom = _a[2],
        right = _a[3];

    objects.push({
      box: {
        left: left * width,
        top: top_1 * height,
        width: (right - left) * width,
        height: (bottom - top_1) * height
      },
      label: dictionary[boxLabels[boxIndex]],
      score: boxScores[boxIndex]
    });
  }

  return objects;
}
/** @license See the LICENSE file. */
// This code is auto-generated, do not modify this file!


var version = '1.0.0';
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

exports.version = version;
},{"@tensorflow/tfjs-core":"node_modules/@tensorflow/tfjs-core/dist/tf-core.esm.js","@tensorflow/tfjs-converter":"node_modules/@tensorflow/tfjs-converter/dist/tf-converter.esm.js"}],"index.js":[function(require,module,exports) {
"use strict";

var automl = _interopRequireWildcard(require("@tensorflow/tfjs-automl"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const MODEL_URL = //'https://storage.googleapis.com/scalepipe_models/model-export/icn/tf_js-scene_v1_edge-2020-05-28T20:23:55.321Z/model.json'
'file://models/scene_v1_edge/model.json';

async function classify() {
  // Avoid duplicate request
  if (document.getElementsByTagName('pre').length > 0) {
    return;
  }

  const model = await automl.loadImageClassification(MODEL_URL);
  const image = document.getElementById('scene');
  const predictions = await model.classify(image); // Show the resulting object on the page.

  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(predictions, null, 2);
  document.body.append(pre);
}

document.getElementById('classifier').onclick = classify.bind();
},{"@tensorflow/tfjs-automl":"node_modules/@tensorflow/tfjs-automl/dist/tf-automl.esm.js"}]},{},["index.js"], null)
//# sourceMappingURL=/ml-pipeline.e31bb0bc.map