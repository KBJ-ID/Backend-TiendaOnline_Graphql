import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS } from '../../config/constants';
import bcrypt from 'bcrypt';
import { asignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }) {
            // Comprobar que el usuario no existe
            const userCheck = await findOneElement(db, COLLECTIONS.USERS, {email: user.email});
            if(userCheck !== null){
                return {
                    status: false,
                    message: `El email ${user.email} está registrado y no puedes registrarte con este email`,
                    user: null
                };
            }

            
            // Comprobar el ultimo usuario registrado para asignar el ID
            user.id = await asignDocumentId(db, COLLECTIONS.USERS, {registerDate: -1});
            // Asignar la fecha en formato ISO en la propiedad registerDate
            user.registerDate = new Date().toISOString();

            // Encriptar password
            user.password = bcrypt.hashSync(user.password, 10);
            
            // Guardar el documento (registro) en la colección
            return await insertOneElement(db, COLLECTIONS.USERS, user).then(
                                async() => {
                                    return {
                                        status: true,
                                        message: `El usuario con el email ${user.email} está registrado correctamente`,
                                        user
                                    };
                                }
                            ).catch((err: Error) =>{
                                console.log(err.message);
                                return {
                                    status: false,
                                    message: `Error inesperado, intentalo de nuevo más tarde`,
                                    user: null
                                };
                            });
        }   
    }
};

export default resolversUserMutation;