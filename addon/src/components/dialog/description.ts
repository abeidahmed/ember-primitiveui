import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  descriptionId: string;
  registerDescription: (description: DialogDescriptionComponent) => void;
  unregisterDescription: () => void;
}

export default class DialogDescriptionComponent extends Component<Args> {
  registerDescription = modifier(
    () => {
      this.args.registerDescription(this);

      return () => {
        this.args.unregisterDescription();
      };
    },
    { eager: false }
  );
}
