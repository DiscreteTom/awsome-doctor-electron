const yaml = require("js-yaml");
const fs = require("fs");

const WORKFLOW_DIR = "src/workflow";

/**
 * ```
 * {
 *   'EC2': {
 *     'ping': {
 *       ..yaml file content
 *     }
 *   }
 * }
 * ```
 */
let workflows = {};

fs.readdirSync(WORKFLOW_DIR, { withFileTypes: true }).map((dirent) => {
  if (dirent.isDirectory()) {
    let result = {};
    fs.readdirSync(`${WORKFLOW_DIR}/${dirent.name}`, {
      withFileTypes: true,
    }).map((file) => {
      if (
        file.isFile() &&
        (file.name.endsWith(".yml") || file.name.endsWith(".yaml"))
      ) {
        let ymlContent;
        try {
          ymlContent = fs.readFileSync(
            `${WORKFLOW_DIR}/${dirent.name}/${file.name}`,
            "utf8"
          );
        } catch (err) {
          // print error, skip this file
          console.log(err);
          return;
        }
        result[file.name] = yaml.load(ymlContent);
      }
    });
    workflows[dirent.name] = result;
  }
});

module.exports = {
  workflows,
};
