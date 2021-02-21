import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Note from "./model/Note"
import Scope from "./model/colored/Scope"
import Manager from "./model/Manager"

const content =
  "# asdasddsasd\n" +
  "\n" +
  "\n" +
  "asdasddasd\n" +
  "\n" +
  "\n" +
  "- adasdadasd\n" +
  "- asdasdsdd\n" +
  "asdasdad [link](https://codesandbox.io/s/pyoy0on510?file=/MyEditor.js) \n" +
  "\n" +
  "\n" +
  "https://codesandbox.io/s/pyoy0on510?file=/MyEditor.js\n"

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

function addNotebook(target: Manager, name: string, order = 999) {
  return target.addItem(new Notebook(target, target.idCounter, name, order))
}

function addSection(target: Notebook) {
  target.addItem(new Section(target, target.idCounter, "section " + target.idCounter, target.items.length))
}

function addNote(target: Section) {
  const temp = new Note(target, target.idCounter, "note " + target.idCounter, target.items.length)
  temp.content = "content " + target.idCounter + "\n" + content
  tagNote(target.parent, temp)

  target.addItem(temp)
}

function addTestTag(target: Notebook, name: string, color: string, scope?: Scope) {
  target.sets.addTag(name, color, scope)
}

function addTestScope(target: Notebook, name: string, color: string, unique?: boolean) {
  return target.sets.addScope(name, color, unique)
}

function tagNote(notebook: Notebook, target: Note) {
  for (let i = 0; i < 50; i++) {
    const tag = notebook.sets.tags[Math.floor(Math.random() * (notebook.sets.tags.length))]
    target.tag(tag)
  }
}

export default function generate(manager: Manager) {

  const notebooks = new Array<Notebook>()

  for (let i = 0; i < 10; i++) {

    const notebook = addNotebook(manager, "" + randomNumber(1000, 100), i)

    for (let j = 0; j < randomNumber(8, 4); j++) {
      const scope = addTestScope(notebook, randomString(randomNumber(20)) + j, randomColor(), j % 2 == 0)

      for (let k = 0; k < randomNumber(8, 2); k++) {
        addTestTag(notebook, j + randomString(randomNumber(8)) + k, scope.color, scope)

        if (scope.unique) {
          break
        }
      }
    }

    for (let k = 0; k < randomNumber(12, 6); k++) {
      addTestTag(notebook, randomString(randomNumber(8)), randomColor(), undefined)
    }

    for (let j = 0; j < i + 4; j++) {
      addSection(notebook)

      const section = notebook.items[j]

      for (let k = 0; k < 5 + j * 10; k++) {
        addNote(section)
      }
    }
  }
}