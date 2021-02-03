import React from "react"

export const ContextMenuItem = (props: {
  text: string,
  onClick: () => void
}) => {

  return (
    <div className="snovy-context-menu-item" onClick={props.onClick} onContextMenu={(e) => {e.stopPropagation()}}>
      {props.text}
    </div>
  )

}

export default ContextMenuItem