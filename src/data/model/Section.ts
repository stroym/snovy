import Note from "./Note"
import Notebook from "./Notebook"
import {Item, OrderedItem, WithOrderedChildren} from "./common/Base"

export default class Section extends OrderedItem implements WithOrderedChildren<Note> {

  idCounter = 0

  parent: Notebook

  notes = new Array<Note>()

  constructor(parent: Notebook, id: number, title: string, order: number) {
    super(id, title, order)
    this.parent = parent
    this.insert()
  }

  get itemsSortedAlphabetically() {
    return this.sortBy(Item.compareByName)
  }

  get itemsSortedByOrder() {
    return this.sortBy(OrderedItem.compareByOrder)
  }

  addItem(note: Note, reorder = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(note.order).forEach(value => {
        value.order++
      })
    }

    this.notes.push(note)
    this.idCounter++

    return note
  }

  deleteItem(note?: Note) {
    if (!note) {
      return undefined
    } else {
      const index = this.notes.delete(note)

      this.notes.slice(index).forEach(value => value.order--)

      if (index > 0) {
        return this.notes[index - 1]
      } else if (index == 0 && this.notes.length > 1) {
        return this.notes[index]
      } else {
        return undefined
      }
    }
  }

  deleteItems(notes: Array<Note>) {
    let note
    notes.forEach(it => {note = this.deleteItem(it)})
    return note
  }

  deleteById(id: number) {
    return this.deleteItem(this.notes.find(value => {return value.id == id}))
  }

  insert(order?: number, name = "") {
    return this.addItem(new Note(this, this.idCounter, name, order ? order : this.notes.length), order != undefined)
  }

  private sortBy(compareFn: (a: Note, b: Note) => number): Array<Note> {
    return this.notes.sort(compareFn)
  }

}