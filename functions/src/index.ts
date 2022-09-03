
import { Request, Response } from 'express'
//import * as db from '../../script'
const functions = require('firebase-functions');
const express = require('express');
const app = express();

app.get('/*', (req: Request, res: Response) => {
   res.send("Hello")
})

exports.app = functions.https.onRequest(app);
