import {OrderableBase} from "./Base";

export abstract class HolderItem<P> extends OrderableBase {

  protected parent: P;

  constructor(parent: P, id: number, name: string, order: number) {
    super(id, name, order);
    this.parent = parent;
  }

}

export abstract class Holder<T extends OrderableBase, P> extends HolderItem<P> {

  protected idCounter: number = 0;

  protected items: Array<T> = new Array<T>();

  get itemsSortedById() {
    return this.items.sort((a: T, b: T) => {
      return a.id - b.id;
    });
  }

  get itemsSortedAlphabetically() {
    return this.items.sort((a: T, b: T) => {
      return a.name.localeCompare(b.name);
    });
  }

  get itemsSortedByOrder() {
    return this.items.sort((a: T, b: T) => {
      return a.order - b.order;
    });
  }

  deleteById(id: number): boolean {
    let item = this.items.find(value => {
      return value.id == id;
    });

    if (item) {
      this.deleteItem(item);
      return true;
    } else {
      return false;
    }
  }

  protected addItem(item: T) {
    this.items.push(item);
    this.idCounter++;
  }

  protected deleteItem(item: T) {
    this.items.splice(this.items.indexOf(item), 1);
  }

}