import React from "react"

export const ContextMenuItem = (props: {
  text: string,
  onClick: () => any
}) => {

  return (
    <div className="snovy-context-menu-item" onClick={props.onClick}>{props.text}</div>
  )

}

export default ContextMenuItem