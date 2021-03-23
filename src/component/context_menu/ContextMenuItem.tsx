import {css} from "@emotion/react"
import React, {useContext, useRef, useState} from "react"
import {useRelativePosition} from "../../util/Hooks"
import OptionsContext from "../../util/OptionsContext"

export const ContextMenuItem = (props: {
  icon?: string
  text: string,
  onClick: () => void,
  special?: { text: string, onClick: () => void }
  children?: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  const nestedRef = useRef(null)

  const theme = useContext(OptionsContext).theme

  const [nested, setNested] = useState(false)
  const position = useRelativePosition(nestedRef, nested)

  const emotionCss = css`
    &:hover {
      background-color: ${theme.accent};
    }
  `

  return (
    <div
      className="outer-wrapper" onMouseEnter={() => {setNested(true)}} onMouseLeave={() => {setNested(false)}}
      css={css`
        &:hover {
          background-color: ${theme.hover};
        }`
      }
    >
      <div className="snovy-context-menu-item" onClick={props.special ? () => false : props.onClick}>
      <span css={emotionCss} className="context-wrapper" onClick={props.special ? props.onClick : () => false}>
        <span className="context-icon">
          {props.icon}
        </span>
        <span className="context-text">
          {props.text}
        </span>
      </span>
        {/*TODO adjust makers*/}
        {props.special?.text &&
        <span css={emotionCss} className="context-text-special" onClick={props.special.onClick}>
          {props.special.text}
      </span>
        }
      </div>
      {props.children && nested &&
      <div ref={nestedRef} className={"nested-context-menu"} style={{backgroundColor: theme.primary, ...position}}>
        {props.children}
      </div>
      }
    </div>
  )

}

export function makeContext(text: string, action: () => void, icon?: string, specialText?: string, specialAction?: () => void) {
  return (
    <ContextMenuItem
      key={text} icon={icon} text={text} onClick={action} special={{text: specialText, onClick: specialAction}}
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
        key={params.multiple.text} icon={params.single.icon ?? params.icon}
        text={params.multiple.text} onClick={params.multiple.action}
        special={{text: params.multiple.specialText, onClick: params.multiple.specialAction}}
      >
        {params.children}
      </ContextMenuItem>
    )
  } else {
    return (
      <ContextMenuItem
        key={params.single.text} icon={params.single.icon ?? params.icon}
        text={params.single.text} onClick={params.single.action}
        special={{text: params.single.specialText, onClick: params.single.specialAction}}
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