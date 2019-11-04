const Datastore = require("nedb-promises");
let db = Datastore.create({
  filename: "./db/users.db",
  autoload: true
});

const resolvers = {
  Query: {
    users: async () => {
      const users = await db.find({}).catch(reason => {
      console.log(users);
      })
    }
  },

  Mutation: {
    signIn: async (parent, arg) => {
      const user = {
        name: arg.userInput.name,
        email: arg.userInput.email,
        password: arg.userInput.password
      }
      console.log(user)
      return await db.insert(user);
    }
  }
};

module.exports = resolvers;
