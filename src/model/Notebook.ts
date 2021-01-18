import Section from "./Section";
import Tag from "./Tag";
import {Holder} from "./Base";
import Manager from "./Manager";

export default class Notebook extends Holder<Section, Manager> {

  tags: Set<Tag> = new Set<Tag>();
  states: Set<string> = new Set<string>();

  get sections(): Array<Section> {
    return this.items;
  }

  //for testing purposes
  static WithData(parent: Manager, id: number, name: string, order: number): Notebook {
    return new Notebook(parent, id, name, order);
  }

  insert() {
    this.addItem(new Section(this, this.idCounter, "", this.items.length));
  }

  deleteSection(section: Section) {
    this.deleteItem(section);
  }

  insertAt(order: number) {
    this.addItem(new Section(this, this.idCounter, "", order), true);
  }

  addSection() {
    this.addItem(Section.WithData(this, this.idCounter, "section " + this.idCounter, this.items.length));
  }

}