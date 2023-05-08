# focus-trap

A modifier that lets your trap focus within a DOM node so that when a user hits `Tab` or `Shift+Tab`, the focus cannot
escape from the containing element.

## Usage

```hbs
<div tabindex="-1" {{focus-trap}}>
  <button type="button">Button</button>
</div>
```

By default, the first focusable element will be the element that you use the `focus-trap` modifier on. Hence it needs to
have a `tabindex` attribute set to either of `0` or `1` if it's a non-focusable element.

If you want to customize the first focusable element, set `data-autofocus` on an element.

```diff
<div tabindex="-1" {{focus-trap}}>
+ <button type="button" data-autofocus>Button</button>
</div>
```
