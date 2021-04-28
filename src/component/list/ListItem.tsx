import React from "react"
import {EditableInput} from "../inputs/Input"
import {GenericItem} from "../../util/types"
import {cls} from "../../util/utils"
import {activeItem, selectedItem} from "../../util/classes"
import {ListPresets} from "./List"

export interface ListItemProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLLIElement>, "onSelect"> {
  item: T
  active: boolean
  selected: boolean
  onSelect: (item: T) => void
  onContext?: (item: T) => void
  onValueChange?: (str: string) => void
  preset?: ListPresets
  customItem?: (item: T) => React.ReactElement
}

const ListItem = <T extends GenericItem>(
  {
    className,
    item,
    active,
    selected,
    onSelect,
    onContext,
    onValueChange,
    customItem,
    preset,
    ...props
  }: ListItemProps<T>
) => {

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    onContext && onContext(item)
  }

  function resolvePreset() {
    if (customItem) {
      return customItem(item)
    } else {
      switch (preset) {
        case "editable":
          return (
            <EditableInput
              placeholder="Title" onValueChange={onValueChange} value={item.toString()}
              onClick={() => {onSelect(item)}}
            />
          )
        case "simple":
        default:
          return <div className="li-simple-content" tabIndex={0}>{item.toString()}</div>
      }
    }
  }

  return (
    <li
      {...props} onContextMenu={handleContext}
      className={"snovy-list-item styled-hover".concat(
        cls(className),
        cls(selectedItem, selected),
        cls(activeItem, active)
      )}
    >
      {resolvePreset()}
    </li>
  )

}

export default ListItem