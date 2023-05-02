import Component from '@glimmer/component';

export default class SidebarComponent extends Component {
  linkGroups = [
    {
      header: 'Introduction',
      links: [
        {
          name: 'Getting started',
          route: 'page.index',
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
