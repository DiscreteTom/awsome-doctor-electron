import { ipcRenderer } from "electron";

function persistConfig(state) {
  let { tempAk, tempSk, useProfile, ...rest } = state;
  ipcRenderer.send("update-config", rest);
}

const defaultConfig = {
  region: "us-east-1",
  profile: "default",
  useProfile: true,
  tempAk: "",
  tempSk: "",
  editorFontSize: 10,
  editorDarkMode: true,
  editorShowInvisibles: true,
  editorAutoFormat: true,
};

export default {
  state() {
    return JSON.parse(JSON.stringify(defaultConfig)); // copy
  },
  mutations: {
    /**
     * load config from file
     */
    loadConfig(state, config) {
      // load config
      for (let key in state) {
        if (config[key] !== null && config[key] !== undefined) {
          state[key] = config[key];
        }
      }
    },
    /**
     * update config & persist config to file
     */
    updateConfig(state, config) {
      for (let key in state) {
        if (config[key] !== null && config[key] !== undefined) {
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
