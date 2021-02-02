import Tag from "./coloured/Tag"
import {Item, ItemWithParent} from "./common/Base"
import Section from "./Section"
import State from "./coloured/State"
import Scope from "./coloured/Scope"

export default class Note extends ItemWithParent<Section> {

  content: string = ""
  archived: boolean = false
  state?: State
  tags: Set<Tag> = new Set<Tag>()

  get unscopedTags() {
    return this.tags.toArray().filter(tag => !tag.scope).sort(Item.compareByName)
  }

  //TODO this should be possible with scope directly, not just the string
  get scopedTags() {
    let scopedTags = this.tags.toArray().filter(tag => tag.scope).sort(Item.compareByName)

    let temp = new Map<Scope, Array<Tag>>()

    scopedTags.forEach((tag) => {
      if (!temp.has(tag.scope!)) {
        temp.set(tag.scope!, [])
      }

      temp.get(tag.scope!)!.push(tag)
    })

    return temp
  }

  tag(tag: Tag): void {
    tag.tagNote(this)
  }

  untag(tag: Tag): void {
    tag.unTagNote(this)
  }

  untagAll(tags: Array<Tag>) {
    tags.forEach(tag => this.tags.delete(tag))
  }

  //TODO search helpers - isTagged, isTaggedAll etc.

  setState(state: State) {
    state.addToNote(this)
  }

  unsetState(state: State) {
    state.removeFromNote(this)
  }

  isInState(state: State): boolean {
    return this.state == state
  }

}