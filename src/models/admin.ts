import { Knex } from 'knex';

export class Admin {

    getMember(db: Knex, userLevel: string) {
        return db('member as m').innerJoin('member_workgroup as g', 'g.workgroup_code', 'm.workgroup_code')
            .where('m.user_level', '<=', userLevel)
            .select(db.raw('MD5(m.cid) as cidEnc'))
            .select('m.username', 'm.pname', 'm.fname', 'm.lname', 'm.user_level')
            .select('m.workgroup_code', 'g.workgroup_name', 'm.sex', 'm.active');
    }

    updateMember(db: Knex, data: any, cid: string) {
        data.d_update = db.fn.now();
        return db('member').update(data).where(db.raw('MD5(cid)=?', [cid]));
    }

    deleteMember(db: Knex, cid: string) {
        return db('member').where(db.raw('MD5(cid)=?', [cid])).del();
    }

}