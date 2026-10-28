import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/players": {
        target: "https://api.steampowered.com",
        changeOrigin: true,
        rewrite: () => "/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730",
        secure: true
      }
    }
  }
});
