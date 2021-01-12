import {Base} from "./Base";

export default class Tag extends Base {

  category?: Category;

  constructor(id: number, name: string, category?: Category) {
    super(id, name.replace("#", ""));
    this.category = category;
  }

  equals(tag: Tag): boolean {
    return this.category === tag.category && this.name === tag.name;
  }

  toString(): string {
    return this.category ? this.category + this.name : super.toString();
  }

}

export class Category {

  name: string;
  exclusive: boolean;

  constructor(name: string, exclusive: boolean = false) {
    this.name = name;
    this.exclusive = exclusive;
  }

  toString(): string {
    return this.exclusive ? this.name + "::" : this.name + ":";
  }

}