'use strict';

import * as express from 'express';
const router = express.Router();
import { Sign } from '../models/sign';
const sign = new Sign();

router.post('/', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const data = req.body;
        data.sex = (data.pname == 'นาย') ? 'ชาย' : 'หญิง';
        data.active = 'N', data.user_level = '1';
        data.d_register = data.d_update = db.fn.now();
        data.password = req.crypto.md5(data.password);
        data.user_level = '1';
        const row = await sign.up(db, data).then();
        res.json({ ok: true, message: 'กรุณาติดต่อผู้ดูแลระบบให้ยืนยันบัญชีที่ลงทะเบียน เพื่อที่จะให้ใช้งานระบบได้.' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.get('/check/IDCard/:cid', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const cid = req.params.cid;
        const row = await sign.checkDuplicateIDCard(db, cid).then();
        if (!sign.validThaiIDCard(cid) || row.length > 0) {
            res.json({ ok: false, message: row.length > 0 ? 'เลขบัตรประชาชนนี้เคยใช้ลงทะเบียนแล้ว' : 'เลขบัตรประชาชนไม่ถูกต้อง' });
        } else {
            res.json({ ok: true, message: 'เลขบัตรประชาชนถูกต้อง' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.get('/check/Email/:email', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const email = req.params.email;
        const row = await sign.checkDuplicateEmail(db, email).then();
        if (!sign.validEmail(email) || row.length > 0) {
            res.json({ ok: false, message: row.length > 0 ? 'อีเมลนี้เคยใช้ลงทะเบียนแล้ว' : 'กรุณากรอกอีเมลที่ถูกต้อง' });
        } else {
            res.json({ ok: true, message: 'อีเมลที่ถูกต้อง' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.get('/list/workgroup', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const row = await sign.getWorkgroup(db).then();
        res.json({ ok: true, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;