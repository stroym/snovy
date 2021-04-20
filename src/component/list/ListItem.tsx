import React, {useRef} from "react"
import {EditableInput} from "../inputs/Input"

interface ListItemProps<T extends Record<string, any>> extends React.HTMLProps<HTMLInputElement> {
  mapped: T
  active: boolean
  selected: boolean
  onItemClick: (item: T) => void
  onContext?: (item: T) => void
  onValueChange?: (str: string) => void
}

const ListItem = <T extends Record<string, any>>(
  {mapped, active, selected, onItemClick, onContext, onValueChange, ...props}: ListItemProps<T>
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
      {...props} ref={selfRef}
      className={`snovy-list-item styled-hover ${active ? "active-item" : selected ? "selected-item" : ""}`}
      placeholder="Title"
      onValueChange={onValueChange}
      value={mapped.toString()}
      onClick={() => {onItemClick(mapped)}} onFocus={handleFocus} onContextMenu={handleContext}
    />
  )

}

export default ListItem