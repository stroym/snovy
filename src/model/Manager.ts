import Notebook from "./Notebook";
import {OrphanHolder} from "./Base";

export default class Manager extends OrphanHolder<Notebook> {

  // tags: Set<Tag> = new Set<Tag>();         //global tags
  // states: Set<string> = new Set<string>(); //global states

  //testing data
  constructor() {
    super(0, "", 0); //TODO there's gotta be a better way to do this
    for (let i = 0; i < 3; i++) {
      this.addNotebook("notebook " + i, i);
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i];

      for (let j = 0; j < i + 4; j++) {
        notebook.addSection();
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i];

      for (let j = 0; j < notebook.sections.length; j++) {
        let section = notebook.sections[j];

        for (let k = 0; k < j + 5; k++) {
          section.addNote();
        }
      }
    }
  }

  get notebooks() {
    return this.itemsSortedById;
  }

  addNotebook(name: string, order: number) {
    this.addItem(new Notebook(this, this.idCounter, name, order));
  }

  removeNotebook(item: Notebook) {
    this.deleteItem(item);
  }

}