import React from "react"
import {Key} from "ts-key-enum"

export function isArray<T>(arg: unknown): arg is Array<T> {
  return Array.isArray(arg)
}

export function isItem<T>(arg: T | null | undefined): arg is T {
  return arg !== undefined
}

export function isBlank(string: string | undefined | null) {
  return !string || string.isBlank()
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

/**
 * Helper for component className composition. Removes the need for manual blank/condition checks and adding spaces.
 * @param className if undefined, an empty string is used, otherwise this string with prepended space
 * @param condition
 * @return className if condition is true or undefined and className is not blank, empty string otherwise
 */
export function cls(className: string | undefined | null, condition?: boolean) {
  const temp = isBlank(className) ? "" : " " + className

  if (condition == undefined) {
    return temp
  } else {
    return condition ? temp : ""
  }
}

/**
 * Compares if the two passed arrays contain the same elements, regardless of their order.
 * @param array1
 * @param array2
 * @return true if arrays contain the same elements, false otherwise
 */
export function compareArrayContents<T>(array1: Array<T> | null | undefined, array2: Array<T> | null | undefined) {
  if (Array.isArray(array1) && Array.isArray(array2)) {
    return array1.length == array2.length && array1.every(el => array2.includes(el))
  } else {
    return false
  }
}