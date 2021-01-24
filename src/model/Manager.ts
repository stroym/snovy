import Notebook from "./Notebook"
import {ParentInterface} from "./Base"
import Tag, {Category} from "./Tag"
import Section from "./Section"
import Note from "./Note"

export default class Manager implements ParentInterface<Notebook> {

  idCounter: number = 0
  idCounterTag: number = 0

  singleNotebook: boolean = false //probably should be in an options class

  items: Array<Notebook> = new Array<Notebook>()
  tags: Array<Tag> = new Array<Tag>()         //global tags
  states: Array<string> = new Array<string>() //global states

  //testing data
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.addTestTag("tag " + i)
    }

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

  addTag(tag: Tag) {
    this.tags.push(tag)
    this.idCounterTag++
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
    this.tagNote(temp)

    target.addItem(temp)
  }

  addTestTag(name: string, category?: Category) {
    this.addTag(new Tag(this.idCounterTag, name, category))
  }

  tagNote(target: Note) {
    for (let i = 0; i < Math.floor(Math.random() * (this.tags.length)); i++) {
      target.tag(this.tags[Math.floor(Math.random() * (this.tags.length))])
    }
  }

}