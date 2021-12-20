import { ipcMain } from "electron";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import fs from "fs";

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
