# Dialog

A dialog is a window overlaid on either the primary window or another dialog window. Dialogs are inert and hence, the
users cannot interact with content outside an active dialog.

## Usage

Dialogs are built using the `Dialog`, `dialog.Title`, and `dialog.Panel` components.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyDialogComponent extends Component {
  @tracked isOpen = true;

  @action open() {
    this.isOpen = true;
  }

  @action close() {
    this.isOpen = false;
  }
}
```

```hbs
<button type="button" {{on "click" this.open}}>Open dialog</button>
{{#if this.isOpen}}
  <Dialog @onClose={{this.close}} as |dialog|>
    <dialog.Panel>
      <dialog.Title>Activate your account</dialog.Title>
      <p>All your data will be restored.</p>
    </dialog.Panel>
  </Dialog>
{{/if}}
```

> If you use the `dialog.Title` component, we will automatically set the `aria-labelledby` attribute on the `Dialog` component.

When a dialog is open, scroll is locked.

## Focus management

When the dialog is opened, `dialog.Panel` will be focused and the focus will be trapped. If you want to customize the
first focusable element, set `data-autofocus` on an element.

Pressing `Tab` will cycle through all the focusable elements.

```diff
<Dialog @onClose={{this.close}} as |dialog|>
  <dialog.Panel>
    <dialog.Title>Activate your account</dialog.Title>
    <p>All your data will be restored.</p>
+   <button type="button" data-autofocus>Button</button>
  </dialog.Panel>
</Dialog>
```

## Mouse interaction

- Closes the dialog when clicked outside the `dialog.Panel` when open.

## Keyboard interaction

| Command     | Description                                 |
| ---         | ---                                         |
| `Esc`       | Closes the dialog.                          |
| `Tab`       | Cycle through focusable elements.           |
| `Shift+Tab` | Cycle backwards through focusable elements. |

## Component API

### `Dialog`

| Argument  | Default | Description                                                                |
| ---       | ---     | ---                                                                        |
| `as`      | `div`   | `string`                                                                   |
| `onClose` | -       | `() => void`. A function that will be called when the dialog is dismissed. |

### `dialog.Panel`

| Argument | Default | Description |
| ---      | ---     | ---         |
| `as`     | `div`   | `string`    |

### `dialog.Title`

| Argument | Default | Description |
| ---      | ---     | ---         |
| `as`     | `h2`    | `string`    |
