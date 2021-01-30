import Category from "../coloured/Category"
import Tag from "../coloured/Tag"

export default class Sets {

  categories: Set<Category> = new Set<Category>()
  tags: Set<Tag> = new Set<Tag>()
  states: Set<string> = new Set<string>()

  addTag() {
    this.tags.add(new Tag("", ""))
  }

  deleteTag(tag: Tag) {
    for (const it of this.tags) {
      if (it.name == tag.name) {

        tag.taggedNotes.forEach(note => note.untag(tag))
        this.tags.delete(tag)
      }
    }
  }

}