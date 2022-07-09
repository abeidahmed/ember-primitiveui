import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MySwitchComponent extends Component {
  @tracked isChecked = false;

  @action onChange(value) {
    console.log(value);
    this.isChecked = value;
  }
}
