"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var defautDataBaseUri = 'mongodb://root:root@127.0.0.1:27017/delivery';
var connectMongoDb = function () {
    var _a;
    mongoose_1.default.connect("".concat(((_a = process.env) === null || _a === void 0 ? void 0 : _a['mongoDbUri']) || defautDataBaseUri));
};
exports.default = connectMongoDb;
