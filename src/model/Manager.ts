import Notebook from "./Notebook"
import {IdentifiedItem, Item, OrderedItem, ParentInterface} from "./common/Base"
import Section from "./Section"
import Note from "./Note"
import Scope from "./coloured/Scope"

function dec2hex(dec: number) {
  return dec.toString(36).padStart(2, "0")
}

function randomString(len: number) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.floor(Math.random() * (len - 3) + 3))), dec2hex).join("")
}

export default class Manager implements ParentInterface<Notebook> {

  idCounter = 0

  items: Array<Notebook> = new Array<Notebook>()

  //testing data
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.addNotebook("" + Math.floor(Math.random() * (1000)), i)
    }

    for (let i = 0; i < this.items.length; i++) {
      const notebook = this.items[i]

      for (let j = 0; j < 6; j++) {
        this.addTestScope(notebook, randomString(20) + j, "", j % 2 == 0)
        const scope = notebook.sets.scopes[j]

        for (let k = 0; k < 6; k++) {
          this.addTestTag(notebook, j + randomString(10) + k, "", scope)

          if (scope.exclusive) {
            break
          }
        }
      }

      for (let k = 0; k < 10; k++) {
        this.addTestTag(notebook, randomString(10), "", undefined)
      }

      for (let j = 0; j < i + 4; j++) {
        this.addSection(notebook)

        const section = notebook.sections[j]

        for (let k = 0; k < 5 + j * 10; k++) {
          this.addNote(section)
        }
      }
    }
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

  get notebooks(): Array<Notebook> {
    return this.itemsSortedById
  }

  insert(name: string) {
    return this.addItem(new Notebook(this, this.idCounter, name, this.items.length))
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
      return null
    } else {
      const index = this.items.delete(item)

      this.items.slice(index).forEach(value => { value.order--})

      return index > 0 ? this.items[index - 1] : null
    }
  }

  deleteById(id: number) {
    return this.deleteItem(this.items.find(value => {return value.id == id}))
  }

  removeNotebook(item: Notebook): void {
    this.deleteItem(item)
  }

  //for testing purposes
  addNotebook(name: string, order = 999): void {
    this.addItem(new Notebook(this, this.idCounter, name, order))
  }

  addSection(target: Notebook): void {
    target.addItem(new Section(target, target.idCounter, "section " + target.idCounter, target.items.length))
  }

  addNote(target: Section): void {
    const temp = new Note(target, target.idCounter, "note " + target.idCounter, target.items.length)
    temp.content = "content " + target.idCounter
    this.tagNote(target.parent, temp)

    target.addItem(temp)
  }

  addTestTag(target: Notebook, name: string, colour: string, scope?: Scope): void {
    target.sets.addTag(name, colour, scope)
  }

  addTestScope(target: Notebook, name: string, colour: string, exclusive?: boolean): void {
    target.sets.addScope(name, colour, exclusive)
  }

  tagNote(notebook: Notebook, target: Note): void {
    for (let i = 0; i < 50; i++) {
      const tag = notebook.sets.tags[Math.floor(Math.random() * (notebook.sets.tags.length))]
      target.tag(tag)
    }
  }

}