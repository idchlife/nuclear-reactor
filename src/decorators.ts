import { Reactor } from './reactors';
import { clearReactorCalls, getReactorCalls } from './calling-helpers';
import {
  getAllReactorPropertiesList,
  notify,
  ReactyComponentClass,
  registerNotifiableProperty,
  registerReactor,
  registerReactorListener,
  unregisterReactorListener
} from './hub';

class ReactorAttachingDecoratorError extends Error {}

interface ReactorAndProperties {
  reactor: Object;
  properties: string[];
}

interface ReactorAndListener {
  reactor: Object;
  listener?: Function;
}

export function AwareOf(...args: Array<Object | string>): any {
  return function<T extends ReactyComponentClass>(componentClass: T) {
    const reactorsAndProperties: ReactorAndProperties[] = []

    let lastReactorAndProperties: ReactorAndProperties;

    const listeners: ReactorAndListener[] = [];

    args.forEach((a, i) => {
      if (typeof a === "object") {
        // First we register reactor
        registerReactor(a);

        let reactorAndProperties: ReactorAndProperties;

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
    })

    const mount = componentClass.prototype.componentWillMount;
    const unmount = componentClass.prototype.componentWillUnmount;

    componentClass.prototype.componentWillMount = function taburetWillMount(...args) {
      reactorsAndProperties.forEach(function (rap) {
        const reactor = rap.reactor;
        let properties = rap.properties;

        const listener = (mergeDefaultState: boolean = false) => {
          if (!properties.length) {
            // Filtering properties. They cannot be functions and also
            // they cannot be those properties that are hidden
            properties = getAllReactorPropertiesList(reactor);
          }

          const state = {};

          properties.forEach(p => {
            state[p] = reactor[p];
          });

          mergeDefaultState ? this.state = Object.assign({}, this.state, state) : this.setState(state);
        }

        listener.call(this, true);

        registerReactorListener(reactor, listener)

        listeners.find(l => l.reactor === rap.reactor).listener = listener;
      }, this);

      mount && mount.call(this, ...args);
    }

    componentClass.prototype.componentWillUnmount = function taburetWillUnmount(...args) {
      listeners.forEach(rl => unregisterReactorListener(rl.reactor, rl.listener));

      unmount && unmount.call(this, ...args);
    }
  }
}

export function notifyPropertyDecorator(reactor: Object, property: string) {
  registerNotifiableProperty(reactor, property);

  const debugPropertyName = property;
  let propertyValue = reactor[property];
  let initialized = false;

  Object.defineProperty(reactor, property, {
    set: function(val: any) {
      propertyValue = val;

      if (!initialized) {
        initialized = true;

        return;
      }

      notify(reactor);
    },
    get: function() {
      return propertyValue;
    }
  });
}

export function notifyClassDecorator() {

}