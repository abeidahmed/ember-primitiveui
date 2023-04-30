import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { next } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';

interface Args {
  as?: string | typeof Component;
  disabled?: boolean;
  registerItem: (item: MenuItemComponent) => void;
  unregisterItem: (item: MenuItemComponent) => void;
  close: () => void;
  activeItem: MenuItemComponent | undefined;
  setActiveItem: (item?: MenuItemComponent) => void;
  isMouseMoving: boolean;
  setMouseMoving: (value: boolean) => void;
}

export default class MenuItemComponent extends Component<Args> {
  id = `${guidFor(this)}-menu-item`;
  elem: HTMLElement | undefined;

  @action onClick(event: Event) {
    if (this.elem && this.elem.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    // LinkTo component does a full page refresh if we close the menu on the same frame
    next(() => {
      this.args.close();
    });
  }

  @action onMouseover() {
    if (!this.args.isMouseMoving) return;
    if (this.args.disabled) return;

    this.args.setActiveItem(this);
  }

  @action onMousemove() {
    if (this.args.isMouseMoving) return;
    if (this.args.disabled) return;

    this.args.setMouseMoving(true);
    this.args.setActiveItem(this);
  }

  @action handleMouseleave() {
    this.args.setActiveItem(undefined);
  }

  registerItem = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerItem(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterItem(this);
      };
    },
    { eager: false }
  );

  click() {
    this.elem?.click();
  }

  get active() {
    return this.args.activeItem?.id === this.id;
  }
}
