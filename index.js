const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");
const EtherDataSource = require("./datasource/ethDatasource");
const typeDefs = importSchema("./schema.graphql");

require("dotenv").config();

const resolvers = {
  Query: {
    getEthByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),
    getTotalSupplyEth: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),
    //Code for New Resolver Functions
    async getLatestEthereumPrice() {
      return this.get(
        `?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API}`
      );
    },

    async getBlockConfirmationTime() {
      return this.get(
        `?module=gastracker&action=gasestimate&gasprice=2000000000&apikey=${process.env.ETHERSCAN_API}`
      );
    },

    getEthPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),
    getEstimationTimePerTransaction: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
