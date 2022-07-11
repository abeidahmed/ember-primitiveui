import { helper } from '@ember/component/helper';
import { marked } from 'marked';
import { htmlSafe } from '@ember/template';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import handlebars from 'highlight.js/lib/languages/handlebars';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('plaintext', plaintext);

export function formatMarkdown([value]) {
  if (!value) {
    return;
  }

  marked.setOptions({
    highlight: function (code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'language-',
  });

  const parsedMarkdown = marked.parse(value);
  return htmlSafe(parsedMarkdown);
}

export default helper(formatMarkdown);
