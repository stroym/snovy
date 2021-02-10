import Tag from "./colored/Tag"
import {ItemWithParent} from "./common/Base"
import Section from "./Section"
import State from "./colored/State"
import Scope from "./colored/Scope"

export default class Note extends ItemWithParent<Section> {

  content = ""
  archived = false
  state?: State
  tags: Set<Tag> = new Set<Tag>()

  get tagMap() {
    const scopedTags = this.tags.toArray()
      .filter(tag => tag.scope)
      .sort(Tag.compareByExclusivity)

    const temp = new Map<Scope | undefined, Array<Tag>>()

    scopedTags.forEach((tag) => {

      if (!temp.has(tag.scope!)) {
        temp.set(tag.scope!, [])
      }

      temp.get(tag.scope!)!.push(tag)
    })

    temp.set(undefined, this.tags.toArray().filter(tag => !tag.scope))

    return Array.from(temp.entries())
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