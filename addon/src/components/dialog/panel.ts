import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

interface Args {
  onClose: () => void;
  registerPanel: (panel: DialogPanelComponent) => void;
  unregisterPanel: () => void;
}

export default class DialogPanelComponent extends Component<Args> {
  elem?: HTMLElement;

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
