import Component from '@glimmer/component';

export default class PortalComponent extends Component {
  get portalRoot() {
    const portal = document.querySelector('[data-pui-portal]');
    if (portal) return portal;

    const element = document.createElement('div');
    element.setAttribute('data-pui-portal', '');
    document.body.append(element);

    return element;
  }
}
