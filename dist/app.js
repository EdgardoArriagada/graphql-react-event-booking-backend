"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.set("port", 3000);
app.get('/', (req, res) => {
    res.send("Hello World@");
});
exports.default = app;
//# sourceMappingURL=app.js.map