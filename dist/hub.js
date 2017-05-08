"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("./decorators");
const mitt = require("mitt");
const ErrorStackParser = require("error-stack-parser");
const events_1 = require("events");
const CHANGE_EVENT = "CHANGE_EVENT";
class MittEventEmitter {
    constructor() {
        this.mitt = new mitt();
    }
    addChangeListener(c) {
        this.mitt.on(CHANGE_EVENT, c);
    }
    removeChangeListener(c) {
        this.mitt.off(CHANGE_EVENT, c);
    }
    emitChange() {
        this.mitt.emit(CHANGE_EVENT);
    }
}
class NodeEventEmitter {
    constructor() {
        this.ee = new events_1.EventEmitter();
    }
    addChangeListener(c) {
        this.ee.addListener(CHANGE_EVENT, c);
    }
    removeChangeListener(c) {
        this.ee.removeListener(CHANGE_EVENT, c);
    }
    emitChange() {
        this.ee.emit(CHANGE_EVENT);
    }
}
const reactorCores = new WeakMap();
const reactorNameCores = new Map();
// const reactorNotifiableProperties = new WeakMap
function registerReactorCore(reactor) {
    const core = {
        storeEmitter: new NodeEventEmitter(),
        notifiableProperties: []
    };
    reactorCores.set(reactor.constructor, core);
    reactorNameCores.set(reactor.constructor.name, core);
}
function reactorCoreRegistered(reactor) {
    return reactorCores.has(reactor.constructor);
}
function reactorCoreNameRegistered(name) {
    return reactorNameCores.has(name);
}
function getReactorCore(reactor) {
    return reactorCores.get(reactor.constructor);
}
function getReactorCoreByName(name) {
    return reactorNameCores.get(name);
}
function registerReactorListener(reactor, l) {
    if (!reactorCoreRegistered(reactor)) {
        throw new ReactorIsNotRegistered(`Tried to register listener for reactor object ${JSON.stringify(reactor)} and it was not registered!`);
    }
    getReactorCore(reactor).storeEmitter.addChangeListener(l);
}
exports.registerReactorListener = registerReactorListener;
function unregisterReactorListener(reactor, l) {
    if (!reactorCoreRegistered(reactor)) {
        throw new ReactorIsNotRegistered(`Tried to unregister listener for reactor object ${JSON.stringify(reactor)} and it was not registered!`);
    }
    getReactorCore(reactor).storeEmitter.removeChangeListener(l);
}
exports.unregisterReactorListener = unregisterReactorListener;
function registerNotifiableProperty(reactor, property) {
    if (!reactorCoreRegistered(reactor)) {
        registerReactorCore(reactor);
    }
    const properties = getReactorCore(reactor).notifiableProperties;
    if (!~properties.indexOf(property)) {
        properties.push(property);
    }
}
exports.registerNotifiableProperty = registerNotifiableProperty;
function getAllReactorPropertiesList(reactor) {
    if (!reactorCoreRegistered(reactor)) {
        throw new ReactorIsNotRegistered(`Tried to get reactor with object ${JSON.stringify(reactor)}, it was not registered`);
    }
    const core = getReactorCore(reactor);
    return [...Object.keys(reactor), ...core.notifiableProperties];
}
exports.getAllReactorPropertiesList = getAllReactorPropertiesList;
class ReactorIsNotRegistered extends Error {
}
function notify(...args) {
    if (args.length === 0) {
        notifyReactorChange();
        return;
    }
    if (args.length === 1 && typeof args[0] === "object") {
        notifyReactorChange(args[0]);
        return;
    }
    if ((args.length === 2 || args.length === 3) && typeof args[0] === "object" && typeof args[1] === "string") {
        decorators_1.notifyPropertyDecorator(args[0], args[1]);
        return;
    }
}
exports.notify = notify;
function notifyReactorChange(reactor) {
    if (!reactor) {
        try {
            throw new Error();
        }
        catch (err) {
            const parsed = ErrorStackParser.parse(err);
            // Assuming that second argument does have reactor name
            const reactorCallSignature = parsed[2].functionName;
            let reactorName = reactorCallSignature.split(".")[0];
            // TODO: maybe remove this, because calling notify at the constructor may be
            // not neccesary
            if (~reactorName.indexOf("new")) {
                reactorName = reactorName.split(" ")[1];
            }
            if (!reactorCoreNameRegistered(reactorName)) {
                throw new ReactorIsNotRegistered(`Tried accessing reactor by class name "${reactorName}", but it was not registered in the hub
          Remember, notify() without reactor as argument works only with first level methods
          of reactor instance!`);
            }
            getReactorCoreByName(reactorName).storeEmitter.emitChange();
            return;
        }
    }
    getReactorCore(reactor).storeEmitter.emitChange();
}
function registerReactor(reactor) {
    if (!reactorCoreRegistered(reactor)) {
        registerReactorCore(reactor);
    }
}
exports.registerReactor = registerReactor;
