import { ApolloClient, from, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession, useSession } from "next-auth/react";
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  // uri: "http://localhost:4000/graphql",
  uri: "https://chatservice-2u9j.onrender.com/graphql",
  // uri: "https://chatservice-production.up.railway.app/graphql",
  credentials: "include",
});

const wsLink =
  typeof window != "undefined"
    ? new GraphQLWsLink(
        createClient({
          // url: "wss://chatservice-production.up.railway.app/graphql/subscriptions",
          url: "wss://chatservice-2u9j.onrender.com/graphql/subscriptions",
          // url: "ws://localhost:4000/graphql/subscriptions",
          connectionParams: async () => ({
            session: await getSession(),
          }),
        })
      )
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

    // const {data: session} = useSession();
   const sessionMiddleWare = setContext(async (_,{ headers }) => ({
    headers: {
      ...headers,
      "session": JSON.stringify(await getSession()),
    }
   })) 
export const client = new ApolloClient({
  link: from([sessionMiddleWare,link]),
  cache: new InMemoryCache(),
});
