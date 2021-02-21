import Notebook from "./Notebook"
import {IdentifiedItem, Item, WithChildren} from "./common/Base"
import generate from "../Generator"

export default class Manager implements WithChildren<Notebook> {

  childName = "notebook"

  idCounter = 0

  notebooks: Array<Notebook> = new Array<Notebook>()

  //testing data
  constructor() {
    generate(this)
  }

  get itemsSortedById(): Array<Notebook> {
    return this.notebooks.sort(IdentifiedItem.compareById)
  }

  get itemsSortedAlphabetically(): Array<Notebook> {
    return this.notebooks.sort(Item.compareByName)
  }

  export() {
    const seen = new Array<any>()

    // const ser = serialize(this)
    // console.log(ser)

    return JSON.stringify(this.notebooks, function (key, val) {
      if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
          return
        }
        seen.push(val)
      }

      return val
    })
  }

  insert(name = "") {
    return this.addItem(new Notebook(this, this.idCounter, name))
  }

  addItem(item: Notebook) {
    this.notebooks.push(item)
    this.idCounter++

    return item
  }

  deleteItem(item?: Notebook) {
    if (!item) {
      return undefined
    } else {
      const index = this.notebooks.delete(item)

      return index > 0 ? this.notebooks[index - 1] : undefined
    }
  }

  deleteItems(items: Array<Notebook>) {
    items.forEach(it => this.deleteItem(it))
    return items.last()
  }

  deleteById(id: number) {
    return this.deleteItem(this.notebooks.find(value => {return value.id == id}))
  }

}