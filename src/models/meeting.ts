import { Knex } from 'knex';

export class Meeting {

    getRoom(db: Knex) {
        return db('meeting_room').where('active', 'Y');
    }

    getType(db: Knex) {
        return db('meeting_type');
    }

    getMeeting(db: Knex, id: string, cidEnc?: string) {
        const query = db('meeting as m').where('m.id', id)
            .innerJoin('meeting_type as t', 't.id', 'm.type_id')
            .innerJoin('member_workgroup as w', 'w.workgroup_code', 'm.workgroup')
            .select(
                'm.*',
                'w.workgroup_name',
                't.type_name',
                db('member as a').select('a.pname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('pname'),
                db('member as a').select('a.fname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('fname'),
                db('member as a').select('a.lname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('lname')
            );
        return (cidEnc) ? query.andWhere('cid', cidEnc) : query;
    }

    getMeetingFull(db: Knex, startDate: string, endDate: string) {
        return db('meeting as m').innerJoin('meeting_room as r', 'r.id', 'm.room_id')
            .innerJoin('meeting_type as t', 't.id', 'm.type_id')
            .innerJoin('member_workgroup as w', 'w.workgroup_code', 'm.workgroup')
            .whereBetween('m.start_date', [startDate, endDate])
            .orWhereBetween('m.end_date', [startDate, endDate]).select(
                'm.id',
                'm.topic as title',
                'r.room',
                'm.topic as description',
                't.type_name',
                'm.start_date as start',
                'm.end_date as end',
                'r.color',
                'w.workgroup_code',
                'w.workgroup_name',
                db.raw(`false as allDay`),
                db('member as a').select('a.pname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('pname'),
                db('member as a').select('a.fname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('fname'),
                db('member as a').select('a.lname').where(db.raw('MD5(a.cid)'), '=', db.ref('m.cid')).as('lname')
            );
    }

    checkMeeting(db: Knex, startDate: string, endDate: string, rootId: string) {
        return db('meeting').orWhere(function () {
            this.where('room_id', rootId).andWhere('start_date', '<=', startDate).andWhere('end_date', '>=', startDate)
        }).orWhere(function () {
            this.where('room_id', rootId).andWhere('start_date', '<=', endDate).andWhere('end_date', '>=', endDate)
        }).orWhere(function () {
            this.where('room_id', rootId).andWhere('start_date', '>=', startDate).andWhere('end_date', '<=', endDate)
        });
    }

    add(db: Knex, data: any) {
        return db('meeting').insert(data);
    }

    edit(db: Knex, data: any, id: string) {
        return db('meeting').update(data).where('id', id);
    }

    del(db: Knex, id: string) {
        return db('meeting').where('id', id).del();
    }

}