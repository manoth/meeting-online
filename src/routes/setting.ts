'use strict';

import * as express from 'express';
const router = express.Router();
import { Setting } from '../models/setting';
const setting = new Setting();

router.post('/room', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const data = req.body;
        const row = await setting.addRoom(db, data).then();
        res.json({ ok: true, message: 'บันทึกข้อมูลสำเร็จ!' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.put('/room/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const data = req.body;
        delete data.id;
        const row = await setting.editRoom(db, data, id).then();
        res.json({ ok: true, message: 'แก้ไขข้อมูลสำเร็จ' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.delete('/room/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const row = await setting.delRoom(db, id).then();
        res.json({ ok: true, message: 'ลบข้อมูลสำเร็จ' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.post('/type', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const data = req.body;
        const row = await setting.addType(db, data).then();
        res.json({ ok: true, message: 'บันทึกข้อมูลสำเร็จ!' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.put('/type/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const data = req.body;
        delete data.id;
        const row = await setting.editType(db, data, id).then();
        res.json({ ok: true, message: 'แก้ไขข้อมูลสำเร็จ' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.delete('/type/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const row = await setting.delType(db, id).then();
        res.json({ ok: true, message: 'ลบข้อมูลสำเร็จ' });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;