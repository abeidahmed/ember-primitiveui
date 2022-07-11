import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Route | components/tabs', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:components/tabs');
    assert.ok(route);
  });
});
