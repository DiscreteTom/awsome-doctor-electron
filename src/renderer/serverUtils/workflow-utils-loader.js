const fs = require("fs");

const WORKFLOW_UTILS_DIR = "src/workflow-utils";

let workflowUtilsText = {};

fs.readdirSync(WORKFLOW_UTILS_DIR, { withFileTypes: true }).map((dirent) => {
  workflowUtilsText[
    dirent.name.replace(/\.[^/.]+$/, "")
    // remove ext
  ] = fs.readFileSync(`${WORKFLOW_UTILS_DIR}/${dirent.name}`, "utf8"); // read js content
});

module.exports = {
  workflowUtilsText,
};
