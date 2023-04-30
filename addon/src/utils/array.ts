/**
 * @description Cycle forwards/backwards through a list of items
 * @example
 * const elements = ['pen', 'pencil', 'chalk']
 * cycle(elements, 'pencil', 1)
 * //=> 'chalk'
 * cycle(elements, 'chalk', -1)
 * //=> 'pencil'
 * cycle(elements, 'chalk', 1)
 * //=> 'pen'
 */
export function cycle<T>(items: T[], item: T, index: 1 | -1): T {
  let activeIndex = items.indexOf(item);

  if (activeIndex === items.length - 1 && index === 1) {
    activeIndex = -1;
  }

  let indexOfItem = index === 1 ? 0 : items.length - 1;
  if (item && activeIndex >= 0) {
    const newIndex = activeIndex + index;
    if (newIndex >= 0 && newIndex < items.length) {
      indexOfItem = newIndex;
    }
  }

  return items[indexOfItem];
}
