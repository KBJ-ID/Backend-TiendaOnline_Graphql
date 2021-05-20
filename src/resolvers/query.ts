import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';

const resolversQuery: IResolvers = {
    Query: {
        async users(_, __, {db}) {
            try {
                return {
                    status: true,
                    message: 'Lista de usuarios cargada correctamente',
                    users: await db.collection(COLLECTIONS.USERS).find().toArray()
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'Error al cargar usuarios. Comprueba que tienes todo correctamente añadido',
                    users: []
                };
            }
        },
        async login(_, {email, password}, {db}) {
            try {
                const user = await db.collection(COLLECTIONS.USERS).findOne({email});

                if(user === null){
                    return {
                        status: false,
                        message: 'Usuario no existe',
                        token: null
                    };
                }

                const passwordCheck = bcrypt.compareSync(password, user.password);

                if(passwordCheck !== null){
                    delete user.password;
                    delete user.birthday;
                    delete user.registerDate;
                }
                return {
                    status: true,
                    message: !passwordCheck ? 'Password y usuario incorrectos, sesion no iniciada' : 'Sesion iniciada',
                    token: !passwordCheck ? null :  new JWT().sign({ user }, EXPIRETIME.H24),
                };
            } catch (error) {
                console.log(error);
                return {
                    status: false,
                    message: 'Error al cargar el usuario. Comprueba que tienes todo correctamente añadido',
                    token: null,
                };
            }
        },
        me(_, __, {token}) {
            let info = new JWT().verify(token);
            if(info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
                return {
                    status: false,
                    message: info,
                    user: null
                };
            }
            return {
                status: true,
                message: 'Usuario autenticado correctamente mediante el token',
                user: Object.values(info)[0]
            };
        }
    },
};

export default resolversQuery;