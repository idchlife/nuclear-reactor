# Nuclear Reactor

[![Build Status](https://travis-ci.org/idchlife/nuclear-reactor.svg?branch=master)](https://travis-ci.org/idchlife/nuclear-reactor)

Deal breaker for React/Preact state management. If you heard about Flux - nuclear-reactor is like next form of it.
Simple, yet powerful.

## Installation

```bash
  npm i nuclear-reactor --save
```

## Examples

Examples of usage you can find in this repository
https://github.com/idchlife/nuclear-reactor-examples

## Usage

You will have reactors - basically singletons of classes. Like stores in flux (in terms of exporting default instance of class). And components. Which will listen to reactors or reactors properties.

### Reactor

- Instance of class.
- Reactor = **store + actions**. At the same time it's just an object! You're not registering it anywhere, you just export instance of it and choose when to notify components that something has changed.
- It can be charged with some handy decorators (or functions, for our friends without decorators)

Reactor has state in it. State lives in it's properties.
It also has actions in it. Any method of reactor can be action. Public ones. Well, in typescript or flow public ones.

Here is code, so you can see simplicity for yourself.
Also I will cover most of the functionality in comments

### Code with comments

```typescript
// Your reactors/CounterReactor.ts
import { notify } from "nuclear-reactor";

class CounterReactor {
  // this little guy here basically says: any component aware of this
  // reactor or it's properties will be notified after this property will be changed
  @notify
  count: number = 0;
}

export default new CounterReactor();
```

```typescript
// Your components/Counter.tsx
import { Component, h } from "preact";
import { AwareOf } from "nuclear-reactor";
import CounterReactor from "../reactors/CounterReactor";
// or react equivalent

interface State {
  count: number;
}

@AwareOf(
  CounterReactor, // before passing properties you should tell, which
  // reactor has these properties
  "count" // Means that this component's state will be populated with
  // count property of the reactor and nothing more
)
export default class Counter extends Component<any, State> {
  render(props, state: State) {
    return (
      <div>
        <div>{state.count}</div>
        <div><button onClick={() => CounterReactor.count++}>Increment</button></div>
        <div><button onClick={() => CounterReactor.count--}>Decrement</button></div>
      </div>
    )
  }
}
```

The thing is. Every time property .count of the CounterReactor will be set - reactor
will notify all it's listeners about changes. Like store in flux, if you know what I am talking about - it will "emitChange" (not exactly reactor, but hub inside this library will notify about this reactor changes, but for simplicity of understanding we pretend that "reactor notifies listeners")


### @notify decorator/function

 (or function if you will be using without decorators)

notify can be used as @notify for properties of your reactor. Like in code above - it will detect that value of this property was set and notify reactor listeners.

Also notify can be used as function in methods, like this:

```typescript
import { notify } from "nuclear-reactor";

class DateReactor {
  stringDate: string;

  refreshDate() {
    this.stringDate = "some-new-date";

    notify(this);
  }
}
```

Also, notify function can be used even without argument!
One condition, though: it should be called exactly inside reactor method. Not in some function outside, not in promise callback.
And if you follow will this condition - it will do it's job. It will know where it was called and notify listeners
of only reactor where it was used. Like this:

```typescript
import { notify } from "nuclear-reactor";

class DateReactor {
  stringDate: string;

  refreshDate() {
    this.stringDate = "some-new-date";

    notify();
  }
}
```

Neat, don't you think?

### AwareOf decorator

AwareOf used for what it was called. Component's state will be aware of reactor properties.

Used like this:

```typescript
  import { AwareOf } from "nuclear-reactor";
  import AuthReactor from "../reactors/AuthReactor";
  import ProfileReactor from "../reactors/ProfileReactor";

  interface State {
    profile: any
  }

  @AwareOf(
     AuthReactor,
     ProfileReactor,
     "profile"
   )
export default class Page extends Component<any, typeof AuthReactor & State> {
// omitting, because you for sure know how to write components
```

As you can see, we can pass reactor without properties. It means that component's state will be populated with **all** of reactor's properties. Sometimes it's handy.
Basically arguments for @AwareOf look like this: @AwareOf(...args: Array<Reactor | string>)
First you specify Reactor, and then you specify or not it's properties. Multiple reactors and multiple properties can be passed. Your component can listen to numerous reactors and their properties! And all of them will populate components state.


## Contributing

1. Fork it ( https://github.com/idchlife/nuclear-reactor/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [idchlife](https://github.com/idchlife) idchlife - creator, maintainer

# LICENSE

MIT



Here is a nice picture of Cherenkov radiation:
![image](https://cloud.githubusercontent.com/assets/4563032/25785540/1b9ff1be-338c-11e7-9f60-87a764fdf7a1.png)