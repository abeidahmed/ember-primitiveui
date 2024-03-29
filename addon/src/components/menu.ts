import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isTabbable } from 'tabbable';
import { cycle } from '../utils/array';
import type MenuButtonComponent from './menu/button';
import type MenuItemComponent from './menu/item';
import type MenuListComponent from './menu/list';

interface Args {
  as?: string | typeof Component;
}

export default class MenuComponent extends Component<Args> {
  id = `${guidFor(this)}-menu`;
  buttonId = `${this.id}-button`;
  listId = `${this.id}-list`;

  @tracked isOpen = false;
  @tracked button?: MenuButtonComponent;
  @tracked list?: MenuListComponent;
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

  @action registerList(list: MenuListComponent) {
    this.list = list;
  }

  @action unregisterList() {
    this.list = undefined;
  }

  @action setActiveItem(item?: MenuItemComponent) {
    this.activeItem = item;
  }

  @action activateFirstItem() {
    this.setActiveItemWithScroll(this.enabledItems[0]);
  }

  @action activateLastItem() {
    this.setActiveItemWithScroll(this.enabledItems[this.enabledItems.length - 1]);
  }

  @action activatePreviousItem() {
    this.setActiveItemWithScroll(cycle(this.enabledItems, this.activeItem, -1));
  }

  @action activateNextItem() {
    this.setActiveItemWithScroll(cycle(this.enabledItems, this.activeItem, 1));
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
    return this.items.filter((item) => !item.args.disabled);
  }
}
