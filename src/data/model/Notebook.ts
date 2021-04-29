import Section from "./Section"
import {addTo, Ordered, removeFrom, Titled} from "./Base"
import Scope from "./Scope"
import Tag from "./Tag"
import Note from "./Note"
import State from "./State"
import {notebookId} from "../Database"
import {dexie} from "../../index"

export default class Notebook extends Titled {

  sections = new Array<Section>()
  scopes = new Array<Scope>()
  tags = new Array<Tag>()
  states = new Array<State>()

  constructor(title: string, id?: number) {
    super(title, id)

    Object.defineProperties(this, {
      sections: {enumerable: false, writable: true},
      scopes: {enumerable: false, writable: true},
      tags: {enumerable: false, writable: true},
      states: {enumerable: false, writable: true}
    })
  }

  delete() {
    return dexie.transaction("rw", dexie.notebooks, () => {dexie.notebooks.delete(this.id)})
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([
      dexie.scopes.where(notebookId).equals(this.id).toArray().then(async scopes => this.scopes = await Scope.bulkLoad(scopes)),
      dexie.tags.where(notebookId).equals(this.id).toArray().then(async tags => this.tags = await Tag.bulkLoad(tags)),
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

  add(order?: number) {
    return addTo(this.sections, new Section(this.id, "", order ? order : this.sections.length))
  }

  remove(items?: Array<Section> | Section) {
    return removeFrom(this.sections, items)
  }

  availableTags(note: Note) {
    const tags = this.tags.filter(it => !note.tagIds.includes(it.id))

    const scopedTags = tags.filter(it => it.scope && !it.scope.unique).sort((a: Tag, b: Tag) => {
      return a.scope!.title.localeCompare(b.scope!.title) || a.title.localeCompare(b.title)
    })

    const scopedUniqueTags = tags.filter(it => it.scope && it.scope.unique).sort((a: Tag, b: Tag) => {
      return a.scope!.title.localeCompare(b.scope!.title) || a.title.localeCompare(b.title)
    })

    const unscopedTags = tags.filter(it => !it.scope).sort(Titled.compareByTitle)

    return scopedTags.concat(scopedUniqueTags, unscopedTags)
  }

}