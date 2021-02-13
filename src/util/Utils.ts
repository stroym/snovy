import {Key} from "ts-key-enum"

export function isArray<T>(arg: Array<T> | T | null | undefined): arg is Array<T> {
  return arg instanceof Array
}

export function isItem<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined
}

//FIXME this doesn't work as intended
export function onLeft(e: React.MouseEvent, calledFunction) {
  if (e.button == 0) {
    return calledFunction
  }
}

export function useKey(e: React.KeyboardEvent, mappings: Array<{ key: Key, handler: () => void }>) {
  const mapping = mappings.find(it => it.key == e.key)

  if (mapping) {
    mapping.handler()
  }
}