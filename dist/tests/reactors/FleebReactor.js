"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StoreLikeReactor_1 = require("../../reactors/StoreLikeReactor");
const __1 = require("../..");
class FleebReactor extends StoreLikeReactor_1.default {
    constructor() {
        super(...arguments);
        this.hizards = 12345;
        this.strings = [];
    }
}
__decorate([
    __1.notify
], FleebReactor.prototype, "hizards", void 0);
__decorate([
    __1.notify
], FleebReactor.prototype, "strings", void 0);
exports.FleebReactor = FleebReactor;
;
exports.default = new FleebReactor();
