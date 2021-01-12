import {Base} from "./Base";
import Section from "./Section";
import Tag from "./Tag";
import IdentifiedArray from "./IdentifiedArray";

export default class Notebook extends Base {

  sections: IdentifiedArray<Section> = new IdentifiedArray<Section>();
  tags: IdentifiedArray<Tag> = new IdentifiedArray<Tag>();
  states: string[] = new Array<string>();

  constructor(id: number, name: string) {
    super(id, name);
  }

  addSection(name: string, order: number) {
    this.sections.push(new Section(this.sections.getNewId(), name, order));
  }

}