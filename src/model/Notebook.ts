import Section from "./Section"
import {ItemWithParentAndChildren} from "./common/Base"
import Manager from "./Manager"
import Sets from "./common/Sets"

export default class Notebook extends ItemWithParentAndChildren<Section, Manager> {

  sets: Sets = new Sets()

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