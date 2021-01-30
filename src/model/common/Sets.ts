import Scope from "../coloured/Scope"
import Tag from "../coloured/Tag"

export default class Sets {

  categories: Set<Scope> = new Set<Scope>()
  tags: Set<Tag> = new Set<Tag>()
  states: Set<string> = new Set<string>()

  addTag() {
    this.tags.add(new Tag("", ""))
  }

  deleteTag(tag: Tag) {
    for (const it of this.tags) {
      if (it.equals(tag)) {
        it.untagNoteAll()
        this.tags.delete(it)
      }
    }
  }

}