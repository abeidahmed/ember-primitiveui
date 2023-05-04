import EmberRouter from '@ember/routing/router';
import config from 'docs/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('examples', function () {
    this.route('dialog');
    this.route('menu');
    this.route('switch');
  });
  this.route('page', { path: '/' }, function () {
    this.route('components', function () {
      this.route('dialog');
      this.route('menu');
      this.route('popover');
      this.route('portal');
      this.route('switch');
    });
    this.route('modifiers', function () {
      this.route('body-scroll-lock');
      this.route('focus-trap');
      this.route('on-outside-click');
      this.route('velcro');
    });
    this.route('getting-started');
  });
});
