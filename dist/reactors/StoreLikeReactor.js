"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hub_1 = require("../hub");
class StoreLikeReactor {
    constructor() {
        hub_1.registerReactor(this);
    }
    addChangeListener(c) {
        hub_1.registerReactorListener(this, c);
    }
    removeChangeListener(c) {
        hub_1.unregisterReactorListener(this, c);
    }
}
exports.default = StoreLikeReactor;
