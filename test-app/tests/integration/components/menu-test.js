import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import {
  render,
  click,
  triggerKeyEvent,
  triggerEvent,
  find,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | menu', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without any errors', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.Items data-test-items>
          <menu.Item>
            Item 1
          </menu.Item>
        </menu.Items>
      </Menu>
    `);

    assert.dom('[data-test-button]').hasText('Toggle menu');
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').hasAria('haspopup', 'true');
    assert.dom('[data-test-items]').isNotVisible();
  });

  test('open/close items', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.Items data-test-items>
          <menu.Item data-test-item>
            Item 1
          </menu.Item>
        </menu.Items>
      </Menu>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-items]').isVisible();
    assert.dom('[data-test-button]').hasAria('expanded', 'true');

    const items = find('[data-test-items]');
    assert.dom('[data-test-button]').hasAria('controls', items.id);
    assert.dom('[data-test-items]').hasAttribute('tabindex', '-1');
    assert
      .dom('[data-test-items]')
      .hasAria('labelledby', find('[data-test-button]').id);
    assert.dom('[data-test-items]').hasAttribute('role', 'menu');
    assert.dom('[data-test-item]').hasAttribute('tabindex', '-1');
    assert.dom('[data-test-item]').hasAttribute('role', 'menuitem');

    await click('[data-test-button]');
    assert.dom('[data-test-items]').isNotVisible();
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').doesNotHaveAria('controls');
  });

  module('outside interaction', function () {
    test('closes the menu on outside click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-items]').isVisible();

      await click(document.body);
      assert.dom('[data-test-items]').isNotVisible();
    });
  });

  module('focus manangement', function () {
    test('focuses on the items container after opening the menu', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-items]'));
    });

    test('focuses on the button element after closing the menu', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      assert.dom('[data-test-items]').isNotVisible();
      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-items]'));
      assert.dom('[data-test-items]').isVisible();

      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-button]'));
      assert.dom('[data-test-items]').isNotVisible();
    });
  });

  module('item activation', function () {
    test('does not activate the item if opened with mouse click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-items]').isVisible();
      assert.dom('[data-test-items]').doesNotHaveAria('activedescendant');
    });

    test('activates the item on mouse hover', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      await triggerEvent('[data-test-item]', 'mousemove');
      await triggerEvent('[data-test-item]', 'mouseover');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item]').id);
    });

    test('activates the first option on Enter', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-items]').isVisible();
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item]').id);
    });

    test('activates the first option on Space', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', ' ');
      assert.dom('[data-test-items]').isVisible();
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item]').id);
    });

    test('activates the first option on ArrowDown', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item data-test-item2>
              Item 2
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-items]').isVisible();
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item1]').id);
    });

    test('activates the last option on ArrowUp', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item data-test-item2>
              Item 2
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-items]').isVisible();
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item2]').id);
    });

    test('cycles through the items with ArrowDown', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item disabled data-test-item2>
              Item 2
            </menu.Item>
            <menu.Item data-test-item3>
              Item 3
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-items]').isVisible();

      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowDown');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item1]').id);

      // skips option2
      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowDown');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item3]').id);

      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowDown');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item1]').id);
    });

    test('cycles through the items with ArrowUp', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item disabled data-test-item2>
              Item 2
            </menu.Item>
            <menu.Item data-test-item3>
              Item 3
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-items]').isVisible();

      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowUp');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item3]').id);

      // skips option2
      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowUp');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item1]').id);

      await triggerKeyEvent('[data-test-items]', 'keydown', 'ArrowUp');
      assert
        .dom('[data-test-items]')
        .hasAria('activedescendant', find('[data-test-item3]').id);
    });
  });

  module('click/keydown on the item', function () {
    test('closes the menu on mouse click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-items]').isVisible();

      await click('[data-test-item]');
      assert.dom('[data-test-items]').isNotVisible();
    });

    test('closes the menu on Enter', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-items]').isVisible();

      await triggerKeyEvent('[data-test-item]', 'keydown', 'Enter');
      assert.dom('[data-test-items]').isNotVisible();
    });

    test('closes the menu on Space', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.Items data-test-items>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.Items>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-items]').isVisible();

      await triggerKeyEvent('[data-test-item]', 'keydown', ' ');
      assert.dom('[data-test-items]').isNotVisible();
    });
  });

  test('can pass LinkTo component on the item', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.Items data-test-items>
          <menu.Item @as={{component "link-to" route="index"}} data-test-item>
            Item 1
          </menu.Item>
        </menu.Items>
      </Menu>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-item]').matchesSelector('a[href="/"]');
  });
});
