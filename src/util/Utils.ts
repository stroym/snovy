import {Key} from "ts-key-enum"

export function isArray<T>(arg: unknown): arg is Array<T> {
  return arg instanceof Array
}

export function isItem<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined
}

export function useKey(e: React.KeyboardEvent, mappings: Array<{ key: Key, handler: () => void }>) {
  const mapping = mappings.find(it => it.key == e.key)

  if (mapping) {
    mapping.handler()
  }
}