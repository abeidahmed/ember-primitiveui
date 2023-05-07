import Controller from '@ember/controller';

export default class IndexController extends Controller {
  infos = [
    {
      icon: 'check-circle',
      title: 'WAI-ARIA compliant',
      description: 'Components adhere to the WAI-ARIA design patterns wherever possible.',
    },
    {
      icon: 'keyboard',
      title: 'Keyboard management',
      description: 'Components provide full keyboard support where users expect to use them.',
    },
    {
      icon: 'focus',
      title: 'Focus management',
      description:
        'By default, the components provide sensible focus management. However, you can customize them with the help of our modifiers.',
    },
    {
      icon: 'brush',
      title: 'Unstyled components',
      description: 'All the components are unstyled giving you the freedom to style them as you wish.',
    },
  ];
}
