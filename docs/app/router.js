import EmberRouter from '@ember/routing/router';
import config from 'docs/config/environment';
import { addDocfyRoutes } from '@docfy/ember';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  addDocfyRoutes(this);
  // this.route('examples', function () {
  //   this.route('dialog');
  //   this.route('menu');
  //   this.route('switch');
  // });
});
