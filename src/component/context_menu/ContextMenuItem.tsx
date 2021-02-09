import React from "react"

export const ContextMenuItem = (props: {
  icon?: string
  text: string,
  onClick: () => void
  specialText?: string,
  specialOnClick?: () => void
}) => {

  //TODO duplication issues when clicking special
  return (
    <div className="snovy-context-menu-item" onClick={props.onClick}>
      <span className="context-icon">
        {props.icon}
      </span>
      <span className="context-text">
        {props.text}
      </span>
      {props.specialText &&
      <span className="context-text-special" onClick={props.specialOnClick}>
          {props.specialText}
        </span>
      }
    </div>
  )

}

export default ContextMenuItem