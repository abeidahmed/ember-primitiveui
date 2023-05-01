import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render, click, find, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | popover', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with initial attributes', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    assert.dom('[data-test-popover]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-button]').hasAria('haspopup', 'dialog');
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').doesNotHaveAria('controls');
    assert.dom('[data-test-panel]').isNotVisible();
  });

  test('opening/closing popover via mouse click', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    const panel = find('[data-test-panel]');

    assert.dom('[data-test-popover]').hasAttribute('data-state', 'open');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'open');
    assert.dom('[data-test-panel]').isVisible();
    assert.dom('[data-test-button]').hasAria('expanded', 'true');
    assert.dom('[data-test-button]').hasAria('controls', panel.id);
    assert.dom('[data-test-panel]').hasAttribute('data-state', 'open');
    assert.dom('[data-test-panel]').hasAria('modal', 'true');
    assert.dom('[data-test-panel]').hasAttribute('tabindex', '-1');
    assert.dom('[data-test-panel]').hasAttribute('role', 'dialog');
    assert.dom('[data-test-panel]').includesText('Contents');
    assert.strictEqual(document.activeElement, panel); // focuses on the panel

    await click('[data-test-button]');
    assert.dom('[data-test-popover]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').doesNotHaveAria('controls');
    assert.dom('[data-test-panel]').isNotVisible();
  });

  test('focus gets trapped inside the panel', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>
          <button type="button" data-test-panel-btn>Focus</button>
        </popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    const panel = find('[data-test-panel]');
    const panelBtn = find('[data-test-panel-btn]');

    assert.strictEqual(document.activeElement, panel); // focuses on the panel

    await triggerKeyEvent('[data-test-panel]', 'keydown', 'Tab');
    assert.strictEqual(document.activeElement, panelBtn);

    await triggerKeyEvent('[data-test-panel]', 'keydown', 'Tab');
    assert.strictEqual(document.activeElement, panelBtn);
  });

  test('closes the popover on Escape keypress', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-panel]').isVisible();

    await triggerKeyEvent('[data-test-panel]', 'keydown', 'Escape');
    assert.dom('[data-test-panel]').isNotVisible();
    assert.strictEqual(document.activeElement, find('[data-test-button]')); // focuses back on the trigger button
  });

  test('closes the popover on outside click', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-panel]').isVisible();

    await click(document.body);
    assert.dom('[data-test-panel]').isNotVisible();
    assert.strictEqual(document.activeElement, find('[data-test-button]')); // focuses back on the trigger button
  });

  test('yields an open boolean tracked property', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>{{if popover.open "Open" "Close"}}</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    assert.dom('[data-test-button]').hasText('Close');

    await click('[data-test-button]');
    assert.dom('[data-test-button]').hasText('Open');
  });

  test('yields a close function that closes the popover and restores the focus', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>
          <button type="button" {{on "click" popover.close}} data-test-panel-btn>Close</button>
        </popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-popover]').isVisible();

    await click('[data-test-panel-btn]');
    assert.dom('[data-test-panel]').isNotVisible();
    assert.strictEqual(document.activeElement, find('[data-test-button]'));
  });

  test('yields id, buttonId, and panelId', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>
          {{popover.id}} {{popover.buttonId}} {{popover.panelId}}
        </popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-popover]').isVisible();

    assert.dom('[data-test-panel]').includesText(find('[data-test-popover]').id);
    assert.dom('[data-test-panel]').includesText(find('[data-test-button]').id);
    assert.dom('[data-test-panel]').includesText(find('[data-test-panel]').id);
  });

  test('renders Popover as section using the `@as` argument', async function (assert) {
    await render(hbs`
      <Popover @as="section" data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    assert.dom('[data-test-popover]').hasTagName('section');
  });

  test('renders popover.Button as div using the `@as` argument', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button @as="div" data-test-button>Button</popover.Button>
        <popover.Panel data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    assert.dom('[data-test-button]').hasTagName('div');
  });

  test('renders popover.Panel as section using the `@as` argument', async function (assert) {
    await render(hbs`
      <Popover data-test-popover as |popover|>
        <popover.Button data-test-button>Button</popover.Button>
        <popover.Panel @as="section" data-test-panel>Contents</popover.Panel>
      </Popover>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-panel]').isVisible();
    assert.dom('[data-test-panel]').hasTagName('section');
  });
});
