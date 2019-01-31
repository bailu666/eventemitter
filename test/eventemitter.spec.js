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
        let ee = new EventEmitter();
        let eventName_1 = 'name';
        let eventName_2 = 'name_2';

        ee.on(eventName_1, (ev) => {
            expect(ev.target).toBe(ee);
            expect(ev.args).toBe(1);

        }).on(eventName_2, (ev) => {
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
        let ee = new EventEmitter();
        let eventNames = ' a   b  c  ';

        ee.on(eventNames, (ev) => {
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

    it('addEventParent()/removeEventParent() ...ok', function () {
        let ee = new EventEmitter();
        let parent_1 = new EventEmitter();
        let parent_2 = new EventEmitter();
        let eventName = 'name';

        ee.addEventParent(parent_1)
          .addEventParent(parent_2);

        parent_1.on(eventName, ev => {
            expect(ev.target).toBe(parent_1);
            expect(ev.args).toBe(1);
        });

        let m = 1;
        parent_2.on(eventName, ev => {
            expect(ev.target).toBe(parent_2);
            expect(ev.args).toBe(m++);
        });

        ee.on(eventName, (ev) => {
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

});
