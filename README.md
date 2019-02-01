## EventEmitter

### 释疑：为何造轮子？

乍一看，这和其他的 EventEmitter 的功能没什么两样，同样支持 on / once / off / emit 此类方法。那为什么还要造轮子？

先把原因概括下，下面会详细说明：这个 EE 增加了添加父级事件的方法，即支持多层事件传递。

接下来详细说明多层事件传递是什么？先举个发动机 engine 和 汽车 car 的栗子说明：

> 我们用 EE 创建了一个 engine 对象，engine 的某个行为会触发了一个启动事件 'start'。接着我们又用 EE 创建一个 car 对象，我希望 engine 在触发 'start' 事件时，car 也触发这个启动 'start' 事件。（很好理解发动机启动了，汽车也就启动了。）

通常 EE 的实现：

```js
const engine = new EventEmitter();
const car = new EventEmitter();
// 监听 engine 的 start 事件 
engine.on('start', () => {
    // 你 start，我也 start
    car.emit('start', {});
});

engine.emit('start', {});
```

接着我们思考下面两个问题：

1.  如果 engine 还会触发 stop / break / error 等事件，car 也希望通通拥有。
2.  如果我们在 car 上再增加一个里程表 odometer，当 car 启动以后，odometer 也跟随启动。

这两个问题如果继续使用上面的方式实现，代码就掉入了类似 callback hell 的深渊。

于是我们想到了一个打破深渊的办法 —— 增加一个 `addEventParent` 方法来实现 **多层事件传递**，即通过添加一个父级对象，将当前对象的事件冒泡到他的父级上。   
我们来看下它的用法：

```js
const engine = new EventEmitter();
const car = new EventEmitter();
// 通过 addEventParent 为 engine 添加一个父级事件节点 car，当 engine 派发一个事件时，可以将事件冒泡至他的父级 car 上。
engine.addEventParent(car);
// 为了使事件可以冒泡至父级，调用 emit 时，通过第三个参数控制事件的冒泡。
// 发动机启动会传递至车辆上
engine.emit('start', {}, true);

// 如果希望里程表 odometer 也获得 start 事件，为 car 添加父级事件节点 odometer 即可
const odometer = new EventEmitter();
car.addEventParent(odometer);
```
好了，至此对于造轮子的原因解释完毕。如果你的实践中有这种多层事件传递的场景，可以考虑使用这个 EE。

*最后要感谢 leaflet.js，这种多层事件传递实际是参考了 leaflet 中的实现。并不是我的原创。*


### API 文档

#### 1. 创建 EE

```js
const ee = new EventEmitter()
```

#### 2. 继承 EE

如果您使用了 ES6 的 Class 特性，可以考虑将 EE 作为父类继承，这样可以使得您的类型拥有 EE 的所有特性。

```js
import { EventEmitter } from 'EventEmitter'

class Car extends EventEmitter {
    constructor() { }
    
    doSome() {
        this.emit('some')
    }
}
```

#### 3. 事件绑定 on(type, fn, content?) / once(type, fn, content?)

参数：

+ type {string} 事件名称，多个事件名可用空格分开
+ fn {Function} 回调函数
+ content {*=} fn 回调上下文

其中 fn 回调参数 `Event` 结构为：  

+ event.type {string} 事件名
+ event.target {EventEmitter} 触发事件的对象

返回：

+ EventEmitter

```js
const ee = new EventEmitter();
// 支持空格分割多个事件
ee.on('load start stop', ev => { })

// 用后即焚
ee.once('load', ev => { })
```

#### 4. 事件解绑 off(type?, fn?, content?)

参数：

+ type {string=} 事件名称 不设置清除全部事件
+ fn {Function=} 回调函数 不设置清除所有 type 上的 fn
+ content {*=} fn 回调上下文

返回：

+ EventEmitter


#### 5. 触发事件 emit(type, obj?, propagate?) 

参数：

+ type {string} 事件名
+ obj {object=} 参数，会被 merge 到 event 中。注意 object 中不要使用 `type`和 `target` 关键词，否则会覆盖原始参数。
+ propagate {boolean=} 当前事件是否冒泡至父级事件节点。默认不冒泡。 

返回：

+ EventEmitter

#### 6. 添加父级事件节点 addEventParent(ee, fn?)

参数：

+ ee {EventEmitter} 为当前对象添加父级节点，当前对象事件触发后，可以冒泡至父级节点
+ fn {Function=} 触发父级节点时，可通过该回调函数修改原有回调参数。需要将修改后的参数返回。

返回：

+ EventEmitter

依旧用发动机 engine 和汽车 car 这个场景说明：  

> ##### 1. engine start 后，car 也跟着 start。并且获取了 engine 派发的信息。

```js
const engine = new EventEmitter();
const car = new EventEmitter();
car.on('start', ev => {
    console.log('car: ', ev.msg);
});
engine.addEventParent(car);

engine.emit('start', {
    msg: '我发动了!'
}, true);

// log: "car: 我发动了!"
```

> ##### 2. engine start 后，car 也跟着 start，并且添加了 car 自己特有的的信息。

```js
// 创建同上
car.on('start', ev => {
    console.log('car: ', ev.msg);
    console.log('car name: ', ev.name);
});
engine.addEventParent(car, ev => {
    ev.name = 'Benz';
    return ev;
});

engine.emit('start', {
    msg: '我发动了!'
}, true);

// log: "car: 我发动了!"
// log: "car name: Benz";
```

至此关于 EE 的全部就介绍完了，希望如果这个 EE 对你有帮助，欢迎使用。:D

