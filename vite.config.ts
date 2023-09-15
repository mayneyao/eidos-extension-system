import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Eidos Extension System",
        short_name: "EES",
        description: "eidos extension system implementation",
        theme_color: "#ffffff",
        icons: [
          {
            src: "desktop/Square150x150Logo.scale-100.png",
            sizes: "150x150",
          },
          {
            src: "desktop/Square150x150Logo.scale-125.png",
            sizes: "188x188",
          },
          {
            src: "desktop/Square150x150Logo.scale-150.png",
            sizes: "225x225",
          },
          {
            src: "desktop/Square150x150Logo.scale-200.png",
            sizes: "300x300",
          },
          {
            src: "desktop/Square150x150Logo.scale-400.png",
            sizes: "600x600",
          },
        ],
      },
    }),
  ],
});
