import Note from "./Note";
import Tag from "./Tag";
import Notebook from "./Notebook";
import {ParentedHolder} from "./Base";

export default class Section extends ParentedHolder<Note, Notebook> {

  get notes(): Array<Note> {
    return this.items;
  }

  addNewNote(name: string, order?: number) {
    if (order) {
      this.addItem(new Note(this, this.idCounter, name, "", "new", order), true);
    } else {
      this.addItem(new Note(this, this.idCounter, name, "", "new", this.items.length));
    }
  }

  addNote(name: string, content: string, state: string, order: number, tags?: Set<Tag>, archived: boolean = false) {
    this.addItem(new Note(this, this.idCounter, name, content, state, order, tags, archived));
  }

  deleteNote(note: Note) {
    this.deleteItem(note);
  }

}