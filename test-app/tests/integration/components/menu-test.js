import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render, click, triggerKeyEvent, triggerEvent, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | menu', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without any errors', async function (assert) {
    await render(hbs`
      <Menu data-test-menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.List data-test-list>
          <menu.Item>Item 1</menu.Item>
        </menu.List>
      </Menu>
    `);

    assert.dom('[data-test-menu]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-button]').hasText('Toggle menu');
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').hasAria('haspopup', 'true');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-list]').isNotVisible();
  });

  test('disabled item attribute', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.List data-test-list>
          <menu.Item data-test-item1>Item 1</menu.Item>
          <menu.Item @disabled={{true}} data-test-item2>Item 2</menu.Item>
        </menu.List>
      </Menu>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-list]').isVisible();
    assert.dom(find('[data-test-item1]')).doesNotHaveAttribute('disabled');
    assert.dom(find('[data-test-item1]')).doesNotHaveAria('disabled');
    assert.dom(find('[data-test-item2]')).hasAttribute('disabled');
    assert.dom(find('[data-test-item2]')).hasAria('disabled', 'true');
  });

  test('open/close list', async function (assert) {
    await render(hbs`
      <Menu data-test-menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.List data-test-list>
          <menu.Item data-test-item>
            Item 1
          </menu.Item>
        </menu.List>
      </Menu>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-menu]').hasAttribute('data-state', 'open');
    assert.dom('[data-test-list]').isVisible();
    assert.dom('[data-test-list]').hasAttribute('data-state', 'open');
    assert.dom('[data-test-button]').hasAria('expanded', 'true');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'open');

    const list = find('[data-test-list]');
    assert.dom('[data-test-button]').hasAria('controls', list.id);
    assert.dom('[data-test-list]').hasAttribute('tabindex', '-1');
    assert.dom('[data-test-list]').hasAria('labelledby', find('[data-test-button]').id);
    assert.dom('[data-test-list]').hasAttribute('role', 'menu');
    assert.dom('[data-test-item]').hasAttribute('tabindex', '-1');
    assert.dom('[data-test-item]').hasAttribute('role', 'menuitem');

    await click('[data-test-button]');
    assert.dom('[data-test-menu]').hasAttribute('data-state', 'closed');
    assert.dom('[data-test-list]').isNotVisible();
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-button]').doesNotHaveAria('controls');
    assert.dom('[data-test-button]').hasAttribute('data-state', 'closed');
  });

  module('outside interaction', function () {
    test('closes the menu on outside click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();

      await click(document.body);
      assert.dom('[data-test-list]').isNotVisible();
    });
  });

  module('focus manangement', function () {
    test('focuses on the list after opening the menu', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-list]'));
    });

    test('focuses on the button element after closing the menu', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      assert.dom('[data-test-list]').isNotVisible();
      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-list]'));
      assert.dom('[data-test-list]').isVisible();

      await click('[data-test-button]');
      assert.strictEqual(document.activeElement, find('[data-test-button]'));
      assert.dom('[data-test-list]').isNotVisible();
    });
  });

  module('item activation', function () {
    test('does not activate the item if opened with mouse click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-list]').doesNotHaveAria('activedescendant');
    });

    test('activates the item on mouse hover', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      await triggerEvent('[data-test-item]', 'mousemove');
      await triggerEvent('[data-test-item]', 'mouseover');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item]').id);
      assert.dom('[data-test-item]').hasAttribute('data-state', 'active');
    });

    test('activates the first option on Enter', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item]').id);
      assert.dom('[data-test-item]').hasAttribute('data-state', 'active');
    });

    test('activates the first option on Space', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', ' ');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item]').id);
      assert.dom('[data-test-item]').hasAttribute('data-state', 'active');
    });

    test('activates the first option on ArrowDown', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item data-test-item2>
              Item 2
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item1]').id);
      assert.dom('[data-test-item1]').hasAttribute('data-state', 'active');
    });

    test('activates the last option on ArrowUp', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item data-test-item2>
              Item 2
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item2]').id);
      assert.dom('[data-test-item2]').hasAttribute('data-state', 'active');
    });

    test('cycles through the items with ArrowDown', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item @disabled={{true}} data-test-item2>
              Item 2
            </menu.Item>
            <menu.Item data-test-item3>
              Item 3
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item1]').id);
      assert.dom('[data-test-item1]').hasAttribute('data-state', 'active');

      // skips option2
      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item3]').id);
      assert.dom('[data-test-item3]').hasAttribute('data-state', 'active');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item1]').id);
      assert.dom('[data-test-item1]').hasAttribute('data-state', 'active');
    });

    test('cycles through the items with ArrowUp', async function (assert) {
      await render(hbs`
        <Menu data-test-menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item1>
              Item 1
            </menu.Item>
            <menu.Item @disabled={{true}} data-test-item2>
              Item 2
            </menu.Item>
            <menu.Item data-test-item3>
              Item 3
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item3]').id);
      assert.dom('[data-test-item3]').hasAttribute('data-state', 'active');

      // skips option2
      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item1]').id);
      assert.dom('[data-test-item1]').hasAttribute('data-state', 'active');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-list]').hasAria('activedescendant', find('[data-test-item3]').id);
      assert.dom('[data-test-item3]').hasAttribute('data-state', 'active');
    });
  });

  module('click/keydown on the item', function () {
    test('closes the menu on mouse click', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();

      await click('[data-test-item]');
      assert.dom('[data-test-list]').isNotVisible();
    });

    test('closes the menu on Enter', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-list]').isVisible();

      await triggerKeyEvent('[data-test-item]', 'keydown', 'Enter');
      assert.dom('[data-test-list]').isNotVisible();
    });

    test('closes the menu on Space', async function (assert) {
      await render(hbs`
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item data-test-item>
              Item 1
            </menu.Item>
          </menu.List>
        </Menu>
      `);

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-list]').isVisible();

      await triggerKeyEvent('[data-test-item]', 'keydown', ' ');
      assert.dom('[data-test-list]').isNotVisible();
    });
  });

  module('portal', function () {
    test('enabled by default', async function (assert) {
      await render(hbs`
      <div data-test-container>
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List data-test-list>
            <menu.Item>Item 1</menu.Item>
          </menu.List>
        </Menu>
      </div>
    `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-container]').doesNotIncludeText('Item 1');
    });

    test('can be disabled', async function (assert) {
      await render(hbs`
      <div data-test-container>
        <Menu as |menu|>
          <menu.Button data-test-button>Toggle menu</menu.Button>
          <menu.List @portal={{false}} data-test-list>
            <menu.Item>Item 1</menu.Item>
          </menu.List>
        </Menu>
      </div>
    `);

      await click('[data-test-button]');
      assert.dom('[data-test-list]').isVisible();
      assert.dom('[data-test-container]').includesText('Item 1');
    });
  });

  test('can pass LinkTo component on the item', async function (assert) {
    await render(hbs`
      <Menu as |menu|>
        <menu.Button data-test-button>Toggle menu</menu.Button>
        <menu.List data-test-list>
          <menu.Item @as={{component "link-to" route="index"}} data-test-item>
            Item 1
          </menu.Item>
        </menu.List>
      </Menu>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-item]').matchesSelector('a[href="/"]');
  });
});
