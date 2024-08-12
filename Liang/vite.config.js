import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        product: "homepage.html",
      },
    },
    outDir: "build", // 指定構建輸出目錄
  },
});
