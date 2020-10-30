const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');

const resolvers = require('./resolvers');

const { findOrCreateUser } = require('./controllers/userController');

const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => console.log('connected to MongoDB', process.env.MONGO_URI))
  .catch(() =>
    console.log('failed to connect to MongoDB', process.env.MONGO_URI)
  );

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    try {
      authToken = req.headers.authorization;

      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (error) {
      console.log(error);
      console.error(`Unable to authenticate user with token ${authToken}`);
    }
    return { currentUser };
  },
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
