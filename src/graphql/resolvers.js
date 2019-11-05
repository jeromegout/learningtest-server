const Datastore = require("nedb-promises")
const bcrypt = require('bcrypt')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

let db = Datastore.create({
  filename: "./db/users.db",
  autoload: true
});

const resolvers = {
  Query: {
    users: async () => {
      return (await db.find({}).catch(reason => {throw Error(reason)})) || []
    },
    login: async (_, {input}) => {
      const user  = await db.findOne({email:input.email})
      if(!user) {
        throw Error('Invalid name or passord, please retry.')
      }

      const ok = await bcrypt.compare(input.password, user.password)
      if(!ok) {
        throw Error('Invalid name or passord, please retry.')
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        '$2b$09$wrGgSVpAbKANR7m6c8OeDqjx5ghozVDpoC8MsKevvgcZg5Fg5',
        { expiresIn: '1h' }
      );

      return {
        userName: user.name,
        token
      }
    },
  },

  Mutation: {
    registerUser: async (parent, {input}) => {
      const existing  = await db.findOne({email: input.email})
      if(existing) {
        throw Error('Account with same email address already exists')
      }
      const password = await bcrypt.hash(input.password, 12)
      const user = User.createUser(input.email, password)
      return db.insert(user).catch(reason => {throw Error(reason)});
    },
    updateUser: async (_, {userId, input}) => {
      const existing  = await db.findOne({_id: userId})
      if(!existing) {
        throw Error('No such user exist in database')
      }
      const user = {
        ...existing,
        name: input.name ? input.name : existing.name,
        email: input.email ? input.email : existing.email,
        avatar:input.avatar ? input.avatar : existing.avatar
      }
      return await db.update({_id: userId}, user, {
        returnUpdatedDocs: true
      })
    }
  }
};

module.exports = resolvers;
