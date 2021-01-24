import Note from "./Note"
import Notebook from "./Notebook"
import {ItemWithParentAndChildren} from "./Base"

export default class Section extends ItemWithParentAndChildren<Note, Notebook> {

  get notes(): Array<Note> {
    return this.items
  }

  insert() {
    this.addItem(new Note(this, this.idCounter, "", this.items.length))
  }

  insertAt(order: number) {
    this.addItem(new Note(this, this.idCounter, "", order), true)
  }

  deleteNote(note: Note) {
    this.deleteItem(note)
  }

}