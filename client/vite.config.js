import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.svg"],
    build: {
        assetsDir: "assets",
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name].[ext]",
            },
        },
    },
    server: {
        port: 5173,
        open: true,
    },
});
