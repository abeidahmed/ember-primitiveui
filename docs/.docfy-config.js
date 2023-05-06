const highlight = require('remark-highlight.js');

/**
 * @type {import('@docfy/core/lib/types').DocfyConfig}
 */
module.exports = {
  repository: {
    url: 'https://github.com/abeidahmed/ember-primitiveui',
    editBranch: 'main',
  },
  remarkPlugins: [highlight],
};
