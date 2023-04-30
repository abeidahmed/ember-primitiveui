import Component from '@glimmer/component';
import { action } from '@ember/object';
import type MenuItemComponent from './item';
import { modifier } from 'ember-modifier';

interface Args {
  buttonId: string;
  close: () => void;
  activatePreviousItem: () => void;
  activateNextItem: () => void;
  activeItem?: MenuItemComponent;
  setMouseMoving: (value: boolean) => void;
  registerList: (list: MenuItemsComponent) => void;
  unregisterList: () => void;
}

export default class MenuItemsComponent extends Component<Args> {
  elem?: HTMLElement;

  @action handleKeydown(event: KeyboardEvent) {
    this.args.setMouseMoving(false);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.args.close();
        break;
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

  registerList = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerList(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterList();
      };
    },
    { eager: false }
  );
}
