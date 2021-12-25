<template>
  <div>
    <ace-editor
      ref="aceEditor"
      @init="editorInit"
      lang="javascript"
      :theme="theme"
      :width="width"
      :height="height"
      :value="value"
      @input="$emit('input', $event)"
    ></ace-editor>
  </div>
</template>

<script>
export default {
  props: {
    width: String,
    height: String,
    dark: Boolean,
    value: String,
    scrollPastEnd: Number,
    showInvisibles: Boolean,
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
      if (this.scrollPastEnd) {
        editor.setOption("scrollPastEnd", this.scrollPastEnd);
      }
      editor.setOptions({
        fontSize: "10pt",
        showInvisibles: this.showInvisibles,
      });
      editor.session.setOptions({
        mode: "ace/mode/javascript",
        tabSize: 2,
        useSoftTabs: true,
      });
    },
    setFontSize(n) {
      this.$refs.aceEditor.editor.setOptions({ fontSize: `${n}pt` });
    },
  },
  computed: {
    theme() {
      return this.dark ? "twilight" : "chrome";
    },
  },
  watch: {
    showInvisibles(val) {
      this.$refs.aceEditor.editor.setOptions({ showInvisibles: val });
    },
  },
};
</script>
