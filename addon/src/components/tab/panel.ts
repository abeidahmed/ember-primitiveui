import Component from '@glimmer/component';
import type TabItemComponent from './item';

interface Args {
  as?: string | typeof Component;
  id: string;
  selectedItem: TabItemComponent | undefined;
}

export default class TabPanelComponent extends Component<Args> {
  get selected() {
    return this.args.selectedItem?.args.controls === this.args.id;
  }
}
