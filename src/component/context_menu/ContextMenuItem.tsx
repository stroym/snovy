import React from "react"
import {Action} from "./ContextMenu"

export const ContextMenuItem = (props: {
  action: Action,
  onClick: () => any
}) => {

  const handleClick = () => {
    props.action.execute()
    props.onClick()
  }

  return (
    <div className="snovy-context-menu-item" onClick={handleClick}>{props.action.text}</div>
  )

}

export default ContextMenuItem