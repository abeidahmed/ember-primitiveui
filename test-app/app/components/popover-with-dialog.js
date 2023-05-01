import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PopoverWithDialogComponent extends Component {
  @tracked isOpen = false;

  @action openDialog() {
    if (this.isOpen) return;
    this.isOpen = true;
  }

  @action closeDialog() {
    if (!this.isOpen) return;
    this.isOpen = false;
  }
}
