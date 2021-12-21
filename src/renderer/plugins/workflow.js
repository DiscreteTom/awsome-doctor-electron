export default (context, inject) => {
  inject("workflow", process.env.workflows);
};
