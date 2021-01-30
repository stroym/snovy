import {ColouredItem} from "../common/Base"
import Note from "../Note"
import Scope from "./Category"

//TODO add colour to both tag and category
export default class Tag extends ColouredItem {

  //owner - notebook | manager (if global) ? not sure if bidirectional relationship is necessary
  taggedNotes: Array<Note> = new Array<Note>()
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