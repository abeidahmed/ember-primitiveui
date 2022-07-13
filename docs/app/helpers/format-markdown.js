import { helper } from '@ember/component/helper';
import { marked } from 'marked';
import { htmlSafe } from '@ember/template';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import handlebars from 'highlight.js/lib/languages/handlebars';
import xml from 'highlight.js/lib/languages/xml';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('handlebars', handlebars);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('plaintext', plaintext);

const renderer = {
  heading(text, level) {
    const escapedText = text
      .toLowerCase()
      .replace(/<[^>]*>?/g, '') // remove surrounding tags
      .replace(/[^\w]+/g, '-'); // replace unwanted chars with '-'
    return `
      <h${level} id="${escapedText}" class="markdown-heading">
        <a class="font-bold no-underline hover:underline" href="#${escapedText}">
          ${text}
        </a>
      </h${level}>
    `;
  },
};

marked.use({ renderer });

export function formatMarkdown([value]) {
  if (!value) return;

  marked.setOptions({
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'language-',
  });

  const parsedMarkdown = marked.parse(value);
  return htmlSafe(parsedMarkdown);
}

export default helper(formatMarkdown);
