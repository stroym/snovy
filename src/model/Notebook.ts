import {Base} from "./Base";
import Section from "./Section";
import Tag from "./Tag";

export default class Notebook extends Base {

  sections: Section[] = new Array<Section>();
  tags: Tag[] = new Array<Tag>();
  states: string[] = new Array<string>();

  constructor(id: number, name: string) {
    super(id, name);
  }

  addSection(name: string, order: number) {
    let id = this.sections.length > 0 ? this.sections[this.sections.length - 1].id + 1 : 0; //TODO depends on how order'll work

    this.sections.push(new Section(id, name, order));
  }

}