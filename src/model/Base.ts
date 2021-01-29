declare global {
  interface Array<T> {
    first(): T | undefined,

    last(): T | undefined

    delete(item: T): number
  }
}

Array.prototype.first = function <T>(): T | undefined {
  return this.length > 0 ? this[0] : undefined
}

Array.prototype.last = function <T>(): T | undefined {
  return this.length > 0 ? this[this.length - 1] : undefined
}

Array.prototype.delete = function <T>(item: T): number {
  let index = this.indexOf(item)
  this.splice(index, 1)
  return index
}

export abstract class Item {

  readonly id: number

  readonly createdAt: Date
  changedAt: Date //TODO wire up changes

  name: string

  protected constructor(id: number, name: string) {
    this.id = id
    this.name = name
    this.createdAt = new Date()
    this.changedAt = this.createdAt
  }

  rename(newName: string) {
    this.name = newName
  }

  toString(): string {
    return this.name
  }

}

export abstract class OrderedItem extends Item {

  order: number

  protected constructor(id: number, name: string, order: number) {
    super(id, name)
    this.order = order
  }

}

export interface ParentInterface<T extends OrderedItem> {

  idCounter: number

  items: Array<T>

  itemsSortedById: Array<T>
  itemsSortedAlphabetically: Array<T>
  itemsSortedByOrder: Array<T>

  addItem: (item: T, reorder: boolean) => void

  deleteItem: (item: T) => void
  deleteById: (id: number) => boolean

}

export abstract class ItemWithParent<P extends ParentInterface<any>> extends OrderedItem {

  parent: P

  constructor(parent: P, id: number, name: string, order: number) {
    super(id, name, order)
    this.parent = parent
  }

}

export abstract class ItemWithParentAndChildren<T extends OrderedItem, P extends ParentInterface<any>> extends ItemWithParent<P> implements ParentInterface<T> {

  idCounter: number = 0

  items: Array<T> = new Array<T>()

  constructor(parent: P, id: number, name: string, order: number) {
    super(parent, id, name, order)
  }

  get itemsSortedById() {
    return this.sortBy((a: T, b: T) => { return a.id - b.id})
  }

  get itemsSortedAlphabetically() {
    return this.sortBy((a: T, b: T) => {return a.name.localeCompare(b.name)})
  }

  get itemsSortedByOrder() {
    return this.sortBy((a: T, b: T) => {return a.order - b.order})
  }

  deleteItem(item: T) {
    let index = this.items.delete(item)

    this.items.slice(index).forEach(value => { value.order--})
  }

  addItem(item: T, reorder: boolean = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++
  }

  private sortBy(compareFn: (a: T, b: T) => number): Array<T> {
    return this.items.sort(compareFn)
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

  abstract insertAt(order: number): void;

  abstract insert(): void;

}