"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.set('port', 3000);
app.get('/', (req, res) => {
    const message = 'Hello World@';
    res.send(message);
});
exports.default = app;
//# sourceMappingURL=app.js.map