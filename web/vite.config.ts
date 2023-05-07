import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	server: { port: 5070 },
	resolve: { alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }] },
	plugins: [react()]
});
