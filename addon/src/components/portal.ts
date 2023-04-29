import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export default class PortalComponent extends Component {
  get portalRoot() {
    const {
      APP: { rootElement },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = (getOwner(this) as any).resolveRegistration('config:environment');
    return rootElement ? document.querySelector(rootElement) : document.body;
  }
}
