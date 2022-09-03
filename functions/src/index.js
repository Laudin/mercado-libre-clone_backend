"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as db from '../../script'
const functions = require('firebase-functions');
const express = require('express');
const app = express();
app.get('/*', (req, res) => {
    res.send("Hello");
});
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map