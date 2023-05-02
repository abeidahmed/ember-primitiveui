import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PageComponentsRoute extends Route {
  @service router;

  beforeModel(transition) {
    const { targetName } = transition;
    const routeArray = targetName.split('.');
    if (targetName && routeArray[routeArray.length - 1] === 'index') {
      this.router.transitionTo('page.components.dialog');
    }
  }
}
