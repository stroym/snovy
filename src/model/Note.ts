import Category from "./coloured/Category"
import Tag from "./coloured/Tag"
import {ItemWithParent} from "./common/Base"
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

  get unscopedTags() {
    return Note.sortAlphabetically(this.tags.toArray().filter(tag => !tag.scope))
  }

  //TODO this should be possible with scope directly, not just the string
  get scopedTags() {
    let scopedTags = Note.sortAlphabetically(this.tags.toArray().filter(tag => tag.scope))

    let temp = new Map<string, Array<Tag>>()

    scopedTags.forEach((tag) => {
      if (!temp.has(tag.scope!.name!)) {
        temp.set(tag.scope!.name!, [])
      }

      temp.get(tag.scope!.name!)!.push(tag)

    })

    return temp
  }

  get tagsSortedAlphabetically() {
    return Note.sortAlphabetically(this.tags.toArray())
  }

  static sortAlphabetically(tags: Array<Tag>) {
    return tags.sort((a: Tag, b: Tag) => { return a.name.localeCompare(b.name)})
  }

  untagAll(tags: Array<Tag>) {
    tags.forEach(tag => this.tags.delete(tag))
  }

  isExclusivelyTagged(category: Category) {
    return this.tags.toArray().find(tag => tag.scope == category)
  }

  isState(state: string): boolean {
    return this.state === state
  }

}