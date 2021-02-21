import Notebook from "./Notebook"
import {IdentifiedItem, Item, OrderedItem, ParentInterface} from "./common/Base"
import generate from "../Generator"

export default class Manager implements ParentInterface<Notebook> {

  childName = "notebook"

  idCounter = 0

  items: Array<Notebook> = new Array<Notebook>()

  //testing data
  constructor() {
    generate(this)
  }

  export() {
    const seen = new Array<any>()

    return JSON.stringify(this.items, function (key, val) {
      if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
          return
        }
        seen.push(val)
      }

      return val
    })
  }

  get itemsSortedById(): Array<Notebook> {
    return this.items.sort(IdentifiedItem.compareById)
  }

  get itemsSortedAlphabetically(): Array<Notebook> {
    return this.items.sort(Item.compareByName)
  }

  get itemsSortedByOrder(): Array<Notebook> {
    return this.items.sort(OrderedItem.compareByOrder)
  }

  insert(order?: number, name = "") {
    return this.addItem(new Notebook(this, this.idCounter, name, order ? order : this.items.length), order != undefined)
  }

  addItem(item: Notebook, reorder = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++

    return item
  }

  deleteItem(item?: Notebook) {
    if (!item) {
      return undefined
    } else {
      const index = this.items.delete(item)

      this.items.slice(index).forEach(value => { value.order--})

      return index > 0 ? this.items[index - 1] : undefined
    }
  }

  deleteItems(items: Array<Notebook>) {
    items.forEach(it => this.deleteItem(it))
    return items.last()
  }

  deleteById(id: number) {
    return this.deleteItem(this.items.find(value => {return value.id == id}))
  }

}