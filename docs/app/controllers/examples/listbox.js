import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ExamplesListboxController extends Controller {
  people = [
    { id: 1, name: 'Thomas Alva Edison', disabled: false },
    { id: 2, name: 'Max Planck', disabled: false },
    { id: 3, name: 'Mary Somerville', disabled: false },
    { id: 4, name: 'Albert Einstein', disabled: false },
    { id: 5, name: 'Marie Curie', disabled: false },
    { id: 6, name: 'Charles Darwin', disabled: false },
  ];

  @tracked selectedPerson = this.people[0];

  @action setSelectedPerson(person) {
    this.selectedPerson = person;
  }
}
