'use strict';

import * as express from 'express';
const router = express.Router();
import { Meeting } from '../models/meeting';
const meet = new Meeting();

router.get('/room/list', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const row = await meet.getRoom(db).then();
        res.json({ ok: (row.length > 0) ? true : false, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.get('/type/list', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const row = await meet.getType(db).then();
        res.json({ ok: (row.length > 0) ? true : false, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.get('/fullcalendar/:startDate/:endDate', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        const row = await meet.getMeetingFull(db, startDate, endDate).then();
        res.json({ ok: (row.length > 0) ? true : false, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const data = req.body;
        data.cid = req.decoded.cidEnc;
        data.d_update = db.fn.now();
        data.workgroup = req.decoded.workgroup_code;
        data.start_date = `${data.start_date} ${data.start_time}`;
        data.end_date = `${data.end_date} ${data.end_time}`;
        const row1 = await meet.checkMeeting(db, data.start_date, data.end_date, data.room_id).then();
        if (row1.length > 0) {
            res.json({ ok: false, message: 'วันและเวลาดังกล่าวมีผู้จองในระบบแล้ว กรุณาตรวจสอบห้องประชุม และช่วงวัน-เวลา' });
        } else {
            const row = await meet.add(db, data).then();
            res.json({ ok: true, message: 'บันทึกข้อมูลสำเร็จ!' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const row = await meet.getMeeting(db, id).then();
        res.json({ ok: (row.length > 0) ? true : false, data: row });
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const data = req.body;
        data.cid = req.decoded.cidEnc;
        data.workgroup = req.decoded.workgroup_code;
        data.start_date = `${data.start_date} ${data.start_time}`;
        data.end_date = `${data.end_date} ${data.end_time}`;
        data.d_update = db.fn.now();
        delete data.id;
        const row1 = await meet.checkMeeting(db, data.start_date, data.end_date, data.room_id).then();
        if (row1.length > 0) {
            res.json({ ok: false, message: 'วันและเวลาดังกล่าวมีผู้จองในระบบแล้ว กรุณาตรวจสอบห้องประชุม และช่วงวัน-เวลา' });
        } else {
            const row2 = await meet.getMeeting(db, id, data.cid).then();
            if (row2.length > 0) {
                const row = await meet.edit(db, data, id).then();
                res.json({ ok: true, message: 'แก้ไขข้อมูลสำเร็จ!' });
            } else {
                res.json({ ok: true, message: 'คุณไม่มีสิทธิ์แก้ไขการจองประชุมนี้!' });
            }
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const db = req.conn.mysql();
        const id = req.params.id;
        const cidEnc = req.decoded.cidEnc;
        const row1 = await meet.getMeeting(db, id, cidEnc).then();
        if (row1.length > 0) {
            const row = await meet.del(db, id).then();
            res.json({ ok: true, message: 'ลบข้อมูลสำเร็จ!' });
        } else {
            res.json({ ok: true, message: 'คุณไม่มีสิทธิ์ลบการจองประชุมนี้!' });
        }
    } catch (err) {
        res.json({ ok: false, message: err.message });
    }
});

export default router;