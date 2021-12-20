import { ipcRenderer } from "electron";

function persistConfig(state) {
  ipcRenderer.send("update-config", state);
}

const defaultConfig = {
  region: "us-east-1",
  profile: "default",
};

export default {
  state() {
    return { ...defaultConfig };
  },
  mutations: {
    /**
     * load config from file
     */
    loadConfig(state, config) {
      // load config
      for (let key in state) {
        if (config[key]) {
          state[key] = config[key];
        }
      }
    },
    /**
     * update config & persist config to file
     */
    updateConfig(state, config) {
      for (let key in state) {
        if (config[key]) {
          state[key] = config[key];
        }
      }
      persistConfig(state);
    },
  },
  getters: {
    defaultState() {
      return defaultConfig;
    },
  },
};
