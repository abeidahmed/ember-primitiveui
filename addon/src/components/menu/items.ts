import Component from '@glimmer/component';
import { action } from '@ember/object';
import type MenuItemComponent from './item';

interface Args {
  buttonId: string;
  close: () => void;
  activatePreviousItem: () => void;
  activateNextItem: () => void;
  activeItem?: MenuItemComponent;
  setMouseMoving: (value: boolean) => void;
}

export default class MenuItemsComponent extends Component<Args> {
  @action handleKeydown(event: KeyboardEvent) {
    this.args.setMouseMoving(false);

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (!this.args.activeItem) return;

        event.preventDefault();
        event.stopPropagation();
        this.args.activeItem.click();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.args.activatePreviousItem();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.args.activateNextItem();
        break;
    }
  }

  @action allowOutsideClick(event: Event) {
    const button = document.getElementById(this.args.buttonId);
    return button ? button.contains(event.target as HTMLElement) : false;
  }

  @action clickOutsideDeactivates(event: Event) {
    return !this.allowOutsideClick(event);
  }
}
