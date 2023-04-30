import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { portalId } from '../../utils/portal';

interface Args {
  onClose: () => void;
}

export default class DialogPanelComponent extends Component<Args> {
  elem?: HTMLElement;

  registerPanel = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;

      return () => {
        this.elem = undefined;
      };
    },
    { eager: false }
  );

  @action handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();
    this.args.onClose();
  }

  @action rootBoundaries() {
    const boundaries = Array.from(
      document.querySelectorAll(`html > *, body > *, ${portalId(this)} > *`) ??
        []
    ).filter((boundary) => {
      if (boundary === document.body) return false;
      if (boundary === document.head) return false;
      if (!(boundary instanceof HTMLElement)) return false;
      if (this.elem && boundary.contains(this.elem)) return false;
      return true;
    });

    return [...boundaries, this.elem];
  }
}
