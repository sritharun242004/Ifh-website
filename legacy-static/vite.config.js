import { defineConfig } from "vite";
import { resolve } from "node:path";

// Clean URLs: /why-ifh -> why-ifh.html (works in dev and preview).
const cleanUrls = {
  name: "clean-urls",
  configureServer(server) { server.middlewares.use(rewrite); },
  configurePreviewServer(server) { server.middlewares.use(rewrite); },
};
function rewrite(req, _res, next) {
  const [path, query = ""] = req.url.split("?");
  if (/^\/(why-ifh|tenant|property-owner)\/?$/.test(path)) {
    req.url = path.replace(/\/$/, "") + ".html" + (query ? "?" + query : "");
  } else if (/\.html$/.test(path) === false && path === "/index") {
    req.url = "/index.html";
  }
  next();
}

// Multi-page site: every HTML page is its own build entry.
export default defineConfig({
  plugins: [cleanUrls],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        whyIfh: resolve(import.meta.dirname, "why-ifh.html"),
        tenant: resolve(import.meta.dirname, "tenant.html"),
        propertyOwner: resolve(import.meta.dirname, "property-owner.html"),
      },
    },
  },
});
