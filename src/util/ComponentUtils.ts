export enum Extras {
  ACTIVE = "active",
  SELECTED = "selected",
  HOVER = "hover",
  CONTEXT = "active-context",
  EDITABLE = "editable",
  DISABLED = "disabled",
  HIDDEN = "hidden",
  MOUSE_FOCUS = "mouse-focus"
}

export function append(condition: any, value: string) {
  return condition ? " " + value : ""
}

export function concatUnknown(name: string, rest: string | undefined) {
  return name + (rest ? " " + rest : "")
}