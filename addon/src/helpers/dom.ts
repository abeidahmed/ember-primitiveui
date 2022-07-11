/**
 * @description Cycle through a list of items
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function move(items: any[], item: any, index: 1 | -1) {
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
