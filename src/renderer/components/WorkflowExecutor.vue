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

    <v-expansion-panels v-if="started" class="my-3">
      <v-expansion-panel v-for="result in results" :key="result.name">
        <v-expansion-panel-header
          :color="
            result.pending
              ? undefined
              : result.err
              ? 'red'
              : result.info
              ? 'blue'
              : 'green'
          "
          :expand-icon="
            result.pending
              ? undefined
              : result.err
              ? 'mdi-alert-circle-outline'
              : result.info
              ? 'mdi-information-outline'
              : 'mdi-check'
          "
          :disable-icon-rotate="!result.pending"
        >
          {{ result.name }}
          <v-progress-circular indeterminate v-if="result.pending" :size="15" />
        </v-expansion-panel-header>
        <v-expansion-panel-content
          :color="
            result.pending
              ? undefined
              : result.err
              ? 'red'
              : result.info
              ? 'blue'
              : 'green'
          "
        >
          <v-progress-circular indeterminate v-if="result.pending" />
          <span v-else>{{ result.err || result.info || result.ok }}</span>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import * as ec2 from "@aws-sdk/client-ec2";
import jp from "jsonpath";

export default {
  props: {
    workflow: Object,
  },
  data() {
    return {
      workflowData: {},
      started: false,
      results: [],
    };
  },
  methods: {
    async submit() {
      this.started = true;
      this.results = [];
      for (let i = 0; i < this.workflow.steps.length; ++i) {
        let step = this.workflow.steps[i];
        // update result
        this.results.push({
          pending: true,
          name: step.name,
        });
        // prepare eval env
        let $ = {
          aws: this.$aws,
          data: this.workflowData,
          jp,
          ec2,
          err: "",
          ok: "",
          info: "",
        };
        try {
          await eval(`(async ()=>{${step.js}})()`);
        } catch (e) {
          this.results[i].pending = false;
          this.results[i].err = e;
          break; // stop following steps
        }
        // update result
        this.results[i].pending = false;
        this.results[i].err = $.err;
        this.results[i].info = $.info;
        this.results[i].ok = $.ok;
        if ($.err) break;
      }
    },
    reset() {
      this.workflowData = { ...this.workflow.data }; // copy
      this.started = false;
      this.results = [];
    },
  },
};
</script>
