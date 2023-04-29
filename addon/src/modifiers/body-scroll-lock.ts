import { modifier } from 'ember-modifier';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import type { BodyScrollOptions } from 'body-scroll-lock';

interface Signature {
  Element: HTMLElement;
  Args: {
    Named: BodyScrollOptions;
  };
}

export default modifier<Signature>(
  (element, _positional, options) => {
    disableBodyScroll(element, options);

    return () => {
      enableBodyScroll(element);
    };
  },
  { eager: false }
);
