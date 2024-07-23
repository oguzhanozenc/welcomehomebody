import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BasketProvider } from "./components/BasketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BasketProvider>
      <App />
    </BasketProvider>
  </React.StrictMode>
);
