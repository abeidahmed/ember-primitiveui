import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import type { FlipOptions, Middleware, OffsetOptions, Placement, ShiftOptions, Strategy } from '@floating-ui/dom';

interface Signature {
  Element: HTMLElement;
  Args: {
    Positional: [anchor: string | HTMLElement];
    Named: {
      middleware?: Middleware;
      offsetOptions?: OffsetOptions;
      placement?: Placement;
      flipOptions?: FlipOptions;
      shiftOptions?: ShiftOptions;
      strategy?: Strategy;
      sync?: 'height' | 'width' | 'both';
    };
  };
}

export default class VelcroModifier extends Modifier<Signature> {
  anchorElement?: HTMLElement | null;
  popupElement!: HTMLElement;
  cleanup?: ReturnType<typeof autoUpdate>;
  options: Signature['Args']['Named'] = {};

  modify(
    element: Signature['Element'],
    [anchor]: Signature['Args']['Positional'],
    options: Signature['Args']['Named']
  ) {
    this.popupElement = element;
    this.anchorElement = anchor instanceof HTMLElement ? anchor : document.querySelector(anchor);
    this.options = options;

    registerDestructor(this, this.stop.bind(this));
    this.start();
  }

  start() {
    if (!this.anchorElement) return;

    this.cleanup = autoUpdate(this.anchorElement, this.popupElement, this.reposition.bind(this));
  }

  stop() {
    if (!this.cleanup) return;

    this.cleanup();
    this.cleanup = undefined;
  }

  async reposition() {
    if (!this.anchorElement) return;

    const {
      middleware = [],
      offsetOptions = 0,
      flipOptions,
      placement = 'bottom-start',
      shiftOptions,
      strategy = 'absolute',
      sync,
    } = this.options;

    const _middleware: Middleware[] = [offset(offsetOptions)];

    if (sync) {
      _middleware.push(
        size({
          apply: ({ rects }) => {
            const syncWidth = sync === 'width' || sync === 'both';
            const syncHeight = sync === 'height' || sync === 'both';
            this.popupElement.style.width = syncWidth ? `${rects.reference.width}px` : '';
            this.popupElement.style.height = syncHeight ? `${rects.reference.height}px` : '';
          },
        })
      );
    } else {
      this.popupElement.style.width = '';
      this.popupElement.style.height = '';
    }

    _middleware.push(flip(flipOptions));
    _middleware.push(shift(shiftOptions));
    _middleware.concat(middleware);

    const {
      x,
      y,
      placement: _placement,
      strategy: _strategy,
    } = await computePosition(this.anchorElement, this.popupElement, {
      placement,
      middleware: _middleware,
      strategy,
    });
    Object.assign(this.popupElement.style, {
      left: `${x}px`,
      top: `${y}px`,
      position: _strategy,
    });

    this.popupElement.setAttribute('data-placement', _placement);
  }
}
