import React from "react"

export const ContextMenuItem = (props: {
  icon?: string
  text: string,
  onClick: () => void
  specialText?: string,
  specialOnClick?: () => void
}) => {

  return (
    <div className="snovy-context-menu-item" onClick={props.specialOnClick ? () => false : props.onClick}>
      <span className="context-wrapper" onClick={props.specialOnClick ? props.onClick : () => false}>
        <span className="context-icon">
          {props.icon}
        </span>
        <span className="context-text">
          {props.text}
        </span>
      </span>
      {props.specialText &&
      <span className="context-text-special" onClick={props.specialOnClick}>
          {props.specialText}
      </span>
      }
    </div>
  )

}

export function buildContext(text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void) {
  return (
    <ContextMenuItem
      key={text} icon={icon} text={text} specialText={specialText} onClick={action} specialOnClick={specialAction}
    />
  )
}

export default ContextMenuItem