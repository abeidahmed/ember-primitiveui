import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('menu', function () {});
  this.route('dialog', function () {
    this.route('with-menu');
    this.route('with-body-lock');
  });
  this.route('popover', function () {});
});
