const highlight = require('remark-highlight.js');
const externalLink = require('./remark-plugins/external-link');

/**
 * @type {import('@docfy/core/lib/types').DocfyConfig}
 */
module.exports = {
  repository: {
    url: 'https://github.com/abeidahmed/ember-primitiveui',
    editBranch: 'main',
  },
  remarkPlugins: [highlight, externalLink],
  tocMaxDepth: 3,
};
