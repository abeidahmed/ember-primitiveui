import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  titleId: string;
  registerTitle: (title: DialogTitleComponent) => void;
  unregisterTitle: () => void;
}

export default class DialogTitleComponent extends Component<Args> {
  registerTitle = modifier(
    () => {
      this.args.registerTitle(this);

      return () => {
        this.args.unregisterTitle();
      };
    },
    { eager: false }
  );
}
