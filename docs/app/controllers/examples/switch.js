import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ExamplesSwitchController extends Controller {
  @tracked isChecked = false;

  @action onChange(value) {
    this.isChecked = value;
  }
}
