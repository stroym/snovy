import {ColouredItem} from "../common/Base"
import Note from "../Note"
import Scope from "./Scope"

//TODO add colour to both tag and category
export default class Tag extends ColouredItem {

  //owner - notebook | manager (if global) ? not sure if bidirectional relationship is necessary
  taggedNotes: Set<Note> = new Set<Note>()
  scope?: Scope

  constructor(name: string, colour: string, scope?: Scope) {
    super(name, colour)
    this.scope = scope
  }

  tagNote(note: Note) {
    note.tags.add(this)
    this.taggedNotes.add(note)
  }

  untagNote(note: Note) {
    this.taggedNotes.delete(note)
    note.tags.delete(this)
  }

  untagNoteAll() {
    this.taggedNotes.forEach(note => note.untag(this))
  }

  equals(tag: Tag): boolean {
    return this.scope == tag.scope && this.name == tag.name
  }

  toString(): string {
    return this.scope ? this.scope.toString() + this.name : super.toString()
  }

}