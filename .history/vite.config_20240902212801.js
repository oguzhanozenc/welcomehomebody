import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/cart": {
        target: "https://715ee7-e2.myshopify.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cart/, "/cart"),
      },
    },
  },
});
