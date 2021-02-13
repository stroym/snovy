import React, {useRef, useState} from "react"
import {useRelativePosition} from "../../util/Hooks"

export const ContextMenuItem = (props: {
  icon?: string
  text: string,
  onClick: () => void,
  specialText?: string,
  specialOnClick?: () => void,
  children?: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  const nestedRef = useRef(null)

  const [nested, setNested] = useState(false)
  const position = useRelativePosition(nestedRef, nested)

  return (
    <div className="outer-wrapper" onMouseEnter={() => {setNested(true)}} onMouseLeave={() => {setNested(false)}}>
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
      {props.children && nested &&
      <div ref={nestedRef} className={"nested-context-menu"} style={position}>
        {props.children}
      </div>
      }
    </div>
  )

}

export function makeContext(text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void) {
  return (
    <ContextMenuItem
      key={text} icon={icon} text={text} specialText={specialText} onClick={action} specialOnClick={specialAction}
    />
  )
}

export function makeSharedContext(params: {
  single: { text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void },
  multiple?: { condition: boolean, text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void },
  children?: Array<React.ReactElement<typeof ContextMenuItem>>,
  icon?: string
}) {

  if (params.multiple && params.multiple.condition) {
    return (
      <ContextMenuItem
        key={params.multiple.text} icon={params.single.icon ?? params.icon} text={params.multiple.text}
        specialText={params.multiple.specialText} onClick={params.multiple.action}
        specialOnClick={params.multiple.specialAction}
      >
        {params.children}
      </ContextMenuItem>
    )
  } else {
    return (
      <ContextMenuItem
        key={params.single.text} icon={params.single.icon ?? params.icon} text={params.single.text}
        specialText={params.single.specialText} onClick={params.single.action}
        specialOnClick={params.single.specialAction}
      >
        {params.children}
      </ContextMenuItem>
    )
  }

}

export function makeNestedContext(text: string, action: () => void, children: Array<React.ReactElement<typeof ContextMenuItem>>, icon?: string) {
  return (
    <ContextMenuItem key={text} icon={icon} text={text} onClick={action}>
      {children}
    </ContextMenuItem>
  )
}

export default ContextMenuItem