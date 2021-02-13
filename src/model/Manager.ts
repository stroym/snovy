import Notebook from "./Notebook"
import {IdentifiedItem, Item, OrderedItem, ParentInterface} from "./common/Base"
import Section from "./Section"
import Note from "./Note"
import Scope from "./colored/Scope"

const content =
  "# asdasddsasd\n" +
  "\n" +
  "\n" +
  "asdasddasd\n" +
  "\n" +
  "\n" +
  "dhfgjgfjfjgfjjf\n" +
  "\n" +
  "\n" +
  "- adasdadasd\n" +
  "- asdasdsdd\n" +
  "\n" +
  "\n" +
  "1. asdadada\n" +
  "2. adasddas\n" +
  "\n" +
  "\n" +
  "asdasdad [link](https://codesandbox.io/s/pyoy0on510?file=/MyEditor.js) \n" +
  "\n" +
  "\n" +
  "https://codesandbox.io/s/pyoy0on510?file=/MyEditor.js\n" +
  "\n" +
  "```\n" +
  "asdsadassadasd\n" +
  "asdsadd\n" +
  "a\n" +
  "sfdggfghgfs\n" +
  "```"

function dec2hex(dec: number) {
  return dec.toString(36).padStart(2, "0")
}

function randomString(len: number) {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(Math.floor(Math.random() * (len - 3) + 3))), dec2hex).join("")
}

function randomNumber(max: number, min = 1) {
  return Math.floor(Math.random() * (max - min) + min)
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

export default class Manager implements ParentInterface<Notebook> {

  childName = "notebook"

  idCounter = 0

  items: Array<Notebook> = new Array<Notebook>()

  //testing data
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.addNotebook("" + Math.floor(Math.random() * (1000)), i)
    }

    for (let i = 0; i < this.items.length; i++) {
      const notebook = this.items[i]

      for (let j = 0; j < randomNumber(8, 4); j++) {
        this.addTestScope(notebook, randomString(randomNumber(20)) + j, randomColor(), j % 2 == 0)
        const scope = notebook.sets.scopes[j]

        for (let k = 0; k < randomNumber(8, 2); k++) {
          this.addTestTag(notebook, j + randomString(randomNumber(8)) + k, scope.color, scope)

          if (scope.unique) {
            break
          }
        }
      }

      for (let k = 0; k < randomNumber(12, 6); k++) {
        this.addTestTag(notebook, randomString(randomNumber(8)), randomColor(), undefined)
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
    temp.content = "content " + target.idCounter + "\n" + content
    this.tagNote(target.parent, temp)

    target.addItem(temp)
  }

  addTestTag(target: Notebook, name: string, color: string, scope?: Scope): void {
    target.sets.addTag(name, color, scope)
  }

  addTestScope(target: Notebook, name: string, color: string, unique?: boolean): void {
    target.sets.addScope(name, color, unique)
  }

  tagNote(notebook: Notebook, target: Note): void {
    for (let i = 0; i < 50; i++) {
      const tag = notebook.sets.tags[Math.floor(Math.random() * (notebook.sets.tags.length))]
      target.tag(tag)
    }
  }

}