import Section from "./Section";
import Tag from "./Tag";
import {ParentedHolder} from "./Base";
import Manager from "./Manager";

export default class Notebook extends ParentedHolder<Section, Manager> {

  tags: Set<Tag> = new Set<Tag>();
  states: Set<string> = new Set<string>();

  get sections(): Array<Section> {
    return this.items;
  }

  addSection(name: string, order: number) {
    this.addItem(new Section(this, this.idCounter, name, order));
  }

  addNewItem(order?: number) {
    if (order) {
      this.addItem(new Section(this, this.idCounter, "", order), true);
    } else {
      this.addItem(new Section(this, this.idCounter, "", this.items.length));
    }
  }

  deleteSection(section: Section) {
    this.deleteItem(section);
  }

}