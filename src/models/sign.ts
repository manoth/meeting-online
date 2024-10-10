import { Knex } from 'knex';

export class Sign {

    in(db: Knex, username: string, password: string, active: 'Y' | 'N') {
        return db('member as m').innerJoin('member_workgroup as g', 'g.workgroup_code', 'm.workgroup_code')
            .where('m.username', username).andWhere('m.password', password).andWhere('m.active', active)
            .select(db.raw('MD5(m.cid) as cidEnc'))
            .select('m.username', 'm.pname', 'm.fname', 'm.lname', 'm.user_level', 'm.workgroup_code', 'g.workgroup_name');
    }

    up(db: Knex, data: any) {
        return db('member').insert(data);
    }

    getWorkgroup(db: Knex) {
        return db('member_workgroup').where('active', 'Y');
    }

    validThaiIDCard(id: string) {
        if (!/^\d{13}$/.test(id)) return false;
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(id.charAt(i)) * (13 - i);
        }
        let checkDigit = (11 - (sum % 11)) % 10;
        return checkDigit === parseInt(id.charAt(12));
    }

    checkDuplicateIDCard(db: Knex, id: string) {
        return db('member').select('cid').where('cid', id);
    }

    validEmail(email: string) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    checkDuplicateEmail(db: Knex, email: string) {
        return db('member').select('username').where('username', email);
    }

}