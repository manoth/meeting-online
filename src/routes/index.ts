'use strict';

import * as express from 'express';
const router = express.Router();

const jwtVerify = (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            req.token = req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            req.token = req.query.token;
        } else {
            req.token = req.body.token;
        }
        req.decoded = req.jwt.verify(req.token);
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: 'Token not validated.' });
    }
}

const adminLevel = (req, res, next) => {
    if (req.decoded.user_level > 1) {
        next();
    } else {
        return res.status(401).json({ ok: false, message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }
}

import signIn from './signin';
import signUp from './signup';
import admin from './admin';
import meeting from './meeting';
import setting from './setting';
router.use('/signIn', signIn);
router.use('/signUp', signUp);
router.use('/admin', jwtVerify, adminLevel, admin);
router.use('/meeting', jwtVerify, meeting);
router.use('/open/meeting', meeting);
router.use('/setting', jwtVerify, adminLevel, setting);

router.get('/', (req, res, next) => {
    res.json({ message: 'Welcome to My API' });
});

export default router;