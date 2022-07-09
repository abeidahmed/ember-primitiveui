import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  isPassive?: boolean;
  registerLabel: (label: SwitchLabelComponent) => void;
  unregisterLabel: () => void;
}

export default class SwitchLabelComponent extends Component<Args> {
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
