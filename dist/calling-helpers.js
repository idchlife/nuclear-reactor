"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let initializationComplete = false;
let reactorCalls = [];
function registerReactorCall(reactor, property) {
    console.log("Adding call for", reactor.constructor.name, property);
    const calls = reactorCalls.find(c => c.reactor === reactor);
    if (!calls) {
        reactorCalls.push({
            reactor,
            properties: [property]
        });
    }
    else {
        calls.properties.push(property);
    }
}
exports.registerReactorCall = registerReactorCall;
function getReactorCalls() {
    return reactorCalls;
}
exports.getReactorCalls = getReactorCalls;
function clearReactorCalls() {
    reactorCalls = [];
}
exports.clearReactorCalls = clearReactorCalls;
function areAllComponentsProcessed() {
    return initializationComplete;
}
exports.areAllComponentsProcessed = areAllComponentsProcessed;
