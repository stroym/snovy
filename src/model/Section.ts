import Note from "./Note"
import Notebook from "./Notebook"
import {ItemWithParentAndChildren} from "./common/Base"

export default class Section extends ItemWithParentAndChildren<Note, Notebook> {

  childName = "note"

  constructor(parent: Notebook, id: number, name: string, order: number) {
    super(parent, id, name, order)
    this.insert()
  }

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