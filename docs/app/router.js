import EmberRouter from '@ember/routing/router';
import config from 'docs/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('components', function () {
    this.route('dialog');
    this.route('switch');
    this.route('tabs');
    this.route('menu');
  });
  this.route('examples', function () {
    this.route('dialog');
    this.route('switch');
    this.route('tabs');
    this.route('menu');
  });
});
