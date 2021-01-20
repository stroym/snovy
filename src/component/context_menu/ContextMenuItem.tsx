import React from "react"
import {Action} from "./ContextMenu"

export const ContextMenuItem = (props: {
  action: Action,
  execute: () => any
}) => {

  const handleClick = () => {
    props.action.execute()
    props.execute()
  }

  return (
    <li onClick={handleClick}>{props.action.text}</li>
  )

}

export default ContextMenuItem