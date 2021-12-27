import { ipcMain, dialog, Notification } from "electron";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import fs from "fs";
import mainWindow from "./mainWindow";
import path from "path";

const CONFIG_FILE = "config.json";
let aws = {};

ipcMain.on("get-aws-credentials", (event, arg) => {
  defaultProvider({ profile: arg.profile || "default" })().then((res) => {
    // aws["s3"] = new S3Client({
    //   credentials: res,
    //   region: arg.region,
    // });
    event.reply("get-aws-credentials", res);
  });
});

ipcMain.on("load-config", (event, arg) => {
  fs.readFile(CONFIG_FILE, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      // if no config file
      let defaultConfig = arg;
      // generate default config file
      fs.writeFile(
        CONFIG_FILE,
        JSON.stringify(defaultConfig),
        "utf-8",
        () => {}
      );
      // reply default value
      event.reply("load-config", defaultConfig);
    } else {
      event.reply("load-config", JSON.parse(data));
    }
  });
});

ipcMain.on("update-config", (event, arg) => {
  fs.writeFile(CONFIG_FILE, JSON.stringify(arg), "utf-8", () => {});
});

ipcMain.on("open-workflow-yaml", (event, arg) => {
  fs.readFile(arg.filePath, (err, data) => {
    event.reply("open-workflow-yaml", {
      ...arg,
      content: data.toString("utf-8"),
    });
  });
});

ipcMain.on("choose-file", async (event, arg) => {
  const result = await dialog.showSaveDialog(mainWindow.browserWindow, arg);

  if (!result.canceled) {
    let filePath = result.filePath;
    if (!filePath.endsWith(".yml") && !filePath.endsWith(".yaml"))
      filePath += ".yml";
    event.reply("choose-file", {
      filePath,
      fileName: path.basename(filePath),
    });
  }
});

ipcMain.on("save-file", (event, arg) => {
  fs.writeFile(arg.filePath, arg.data, "utf-8", (err) => {
    if (err) console.log(err);
    else {
      new Notification({
        title: "Saved",
        body: `Location: ${arg.filePath}`,
      }).show();
    }
  });
});
