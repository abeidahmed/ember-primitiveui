# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `data-*` attribute to `Menu` component (`data-state="open"`, `data-state="active"`, etc).

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

[unreleased]: https://github.com/abeidahmed/ember-primitiveui/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/abeidahmed/ember-primitiveui/releases/tag/v0.2.0
