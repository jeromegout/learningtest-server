const authResolvers = require("./resolvers/auth");

const resolvers = {
  Query: { ...authResolvers.Query },

  Mutation: { ...authResolvers.Mutation },
};

module.exports = resolvers;
