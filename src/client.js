import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "cc0986-23.myshopify.com",
  storefrontAccessToken: "6705ab9698d1069f9c71f9575e27183d",
});

export default client;
