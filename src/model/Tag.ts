import {ColouredItem} from "./Base"

//TODO add colour to both tag and category
export default class Tag extends ColouredItem {

  //owner - notebook | manager (if global) ? not sure if bidirectional relationship is necessary
  //linked notes
  scope?: Scope

  constructor(name: string, colour: string, scope?: Scope) {
    super(name, colour)
    this.scope = scope
  }

  equals(tag: Tag): boolean {
    return this.scope === tag.scope && this.name === tag.name
  }

  toString(): string {
    return this.scope ? this.scope.toString() + this.name : super.toString()
  }

}

//TODO subclass scopedtag

export class Scope {

  name: string
  exclusive: boolean

  constructor(name: string, exclusive: boolean = false) {
    this.name = name
    this.exclusive = exclusive
  }

  toString(): string {
    return this.exclusive ? this.name + "::" : this.name + ":"
  }

}