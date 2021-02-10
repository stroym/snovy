import {ColoredItem} from "../common/Base"
import Note from "../Note"

export default class State extends ColoredItem {

  statedNotes: Set<Note> = new Set<Note>()

  constructor(name: string, color: string) {
    super(name, color)
    this.name = name
  }

  addToNote(note: Note) {
    note.state = this
    this.statedNotes.add(note)
  }

  removeFromNote(note: Note) {
    this.statedNotes.delete(note)
    note.state = undefined
  }

  removeFromAllNotes() {
    this.statedNotes.forEach(note => note.unsetState(this))
  }

}