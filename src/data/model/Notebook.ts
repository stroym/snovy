import Section from "./Section"
import {ItemWithParentAndChildren} from "./common/Base"
import Manager from "./Manager"
import Sets from "./common/Sets"

export default class Notebook extends ItemWithParentAndChildren<Section, Manager> {

  childName = "section"

  sets: Sets = new Sets()

  insert(order?: number, name = "") {
    return this.addItem(new Section(this, this.idCounter, name, order ? order : this.items.length), order != undefined)
  }

}