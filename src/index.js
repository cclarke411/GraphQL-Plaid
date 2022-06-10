const { ApolloServer } = require("apollo-server");
const { resolvers } = require("./resolvers.js");
const { typeDefs, html } = require("./helpers.js");

// ApolloServer Constructor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "n/a";

    if (!req.headers["apollographql-client-name"])
      throw new Error("all requests must be from an identified client");

    return { token };
  },
  plugins: [
    {
      async serverWillStart() {
        return {
          async renderLandingPage() {
            return { html };
          }
        };
      }
    },
    {
      async requestDidStart() {
        return {
          async didResolveOperation(context) {
            if (!context.operationName)
              throw new Error("all operations must be named");

            return { html };
          }
        };
      }
    }
  ]
});

// The `listen` method launches a web server.
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  Server is running at ${url}`);
});
