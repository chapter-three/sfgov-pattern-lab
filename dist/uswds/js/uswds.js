(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
/**
               * Array#filter.
               *
               * @param {Array} arr
               * @param {Function} fn
               * @param {Object=} self
               * @return {Array}
               * @throw TypeError
               */

module.exports = function (arr, fn, self) {
  if (arr.filter) return arr.filter(fn, self);
  if (void 0 === arr || null === arr) throw new TypeError();
  if ('function' != typeof fn) throw new TypeError();
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) continue;
    var val = arr[i];
    if (fn.call(self, val, i, arr)) ret.push(val);
  }
  return ret;
};

var hasOwn = Object.prototype.hasOwnProperty;

},{}],2:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i += 1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};

},{}],3:[function(require,module,exports){
"use strict"; /*
               * classList.js: Cross-browser full element.classList implementation.
               * 1.1.20170427
               *
               * By Eli Grey, http://eligrey.com
               * License: Dedicated to the public domain.
               *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
               */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_")) ||
	document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var
			classListProp = "classList",
			protoProp = "prototype",
			elemCtrProto = view.Element[protoProp],
			objCtr = Object,
			strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			arrIndexOf = Array[protoProp].indexOf || function (item) {
				var
				i = 0,
				len = this.length;

				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			,DOMEx = function DOMEx(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
				if (token === "") {
					throw new DOMEx(
					"SYNTAX_ERR",
					"An invalid or illegal string was specified");

				}
				if (/\s/.test(token)) {
					throw new DOMEx(
					"INVALID_CHARACTER_ERR",
					"String contains an invalid character");

				}
				return arrIndexOf.call(classList, token);
			},
			ClassList = function ClassList(elem) {
				var
				trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
				classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
				i = 0,
				len = classes.length;

				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			},
			classListProto = ClassList[protoProp] = [],
			classListGetter = function classListGetter() {
				return new ClassList(this);
			};

			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var
				tokens = arguments,
				i = 0,
				l = tokens.length,
				token,
				updated = false;

				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				} while (
				++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var
				tokens = arguments,
				i = 0,
				l = tokens.length,
				token,
				updated = false,
				index;

				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				} while (
				++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var
				result = this.contains(token),
				method = result ?
				force !== true && "remove" :

				force !== false && "add";


				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true };

				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) {// IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		})(window.self);

	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function createMethod(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function (token) {
					var i,len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function (token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};

		}

		testElement = null;
	})();

}

},{}],4:[function(require,module,exports){
'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /*!
                                                                                                                                                                                                                                                                                         * domready (c) Dustin Diaz 2014 - License MIT
                                                                                                                                                                                                                                                                                         */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition();else
  if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else
  this[name] = definition();

}('domready', function () {

  var fns = [],_listener,
  doc = document,
  hack = doc.documentElement.doScroll,
  domContentLoaded = 'DOMContentLoaded',
  loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


  if (!loaded)
  doc.addEventListener(domContentLoaded, _listener = function listener() {
    doc.removeEventListener(domContentLoaded, _listener);
    loaded = 1;
    while (_listener = fns.shift()) {_listener();}
  });

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };

});

},{}],5:[function(require,module,exports){
'use strict';

// <3 Modernizr
// https://raw.githubusercontent.com/Modernizr/Modernizr/master/feature-detects/dom/dataset.js

function useNative() {
	var elem = document.createElement('div');
	elem.setAttribute('data-a-b', 'c');

	return Boolean(elem.dataset && elem.dataset.aB === 'c');
}

function nativeDataset(element) {
	return element.dataset;
}

module.exports = useNative() ? nativeDataset : function (element) {
	var map = {};
	var attributes = element.attributes;

	function getter() {
		return this.value;
	}

	function setter(name, value) {
		if (typeof value === 'undefined') {
			this.removeAttribute(name);
		} else {
			this.setAttribute(name, value);
		}
	}

	for (var i = 0, j = attributes.length; i < j; i++) {
		var attribute = attributes[i];

		if (attribute) {
			var name = attribute.name;

			if (name.indexOf('data-') === 0) {
				var prop = name.slice(5).replace(/-./g, function (u) {
					return u.charAt(1).toUpperCase();
				});

				var value = attribute.value;

				Object.defineProperty(map, prop, {
					enumerable: true,
					get: getter.bind({ value: value || '' }),
					set: setter.bind(element, name)
				});
			}
		}
	}

	return map;
};

},{}],6:[function(require,module,exports){
'use strict'; // element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);

},{}],7:[function(require,module,exports){
(function (global){
'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;}; /**
                                                                                                                                                                                                                                                                                        * lodash (Custom Build) <https://lodash.com/>
                                                                                                                                                                                                                                                                                        * Build: `lodash modularize exports="npm" -o ./`
                                                                                                                                                                                                                                                                                        * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                                                                                                                                                                                                                                                                                        * Released under MIT license <https://lodash.com/license>
                                                                                                                                                                                                                                                                                        * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                                                                                                                                                                                                                                                                                        * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                                                                                                                                                                                                                                                                                        */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
                                     * Used to resolve the
                                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                                     * of values.
                                     */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
nativeMin = Math.min;

/**
                       * Gets the timestamp of the number of milliseconds that have elapsed since
                       * the Unix epoch (1 January 1970 00:00:00 UTC).
                       *
                       * @static
                       * @memberOf _
                       * @since 2.4.0
                       * @category Date
                       * @returns {number} Returns the timestamp.
                       * @example
                       *
                       * _.defer(function(stamp) {
                       *   console.log(_.now() - stamp);
                       * }, _.now());
                       * // => Logs the number of milliseconds it took for the deferred invocation.
                       */
var now = function now() {
  return root.Date.now();
};

/**
    * Creates a debounced function that delays invoking `func` until after `wait`
    * milliseconds have elapsed since the last time the debounced function was
    * invoked. The debounced function comes with a `cancel` method to cancel
    * delayed `func` invocations and a `flush` method to immediately invoke them.
    * Provide `options` to indicate whether `func` should be invoked on the
    * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
    * with the last arguments provided to the debounced function. Subsequent
    * calls to the debounced function return the result of the last `func`
    * invocation.
    *
    * **Note:** If `leading` and `trailing` options are `true`, `func` is
    * invoked on the trailing edge of the timeout only if the debounced function
    * is invoked more than once during the `wait` timeout.
    *
    * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
    * until to the next tick, similar to `setTimeout` with a timeout of `0`.
    *
    * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
    * for details over the differences between `_.debounce` and `_.throttle`.
    *
    * @static
    * @memberOf _
    * @since 0.1.0
    * @category Function
    * @param {Function} func The function to debounce.
    * @param {number} [wait=0] The number of milliseconds to delay.
    * @param {Object} [options={}] The options object.
    * @param {boolean} [options.leading=false]
    *  Specify invoking on the leading edge of the timeout.
    * @param {number} [options.maxWait]
    *  The maximum time `func` is allowed to be delayed before it's invoked.
    * @param {boolean} [options.trailing=true]
    *  Specify invoking on the trailing edge of the timeout.
    * @returns {Function} Returns the new debounced function.
    * @example
    *
    * // Avoid costly calculations while the window size is in flux.
    * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
    *
    * // Invoke `sendMail` when clicked, debouncing subsequent calls.
    * jQuery(element).on('click', _.debounce(sendMail, 300, {
    *   'leading': true,
    *   'trailing': false
    * }));
    *
    * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
    * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
    * var source = new EventSource('/stream');
    * jQuery(source).on('message', debounced);
    *
    * // Cancel the trailing debounced invocation.
    * jQuery(window).on('popstate', debounced.cancel);
    */
function debounce(func, wait, options) {
  var lastArgs,
  lastThis,
  maxWait,
  result,
  timerId,
  lastCallTime,
  lastInvokeTime = 0,
  leading = false,
  maxing = false,
  trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
    thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
    timeSinceLastInvoke = time - lastInvokeTime,
    result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
    timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait ||
    timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
    isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' ||
  isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ?
  freeParseInt(value.slice(2), isBinary ? 2 : 8) :
  reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
		'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assign = require('object-assign');
var delegate = require('../delegate');
var delegateAll = require('../delegateAll');

var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';

var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }

  var options;
  if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({ type: _type }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};

var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};

module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);

  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"../delegate":11,"../delegateAll":12,"object-assign":8}],10:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],11:[function(require,module,exports){
'use strict';

// polyfill Element.prototype.closest
require('element-closest');

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = event.target.closest(selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"element-closest":6}],12:[function(require,module,exports){
'use strict';

var delegate = require('../delegate');
var compose = require('../compose');

var SPLAT = '*';

module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"../compose":10,"../delegate":11}],13:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],14:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],15:[function(require,module,exports){
'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};

var RE_TRIM = /(^\s+)|(\s+$)/g;
var RE_SPLIT = /\s+/;

var trim = String.prototype.trim ?
function (str) {return str.trim();} :
function (str) {return str.replace(RE_TRIM, '');};

var queryById = function queryById(id) {
  return this.querySelector('[id="' + id.replace(/"/g, '\\"') + '"]');
};

module.exports = function resolveIds(ids, doc) {
  if (typeof ids !== 'string') {
    throw new Error('Expected a string but got ' + (typeof ids === 'undefined' ? 'undefined' : _typeof(ids)));
  }

  if (!doc) {
    doc = window.document;
  }

  var getElementById = doc.getElementById ?
  doc.getElementById.bind(doc) :
  queryById.bind(doc);

  ids = trim(ids).split(RE_SPLIT);

  // XXX we can short-circuit here because trimming and splitting a
  // string of just whitespace produces an array containing a single,
  // empty string
  if (ids.length === 1 && ids[0] === '') {
    return [];
  }

  return ids.
  map(function (id) {
    var el = getElementById(id);
    if (!el) {
      throw new Error('no element with id: "' + id + '"');
    }
    return el;
  });
};

},{}],16:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var filter = require('array-filter');
var forEach = require('array-foreach');
var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

// XXX match .usa-accordion and .usa-accordion-bordered
var ACCORDION = '.' + PREFIX + '-accordion, .' + PREFIX + '-accordion-bordered';
var BUTTON = '.' + PREFIX + '-accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';

/**
                                               * Toggle a button's "pressed" state, optionally providing a target
                                               * state.
                                               *
                                               * @param {HTMLButtonElement} button
                                               * @param {boolean?} expanded If no state is provided, the current
                                               * state will be toggled (from false to true, and vice-versa).
                                               * @return {boolean} the resulting state
                                               */
var toggleButton = function toggleButton(button, expanded) {
  var accordion = button.closest(ACCORDION);
  if (!accordion) {
    throw new Error(BUTTON + ' is missing outer ' + ACCORDION);
  }

  expanded = toggle(button, expanded);
  // XXX multiselectable is opt-in, to preserve legacy behavior
  var multiselectable = accordion.getAttribute(MULTISELECTABLE) === 'true';

  if (expanded && !multiselectable) {
    forEach(getAccordionButtons(accordion), function (other) {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
    * @param {HTMLButtonElement} button
    * @return {boolean} true
    */
var showButton = function showButton(button) {return toggleButton(button, true);};

/**
                                                                                    * @param {HTMLButtonElement} button
                                                                                    * @return {boolean} false
                                                                                    */
var hideButton = function hideButton(button) {return toggleButton(button, false);};

/**
                                                                                     * Get an Array of button elements belonging directly to the given
                                                                                     * accordion element.
                                                                                     * @param {HTMLElement} accordion
                                                                                     * @return {array<HTMLButtonElement>}
                                                                                     */
var getAccordionButtons = function getAccordionButtons(accordion) {
  return filter(accordion.querySelectorAll(BUTTON), function (button) {
    return button.closest(ACCORDION) === accordion;
  });
};

var accordion = behavior(_defineProperty({},
CLICK, _defineProperty({},
BUTTON, function (event) {
  event.preventDefault();
  toggleButton(this);

  if (this.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport(this)) this.scrollIntoView();
  }
})),

{
  init: function init(root) {
    forEach(root.querySelectorAll(BUTTON), function (button) {
      var expanded = button.getAttribute(EXPANDED) === 'true';
      toggleButton(button, expanded);
    });
  },
  ACCORDION: ACCORDION,
  BUTTON: BUTTON,
  show: showButton,
  hide: hideButton,
  toggle: toggleButton,
  getButtons: getAccordionButtons });


/**
                                       * TODO: for 2.0, remove everything below this comment and export the
                                       * behavior directly:
                                       *
                                       * module.exports = behavior({...});
                                       */
var Accordion = function Accordion(root) {
  this.root = root;
  accordion.on(this.root);
};

// copy all of the behavior methods and props to Accordion
var assign = require('object-assign');
assign(Accordion, accordion);

Accordion.prototype.show = showButton;
Accordion.prototype.hide = hideButton;

Accordion.prototype.remove = function () {
  accordion.off(this.root);
};

module.exports = Accordion;

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/is-in-viewport":31,"../utils/toggle":35,"array-filter":1,"array-foreach":2,"object-assign":8}],17:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var toggle = require('../utils/toggle');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var HEADER = '.' + PREFIX + '-banner-header';
var EXPANDED_CLASS = PREFIX + '-banner-header-expanded';

var toggleBanner = function toggleBanner(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
  return false;
};

module.exports = behavior(_defineProperty({},
CLICK, _defineProperty({},
HEADER + ' [aria-controls]', toggleBanner)));

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/toggle":35}],18:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var accordion = require('./accordion');
var behavior = require('../utils/behavior');
var debounce = require('lodash.debounce');
var forEach = require('array-foreach');
var select = require('../utils/select');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var HIDDEN = 'hidden';
var SCOPE = '.' + PREFIX + '-footer-big';
var NAV = SCOPE + ' nav';
var BUTTON = NAV + ' .' + PREFIX + '-footer-primary-link';
var LIST = NAV + ' ul';

var HIDE_MAX_WIDTH = 600;
var DEBOUNCE_RATE = 180;

var showPanel = function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    var list = this.closest(LIST);
    list.classList.toggle(HIDDEN);

    // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"
    var lists = list.closest(NAV).
    querySelectorAll('ul');

    forEach(lists, function (el) {
      if (el !== list) {
        el.classList.add(HIDDEN);
      }
    });
  }
};

var resize = debounce(function () {
  var hidden = window.innerWidth < HIDE_MAX_WIDTH;
  forEach(select(LIST), function (list) {
    list.classList.toggle(HIDDEN, hidden);
  });
}, DEBOUNCE_RATE);

module.exports = behavior(_defineProperty({},
CLICK, _defineProperty({},
BUTTON, showPanel)),

{
  // export for use elsewhere
  HIDE_MAX_WIDTH: HIDE_MAX_WIDTH,
  DEBOUNCE_RATE: DEBOUNCE_RATE,

  init: function init(target) {
    resize();
    window.addEventListener('resize', resize);
  },

  teardown: function teardown(target) {
    window.removeEventListener('resize', resize);
  } });

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/select":32,"./accordion":16,"array-foreach":2,"lodash.debounce":7}],19:[function(require,module,exports){
'use strict';module.exports = {
  accordion: require('./accordion'),
  banner: require('./banner'),
  footer: require('./footer'),
  navigation: require('./navigation'),
  password: require('./password'),
  search: require('./search'),
  skipnav: require('./skipnav'),
  validator: require('./validator') };

},{"./accordion":16,"./banner":17,"./footer":18,"./navigation":20,"./password":21,"./search":22,"./skipnav":23,"./validator":24}],20:[function(require,module,exports){
'use strict';var _CLICK;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var forEach = require('array-foreach');
var select = require('../utils/select');
var accordion = require('./accordion');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var NAV = '.' + PREFIX + '-nav';
var NAV_LINKS = NAV + ' a';
var OPENERS = '.' + PREFIX + '-menu-btn';
var CLOSE_BUTTON = '.' + PREFIX + '-nav-close';
var OVERLAY = '.' + PREFIX + '-overlay';
var CLOSERS = CLOSE_BUTTON + ', .' + PREFIX + '-overlay';
var TOGGLES = [NAV, OVERLAY].join(', ');

var ACTIVE_CLASS = 'sfgov-mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

var isActive = function isActive() {return document.body.classList.contains(ACTIVE_CLASS);};

var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  function trapTabKey(e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.keyCode === 27) {
      toggleNav.call(this, false);
    }
  }

  // Focus first child
  firstTabStop.focus();

  return {
    enable: function enable() {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },

    release: function release() {
      trapContainer.removeEventListener('keydown', trapTabKey);
    } };

};

var focusTrap = void 0;

var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });

  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton &&
  menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

var resize = function resize() {
  var closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

var navigation = behavior(_defineProperty({},
CLICK, (_CLICK = {}, _defineProperty(_CLICK,
OPENERS, toggleNav), _defineProperty(_CLICK,
CLOSERS, toggleNav), _defineProperty(_CLICK,
NAV_LINKS, function () {
  // A navigation link has been clicked! We want to collapse any
  // hierarchical navigation UI it's a part of, so that the user
  // can focus on whatever they've just selected.

  // Some navigation links are inside accordions; when they're
  // clicked, we want to collapse those accordions.
  var acc = this.closest(accordion.ACCORDION);
  if (acc) {
    accordion.getButtons(acc).forEach(function (btn) {return accordion.hide(btn);});
  }

  // If the mobile navigation menu is active, we want to hide it.
  if (isActive()) {
    toggleNav.call(this, false);
  }
}), _CLICK)),

{
  init: function init() {
    var trapContainer = document.querySelector(NAV);

    if (trapContainer) {
      focusTrap = _focusTrap(trapContainer);
    }

    resize();
    window.addEventListener('resize', resize, false);
  },
  teardown: function teardown() {
    window.removeEventListener('resize', resize, false);
  } });


/**
         * TODO for 2.0, remove this statement and export `navigation` directly:
         *
         * module.exports = behavior({...});
         */
var assign = require('object-assign');
module.exports = assign(
function (el) {return navigation.on(el);},
navigation);

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/select":32,"./accordion":16,"array-foreach":2,"object-assign":8}],21:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var toggleFormInput = require('../utils/toggle-form-input');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var LINK = '.' + PREFIX + '-show_password, .' + PREFIX + '-show_multipassword';

var toggle = function toggle(event) {
  event.preventDefault();
  toggleFormInput(this);
};

module.exports = behavior(_defineProperty({},
CLICK, _defineProperty({},
LINK, toggle)));

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/toggle-form-input":34}],22:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var forEach = require('array-foreach');
var ignore = require('receptor/ignore');
var select = require('../utils/select');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var BUTTON = '.js-search-button';
var FORM = '.js-search-form';
var INPUT = '[type=search]';
var CONTEXT = 'header'; // XXX
var VISUALLY_HIDDEN = PREFIX + '-sr-only';

var lastButton = void 0;

var showSearch = function showSearch(event) {
  toggleSearch(this, true);
  lastButton = this;
};

var hideSearch = function hideSearch(event) {
  toggleSearch(this, false);
  lastButton = undefined;
};

var getForm = function getForm(button) {
  var context = button.closest(CONTEXT);
  return context ?
  context.querySelector(FORM) :
  document.querySelector(FORM);
};

var toggleSearch = function toggleSearch(button, active) {
  var form = getForm(button);
  if (!form) {
    throw new Error('No ' + FORM + ' found for search toggle in ' + CONTEXT + '!');
  }

  button.hidden = active;
  form.classList.toggle(VISUALLY_HIDDEN, !active);

  if (active) {
    var input = form.querySelector(INPUT);
    if (input) {
      input.focus();
    }
    // when the user clicks _outside_ of the form w/ignore(): hide the
    // search, then remove the listener
    var listener = ignore(form, function (e) {
      if (lastButton) {
        hideSearch.call(lastButton);
      }
      document.body.removeEventListener(CLICK, listener);
    });

    // Normally we would just run this code without a timeout, but
    // IE11 and Edge will actually call the listener *immediately* because
    // they are currently handling this exact type of event, so we'll
    // make sure the browser is done handling the current click event,
    // if any, before we attach the listener.
    setTimeout(function () {
      document.body.addEventListener(CLICK, listener);
    }, 0);
  }
};

var search = behavior(_defineProperty({},
CLICK, _defineProperty({},
BUTTON, showSearch)),

{
  init: function init(target) {
    forEach(select(BUTTON, target), function (button) {
      toggleSearch(button, false);
    });
  },
  teardown: function teardown(target) {
    // forget the last button clicked
    lastButton = undefined;
  } });


/**
         * TODO for 2.0, remove this statement and export `navigation` directly:
         *
         * module.exports = behavior({...});
         */
var assign = require('object-assign');
module.exports = assign(
function (el) {return search.on(el);},
search);

},{"../config":25,"../events":26,"../utils/behavior":30,"../utils/select":32,"array-foreach":2,"object-assign":8,"receptor/ignore":13}],23:[function(require,module,exports){
'use strict';function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var behavior = require('../utils/behavior');
var once = require('receptor/once');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;
var LINK = '.' + PREFIX + '-skipnav[href^="#"], .' + PREFIX + '-footer-return-to-top [href^="#"]';
var MAINCONTENT = 'main-content';

var setTabindex = function setTabindex(event) {
  // NB: we know because of the selector we're delegating to below that the
  // href already begins with '#'
  var id = this.getAttribute('href');
  var target = document.getElementById(id === '#' ? MAINCONTENT : id.slice(1));

  if (target) {
    target.style.outline = '0';
    target.setAttribute('tabindex', 0);
    target.focus();
    target.addEventListener('blur', once(function (event) {
      target.setAttribute('tabindex', -1);
    }));
  } else {
    // throw an error?
  }
};

module.exports = behavior(_defineProperty({},
CLICK, _defineProperty({},
LINK, setTabindex)));

},{"../config":25,"../events":26,"../utils/behavior":30,"receptor/once":14}],24:[function(require,module,exports){
'use strict';
var behavior = require('../utils/behavior');
var validate = require('../utils/validate-input');
var debounce = require('lodash.debounce');

var change = function change(event) {
  return validate(this);
};

var validator = behavior({
  'keyup change': {
    'input[data-validation-element]': change } });



/**
                                                    * TODO for 2.0, remove this statement and export `navigation` directly:
                                                    *
                                                    * module.exports = behavior({...});
                                                    */
var assign = require('object-assign');
module.exports = assign(
function (el) {return validator.on(el);},
validator);

},{"../utils/behavior":30,"../utils/validate-input":36,"lodash.debounce":7,"object-assign":8}],25:[function(require,module,exports){
'use strict';module.exports = {
  prefix: 'sfgov' };

},{}],26:[function(require,module,exports){
'use strict';module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click' };

},{}],27:[function(require,module,exports){
'use strict';
var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    } });

}

},{}],28:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList
require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

},{"./element-hidden":27,"classlist-polyfill":3}],29:[function(require,module,exports){
'use strict';
var domready = require('domready');

/**
                                     * The 'polyfills' define key ECMAScript 5 methods that may be missing from
                                     * older browsers, so must be loaded first.
                                     */
require('./polyfills');

var uswds = require('./config');

var components = require('./components');
uswds.components = components;

console.log(uswds);

domready(function () {
  var target = document.body;
  for (var name in components) {
    var behavior = components[name];
    behavior.on(target);
  }
});

module.exports = uswds;

},{"./components":19,"./config":25,"./polyfills":28,"domready":4}],30:[function(require,module,exports){
'use strict';
var assign = require('object-assign');
var forEach = require('array-foreach');
var Behavior = require('receptor/behavior');

var sequence = function sequence() {
  var seq = [].slice.call(arguments);
  return function (target) {var _this = this;
    if (!target) {
      target = document.body;
    }
    forEach(seq, function (method) {
      if (typeof _this[method] === 'function') {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
    * @name behavior
    * @param {object} events
    * @param {object?} props
    * @return {receptor.behavior}
    */
module.exports = function (events, props) {
  return Behavior(events, assign({
    on: sequence('init', 'add'),
    off: sequence('teardown', 'remove') },
  props));
};

},{"array-foreach":2,"object-assign":8,"receptor/behavior":9}],31:[function(require,module,exports){
"use strict"; // https://stackoverflow.com/a/7557433
function isElementInViewport(el)
{var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || docEl.clientHeight) &&
    rect.right <= (win.innerWidth || docEl.clientWidth));

}

module.exports = isElementInViewport;

},{}],32:[function(require,module,exports){
'use strict';

/**
               * @name isElement
               * @desc returns whether or not the given argument is a DOM element.
               * @param {any} value
               * @return {boolean}
               */var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};
var isElement = function isElement(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.nodeType === 1;
};

/**
    * @name select
    * @desc selects elements from the DOM by class selector or ID selector.
    * @param {string} selector - The selector to traverse the DOM with.
    * @param {Document|HTMLElement?} context - The context to traverse the DOM
    *   in. If not provided, it defaults to the document.
    * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
    */
module.exports = function select(selector, context) {

  if (typeof selector !== 'string') {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],33:[function(require,module,exports){
'use strict'; /**
               * Flips given INPUT elements between masked (hiding the field value) and unmasked
               * @param {Array.HTMLElement} fields - An array of INPUT elements
               * @param {Boolean} mask - Whether the mask should be applied, hiding the field value
               */
module.exports = function (field, mask) {
  field.setAttribute('autocapitalize', 'off');
  field.setAttribute('autocorrect', 'off');
  field.setAttribute('type', mask ? 'password' : 'text');
};

},{}],34:[function(require,module,exports){
'use strict';
var forEach = require('array-foreach');
var resolveIdRefs = require('resolve-id-refs');
var select = require('./select');
var toggleFieldMask = require('./toggle-field-mask');

var CONTROLS = 'aria-controls';
var PRESSED = 'aria-pressed';
var SHOW_ATTR = 'data-show-text';
var HIDE_ATTR = 'data-hide-text';

/**
                                   * Replace the word "Show" (or "show") with "Hide" (or "hide") in a string.
                                   * @param {string} showText
                                   * @return {strong} hideText
                                   */
var getHideText = function getHideText(showText) {
  return showText.replace(/\bShow\b/i, function (show) {
    return ('S' === show[0] ? 'H' : 'h') + 'ide';
  });
};

/**
    * Component that decorates an HTML element with the ability to toggle the
    * masked state of an input field (like a password) when clicked.
    * The ids of the fields to be masked will be pulled directly from the button's
    * `aria-controls` attribute.
    *
    * @param  {HTMLElement} el    Parent element containing the fields to be masked
    * @return {boolean}
    */
module.exports = function (el) {
  // this is the *target* state:
  // * if the element has the attr and it's !== "true", pressed is true
  // * otherwise, pressed is false
  var pressed = el.hasAttribute(PRESSED) &&
  el.getAttribute(PRESSED) !== 'true';

  var fields = resolveIdRefs(el.getAttribute(CONTROLS));
  forEach(fields, function (field) {return toggleFieldMask(field, pressed);});

  if (!el.hasAttribute(SHOW_ATTR)) {
    el.setAttribute(SHOW_ATTR, el.textContent);
  }

  var showText = el.getAttribute(SHOW_ATTR);
  var hideText = el.getAttribute(HIDE_ATTR) || getHideText(showText);

  el.textContent = pressed ? showText : hideText;
  el.setAttribute(PRESSED, pressed);
  return pressed;
};

},{"./select":32,"./toggle-field-mask":33,"array-foreach":2,"resolve-id-refs":15}],35:[function(require,module,exports){
'use strict';
var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';

module.exports = function (button, expanded) {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);

  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error(
    'No toggle target found with id: "' + id + '"');

  }

  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}],36:[function(require,module,exports){
'use strict';
var dataset = require('elem-dataset');

var PREFIX = require('../config').prefix;
var CHECKED = 'aria-checked';
var CHECKED_CLASS = PREFIX + '-checklist-checked';

module.exports = function validate(el) {
  var data = dataset(el);
  var id = data.validationElement;
  var checkList = id.charAt(0) === '#' ?
  document.querySelector(id) :
  document.getElementById(id);

  if (!checkList) {
    throw new Error('No validation element found with id: "' +
    id + '"');

  }

  for (var key in data) {
    if (key.startsWith('validate')) {
      var validatorName = key.substr('validate'.length).toLowerCase();
      var validatorPattern = new RegExp(data[key]);
      var validatorSelector = '[data-validator="' + validatorName + '"]';
      var validatorCheckbox = checkList.querySelector(validatorSelector);
      if (!validatorCheckbox) {
        throw new Error('No validator checkbox found for: "' +
        validatorName + '"');

      }

      var checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);
    }
  }
};

},{"../config":25,"elem-dataset":5}]},{},[29])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FycmF5LWZvcmVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2xhc3NsaXN0LXBvbHlmaWxsL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtLWRhdGFzZXQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5kZWJvdW5jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2JlaGF2aW9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2NvbXBvc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGVBbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvaWdub3JlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL29uY2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVzb2x2ZS1pZC1yZWZzL2luZGV4LmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvYmFubmVyLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvZm9vdGVyLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvaW5kZXguanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvcGFzc3dvcmQuanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvY29tcG9uZW50cy9zZWFyY2guanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbXBvbmVudHMvdmFsaWRhdG9yLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL2NvbmZpZy5qcyIsInBhdHRlcm4tbGFiL3NvdXJjZS9qcy9ldmVudHMuanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInBhdHRlcm4tbGFiL3NvdXJjZS9qcy9zdGFydC5qcyIsInBhdHRlcm4tbGFiL3NvdXJjZS9qcy91dGlscy9iZWhhdmlvci5qcyIsInBhdHRlcm4tbGFiL3NvdXJjZS9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInBhdHRlcm4tbGFiL3NvdXJjZS9qcy91dGlscy9zZWxlY3QuanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvdXRpbHMvdG9nZ2xlLWZpZWxkLW1hc2suanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvdXRpbHMvdG9nZ2xlLWZvcm0taW5wdXQuanMiLCJwYXR0ZXJuLWxhYi9zb3VyY2UvanMvdXRpbHMvdG9nZ2xlLmpzIiwicGF0dGVybi1sYWIvc291cmNlL2pzL3V0aWxzL3ZhbGlkYXRlLWlucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0NBOzs7Ozs7Ozs7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsR0FBVixFQUFlLEVBQWYsRUFBbUIsSUFBbkIsRUFBeUI7QUFDeEMsTUFBSSxJQUFJLE1BQVIsRUFBZ0IsT0FBTyxJQUFJLE1BQUosQ0FBVyxFQUFYLEVBQWUsSUFBZixDQUFQO0FBQ2hCLE1BQUksS0FBSyxDQUFM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LENBRGM7QUFFZCxXQUFTLGNBQVQsQ0FBd0IsRUFBeEIsQ0FGSjs7QUFJQSxNQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkLFVBQU0sSUFBSSxLQUFKO0FBQ3FDLE1BRHJDLE9BQU47O0FBR0Q7O0FBRUQsT0FBSyxJQUFNLEdBQVgsSUFBa0IsSUFBbEIsRUFBd0I7QUFDdEIsUUFBSSxJQUFJLFVBQUosQ0FBZSxVQUFmLENBQUosRUFBZ0M7QUFDOUIsVUFBTSxnQkFBZ0IsSUFBSSxNQUFKLENBQVcsV0FBVyxNQUF0QixFQUE4QixXQUE5QixFQUF0QjtBQUNBLFVBQU0sbUJBQW1CLElBQUksTUFBSixDQUFXLEtBQU0sR0FBTixDQUFYLENBQXpCO0FBQ0EsVUFBTSwwQ0FBd0MsYUFBeEMsT0FBTjtBQUNBLFVBQU0sb0JBQW9CLFVBQVUsYUFBVixDQUF3QixpQkFBeEIsQ0FBMUI7QUFDQSxVQUFJLENBQUMsaUJBQUwsRUFBd0I7QUFDdEIsY0FBTSxJQUFJLEtBQUo7QUFDaUMscUJBRGpDLE9BQU47O0FBR0Q7O0FBRUQsVUFBTSxVQUFVLGlCQUFpQixJQUFqQixDQUFzQixHQUFHLEtBQXpCLENBQWhCO0FBQ0Esd0JBQWtCLFNBQWxCLENBQTRCLE1BQTVCLENBQW1DLGFBQW5DLEVBQWtELE9BQWxEO0FBQ0Esd0JBQWtCLFlBQWxCLENBQStCLE9BQS9CLEVBQXdDLE9BQXhDO0FBQ0Q7QUFDRjtBQUNGLENBOUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vKipcbiAqIEFycmF5I2ZpbHRlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdD19IHNlbGZcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHRocm93IFR5cGVFcnJvclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyciwgZm4sIHNlbGYpIHtcbiAgaWYgKGFyci5maWx0ZXIpIHJldHVybiBhcnIuZmlsdGVyKGZuLCBzZWxmKTtcbiAgaWYgKHZvaWQgMCA9PT0gYXJyIHx8IG51bGwgPT09IGFycikgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIGZuKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFoYXNPd24uY2FsbChhcnIsIGkpKSBjb250aW51ZTtcbiAgICB2YXIgdmFsID0gYXJyW2ldO1xuICAgIGlmIChmbi5jYWxsKHNlbGYsIHZhbCwgaSwgYXJyKSkgcmV0LnB1c2godmFsKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4iLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gPDMgTW9kZXJuaXpyXG4vLyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vTW9kZXJuaXpyL01vZGVybml6ci9tYXN0ZXIvZmVhdHVyZS1kZXRlY3RzL2RvbS9kYXRhc2V0LmpzXG5cbmZ1bmN0aW9uIHVzZU5hdGl2ZSgpIHtcblx0dmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYS1iJywgJ2MnKTtcblxuXHRyZXR1cm4gQm9vbGVhbihlbGVtLmRhdGFzZXQgJiYgZWxlbS5kYXRhc2V0LmFCID09PSAnYycpO1xufVxuXG5mdW5jdGlvbiBuYXRpdmVEYXRhc2V0KGVsZW1lbnQpIHtcblx0cmV0dXJuIGVsZW1lbnQuZGF0YXNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IG5hdGl2ZURhdGFzZXQgOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHR2YXIgbWFwID0ge307XG5cdHZhciBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xuXG5cdGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldHRlcihuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAodmFyIGkgPSAwLCBqID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHR2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcblxuXHRcdGlmIChhdHRyaWJ1dGUpIHtcblx0XHRcdHZhciBuYW1lID0gYXR0cmlidXRlLm5hbWU7XG5cblx0XHRcdGlmIChuYW1lLmluZGV4T2YoJ2RhdGEtJykgPT09IDApIHtcblx0XHRcdFx0dmFyIHByb3AgPSBuYW1lLnNsaWNlKDUpLnJlcGxhY2UoLy0uL2csIGZ1bmN0aW9uICh1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHUuY2hhckF0KDEpLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB2YWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZTtcblxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWFwLCBwcm9wLCB7XG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRnZXQ6IGdldHRlci5iaW5kKHsgdmFsdWU6IHZhbHVlIHx8ICcnIH0pLFxuXHRcdFx0XHRcdHNldDogc2V0dGVyLmJpbmQoZWxlbWVudCwgbmFtZSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG1hcDtcbn07XG5cbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5yZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGNvbXBvc2UgPSByZXF1aXJlKCcuLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZ25vcmUoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yYW5jZShlKSB7XG4gICAgaWYgKGVsZW1lbnQgIT09IGUudGFyZ2V0ICYmICFlbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJFX1RSSU0gPSAvKF5cXHMrKXwoXFxzKyQpL2c7XG52YXIgUkVfU1BMSVQgPSAvXFxzKy87XG5cbnZhciB0cmltID0gU3RyaW5nLnByb3RvdHlwZS50cmltXG4gID8gZnVuY3Rpb24oc3RyKSB7IHJldHVybiBzdHIudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24oc3RyKSB7IHJldHVybiBzdHIucmVwbGFjZShSRV9UUklNLCAnJyk7IH07XG5cbnZhciBxdWVyeUJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKCdbaWQ9XCInICsgaWQucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiXScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXNvbHZlSWRzKGlkcywgZG9jKSB7XG4gIGlmICh0eXBlb2YgaWRzICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzdHJpbmcgYnV0IGdvdCAnICsgKHR5cGVvZiBpZHMpKTtcbiAgfVxuXG4gIGlmICghZG9jKSB7XG4gICAgZG9jID0gd2luZG93LmRvY3VtZW50O1xuICB9XG5cbiAgdmFyIGdldEVsZW1lbnRCeUlkID0gZG9jLmdldEVsZW1lbnRCeUlkXG4gICAgPyBkb2MuZ2V0RWxlbWVudEJ5SWQuYmluZChkb2MpXG4gICAgOiBxdWVyeUJ5SWQuYmluZChkb2MpO1xuXG4gIGlkcyA9IHRyaW0oaWRzKS5zcGxpdChSRV9TUExJVCk7XG5cbiAgLy8gWFhYIHdlIGNhbiBzaG9ydC1jaXJjdWl0IGhlcmUgYmVjYXVzZSB0cmltbWluZyBhbmQgc3BsaXR0aW5nIGFcbiAgLy8gc3RyaW5nIG9mIGp1c3Qgd2hpdGVzcGFjZSBwcm9kdWNlcyBhbiBhcnJheSBjb250YWluaW5nIGEgc2luZ2xlLFxuICAvLyBlbXB0eSBzdHJpbmdcbiAgaWYgKGlkcy5sZW5ndGggPT09IDEgJiYgaWRzWzBdID09PSAnJykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHJldHVybiBpZHNcbiAgICAubWFwKGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgZWwgPSBnZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAoIWVsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gZWxlbWVudCB3aXRoIGlkOiBcIicgKyBpZCArICdcIicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVsO1xuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcbmNvbnN0IGZpbHRlciA9IHJlcXVpcmUoJ2FycmF5LWZpbHRlcicpO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XG5cbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XG5cbi8vIFhYWCBtYXRjaCAudXNhLWFjY29yZGlvbiBhbmQgLnVzYS1hY2NvcmRpb24tYm9yZGVyZWRcbmNvbnN0IEFDQ09SRElPTiA9IGAuJHtQUkVGSVh9LWFjY29yZGlvbiwgLiR7UFJFRklYfS1hY2NvcmRpb24tYm9yZGVyZWRgO1xuY29uc3QgQlVUVE9OID0gYC4ke1BSRUZJWH0tYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XG5cbi8qKlxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XG4gKiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcbiAqL1xuY29uc3QgdG9nZ2xlQnV0dG9uID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcbiAgdmFyIGFjY29yZGlvbiA9IGJ1dHRvbi5jbG9zZXN0KEFDQ09SRElPTik7XG4gIGlmICghYWNjb3JkaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0JVVFRPTn0gaXMgbWlzc2luZyBvdXRlciAke0FDQ09SRElPTn1gKTtcbiAgfVxuXG4gIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xuICAvLyBYWFggbXVsdGlzZWxlY3RhYmxlIGlzIG9wdC1pbiwgdG8gcHJlc2VydmUgbGVnYWN5IGJlaGF2aW9yXG4gIGNvbnN0IG11bHRpc2VsZWN0YWJsZSA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnO1xuXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgZm9yRWFjaChnZXRBY2NvcmRpb25CdXR0b25zKGFjY29yZGlvbiksIG90aGVyID0+IHtcbiAgICAgIGlmIChvdGhlciAhPT0gYnV0dG9uKSB7XG4gICAgICAgIHRvZ2dsZShvdGhlciwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZVxuICovXG5jb25zdCBzaG93QnV0dG9uID0gYnV0dG9uID0+IHRvZ2dsZUJ1dHRvbihidXR0b24sIHRydWUpO1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcbiAqL1xuY29uc3QgaGlkZUJ1dHRvbiA9IGJ1dHRvbiA9PiB0b2dnbGVCdXR0b24oYnV0dG9uLCBmYWxzZSk7XG5cbi8qKlxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjY29yZGlvblxuICogQHJldHVybiB7YXJyYXk8SFRNTEJ1dHRvbkVsZW1lbnQ+fVxuICovXG5jb25zdCBnZXRBY2NvcmRpb25CdXR0b25zID0gYWNjb3JkaW9uID0+IHtcbiAgcmV0dXJuIGZpbHRlcihhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pLCBidXR0b24gPT4ge1xuICAgIHJldHVybiBidXR0b24uY2xvc2VzdChBQ0NPUkRJT04pID09PSBhY2NvcmRpb247XG4gIH0pO1xufTtcblxuY29uc3QgYWNjb3JkaW9uID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIEJVVFRPTiBdOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0b2dnbGVCdXR0b24odGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xuICAgICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XG4gICAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xuICAgICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cbiAgICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KHRoaXMpKSB0aGlzLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0sIHtcbiAgaW5pdDogcm9vdCA9PiB7XG4gICAgZm9yRWFjaChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKSwgYnV0dG9uID0+IHtcbiAgICAgIGNvbnN0IGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcbiAgICAgIHRvZ2dsZUJ1dHRvbihidXR0b24sIGV4cGFuZGVkKTtcbiAgICB9KTtcbiAgfSxcbiAgQUNDT1JESU9OLFxuICBCVVRUT04sXG4gIHNob3c6IHNob3dCdXR0b24sXG4gIGhpZGU6IGhpZGVCdXR0b24sXG4gIHRvZ2dsZTogdG9nZ2xlQnV0dG9uLFxuICBnZXRCdXR0b25zOiBnZXRBY2NvcmRpb25CdXR0b25zLFxufSk7XG5cbi8qKlxuICogVE9ETzogZm9yIDIuMCwgcmVtb3ZlIGV2ZXJ5dGhpbmcgYmVsb3cgdGhpcyBjb21tZW50IGFuZCBleHBvcnQgdGhlXG4gKiBiZWhhdmlvciBkaXJlY3RseTpcbiAqXG4gKiBtb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHsuLi59KTtcbiAqL1xuY29uc3QgQWNjb3JkaW9uID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgdGhpcy5yb290ID0gcm9vdDtcbiAgYWNjb3JkaW9uLm9uKHRoaXMucm9vdCk7XG59O1xuXG4vLyBjb3B5IGFsbCBvZiB0aGUgYmVoYXZpb3IgbWV0aG9kcyBhbmQgcHJvcHMgdG8gQWNjb3JkaW9uXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5hc3NpZ24oQWNjb3JkaW9uLCBhY2NvcmRpb24pO1xuXG5BY2NvcmRpb24ucHJvdG90eXBlLnNob3cgPSBzaG93QnV0dG9uO1xuQWNjb3JkaW9uLnByb3RvdHlwZS5oaWRlID0gaGlkZUJ1dHRvbjtcblxuQWNjb3JkaW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gIGFjY29yZGlvbi5vZmYodGhpcy5yb290KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3JkaW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XG5cbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XG5cbmNvbnN0IEhFQURFUiA9IGAuJHtQUkVGSVh9LWJhbm5lci1oZWFkZXJgO1xuY29uc3QgRVhQQU5ERURfQ0xBU1MgPSBgJHtQUkVGSVh9LWJhbm5lci1oZWFkZXItZXhwYW5kZWRgO1xuXG5jb25zdCB0b2dnbGVCYW5uZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdGhpcy5jbG9zZXN0KEhFQURFUikuY2xhc3NMaXN0LnRvZ2dsZShFWFBBTkRFRF9DTEFTUyk7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIGAke0hFQURFUn0gW2FyaWEtY29udHJvbHNdYCBdOiB0b2dnbGVCYW5uZXIsXG4gIH0sXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGFjY29yZGlvbiA9IHJlcXVpcmUoJy4vYWNjb3JkaW9uJyk7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCBkZWJvdW5jZSA9IHJlcXVpcmUoJ2xvZGFzaC5kZWJvdW5jZScpO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcbmNvbnN0IFNDT1BFID0gYC4ke1BSRUZJWH0tZm9vdGVyLWJpZ2A7XG5jb25zdCBOQVYgPSBgJHtTQ09QRX0gbmF2YDtcbmNvbnN0IEJVVFRPTiA9IGAke05BVn0gLiR7UFJFRklYfS1mb290ZXItcHJpbWFyeS1saW5rYDtcbmNvbnN0IExJU1QgPSBgJHtOQVZ9IHVsYDtcblxuY29uc3QgSElERV9NQVhfV0lEVEggPSA2MDA7XG5jb25zdCBERUJPVU5DRV9SQVRFID0gMTgwO1xuXG5jb25zdCBzaG93UGFuZWwgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IEhJREVfTUFYX1dJRFRIKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xvc2VzdChMSVNUKTtcbiAgICBsaXN0LmNsYXNzTGlzdC50b2dnbGUoSElEREVOKTtcblxuICAgIC8vIE5COiB0aGlzICpzaG91bGQqIGFsd2F5cyBzdWNjZWVkIGJlY2F1c2UgdGhlIGJ1dHRvblxuICAgIC8vIHNlbGVjdG9yIGlzIHNjb3BlZCB0byBcIi57cHJlZml4fS1mb290ZXItYmlnIG5hdlwiXG4gICAgY29uc3QgbGlzdHMgPSBsaXN0LmNsb3Nlc3QoTkFWKVxuICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoJ3VsJyk7XG5cbiAgICBmb3JFYWNoKGxpc3RzLCBlbCA9PiB7XG4gICAgICBpZiAoZWwgIT09IGxpc3QpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChISURERU4pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5jb25zdCByZXNpemUgPSBkZWJvdW5jZSgoKSA9PiB7XG4gIGNvbnN0IGhpZGRlbiA9IHdpbmRvdy5pbm5lcldpZHRoIDwgSElERV9NQVhfV0lEVEg7XG4gIGZvckVhY2goc2VsZWN0KExJU1QpLCBsaXN0ID0+IHtcbiAgICBsaXN0LmNsYXNzTGlzdC50b2dnbGUoSElEREVOLCBoaWRkZW4pO1xuICB9KTtcbn0sIERFQk9VTkNFX1JBVEUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcbiAgWyBDTElDSyBdOiB7XG4gICAgWyBCVVRUT04gXTogc2hvd1BhbmVsLFxuICB9LFxufSwge1xuICAvLyBleHBvcnQgZm9yIHVzZSBlbHNld2hlcmVcbiAgSElERV9NQVhfV0lEVEgsXG4gIERFQk9VTkNFX1JBVEUsXG5cbiAgaW5pdDogdGFyZ2V0ID0+IHtcbiAgICByZXNpemUoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcbiAgfSxcblxuICB0ZWFyZG93bjogdGFyZ2V0ID0+IHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcbiAgfSxcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjY29yZGlvbjogIHJlcXVpcmUoJy4vYWNjb3JkaW9uJyksXG4gIGJhbm5lcjogICAgIHJlcXVpcmUoJy4vYmFubmVyJyksXG4gIGZvb3RlcjogICAgIHJlcXVpcmUoJy4vZm9vdGVyJyksXG4gIG5hdmlnYXRpb246IHJlcXVpcmUoJy4vbmF2aWdhdGlvbicpLFxuICBwYXNzd29yZDogICByZXF1aXJlKCcuL3Bhc3N3b3JkJyksXG4gIHNlYXJjaDogICAgIHJlcXVpcmUoJy4vc2VhcmNoJyksXG4gIHNraXBuYXY6ICAgIHJlcXVpcmUoJy4vc2tpcG5hdicpLFxuICB2YWxpZGF0b3I6ICByZXF1aXJlKCcuL3ZhbGlkYXRvcicpLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IGFjY29yZGlvbiA9IHJlcXVpcmUoJy4vYWNjb3JkaW9uJyk7XG5cbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XG5cbmNvbnN0IE5BViA9IGAuJHtQUkVGSVh9LW5hdmA7XG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xuY29uc3QgT1BFTkVSUyA9IGAuJHtQUkVGSVh9LW1lbnUtYnRuYDtcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuJHtQUkVGSVh9LW5hdi1jbG9zZWA7XG5jb25zdCBPVkVSTEFZID0gYC4ke1BSRUZJWH0tb3ZlcmxheWA7XG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLiR7UFJFRklYfS1vdmVybGF5YDtcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdzZmdvdi1tb2JpbGVfbmF2LWFjdGl2ZSc7XG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xuXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XG5cbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xuICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XG4gIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDEgXTtcblxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcbiAgICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gVEFCXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZvY3VzIGZpcnN0IGNoaWxkXG4gIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuXG4gIHJldHVybiB7XG4gICAgZW5hYmxlICgpIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXG4gICAgICB0cmFwQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICB0cmFwQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuICB9O1xufTtcblxubGV0IGZvY3VzVHJhcDtcblxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xuICB9XG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XG5cbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XG4gIH0pO1xuXG4gIGlmIChhY3RpdmUpIHtcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XG4gIH0gZWxzZSB7XG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XG5cbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICB9XG5cbiAgcmV0dXJuIGFjdGl2ZTtcbn07XG5cbmNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG5cbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xuICB9XG59O1xuXG5jb25zdCBuYXZpZ2F0aW9uID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIE9QRU5FUlMgXTogdG9nZ2xlTmF2LFxuICAgIFsgQ0xPU0VSUyBdOiB0b2dnbGVOYXYsXG4gICAgWyBOQVZfTElOS1MgXTogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcbiAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXG4gICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxuXG4gICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBhY2NvcmRpb25zOyB3aGVuIHRoZXkncmVcbiAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgYWNjb3JkaW9ucy5cbiAgICAgIGNvbnN0IGFjYyA9IHRoaXMuY2xvc2VzdChhY2NvcmRpb24uQUNDT1JESU9OKTtcbiAgICAgIGlmIChhY2MpIHtcbiAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKGJ0biA9PiBhY2NvcmRpb24uaGlkZShidG4pKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXG4gICAgICBpZiAoaXNBY3RpdmUoKSkge1xuICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0sIHtcbiAgaW5pdCAoKSB7XG4gICAgY29uc3QgdHJhcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTkFWKTtcblxuICAgIGlmICh0cmFwQ29udGFpbmVyKSB7XG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXIpO1xuICAgIH1cblxuICAgIHJlc2l6ZSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcbiAgfSxcbiAgdGVhcmRvd24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcbiAgfSxcbn0pO1xuXG4vKipcbiAqIFRPRE8gZm9yIDIuMCwgcmVtb3ZlIHRoaXMgc3RhdGVtZW50IGFuZCBleHBvcnQgYG5hdmlnYXRpb25gIGRpcmVjdGx5OlxuICpcbiAqIG1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioey4uLn0pO1xuICovXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbihcbiAgZWwgPT4gbmF2aWdhdGlvbi5vbihlbCksXG4gIG5hdmlnYXRpb25cbik7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCB0b2dnbGVGb3JtSW5wdXQgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUtZm9ybS1pbnB1dCcpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuXG5jb25zdCBMSU5LID0gYC4ke1BSRUZJWH0tc2hvd19wYXNzd29yZCwgLiR7UFJFRklYfS1zaG93X211bHRpcGFzc3dvcmRgO1xuXG5jb25zdCB0b2dnbGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgdG9nZ2xlRm9ybUlucHV0KHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7XG4gIFsgQ0xJQ0sgXToge1xuICAgIFsgTElOSyBdOiB0b2dnbGUsXG4gIH0sXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBpZ25vcmUgPSByZXF1aXJlKCdyZWNlcHRvci9pZ25vcmUnKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuXG5jb25zdCBCVVRUT04gPSAnLmpzLXNlYXJjaC1idXR0b24nO1xuY29uc3QgRk9STSA9ICcuanMtc2VhcmNoLWZvcm0nO1xuY29uc3QgSU5QVVQgPSAnW3R5cGU9c2VhcmNoXSc7XG5jb25zdCBDT05URVhUID0gJ2hlYWRlcic7IC8vIFhYWFxuY29uc3QgVklTVUFMTFlfSElEREVOID0gYCR7UFJFRklYfS1zci1vbmx5YDtcblxubGV0IGxhc3RCdXR0b247XG5cbmNvbnN0IHNob3dTZWFyY2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdG9nZ2xlU2VhcmNoKHRoaXMsIHRydWUpO1xuICBsYXN0QnV0dG9uID0gdGhpcztcbn07XG5cbmNvbnN0IGhpZGVTZWFyY2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdG9nZ2xlU2VhcmNoKHRoaXMsIGZhbHNlKTtcbiAgbGFzdEJ1dHRvbiA9IHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IGdldEZvcm0gPSBidXR0b24gPT4ge1xuICBjb25zdCBjb250ZXh0ID0gYnV0dG9uLmNsb3Nlc3QoQ09OVEVYVCk7XG4gIHJldHVybiBjb250ZXh0XG4gICAgPyBjb250ZXh0LnF1ZXJ5U2VsZWN0b3IoRk9STSlcbiAgICA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoRk9STSk7XG59O1xuXG5jb25zdCB0b2dnbGVTZWFyY2ggPSAoYnV0dG9uLCBhY3RpdmUpID0+IHtcbiAgY29uc3QgZm9ybSA9IGdldEZvcm0oYnV0dG9uKTtcbiAgaWYgKCFmb3JtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBObyAke0ZPUk19IGZvdW5kIGZvciBzZWFyY2ggdG9nZ2xlIGluICR7Q09OVEVYVH0hYCk7XG4gIH1cblxuICBidXR0b24uaGlkZGVuID0gYWN0aXZlO1xuICBmb3JtLmNsYXNzTGlzdC50b2dnbGUoVklTVUFMTFlfSElEREVOLCAhYWN0aXZlKTtcblxuICBpZiAoYWN0aXZlKSB7XG4gICAgY29uc3QgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoSU5QVVQpO1xuICAgIGlmIChpbnB1dCkge1xuICAgICAgaW5wdXQuZm9jdXMoKTtcbiAgICB9XG4gICAgLy8gd2hlbiB0aGUgdXNlciBjbGlja3MgX291dHNpZGVfIG9mIHRoZSBmb3JtIHcvaWdub3JlKCk6IGhpZGUgdGhlXG4gICAgLy8gc2VhcmNoLCB0aGVuIHJlbW92ZSB0aGUgbGlzdGVuZXJcbiAgICBjb25zdCBsaXN0ZW5lciA9IGlnbm9yZShmb3JtLCBlID0+IHtcbiAgICAgIGlmIChsYXN0QnV0dG9uKSB7XG4gICAgICAgIGhpZGVTZWFyY2guY2FsbChsYXN0QnV0dG9uKTtcbiAgICAgIH1cbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihDTElDSywgbGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gTm9ybWFsbHkgd2Ugd291bGQganVzdCBydW4gdGhpcyBjb2RlIHdpdGhvdXQgYSB0aW1lb3V0LCBidXRcbiAgICAvLyBJRTExIGFuZCBFZGdlIHdpbGwgYWN0dWFsbHkgY2FsbCB0aGUgbGlzdGVuZXIgKmltbWVkaWF0ZWx5KiBiZWNhdXNlXG4gICAgLy8gdGhleSBhcmUgY3VycmVudGx5IGhhbmRsaW5nIHRoaXMgZXhhY3QgdHlwZSBvZiBldmVudCwgc28gd2UnbGxcbiAgICAvLyBtYWtlIHN1cmUgdGhlIGJyb3dzZXIgaXMgZG9uZSBoYW5kbGluZyB0aGUgY3VycmVudCBjbGljayBldmVudCxcbiAgICAvLyBpZiBhbnksIGJlZm9yZSB3ZSBhdHRhY2ggdGhlIGxpc3RlbmVyLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKENMSUNLLCBsaXN0ZW5lcik7XG4gICAgfSwgMCk7XG4gIH1cbn07XG5cbmNvbnN0IHNlYXJjaCA9IGJlaGF2aW9yKHtcbiAgWyBDTElDSyBdOiB7XG4gICAgWyBCVVRUT04gXTogc2hvd1NlYXJjaCxcbiAgfSxcbn0sIHtcbiAgaW5pdDogKHRhcmdldCkgPT4ge1xuICAgIGZvckVhY2goc2VsZWN0KEJVVFRPTiwgdGFyZ2V0KSwgYnV0dG9uID0+IHtcbiAgICAgIHRvZ2dsZVNlYXJjaChidXR0b24sIGZhbHNlKTtcbiAgICB9KTtcbiAgfSxcbiAgdGVhcmRvd246ICh0YXJnZXQpID0+IHtcbiAgICAvLyBmb3JnZXQgdGhlIGxhc3QgYnV0dG9uIGNsaWNrZWRcbiAgICBsYXN0QnV0dG9uID0gdW5kZWZpbmVkO1xuICB9LFxufSk7XG5cbi8qKlxuICogVE9ETyBmb3IgMi4wLCByZW1vdmUgdGhpcyBzdGF0ZW1lbnQgYW5kIGV4cG9ydCBgbmF2aWdhdGlvbmAgZGlyZWN0bHk6XG4gKlxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XG4gKi9cbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gYXNzaWduKFxuICBlbCA9PiBzZWFyY2gub24oZWwpLFxuICBzZWFyY2hcbik7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuY29uc3QgTElOSyA9IGAuJHtQUkVGSVh9LXNraXBuYXZbaHJlZl49XCIjXCJdLCAuJHtQUkVGSVh9LWZvb3Rlci1yZXR1cm4tdG8tdG9wIFtocmVmXj1cIiNcIl1gO1xuY29uc3QgTUFJTkNPTlRFTlQgPSAnbWFpbi1jb250ZW50JztcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxuICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXG4gIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoKGlkID09PSAnIycpID8gTUFJTkNPTlRFTlQgOiBpZC5zbGljZSgxKSk7XG5cbiAgaWYgKHRhcmdldCkge1xuICAgIHRhcmdldC5zdHlsZS5vdXRsaW5lID0gJzAnO1xuICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgdGFyZ2V0LmZvY3VzKCk7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbmNlKGV2ZW50ID0+IHtcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICAgIH0pKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB0aHJvdyBhbiBlcnJvcj9cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7XG4gIFsgQ0xJQ0sgXToge1xuICAgIFsgTElOSyBdOiBzZXRUYWJpbmRleCxcbiAgfSxcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3QgdmFsaWRhdGUgPSByZXF1aXJlKCcuLi91dGlscy92YWxpZGF0ZS1pbnB1dCcpO1xuY29uc3QgZGVib3VuY2UgPSByZXF1aXJlKCdsb2Rhc2guZGVib3VuY2UnKTtcblxuY29uc3QgY2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJldHVybiB2YWxpZGF0ZSh0aGlzKTtcbn07XG5cbmNvbnN0IHZhbGlkYXRvciA9IGJlaGF2aW9yKHtcbiAgJ2tleXVwIGNoYW5nZSc6IHtcbiAgICAnaW5wdXRbZGF0YS12YWxpZGF0aW9uLWVsZW1lbnRdJzogY2hhbmdlLFxuICB9LFxufSk7XG5cbi8qKlxuICogVE9ETyBmb3IgMi4wLCByZW1vdmUgdGhpcyBzdGF0ZW1lbnQgYW5kIGV4cG9ydCBgbmF2aWdhdGlvbmAgZGlyZWN0bHk6XG4gKlxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XG4gKi9cbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gYXNzaWduKFxuICBlbCA9PiB2YWxpZGF0b3Iub24oZWwpLFxuICB2YWxpZGF0b3Jcbik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJlZml4OiAnc2Znb3YnXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxuICAvLyBicm93c2VyIHN1cHBvcnRlZCB0b3VjaCBldmVudHM7IGlmIGl0IGRpZCwgYENMSUNLYCB3YXMgc2V0IHRvXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcbiAgLy9cbiAgLy8gKiBJdCBwcmUtZW1wdGVkIG1vYmlsZSBicm93c2VycycgZGVmYXVsdCBiZWhhdmlvciBvZiBkZXRlY3RpbmdcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXG4gIC8vXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxuICAvLyAgIHN1cHBvcnQgZm9yIHRoZSB1c2VyJ3MgbW91c2UsIGZydXN0cmF0aW5nIHVzZXJzIHdobyBwcmVmZXJyZWRcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxuICBDTElDSzogJ2NsaWNrJyxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcbmNvbnN0IEhJRERFTiA9ICdoaWRkZW4nO1xuXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVscHJvdG8sIEhJRERFTiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEhJRERFTiwgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcbnJlcXVpcmUoJ2NsYXNzbGlzdC1wb2x5ZmlsbCcpO1xuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcblxuLyoqXG4gKiBUaGUgJ3BvbHlmaWxscycgZGVmaW5lIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IG1heSBiZSBtaXNzaW5nIGZyb21cbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cbiAqL1xucmVxdWlyZSgnLi9wb2x5ZmlsbHMnKTtcblxuY29uc3QgdXN3ZHMgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG5jb25zdCBjb21wb25lbnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzJyk7XG51c3dkcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcblxuY29uc29sZS5sb2codXN3ZHMpXG5cbmRvbXJlYWR5KCgpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcbiAgZm9yIChsZXQgbmFtZSBpbiBjb21wb25lbnRzKSB7XG4gICAgY29uc3QgYmVoYXZpb3IgPSBjb21wb25lbnRzWyBuYW1lIF07XG4gICAgYmVoYXZpb3Iub24odGFyZ2V0KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdXN3ZHM7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xuY29uc3QgQmVoYXZpb3IgPSByZXF1aXJlKCdyZWNlcHRvci9iZWhhdmlvcicpO1xuXG5jb25zdCBzZXF1ZW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgc2VxID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xuICAgIH1cbiAgICBmb3JFYWNoKHNlcSwgbWV0aG9kID0+IHtcbiAgICAgIGlmICh0eXBlb2YgdGhpc1sgbWV0aG9kIF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpc1sgbWV0aG9kIF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufTtcblxuLyoqXG4gKiBAbmFtZSBiZWhhdmlvclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xuICogQHBhcmFtIHtvYmplY3Q/fSBwcm9wc1xuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gKGV2ZW50cywgcHJvcHMpID0+IHtcbiAgcmV0dXJuIEJlaGF2aW9yKGV2ZW50cywgYXNzaWduKHtcbiAgICBvbjogICBzZXF1ZW5jZSgnaW5pdCcsICdhZGQnKSxcbiAgICBvZmY6ICBzZXF1ZW5jZSgndGVhcmRvd24nLCAncmVtb3ZlJyksXG4gIH0sIHByb3BzKSk7XG59O1xuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsLCB3aW49d2luZG93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgcmV0dXJuIChcbiAgICByZWN0LnRvcCA+PSAwICYmXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcbiAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnRJblZpZXdwb3J0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBuYW1lIGlzRWxlbWVudFxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNFbGVtZW50ID0gdmFsdWUgPT4ge1xuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcbn07XG5cbi8qKlxuICogQG5hbWUgc2VsZWN0XG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFRoZSBzZWxlY3RvciB0byB0cmF2ZXJzZSB0aGUgRE9NIHdpdGguXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX0gLSBBbiBhcnJheSBvZiBET00gbm9kZXMgb3IgYW4gZW1wdHkgYXJyYXkuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0IChzZWxlY3RvciwgY29udGV4dCkge1xuXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcbiAgICBjb250ZXh0ID0gd2luZG93LmRvY3VtZW50O1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XG59O1xuIiwiLyoqXG4gKiBGbGlwcyBnaXZlbiBJTlBVVCBlbGVtZW50cyBiZXR3ZWVuIG1hc2tlZCAoaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZSkgYW5kIHVubWFza2VkXG4gKiBAcGFyYW0ge0FycmF5LkhUTUxFbGVtZW50fSBmaWVsZHMgLSBBbiBhcnJheSBvZiBJTlBVVCBlbGVtZW50c1xuICogQHBhcmFtIHtCb29sZWFufSBtYXNrIC0gV2hldGhlciB0aGUgbWFzayBzaG91bGQgYmUgYXBwbGllZCwgaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmaWVsZCwgbWFzaykgPT4ge1xuICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2F1dG9jYXBpdGFsaXplJywgJ29mZicpO1xuICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb3JyZWN0JywgJ29mZicpO1xuICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCBtYXNrID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0Jyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcbmNvbnN0IHJlc29sdmVJZFJlZnMgPSByZXF1aXJlKCdyZXNvbHZlLWlkLXJlZnMnKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4vc2VsZWN0Jyk7XG5jb25zdCB0b2dnbGVGaWVsZE1hc2sgPSByZXF1aXJlKCcuL3RvZ2dsZS1maWVsZC1tYXNrJyk7XG5cbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xuY29uc3QgUFJFU1NFRCA9ICdhcmlhLXByZXNzZWQnO1xuY29uc3QgU0hPV19BVFRSID0gJ2RhdGEtc2hvdy10ZXh0JztcbmNvbnN0IEhJREVfQVRUUiA9ICdkYXRhLWhpZGUtdGV4dCc7XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgd29yZCBcIlNob3dcIiAob3IgXCJzaG93XCIpIHdpdGggXCJIaWRlXCIgKG9yIFwiaGlkZVwiKSBpbiBhIHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzaG93VGV4dFxuICogQHJldHVybiB7c3Ryb25nfSBoaWRlVGV4dFxuICovXG5jb25zdCBnZXRIaWRlVGV4dCA9IHNob3dUZXh0ID0+IHtcbiAgcmV0dXJuIHNob3dUZXh0LnJlcGxhY2UoL1xcYlNob3dcXGIvaSwgc2hvdyA9PiB7XG4gICAgcmV0dXJuICgnUycgPT09IHNob3dbIDAgXSA/ICdIJyA6ICdoJykgKyAnaWRlJztcbiAgfSk7XG59O1xuXG4vKipcbiAqIENvbXBvbmVudCB0aGF0IGRlY29yYXRlcyBhbiBIVE1MIGVsZW1lbnQgd2l0aCB0aGUgYWJpbGl0eSB0byB0b2dnbGUgdGhlXG4gKiBtYXNrZWQgc3RhdGUgb2YgYW4gaW5wdXQgZmllbGQgKGxpa2UgYSBwYXNzd29yZCkgd2hlbiBjbGlja2VkLlxuICogVGhlIGlkcyBvZiB0aGUgZmllbGRzIHRvIGJlIG1hc2tlZCB3aWxsIGJlIHB1bGxlZCBkaXJlY3RseSBmcm9tIHRoZSBidXR0b24nc1xuICogYGFyaWEtY29udHJvbHNgIGF0dHJpYnV0ZS5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWwgICAgUGFyZW50IGVsZW1lbnQgY29udGFpbmluZyB0aGUgZmllbGRzIHRvIGJlIG1hc2tlZFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBlbCA9PiB7XG4gIC8vIHRoaXMgaXMgdGhlICp0YXJnZXQqIHN0YXRlOlxuICAvLyAqIGlmIHRoZSBlbGVtZW50IGhhcyB0aGUgYXR0ciBhbmQgaXQncyAhPT0gXCJ0cnVlXCIsIHByZXNzZWQgaXMgdHJ1ZVxuICAvLyAqIG90aGVyd2lzZSwgcHJlc3NlZCBpcyBmYWxzZVxuICBjb25zdCBwcmVzc2VkID0gZWwuaGFzQXR0cmlidXRlKFBSRVNTRUQpXG4gICAgJiYgZWwuZ2V0QXR0cmlidXRlKFBSRVNTRUQpICE9PSAndHJ1ZSc7XG5cbiAgY29uc3QgZmllbGRzID0gcmVzb2x2ZUlkUmVmcyhlbC5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpKTtcbiAgZm9yRWFjaChmaWVsZHMsIGZpZWxkID0+IHRvZ2dsZUZpZWxkTWFzayhmaWVsZCwgcHJlc3NlZCkpO1xuXG4gIGlmICghZWwuaGFzQXR0cmlidXRlKFNIT1dfQVRUUikpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoU0hPV19BVFRSLCBlbC50ZXh0Q29udGVudCk7XG4gIH1cblxuICBjb25zdCBzaG93VGV4dCA9IGVsLmdldEF0dHJpYnV0ZShTSE9XX0FUVFIpO1xuICBjb25zdCBoaWRlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShISURFX0FUVFIpIHx8IGdldEhpZGVUZXh0KHNob3dUZXh0KTtcblxuICBlbC50ZXh0Q29udGVudCA9IHByZXNzZWQgPyBzaG93VGV4dCA6IGhpZGVUZXh0O1xuICBlbC5zZXRBdHRyaWJ1dGUoUFJFU1NFRCwgcHJlc3NlZCk7XG4gIHJldHVybiBwcmVzc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XG5cbiAgaWYgKHR5cGVvZiBleHBhbmRlZCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcbiAgfVxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBleHBhbmRlZCk7XG5cbiAgY29uc3QgaWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKENPTlRST0xTKTtcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIGlmICghY29udHJvbHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcbiAgICApO1xuICB9XG5cbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcbiAgcmV0dXJuIGV4cGFuZGVkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGRhdGFzZXQgPSByZXF1aXJlKCdlbGVtLWRhdGFzZXQnKTtcblxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuY29uc3QgQ0hFQ0tFRCA9ICdhcmlhLWNoZWNrZWQnO1xuY29uc3QgQ0hFQ0tFRF9DTEFTUyA9IGAke1BSRUZJWH0tY2hlY2tsaXN0LWNoZWNrZWRgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHZhbGlkYXRlIChlbCkge1xuICBjb25zdCBkYXRhID0gZGF0YXNldChlbCk7XG4gIGNvbnN0IGlkID0gZGF0YS52YWxpZGF0aW9uRWxlbWVudDtcbiAgY29uc3QgY2hlY2tMaXN0ID0gaWQuY2hhckF0KDApID09PSAnIydcbiAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG4gICAgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgaWYgKCFjaGVja0xpc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgTm8gdmFsaWRhdGlvbiBlbGVtZW50IGZvdW5kIHdpdGggaWQ6IFwiJHtpZH1cImBcbiAgICApO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgIGlmIChrZXkuc3RhcnRzV2l0aCgndmFsaWRhdGUnKSkge1xuICAgICAgY29uc3QgdmFsaWRhdG9yTmFtZSA9IGtleS5zdWJzdHIoJ3ZhbGlkYXRlJy5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCB2YWxpZGF0b3JQYXR0ZXJuID0gbmV3IFJlZ0V4cChkYXRhWyBrZXkgXSk7XG4gICAgICBjb25zdCB2YWxpZGF0b3JTZWxlY3RvciA9IGBbZGF0YS12YWxpZGF0b3I9XCIke3ZhbGlkYXRvck5hbWV9XCJdYDtcbiAgICAgIGNvbnN0IHZhbGlkYXRvckNoZWNrYm94ID0gY2hlY2tMaXN0LnF1ZXJ5U2VsZWN0b3IodmFsaWRhdG9yU2VsZWN0b3IpO1xuICAgICAgaWYgKCF2YWxpZGF0b3JDaGVja2JveCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYE5vIHZhbGlkYXRvciBjaGVja2JveCBmb3VuZCBmb3I6IFwiJHt2YWxpZGF0b3JOYW1lfVwiYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGVja2VkID0gdmFsaWRhdG9yUGF0dGVybi50ZXN0KGVsLnZhbHVlKTtcbiAgICAgIHZhbGlkYXRvckNoZWNrYm94LmNsYXNzTGlzdC50b2dnbGUoQ0hFQ0tFRF9DTEFTUywgY2hlY2tlZCk7XG4gICAgICB2YWxpZGF0b3JDaGVja2JveC5zZXRBdHRyaWJ1dGUoQ0hFQ0tFRCwgY2hlY2tlZCk7XG4gICAgfVxuICB9XG59O1xuIl19
