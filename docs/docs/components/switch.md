# Switch

A switch is an input widget that allows users to choose one of two values: "on" or "off".

## Usage

Switches are built using the `Switch`, `switch.Button`, and `switch.Label` components. Toggling the switch calls the
`onChange` function with a negated version of the checked value.

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MySwitchComponent extends Component {
  @tracked checked = false;

  @action onChange(value) {
    this.checked = value;
  }
}
```

```hbs
<Switch @checked={{this.checked}} @onChange={{this.onChange}} as |switch|>
  <switch.Label>Enable notifications</switch.Label>
  <switch.Button>
    <span>{{!-- more --}}</span>
  </switch.Button>
</Switch>
```

By default, clicking the `switch.Label` will toggle the Switch, just like the labels in native HTML checkboxes do. If
you'd like to change this behavior, pass `@passive={{true}}` to the `switch.Label` as an argument.

```diff
- <switch.Label>Enable notifications</switch.Label>
+ <switch.Label @passive={{true}}>Enable notifications</switch.Label>
```

## Keyboard interactions

| Command | Description                            |
| ---     | ----                                   |
| `Space` | Toggles the switch when it is focused. |
| `Enter` | Submits the parent form if present.    |

## Component API

### Switch

| Argument   | Default | Description                                                                  |
| ---        | ----    | ----                                                                         |
| `as`       | `div`   | `string`                                                                     |
| `checked`  | -       | `boolean`. Whether or not the switch is checked.                             |
| `onChange` | -       | `(value: boolean) => void`. The function to call when the switch is toggled. |

### switch.Label

| Argument  | Default | Description                                                         |
| ---       | ----    | ----                                                                |
| `as`      | `label` | `string`                                                            |
| `passive` | `false` | `boolean`. When true, clicking the label won't toggle the `Switch`. |

### switch.Button

| Argument | Default  | Description |
| ---      | ----     | ----        |
| `as`     | `button` | `string`    |
