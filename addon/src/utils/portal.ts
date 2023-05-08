import { getOwner } from '@ember/application';

export function portalId(component: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { APP, environment } = (getOwner(component) as any).resolveRegistration('config:environment');
  const { portalElement } = APP.primitiveUI || {};

  if (environment === 'test') {
    return portalElement || APP.rootElement;
  }

  return portalElement || '#portal';
}
