import { modifier } from 'ember-modifier';
import { tabbable } from 'tabbable';
import { move } from '../helpers/dom';

interface Signature {
  Element: HTMLElement;
}

const elements: HTMLElement[] = [];

export default modifier<Signature>(
  (element) => {
    const focusedElementBeforeActivation = document.activeElement as HTMLElement | null;
    let recentlyFocused: HTMLElement | undefined = undefined;

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;

      event.preventDefault();

      const scopedTabbableElements = Array.from(tabbable(element)) as HTMLElement[];
      const activeElement = element.contains(document.activeElement) ? (document.activeElement as HTMLElement) : null;
      const updatedActiveElement = move(scopedTabbableElements, activeElement, event.shiftKey ? -1 : 1);
      tryFocus(updatedActiveElement);
    }

    function handleFocusin(event: Event) {
      const target = (event.composedPath?.()?.[0] || event.target) as HTMLElement;

      for (const element of elements) {
        if (element.contains(target)) {
          recentlyFocused = target;
          return;
        }
      }

      tryFocus(recentlyFocused || element);
    }

    function tryFocus(item?: HTMLElement | null) {
      if (!item) {
        tryFocus(element);
        return;
      }

      if (item === document.activeElement) return;

      item.focus({ preventScroll: true });
      recentlyFocused = item;
    }

    function deactivateElement(element: HTMLElement) {
      const index = elements.indexOf(element);
      if (index === -1) return;
      elements.splice(index, 1);
      tryFocus(focusedElementBeforeActivation);
    }

    elements.push(element);
    const initialFocus = element.querySelector<HTMLElement>('[data-autofocus]') || element;
    tryFocus(initialFocus);

    element.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('focusin', handleFocusin, true);

    return () => {
      deactivateElement(element);
      element.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('focusin', handleFocusin, true);
    };
  },
  { eager: false }
);
