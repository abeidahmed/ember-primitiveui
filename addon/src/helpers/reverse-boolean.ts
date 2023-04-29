import { helper } from '@ember/component/helper';

function reverseBoolean([value]: [unknown]) {
  return typeof value === 'boolean' ? !value : value;
}

export default helper(reverseBoolean);
