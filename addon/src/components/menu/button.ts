import { action } from '@ember/object';
import Component from '@glimmer/component';
import { next } from '@ember/runloop';
import { modifier } from 'ember-modifier';

interface Args {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activateFirstItem: () => void;
  activateLastItem: () => void;
  setMouseMoving: (value: boolean) => void;
  registerButton: (button: MenuButtonComponent) => void;
  unregisterButton: () => void;
}

export default class MenuButtonComponent extends Component<Args> {
  elem?: HTMLElement;

  @action handleKeydown(event: KeyboardEvent) {
    this.args.setMouseMoving(false);

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.args.isOpen) {
          event.preventDefault();
          this.args.open();
          next(() => {
            this.args.activateFirstItem();
          });
        }
        break;
      case 'Escape':
        if (!this.args.isOpen) return;
        event.preventDefault();
        event.stopPropagation();
        this.args.close();
        break;
      case 'ArrowUp':
        if (!this.args.isOpen) {
          event.preventDefault();
          this.args.open();
          next(() => {
            this.args.activateLastItem();
          });
        }
        break;
      case 'ArrowDown':
        if (!this.args.isOpen) {
          event.preventDefault();
          this.args.open();
          next(() => {
            this.args.activateFirstItem();
          });
        }
        break;
    }
  }

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
