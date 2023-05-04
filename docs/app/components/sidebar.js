import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SidebarComponent extends Component {
  @service sidebar;

  linkGroups = [
    {
      header: 'Overview',
      links: [
        {
          name: 'Introduction',
          route: 'page.index',
        },
        {
          name: 'Getting started',
          route: 'page.getting-started',
        },
      ],
    },
    {
      header: 'Components',
      links: [
        {
          name: 'Dialog',
          route: 'page.components.dialog',
        },
        {
          name: 'Menu',
          route: 'page.components.menu',
        },
        {
          name: 'Popover',
          route: 'page.components.popover',
        },
        {
          name: 'Portal',
          route: 'page.components.portal',
        },
        {
          name: 'Switch',
          route: 'page.components.switch',
        },
      ],
    },
    {
      header: 'Modifiers',
      links: [
        {
          name: 'body-scroll-lock',
          route: 'page.modifiers.body-scroll-lock',
        },
        {
          name: 'focus-trap',
          route: 'page.modifiers.focus-trap',
        },
        {
          name: 'on-outside-click',
          route: 'page.modifiers.on-outside-click',
        },
        {
          name: 'velcro',
          route: 'page.modifiers.velcro',
        },
      ],
    },
  ];
}
