import { ReactyComponent } from '../hub';
import FleebReactor from './reactors/FleebReactor';
import PlumbusReactor from './reactors/PlumbusReactor';
import { AwareOf } from '../decorators';
import { assert } from "chai";
import * as mocha from "mocha";

let lastComponentAState: any = {};
let originalMountOfComponentA = false;
let originalUnmountOfComponentA = false;

let lastComponentBState: any = {};

@AwareOf(
  PlumbusReactor,
  FleebReactor,
  "hizards"
)
class ComponentA implements ReactyComponent {
  state: any = {
    defaultState: "default"
  }

  componentWillMount() {
    console.log("Mounting ComponentA");
    originalMountOfComponentA = true;
  }

  componentWillUnmount() {
    originalUnmountOfComponentA = true;
  }

  setState(state: any) {
    console.log("Stating ComponentA", state);
    lastComponentAState = state;

    this.state = Object.assign({}, this.state, state);
  }
}

const a = new ComponentA();

a.componentWillMount();

@AwareOf(
  FleebReactor,
  PlumbusReactor,
  "weight"
)
class ComponentB implements ReactyComponent {
  componentWillMount() {
    console.log("Mounting ComponentB");
  }
  setState(state: any) {
    console.log("Stating ComponentB", state);
    lastComponentBState = state;
  }
}

const b = new ComponentB();

b["componentWillMount"]();

describe("Testing reactors work with and without decorators", function() {
  it("old componentWillMount should've been invoked", () => {
    assert.isTrue(originalMountOfComponentA);
  });

  it("component should have state applied right after connecting reactor, also defined default state should be there", function() {
    assert.isTrue(typeof a.state.defaultState !== "undefined");
    assert.isTrue(typeof a.state.price !== "undefined");
    assert.isTrue(typeof a.state.weight !== "undefined");

    // Checking if array that was built in constroctor will be inside state of component
    assert.lengthOf(a.state.strawberrySniggles, 3);
  });

  it("should successfully notify about all properties when @notify property changed in PlumbusReactor", () => {
    PlumbusReactor.price = 821;

    assert.lengthOf(Object.keys(lastComponentAState), 3);
  });

  it("should have proper set value of property", () => {
    assert.equal(lastComponentAState["price"], 821);
  });

  it("notification without this and value should be proper", () => {
    PlumbusReactor.notifyWeightWithoutThis(333);

    assert.lengthOf(Object.keys(lastComponentAState), 3);
    assert.equal(lastComponentAState["weight"], 333);
  });

  it("notification with this and value should be proper", () => {
    PlumbusReactor.notifyWeightWithThis(333);

    assert.lengthOf(Object.keys(lastComponentAState), 3);
    assert.equal(lastComponentAState["weight"], 333);
  });

  it("should successfully add listener function to StoreLikeReactor and call it on change", () => {
    let calledListener = false;

    FleebReactor.addChangeListener(function() {
      console.log("Called custom listener");

      calledListener = true;
    });

    FleebReactor.hizards++;

    assert.isTrue(calledListener);
  })
});

// assert.equal(lastComponentAState.price, 301);