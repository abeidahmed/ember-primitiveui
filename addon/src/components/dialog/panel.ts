import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Args {
  onClose: () => void;
}

export default class DialogPanelComponent extends Component<Args> {
  @action closeDialog() {
    this.args.onClose();
    return true;
  }
}
