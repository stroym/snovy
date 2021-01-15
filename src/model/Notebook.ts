import Section from "./Section";
import Tag from "./Tag";
import {Holder} from "./Holder";
import Manager from "./Manager";

export default class Notebook extends Holder<Section, Manager> {

  tags: Set<Tag> = new Set<Tag>();
  states: Set<string> = new Set<string>();

  get sections(): Array<Section> {
    return this.items;
  }

  addSection(name: string, order: number) {
    this.addItem(new Section(this, this.idCounter, name, order));
  }

  deleteSection(section: Section) {
    this.deleteItem(section);
  }

}