import Component from '@glimmer/component';
import { getOwner } from '@ember/application';
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

  @tracked title: DialogTitleComponent | undefined;
  @tracked description: DialogDescriptionComponent | undefined;

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

  get portalRoot() {
    const {
      APP: { rootElement },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = (getOwner(this) as any).resolveRegistration('config:environment');
    return rootElement ? document.querySelector(rootElement) : document.body;
  }
}
