import React, {useRef} from "react"
import {EditableInput} from "../inputs/Input"
import {GenericItem} from "../../util/types"
import {cls} from "../../util/utils"
import {activeItem, selectedItem} from "../../util/classes"

interface ListItemProps<T extends GenericItem> extends React.HTMLProps<HTMLInputElement> {
  mapped: T
  active: boolean
  selected: boolean
  onItemClick: (item: T) => void
  onContext?: (item: T) => void
  onValueChange?: (str: string) => void
}

const ListItem = <T extends GenericItem>(
  {className, mapped, active, selected, onItemClick, onContext, onValueChange, ...props}: ListItemProps<T>
) => {

  const selfRef = useRef<HTMLInputElement>(null)

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    onContext && onContext(mapped)
  }

  const handleFocus = () => {
    if (selfRef.current) {
      selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
    }
  }

  return (
    <EditableInput
      {...props} ref={selfRef} placeholder="Title" onValueChange={onValueChange} value={mapped.toString()}
      onClick={() => {onItemClick(mapped)}} onFocus={handleFocus} onContextMenu={handleContext}
      className={"snovy-list-item styled-hover".concat(
        cls(className),
        cls(selectedItem, selected),
        cls(activeItem, active)
      )}
    />
  )

}

export default ListItem