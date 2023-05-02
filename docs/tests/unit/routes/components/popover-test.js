import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Route | components/popover', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:components/popover');
    assert.ok(route);
  });
});
