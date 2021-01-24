import Section from "./Section"
import Tag from "./Tag"
import {ItemWithParentAndChildren} from "./Base"
import Manager from "./Manager"

export default class Notebook extends ItemWithParentAndChildren<Section, Manager> {

  tags: Set<Tag> = new Set<Tag>()
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

  deleteSection(section: Section) {
    this.deleteItem(section)
  }

}