import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  isOpen: boolean;
  buttonId: string;
  optionsId: string;
  toggle: () => void;
  registerButton: (button: ListboxButtonComponent) => void;
  unregisterButton: () => void;
}

export default class ListboxButtonComponent extends Component<Args> {
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
