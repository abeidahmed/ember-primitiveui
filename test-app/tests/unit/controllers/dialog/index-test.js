import { module, test } from 'qunit';
import { setupTest } from 'test-app/tests/helpers';

module('Unit | Controller | dialog/index', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:dialog/index');
    assert.ok(controller);
  });
});
