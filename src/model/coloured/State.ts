import {ColouredItem} from "../common/Base"
import Note from "../Note"

export default class State extends ColouredItem {

  statedNotes: Set<Note> = new Set<Note>()

  constructor(name: string, colour: string) {
    super(name, colour)
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