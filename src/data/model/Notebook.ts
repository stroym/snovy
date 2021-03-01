import Section from "./Section"
import {addTo, Ordered, removeFrom, Titled, WithOrderedChildren} from "./Base"
import Scope from "./Scope"
import Tag from "./Tag"
import Note from "./Note"
import State from "./State"
import {notebookId} from "../Database"
import {dexie} from "../../index"

export default class Notebook extends Titled implements WithOrderedChildren<Section> {

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

  async create() {
    return dexie.transaction("rw", dexie.notebooks, () => {dexie.notebooks.add(this)}).then(_it => this)
  }

  delete() {
    return dexie.transaction("rw", dexie.notebooks, () => {dexie.notebooks.delete(this.id)})
  }

  async load() {
    return Promise.all([
      dexie.scopes.where(notebookId).equals(this.id).toArray().then(async scopes => this.scopes = await Scope.bulkLoad(scopes)),
      dexie.tags.where(notebookId).equals(this.id).toArray().then(async tags => this.tags = await Tag.bulkLoad(tags)),
      dexie.sections.where(notebookId).equals(this.id).toArray().then(sections => this.sections = sections)
    ]).then(_it => this)
  }

  save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", [dexie.notebooks, dexie.sections, dexie.scopes, dexie.tags], () => {
      return Promise.all([
        Promise.all(this.sections.map(item => dexie.sections.put(item))),
        Promise.all(this.scopes.map(item => dexie.scopes.put(item))),
        Promise.all(this.tags.map(item => dexie.tags.put(item)))
      ]).then(results => {
        const sectionIds = results[0]

        dexie.sections.where(notebookId).equals(this.id)
          .and(item => sectionIds.indexOf(item.id) === -1)
          .delete()

        dexie.notebooks.put(new Notebook(this.title, this.id)).then(id => this.id = id)
      })
    })
  }

  get itemsSortedAlphabetically() {
    return this.sections.sort(Titled.compareByName)
  }

  get itemsSortedByOrder() {
    return this.sections.sort(Ordered.compareByOrder)
  }

  add(order?: number) {
    return addTo(this.sections, new Section(this.id, "", order ? order : this.sections.length), order)
  }

  remove(items?: Array<Section> | Section) {
    return removeFrom(this.sections, items)
  }

  addTag(name: string, color: string, scope?: Scope) {
    const tag = new Tag(this.id, name, color, scope?.id)
    this.tags.push(tag)
    return tag
  }

  // addTag(tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) {
  //   dexie.transaction("rw", dexie.scopes, dexie.tags, async () => {
  //
  //     if (scopeText) {
  //       const scope = await dexie.scopes.where("title").equals(scopeText).first()
  //
  //       console.log(scope)
  //     } else {
  //       console.log("blob")
  //     }
  //
  //     // await dexie.scopes.add(new Scope(this.id, name, color, unique)).then(async id => {
  //     //   return await dexie.scopes.get(id)
  //     // }).then(inner => {return inner})
  //     //
  //     // this.save()
  //   }).then(inner => {return inner})
  //
  // }

  deleteTag(tag: Tag) {
    this.tags.delete(this.tags.find(it => it.isEqual(tag))!.unTagNoteAll())
  }

  availableTags(note: Note) {
    return this.tags.filter(it => !note.tagIds.includes(it.id))
  }

  addScope(name: string, color: string, unique?: boolean) {
    const scope = new Scope(this.id, name, color, unique)
    this.scopes.push(scope)
    return scope
  }

  deleteScope(scope: Scope, keepTags: boolean) {
    this.scopes.find(it => {
        if (it.title == scope.title) {
          if (keepTags) {
            this.tags.forEach(it => {
              if (it.scope == scope) {
                it.removeScope(scope)
              }
            })
          } else {
            this.tags.forEach(it => {
              if (it.scope == scope) {
                it.unTagNoteAll()
                this.tags.delete(it)
              }
            })
          }

          this.scopes.delete(it)
        }
      }
    )
  }

  addState(name: string, color: string) {
    this.states.push(new State(this.id, name, color))
  }

  deleteState(state: State) {
    this.states.delete(state)
  }

}