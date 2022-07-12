import { action } from '@ember/object';
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { Value } from '../listbox';

interface Args {
  value: Value;
  selectedOption: ListboxOptionComponent | undefined;
  activeOption: ListboxOptionComponent | undefined;
  registerOption: (option: ListboxOptionComponent) => void;
  unregisterOption: (option: ListboxOptionComponent) => void;
  selectOptionAndCommit: (option: ListboxOptionComponent) => void;
  activateOption: (option: ListboxOptionComponent) => void;
  isMouseMoving: boolean;
  setMouseMoving: (value: boolean) => void;
}

export default class ListboxOptionComponent extends Component<Args> {
  elem: HTMLElement | undefined;

  registerOption = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerOption(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterOption(this);
      };
    },
    { eager: false }
  );

  @action onClick(event: Event) {
    event.preventDefault();
    if (this.disabled) return;

    this.args.selectOptionAndCommit(this);
  }

  @action onMouseover() {
    if (!this.args.isMouseMoving) return;
    if (this.disabled) return;

    this.args.activateOption(this);
  }

  @action onMousemove() {
    if (this.args.isMouseMoving) return;
    if (this.disabled) return;

    this.args.setMouseMoving(true);
    this.args.activateOption(this);
  }

  click() {
    this.elem?.click();
  }

  get isSelected() {
    return this.args.selectedOption === this;
  }

  get isActive() {
    return this.args.activeOption === this;
  }

  get disabled() {
    return this.elem?.hasAttribute('disabled');
  }

  get ariaSelected() {
    if (this.disabled) return undefined;

    return !!this.isSelected;
  }
}
