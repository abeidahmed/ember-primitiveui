import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isTabbable } from 'tabbable';
import { move } from '../helpers/dom';
import type MenuButtonComponent from './menu/button';
import type MenuItemComponent from './menu/item';
import type MenuItemsComponent from './menu/items';

interface Args {
  as?: string | typeof Component;
}

export default class MenuComponent extends Component<Args> {
  guid = `${guidFor(this)}-menu`;
  buttonId = `${this.guid}-button`;
  itemsId = `${this.guid}-items`;

  @tracked isOpen = false;
  @tracked button?: MenuButtonComponent;
  @tracked list?: MenuItemsComponent;
  @tracked items: MenuItemComponent[] = [];
  @tracked activeItem?: MenuItemComponent;
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
  }

  @action open() {
    if (this.isOpen) return;

    this.isOpen = true;
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

  @action registerList(list: MenuItemsComponent) {
    this.list = list;
  }

  @action unregisterList() {
    this.list = undefined;
  }

  @action activateItem(item: MenuItemComponent) {
    this.activeItem = item;
  }

  @action activateFirstItem() {
    this.setActiveItemWithScroll(this.enabledItems[0]);
  }

  @action activateLastItem() {
    this.setActiveItemWithScroll(this.enabledItems[this.enabledItems.length - 1]);
  }

  @action activatePreviousItem() {
    this.setActiveItemWithScroll(move(this.enabledItems, this.activeItem, -1));
  }

  @action activateNextItem() {
    this.setActiveItemWithScroll(move(this.enabledItems, this.activeItem, 1));
  }

  @action setMouseMoving(value: boolean) {
    this.isMouseMoving = value;
  }

  @action handleOutsideClick(event: Event, target: HTMLElement) {
    this.close();
    // Prevent dialogs from being closed accidentally.
    if (!isTabbable(target)) {
      event.preventDefault();
    }
  }

  setActiveItemWithScroll(item?: MenuItemComponent) {
    if (!item) return;
    this.activeItem = item;
    item.elem?.scrollIntoView({ block: 'nearest' });
  }

  get enabledItems() {
    return this.items.filter((item) => !item.elem?.hasAttribute('disabled'));
  }
}
