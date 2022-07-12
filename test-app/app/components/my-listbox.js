import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MyListboxComponent extends Component {
  people = [
    { id: 1, name: 'Abeid Ahmed', disabled: false },
    { id: 2, name: 'Suhail Ahmed', disabled: false },
    { id: 3, name: 'Samim Fatima', disabled: false },
  ];

  @tracked selectedPerson = this.people[0];

  @action setSelectedPerson(person) {
    this.selectedPerson = person;
  }
}
