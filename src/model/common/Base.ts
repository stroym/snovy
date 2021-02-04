export class Item {

  name: string

  readonly createdAt: Date
  changedAt: Date //TODO wire up changes

  protected constructor(name: string) {
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

  static compareByName = (a: Item, b: Item) => { return a.name.localeCompare(b.name, undefined, {numeric: true})}

  static make(name: string) {
    return new Item(name)
  }

}

export abstract class IdentifiedItem extends Item {

  readonly id: number

  protected constructor(id: number, name: string) {
    super(name)
    this.id = id
  }

  static compareById = (a: IdentifiedItem, b: IdentifiedItem) => { return a.id - b.id}

}

export abstract class ColouredItem extends Item {

  colour: string

  protected constructor(name: string, colour: string) {
    super(name)
    this.colour = colour
  }

}

export abstract class OrderedItem extends IdentifiedItem {

  order: number

  protected constructor(id: number, name: string, order: number) {
    super(id, name)
    this.order = order
  }

  static compareByOrder = (a: OrderedItem, b: OrderedItem) => {return a.order - b.order}

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

  idCounter = 0

  items: Array<T> = new Array<T>()

  constructor(parent: P, id: number, name: string, order: number) {
    super(parent, id, name, order)
  }

  get itemsSortedById() {
    return this.sortBy(IdentifiedItem.compareById)
  }

  get itemsSortedAlphabetically() {
    return this.sortBy(Item.compareByName)
  }

  get itemsSortedByOrder() {
    return this.sortBy(OrderedItem.compareByOrder)
  }

  deleteItem(item: T) {
    const index = this.items.delete(item)

    this.items.slice(index).forEach(value => { value.order--})
  }

  addItem(item: T, reorder = false) {
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
    const item = this.items.find(value => {
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