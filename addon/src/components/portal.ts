import Component from '@glimmer/component';
import { portalId } from '../utils/portal';

export default class PortalComponent extends Component {
  get portalRoot() {
    const portal = document.querySelector(portalId(this));
    if (portal) return portal;

    const element = document.createElement('div');
    element.id = portalId(this).substring(1);
    document.body.append(element);

    return element;
  }
}
