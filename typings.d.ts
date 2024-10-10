import { Connection } from './src/configs/connection';
import { Crypto } from './src/configs/crypto';
import { Jsonwebtoken } from './src/configs/jsonwebtoken';

declare global {
    namespace Express {
        export interface Request {
            conn: Connection;
            jwt: Jsonwebtoken;
            crypto: Crypto;
            decoded: any;
        }
    }
}