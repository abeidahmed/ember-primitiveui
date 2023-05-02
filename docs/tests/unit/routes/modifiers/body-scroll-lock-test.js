import { module, test } from 'qunit';
import { setupTest } from 'docs/tests/helpers';

module('Unit | Route | modifiers/body-scroll-lock', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:modifiers/body-scroll-lock');
    assert.ok(route);
  });
});
