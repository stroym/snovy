import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Note from "./model/Note"
import Scope from "./model/Scope"
import {dexie} from "../index"
import Tag from "./model/Tag"
import {notebookId} from "./Database"

const content =
  "# asdasddsasd\n" +
  "\n" +
  "\n" +
  "asdasddasd\n" +
  "\n" +
  "\n" +
  "- adasdadasd\n" +
  "- asdasdsdd\n" +
  "\n" +
  "\n" +
  "asdasdad [link](https://codesandbox.io/s/pyoy0on510?file=/MyEditor.js)\n"

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

async function addNotebook(name: string) {
  return await dexie.transaction("rw", dexie.notebooks, async () => {
    return await dexie.notebooks.add(new Notebook(name)).then(id => {return id})
  })
}

async function addSection(notebookId: number, order: number) {
  return await dexie.transaction("rw", dexie.notebooks, dexie.sections, async () => {
    return await dexie.sections.add(new Section(notebookId, "section " + order, order)).then(id => {return id})
  })
}

function makeNote(sectionId: number, order: number) {
  const temp = new Note(sectionId, "note " + order, order)
  temp.content = "content " + order + "\n" + content

  return temp
}

async function addNote(notebookId: number, sectionId: number, order: number) {
  await dexie.transaction("rw", dexie.notes, dexie.tags, dexie.scopes, async () => {
    await dexie.notes.add(makeNote(sectionId, order)).then(async (id) => {await tagNote(notebookId, id)})
  })
}

async function addTag(scopeId?: number) {
  await dexie.transaction("rw", dexie.tags, dexie.scopes, async () => {
    if (scopeId) {
      const scope = (await dexie.scopes.get(scopeId))!

      await dexie.tags.add(new Tag(randomString(randomNumber(8)), scope.color, scope.id))
    } else {
      await dexie.tags.add(new Tag(randomString(randomNumber(8)), randomColor(), scopeId))
    }
  })
}

async function addScope(unique?: boolean) {
  return await dexie.transaction("rw", dexie.scopes, async () => {
    return await dexie.scopes.add(
      new Scope(randomString(randomNumber(10)), randomColor(), unique)
    ).then(id => {return id})
  })
}

async function tagNote(ntbId: number, noteId: number) {
  await dexie.transaction("rw", dexie.notes, dexie.tags, dexie.scopes, async () => {
    const tags = await dexie.tags.where(notebookId).equals(ntbId).toArray()
    const note = (await dexie.notes.get(noteId))!

    const shuffledIds = tags.map(it => it.id)
      .map((a) => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)

    for (let i = 0; i < shuffledIds.length && i < 20; i++) {
      note.tagIds.push(shuffledIds[i])
    }

    await dexie.notes.put(note)
  })
}

export default async function generate() {
  console.log("generating...")

  for (let i = 0; i < 3; i++) {
    const notebookId = (await addNotebook("" + randomNumber(100000, 10000)))!

    for (let j = 0; j < randomNumber(20, 8); j++) {
      const scopeId = (await addScope(j % 3 == 0))

      for (let k = 0; k < randomNumber(20, 4); k++) {
        await addTag(scopeId)

        if (j % 2 == 0) {
          await addTag(undefined)
        }

        if (j % 3 == 0 && k > randomNumber(4, 1)) {
          break
        }
      }
    }

    for (let j = 0; j < i + 4; j++) {
      const sectionId = (await addSection(notebookId, j))

      for (let k = 0; k < 5 + j * 5; k++) {
        await addNote(notebookId, sectionId, k)
      }
    }
  }

  return await dexie.notebooks.toArray()
}