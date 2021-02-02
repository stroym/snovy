import {ColouredItem} from "../common/Base"
import Tag from "./Tag"

export default class Scope extends ColouredItem {

  name: string
  exclusive: boolean

  scopedTags: Set<Tag> = new Set<Tag>()

  constructor(name: string, colour: string, exclusive: boolean = false) {
    super(name, colour)
    this.name = name
    this.exclusive = exclusive
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
    return this.exclusive ? this.name + "::" : this.name + ":"
  }

}