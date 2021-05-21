import { IResolvers } from '@graphql-tools/utils';

const resolversProductsQuery: IResolvers = {
    Query: {
        products() {
            return true;
        }
    },
};

export default resolversProductsQuery;