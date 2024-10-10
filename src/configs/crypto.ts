import * as CryptoJs from 'crypto-js';

export class Crypto {
    // AES Encrypt
    aes_encrypt(data: string, secret?: string) {
        const hashSha512 = CryptoJs.SHA512(secret || process.env.SECRET_KEY).toString(CryptoJs.enc.Hex);
        const secretKey = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Hex.parse(hashSha512)).substring(0, 32);
        const ciphertext = CryptoJs.AES.encrypt(data, secretKey, {
            iv: secretKey,
            mode: CryptoJs.mode.CBC,
            padding: CryptoJs.pad.Pkcs7
        });
        return this.base64_encode(ciphertext.toString());
    }
    // AES Decrypt
    aes_decrypt(enc: string, secret?: string) {
        const hashSha512 = CryptoJs.SHA512(secret || process.env.SECRET_KEY).toString(CryptoJs.enc.Hex);
        const secretKey = CryptoJs.enc.Base64.stringify(CryptoJs.enc.Hex.parse(hashSha512)).substring(0, 32);
        const bytes = CryptoJs.AES.decrypt(this.base64_decode(enc), secretKey, {
            iv: secretKey,
            mode: CryptoJs.mode.CBC,
            padding: CryptoJs.pad.Pkcs7
        });
        return bytes.toString(CryptoJs.enc.Utf8);
    }
    // base64 encoded --utoa
    base64_encode(str: string) {
        const encryptedWord = CryptoJs.enc.Utf8.parse(str);
        return CryptoJs.enc.Base64.stringify(encryptedWord);
    }
    // base64 decoded --atou
    base64_decode(enc: string) {
        const encryptedWord = CryptoJs.enc.Base64.parse(enc);
        return CryptoJs.enc.Utf8.stringify(encryptedWord);
    }
    // md5
    md5(str: any) {
        return CryptoJs.MD5(str).toString();
    }
    // random
    random(length: number, char?: string) {
        const characters = char || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let result = '';
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    // hmacSHA256
    hmacSHA256(password: string) {
        const secretKey = process.env.MOPH_SECRET_KEY;
        return CryptoJs.HmacSHA256(password, secretKey).toString(CryptoJs.enc.Hex);
    }
}