import { createClient } from "graphql-ws";

const subscriptionClient = createClient({
  url: "wss://localhost:7277/graphql", // Ensure you use the correct WebSocket endpoint
  connectionParams: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default subscriptionClient;
