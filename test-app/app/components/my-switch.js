import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MySwitchComponent extends Component {
  @tracked checked = false;

  @action onChange(value) {
    console.log(value);
    this.checked = value;
  }
}
