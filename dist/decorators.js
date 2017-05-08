"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hub_1 = require("./hub");
class ReactorAttachingDecoratorError extends Error {
}
function AwareOf(...args) {
    return function (componentClass) {
        const reactorsAndProperties = [];
        let lastReactorAndProperties;
        const listeners = [];
        args.forEach((a, i) => {
            if (typeof a === "object") {
                // First we register reactor
                hub_1.registerReactor(a);
                let reactorAndProperties;
                if (!(reactorAndProperties = reactorsAndProperties.find(r => r.reactor === a))) {
                    const length = reactorsAndProperties.push({
                        reactor: a,
                        properties: []
                    });
                    listeners.push({
                        reactor: a
                    });
                    // Getting quickly last element, because last element is our new reactorAndProperties
                    reactorAndProperties = reactorsAndProperties[length - 1];
                }
                lastReactorAndProperties = reactorAndProperties;
                return;
            }
            if (!lastReactorAndProperties.properties[a]) {
                lastReactorAndProperties.properties.push(a);
            }
        });
        const mount = componentClass.prototype.componentWillMount;
        const unmount = componentClass.prototype.componentWillUnmount;
        componentClass.prototype.componentWillMount = function taburetWillMount(...args) {
            reactorsAndProperties.forEach(function (rap) {
                const reactor = rap.reactor;
                let properties = rap.properties;
                const listener = (mergeDefaultState = false) => {
                    if (!properties.length) {
                        // Filtering properties. They cannot be functions and also
                        // they cannot be those properties that are hidden
                        properties = hub_1.getAllReactorPropertiesList(reactor);
                    }
                    const state = {};
                    properties.forEach(p => {
                        state[p] = reactor[p];
                    });
                    mergeDefaultState ? this.state = Object.assign({}, this.state, state) : this.setState(state);
                };
                listener.call(this, true);
                hub_1.registerReactorListener(reactor, listener);
                listeners.find(l => l.reactor === rap.reactor).listener = listener;
            }, this);
            mount && mount.call(this, ...args);
        };
        componentClass.prototype.componentWillUnmount = function taburetWillUnmount(...args) {
            listeners.forEach(rl => hub_1.unregisterReactorListener(rl.reactor, rl.listener));
            unmount && unmount.call(this, ...args);
        };
    };
}
exports.AwareOf = AwareOf;
function notifyPropertyDecorator(reactor, property) {
    hub_1.registerNotifiableProperty(reactor, property);
    const debugPropertyName = property;
    let propertyValue = reactor[property];
    let initialized = false;
    Object.defineProperty(reactor, property, {
        set: function (val) {
            propertyValue = val;
            if (!initialized) {
                initialized = true;
                return;
            }
            hub_1.notify(reactor);
        },
        get: function () {
            return propertyValue;
        }
    });
}
exports.notifyPropertyDecorator = notifyPropertyDecorator;
function notifyClassDecorator() {
}
exports.notifyClassDecorator = notifyClassDecorator;
