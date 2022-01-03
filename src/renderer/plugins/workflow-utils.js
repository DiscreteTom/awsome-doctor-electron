function evalUtils() {
  let result = {};
  for (let moduleName in process.env.workflowUtilsText) {
    let module = {};
    eval(process.env.workflowUtilsText[moduleName]);
    result[moduleName] = module.exports;
  }
  return result;
}

export default (context, inject) => {
  inject("workflowUtils", evalUtils());
};
