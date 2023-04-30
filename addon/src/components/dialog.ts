import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type DialogTitleComponent from './dialog/title';
import type DialogDescriptionComponent from './dialog/description';

interface Args {
  open: boolean;
  onClose: () => void;
}

export default class DialogComponent extends Component<Args> {
  guid = `${guidFor(this)}-dialog`;
  panelId = `${this.guid}-panel`;
  titleId = `${this.guid}-title`;
  descriptionId = `${this.guid}-description`;

  @tracked title?: DialogTitleComponent;
  @tracked description?: DialogDescriptionComponent;

  @action registerTitle(title: DialogTitleComponent) {
    this.title = title;
  }

  @action unregisterTitle() {
    this.title = undefined;
  }

  @action registerDescription(description: DialogDescriptionComponent) {
    this.description = description;
  }

  @action unregisterDescription() {
    this.description = undefined;
  }
}
