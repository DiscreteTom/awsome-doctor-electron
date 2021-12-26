import { ipcRenderer } from "electron";

let channelSet = new Set();

let ipc = {
  /**
   * every channel can only be registered once
   */
  one(channel, f) {
    if (!channelSet.has(channel)) {
      channelSet.add(channel);
      ipcRenderer.on(channel, f);
    }
  },
  send(channel, ...arg) {
    ipcRenderer.send(channel, ...arg);
  },
};

export default (context, inject) => {
  inject("ipc", ipc);
};
