import {ColoredItem} from "../common/Base"
import Tag from "./Tag"

export default class Scope extends ColoredItem {

  title: string
  unique: boolean

  scopedTags: Set<Tag> = new Set<Tag>()

  constructor(name: string, color: string, unique = false) {
    super(name, color)
    this.title = name
    this.unique = unique
  }

  scopeTag(tag: Tag) {
    tag.scope = this
    this.scopedTags.add(tag)
  }

  unScopeTag(tag: Tag) {
    this.scopedTags.delete(tag)
    tag.scope = undefined
  }

  toString(): string {
    return this.unique ? this.title + "::" : this.title + ":"
  }

}