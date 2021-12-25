<template>
  <div>
    <ace-editor
      ref="aceEditor"
      v-model="content"
      @init="editorInit"
      lang="javascript"
      :theme="theme"
      :width="width"
      :height="height"
    ></ace-editor>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  props: {
    width: String,
    height: String,
    dark: Boolean,
  },
  components: {
    "ace-editor": require("vue2-ace-editor"),
  },
  methods: {
    editorInit: function (editor) {
      require("brace/ext/language_tools");
      require("brace/mode/javascript");
      require(`brace/theme/chrome`);
      require(`brace/theme/twilight`);
      require("brace/snippets/javascript");
      editor.setOption("scrollPastEnd", 1);
      editor.setOptions({
        fontSize: "10pt",
      });
    },
    setFontSize(n) {
      this.$refs.aceEditor.editor.setOptions({ fontSize: `${n}pt` });
    },
    setContent(txt) {
      this.content = txt;
    },
    getContent() {
      return this.content;
    },
  },
  computed: {
    theme() {
      return this.dark ? "twilight" : "chrome";
    },
  },
};
</script>
