import {Item} from "./Base"

export default class Tag extends Item {

  category?: Category;

  constructor(id: number, name: string, order: number, category?: Category) {
    super(id, name.replace("#", ""), order)
    this.category = category
  }

  equals(tag: Tag): boolean {
    return this.category === tag.category && this.name === tag.name
  }

  toString(): string {
    return this.category ? this.category + this.name : super.toString()
  }

}

export class Category {

  name: string;
  exclusive: boolean;

  constructor(name: string, exclusive: boolean = false) {
    this.name = name
    this.exclusive = exclusive
  }

  toString(): string {
    return this.exclusive ? this.name + "::" : this.name + ":"
  }

}