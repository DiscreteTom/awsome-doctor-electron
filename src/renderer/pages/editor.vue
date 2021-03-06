<template>
  <div>
    <div class="d-flex align-center">
      <tt-btn
        top
        @click="exportNewFile"
        tt="Export New YAML File"
        icon="mdi-content-save-outline"
      />
      <tt-btn
        top
        @click="$refs.fileInput.click()"
        class="ml-3"
        tt="Load From YAML File"
        icon="mdi-folder-open-outline"
      />
      <tt-btn
        top
        @click="openUrlDialog = true"
        class="ml-3"
        tt="Open From URL"
        icon="mdi-file-import-outline"
      />
      <tt-btn
        top
        @click="reset"
        class="ml-3"
        tt="Reset Editor"
        icon="mdi-delete-outline"
      />

      <v-divider vertical />

      <span style="font-weight: bold" class="mx-3"> File: </span>
      <v-tooltip bottom v-if="currentFileName">
        <template v-slot:activator="{ on }">
          <span v-on="on"> {{ currentFileName }} </span>
        </template>
        <span>{{ currentFilePath }}</span>
      </v-tooltip>
      <span v-else> Untitled </span>
    </div>

    <v-divider />

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

    <v-expansion-panels multiple accordion>
      <!-- data -->
      <v-expansion-panel>
        <v-expansion-panel-header> Data </v-expansion-panel-header>
        <v-expansion-panel-content>
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
              <v-text-field
                label="Initial Value (YAML)"
                v-model="data.value"
                hide-details
              />
            </v-col>
            <v-col>
              <v-text-field
                label="Rendered (YAML)"
                :value="renderYaml(data.key, data.value)"
                hide-details
                disabled
              />
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
          <v-btn @click="addData" class="mt-3">Add Data</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- inputs -->
      <v-expansion-panel>
        <v-expansion-panel-header> Inputs </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="(input, i) in inputs"
            :key="i"
            class="align-center"
            dense
          >
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
          <v-btn @click="addInput" class="mt-3">Add Input</v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- steps -->
      <v-expansion-panel>
        <v-expansion-panel-header> Steps </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row v-for="(step, i) in steps" :key="i" class="align-center" dense>
            <v-col cols="3">
              <v-text-field label="Name" v-model="step.name" hide-details />
            </v-col>
            <v-col>
              <code-editor
                :dark="editorDark"
                v-model="step.js"
                height="200"
                :showInvisibles="editorShowInvisible"
              />
            </v-col>
            <v-col cols="1" class="d-flex flex-column align-center">
              <tt-btn
                tt="Remove Step"
                icon="mdi-close"
                @click="removeStep(i)"
                top
              />
              <tt-btn
                tt="Expand"
                icon="mdi-arrow-expand"
                @click="expand(i)"
                top
              />
              <tt-btn
                tt="Format Code"
                icon="mdi-code-json"
                @click="formatCode(i)"
                top
              />
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-btn @click="addStep" class="mt-3">Add Step</v-btn>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    class="ml-3"
                    v-model="editorDark"
                    inset
                    hide-details
                    color="black"
                  ></v-switch>
                </span>
              </template>
              <span>Dark Mode</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    class="ml-3"
                    v-model="editorShowInvisible"
                    inset
                    hide-details
                  ></v-switch>
                </span>
              </template>
              <span>Show Invisibles</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    class="ml-3"
                    v-model="editorAutoFormat"
                    inset
                    hide-details
                    color="yellow"
                  ></v-switch>
                </span>
              </template>
              <span>Format on Save</span>
            </v-tooltip>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- test -->
      <v-expansion-panel>
        <v-expansion-panel-header> Test </v-expansion-panel-header>
        <v-expansion-panel-content>
          <workflow-executor :workflow="computedWorkflow" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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
            Editing Workflow:
            <span class="text-decoration-underline"> {{ title }} </span>
            Step:
            <span class="text-decoration-underline">
              {{ steps[editingIndex].name }}
            </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorDark"
                  inset
                  hide-details
                  color="black"
                ></v-switch>
              </span>
            </template>
            <span>Dark Mode</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorShowInvisible"
                  inset
                  hide-details
                ></v-switch>
              </span>
            </template>
            <span>Show Invisibles</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-switch
                  v-model="editorAutoFormat"
                  inset
                  hide-details
                  color="yellow"
                ></v-switch>
              </span>
            </template>
            <span>Format on Save</span>
          </v-tooltip>
          <tt-btn
            tt="Decrease Font Size"
            icon="mdi-format-font-size-decrease"
            @click="changeEditorFontSize(-1)"
            bottom
          />
          <tt-btn
            tt="Increase Font Size"
            icon="mdi-format-font-size-increase"
            @click="changeEditorFontSize(1)"
            bottom
          />
          <tt-btn
            tt="Format Code"
            icon="mdi-code-json"
            @click="formatCode(editingIndex)"
            bottom
          />
        </v-toolbar>
        <code-editor
          ref="fullScreenCodeEditor"
          class="flex-grow-1"
          :scrollPastEnd="1"
          :dark="editorDark"
          :value="steps[editingIndex].js"
          @input="steps[editingIndex].js = $event"
          :showInvisibles="editorShowInvisible"
        />
      </v-card>
    </v-dialog>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @input="fileChosen"
    />

    <v-dialog v-model="openUrlDialog">
      <v-card>
        <v-card-title>Open from URL</v-card-title>
        <v-card-subtitle style="color: red"
          >External workflows might be dangerous.</v-card-subtitle
        >
        <v-card-text>
          <v-text-field
            v-model="externalUrl"
            label="URL"
            placeholder="https://example.com"
          />
          <v-alert v-if="openUrlDialogErr !== null" type="error">
            {{ openUrlDialogErr }}
          </v-alert>
          <v-btn
            @click="openExternalUrl"
            color="primary"
            :loading="openingExternalUrl"
          >
            Open
          </v-btn>
          <v-btn @click="openUrlDialog = false" class="mx-3"> Close </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CodeEditor from "../components/CodeEditor.vue";
import TtBtn from "../components/TtBtn.vue";
import WorkflowExecutor from "../components/WorkflowExecutor.vue";
import * as yaml from "js-yaml";
import * as prettier from "prettier";

const defaultData = {
  title: "",
  workflowData: [],
  inputs: [],
  steps: [],
  fullscreenEdit: false,
  editingIndex: 0,
  editorDark: true,
  editorShowInvisible: true,
  currentFilePath: null,
  currentFileName: null,
  openUrlDialog: false,
  externalUrl: "",
  openUrlDialogErr: null,
  openingExternalUrl: false,
  editorAutoFormat: true,
};

export default {
  components: { TtBtn, CodeEditor, WorkflowExecutor },
  data() {
    return JSON.parse(JSON.stringify(defaultData)); // copy
  },
  methods: {
    reset() {
      let data = JSON.parse(JSON.stringify(defaultData)); // copy
      for (let key in data) {
        this[key] = data[key];
      }
    },
    openExternalUrl() {
      this.openUrlDialogErr = null;
      this.openingExternalUrl = true;
      this.$axios
        .get(this.externalUrl)
        .then((res) => {
          this.applyYaml(res.data);
          this.currentFilePath = null;
          this.currentFileName = null;
          this.openUrlDialog = false;
          this.externalUrl = "";
          this.openingExternalUrl = false;
        })
        .catch((e) => {
          this.openUrlDialogErr = e;
          this.openingExternalUrl = false;
        });
    },
    changeEditorFontSize(n) {
      this.$store.commit("updateConfig", {
        editorFontSize: this.$store.state.editorFontSize + n,
      });
      this.$refs.fullScreenCodeEditor.setFontSize(
        this.$store.state.editorFontSize
      );
    },
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
    exportNewFile() {
      if (this.editorAutoFormat) {
        this.formatAllCode();
      }
      this.$ipc.send("choose-file", { title: "Save workflow" });
    },
    saveFile() {
      if (this.editorAutoFormat) {
        this.formatAllCode();
      }
      if (this.currentFilePath) {
        this.$ipc.send("save-file", {
          filePath: this.currentFilePath,
          data: yaml.dump(this.computedWorkflow),
        });
      } else {
        this.exportNewFile();
      }
    },
    formatAllCode() {
      for (let i = 0; i < this.steps.length; ++i) {
        this.formatCode(i);
      }
    },
    expand(i) {
      this.editingIndex = i;
      this.fullscreenEdit = true;
      this.$nextTick(() => {
        this.$refs.fullScreenCodeEditor.setFontSize(
          this.$store.state.editorFontSize
        );
      });
    },
    formatCode(stepIndex) {
      this.steps[stepIndex].js = prettier.format(this.steps[stepIndex].js, {
        parser: "babel",
      });
    },
    fileChosen(event) {
      if (event.target.files.length > 0) {
        this.$ipc.send("open-workflow-yaml", {
          filePath: event.target.files[0].path,
          fileName: event.target.files[0].name,
        });
        this.$refs.fileInput.value = null;
      }
    },
    renderYaml(key, value) {
      try {
        let result = {};
        result[key] = yaml.load(value);
        return yaml.dump(result, { flowLevel: 1 });
      } catch (e) {
        return e;
      }
    },
    handleKeyDown(e) {
      // ctrl s
      if (e.keyCode === 83 && e.ctrlKey) {
        e.preventDefault();
        this.saveFile();
      }
    },
    applyYaml(txt) {
      let content = yaml.load(txt);
      this.title = content.title;
      this.workflowData = [];
      for (let key in content.data) {
        this.workflowData.push({
          key,
          value: yaml.dump(content.data[key]),
        });
      }
      this.inputs = content.input;
      this.steps = content.steps;
    },
  },
  created() {
    this.$ipc.one("open-workflow-yaml", (event, arg) => {
      this.applyYaml(arg.content);
      this.currentFilePath = arg.filePath;
      this.currentFileName = arg.fileName;
    });

    this.$ipc.one("choose-file", (event, arg) => {
      this.currentFilePath = arg.filePath;
      this.currentFileName = arg.fileName;
      this.saveFile();
    });
  },
  computed: {
    computedWorkflow() {
      let result = {
        title: this.title,
        data: {},
        input: this.inputs,
        steps: this.steps,
      };
      this.workflowData.forEach((d) => {
        try {
          result.data[d.key] = yaml.load(d.value);
        } catch (e) {
          result.data[d.key] = e;
        }
      });
      return result;
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.editorDark = this.$store.state.editorDarkMode;
    this.editorShowInvisible = this.$store.state.editorShowInvisibles;
    this.editorAutoFormat = this.$store.state.editorAutoFormat;
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  watch: {
    editorDark(val) {
      this.$store.commit("updateConfig", { editorDarkMode: val });
    },
    editorShowInvisible(val) {
      this.$store.commit("updateConfig", { editorShowInvisibles: val });
    },
    editorAutoFormat(val) {
      this.$store.commit("updateConfig", { editorAutoFormat: val });
    },
  },
};
</script>
