import React, {useContext, useRef} from "react"
import {EditableInput} from "../inputs/Input"
import {css} from "@emotion/react"
import OptionsContext from "../../util/OptionsContext"
import {darken} from "polished"

interface ListItemProps<T extends Record<string, any>> {
  mapped: T
  active: boolean
  selected: boolean
  onClick: (item: T) => void
  onContext?: (item: T) => void
  onValueChange?: (str: string) => void
}

const ListItem = <T extends Record<string, any>>(
  {mapped, active, selected, onClick, onContext, onValueChange}: ListItemProps<T>
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

  const theme = useContext(OptionsContext).theme

  return (
    <EditableInput
      css={css`
        background-color: ${active ? theme.activeItem : selected ? darken(0.05, theme.activeItem) : "transparent"};

        &:hover {
          background-color: ${theme.hover};
        }
      `}
      ref={selfRef} className="snovy-list-item" placeholder="Title" onValueChange={onValueChange}
      value={mapped.toString()}
      onClick={() => {onClick(mapped)}} onFocus={handleFocus} onContextMenu={handleContext}
    />
  )

}

export default ListItem