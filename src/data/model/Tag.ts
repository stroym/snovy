import Scope from "./Scope"
import {dexie} from "../../index"
import {Colored} from "./Base"

export default class Tag extends Colored {

  notebookId: number
  scopeId?: number

  scope?: Scope

  constructor(notebookId: number, title: string, color: string, scopeId?: number, id?: number) {
    super(title, color, id)
    this.notebookId = notebookId
    this.scopeId = scopeId
  }

  static async bulkLoad(tags: Array<Tag>) {
    for (const tag of tags) {
      await tag.load()
    }

    return tags
  }

  delete() {
    return dexie.transaction("rw", dexie.tags, dexie.notes, async () => {
      await this.unTagAll()
      dexie.tags.delete(this.id)
    }).then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([
      this.scopeId ? await dexie.scopes.get(this.scopeId).then(async scope => this.scope = await scope?.load()) : () => false
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.tags, () => {
      dexie.tags.put(this, this.id)
    }).then(_it => this)
  }

  async unTagAll() {
    for (const note of await dexie.notes.where("tagIds").equals(this.id).toArray()) {
      await note.untag(this)
    }
  }

  async addScope(scope: Scope) {
    this.scope = scope
    await this.save()
  }

  async removeScope() {
    this.scope = undefined
    await this.save()
  }

  isEqual(tag: Tag): boolean {
    return this.scope == tag.scope && this.title == tag.title
  }

  toString(): string {
    return this.scope ? this.scope.toColonString() + this.title : super.toString()
  }

  static compareByScope =
    (a: Tag, b: Tag) => { return Number(a.scope) - Number(b.scope)}

  static compareByExclusivity =
    (a: Tag, b: Tag) => { return Number(a.scope?.unique) - Number(b.scope?.unique)}

}