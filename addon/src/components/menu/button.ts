import { action } from '@ember/object';
import Component from '@glimmer/component';
import { next } from '@ember/runloop';

interface Args {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  activateFirstItem: () => void;
  activateLastItem: () => void;
  setMouseMoving: (value: boolean) => void;
}

export default class MenuButtonComponent extends Component<Args> {
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
        if (document.activeElement === event.target && !this.args.isOpen) {
          event.preventDefault();
          this.args.open();
          next(() => {
            this.args.activateLastItem();
          });
        }
        break;
      case 'ArrowDown':
        if (document.activeElement === event.target && !this.args.isOpen) {
          event.preventDefault();
          this.args.open();
          next(() => {
            this.args.activateFirstItem();
          });
        }
        break;
    }
  }
}
