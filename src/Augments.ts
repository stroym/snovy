declare global {
  interface Array<T> {
    first(): T | undefined,

    last(): T | undefined

    delete(item: T): number
  }

  interface Set<T> {
    toArray(): Array<T>
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

Set.prototype.toArray = function <T>(): Array<T> {
  return this.size > 0 ? Array.from(this) : []
}

export {}