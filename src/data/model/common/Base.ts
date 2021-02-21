import {WithTitle} from "../../../component/list/List"

export class Item implements WithTitle {

  title: string

  readonly createdAt: Date
  changedAt: Date //TODO wire up changes

  protected constructor(title: string) {
    this.title = title
    this.createdAt = new Date()
    this.changedAt = this.createdAt
  }

  static compareByName = (a: Item, b: Item) => { return a.title.localeCompare(b.title, undefined, {numeric: true})}

  rename(newTitle: string) {
    this.title = newTitle
  }

  toString(): string {
    return this.title
  }

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

export abstract class ColoredItem extends Item {

  color: string

  protected constructor(name: string, color: string) {
    super(name)
    this.color = color
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

interface BaseInterface<T extends IdentifiedItem> {

  idCounter: number

  itemsSortedAlphabetically: Array<T>

  deleteItem: (item?: T) => T | undefined
  deleteById: (id: number) => T | undefined
  deleteItems: (items: Array<T>) => T | undefined

}

export interface WithChildren<T extends IdentifiedItem> extends BaseInterface<T> {

  addItem: (item: T) => void
  insert: (name?: string) => T

}

export interface WithOrderedChildren<T extends OrderedItem> extends BaseInterface<T> {

  itemsSortedByOrder: Array<T>

  addItem: (item: T, reorder: boolean) => void
  insert: (order?: number, name?: string) => T

}