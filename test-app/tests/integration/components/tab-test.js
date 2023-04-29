import QUnit, { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render, find, triggerKeyEvent, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

function getRelatedId(selector) {
  return selector.substring(selector.length - 2, selector.length - 1);
}

function assertSelectedItem(itemSelector) {
  const id = getRelatedId(itemSelector);

  QUnit.assert.dom(itemSelector).hasAria('selected', 'true');
  QUnit.assert.dom(itemSelector).hasAttribute('tabindex', '0');
  QUnit.assert
    .dom(itemSelector)
    .hasAria('controls', find(`[data-test-panel${id}]`).id);
}

function assertNotSelectedItem(itemSelector) {
  QUnit.assert.dom(itemSelector).hasAria('selected', 'false');
  QUnit.assert.dom(itemSelector).hasAttribute('tabindex', '-1');
  QUnit.assert.dom(itemSelector).doesNotHaveAria('controls');
}

function assertSelectedPanel(panelSelector) {
  const id = getRelatedId(panelSelector);

  QUnit.assert.dom(panelSelector).hasAttribute('role', 'tabpanel');
  QUnit.assert
    .dom(panelSelector)
    .hasAria('labelledby', find(`[data-test-item${id}]`).id);
  QUnit.assert.dom(panelSelector).hasAttribute('tabindex', '0');
}

function assertNotSelectedPanel(panelSelector) {
  QUnit.assert.dom(panelSelector).isNotVisible();
}

module('Integration | Component | tab', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without any errors', async function (assert) {
    await render(hbs`
      <Tab as |tab|>
        <tab.List data-test-list>
          <tab.Item @controls="panel-1" data-test-item1>
            Item 1
          </tab.Item>
          <tab.Item @controls="panel-2" data-test-item2>
            Item 2
          </tab.Item>
        </tab.List>
        <div>
          <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
          <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
        </div>
      </Tab>
    `);

    assert.dom('[data-test-list]').hasAttribute('role', 'tablist');
    assert.dom('[data-test-list]').hasAria('orientation', 'horizontal');

    assert.dom('[data-test-item1]').hasAttribute('role', 'tab');
    assertSelectedItem('[data-test-item1]');

    assert.dom('[data-test-item2]').hasAttribute('role', 'tab');
    assertNotSelectedItem('[data-test-item2]');

    assert.dom('[data-test-panel1]').hasAttribute('role', 'tabpanel');
    assertSelectedPanel('[data-test-panel1]');
    assertNotSelectedPanel('[data-test-panel2]');
  });

  module('initial selected tab', function () {
    test('can be changed with @defaultControls="panel-id"', async function () {
      await render(hbs`
        <Tab @defaultControls="panel-2" as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
            <tab.Item @controls="panel-2" data-test-item2>
              Item 2
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
            <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item2]');
      assertSelectedPanel('[data-test-panel2]');
      assertNotSelectedItem('[data-test-item1]');
      assertNotSelectedPanel('[data-test-panel1]');
    });

    test('selects the first panel if passed id is not found', async function () {
      await render(hbs`
        <Tab @defaultControls="invalid" as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item1]');
      assertSelectedPanel('[data-test-panel1]');
    });

    test('does not trigger the @onChange function', async function (assert) {
      let id = '';
      this.set('onChange', (panelId) => {
        id = panelId;
      });

      await render(hbs`
        <Tab @defaultControls="panel-1" as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
          </div>
        </Tab>
      `);

      assert.strictEqual(id, '');
    });
  });

  module('horizontal tabs', function () {
    test('selecting a tab item with keyboard', async function (assert) {
      let id = '';
      this.set('onChange', (panelId) => {
        id = panelId;
      });

      await render(hbs`
        <Tab @onChange={{this.onChange}} as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
            <tab.Item @controls="panel-2" data-test-item2>
              Item 2
            </tab.Item>
            <tab.Item @controls="panel-3" data-test-item3>
              Item 3
            </tab.Item>
            <tab.Item @controls="panel-4" disabled data-test-item4>
              Item 3
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
            <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
            <tab.Panel @id="panel-3" data-test-panel3>Panel 3</tab.Panel>
            <tab.Panel @id="panel-4" data-test-panel4>Panel 4</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowRight');
      assertSelectedItem('[data-test-item2]');
      assert.strictEqual(document.activeElement, find('[data-test-item2]'));
      assert.strictEqual(id, 'panel-2');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowRight');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowRight');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowLeft');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowLeft');
      assertSelectedItem('[data-test-item2]');
      assert.strictEqual(document.activeElement, find('[data-test-item2]'));
      assert.strictEqual(id, 'panel-2');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowLeft');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowLeft');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'Home');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'End');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');
    });

    test('does not select a tab item with ArrowDown/ArrowUp', async function (assert) {
      let id = '';
      this.set('onChange', (panelId) => {
        id = panelId;
      });

      await render(hbs`
        <Tab @onChange={{this.onChange}} as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
            <tab.Item @controls="panel-2" data-test-item2>
              Item 2
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
            <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');
    });
  });

  module('vertical tabs', function () {
    test('it has aria-orientation set to vertical', async function (assert) {
      await render(hbs`
        <Tab @isVertical={{true}} as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
          </div>
        </Tab>
      `);

      assert.dom('[data-test-list]').hasAria('orientation', 'vertical');
    });

    test('selecting a tab item with keyboard', async function (assert) {
      let id = '';
      this.set('onChange', (panelId) => {
        id = panelId;
      });

      await render(hbs`
        <Tab @onChange={{this.onChange}} @isVertical={{true}} as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
            <tab.Item @controls="panel-2" data-test-item2>
              Item 2
            </tab.Item>
            <tab.Item @controls="panel-3" data-test-item3>
              Item 3
            </tab.Item>
            <tab.Item @controls="panel-4" disabled data-test-item4>
              Item 3
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
            <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
            <tab.Panel @id="panel-3" data-test-panel3>Panel 3</tab.Panel>
            <tab.Panel @id="panel-4" data-test-panel3>Panel 4</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assertSelectedItem('[data-test-item2]');
      assert.strictEqual(document.activeElement, find('[data-test-item2]'));
      assert.strictEqual(id, 'panel-2');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowDown');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assertSelectedItem('[data-test-item2]');
      assert.strictEqual(document.activeElement, find('[data-test-item2]'));
      assert.strictEqual(id, 'panel-2');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowUp');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'Home');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(document.activeElement, find('[data-test-item1]'));
      assert.strictEqual(id, 'panel-1');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'End');
      assertSelectedItem('[data-test-item3]');
      assert.strictEqual(document.activeElement, find('[data-test-item3]'));
      assert.strictEqual(id, 'panel-3');
    });

    test('does not select a tab item with ArrowRight/ArrowLeft', async function (assert) {
      let id = '';
      this.set('onChange', (panelId) => {
        id = panelId;
      });

      await render(hbs`
        <Tab @onChange={{this.onChange}} @isVertical={{true}} as |tab|>
          <tab.List data-test-list>
            <tab.Item @controls="panel-1" data-test-item1>
              Item 1
            </tab.Item>
            <tab.Item @controls="panel-2" data-test-item2>
              Item 2
            </tab.Item>
          </tab.List>
          <div>
            <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
            <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
          </div>
        </Tab>
      `);

      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowRight');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');

      await triggerKeyEvent('[data-test-list]', 'keydown', 'ArrowLeft');
      assertSelectedItem('[data-test-item1]');
      assert.strictEqual(id, '');
    });
  });

  test('selecting a tab with a click', async function (assert) {
    let id = '';
    this.set('onChange', (panelId) => {
      id = panelId;
    });

    await render(hbs`
      <Tab @onChange={{this.onChange}} as |tab|>
        <tab.List data-test-list>
          <tab.Item @controls="panel-1" data-test-item1>
            Item 1
          </tab.Item>
          <tab.Item @controls="panel-2" data-test-item2>
            Item 2
          </tab.Item>
        </tab.List>
        <div>
          <tab.Panel @id="panel-1" data-test-panel1>Panel 1</tab.Panel>
          <tab.Panel @id="panel-2" data-test-panel2>Panel 2</tab.Panel>
        </div>
      </Tab>
    `);

    await click('[data-test-item2]');
    assertSelectedItem('[data-test-item2]');
    assert.strictEqual(id, 'panel-2');
  });
});
