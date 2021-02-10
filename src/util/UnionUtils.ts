export function isArray<T>(arg: Array<T> | T | null | undefined): arg is Array<T> {
  return arg instanceof Array
}

export function isItem<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined
}