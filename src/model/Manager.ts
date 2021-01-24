import Notebook from "./Notebook"
import {ParentInterface} from "./Base"
import Tag from "./Tag"
import Section from "./Section"
import Note from "./Note"

export default class Manager implements ParentInterface<Notebook> {

  idCounter: number = 0

  singleNotebook: boolean = false //probably should be in an options class

  items: Array<Notebook> = new Array<Notebook>()
  tags: Set<Tag> = new Set<Tag>()         //global tags
  states: Set<string> = new Set<string>() //global states

  //testing data
  constructor() {
    for (let i = 0; i < 3; i++) {
      this.addNotebook("notebook " + i, i)
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i]

      for (let j = 0; j < i + 4; j++) {
        this.addSection(notebook)

        let section = notebook.sections[j]

        for (let k = 0; k < 5 + j * 10; k++) {
          this.addNote(section)
        }
      }
    }
  }

  get itemsSortedById() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.id - b.id
    })
  }

  get itemsSortedAlphabetically() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.name.localeCompare(b.name)
    })
  }

  get itemsSortedByOrder() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.order - b.order
    })
  }

  get notebooks() {
    return this.itemsSortedById
  }

  addItem(item: Notebook, reorder: boolean = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++
  }

  deleteItem(item: Notebook) {
    let index = this.items.indexOf(item)

    this.items.splice(index, 1)

    this.items.slice(index).forEach(value => {
      value.order--
    })
  }

  deleteById(id: number): boolean {
    let item = this.items.find(value => {
      return value.id == id
    })

    if (item) {
      this.deleteItem(item)
      return true
    } else {
      return false
    }
  }

  removeNotebook(item: Notebook) {
    this.deleteItem(item)
  }

  //for testing purposes
  addNotebook(name: string, order: number) {
    this.addItem(new Notebook(this, this.idCounter, name, order))
  }

  addSection(target: Notebook) {
    target.addItem(new Section(target, target.idCounter, "section " + target.idCounter, target.items.length))
  }

  addNote(target: Section) {
    let temp = new Note(target, target.idCounter, "note " + target.idCounter, target.items.length)
    temp.content = "content " + target.idCounter

    target.addItem(temp)
  }

}