import Note from "./Note";
import {OrderableBase} from "./Base";

export default class Section extends OrderableBase {

  notes: Note[] = new Array<Note>();

  constructor(id: number, name: string, order: number) {
    super(id, name, order);
  }

  addNote(note: Note) {
    this.notes.push(note);
  }

  deleteNote(note: Note) {
    this.notes.splice(this.notes.indexOf(note), 1);
  }

}