<template>
  <div>
    <v-btn @click="exportFile" class="ml-3">Export to YAML</v-btn>
    <v-btn @click="$refs.fileInput.click()" class="ml-3">Load from YAML</v-btn>
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
                label="Default Value (YAML)"
                v-model="data.value"
                hide-details
              />
            </v-col>
            <v-col>
              <v-text-field
                label="Rendered (YAML)"
                :value="_eval(data.key, data.value)"
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
            </v-col>
          </v-row>
          <v-btn @click="addStep" class="mt-3">Add Step</v-btn>
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
            Editing Step: {{ steps[editingIndex].name }}
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
          <tt-btn
            tt="Decrease Font Size"
            icon="mdi-format-font-size-decrease"
            @click="changeEditorFontSize(-2)"
            bottom
          />
          <tt-btn
            tt="Increase Font Size"
            icon="mdi-format-font-size-increase"
            @click="changeEditorFontSize(2)"
            bottom
          />
          <tt-btn tt="Save" icon="mdi-check" @click="editorSave" bottom />
          <v-toolbar-items>
            <!-- <v-btn dark text @click="dialog = false"> Save </v-btn> -->
          </v-toolbar-items>
        </v-toolbar>
        <code-editor
          ref="codeEditor"
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
      @change="fileChosen"
    />
  </div>
</template>

<script>
import CodeEditor from "../components/CodeEditor.vue";
import TtBtn from "../components/TtBtn.vue";
import WorkflowExecutor from "../components/WorkflowExecutor.vue";
import { ipcRenderer } from "electron";
import * as yaml from "js-yaml";

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default {
  components: { TtBtn, CodeEditor, WorkflowExecutor },
  data() {
    return {
      title: "",
      workflowData: [],
      inputs: [],
      steps: [],
      fullscreenEdit: false,
      editingIndex: 0,
      editorDark: true,
      editorFontSize: 10,
      editorShowInvisible: true,
    };
  },
  methods: {
    changeEditorFontSize(n) {
      this.editorFontSize += n;
      this.$refs.codeEditor.setFontSize(this.editorFontSize);
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
    exportFile() {
      download(this.title + ".yaml", yaml.dump(this.computedWorkflow));
    },
    expand(i) {
      this.editingIndex = i;
      this.fullscreenEdit = true;
    },
    editorSave() {
      this.fullscreenEdit = false;
    },
    fileChosen(event) {
      ipcRenderer.send("open-workflow-yaml", event.target.files[0].path);
    },
    _eval(key, value) {
      try {
        let result = {};
        result[key] = yaml.load(value);
        return yaml.dump(result, { flowLevel: 1 });
      } catch (e) {
        return e;
      }
    },
  },
  created() {
    ipcRenderer.on("open-workflow-yaml", (event, arg) => {
      let content = yaml.load(arg);
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
};
</script>
