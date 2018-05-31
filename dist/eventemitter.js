(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("EventEmiiter", [], factory);
	else if(typeof exports === 'object')
		exports["EventEmiiter"] = factory();
	else
		root["EventEmiiter"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/EventEmitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/EventEmitter.js":
/*!*****************************!*\
  !*** ./src/EventEmitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 事件封装类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author redmed
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Util = __webpack_require__(/*! ./Util */ "./src/Util.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _uid = -1;

// space-separated
var SS = /\s+/;

var EventEmitter = function () {

    /**
     * 构造函数
     */
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        /**
         * 事件池
         * @type {Object}
         * @private
         */
        this.__events__ = {};

        /**
         *
         * @type {number}
         * @private
         */
        this.__id__ = ++_uid;
    }

    /**
     * 事件绑定, 不支持过滤重复添加
     * @param {string} types
     * @param {Function} listener
     * @param {*=} context
     * @returns {EventEmitter}
     */


    _createClass(EventEmitter, [{
        key: 'on',
        value: function on(types, listener, context) {

            types = (0, _Util.trim)(types).split(SS);

            var i = -1,
                len = types.length;
            while (++i < len) {
                var type = types[i];
                this._on(type, listener, context);
            }

            return this;
        }
    }, {
        key: '_on',
        value: function _on(type, listener, context) {

            var events = this.__events__;

            var listeners = events[type] = events[type] || [];
            if (context === this) {
                context = undefined;
            }
            var i = -1,
                len = listeners;
            while (++i < len) {
                var _listeners$i = listeners[i],
                    fn = _listeners$i.fn,
                    ctx = _listeners$i.ctx;

                if (fn === listener && ctx === context) {
                    return this;
                }
            }

            var newListener = { fn: listener, ctx: context };
            listeners.push(newListener);

            return this;
        }

        /**
         * 事件绑定, 只绑定一次, 用后即焚
         * @param {string} types
         * @param {Function} listener
         * @param {*=} context
         * @returns {EventEmitter}
         */

    }, {
        key: 'once',
        value: function once(types, listener, context) {

            function onceCallback(ev) {
                this.off(types, onceCallback);
                listener.call(this, ev);
            }

            onceCallback.listener = listener;

            return this.on(types, onceCallback, context);
        }

        /**
         * 事件解绑
         * @param {string=} types
         * @param {Function=} listener
         * @param {*=} context
         * @returns {EventEmitter}
         */

    }, {
        key: 'off',
        value: function off(types, listener, context) {

            if (!types) {
                this.__events__ = {};

                return this;
            }

            types = (0, _Util.trim)(types).split(SS);

            var j = -1,
                len = types.length;
            while (++j < len) {
                var type = types[j];
                if (type) {
                    this._off(type, listener, context);
                }
            }

            return this;
        }
    }, {
        key: '_off',
        value: function _off(type, listener, context) {

            if (!type) {
                this.__events__ = {};

                return this;
            }

            var events = this.__events__;
            if (!listener) {
                delete events[type];

                return this;
            }

            var listeners = events[type];
            if (listeners) {

                var i = listeners.length;
                while (--i >= 0) {
                    var _listeners$i2 = listeners[i],
                        fn = _listeners$i2.fn,
                        ctx = _listeners$i2.ctx;

                    if (ctx !== context) continue;
                    if (fn === listener || fn === fn.listener) {
                        listeners.splice(i, 1);
                        fn = function fn() {};
                    }
                }
            }

            return this;
        }

        /**
         * 事件触发
         * @param {string} type
         * @param {Object=} data
         * @param {boolean=} propagate 是否向父级事件链冒泡
         * @returns {EventEmitter}
         */

    }, {
        key: 'emit',
        value: function emit(type, data, propagate) {

            if (!this._listens(type, propagate)) return this;

            var listeners = this.__events__[type];

            var event = (0, _Util.assign)({}, data, {
                target: this,
                type: type
            });

            if (listeners) {
                var i = -1,
                    len = listeners.length;
                while (++i < len) {
                    var _listeners$i3 = listeners[i],
                        fn = _listeners$i3.fn,
                        ctx = _listeners$i3.ctx;

                    fn.call(ctx || this, event);
                }
            }

            if (propagate) {

                // propagate the event to parents (set with addEventParent)
                this._propagateEvent(event);
            }

            return this;
        }

        /**
         * 添加父级事件链
         * @param {EventEmitter} ee
         * @param {Function=} fn
         * @returns {EventEmitter}
         */

    }, {
        key: 'addEventParent',
        value: function addEventParent(ee, fn) {
            this._eventParents = this._eventParents || {};
            this._eventParents[ee.__id__] = {
                target: ee,
                fn: fn
            };

            return this;
        }
    }, {
        key: 'removeEventParent',
        value: function removeEventParent(ee) {
            if (this._eventParents) {
                delete this._eventParents[ee.__id__];
            }

            return this;
        }
    }, {
        key: '_propagateEvent',
        value: function _propagateEvent(ev) {

            var eParents = this._eventParents;

            for (var id in eParents) {
                var _eParents$id = eParents[id],
                    target = _eParents$id.target,
                    fn = _eParents$id.fn;

                var args = (0, _Util.assign)({}, {
                    propagatedFrom: ev.target
                }, ev);
                args = fn ? fn.call(this, args) : args;

                target.emit(ev.type, args, true);
            }
        }
    }, {
        key: '_listens',
        value: function _listens(type, propagate) {
            var listeners = this.__events__ && this.__events__[type];
            if (listeners && listeners.length) {
                return true;
            }

            if (propagate) {
                // also check parents for listeners if event propagates
                var eParents = this._eventParents;
                for (var id in eParents) {
                    if (eParents[id].target._listens(type, propagate)) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * 获取绑定事件
         * @returns {Object}
         */

    }, {
        key: 'events',
        get: function get() {
            return this.__events__;
        }
    }, {
        key: 'id',
        get: function get() {
            return this.__id__;
        }
    }]);

    return EventEmitter;
}();

exports.default = EventEmitter;

/***/ }),

/***/ "./src/Util.js":
/*!*********************!*\
  !*** ./src/Util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assign = assign;
exports.trim = trim;
function assign(target) {
    if (target == null) {
        throw new Error('Cannot convert undefined or null to object');
    }

    var i = -1,
        len = arguments.length <= 1 ? 0 : arguments.length - 1;
    while (++i < len) {
        var source = arguments.length <= i + 1 ? undefined : arguments[i + 1];
        if (source != null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    }

    return target;
}

function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/***/ })

/******/ });
});