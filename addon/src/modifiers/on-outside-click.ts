import Modifier, { ArgsFor } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

type Boundary = HTMLElement | null;
type Callback = (event: MouseEvent | PointerEvent | Event, target: HTMLElement) => void;

interface Signature {
  Element: HTMLElement;
  Args: {
    Named: {
      boundaries: Boundary[] | (() => Boundary[]);
      enabled?: boolean;
    };
    Positional: [callback: Callback];
  };
}

export default class OnOutsideClickModifier extends Modifier {
  initialClickTarget?: HTMLElement;
  boundaries!: Boundary | Boundary[] | (() => Boundary[]);
  callback?: Callback;
  enabled = true;

  constructor(owner: unknown, args: ArgsFor<Signature>) {
    // @ts-expect-error No types
    super(owner, args);
    this.onMousedown = this.onMousedown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  // @ts-expect-error Not sure what's going on here
  modify(
    element: Signature['Element'],
    [callback]: [Callback],
    { boundaries, enabled = true }: { boundaries?: Boundary[] | (() => Boundary[]); enabled?: boolean } = {}
  ) {
    this.boundaries = boundaries || element;
    this.callback = callback;
    this.enabled = enabled;

    document.addEventListener('mousedown', this.onMousedown, true);
    document.addEventListener('click', this.onClick, true);
    registerDestructor(this, this.cleanup.bind(this));
  }

  cleanup() {
    this.initialClickTarget = undefined;
    this.boundaries = null;
    this.callback = undefined;
    this.enabled = true;

    document.removeEventListener('mousedown', this.onMousedown, true);
    document.removeEventListener('click', this.onClick, true);
  }

  onMousedown(event: Event) {
    if (this.enabled) {
      this.initialClickTarget = (event.composedPath?.()?.[0] || event.target) as HTMLElement;
    }
  }

  onClick(event: Event) {
    if (!this.initialClickTarget) return;

    this.handleOutsideClick(event, () => {
      return this.initialClickTarget as HTMLElement;
    });

    this.initialClickTarget = undefined;
  }

  handleOutsideClick<E extends MouseEvent | PointerEvent | Event>(
    event: E,
    resolveTarget: (event: E) => HTMLElement | null
  ) {
    if (!this.enabled) return;
    if (event.defaultPrevented) return;

    const _boundaries = (function resolve(boundaries): Boundary[] {
      if (typeof boundaries === 'function') {
        return resolve(boundaries());
      }

      if (Array.isArray(boundaries)) return boundaries;

      return [boundaries];
    })(this.boundaries);

    const target = resolveTarget(event);
    if (!target) return;

    if (!target.getRootNode().contains(target)) return;

    for (const boundary of _boundaries) {
      if (!boundary) continue;
      if (boundary.contains(target)) return;
      if (event.composed && event.composedPath().includes(boundary)) return;
    }

    this.callback?.(event, target);
  }
}
