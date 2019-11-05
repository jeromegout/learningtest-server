const Datastore = require("nedb-promises")
const bcrypt = require('bcrypt')

let db = Datastore.create({
  filename: "./db/users.db",
  autoload: true
});

const resolvers = {
  Query: {
    users: async () => {
      return (await db.find({}).catch(reason => {throw Error(reason)})) || []
    },
    login: async (_, {nameOrEmail, password}) => {
      let user
      if(nameOrEmail.indexOf("@") > 0) {
        user  = await db.findOne({email:nameOrEmail})
      } else {
        user = await db.findOne({name: nameOrEmail})
      }
      if(!user) {
        throw Error('Invalid name or passord, please retry.')
      }
      
      const ok = await bcrypt.compare(password, user.password)
      if(!ok) {
        throw Error('Invalid name or passord, please retry.')
      }

      return user
    },
  },

  Mutation: {
    register: async (parent, arg) => {
      const password = await bcrypt.hash(arg.input.password, 12)
      const user = {
        name: arg.input.name,
        email: arg.input.email,
        password
      }
      return db.insert(user).catch(reason => {throw Error(reason)});
    }
  }
};

module.exports = resolvers;
