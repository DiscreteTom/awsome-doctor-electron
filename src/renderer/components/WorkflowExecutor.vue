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
          <div v-else>
            <div
              v-if="result.markdown"
              v-html="result.err || result.info || result.ok"
              class="markdown-body"
              style="background: white; padding: 10px"
            ></div>
            <div v-else>{{ result.err || result.info || result.ok }}</div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import jp from "jsonpath";
import * as yaml from "js-yaml";

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
          axios: this.$axios,
          jp,
          yaml,
          err: "",
          ok: "",
          info: "",
          utils: this.$workflowUtils,
          stop: false,
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
        this.results[i].markdown = false;
        this.results[i].err = $.err;
        this.results[i].info = $.info;
        this.results[i].ok = $.ok;
        const mdPrefix = "/md\n";
        if (typeof $.err == "string" && $.err.startsWith(mdPrefix)) {
          this.results[i].err = this.$md.parse($.err.slice(mdPrefix.length));
          this.results[i].markdown = true;
        } else if (typeof $.info == "string" && $.info.startsWith(mdPrefix)) {
          this.results[i].info = this.$md.parse($.info.slice(mdPrefix.length));
          this.results[i].markdown = true;
        } else if (typeof $.ok == "string" && $.ok.startsWith(mdPrefix)) {
          this.results[i].ok = this.$md.parse($.ok.slice(mdPrefix.length));
          this.results[i].markdown = true;
        }

        if ($.err) break;
        if ($.stop) break;
      }
    },
    reset() {
      this.workflowData = { ...this.workflow.data }; // copy
      this.started = false;
      this.results = [];
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.reset(); // fill with default data
    });
  },
};
</script>

<style>
code[class^="language-"] {
  background-color: transparent !important;
}
</style>
