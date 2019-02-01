// import EventEmitter from '../src/lib/EventEmitter';

// var ConsoleReporter = jasmineRequire.ConsoleReporter();
// var options = {
//     timer: new jasmine.Timer,
//     print: function () {
//         var args = Array.prototype.slice.call(arguments);
//         args.unshift('[JASMINE]');
//         console.log.apply(console, args);
//     }
// };
//
// var consoleReporter = new ConsoleReporter(options); // initialize ConsoleReporter
// jasmine.getEnv().addReporter(consoleReporter);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('EventEmitter Class test', function () {

    it('on()/off() single event type ...ok', function () {
        var ee = new EventEmitter();
        var eventName_1 = 'name';
        var eventName_2 = 'name_2';

        ee.on(eventName_1, ev => {
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(1);

        }).on(eventName_2, ev => {
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(2);

        });

        ee.emit(eventName_1, {
            args: 1
        }).emit(eventName_2, {
            args: 2
        });

        ee.off(eventName_1)
          .emit(eventName_1, {
              args: 2
          });

        ee.off()
          .emit(eventName_2, {
              args: 1
          });

    });

    it('on()/off() multi events type ...ok', function () {
        var ee = new EventEmitter();
        var eventNames = ' a   b  c  ';

        ee.on(eventNames, ev => {
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(1);
        })
          .emit('a', {
              args: 1
          })
          .emit('b', {
              args: 1
          })
          .emit('c', {
              args: 1
          });

        ee.off('a b')
          .emit('a', {
              args: 2
          })
          .emit('b', {
              args: 2
          })
          .emit('c', {
              args: 1
          });

        ee.off()
          .emit('c', {
              args: 2
          })

    });

    it('once() ...ok', function () {
        var ee = new EventEmitter();
        var eventName = 'name';

        var count = 0;
        ee.once(eventName, ev => {
            count++;
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(1);
            expect(count).toBe(1);
        });

        // emit twice
        ee.emit(eventName, {
            args: 1
        });
        ee.emit(eventName, {
            args: 1
        });
    });

    it('on() bind content ...ok', function () {
        var ee = new EventEmitter();
        ee._sign = 'mask';
        var evName = 'name';

        ee.on(evName, function (ev) {
            expect(this._sign).toBe('mask');
            expect(ev.args).toBe(1);
        });

        ee.emit(evName, {
            args: 1
        });

        var ee1 = new EventEmitter();
        ee1._sign = 'mask';

        ee1.on(evName, function (ev) {
            expect(this._sign).not.toBe('mask');
            expect(this.document).toBe(window.document);
            expect(ev.args).toBe(1);
        }, window);

        ee1.emit(evName, {
            args: 1
        });
    });

    it('addEventParent()/removeEventParent() ...ok', function () {
        var ee = new EventEmitter();
        var parent_1 = new EventEmitter();
        var parent_2 = new EventEmitter();
        var eventName = 'name';

        ee.addEventParent(parent_1)
          .addEventParent(parent_2);

        parent_1.on(eventName, ev => {
            expect(ev.target).toBe(parent_1);
            expect(ev.args).toBe(1);
        });

        var m = 1;
        parent_2.on(eventName, ev => {
            expect(ev.target).toBe(parent_2);
            expect(ev.args).toBe(m++);
        });

        ee.on(eventName, ev => {
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(1);
        });

        ee.emit(eventName, {
            args: 1
        }, true);

        ee.off()
          .on(eventName, ev => {
              expect(ev.target).toBe(ee);
              expect(ev.args).toBe(2);
          })
          .removeEventParent(parent_1)
          .emit(eventName, {
              args: 2
          }, true);

    });

    it('addEventParent() set fn ...ok', function () {
        var ee = new EventEmitter();
        var parent_1 = new EventEmitter();
        var evName = 'name';

        parent_1.on(evName, ev => {
            expect(ev.target).toBe(parent_1);
            expect(ev.args).toBe(1);
            expect(ev._sign).toBe('mask');
        });

        ee.on(evName, ev => {
            expect(ev.args).toBe(1);
        });

        ee.addEventParent(parent_1, ev => {
            ev._sign = 'mask';
            return ev;
        });

        ee.emit(evName, {
            args: 1
        }, true);
    });

    it('addEventParent() link three EE ...ok', function () {
        var son = new EventEmitter();
        var father = new EventEmitter();
        var grandpa = new EventEmitter();

        var evName = 'name';

        son.addEventParent(father);
        father.addEventParent(grandpa);

        grandpa.on(evName, ev => {
            expect(ev.propagatedFrom).toBe(son);
            expect(ev.target).toBe(grandpa);
            expect(ev.args).toBe(1);
        });

        son.emit(evName, {
            args: 1
        }, true);
    });

    it('emit() stop propagation ...ok', function () {
        var ee = new EventEmitter();
        var father = new EventEmitter();

        var evName = 'name';
        var evName2 = 'notPropagate';

        ee.addEventParent(father);
        father.on(evName, ev => {
            expect(ev.args).toBe(1);
        });

        father.on(evName2, ev => {
            expect(ev.args).toBe(2);
        });

        ee.emit(evName, {
            args: 1
        }, true);

        ee.emit(evName2, {
            args: 1
        });

    })
});
