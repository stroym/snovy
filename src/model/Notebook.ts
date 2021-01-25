import Section from "./Section"
import Tag from "./Tag"
import {ItemWithParentAndChildren} from "./Base"
import Manager from "./Manager"

export default class Notebook extends ItemWithParentAndChildren<Section, Manager> {

  idCounterTag: number = 0

  tags: Array<Tag> = new Array<Tag>()
  states: Set<string> = new Set<string>()

  get sections(): Array<Section> {
    return this.items
  }

  insert() {
    this.addItem(new Section(this, this.idCounter, "", this.items.length))
  }

  insertAt(order: number) {
    this.addItem(new Section(this, this.idCounter, "", order), true)
  }

  addTag() {
    this.tags.push(new Tag(this.idCounterTag, ""))
    this.idCounterTag++
  }

  deleteTagById(tagId: number) {
    let item = this.tags.find(value => {
      return value.id == tagId
    })

    if (item) {
      this.deleteTag(item)
      return true
    } else {
      return false
    }
  }

  deleteTag(tag: Tag) {

    //TODO stream
    for (let section of this.sections) {
      for (let note of section.notes) {
        note.untag(tag)
      }
    }

    this.tags.splice(this.tags.indexOf(tag), 1)
  }

  deleteSection(section: Section) {
    this.deleteItem(section)
  }

}