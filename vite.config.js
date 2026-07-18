import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/verifikasi-ijazah-v2/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        dashboard: resolve(__dirname, "dashboard.html"),
        verifikasi: resolve(__dirname, "verifikasi.html"),
      },
    },
  },
});