import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import netlifyPlugin from "@netlify/vite-plugin-react-router";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), !process.env.VITEST && reactRouter(), tsconfigPaths(), netlifyPlugin(), process.env.VITEST && react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./app/__tests__/setup.js",
  },
});
