let { workflows } = require("./serverUtils/workflow-loader");

module.exports = {
  env: {
    workflows,
  },
  ssr: false,
  target: "static",
  head: {
    title: "awsome-doctor",
    meta: [{ charset: "utf-8" }],
  },
  css: ["@/assets/github.css"],
  loading: false,
  plugins: [
    { ssr: true, src: "@/plugins/icons.js" },
    { src: "@/plugins/aws.js" },
    { src: "@/plugins/bus.js" },
    { src: "@/plugins/workflow.js" },
    { src: "@/plugins/ipc.js" },
  ],
  buildModules: [],
  modules: ["@nuxtjs/vuetify"],
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: "#1867c0",
          secondary: "#b0bec5",
          accent: "#8c9eff",
          error: "#b71c1c",
        },
      },
    },
  },
};
