import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ComponentsRoute extends Route {
  @service router;

  beforeModel(transition) {
    const { targetName } = transition;
    if (targetName && targetName.split('.')[1] === 'index') {
      this.router.transitionTo('components.dialog');
    }
  }
}
