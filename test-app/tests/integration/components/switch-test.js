import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render, find, click, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | switch', function (hooks) {
  setupRenderingTest(hooks);

  module('rendering without a label', function () {
    test('it renders without any errors', async function (assert) {
      await render(hbs`
        <Switch @isChecked={{false}} data-test-switch as |switch|>
          <switch.Button data-test-button>Button</switch.Button>
        </Switch>
      `);

      assert.dom('[data-test-button]').hasText('Button');
      assert.dom('[data-test-button]').hasAttribute('role', 'switch');
      assert.dom('[data-test-button]').hasAttribute('tabindex', '0');
      assert.dom('[data-test-button]').hasAria('checked', 'false');
      assert.dom('[data-test-button]').doesNotHaveAria('labelledby');
    });
  });

  module('rendering with a label', function () {
    test('it renders without any errors', async function (assert) {
      await render(hbs`
        <Switch @isChecked={{false}} data-test-switch as |switch|>
          <switch.Label data-test-label>Label</switch.Label>
          <switch.Button data-test-button>Button</switch.Button>
        </Switch>
      `);

      assert.dom('[data-test-label]').hasText('Label');
      assert.dom('[data-test-button]').hasText('Button');
      assert.dom('[data-test-button]').hasAttribute('role', 'switch');
      assert.dom('[data-test-button]').hasAttribute('tabindex', '0');
      assert.dom('[data-test-button]').hasAria('checked', 'false');
      assert.dom('[data-test-button]').hasAria('labelledby', find('[data-test-label]').id);
    });

    test('clicking on the label toggles the switch', async function (assert) {
      this.set('value', false);
      this.set('onChange', (value) => {
        this.set('value', value);
      });

      await render(hbs`
        <Switch @isChecked={{this.value}} @onChange={{this.onChange}} data-test-switch as |switch|>
          <switch.Label data-test-label>Label</switch.Label>
          <switch.Button data-test-button>Button</switch.Button>
        </Switch>
      `);

      assert.dom('[data-test-button]').hasAria('checked', 'false');

      await click('[data-test-label]');
      assert.dom('[data-test-button]').hasAria('checked', 'true');

      await click('[data-test-label]');
      assert.dom('[data-test-button]').hasAria('checked', 'false');
    });

    test('clicking on the label does not toggle the switch when @isPassive={{true}}', async function (assert) {
      this.set('value', false);
      this.set('onChange', (value) => {
        this.set('value', value);
      });

      await render(hbs`
        <Switch @isChecked={{this.value}} @onChange={{this.onChange}} data-test-switch as |switch|>
          <switch.Label @isPassive={{true}} data-test-label>Label</switch.Label>
          <switch.Button data-test-button>Button</switch.Button>
        </Switch>
      `);

      assert.dom('[data-test-button]').hasAria('checked', 'false');

      await click('[data-test-label]');
      assert.dom('[data-test-button]').hasAria('checked', 'false');
    });
  });

  test('clicking on the button toggles the switch', async function (assert) {
    this.set('value', false);
    this.set('onChange', (value) => {
      this.set('value', value);
    });

    await render(hbs`
      <Switch @isChecked={{this.value}} @onChange={{this.onChange}} data-test-switch as |switch|>
        <switch.Button data-test-button>Button</switch.Button>
      </Switch>
    `);

    assert.dom('[data-test-button]').hasAria('checked', 'false');

    await click('[data-test-button]');
    assert.dom('[data-test-button]').hasAria('checked', 'true');

    await click('[data-test-button]');
    assert.dom('[data-test-button]').hasAria('checked', 'false');
  });

  test('Space key toggles the switch', async function (assert) {
    this.set('value', false);
    this.set('onChange', (value) => {
      this.set('value', value);
    });

    await render(hbs`
      <Switch @isChecked={{this.value}} @onChange={{this.onChange}} data-test-switch as |switch|>
        <switch.Button data-test-button>Button</switch.Button>
      </Switch>
    `);

    assert.dom('[data-test-button]').hasAria('checked', 'false');

    await triggerKeyEvent('[data-test-button]', 'keyup', ' ');
    assert.dom('[data-test-button]').hasAria('checked', 'true');

    await triggerKeyEvent('[data-test-button]', 'keyup', ' ');
    assert.dom('[data-test-button]').hasAria('checked', 'false');
  });

  test('Enter key does not toggle the switch', async function (assert) {
    this.set('value', false);
    this.set('onChange', (value) => {
      this.set('value', value);
    });

    await render(hbs`
      <Switch @isChecked={{this.value}} @onChange={{this.onChange}} data-test-switch as |switch|>
        <switch.Button data-test-button>Button</switch.Button>
      </Switch>
    `);

    assert.dom('[data-test-button]').hasAria('checked', 'false');

    await triggerKeyEvent('[data-test-button]', 'keyup', 'Enter');
    assert.dom('[data-test-button]').hasAria('checked', 'false');
  });

  module('rendering with a form', function () {
    test('submits the form on Enter key', async function (assert) {
      this.set('submitted', false);
      this.set('onSubmit', (event) => {
        event.preventDefault();
        this.set('submitted', true);
      });

      await render(hbs`
        <form {{on "submit" this.onSubmit}}>
          <Switch @isChecked={{false}} data-test-switch as |switch|>
            <switch.Button data-test-button>Button</switch.Button>
          </Switch>
        </form>
      `);

      assert.false(this.submitted);

      await triggerKeyEvent('[data-test-button]', 'keyup', 'Enter');
      assert.true(this.submitted);
    });
  });
});
