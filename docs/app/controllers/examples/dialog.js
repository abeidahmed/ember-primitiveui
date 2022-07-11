import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ExamplesDialogController extends Controller {
  @tracked isOpen = false;

  @action open() {
    this.isOpen = true;
  }

  @action close() {
    this.isOpen = false;
  }
}
