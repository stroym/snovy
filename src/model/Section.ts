import Note from "./Note";
import Tag from "./Tag";
import Notebook from "./Notebook";
import {Holder} from "./Holder";

export default class Section extends Holder<Note, Notebook> {

  get notes(): Array<Note> {
    return this.items;
  }

  addNote(name: string, content: string, state: string, order: number, tags?: Set<Tag>, archived: boolean = false) {
    this.addItem(new Note(this, this.idCounter, name, content, state, order, tags, archived));
  }

  deleteNote(note: Note) {
    this.deleteItem(note);
  }

}