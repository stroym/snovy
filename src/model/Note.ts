import Tag, {Scope} from "./Tag"
import {ItemWithParent} from "./Base"
import Section from "./Section"

export default class Note extends ItemWithParent<Section> {

  content: string = ""
  archived: boolean = false
  state: string = "" //class/list in notebook
  tags: Set<Tag> = new Set<Tag>()

  tag(tag: Tag): void {
    if (!this.tags.has(tag)) {
      this.tags.add(tag)
    }
  }

  untag(tag: Tag): void {
    this.tags.delete(tag)
  }

  get tagsArray() {
    return Array.from(this.tags)
  }

  get tagsSortedAlphabetically() {
    return this.tagsArray.sort((a: Tag, b: Tag) => {
      return a.name.localeCompare(b.name)
    })
  }

  isExclusivelyTagged(category: Scope) {
    return this.tagsArray.find(tag => tag.scope == category)
  }

  isState(state: string): boolean {
    return this.state === state
  }

}