import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | portal', function (hooks) {
  setupRenderingTest(hooks);

  test('appends the contents to the body', async function (assert) {
    await render(hbs`
      <div data-test-wrapper>
        <div>Inside</div>
        <Portal>Outside</Portal>
      </div>
    `);

    assert.dom('[data-test-wrapper]').containsText('Inside');
    assert.dom('[data-test-wrapper]').doesNotContainText('Outside');
    assert.dom(document.body).containsText('Outside');
  });

  test('does not disrupt heirarchy if disabled', async function (assert) {
    await render(hbs`
      <div data-test-wrapper>
        <div>Inside</div>
        <Portal @disabled={{true}}>Outside</Portal>
      </div>
    `);

    assert.dom('[data-test-wrapper]').includesText('Outside');
  });
});
