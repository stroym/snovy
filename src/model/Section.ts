import Note from "./Note"
import Notebook from "./Notebook"
import {ItemWithParentAndChildren} from "./common/Base"

export default class Section extends ItemWithParentAndChildren<Note, Notebook> {

  childName = "note"

  get notes(): Array<Note> {
    return this.items
  }

  insert(order?: number, name = "") {
    return this.addItem(new Note(this, this.idCounter, name, order ? order : this.items.length), order != undefined)
  }

  deleteNote(note: Note) {
    this.deleteItem(note)
  }

}