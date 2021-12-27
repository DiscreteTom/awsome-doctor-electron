import BrowserWinHandler from "./BrowserWinHandler";
import { shell } from "electron";

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 1000,
});

winHandler.onCreated((_browserWindow) => {
  winHandler.loadPage("/");

  // open system browser when an external link is clicked
  _browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
});

export default winHandler;
