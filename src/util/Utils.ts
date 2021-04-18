import React from "react"
import {Key} from "ts-key-enum"

export function isArray<T>(arg: unknown): arg is Array<T> {
  return arg instanceof Array
}

export function isItem<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined
}

export type KeyMapping = {
  key: Key,
  handler: () => void,
  condition?: boolean,
  modifiers?: { ctrl?: boolean, alt?: boolean, shift?: boolean }
}

export function useKey(e: React.KeyboardEvent, keyMappings: Array<KeyMapping>) {
  const mapping = keyMappings.find(it => it.key == e.key)

  if (mapping) {
    if (mapping.modifiers &&
      (mapping.modifiers.ctrl && !e.ctrlKey ||
        mapping.modifiers.alt && e.altKey ||
        mapping.modifiers.shift && !e.shiftKey)) {
      return
    }

    if (mapping.condition == undefined || mapping.condition) {
      e.preventDefault()
      mapping.handler()
    }
  }
}

export function cls(className: string | undefined, condition?: boolean) {
  const temp = " " + className ?? ""

  if (condition == undefined) {
    return temp
  } else {
    return condition ? temp : ""
  }
}