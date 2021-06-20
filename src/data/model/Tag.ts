import Scope from "./Scope"
import {dexie} from "../../index"
import {Colored, Titled} from "./Base"

export default class Tag extends Colored {

  scopeId?: number

  scope?: Scope

  constructor(title: string, color: string, scopeId?: number, id?: number) {
    super(title, color, id)
    this.scopeId = scopeId
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

  static compareByScopeUnique =
    (a: Tag, b: Tag) => { return Number(a.scope?.unique) - Number(b.scope?.unique)}

}

export function sortTags(rawTags: Array<Tag>) {
  const scopedTags: Array<Tag> = []
  const unscopedTags: Array<Tag> = []

  rawTags.forEach(it => it.scope ? scopedTags.push(it) : unscopedTags.push(it))
  scopedTags.sort(Tag.compareByScopeUnique || Tag.compareByScope || Tag.compareByTitle)
  unscopedTags.sort(Titled.compareByTitle)

  return scopedTags.concat(unscopedTags)
}