import Note from "./Note";
import Notebook from "./Notebook";
import {Holder} from "./Base";

export default class Section extends Holder<Note, Notebook> {

  get notes(): Array<Note> {
    return this.items;
  }

  //for testing purposes
  static WithData(parent: Notebook, id: number, name: string, order: number): Section {
    return new Section(parent, id, name, order);
  }

  insert() {
    this.addItem(new Note(this, this.idCounter, "", this.items.length));
  }

  deleteNote(note: Note) {
    this.deleteItem(note);
  }

  insertAt(order: number) {
    this.addItem(new Note(this, this.idCounter, "", order), true);
  }

  addNote() {
    this.addItem(Note.WithData(this, this.idCounter, "note " + this.idCounter, this.items.length));
  }

}