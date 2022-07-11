import { modifier } from 'ember-modifier';
import { createFocusTrap, Options } from 'focus-trap';

export default modifier(
  (element: HTMLElement, _params, { options }: { options: Options }) => {
    const trap = createFocusTrap(element, options);
    trap.activate();

    return () => {
      trap.deactivate();
    };
  },
  { eager: false }
);
