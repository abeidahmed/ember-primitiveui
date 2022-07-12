import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  registerButton: (button: MenuButtonComponent) => void;
  unregisterButton: () => void;
}

export default class MenuButtonComponent extends Component<Args> {
  elem: HTMLElement | undefined;

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

  focus() {
    this.elem?.focus();
  }
}
