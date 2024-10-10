import { knex } from 'knex';

export class Connection {
    mysql() {
        return knex({
            client: process.env.MYSQL_TYPE || 'mysql',
            connection: {
                host: process.env.MYSQL_HOST || 'localhost',
                port: +process.env.MYSQL_PORT || 3306,
                user: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASSWORD || 'password',
                database: process.env.MYSQL_DATABASE || 'dbname',
                charset: process.env.MYSQL_CHARSET || 'utf8',
                timezone: process.env.MYSQL_TIMEZONE || 'UTC'
            },
            pool: {
                min: 0,
                max: 7,
                afterCreate: (conn, done) => {
                    conn.query('SET NAMES utf8', (err) => {
                        done(err, conn);
                    });
                }
            },
            debug: false,
            acquireConnectionTimeout: 10000
        });
    }
}