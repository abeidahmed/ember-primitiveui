import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyDialogComponent extends Component {
  @tracked isOpen = false;

  @action open() {
    this.isOpen = true;
  }

  @action close() {
    this.isOpen = false;
  }
}
