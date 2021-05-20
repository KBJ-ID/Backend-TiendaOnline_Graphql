import { EXPIRETIME, MESSAGES, SECRET_KEY } from '../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

class JWT {
    private secretKey = SECRET_KEY as string;

    // Informacion del payload en el jwt tiempo de expiración 24 horas
    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24){
        return jwt.sign(
            { user: data.user },
            this.secretKey,
            { expiresIn }
        );
    }

    verify(token: string){
        try {
            return jwt.verify(token, this.secretKey);
        } catch (e) {
            return MESSAGES.TOKEN_VERIFICATION_FAILED;
        }
    }
}

export default JWT;