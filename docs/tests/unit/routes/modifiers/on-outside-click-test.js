import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Route | modifiers/on-outside-click', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:modifiers/on-outside-click');
    assert.ok(route);
  });
});
