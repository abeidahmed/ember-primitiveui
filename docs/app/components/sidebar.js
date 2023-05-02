import Component from '@glimmer/component';

export default class SidebarComponent extends Component {
  linkGroups = [
    {
      header: 'Introduction',
      links: [
        {
          name: 'Getting started',
          route: 'index',
        },
      ],
    },
    {
      header: 'Components',
      links: [
        {
          name: 'Dialog',
          route: 'components.dialog',
        },
        {
          name: 'Menu',
          route: 'components.menu',
        },
        {
          name: 'Popover',
          route: 'components.popover',
        },
        {
          name: 'Switch',
          route: 'components.switch',
        },
      ],
    },
    {
      header: 'Modifiers',
      links: [
        {
          name: 'body-scroll-lock',
          route: 'modifiers.body-scroll-lock',
        },
        {
          name: 'focus-trap',
          route: 'modifiers.focus-trap',
        },
        {
          name: 'on-outside-click',
          route: 'modifiers.on-outside-click',
        },
        {
          name: 'velcro',
          route: 'modifiers.velcro',
        },
      ],
    },
  ];
}
