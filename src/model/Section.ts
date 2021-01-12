import Note from "./Note";
import {OrderableBase} from "./Base";
import Tag from "./Tag";
import IdentifiedArray from "./IdentifiedArray";

export default class Section extends OrderableBase {

  notes: IdentifiedArray<Note> = new IdentifiedArray<Note>();

  constructor(id: number, name: string, order: number) {
    super(id, name, order);
  }

  addNote(name: string, order: number, content: string, state: string, tags?: Set<Tag>, archived: boolean = false) {
    this.notes.push(new Note(this.notes.getNewId(), name, order, content, state, tags, archived));
  }

  deleteNote(note: Note) {
    this.notes.removeItem(note);
  }

}