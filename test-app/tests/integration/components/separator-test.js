import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | separator', function (hooks) {
  setupRenderingTest(hooks);

  test('renders with default attributes', async function (assert) {
    await render(hbs`<Separator data-test-separator />`);

    assert.dom('[data-test-separator]').hasAria('orientation', 'horizontal');
    assert.dom('[data-test-separator]').hasAttribute('role', 'separator');
  });

  test('orientation can be changed', async function (assert) {
    await render(hbs`<Separator @orientation="vertical" data-test-separator />`);

    assert.dom('[data-test-separator]').hasAria('orientation', 'vertical');
  });
});
