import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "MUST AI",
  version: "0.1.0",

  description:
    "An AI-powered assistant for navigating and interacting with university websites.",

  permissions: [
    "activeTab",
    "storage",
    "scripting",
  ],

  host_permissions: [
    "<all_urls>",
  ],

  action: {
    default_title: "MUST AI",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/main.tsx"],
    },
  ],
});