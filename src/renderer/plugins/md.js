import { marked } from "marked";
import prism from "prismjs";
import loadLanguages from "prismjs/components/";

// load all language
loadLanguages();

const renderer = new marked.Renderer();
renderer.link = (href, title, text) =>
  `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
marked.setOptions({
  renderer,
  highlight: function (code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

export default (context, inject) => {
  inject("md", marked);
};
