const { ApolloServer } = require("apollo-server");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let payload;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { isAuth: false };
    }
    const token = authHeader.split(" ")[1];
    if (!token || token === "") {
      return { isAuth: false };
    }
    try {
      payload = jwt.verify(token, "somesupersecretkey");
    } catch (err) {
      return { isAuth: false };
    }
    return { isAuth: true, userId: payload.userId, email: payload.email };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
