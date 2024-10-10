'use strict';

import * as express from 'express';
const router = express.Router();
import { Admin } from '../models/admin';
const admin = new Admin();

router.get('/member/list', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const userLevel = req.decoded.user_level;
        const row = await admin.getMember(db, userLevel).then();
        res.json({ ok: (row.length > 0) ? true : false, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.put('/member/:cidEnc', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const userLevel = req.decoded.user_level;
        const cidEnc = req.params.cidEnc;
        const data = req.body;
        (data.password) ? data.password = req.crypto.md5(data.password) : null;
        (data.user_level && data.user_level > userLevel) ? data.user_level = userLevel : null;
        const row = await admin.getMember(db, userLevel).then();
        if (row.some(item => item.cidEnc === cidEnc)) {
            await admin.updateMember(db, data, cidEnc).then();
            res.json({ ok: true, message: 'แก้ไขข้อมูลสำเร็จ' });
        } else {
            res.json({ ok: false, message: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.delete('/member/:cidEnc', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const userLevel = req.decoded.user_level;
        const cidEnc = req.params.cidEnc;
        const row = await admin.getMember(db, userLevel).then();
        if (row.some(item => item.cidEnc === cidEnc)) {
            await admin.deleteMember(db, cidEnc).then();
            res.json({ ok: true, message: 'ลบข้อมูลสำเร็จ' });
        } else {
            res.json({ ok: false, message: 'คุณไม่มีสิทธิ์ลบข้อมูลนี้' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;