import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { schedule } from '@ember/runloop';
import type TabItemComponent from './tab/item';

interface Args {
  as?: string | typeof Component;
  defaultControls?: string;
  isVertical?: boolean;
  onChange?: (panelId: string) => void;
}

export default class TabComponent extends Component<Args> {
  @tracked items: TabItemComponent[] = [];
  @tracked selectedItem: TabItemComponent | undefined;

  constructor(owner: unknown, args: Args) {
    super(owner, args);

    schedule('afterRender', () => this.selectInitialItem());
  }

  @action selectItemAndCommit(item: TabItemComponent) {
    this.selectedItem = item;

    const panelId = item.args.controls;
    this.args.onChange?.(panelId);
  }

  @action async registerItem(item: TabItemComponent) {
    const { items } = this;
    items.push(item);
    await Promise.resolve(() => (this.items = items));
  }

  @action async unregisterItem(item: TabItemComponent) {
    const { items } = this;
    const index = items.indexOf(item);
    items.splice(index, 1);
    await Promise.resolve(() => (this.items = items));
  }

  selectInitialItem() {
    const { defaultControls } = this.args;

    if (defaultControls) {
      const item = this.items.find(
        (item) => item.args.controls === defaultControls
      );
      this.selectedItem = item || this.items[0];
    } else {
      this.selectedItem = this.items[0];
    }
  }
}
