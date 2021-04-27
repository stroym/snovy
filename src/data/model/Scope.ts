import {scopeId} from "../Database"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Scope extends Colored {

  notebookId: number

  unique: boolean

  constructor(notebookId: number, title: string, color: string, unique = false, id?: number) {
    super(title, color, id)
    this.notebookId = notebookId
    this.unique = unique
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
      ]).then(_result => true).catch(_result => false)
    })
  }

  async load() {
    return Promise.all([
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.scopes, () => {
      dexie.scopes.put(this, this.id)
    }).then(_it => this)
  }

  static async bulkLoad(scopes: Array<Scope>) {
    for (const scope of scopes) {
      await scope.load()
    }

    return scopes
  }

  toColonString(): string {
    return this.unique ? this.title + "::" : this.title + ":"
  }

}