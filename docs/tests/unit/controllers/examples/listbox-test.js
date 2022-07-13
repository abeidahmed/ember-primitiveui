import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Controller | examples/listbox', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:examples/listbox');
    assert.ok(controller);
  });
});
