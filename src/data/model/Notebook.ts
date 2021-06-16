import Section from "./Section"
import {addTo, Ordered, removeFrom, Titled} from "./Base"
import {notebookId} from "../Database"
import {dexie} from "../../index"

export default class Notebook extends Titled {

  sections = new Array<Section>()

  constructor(title: string, id?: number) {
    super(title, id)

    Object.defineProperties(this, {
      sections: {enumerable: false, writable: true}
    })
  }

  delete() {
    return dexie.transaction("rw", dexie.notebooks, () => {dexie.notebooks.delete(this.id)})
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([
      dexie.sections.where(notebookId).equals(this.id).toArray().then(sections => this.sections = sections)
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.notebooks, () => {
      dexie.notebooks.put(new Notebook(this.title, this.id)).then(id => this.id = id)
    }).then(_it => this)
  }

  get itemsSortedAlphabetically() {
    return this.sections.sort(Titled.compareByTitle)
  }

  get itemsSortedByOrder() {
    return this.sections.sort(Ordered.compareByOrder)
  }

  async add(order?: number) {
    return addTo(this.sections, new Section(this.id, "", order ? order : this.sections.length))
      .finally(() => this.itemsSortedByOrder)
  }

  async remove(items?: Array<Section> | Section) {
    return await removeFrom(this.sections, items)
  }

}