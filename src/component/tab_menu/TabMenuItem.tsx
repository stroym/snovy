import React from "react"
import {Alignment} from "./TabMenu"
import {css, useTheme} from "@emotion/react"

export interface TabMenuItemProps {
  alignment: Alignment
  text: string
  onClick: (text: string) => void
  active: boolean
  icon?: boolean
}

const TabMenuItem = (props: TabMenuItemProps) => {

  const theme = useTheme()

  const emotionCss = css`
    ${props.active && `background-color: ${theme.activeItem};`}
    &:hover {
      background-color: ${theme.hover};
    }
  `

  return (
    <div
      css={emotionCss} className={`snovy-tab-menu-item ${props.alignment} ${props.icon ? "icon" : ""}`}
      onClick={() => props.onClick(props.text)}
    >
      {props.text}
    </div>
  )

}

export function makeTab(text: string, alignment: Alignment, onClick: (text: string) => void, active: string, icon = false) {
  return (
    <TabMenuItem
      key={text} text={text} alignment={alignment} onClick={onClick} active={text == active} icon={icon}
    />
  )
}

export default TabMenuItem