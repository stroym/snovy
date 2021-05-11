import {scopeId} from "../Database"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Scope extends Colored {

  unique: boolean

  constructor(title: string, color: string, unique = false, id?: number) {
    super(title, color, id)
    this.unique = unique
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
    return Promise.all([]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.scopes, () => {
      dexie.scopes.put(this, this.id)
    }).then(_it => this)
  }

  toColonString(): string {
    return this.unique ? this.title + "::" : this.title + ":"
  }

}