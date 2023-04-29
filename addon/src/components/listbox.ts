import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { move } from '../helpers/dom';
import type ListboxLabelComponent from './listbox/label';
import type ListboxOptionComponent from './listbox/option';
import type ListboxButtonComponent from './listbox/button';

export interface Value {
  id: unknown;
}

interface Args {
  readonly value: Value;
  onChange: (value: Value) => void;
}

export default class ListboxComponent extends Component<Args> {
  guid = `${guidFor(this)}-listbox`;
  labelId = `${this.guid}-label`;
  buttonId = `${this.guid}-button`;
  optionsId = `${this.guid}-options`;

  @tracked isOpen = false;
  @tracked label: ListboxLabelComponent | undefined;
  @tracked button: ListboxButtonComponent | undefined;
  @tracked options: ListboxOptionComponent[] = [];
  @tracked selectedOption: ListboxOptionComponent | undefined;
  @tracked activeOption: ListboxOptionComponent | undefined;
  @tracked isMouseMoving = false;

  @action toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
      next(() => {
        this.findSelectedOptionAndActivate(true);
      });
    }
  }

  @action open() {
    if (this.isOpen) return;

    this.isOpen = true;
  }

  @action close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.isMouseMoving = false;
    this.button?.focus();
  }

  @action onLabelClick(event: Event) {
    event.preventDefault();
    this.button?.focus();
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
            this.findSelectedOptionAndActivate(true);
          });
        } else if (this.activeOption) {
          event.preventDefault();
          this.activeOption.click();
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          event.stopPropagation();
          this.close();
        }
        break;
      case 'ArrowDown':
        if (buttonIsFocused && !this.isOpen) {
          event.preventDefault();
          this.open();
          next(() => {
            this.findSelectedOptionAndActivate(true);
          });
        } else {
          event.preventDefault();
          this.setActiveOptionAndScroll(
            move(this.enabledOptions, this.activeOption, 1)
          );
        }
        break;
      case 'ArrowUp':
        if (buttonIsFocused && !this.isOpen) {
          event.preventDefault();
          this.open();
          next(() => {
            this.findSelectedOptionAndActivate(false);
          });
        } else {
          event.preventDefault();
          this.setActiveOptionAndScroll(
            move(this.enabledOptions, this.activeOption, -1)
          );
        }
        break;
      default:
        break;
    }
  }

  @action selectOptionAndCommit(option: ListboxOptionComponent) {
    this.selectedOption = option;
    this.args.onChange(option.args.value); // Send back the value to the user
    this.close();
  }

  @action activateOption(option: ListboxOptionComponent) {
    this.activeOption = option;
  }

  @action setMouseMoving(value: boolean) {
    this.isMouseMoving = value;
  }

  @action registerLabel(label: ListboxLabelComponent) {
    this.label = label;
  }

  @action unregisterLabel() {
    this.label = undefined;
  }

  @action registerButton(button: ListboxButtonComponent) {
    this.button = button;
  }

  @action unregisterButton() {
    this.button = undefined;
  }

  @action async registerOption(option: ListboxOptionComponent) {
    const { options } = this;
    options.push(option);
    await Promise.resolve(() => (this.options = options));
  }

  @action async unregisterOption(option: ListboxOptionComponent) {
    const { options } = this;
    const index = options.indexOf(option);
    options.splice(index, 1);
    await Promise.resolve(() => (this.options = options));
  }

  findSelectedOptionAndActivate(first: boolean) {
    const option = this.options.find(
      (option) => option.args.value.id === this.args.value.id
    );
    this.selectedOption = option;
    this.setActiveOptionAndScroll(
      option || this.options[first ? 0 : this.options.length - 1]
    );
  }

  setActiveOptionAndScroll(option: ListboxOptionComponent) {
    this.activeOption = option;
    option.elem?.scrollIntoView({ block: 'nearest' });
  }

  get enabledOptions() {
    return this.options.filter((option) => !option.disabled);
  }
}
