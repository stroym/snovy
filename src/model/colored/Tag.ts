import {ColoredItem} from "../common/Base"
import Note from "../Note"
import Scope from "./Scope"

export default class Tag extends ColoredItem {

  //owner - notebook | manager (if global) ? not sure if bidirectional relationship is necessary
  taggedNotes: Set<Note> = new Set<Note>()
  scope?: Scope

  constructor(name: string, color: string, scope?: Scope) {
    super(name, color)

    if (scope) {
      this.addScope(scope)
    }
  }

  tagNote(note: Note) {
    note.tags.add(this)
    this.taggedNotes.add(note)
  }

  unTagNote(note: Note) {
    this.taggedNotes.delete(note)
    note.tags.delete(this)
  }

  unTagNoteAll() {
    this.taggedNotes.forEach(note => note.untag(this))
    return this
  }

  addScope(scope: Scope) {
    scope?.scopeTag(this)
  }

  removeScope(scope: Scope) {
    scope.unScopeTag(this)
  }

  equals(tag: Tag): boolean {
    return this.scope == tag.scope && this.name == tag.name
  }

  toString(): string {
    return this.scope ? this.scope.toString() + this.name : super.toString()
  }

  static compareByScope =
    (a: Tag, b: Tag) => { return Number(a.scope) - Number(b.scope)}

  static compareByExclusivity =
    (a: Tag, b: Tag) => { return Number(a.scope?.exclusive) - Number(b.scope?.exclusive)}

}