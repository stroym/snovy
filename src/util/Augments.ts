declare global {

  interface Array<T> {
    first(): T | undefined,

    last(): T | undefined

    delete(item: T): number

    isEmpty(): boolean
  }

  interface Set<T> {
    toArray(): Array<T>
  }

  interface String {
    isBlank(): boolean
  }

}

Array.prototype.first = function <T>(): T | undefined {
  return this.length > 0 ? this[0] : undefined
}

Array.prototype.last = function <T>(): T | undefined {
  return this.length > 0 ? this[this.length - 1] : undefined
}

Array.prototype.delete = function <T>(item: T): number {
  const index = this.indexOf(item)
  this.splice(index, 1)
  return index
}

Array.prototype.isEmpty = function (): boolean {
  return this.length == 0
}

Set.prototype.toArray = function <T>(): Array<T> {
  return this.size > 0 ? Array.from(this) : []
}

String.prototype.isBlank = function (): boolean {
  return this.length == 0 || this.trim().length == 0
}

export {}