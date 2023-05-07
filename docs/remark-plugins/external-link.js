const visit = require('unist-util-visit');

const externalLink = () => {
  function plugin(node) {
    if (!node.url.startsWith('https://') && !node.url.startsWith('http://')) return;

    const data = node.data || (node.data = {});
    const props = data.hProperties || (data.hProperties = {});
    props.target = '_blank';
    props.rel = 'noopener nofollow noreferrer';
  }

  return function transform(tree) {
    visit(tree, 'link', plugin);
  };
};

module.exports = externalLink;
