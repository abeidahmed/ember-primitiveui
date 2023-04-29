import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type DialogTitleComponent from './dialog/title';
import type DialogDescriptionComponent from './dialog/description';
import type DialogPanelComponent from './dialog/panel';

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
  @tracked panel?: DialogPanelComponent;

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

  @action registerPanel(panel: DialogPanelComponent) {
    this.panel = panel;
  }

  @action unregisterPanel() {
    this.panel = undefined;
  }

  @action rootBoundaries() {
    const boundaries = Array.from(
      document.querySelectorAll('html > *, body > *, [data-pui-portal] > *') ??
        []
    ).filter((boundary) => {
      if (boundary === document.body) return false;
      if (boundary === document.head) return false;
      if (!(boundary instanceof HTMLElement)) return false;
      if (this.panel?.elem && boundary.contains(this.panel.elem)) return false;
      return true;
    });

    return [...boundaries, this.panel?.elem];
  }
}
