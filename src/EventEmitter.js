/**
 * @file 事件封装类
 * @author qiaogang
 */

import { assign, trim } from './Util';
let _uid = -1;

// space-separated
const SS = /\s+/;

class EventEmitter {

    /**
     * 构造函数
     */
    constructor() {

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
    on(types, listener, context) {

        types = trim(types).split(SS);

        let i = -1, len = types.length;
        while (++i < len) {
            let type = types[i];
            this._on(type, listener, context);
        }

        return this;
    }

    _on(type, listener, context) {

        let events = this.__events__;

        let listeners = events[type] = events[type] || [];
        if (context === this) {
            context = undefined;
        }
        let i = -1, len = listeners;
        while (++i < len) {
            let { fn, ctx } = listeners[i];
            if (fn === listener && ctx === context) {
                return this;
            }
        }

        let newListener = { fn: listener, ctx: context };
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
    once(types, listener, context) {

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
    off(types, listener, context) {

        if (!types) {
            this.__events__ = {};

            return this;
        }

        types = trim(types).split(SS);

        let j = -1, len = types.length;
        while (++j < len) {
            let type = types[j];
            if (type) {
                this._off(type, listener, context);
            }
        }

        return this;
    }

    _off(type, listener, context) {

        if (!type) {
            this.__events__ = {};

            return this;
        }

        let events = this.__events__;
        if (!listener) {
            delete events[type];

            return this;
        }

        let listeners = events[type];
        if (listeners) {

            let i = listeners.length;
            while (--i >= 0) {
                let { fn, ctx } = listeners[i];
                if (ctx !== context) continue;
                if (fn === listener || fn === fn.listener) {
                    listeners.splice(i, 1);
                    fn = () => {};
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
    emit(type, data, propagate) {

        if (!this._listens(type, propagate)) return this;

        let listeners = this.__events__[type];

        let event = assign({}, data, {
            target: this,
            type
        });

        if (listeners) {
            let i = -1,
                len = listeners.length;
            while (++i < len) {
                let { fn, ctx } = listeners[i];
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
    addEventParent(ee, fn) {
        this._eventParents = this._eventParents || {};
        this._eventParents[ee.__id__] = {
            target: ee,
            fn
        };

        return this;
    }

    removeEventParent(ee) {
        if (this._eventParents) {
            delete this._eventParents[ee.__id__];
        }

        return this;
    }

    _propagateEvent(ev) {

        let eParents = this._eventParents;

        for (let id in eParents) {
            let { target, fn } = eParents[id];
            let args = assign({}, {
                propagatedFrom: ev.target
            }, ev);
            args = fn ? fn.call(this, args) : args;

            target.emit(ev.type, args, true);
        }
    }

    _listens(type, propagate) {
        var listeners = this.__events__ && this.__events__[type];
        if (listeners && listeners.length) { return true; }

        if (propagate) {
            // also check parents for listeners if event propagates
            let eParents = this._eventParents;
            for (let id in eParents) {
                if (eParents[id].target._listens(type, propagate)) { return true; }
            }
        }

        return false;
    }

    /**
     * 获取绑定事件
     * @returns {Object}
     */
    get events() {
        return this.__events__;
    }

    /**
     * 唯一标识
     * @returns {number}
     */
    get id() {
        return this.__id__;
    }
}

export default EventEmitter;
