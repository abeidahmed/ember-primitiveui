import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { isTabbable } from 'tabbable';
import type PopoverButtonComponent from './popover/button';
import type PopoverPanelComponent from './popover/panel';

export default class PopoverComponent extends Component {
  id = `${guidFor(this)}-popover`;
  buttonId = `${this.id}-button`;
  panelId = `${this.id}-panel`;

  @tracked isOpen = false;
  @tracked button?: PopoverButtonComponent;
  @tracked panel?: PopoverPanelComponent;

  @action toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @action open() {
    if (this.isOpen) return;
    this.isOpen = true;
  }

  @action close() {
    if (!this.isOpen) return;
    this.isOpen = false;
  }

  @action handleOutsideClick(event: Event, target: HTMLElement) {
    this.close();
    // Prevent dialogs from being closed accidentally.
    if (!isTabbable(target)) {
      event.preventDefault();
    }
  }

  @action registerButton(button: PopoverButtonComponent) {
    this.button = button;
  }

  @action unregisterButton() {
    this.button = undefined;
  }

  @action registerPanel(panel: PopoverPanelComponent) {
    this.panel = panel;
  }

  @action unregisterPanel() {
    this.panel = undefined;
  }
}
