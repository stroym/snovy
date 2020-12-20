import {OrderableBase} from "./base";
import Tag from "./tag";

export default class Note extends OrderableBase {

  content: string;
  archived: boolean = false;
  state: string;
  tags: Set<Tag> = new Set<Tag>();

  constructor(id: number, name: string, order: number, content: string, archived: boolean, state: string, tags?: Set<Tag>) {
    super(id, name, order);
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