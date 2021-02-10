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
  childName?: string

  items: Array<T>

  itemsSortedById: Array<T>
  itemsSortedAlphabetically: Array<T>
  itemsSortedByOrder: Array<T>

  addItem: (item: T, reorder: boolean) => void
  insert: (order?: number, name?: string) => T

  deleteItem: (item?: T) => T | undefined
  deleteById: (id: number) => T | undefined
  deleteItems: (items: Array<T>) => T | undefined

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

  childName?: string

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

  private sortBy(compareFn: (a: T, b: T) => number): Array<T> {
    return this.items.sort(compareFn)
  }

  addItem(item: T, reorder = false) {
    if (reorder) {
      this.itemsSortedByOrder.slice(item.order).forEach(value => {
        value.order++
      })
    }

    this.items.push(item)
    this.idCounter++

    return item
  }

  deleteItem(item?: T) {
    if (!item) {
      return undefined
    } else {
      const index = this.items.delete(item)

      this.items.slice(index).forEach(value => { value.order--})

      if (index > 0) {
        return this.items[index - 1]
      } else if (index == 0 && this.items.length > 0) {
        return this.items[index]
      } else {
        return undefined
      }
    }
  }

  deleteItems(items: Array<T>) {
    let item
    items.forEach(it => {item = this.deleteItem(it)})
    return item
  }

  deleteById(id: number) {
    return this.deleteItem(this.items.find(value => {return value.id == id}))
  }

  abstract insert(order?: number, name?: string): T;

}