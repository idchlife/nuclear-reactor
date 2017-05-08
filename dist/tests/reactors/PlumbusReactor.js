"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
class PlumbusReactor {
    constructor() {
        this.price = 300;
        this.weight = 10;
        this.strawberrySniggles = [];
        this.strawberrySniggles.push("one");
        this.strawberrySniggles.push("two");
        this.strawberrySniggles.push("three");
    }
    notifyWeightWithThis(weight) {
        this.weight = weight;
        index_1.notify(this);
    }
    notifyWeightWithoutThis(weight) {
        this.weight = weight;
        index_1.notify();
    }
}
__decorate([
    index_1.notify
], PlumbusReactor.prototype, "price", void 0);
exports.PlumbusReactor = PlumbusReactor;
;
exports.default = new PlumbusReactor();
