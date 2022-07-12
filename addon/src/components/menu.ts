import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';
import type MenuButtonComponent from './menu/button';
import type MenuItemComponent from './menu/item';
import { move } from '../helpers/dom';

interface Args {
  as?: string | typeof Component;
}

export default class MenuComponent extends Component<Args> {
  guid = `${guidFor(this)}-menu`;
  buttonId = `${this.guid}-button`;
  itemsId = `${this.guid}-items`;

  @tracked isOpen = false;
  @tracked items: MenuItemComponent[] = [];
  @tracked activeItem: MenuItemComponent | undefined;
  @tracked button: MenuButtonComponent | undefined;
  @tracked isMouseMoving = false;

  @action toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @action close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.activeItem = undefined;
    this.isMouseMoving = false;
    this.button?.focus();
  }

  @action open() {
    if (this.isOpen) return;

    this.isOpen = true;
  }

  @action onKeydown(event: KeyboardEvent) {
    this.isMouseMoving = false;
    const buttonIsFocused = event.target === this.button?.elem;

    switch (event.key) {
      case 'Enter':
      case ' ':
        if (buttonIsFocused && !this.isOpen) {
          event.preventDefault();
          this.open();
          next(() => {
            this.setActiveItemWithScroll(this.enabledItems[0]);
          });
        } else if (this.activeItem) {
          event.preventDefault();
          event.stopPropagation();
          this.activeItem.click();
        }
        break;
      case 'Escape':
        if (!this.isOpen) break;
        event.preventDefault();
        event.stopPropagation();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (buttonIsFocused && !this.isOpen) {
          this.open();
          next(() => {
            this.setActiveItemWithScroll(this.enabledItems[0]);
          });
        } else {
          this.setActiveItemWithScroll(
            move(this.enabledItems, this.activeItem, 1)
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (buttonIsFocused && !this.isOpen) {
          this.open();
          next(() => {
            this.setActiveItemWithScroll(
              this.enabledItems[this.enabledItems.length - 1]
            );
          });
        } else {
          this.setActiveItemWithScroll(
            move(this.enabledItems, this.activeItem, -1)
          );
        }
        break;
      default:
        break;
    }
  }

  @action async registerItem(item: MenuItemComponent) {
    const { items } = this;
    items.push(item);
    await Promise.resolve(() => (this.items = items));
  }

  @action async unregisterItem(item: MenuItemComponent) {
    const { items } = this;
    const index = items.indexOf(item);
    items.splice(index, 1);
    await Promise.resolve(() => (this.items = items));
  }

  @action registerButton(button: MenuButtonComponent) {
    this.button = button;
  }

  @action unregisterButton() {
    this.button = undefined;
  }

  @action activateItem(item: MenuItemComponent) {
    this.activeItem = item;
  }

  @action setMouseMoving(value: boolean) {
    this.isMouseMoving = value;
  }

  setActiveItemWithScroll(item: MenuItemComponent) {
    this.activeItem = item;
    item.elem?.scrollIntoView({ block: 'nearest' });
  }

  get enabledItems() {
    return this.items.filter((item) => !item.elem?.hasAttribute('disabled'));
  }
}
