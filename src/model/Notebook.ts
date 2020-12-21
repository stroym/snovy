import {Base} from "./Base";
import Section from "./Section";
import Tag from "./Tag";

export default class Notebook extends Base {

  static readonly DEFAULT_SECTION = new Section(0, "DEFAULT_APP_SECTION", -1);

  sections: Section[] = new Array<Section>();
  tags: Tag[] = new Array<Tag>();
  states: string[] = new Array<string>();

  constructor(id: number, name: string) {
    super(id, name);

    this.sections.push(Notebook.DEFAULT_SECTION);
  }

}