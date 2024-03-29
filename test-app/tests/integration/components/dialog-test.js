import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render, find, click, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | dialog', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without any errors', async function (assert) {
    this.set('onClose', function () {});

    await render(hbs`
      <Dialog @onClose={{this.onClose}} as |dialog|>
        <dialog.Panel data-test-panel>
          <dialog.Title data-test-title>
            Dialog title
          </dialog.Title>
        </dialog.Panel>
      </Dialog>
    `);

    assert.dom('[data-test-panel]').hasAria('modal', 'true');
    assert.dom('[data-test-panel]').hasAttribute('role', 'dialog');
    assert.dom('[data-test-panel]').hasAttribute('tabindex', '-1');
    assert.dom('[data-test-title]').hasText('Dialog title');
  });

  test('panel role can be overridden', async function (assert) {
    this.set('onClose', function () {});

    await render(hbs`
      <Dialog @onClose={{this.onClose}} as |dialog|>
        <dialog.Panel role="alertdialog" data-test-panel>
          <dialog.Title data-test-title>
            Dialog title
          </dialog.Title>
        </dialog.Panel>
      </Dialog>
    `);

    assert.dom('[data-test-panel]').hasAttribute('role', 'alertdialog');
  });

  module('aria-labelledby', function () {
    test('it sets the attribute with respect to the title id', async function (assert) {
      this.set('onClose', function () {});

      await render(hbs`
        <Dialog @onClose={{this.onClose}} as |dialog|>
          <dialog.Panel data-test-panel>
            <dialog.Title data-test-title>
              Dialog title
            </dialog.Title>
          </dialog.Panel>
        </Dialog>
      `);

      assert.dom('[data-test-panel]').hasAria('labelledby', find('[data-test-title]').id);
    });

    test('it does not set the attribute when title is missing', async function (assert) {
      this.set('onClose', function () {});

      await render(hbs`
        <Dialog @onClose={{this.onClose}} as |dialog|>
          <dialog.Panel data-test-panel></dialog.Panel>
        </Dialog>
      `);

      assert.dom('[data-test-panel]').doesNotHaveAria('labelledby');
    });
  });

  module('focus management', function () {
    test('focuses on the dialog panel when there are not valid focusable children', async function (assert) {
      this.set('open', false);
      this.set('onClose', function () {});
      this.set('onOpen', () => {
        this.set('open', true);
      });

      await render(hbs`
        <button type="button" {{on "click" this.onOpen}}>Open dialog</button>
        {{#if this.open}}
          <Dialog @open={{this.open}} @onClose={{this.onClose}} as |dialog|>
            <dialog.Panel data-test-panel></dialog.Panel>
          </Dialog>
        {{/if}}
      `);

      await click(find('button[type="button"]')); // open the dialog

      assert.dom('[data-test-panel]').hasAttribute('tabindex', '-1');
      assert.strictEqual(document.activeElement, find('[data-test-panel]'));
    });

    test('focuses on the children element that has [data-autofocus] attribute', async function (assert) {
      this.set('open', false);
      this.set('onClose', function () {});
      this.set('onOpen', () => {
        this.set('open', true);
      });

      await render(hbs`
        <button type="button" {{on "click" this.onOpen}}>Open dialog</button>
        {{#if this.open}}
          <Dialog @open={{this.open}} @onClose={{this.onClose}} as |dialog|>
            <dialog.Panel data-test-panel>
              <button data-test-button type="button" data-autofocus>Button</button>
            </dialog.Panel>
          </Dialog>
        {{/if}}
      `);

      await click(find('button[type="button"]')); // open the dialog

      assert.dom('[data-test-panel]').hasAttribute('tabindex', '-1');
      assert.strictEqual(document.activeElement, find('[data-test-button]'));
    });
  });

  module('closing the dialog', function () {
    test('Escape key closes the dialog', async function (assert) {
      this.set('open', true);
      this.set('onClose', () => {
        this.set('open', false);
      });

      await render(hbs`
        {{#if this.open}}
          <Dialog data-test-dialog @open={{this.open}} @onClose={{this.onClose}} as |dialog|>
            <dialog.Panel data-test-panel>
              <button data-test-button type="button">Button</button>
            </dialog.Panel>
          </Dialog>
        {{/if}}
      `);

      assert.dom('[data-test-dialog]').isVisible();

      await triggerKeyEvent('[data-test-dialog]', 'keydown', 'Escape');
      assert.dom('[data-test-dialog]').isNotVisible();
    });

    test('clicking outside of the panel closes the dialog', async function (assert) {
      this.set('open', true);
      this.set('onClose', () => {
        this.set('open', false);
      });

      await render(hbs`
        {{#if this.open}}
          <Dialog data-test-dialog @open={{this.open}} @onClose={{this.onClose}} as |dialog|>
            <div data-inside>Inside</div>
            <dialog.Panel data-test-panel>
              <button data-test-button type="button">Button</button>
            </dialog.Panel>
          </Dialog>
        {{/if}}
      `);

      assert.dom('[data-test-dialog]').isVisible();

      await click('[data-inside]');
      assert.dom('[data-test-dialog]').isNotVisible();
    });

    test('clicking inside the panel does not close the dialog', async function (assert) {
      this.set('open', true);
      this.set('onClose', () => {
        this.set('open', false);
      });

      await render(hbs`
        {{#if this.open}}
          <Dialog data-test-dialog @open={{this.open}} @onClose={{this.onClose}} as |dialog|>
            <dialog.Panel data-test-panel>
              <button data-test-button type="button">Button</button>
            </dialog.Panel>
          </Dialog>
        {{/if}}
      `);

      assert.dom('[data-test-dialog]').isVisible();

      await click('[data-test-panel]');
      assert.dom('[data-test-dialog]').isVisible();
    });
  });
});
