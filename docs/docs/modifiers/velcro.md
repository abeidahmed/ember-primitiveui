# velcro

This modifier is a wrapper around [floating-ui](https://floating-ui.com/) which lets you anchor a floating element next
to another element while making sure it stays in view by avoiding collisions.

## Usage

Add the `velcro` modifier and pass in the reference of the anchor element.

```hbs
<div>
  <button type="button" id="button">Button</button>
  <div {{velcro "#button"}}>
    Floating menu
  </div>
</div>
```

## Examples

### Same width as reference element

When you are building a select menu, you may want the listbox to have the same width as the reference element. In that
case, you can pass `sync="width"` to the modifier.

```diff
<div>
  <button type="button" id="button">Button</button>
+ <div {{velcro "#button" sync="width"}}>
    Floating menu
  </div>
</div>
```

## Modifier API

| Positional  | Default | Description                                     |
| ---         | ---     | ---                                             |
| `reference` | -       | `string`, `HTMLElement`. The reference element. |


| Named argument  | Default        | Description                                                                                       |
| ---             | ---            | ---                                                                                               |
| `placement`     | `bottom-start` | `string`. [See docs](https://floating-ui.com/docs/tutorial#placements).                           |
| `strategy`      | `absolute`     | `absolute`, `fixed`. [See docs](https://floating-ui.com/docs/computeposition#strategy).           |
| `offsetOptions` | `0`            | `Offset`. [See docs](https://floating-ui.com/docs/offset#options).                                |
| `flipOptions`   | -              | `Flip`. [See docs](https://floating-ui.com/docs/flip#options).                                    |
| `shiftOptions`  | -              | `Shift`. [See docs](https://floating-ui.com/docs/shift#options).                                  |
| `sync`          | -              | `height`, `width`, `both`. Make dimensions of the floating element same as the reference element. |
| `middleware`    | `[]`           | `Middleware[]`. [See docs](https://floating-ui.com/docs/middleware)                               |
