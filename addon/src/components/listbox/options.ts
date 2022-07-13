import Component from '@glimmer/component';
import type ListboxLabelComponent from './label';
import type ListboxOptionComponent from './option';

interface Args {
  isOpen: boolean;
  optionsId: string;
  buttonId: string;
  labelId: string;
  label: ListboxLabelComponent | undefined;
  activeOption: ListboxOptionComponent | undefined;
}

export default class ListboxOptionsComponent extends Component<Args> {
  get activeOptionId() {
    return this.args.activeOption?.args.value.id;
  }
}
