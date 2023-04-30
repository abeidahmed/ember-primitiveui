import { action } from '@ember/object';
import Component from '@glimmer/component';
import { move } from '../../helpers/dom';
import TabItemComponent from './item';

interface Args {
  as?: string | typeof Component;
  vertical?: boolean;
  items: TabItemComponent[];
  selectedItem: TabItemComponent | undefined;
  selectItemAndCommit: (item: TabItemComponent) => void;
}

export default class TabListComponent extends Component<Args> {
  @action onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        {
          if (this.args.vertical && event.key === 'ArrowLeft') break;
          if (!this.args.vertical && event.key === 'ArrowUp') break;

          event.preventDefault();
          const nextItem = move(this.enabledItems, this.args.selectedItem, -1);
          this.selectAndFocus(nextItem);
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        {
          if (this.args.vertical && event.key === 'ArrowRight') break;
          if (!this.args.vertical && event.key === 'ArrowDown') break;

          event.preventDefault();
          const nextItem = move(this.enabledItems, this.args.selectedItem, 1);
          this.selectAndFocus(nextItem);
        }
        break;
      case 'Home':
        {
          event.preventDefault();
          const firstItem = this.enabledItems[0];
          this.selectAndFocus(firstItem);
        }
        break;
      case 'End':
        {
          event.preventDefault();
          const lastItem = this.enabledItems[this.enabledItems.length - 1];
          this.selectAndFocus(lastItem);
        }
        break;
      default:
        break;
    }
  }

  selectAndFocus(item: TabItemComponent) {
    this.args.selectItemAndCommit(item);
    item.focus();
  }

  get enabledItems() {
    return this.args.items.filter((item) => !item.elem?.hasAttribute('disabled'));
  }
}
