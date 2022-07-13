import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  labelId: string;
  onLabelClick: () => void;
  registerLabel: (label: ListboxLabelComponent) => void;
  unregisterLabel: () => void;
}

export default class ListboxLabelComponent extends Component<Args> {
  registerLabel = modifier(
    () => {
      this.args.registerLabel(this);

      return () => {
        this.args.unregisterLabel();
      };
    },
    { eager: false }
  );
}
