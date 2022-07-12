import { helper } from '@ember/component/helper';

function tagIsComponent([as]: [unknown]) {
  return typeof as === 'object';
}

export default helper(tagIsComponent);
