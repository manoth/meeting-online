'use strict';

import * as express from 'express';
const router = express.Router();
import { Sign } from '../models/sign';
const sign = new Sign();

router.post('/', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const jwt = req.jwt;
        const username = req.body.username;
        const password = req.crypto.md5(req.body.password);
        const row0 = await sign.in(db, username, password, 'N').then();
        const row1 = await sign.in(db, username, password, 'Y').then();
        if (row0.length > 0) {
            res.json({ ok: false, message: 'Username กำลังรอการอนุมัติ กรุณาติดต่อผู้ดูแลระบบของหน่วยบริการ' });
        } else {
            if (row1.length > 0) {
                const accessToken = await jwt.sign(row1[0], '8h');
                res.json({ ok: true, token: accessToken, message: 'ยินดีต้อนรับเข้าสู่ระบบ!' });
            } else {
                res.json({ ok: false, message: 'Username หรือ Password ไม่ถูกต้อง!' });
            }
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;