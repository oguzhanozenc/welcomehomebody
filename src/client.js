import { GraphQLClient } from "graphql-request";

const endpoint = `https://${
  import.meta.env.VITE_SHOPIFY_DOMAIN
}/api/2023-01/graphql.json`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": import.meta.env
      .VITE_SHOPIFY_ACCESS_TOKEN,
  },
});

export default client;
