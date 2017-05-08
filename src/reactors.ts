import { registerReactorCall } from './calling-helpers';
import * as mitt from 'mitt';

const CHANGE_EVENT = "CHANGE_EVENT";

export interface ReactorCore {
  [name: string]: any;
  // Properties for set of Object.defineProperty so we don't
  // end up with infinite recursion.
  notifiableProperties: { [name: string]: any }
  // Properties that cannot be attached and won't be updated in state
  hiddenProperties: string[];
  emitChange();
}


export interface ReactorClass<R extends Reactor> {
  new(...args: any[]): R;
}

export function notify<R extends Reactor>(reactor: R, property: string) {
  Object.defineProperty(reactor, property, {
    set: function(val: any) {
      this.__core.notifiableProperties[property] = val;

      this.notify();
    },
    get: function() {
      return this.__core.notifiableProperties[property]
    }
  });
}

export abstract class Reactor {
  public __core: ReactorCore = {
    mitt: new mitt(),
    emitChange() {
      this.mitt.emit(CHANGE_EVENT);
    },
    notifiableProperties: {},
    hiddenProperties: ["__core"]
  };

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

  public __protectedAddChangeListener(c: Function) {
    console.log("Adding change listener");
    this.__core.mitt.on(CHANGE_EVENT, c as mitt.Handler);
  }

  public __protectedRemoveChangeListener(c: Function) {
    this.__core.mitt.off(CHANGE_EVENT, c as mitt.Handler);
  }

  /**
   * @protected
   */
  protected notify() {
    this.__core.emitChange();
  }
}