import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Combobox extends Component {
  @tracked isShowing = true;
}
