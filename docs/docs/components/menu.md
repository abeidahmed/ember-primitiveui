# Menu

A menu is a widget that offers a list of choices to the user.

## Usage

Menu is built using the `Menu`, `menu.Button`, `menu.List`, and `menu.Item` components. Opening and closing of the list
is handled automatically.

```hbs
<Menu as |menu|>
  <menu.Button>Toggle menu</menu.Button>
  <menu.List>
    <menu.Item as |item|>
      Account settings {{if item.active "(active)"}}
    </menu.Item>

    <menu.Item @disabled={{true}} as |item|>
      Help {{if item.active "(active)"}}
    </menu.Item>

    <menu.Item as |item|>
      Guides {{if item.active "(active)"}}
    </menu.Item>
  </menu.List>
</Menu>
```

## Styling an active item

Each `menu.Item` yields an `active` getter which is `true` when the item is active, otherwise `false`.

```hbs
<menu.Item as |item|>
  <span class="w-full {{if item.active "text-gray-700" "text-gray-300"}}">
    Account
  </span>
</menu.Item>
```

## Disabling an item

Set ``@disabled={{true}}`` argument to the `menu.Item` component. This will make it unselectable via keyboard navigation,
and it will be skipped when pressing the up/down arrows.

```hbs
<menu.Item @disabled={{true}} as |item|>Account</menu.Item>
```

## Integrating with `LinkTo` component

Pass the `LinkTo` component to the `@as` argument and it will automatically redirect to the page and will also close the
menu.

```hbs
<menu.Item @as={{component "link-to" route="about" query=(...) model="..."}} as |item|>
  About page
</menu.Item>
```

## Positioning

Positioning functionality of the `menu.List` is not baked in, but you can use the `velcro` modifier to do so. Learn
how to use the modifier.

```hbs
<Menu as |menu|>
  <menu.Button>Toggle menu</menu.Button>
  <menu.List {{velcro (concat "#" menu.buttonId placement="bottom-end")}}>
    <menu.Item as |item|>
      Account settings
    </menu.Item>
  </menu.List>
</Menu>
```

## Focus management

When the menu is opened, `menu.List` will be focused and the focus will be trapped.

## Mouse interaction

- Opens/closes the menu when `menu.Button` is clicked.
- Closes the menu when clicked outside the `menu.List` when open.

## Keyboard interaction

| Command                                   | Description                                                      |
| ---                                       | ---                                                              |
| `Enter` when `menu.Button` is focused     | Opens the menu and activates the first non-disabled `menu.Item`. |
| `Space` when `menu.Button` is focused     | Opens the menu and activates the first non-disabled `menu.Item`  |
| `ArrowDown` when `menu.Button` is focused | Opens the menu and activates the first non-disabled `menu.Item`. |
| `ArrowUp` when `menu.Button` is focused   | Opens the menu and activates the last non-disabled `menu.Item`.  |
| `Esc`                                     | Closes the menu.                                                 |
| `ArrowDown` when menu is open             | Activates the next non-disabled `menu.Item`.                     |
| `ArrowUp` when menu is open               | Activates the previous non-disabled `menu.Item`.                 |

## Component API

### `Menu`

| Argument | Default | Description |
| ---      | ---     | ---         |
| `as`     | `div`   | `string`    |

| Yields     | Description                                        |
| ---        | ---                                                |
| `id`       | `string`. The `id` attribute of the `Menu`.        |
| `buttonId` | `string`. The `id` attribute of the `menu.Button`. |
| `listId`   | `string`. The `id` attribute of the `menu.List`.   |
| `open`     | `boolean`. Whether or not the popover is open.     |
| `close`    | `() => void`. A function to close the menu.        |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |

### `menu.Button`

| Argument | Default  | Description |
| ---      | ---      | ---         |
| `as`     | `button` | `string`    |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |

### `menu.List`

| Argument | Default | Description                                                          |
| ---      | ---     | ---                                                                  |
| `as`     | `div`   | `string`                                                             |
| `portal` | `true`  | `boolean`. Whether or not to render the `menu.List` inside a portal. |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `open`, `closed` |

### `menu.Item`

| Argument   | Default  | Description                                            |
| ---        | ---      | ---                                                    |
| `as`       | `button` | `string`, `typeof Component`                           |
| `disabled` | `false`  | `boolean`. Whether or not the `menu.Item` is disabled. |

| Yields   | Description                                                    |
| ---      | ---                                                            |
| `active` | `boolean`. Whether or not the `menu.Item` is currently active. |
| `id`     | `string`. The `id` attribute of the `menu.Item`.               |

| Data attribute | Values           |
| ---            | ---              |
| `data-state`   | `active`, `null` |
