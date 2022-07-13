import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import {
  render,
  find,
  click,
  triggerKeyEvent,
  focus,
  triggerEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | listbox', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders without any errors', async function (assert) {
    await render(hbs`
      <Listbox as |listbox|>
        <listbox.Button data-test-button>Button</listbox.Button>
        <listbox.Options data-test-options>
          <listbox.Option>Option 1</listbox.Option>
        </listbox.Options>
      </Listbox>
    `);

    assert.dom('[data-test-button]').hasAttribute('id');
    assert.dom('[data-test-button]').hasText('Button');
    assert.dom('[data-test-button]').hasAria('haspopup', 'true');
    assert.dom('[data-test-button]').hasAria('expanded', 'false');
    assert.dom('[data-test-options]').isNotVisible();
  });

  test('open/close options', async function (assert) {
    this.set('option', { id: 1 });
    this.set('selectedValue', {});

    await render(hbs`
      <Listbox @value={{this.selectedValue}} as |listbox|>
        <listbox.Button data-test-button>Button</listbox.Button>
        <listbox.Options data-test-options>
          <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
        </listbox.Options>
      </Listbox>
    `);

    const button = find('[data-test-button]');
    await click(button);
    const options = find('[data-test-options]');

    assert.strictEqual(document.activeElement, options); // focuses on the container when opened
    assert.dom(button).hasAria('expanded', 'true');
    assert.dom(button).hasAria('controls', options.id);
    assert.dom(options).isVisible();
    assert.dom(options).hasAria('labelledby', button.id);
    assert.dom(options).hasAttribute('id');
    assert.dom(options).hasAttribute('tabindex', '0');
    assert.dom(options).hasAttribute('role', 'listbox');
    assert.dom('[data-test-option]').hasAttribute('role', 'option');
    assert.dom('[data-test-option]').hasAttribute('tabindex', '-1');
    assert
      .dom('[data-test-option]')
      .hasAttribute('id', this.option.id.toString());
    assert.dom('[data-test-option]').hasAria('selected', 'false');

    await click(button);

    assert.dom(button).hasAria('expanded', 'false');
    assert.dom(button).doesNotHaveAria('controls');
    assert.dom(options).isNotVisible();
    assert.strictEqual(document.activeElement, button); // focuses on the button element when closed
  });

  module('when label is present', function () {
    test('sets the attributes', async function (assert) {
      this.set('option', { id: 1 });
      this.set('selectedValue', {});

      await render(hbs`
        <Listbox @value={{this.selectedValue}} as |listbox|>
          <listbox.Label data-test-label>My label</listbox.Label>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      const button = find('[data-test-button]');
      assert.dom('[data-test-label]').hasAttribute('id');

      await click(button);
      assert
        .dom('[data-test-options]')
        .hasAria('labelledby', find('[data-test-label]').id);
    });

    test('focuses on the button element when label is clicked', async function (assert) {
      await render(hbs`
        <Listbox as |listbox|>
          <listbox.Label data-test-label>My label</listbox.Label>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-label]');
      assert.strictEqual(document.activeElement, find('[data-test-button]'));
      assert.dom('[data-test-options]').isNotVisible();
    });
  });

  module('selecting an option', function () {
    test('dispatches the selected value and closes the options', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      await click('[data-test-option]');

      assert.strictEqual(this.selectedValue.id, 1);
      assert.dom('[data-test-options]').isNotVisible();
    });

    test('does nothing if the option is disabled', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} disabled data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      await triggerKeyEvent('[data-test-listbox]', 'keydown', 'Enter');

      assert.strictEqual(Object.keys(this.selectedValue).length, 0);
      assert.dom('[data-test-options]').isVisible();
    });
  });

  module('activating an option', function () {
    test('activates the first option if there is no selected option', async function (assert) {
      this.set('option', { id: 1 });
      this.set('selectedValue', {});

      await render(hbs`
        <Listbox @value={{this.selectedValue}} as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option.id.toString());
      assert.dom('[data-test-option]').hasAria('selected', 'false');
    });

    test('activates the first selected option', async function (assert) {
      this.set('active', { id: 2 });
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });

      await render(hbs`
        <Listbox @value={{this.active}} as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} data-test-option2>Option 2</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.active.id.toString());
      assert.dom('[data-test-option1]').hasAria('selected', 'false');
      assert.dom('[data-test-option2]').hasAria('selected', 'true');
    });

    test('activates on mouseover', async function (assert) {
      this.set('selectedValue', {});
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} data-test-option2>Option 2</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);

      await triggerEvent('[data-test-option2]', 'mousemove');
      await triggerEvent('[data-test-option2]', 'mouseover');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option2]').id);
    });

    test('does not activate a disabled item on mouseover', async function (assert) {
      this.set('selectedValue', {});
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} disabled data-test-option2>Option 2</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);

      await triggerEvent('[data-test-option2]', 'mousemove');
      await triggerEvent('[data-test-option2]', 'mouseover');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);
    });
  });

  module('keyboard interactions', function () {
    test('opens/closes the listbox with Enter/Space key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button @as="span" data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      assert.dom('[data-test-options]').isNotVisible();
      assert.dom('[data-test-button]').matchesSelector('span');
      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option]').id);

      assert.dom('[data-test-options]').isVisible();

      await triggerKeyEvent('[data-test-button]', 'keydown', 'Enter');
      assert.dom('[data-test-options]').isNotVisible();

      await triggerKeyEvent('[data-test-button]', 'keydown', ' ');
      assert.dom('[data-test-options]').isVisible();
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option]').id);

      await triggerKeyEvent('[data-test-button]', 'keydown', ' ');
      assert.dom('[data-test-options]').isNotVisible();
    });

    test('opens the listbox with ArrowDown/ArrowUp and activates the first/last option when there is no selected option', async function (assert) {
      this.set('selectedValue', {});
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} data-test-option2>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      assert.dom('[data-test-options]').isNotVisible();
      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-options]').isVisible();
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);

      await click('[data-test-button]');
      assert.dom('[data-test-options]').isNotVisible();

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-options]').isVisible();
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option2]').id);
    });

    test('opens the listbox with ArrowDown/ArrowUp and activates the selected option when there is a selected option', async function (assert) {
      this.set('selectedValue', { id: 1 });
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} data-test-option2>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      assert.dom('[data-test-options]').isNotVisible();
      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowDown');
      assert.dom('[data-test-options]').isVisible();
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);

      await click('[data-test-button]');
      assert.dom('[data-test-options]').isNotVisible();

      await triggerKeyEvent('[data-test-button]', 'keydown', 'ArrowUp');
      assert.dom('[data-test-options]').isVisible();
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', find('[data-test-option1]').id);
    });

    test('selects the option with Enter key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      await triggerKeyEvent('[data-test-listbox]', 'keydown', 'Enter');

      assert.strictEqual(this.selectedValue.id, this.option.id);
    });

    test('selects the option with Space key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });
      this.set('onChange', (value) => {
        this.set('selectedValue', value);
      });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} @onChange={{this.onChange}} data-test-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}} data-test-option>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      await triggerKeyEvent('[data-test-listbox]', 'keydown', ' ');

      assert.strictEqual(this.selectedValue.id, this.option.id);
    });

    test('cycles through the options with ArrowDown key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('option3', { id: 3 });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} data-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} disabled data-test-option2>Option 2</listbox.Option>
            <listbox.Option @value={{this.option3}} data-test-option2>Option 3</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option1.id.toString());

      // skips option 2
      await triggerKeyEvent('[data-listbox]', 'keydown', 'ArrowDown');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option3.id.toString());

      await triggerKeyEvent('[data-listbox]', 'keydown', 'ArrowDown');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option1.id.toString());
    });

    test('cycles through the options with ArrowUp key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option1', { id: 1 });
      this.set('option2', { id: 2 });
      this.set('option3', { id: 3 });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} data-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option1}} data-test-option1>Option 1</listbox.Option>
            <listbox.Option @value={{this.option2}} disabled data-test-option2>Option 2</listbox.Option>
            <listbox.Option @value={{this.option3}} data-test-option2>Option 3</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option1.id.toString());

      await triggerKeyEvent('[data-listbox]', 'keydown', 'ArrowUp');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option3.id.toString());

      // skips option 2
      await triggerKeyEvent('[data-listbox]', 'keydown', 'ArrowUp');
      assert
        .dom('[data-test-options]')
        .hasAria('activedescendant', this.option1.id.toString());
    });

    test('closes the option on Escape key', async function (assert) {
      this.set('selectedValue', {});
      this.set('option', { id: 1 });

      await render(hbs`
        <Listbox @value={{this.selectedValue}} data-listbox as |listbox|>
          <listbox.Button data-test-button>Button</listbox.Button>
          <listbox.Options data-test-options>
            <listbox.Option @value={{this.option}}>Option 1</listbox.Option>
          </listbox.Options>
        </Listbox>
      `);

      await click('[data-test-button]');
      assert.dom('[data-test-options]').isVisible();

      await triggerKeyEvent('[data-listbox]', 'keydown', 'Escape');
      assert.dom('[data-test-options]').isNotVisible();
    });
  });

  test('closes the options on outside click', async function (assert) {
    this.set('selectedValue', {});
    this.set('option', { id: 1 });

    await render(hbs`
      <Listbox @value={{this.selectedValue}} as |listbox|>
        <listbox.Button data-test-button>Button</listbox.Button>
        <listbox.Options data-test-options>
          <listbox.Option @value={{this.option}}>Option 1</listbox.Option>
        </listbox.Options>
      </Listbox>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-options]').isVisible();

    await click(document.body);
    assert.dom('[data-test-options]').isNotVisible();
  });

  test('closes the options on outside focus', async function (assert) {
    this.set('selectedValue', {});
    this.set('option', { id: 1 });

    await render(hbs`
      <Listbox @value={{this.selectedValue}} as |listbox|>
        <listbox.Button data-test-button>Button</listbox.Button>
        <listbox.Options data-test-options>
          <listbox.Option @value={{this.option}}>Option 1</listbox.Option>
        </listbox.Options>
      </Listbox>
      <button type="button" data-external-button>External button</button>
    `);

    await click('[data-test-button]');
    assert.dom('[data-test-options]').isVisible();

    await focus('[data-external-button]');
    assert.dom('[data-test-options]').isNotVisible();
  });
});
