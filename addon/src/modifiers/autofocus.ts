import { modifier } from 'ember-modifier';

export default modifier(
  (element: HTMLElement) => {
    element.focus();
  },
  { eager: false }
);
