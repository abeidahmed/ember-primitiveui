import { modifier } from 'ember-modifier';

interface Signature {
  Element: HTMLElement;
  Args: {
    Positional: [string, (event: Event) => void];
  };
}

export default modifier<Signature>(
  (element, [eventName, handler]) => {
    const refEvent = new Event('clickReference');
    const handlers: Array<[string, (event: Event) => void]> = [];
    const events = makeEvents(eventName);

    events.forEach((eventName) => {
      const onOutsideInteraction = (event: Event) => {
        if (refEvent.timeStamp > event.timeStamp) return;

        const { target } = event;
        if (!(target instanceof HTMLElement)) return;

        const clickedOutside = target !== element && !element.contains(target);
        if (!clickedOutside) return;

        handler(event);
      };

      handlers.push([eventName, onOutsideInteraction]);
      document.documentElement.addEventListener(
        eventName,
        onOutsideInteraction
      );
    });

    return () => {
      handlers.forEach(([event, handler]) => {
        document.documentElement.removeEventListener(event, handler);
      });
    };
  },
  { eager: false }
);

function makeEvents(events: string[] | string) {
  if (Array.isArray(events)) {
    return events;
  }

  return [events];
}
