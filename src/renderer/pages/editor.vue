<template>
  <div>
    <v-btn @click="test" color="success">Test Workflow</v-btn>
    <v-btn @click="exportFile" class="ml-3">Export to YAML</v-btn>
    <v-btn @click="exportFile" class="ml-3">Load from YAML</v-btn>
    <div class="d-flex align-center mt-3">
      <h2>Editing workflow:</h2>
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
      <h3 class="mr-3">Data</h3>
      <tt-btn tt="Add Data" icon="mdi-plus" @click="addData" top />
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
        <v-col cols="1" class="d-flex justify-center">
          <tt-btn
            tt="Remove Data"
            icon="mdi-close"
            @click="removeData(i)"
            top
          />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No data.</v-alert>
    </div>

    <v-divider class="my-2" />

    <!-- inputs -->
    <div class="d-flex align-center">
      <h3 class="mr-3">Inputs</h3>
      <tt-btn tt="Add Input" icon="mdi-plus" @click="addInput" top />
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
          <v-select
            label="Store"
            v-model="input.store"
            :items="workflowData.map((d) => d.key)"
            hide-details
          />
        </v-col>
        <v-col cols="1" class="d-flex justify-center">
          <tt-btn
            tt="Remove Input"
            icon="mdi-close"
            @click="removeInput(i)"
            top
          />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No inputs.</v-alert>
    </div>

    <v-divider class="my-2" />

    <!-- steps -->
    <div class="d-flex align-center">
      <h3 class="mr-3">Steps</h3>
      <tt-btn tt="Add Step" icon="mdi-plus" @click="addStep" top />
    </div>
    <div v-if="steps.length">
      <v-row v-for="(step, i) in steps" :key="i" class="align-center" dense>
        <v-col cols="3">
          <v-text-field label="Name" v-model="step.name" hide-details />
        </v-col>
        <v-col>
          <v-textarea label="JavaScript" v-model="step.js" />
        </v-col>
        <v-col cols="1" class="d-flex flex-column align-center">
          <tt-btn
            tt="Remove Step"
            icon="mdi-close"
            @click="removeStep(i)"
            top
          />
          <tt-btn tt="Expand" icon="mdi-arrow-expand" @click="expand(i)" top />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-alert type="info" outlined dense> No steps.</v-alert>
    </div>

    <v-dialog
      v-model="fullscreenEdit"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card
        v-if="fullscreenEdit"
        class="d-flex flex-column"
        style="height: 100vh"
      >
        <v-toolbar dark color="primary" class="flex-grow-0">
          <tt-btn
            tt="Exit Fullscreen"
            icon="mdi-close"
            @click="fullscreenEdit = false"
            bottom
          />
          <v-toolbar-title class="ml-3">
            Editing Step: {{ steps[editingIndex].name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <!-- <v-btn dark text @click="dialog = false"> Save </v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <code-editor class="flex-grow-1" />
        <!-- <v-textarea v-model="steps[editingIndex].js" class="flex-grow-1" /> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CodeEditor from "../components/CodeEditor.vue";
import TtBtn from "../components/TtBtn.vue";

export default {
  components: { TtBtn, CodeEditor },
  data() {
    return {
      title: "",
      workflowData: [],
      inputs: [],
      steps: [],
      fullscreenEdit: false,
      editingIndex: 0,
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
    expand(i) {
      this.fullscreenEdit = true;
    },
  },
};
</script>
