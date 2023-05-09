import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type DialogTitleComponent from './dialog/title';

interface Args {
  onClose: () => void;
}

export default class DialogComponent extends Component<Args> {
  guid = `${guidFor(this)}-dialog`;
  panelId = `${this.guid}-panel`;
  titleId = `${this.guid}-title`;

  @tracked title?: DialogTitleComponent;

  @action registerTitle(title: DialogTitleComponent) {
    this.title = title;
  }

  @action unregisterTitle() {
    this.title = undefined;
  }

  @action handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();
    this.args.onClose();
  }
}
