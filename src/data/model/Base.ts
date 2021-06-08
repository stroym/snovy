import {isArray, isItem} from "../../util/utils"

export abstract class Table {

  id!: number
  readonly createdAt: Date
  updatedAt: Date

  protected constructor(id?: number) {
    if (id) this.id = id
    this.createdAt = new Date()
    this.updatedAt = this.createdAt
  }

  static compareById = (a: Table, b: Table) => { return a.id - b.id}

  abstract save(): Promise<this>

  abstract load(): Promise<this>

  abstract delete(): Promise<boolean>

}

export abstract class Titled extends Table {

  title: string

  protected constructor(title: string, id?: number) {
    super(id)
    this.title = title
  }

  //TODO try to have locales in settings?
  static compareByTitle = (a: Titled, b: Titled) => {return a.title.localeCompare(b.title, navigator.language)}

  toString(): string {
    return this.title
  }

  async updateTitle(newTitle: string) {
    this.title = newTitle
    await this.save()
  }

}

export abstract class Ordered extends Titled {

  order: number

  protected constructor(title: string, order: number, id?: number) {
    super(title, id)
    this.order = order
  }

  static compareByOrder = (a: Ordered, b: Ordered) => {return a.order - b.order}

  async updateOrder(newOrder: number) {
    this.order = newOrder
    await this.save()
  }

}

export abstract class Colored extends Titled {

  color: string

  protected constructor(title: string, color: string, id?: number) {
    super(title, id)
    this.color = color
  }

  async updateColor(newColor: string) {
    this.color = newColor
    await this.save()
  }

}

export async function addTo<T extends Table>(items: Array<T>, toAdd: T) {
  if (isArray<Ordered>(items) && toAdd instanceof Ordered) {
    await reorder(items, toAdd)
  }

  items.push(toAdd)
  return await toAdd.save()
}

export async function removeFrom<T extends Table>(items: Array<T>, toRemove?: T | Array<T>) {
  if (isArray(toRemove)) {
    let index

    for (const item of toRemove) {
      index = await remove(items, item)
    }

    return fetchItem(items, index)
  } else if (isItem(toRemove)) {
    return fetchItem(items, await remove(items, toRemove))
  } else {
    return undefined
  }
}

async function remove<T extends Table>(items: Array<T>, toRemove: T) {
  const index = items.delete(toRemove)
  await toRemove.delete()

  if (isArray<Ordered>(items) && toRemove instanceof Ordered) {
    await reorder(items, toRemove, "down")
  }

  return index
}

function fetchItem<T>(items: Array<T>, index: number) {
  if (index > 0) {
    return items[index - 1]
  } else if (index == 0 && items.length >= 1) {
    return items[index]
  } else {
    return undefined
  }
}

async function reorder<T extends Ordered>(items: Array<T>, item: T | Array<T>, direction: "up" | "down" = "up") {
  if (isArray(item)) {
    !item.isEmpty() && await moveBy(items, item.first()!.order, direction == "up" ? item.length : -item.length)
  } else {
    await moveBy(items, item.order, direction == "up" ? 1 : -1)
  }
}

async function moveBy<T extends Ordered>(items: Array<T>, from: number, amount: number) {
  if (from != items.length) {

    for (const item of items.sort(Ordered.compareByOrder).slice(from)) {
      await item.updateOrder(item.order + amount)
    }
  }
}