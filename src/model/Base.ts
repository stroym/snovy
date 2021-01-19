export abstract class Item {

  readonly id: number;
  name: string;
  order: number;

  protected constructor(id: number, name: string, order: number) {
    this.id = id
    this.name = name
    this.order = order
  }

  rename(newName: string) {
    this.name = newName
  }

  toString(): string {
    return this.name
  }

}

export abstract class OrphanHolder<T extends Item> extends Item {

  protected idCounter: number = 0;

  items: Array<T> = new Array<T>();

  get itemsSortedById() {
    return this.items.sort((a: T, b: T) => {
      return a.id - b.id
    })
  }

  get itemsSortedAlphabetically() {
    return this.items.sort((a: T, b: T) => {
      return a.name.localeCompare(b.name)
    })
  }

  get itemsSortedByOrder() {
    return this.items.sort((a: T, b: T) => {
      return a.order - b.order
    })
  }

  deleteItem(item: T) {
    this.items.splice(this.items.indexOf(item), 1)
  }

  deleteById(id: number): boolean {
    let item = this.items.find(value => {
      return value.id == id
    })

    if (item) {
      this.deleteItem(item)
      return true
    } else {
      return false
    }
  }

  protected addItem(item: T, reorder: boolean = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++
  }

}

//TODO try to improve manager, somehow... the OrphanHolder really shouldn't exist
export abstract class Holder<T extends Item, P extends OrphanHolder<any>> extends OrphanHolder<T> {

  parent: P;

  constructor(parent: P, id: number, name: string, order: number) {
    super(id, name, order)
    this.parent = parent
  }

  abstract insertAt(order: number): void;

  abstract insert(item: T): void;

}