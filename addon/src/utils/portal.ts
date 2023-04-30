import { getOwner } from '@ember/application';

export function portalId(component: unknown): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { APP } = (getOwner(component) as any).resolveRegistration(
    'config:environment'
  );
  return APP.primitiveUI.portalElement;
}
