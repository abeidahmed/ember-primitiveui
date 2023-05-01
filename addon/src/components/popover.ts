import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class PopoverComponent extends Component {
  id = `${guidFor(this)}-popover`;
  buttonId = `${this.id}-button`;
  panelId = `${this.id}-panel`;

  @tracked isOpen = false;

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
}
