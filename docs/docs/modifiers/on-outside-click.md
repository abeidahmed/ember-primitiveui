# on-outside-click

This modifier allows you to detect clicks outside of a specified boundary.

## Usage

```hbs
<div {{on-outside-click this.close}}>
  <button type="button">Button</button>
</div>
```

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked isOpen = true;

  @action close() {
    this.isOpen = false;
  }
}
```

## Specifying a boundary manually

Pass in an array of elements to the modifier. Clicking on these elements will not trigger the callback even if the
element is outside the DOM node.

```hbs
<div {{on-outside-click this.close boundaries=this.boundaries}}>
  <button type="button">Button</button>
</div>
```

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked isOpen = true;

  @action close() {
    this.isOpen = false;
  }

  get boundaries() {
    return Array.from(document.querySelectorAll('.menu'));
  }
}
```

## Enable the modifier manually

If building a pop-up menu, it might be a good idea to start listening for outside clicks only if the menu is open. In
that case, you can pass a `boolean` property to the `enabled` named argument.

```hbs
<div {{on-outside-click this.close enabled=this.isOpen}}>
  <button type="button">Button</button>
</div>
```

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @tracked isOpen = true;

  @action close() {
    this.isOpen = false;
  }
}
```

## Modifier API

| Positional     | Default | Description                                                                 |
| ---            | ---     | ---                                                                         |
| `callback`     | -       | `(event: MouseEvent \| PointerEvent \| Event, target: HTMLElement) => void`. Function that will be called when the modifier detects a click outside the boundary. |

| Named argument | Default   | Description                                                                    |
| ---            | ---       | ---                                                                            |
| `boundaries`   | `element` | `HTMLElement[]`, `() => HTMLElement[]`. Detect click outside of this boundary. |
| `enabled`      | `true`    | `boolean`. Whether or not to start listening for clicks.                       |
