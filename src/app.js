const { ApolloServer } = require("apollo-server");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");
const Datastore = require("nedb-promises");

const createContext = () => {
  const db = Datastore.create({
    filename: "./db/users.db",
    autoload: true,
  });
  return { db };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let payload;
    let context = createContext();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { ...context, isAuth: false };
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      return { ...context, isAuth: false };
    }
    try {
      payload = jwt.verify(token, "somesupersecretkey");
    } catch (err) {
      return { ...context, isAuth: false };
    }
    return { ...context, isAuth: true, userId: payload.userId };
  },
});

// Launch the server on specific port
server.listen(3030).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
