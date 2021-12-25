<template>
  <div>
    <workflow-executor :workflow="workflow" />
  </div>
</template>

<script>
import WorkflowExecutor from "../../components/WorkflowExecutor.vue";

export default {
  components: { WorkflowExecutor },
  async asyncData({ params }) {
    const category = params.category;
    const workflowName = params.workflow;
    return { category, workflowName };
  },
  data() {
    return {
      workflow: {},
    };
  },
  mounted() {
    this.workflow = this.$workflow[this.category][this.workflowName];
  },
};
</script>
