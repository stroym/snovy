import Notebook from "./Notebook";
import {Holder} from "./Holder";

export default class Manager extends Holder<Notebook, undefined> {

  // tags: Set<Tag> = new Set<Tag>();         //global tags
  // states: Set<string> = new Set<string>(); //global states

  //testing data
  constructor() {
    super(undefined, 0, "", 0); //TODO there's gotta be a better way to do this
    for (let i = 0; i < 3; i++) {
      this.addNotebook("notebook " + i, i);
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i];

      for (let j = 0; j < 4; j++) {
        notebook.addSection("Section " + j, j);
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      let notebook = this.items[i];

      for (let j = 0; j < notebook.sections.length; j++) {
        let section = notebook.sections[j];

        for (let k = 0; k < 5; k++) {
          section.addNote("note " + k, "content " + k, "", k);
        }
      }
    }
  }

  get notebooks() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.id - b.id;
    });
  }

  get sortedAlphabetically() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.name.localeCompare(b.name);
    });
  }

  get sortedByOrder() {
    return this.items.sort((a: Notebook, b: Notebook) => {
      return a.order - b.order;
    });
  }

  addNotebook(name: string, order: number) {
    this.addItem(new Notebook(this, this.idCounter, name, order));
    this.idCounter++;
  }

  removeNotebook(item: Notebook) {
    this.deleteItem(item);
  }

}