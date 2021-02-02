import Notebook from "./Notebook"
import {IdentifiedItem, Item, OrderedItem, ParentInterface} from "./common/Base"
import Section from "./Section"
import Note from "./Note"
import Scope from "./coloured/Scope"

export default class Manager implements ParentInterface<Notebook> {

  idCounter: number = 0

  singleNotebook: boolean = false //probably should be in an options class

  items: Array<Notebook> = new Array<Notebook>()
  // tags: Array<Tag> = new Array<Tag>()         //global tags
  // states: Array<string> = new Array<string>() //global states

  //testing data
  constructor() {
    for (let i = 0; i < 1; i++) {
      this.addNotebook("notebook " + i, i)
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i]

      for (let j = 0; j < 6; j++) {
        this.addTestScope(notebook, "scope" + j, "", j % 2 == 0)
        let scope = notebook.sets.scopes[j]

        for (let k = 0; k < 6; k++) {
          this.addTestTag(notebook, j + "t" + k, "", scope)

          if (scope.exclusive) {
            break
          }
        }
      }

      for (let k = 0; k < 10; k++) {
        this.addTestTag(notebook, "t" + k, "", undefined)
      }

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
    return this.items.sort(IdentifiedItem.compareById)
  }

  get itemsSortedAlphabetically() {
    return this.items.sort(Item.compareByName)
  }

  get itemsSortedByOrder() {
    return this.items.sort(OrderedItem.compareByOrder)
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
    this.tagNote(target.parent, temp)

    target.addItem(temp)
  }

  addTestTag(target: Notebook, name: string, colour: string, scope?: Scope) {
    target.sets.addTag(name, colour, scope)
  }

  addTestScope(target: Notebook, name: string, colour: string, exclusive?: boolean) {
    target.sets.addScope(name, colour, exclusive)
  }

  tagNote(notebook: Notebook, target: Note) {
    for (let i = 0; i < 50; i++) {
      let tag = notebook.sets.tags[Math.floor(Math.random() * (notebook.sets.tags.length))]
      target.tag(tag)
    }
  }

}