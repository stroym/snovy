import {Base} from "./Base";

export default class IdentifiedArray<T extends Base> extends Array<T> {

  idCounter = 0;

  push(...items: T[]): number {
    this.idCounter = items[items.length - 1].id + 1;
    return super.push(...items);
  }

  getNewId(): number {
    return this.idCounter;
  }

  removeItem(item: T) {
    this.splice(this.indexOf(item), 1);
  }

  removeById(id: number): boolean {
    let item = this.find(value => {
      return value.id == id;
    });

    if (item) {
      this.removeItem(item);
      return true;
    } else {
      return false;
    }
  }

  isEmpty(): boolean {
    return this.length > 0;
  }

  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  first(): T | undefined {
    return this.isNotEmpty() ? this[0] : undefined;
  }

  last(): T | undefined {
    return this.isNotEmpty() ? this[this.length - 1] : undefined;
  }

}