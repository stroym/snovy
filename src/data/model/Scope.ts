import Tag from "./Tag"
import {scopeId} from "../Database"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Scope extends Colored {

  notebookId: number
  tagIds = new Array<number>()

  unique: boolean

  scopedTags: Array<Tag> = new Array<Tag>()

  constructor(notebookId: number, title: string, color: string, unique = false, id?: number) {
    super(title, color, id)
    this.notebookId = notebookId
    this.unique = unique

    Object.defineProperties(this, {
      scopedTags: {value: [], enumerable: false, writable: true}
    })
  }

  async create() {
    return dexie.transaction("rw", dexie.scopes, () => {dexie.scopes.add(this)}).then(_it => this)
  }

  //TODO allow deleting tags or only removing scope from them
  delete() {
    return dexie.transaction("rw", dexie.scopes, dexie.tags, () => {
      return Promise.all([
        dexie.tags.where(scopeId).equals(this.id).delete(),
        dexie.scopes.delete(this.id)
      ])

      // dexie.tags.where(scopeId).equals(this.id).toArray().then(results => {
      //   for (const result of results) {
      //     result.scopeId = undefined
      //   }
      // })
    })
  }

  async load() {
    return Promise.all([
      dexie.tags.where(scopeId).equals(this.id).toArray().then(tags => this.scopedTags = tags)
    ]).then(_it => this)
  }

  save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", [dexie.scopes], () => {
      dexie.scopes.put(this, this.id)
    })
  }

  static async bulkLoad(scopes: Array<Scope>) {
    for (const scope of scopes) {
      await scope.load()
    }

    return scopes
  }

  scopeTag(tag: Tag) {
    tag.scope = this
    this.scopedTags.push(tag)
  }

  unScopeTag(tag: Tag) {
    this.scopedTags.delete(tag)
    tag.scope = undefined
  }

  //TODO change when scope + tag has custom display element
  toString(): string {
    return this.unique ? this.title + "::" : this.title + ":"
  }

}