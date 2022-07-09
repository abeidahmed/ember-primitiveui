import { helper } from '@ember/component/helper';

function or(args: unknown[]) {
  for (let i = 0; i < args.length; i++) {
    if (!!args[i] === true) {
      return args[i];
    }
  }

  return args[args.length - 1];
}

export default helper(or);
