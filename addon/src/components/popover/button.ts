import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  registerButton: (button: PopoverButtonComponent) => void;
  unregisterButton: () => void;
}

export default class PopoverButtonComponent extends Component<Args> {
  elem?: HTMLElement;

  registerButton = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerButton(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterButton();
      };
    },
    { eager: false }
  );
}
