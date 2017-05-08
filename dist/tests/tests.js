"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const FleebReactor_1 = require("./reactors/FleebReactor");
const PlumbusReactor_1 = require("./reactors/PlumbusReactor");
const decorators_1 = require("../decorators");
const chai_1 = require("chai");
let lastComponentAState = {};
let originalMountOfComponentA = false;
let originalUnmountOfComponentA = false;
let lastComponentBState = {};
let ComponentA = class ComponentA {
    constructor() {
        this.state = {
            defaultState: "default"
        };
    }
    componentWillMount() {
        console.log("Mounting ComponentA");
        originalMountOfComponentA = true;
    }
    componentWillUnmount() {
        originalUnmountOfComponentA = true;
    }
    setState(state) {
        console.log("Stating ComponentA", state);
        lastComponentAState = state;
        this.state = Object.assign({}, this.state, state);
    }
};
ComponentA = __decorate([
    decorators_1.AwareOf(PlumbusReactor_1.default, FleebReactor_1.default, "hizards")
], ComponentA);
const a = new ComponentA();
a.componentWillMount();
let ComponentB = class ComponentB {
    componentWillMount() {
        console.log("Mounting ComponentB");
    }
    setState(state) {
        console.log("Stating ComponentB", state);
        lastComponentBState = state;
    }
};
ComponentB = __decorate([
    decorators_1.AwareOf(FleebReactor_1.default, PlumbusReactor_1.default, "weight")
], ComponentB);
const b = new ComponentB();
b["componentWillMount"]();
describe("Testing reactors work with and without decorators", function () {
    it("old componentWillMount should've been invoked", () => {
        chai_1.assert.isTrue(originalMountOfComponentA);
    });
    it("component should have state applied right after connecting reactor, also defined default state should be there", function () {
        chai_1.assert.isTrue(typeof a.state.defaultState !== "undefined");
        chai_1.assert.isTrue(typeof a.state.price !== "undefined");
        chai_1.assert.isTrue(typeof a.state.weight !== "undefined");
        // Checking if array that was built in constroctor will be inside state of component
        chai_1.assert.lengthOf(a.state.strawberrySniggles, 3);
    });
    it("should successfully notify about all properties when @notify property changed in PlumbusReactor", () => {
        PlumbusReactor_1.default.price = 821;
        chai_1.assert.lengthOf(Object.keys(lastComponentAState), 3);
    });
    it("should have proper set value of property", () => {
        chai_1.assert.equal(lastComponentAState["price"], 821);
    });
    it("notification without this and value should be proper", () => {
        PlumbusReactor_1.default.notifyWeightWithoutThis(333);
        chai_1.assert.lengthOf(Object.keys(lastComponentAState), 3);
        chai_1.assert.equal(lastComponentAState["weight"], 333);
    });
    it("notification with this and value should be proper", () => {
        PlumbusReactor_1.default.notifyWeightWithThis(333);
        chai_1.assert.lengthOf(Object.keys(lastComponentAState), 3);
        chai_1.assert.equal(lastComponentAState["weight"], 333);
    });
    it("should successfully add listener function to StoreLikeReactor and call it on change", () => {
        let calledListener = false;
        FleebReactor_1.default.addChangeListener(function () {
            console.log("Called custom listener");
            calledListener = true;
        });
        FleebReactor_1.default.hizards++;
        chai_1.assert.isTrue(calledListener);
    });
});
// assert.equal(lastComponentAState.price, 301); 
