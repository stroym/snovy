import React, {useEffect, useRef} from "react"
import {Extras} from "../../util/ComponentUtils"
import {EditableInput} from "../inputs/Input"

const ListItem = <T extends Record<string, any>>(props: {
  mapped: T,
  active: boolean,
  selected: boolean,
  onClick: (item: T) => void,
  onContext?: (item: T) => void,
  onValueChange?: (str: string) => void
}) => {

  const selfRef = useRef<HTMLInputElement>(null)

  useEffect(
    () => {
      if (props.active) {
        selfRef.current?.classList.add(Extras.ACTIVE)
      } else {
        selfRef.current?.classList.remove(Extras.ACTIVE)
      }

      if (props.selected) {
        selfRef.current?.classList.add(Extras.SELECTED)
      } else {
        selfRef.current?.classList.remove(Extras.SELECTED)
      }
    }, [props.active, props.selected]
  )

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onContext && props.onContext(props.mapped)
  }

  const handleFocus = () => {
    if (selfRef.current) {
      selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
    }
  }

  return (
    <EditableInput
      ref={selfRef} className="snovy-list-item" placeholder={"Title"} onValueChange={props.onValueChange}
      value={props.mapped.toString()}
      onClick={() => {props.onClick(props.mapped)}} onFocus={handleFocus} onContextMenu={handleContext}
    />
  )

}

export default ListItem