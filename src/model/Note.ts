import Scope from "./coloured/Scope"
import Tag from "./coloured/Tag"
import {Item, ItemWithParent} from "./common/Base"
import Section from "./Section"

export default class Note extends ItemWithParent<Section> {

  content: string = ""
  archived: boolean = false
  state: string = "" //class/list in notebook
  tags: Set<Tag> = new Set<Tag>()

  get unscopedTags() {
    return this.tags.toArray().filter(tag => !tag.scope).sort(Item.compareByName)
  }

  //TODO this should be possible with scope directly, not just the string
  get scopedTags() {
    let scopedTags = this.tags.toArray().filter(tag => tag.scope).sort(Item.compareByName)

    let temp = new Map<string, Array<Tag>>()

    scopedTags.forEach((tag) => {
      if (!temp.has(tag.scope!.name!)) {
        temp.set(tag.scope!.name!, [])
      }

      temp.get(tag.scope!.name!)!.push(tag)

    })

    return temp
  }

  tag(tag: Tag): void {
    tag.tagNote(this)
  }

  untag(tag: Tag): void {
    tag.untagNote(this)
  }

  untagAll(tags: Array<Tag>) {
    tags.forEach(tag => this.tags.delete(tag))
  }

  isExclusivelyTagged(scope: Scope) {
    return this.tags.toArray().find(tag => tag.scope == scope)
  }

  isState(state: string): boolean {
    return this.state === state
  }

}