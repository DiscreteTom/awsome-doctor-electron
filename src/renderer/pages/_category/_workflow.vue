<template>
  <div>
    <h2>Diagnosing: {{ workflow.title }}</h2>
    <v-text-field
      v-for="input in workflow.input"
      :key="input.label"
      :label="input.label"
      :placeholder="input.placeholder"
      v-model="workflowData[input.store]"
    />
    <v-btn color="primary" @click="submit"> Submit </v-btn>
    <v-btn @click="reset" class="mx-3"> Reset </v-btn>
    <div>{{ workflowData }}</div>
  </div>
</template>

<script>
import * as ec2 from "@aws-sdk/client-ec2";
import jp from "jsonpath";

export default {
  async asyncData({ params }) {
    const category = params.category;
    const workflowName = params.workflow;
    return { category, workflowName };
  },
  data() {
    return {
      workflowData: {},
      workflow: {},
    };
  },
  methods: {
    async submit() {
      for (let i = 0; i < this.workflow.steps.length; ++i) {
        let step = this.workflow.steps[i];
        let $aws = this.$aws;
        let $data = this.workflowData;
        let $jp = jp;
        let $ec2 = ec2;
        eval(`(async ()=>{${step.js}})()`);
      }
    },
    reset() {
      this.workflow = this.$workflow[this.category][this.workflowName];
      this.workflowData = this.workflow.data;
    },
  },
  mounted() {
    this.reset();
  },
};
</script>
