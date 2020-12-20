import {Base} from "./base";

export default class Tag extends Base {

  category?: string;

  constructor(id: number, name: string, category?: string) {
    super(id, name.replace("#", ""));
    this.category = category;
  }

  equals(tag: Tag): boolean {
    return this.category === tag.category && this.name === tag.name;
  }

  toString(): string {
    return this.category ? super.toString() : this.category + ":" + this.name;
  }

}