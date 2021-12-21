<template>
  <div>
    <h2>Create a new workflow:</h2>

    <v-divider />

    <!-- title -->
    <v-text-field
      label="Workflow Title"
      placeholder="Ping is not working."
      v-model="title"
    />

    <v-divider />

    <!-- data -->
    <h3>Data</h3>
    <div v-if="workflowData.length">
      <v-row v-for="(data, i) in workflowData" :key="i">
        <v-col>
          <v-text-field label="Key" v-model="data.key" />
        </v-col>
        <v-col>
          <v-text-field label="Value" v-model="data.value" />
        </v-col>
        <v-col>
          <v-btn icon @click="removeData(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info"> No data.</v-alert>
    </div>
    <v-btn @click="addData">Add Data</v-btn>

    <v-divider />

    <!-- inputs -->
    <h3>Inputs</h3>
    <div v-if="inputs.length">
      <v-row v-for="(input, i) in inputs" :key="i">
        <v-col>
          <v-text-field label="Label" v-model="input.label" />
        </v-col>
        <v-col>
          <v-text-field label="Placeholder" v-model="input.placeholder" />
        </v-col>
        <v-col>
          <v-text-field label="Store" v-model="input.store" />
        </v-col>
        <v-col>
          <v-btn icon @click="removeInput(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info"> No inputs.</v-alert>
    </div>
    <v-btn @click="addInput">Add Input</v-btn>

    <v-divider />

    <!-- steps -->
    <h3>Steps</h3>
    <div v-if="steps.length">
      <v-row v-for="(step, i) in steps" :key="i">
        <v-col>
          <v-text-field label="Name" v-model="step.name" />
        </v-col>
        <v-col>
          <v-textarea label="JavaScript" v-model="step.js" />
        </v-col>
        <v-col>
          <v-btn icon @click="removeStep(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info"> No steps.</v-alert>
    </div>
    <v-btn @click="addStep">Add Step</v-btn>

    <!-- test workflow -->
    <v-divider />
    <v-btn @click="test">Test Workflow</v-btn>
    <v-btn @click="exportFile">Export to YAML</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      workflowData: [],
      inputs: [],
      steps: [],
    };
  },
  methods: {
    addData() {
      this.workflowData.push({ key: "", value: "" });
    },
    addInput() {
      this.inputs.push({ label: "", placeholder: "", store: "" });
    },
    addStep() {
      this.steps.push({ name: "", js: "" });
    },
    removeData(index) {
      let result = [];
      for (let i = 0; i < this.workflowData.length; ++i) {
        if (i != index) {
          result.push(this.workflowData[i]);
        }
      }
      this.workflowData = result;
    },
    removeInput(index) {
      let result = [];
      for (let i = 0; i < this.inputs.length; ++i) {
        if (i != index) {
          result.push(this.inputs[i]);
        }
      }
      this.inputs = result;
    },
    removeStep(index) {
      let result = [];
      for (let i = 0; i < this.steps.length; ++i) {
        if (i != index) {
          result.push(this.steps[i]);
        }
      }
      this.steps = result;
    },
    test() {},
    exportFile() {},
  },
};
</script>
