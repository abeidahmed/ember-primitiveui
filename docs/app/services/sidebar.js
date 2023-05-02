import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class SidebarService extends Service {
  @tracked isOpen = false;

  @action open() {
    if (this.isOpen) return;
    this.isOpen = true;
  }

  @action close() {
    if (!this.isOpen) return;
    this.isOpen = false;
  }
}
