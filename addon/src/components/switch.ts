import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import type Label from './switch/label';
import type Button from './switch/button';

interface Args {
  onChange?: (value: boolean) => void;
  checked?: boolean;
}

export default class SwitchComponent extends Component<Args> {
  guid = `${guidFor(this)}-switch`;
  labelId = `${this.guid}-label`;
  buttonId = `${this.guid}-button`;

  @tracked label: Label | undefined;
  @tracked button: Button | undefined;

  @action onLabelClick() {
    if (!this.button) return;
    if (this.label && this.label.args.passive) return;

    this.button.focus();
    this.button.click();
  }

  @action onButtonClick(event: Event) {
    event.preventDefault();
    this.toggle();
  }

  @action onKeyup(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Enter') {
      attemptFormSubmission(event.currentTarget as HTMLElement);
    }
  }

  // Cancel the click event when `Enter` key is used on a button
  @action onKeypress(event: KeyboardEvent) {
    event.preventDefault();
  }

  @action registerLabel(label: Label) {
    this.label = label;
  }

  @action unregisterLabel() {
    this.label = undefined;
  }

  @action registerButton(button: Button) {
    this.button = button;
  }

  @action unregisterButton() {
    this.button = undefined;
  }

  toggle() {
    this.args.onChange?.(!this.args.checked);
  }
}

function attemptFormSubmission(element: HTMLElement) {
  const form = element.closest('form');
  if (!(form instanceof HTMLFormElement)) return;

  form.requestSubmit();
}
