'use strict';

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as ejs from 'ejs';
import * as cors from 'cors';

import index from './routes/index';

import { Connection } from './configs/connection';
import { Jsonwebtoken } from './configs/jsonwebtoken';
import { Crypto } from './configs/crypto';

dotenv.config();
const app: express.Express = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
    req.conn = new Connection();
    req.jwt = new Jsonwebtoken();
    req.crypto = new Crypto();
    next();
});
app.use('/', index);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

app.use((err: Error, req, res, next) => {
    res.status(err['status'] || 500);
    res.json({
        status: err['status'],
        title: 'error',
        message: err.message,
        error: {}
    });
});

export default app;
