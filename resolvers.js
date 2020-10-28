const { AuthenticationError } = require('apollo-server');
const Pin = require('./models/Pin');

// const user = {
//   _id: '1',
//   name: 'Randel',
//   email: 'randelramirez1@gmail.com',
//   picture:
//     'https://avatars1.githubusercontent.com/u/422173?s=460&u=38f6d79f30e5acce34e63b01609e92cfe4fcb93f&v=4',
// };

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(root, args, ctx, info);
};

/* 
  authenticated is like a middleware we created to wrap the request and add checking for user authentication 
*/
module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      return pinAdded;
    }),
  },
};
