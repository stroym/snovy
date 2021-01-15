import Tag from "./Tag";
import {HolderItem} from "./Holder";
import Section from "./Section";

export default class Note extends HolderItem<Section> {

  content: string;
  archived: boolean;
  state: string; //class/list in notebook
  tags: Set<Tag> = new Set<Tag>();

  constructor(parent: Section, id: number, name: string, content: string, state: string, order: number, tags?: Set<Tag>, archived: boolean = false) {
    super(parent, id, name, order);
    this.content = content;
    this.archived = archived;
    this.state = state;
    this.tags = tags ? tags : this.tags;
  }

  tag(tag: Tag): void {
    this.tags.add(tag);
  }

  untag(tag: Tag): void {
    this.tags.delete(tag);
  }

  isState(state: string): boolean {
    return this.state === state;
  }

}