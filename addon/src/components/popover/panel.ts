import { action } from '@ember/object';
import Component from '@glimmer/component';

interface Args {
  portal?: boolean;
  isOpen: boolean;
  panelId: string;
  close: () => void;
}

export default class PopoverPanelComponent extends Component<Args> {
  @action handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();
    this.args.close();
  }
}
