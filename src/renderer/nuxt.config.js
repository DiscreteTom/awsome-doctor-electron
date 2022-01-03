let { workflows } = require("./serverUtils/workflow-loader");
let { workflowUtilsText } = require("./serverUtils/workflow-utils-loader");

module.exports = {
  env: {
    workflows,
    workflowUtilsText,
  },
  ssr: false,
  target: "static",
  head: {
    title: "Awsome Doctor",
    meta: [{ charset: "utf-8" }],
  },
  css: ["@/assets/github.css", "@/assets/prism.css"],
  loading: false,
  plugins: [
    { ssr: true, src: "@/plugins/icons.js" },
    { src: "@/plugins/aws.js" },
    { src: "@/plugins/bus.js" },
    { src: "@/plugins/workflow.js" },
    { src: "@/plugins/workflow-utils.js" },
    { src: "@/plugins/ipc.js" },
    { src: "@/plugins/md.js" },
  ],
  buildModules: [],
  modules: ["@nuxtjs/vuetify", "@nuxtjs/axios"],
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
