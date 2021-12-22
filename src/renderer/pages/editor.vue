<template>
  <div>
    <v-btn @click="test" color="success">Test Workflow</v-btn>
    <v-btn @click="exportFile" class="ml-3">Export to YAML</v-btn>
    <v-btn @click="exportFile" class="ml-3">Load from YAML</v-btn>
    <div class="d-flex align-center mt-3">
      <h2>Create a new workflow:</h2>
      <!-- title -->
      <v-text-field
        label="Workflow Title"
        placeholder="Ping is not working."
        v-model="title"
        hide-details
        class="ml-3"
        outlined
        dense
      />
    </div>

    <v-divider class="my-2" />

    <!-- data -->
    <div class="d-flex align-center">
      <h3>Data</h3>
      <v-btn @click="addData" icon class="ml-3">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <div v-if="workflowData.length">
      <v-row
        v-for="(data, i) in workflowData"
        :key="i"
        class="align-center"
        dense
      >
        <v-col cols="3">
          <v-text-field label="Key" v-model="data.key" hide-details />
        </v-col>
        <v-col>
          <v-text-field label="Value" v-model="data.value" hide-details />
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="removeData(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No data.</v-alert>
    </div>

    <v-divider class="my-2" />

    <!-- inputs -->
    <div class="d-flex align-center">
      <h3>Inputs</h3>
      <v-btn @click="addInput" icon class="ml-3">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div v-if="inputs.length">
      <v-row v-for="(input, i) in inputs" :key="i" class="align-center" dense>
        <v-col>
          <v-text-field label="Label" v-model="input.label" hide-details />
        </v-col>
        <v-col>
          <v-text-field
            label="Placeholder"
            v-model="input.placeholder"
            hide-details
          />
        </v-col>
        <v-col>
          <v-text-field label="Store" v-model="input.store" hide-details />
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="removeInput(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No inputs.</v-alert>
    </div>

    <v-divider class="my-2" />

    <!-- steps -->
    <div class="d-flex align-center">
      <h3>Steps</h3>
      <v-btn @click="addStep" icon class="ml-3">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div v-if="steps.length">
      <v-row v-for="(step, i) in steps" :key="i" class="align-center" dense>
        <v-col cols="3">
          <v-text-field label="Name" v-model="step.name" hide-details />
        </v-col>
        <v-col>
          <v-textarea label="JavaScript" v-model="step.js" />
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="removeStep(i)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No steps.</v-alert>
    </div>
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
