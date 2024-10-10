import * as jwt from 'jsonwebtoken';

export class Jsonwebtoken {

    private secretKey = process.env.SECRET_KEY;

    sign(payload: any, expiresIn: string) {
        const obj = JSON.parse(JSON.stringify(payload));
        return jwt.sign(obj, this.secretKey, { expiresIn: expiresIn });
    }

    verify(token: string) {
        return jwt.verify(token, this.secretKey);
    }

}