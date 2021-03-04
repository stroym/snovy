import Note from "./Note"
import {addTo, Ordered, removeFrom, Titled} from "./Base"
import {sectionId} from "../Database"
import {dexie} from "../../index"

export default class Section extends Ordered {

  notebookId: number

  notes = new Array<Note>()

  constructor(notebookId: number, title: string, order: number, id?: number) {
    super(title, order, id)
    this.notebookId = notebookId

    Object.defineProperties(this, {
      notes: {enumerable: false, writable: true}
    })
  }

  get itemsSortedAlphabetically() {
    return this.notes.sort(Titled.compareByName)
  }

  get itemsSortedByOrder() {
    return this.notes.sort(Ordered.compareByOrder)
  }

  async load() {
    return Promise.all([
      dexie.notes.where(sectionId).equals(this.id).toArray().then(notes => this.notes = notes)
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.sections, () => {
      dexie.sections.put(this, this.id)
    }).then(_it => this)
  }

  async create() {
    return dexie.transaction("rw", dexie.sections, () => {dexie.sections.add(this)}).then(_it => this)
  }

  //TODO delete notes/allow for moving them to some scratches-like section
  delete() {
    return dexie.transaction("rw", dexie.sections, () => {dexie.sections.delete(this.id)})
  }

  add(order?: number) {
    return addTo(this.notes, new Note(this.id, "", order ? order : this.notes.length), order)
  }

  remove(items?: Array<Note> | Note) {
    return removeFrom(this.notes, items)
  }

}