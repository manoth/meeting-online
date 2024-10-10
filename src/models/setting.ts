import { Knex } from 'knex';

export class Setting {

    addRoom(db: Knex, data: any) {
        return db('meeting_room').insert(data);
    }

    editRoom(db: Knex, data: any, id: string) {
        return db('meeting_room').update(data).where('id', id);
    }

    delRoom(db: Knex, id: string) {
        return db('meeting_room').where('id', id).del();
    }

    addType(db: Knex, data: any) {
        return db('meeting_type').insert(data);
    }

    editType(db: Knex, data: any, id: string) {
        return db('meeting_type').update(data).where('id', id);
    }

    delType(db: Knex, id: string) {
        return db('meeting_type').where('id', id).del();
    }

}