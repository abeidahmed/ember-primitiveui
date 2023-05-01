import { action } from '@ember/object';
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  portal?: boolean;
  isOpen: boolean;
  panelId: string;
  close: () => void;
  registerPanel: (panel: PopoverPanelComponent) => void;
  unregisterPanel: () => void;
}

export default class PopoverPanelComponent extends Component<Args> {
  elem?: HTMLElement;

  @action handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    event.stopPropagation();
    this.args.close();
  }

  registerPanel = modifier<{ Element: HTMLElement }>(
    (element) => {
      this.elem = element;
      this.args.registerPanel(this);

      return () => {
        this.elem = undefined;
        this.args.unregisterPanel();
      };
    },
    { eager: false }
  );
}
