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

  addItem(item: T, reorder: boolean = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++
  }

  deleteItem(item: T) {
    let index = this.items.indexOf(item)

    this.items.splice(index, 1)

    this.items.slice(index).forEach(value => {
      value.order--
    })
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