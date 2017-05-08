import { notifyPropertyDecorator } from './decorators';
import { Reactor } from './reactors';
import * as mitt from "mitt";
import * as ErrorStackParser from "error-stack-parser";
import { EventEmitter } from "events";

export interface ReactyComponent {
  componentWillMount?(): void;
  componentWillUnmount?(): void;
  setState(state: any);
}

export interface ReactyComponentClass {
  new(...args: any[]): ReactyComponent;
}

interface StoreLikeInterface {
  addChangeListener(c: Function);

  removeChangeListener(c: Function);

  emitChange();
}

const CHANGE_EVENT = "CHANGE_EVENT";

class MittEventEmitter implements StoreLikeInterface {
  mitt: mitt.Emitter = new mitt();

  addChangeListener(c: Function) {
    this.mitt.on(CHANGE_EVENT, c as mitt.Handler);
  }

  removeChangeListener(c: Function) {
    this.mitt.off(CHANGE_EVENT, c as mitt.Handler);
  }

  emitChange() {
    this.mitt.emit(CHANGE_EVENT);
  }
}

class NodeEventEmitter implements StoreLikeInterface {
  ee: EventEmitter = new EventEmitter();

  addChangeListener(c: Function) {
    this.ee.addListener(CHANGE_EVENT, c as mitt.Handler);
  }

  removeChangeListener(c: Function) {
    this.ee.removeListener(CHANGE_EVENT, c as mitt.Handler);
  }

  emitChange() {
    this.ee.emit(CHANGE_EVENT);
  }
}

interface ReactorCore {
  storeEmitter: StoreLikeInterface;

  notifiableProperties: string[];
}

const reactorCores = new WeakMap<Object, ReactorCore>();
const reactorNameCores = new Map<string, ReactorCore>();
// const reactorNotifiableProperties = new WeakMap

function registerReactorCore(reactor: Object) {
  const core = {
    storeEmitter: new NodeEventEmitter(),
    notifiableProperties: []
  };

  reactorCores.set(reactor.constructor, core);
  reactorNameCores.set(reactor.constructor.name, core);
}

function reactorCoreRegistered(reactor: Object): boolean {
  return reactorCores.has(reactor.constructor);
}

function reactorCoreNameRegistered(name: string): boolean {
  return reactorNameCores.has(name);
}

function getReactorCore(reactor: Object): ReactorCore {
  return reactorCores.get(reactor.constructor);
}

function getReactorCoreByName(name: string): ReactorCore {
  return reactorNameCores.get(name);
}

export function registerReactorListener(reactor: Object, l: Function) {
  if (!reactorCoreRegistered(reactor)) {
    throw new ReactorIsNotRegistered(
      `Tried to register listener for reactor object ${JSON.stringify(reactor)} and it was not registered!`
    );
  }

  getReactorCore(reactor).storeEmitter.addChangeListener(l);
}

export function unregisterReactorListener(reactor: Object, l: Function) {
  if (!reactorCoreRegistered(reactor)) {
    throw new ReactorIsNotRegistered(
      `Tried to unregister listener for reactor object ${JSON.stringify(reactor)} and it was not registered!`
    );
  }

  getReactorCore(reactor).storeEmitter.removeChangeListener(l);
}

export function registerNotifiableProperty(reactor: Object, property: string) {
  if (!reactorCoreRegistered(reactor)) {
    registerReactorCore(reactor);
  }

  const properties = getReactorCore(reactor).notifiableProperties;

  if (!~properties.indexOf(property)) {
    properties.push(property);
  }
}

export function getAllReactorPropertiesList(reactor: Object): string[] {
  if (!reactorCoreRegistered(reactor)) {
    throw new ReactorIsNotRegistered(
      `Tried to get reactor with object ${JSON.stringify(reactor)}, it was not registered`
    );
  }

  const core = getReactorCore(reactor);

  return [...Object.keys(reactor), ...core.notifiableProperties];
}

class ReactorIsNotRegistered extends Error {}

/**
 * Property decorated with @notify
 * will trigger all listeners for this reactor after it has been changed.
 */
export function notify(reactor: Object, property: string)
/**
 * Notifying that passed as argument reactor has changes.
 */
export function notify(reactor: Object)
/**
 * Notifying that reactor has changes.
 * Should be called inside reactors method.
 * Hub via error stack would be able to get reactor and notify
 * all listeners.
 */
export function notify()
export function notify(...args: any[]) {
  if (args.length === 0) { notifyReactorChange(); return; }
  if (args.length === 1 && typeof args[0] === "object") { notifyReactorChange(args[0]); return; }
  if ((args.length === 2 || args.length === 3) && typeof args[0] === "object" && typeof args[1] === "string") { notifyPropertyDecorator(args[0], args[1]); return; }
}

function notifyReactorChange(reactor?: Object) {
  if (!reactor) {
    try {
      throw new Error();
    } catch (err) {
      const parsed = ErrorStackParser.parse(err);

      // Assuming that second argument does have reactor name
      const reactorCallSignature: string = parsed[2].functionName;
      let reactorName = reactorCallSignature.split(".")[0];

      // TODO: maybe remove this, because calling notify at the constructor may be
      // not neccesary
      if (~reactorName.indexOf("new")) {
        reactorName = reactorName.split(" ")[1];
      }

      if (!reactorCoreNameRegistered(reactorName)) {
        throw new ReactorIsNotRegistered(
          `Tried accessing reactor by class name "${reactorName}", but it was not registered in the hub
          Remember, notify() without reactor as argument works only with first level methods
          of reactor instance!`
        );
      }

      getReactorCoreByName(reactorName).storeEmitter.emitChange();

      return;
    }
  }

  getReactorCore(reactor).storeEmitter.emitChange();
}


export function registerReactor(reactor: Object) {
  if (!reactorCoreRegistered(reactor)) {
    registerReactorCore(reactor);
  }
}