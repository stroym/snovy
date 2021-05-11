import Tag from "./Tag"
import State from "./State"
import {dexie} from "../../index"
import {isArray} from "../../util/utils"
import {Ordered} from "./Base"

export default class Note extends Ordered {

  sectionId: number
  stateId?: number
  tagIds = new Array<number>()

  content = ""
  archived = false
  favorite = false
  state?: State

  constructor(sectionId: number, title: string, order: number, id?: number) {
    super(title, order, id)
    this.sectionId = sectionId
  }

  delete() {
    return dexie.transaction("rw", dexie.notes, () => {dexie.notes.delete(this.id)})
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([]).then(_it => this)
  }

  async save() {
    this.updatedAt = new Date()

    return dexie.transaction("rw", dexie.notes, () => {
      dexie.notes.put(this, this.id)
    }).then(_it => this)
  }

  async updateContent(newContent: string) {
    this.content = newContent
    await this.save()
  }

  async tag(tag: Tag) {
    this.tagIds.push(tag.id)
    await this.save()
  }

  async untag(tag: Tag | Array<Tag>) {
    if (isArray(tag)) {
      this.tagIds.deleteAll(tag.map(it => it.id))
    } else {
      this.tagIds.delete(tag.id)
    }

    await this.save()
  }

  async setState(state?: State) {
    this.state = state
    await this.save()
  }

  isInState(state: State): boolean {
    return this.state == state
  }

  async archive() {
    this.archived = true
    await this.save()
  }

  async unarchive() {
    this.archived = false
    await this.save()
  }

  async star() {
    this.favorite = true
    await this.save()
  }

  async unstar() {
    this.favorite = false
    await this.save()
  }

}