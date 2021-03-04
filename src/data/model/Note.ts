import Tag from "./Tag"
import State from "./State"
import Scope from "./Scope"
import {dexie} from "../../index"
import {isArray, isItem} from "../../util/Utils"
import {Ordered} from "./Base"

export default class Note extends Ordered {

  sectionId: number
  stateId?: number
  tagIds = new Array<number>()

  content = ""
  archived = false
  state?: State
  tags: Array<Tag> = new Array<Tag>()

  constructor(sectionId: number, title: string, order: number, id?: number) {
    super(title, order, id)
    this.sectionId = sectionId

    Object.defineProperties(this, {
      tags: {value: [], enumerable: false, writable: true}
    })
  }

  //TODO there's gotta be a better way to get and render tags
  get tagMap() {
    const scopedTags = this.tags
      .filter(tag => tag.scope)
      .sort(Tag.compareByExclusivity)

    const tempId = new Map<number, Array<Tag>>()
    const temp = new Map<Scope | undefined, Array<Tag>>()

    scopedTags.forEach((tag) => {
      const scope = tag.scope!

      if (!tempId.has(scope.id)) {
        tempId.set(scope.id, [])
        temp.set(scope, [])
      }

      tempId.get(scope.id)!.push(tag)
    })

    Array.from(tempId.entries()).forEach(([_scopeId, tags]: [number, Tag[]]) => {
      temp.set(tags.first()!.scope!, tags)
    })

    temp.set(undefined, this.tags.filter(tag => !tag.scope))

    return Array.from(temp.entries())
  }

  async create() {
    return dexie.transaction("rw", dexie.notes, () => {dexie.notes.add(this)}).then(_it => this)
  }

  delete() {
    return dexie.transaction("rw", dexie.notes, () => {dexie.notes.delete(this.id)})
  }

  async load() {
    return Promise.all([
      dexie.tags.bulkGet(this.tagIds).then(async tags => this.tags = await Tag.bulkLoad(tags.filter(isItem)))
    ]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.notes, () => {
      dexie.notes.put(this, this.id)
    }).then(_it => this)
  }

  updateContent(newContent: string) {
    this.content = newContent
    this.save()
  }

  tag(tag: Tag) {
    this.tags.push(tag)
    this.tagIds.push(tag.id)
    this.save()
  }

  untag(tag: Tag | Array<Tag>) {
    if (isArray(tag)) {
      this.tags.deleteAll(tag)
      this.tagIds.deleteAll(tag.map(it => it.id))
    } else {
      this.tags.delete(tag)
      this.tagIds.delete(tag.id)
    }

    this.save()
  }

  setState(state?: State) {
    this.state = state
  }

  isInState(state: State): boolean {
    return this.state == state
  }

}