import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';

module('Unit | Route | dialog/with-body-lock', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:dialog/with-body-lock');
    assert.ok(route);
  });
});
