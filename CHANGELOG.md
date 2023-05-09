# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add `Separator` component.
- Menu component yields `Separator` component.

### Fixed
- Move `aria-modal`, `role`, and `aria-labelledby` property to `dialog.Panel` component.
- Make `data-placement` reactive.

### Removed
- `Dialog` no longer accepts the `@open` argument.

## [0.3.0] - 2023-05-08

### Added
- `data-*` attribute to `Menu` component (`data-state="open"`, `data-state="active"`, etc).
- `Popover` component.
- `Menu` component yields `id`, `buttonId`, `listId`, `itemId`, `close`, `open` properties.
- Set `data-placement` on velcro element.

### Removed
- Boilerplate setup for `Portal` component.

## [0.2.0] - 2023-04-30

### Added
- `Portal` component.
- `body-scroll-lock`, `focus-trap`, `on-outside-click`, and `velcro` modifier.

### Fixed
- `Dialog` does not close on clicking outside when a `Menu` is open (yet).

### Changed
- `Menu` is appended to the `body` using `in-element` helper.

### Removed
- Removed `Listbox` component.
- Removed `Tabs` component.

[unreleased]: https://github.com/abeidahmed/ember-primitiveui/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/abeidahmed/ember-primitiveui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/abeidahmed/ember-primitiveui/releases/tag/v0.2.0
