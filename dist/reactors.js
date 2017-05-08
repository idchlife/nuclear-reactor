"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mitt = require("mitt");
const CHANGE_EVENT = "CHANGE_EVENT";
function notify(reactor, property) {
    Object.defineProperty(reactor, property, {
        set: function (val) {
            this.__core.notifiableProperties[property] = val;
            this.notify();
        },
        get: function () {
            return this.__core.notifiableProperties[property];
        }
    });
}
exports.notify = notify;
class Reactor {
    constructor() {
        this.__core = {
            mitt: new mitt(),
            emitChange() {
                this.mitt.emit(CHANGE_EVENT);
            },
            notifiableProperties: {},
            hiddenProperties: ["__core"]
        };
    }
    // constructor() {
    //   this.__core = {
    //     mitt: new mitt(),
    //     emitChange() {
    //       this.mitt.emit(CHANGE_EVENT);
    //     }
    //   }
    //   // return new Proxy(this, {
    //   //   get(target, name, receiver) {
    //   //     registerReactorCall(receiver, name.toString());
    //   //     console.log("Getting property " + name.toString());
    //   //     return target[name];
    //   //   }
    //   // });
    // }
    __protectedAddChangeListener(c) {
        console.log("Adding change listener");
        this.__core.mitt.on(CHANGE_EVENT, c);
    }
    __protectedRemoveChangeListener(c) {
        this.__core.mitt.off(CHANGE_EVENT, c);
    }
    /**
     * @protected
     */
    notify() {
        this.__core.emitChange();
    }
}
exports.Reactor = Reactor;
