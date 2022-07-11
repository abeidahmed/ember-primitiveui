import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

interface Args {
  as?: string | typeof Component;
  controls: string;
  selectedItem: TabItemComponent | undefined;
  registerItem: (item: TabItemComponent) => void;
  unregisterItem: (item: TabItemComponent) => void;
  selectItemAndCommit: (item: TabItemComponent) => void;
}

export default class TabItemComponent extends Component<Args> {
  id = `${guidFor(this)}-tab-item`;
  elem: HTMLElement | undefined;

  registerItem = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerItem(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterItem(this);
      };
    },
    { eager: false }
  );

  @action onClick(event: Event) {
    event.preventDefault();

    this.args.selectItemAndCommit(this);
  }

  focus() {
    this.elem?.focus();
  }

  get isSelected() {
    return this.args.selectedItem?.id === this.id;
  }
}
