const { AuthenticationError } = require('apollo-server');

const user = {
  _id: '1',
  name: 'Randel',
  email: 'randelramirez1@gmail.com',
  picture:
    'https://avatars1.githubusercontent.com/u/422173?s=460&u=38f6d79f30e5acce34e63b01609e92cfe4fcb93f&v=4',
};

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
};
