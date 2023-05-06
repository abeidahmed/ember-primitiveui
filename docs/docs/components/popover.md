# Popover

A popover is a pop-up box that appears when a user clicks on an element and can contain rich contents.

## Usage

Popovers are built using the `Popover`, `popover.Button`, and `popover.Panel` components. Opening and closing the
`popover.Panel` is handled automatically.

```hbs
<Popover as |popover|>
  <popover.Button>Toggle popover</popover.Button>
  <popover.Panel>
    Popover contents!
  </popover.Panel>
</Popover>
```

## Positioning

Positioning functionality of the `popover.Panel` is not baked in, but you can use the `velcro` modifier to do so. Learn
how to use the modifier.

```hbs
<Popover as |popover|>
  <popover.Button>Toggle popover</popover.Button>
  <popover.Panel {{velcro (concat "#" popover.buttonId) placement="bottom"}}>
    Popover contents!
  </popover.Panel>
</Popover>
```

## Focus management

When the panel is opened, `popover.Panel` will be focused and the focus will be trapped. If you want to customize the
first focusable element, set `data-autofocus` on an element.

Pressing `Tab` will cycle through all the focusable elements.

```hbs
<Popover as |popover|>
  <popover.Button>Toggle popover</popover.Button>
  <popover.Panel>
    <button type="button" data-autofocus>Button</button>
  </popover.Panel>
</Popover>
```

## Mouse interaction

- Opens/closes the panel when `popover.Button` is clicked.
- Closes the panel when clicked outside the `popover.Panel` when open.

## Keyboard interaction

| Command         | Description                                          |
| ---             | ---                                                  |
| `Esc`           | Closes the popover.                                  |
| `Enter` `Space` | When focused on `popover.Button`, opens the popover. |
| `Tab`           | Cycle through focusable elements.                    |
| `Shift+Tab`     | Cycle backwards through focusable elements.          |

## Component API

### `Popover`

| Argument | Default | Description |
| ---      | ---     | ---         |
| `as`     | `div`   | `string`    |

| Yields     | Description                                           |
| ---        | ---                                                   |
| `id`       | `string`. The `id` attribute of the `popover`.        |
| `buttonId` | `string`. The `id` attribute of the `popover.Button`. |
| `panelId`  | `string`. The `id` attribute of the `popover.Panel`.  |
| `open`     | `boolean`. Whether or not the popover is open.        |
| `close`    | `() => void`. A function to close the popover.        |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |

### `popover.Button`

| Argument | Default  | Description |
| ---      | ---      | ---         |
| `as`     | `button` | `string`    |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |

### `popover.Panel`

| Argument | Default | Description                                                           |
| ---      | ---     | ---                                                                   |
| `as`     | `div`   | `string`                                                              |
| `portal` | `true`  | `boolean`. Whether or not to render the `menu.Panel` inside a portal. |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |
