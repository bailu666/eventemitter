/**
 * @file EventEmitter
 * @author redmed
 */

import { assign, trim, isNul } from './Util';
let _uid = -1;

// space-separated
const SS = /\s+/;

export class EventEmitter {

    constructor() {

        /**
         * 事件池
         * @type {Object}
         * @private
         */
        this.__events__ = {};

        /**
         * 唯一标识
         * @type {number}
         * @private
         */
        this.__id__ = ++_uid;

    }

    /**
     * 事件绑定, 不支持过滤重复添加
     * @param {string} types 事件名。支持多个，以空格分割
     * @param {Function} listener
     * @param {*=} context
     * @returns {EventEmitter}
     */
    on(types, listener, context) {

        types = trim(types).split(SS);

        let i = -1, len = types.length;
        while (++i < len) {
            this._on(types[i], listener, context);
        }

        return this;
    }

    _on(type, listener, context) {

        const events = this.__events__;

        const listeners = events[type] = events[type] || [];
        if (context === this) {
            context = undefined;
        }

        let i = -1, len = listeners;
        while (++i < len) {
            const { fn, ctx } = listeners[i];
            if (fn === listener && ctx === context) {
                return this;
            }
        }

        listeners.push({ fn: listener, ctx: context });

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

        // Unbind all
        if (isNul(types)) {
            this.__events__ = {};

            return this;
        }

        types = trim(types).split(SS);

        let j = -1, len = types.length;
        while (++j < len) {
            const type = types[j];
            if (type) {
                this._off(type, listener, context);
            }
        }

        return this;
    }

    _off(type, listener, context) {

        // Unbind all
        if (isNul(type)) {
            this.__events__ = {};

            return this;
        }

        // Unbind type
        const events = this.__events__;
        if (isNul(listener)) {
            delete events[type];

            return this;
        }

        // Unbind listener
        const listeners = events[type];
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

        const listeners = this.__events__[type];

        const event = assign({}, data, {
            target: this,
            type
        });

        if (listeners) {
            let i = -1,
                len = listeners.length;
            while (++i < len) {
                const { fn, ctx } = listeners[i];
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
     * @param {EventEmitter} ee 需要绑定的父级 EE
     * @param {Function=} fn 触发父级事件时的回调函数
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

        const eParents = this._eventParents;

        for (let id in eParents) {
            const { target, fn } = eParents[id];
            let args = assign({}, {
                propagatedFrom: ev.target
            }, ev);
            args = fn ? fn.call(this, args) : args;

            target.emit(ev.type, args, true);
        }
    }

    /**
     * 检查事件链及父级事件链上是否有绑定事件
     * @param {string} type
     * @param {boolean=} propagate
     * @returns {boolean}
     * @private
     */
    _listens(type, propagate) {
        const listeners = this.__events__ && this.__events__[type];
        if (listeners && listeners.length) return true;

        if (propagate) {
            // also check parents for listeners if event propagates
            const eParents = this._eventParents;
            for (let id in eParents) {
                if (eParents[id].target._listens(type, propagate)) return true;
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

    get id() {
        return this.__id__;
    }
}
