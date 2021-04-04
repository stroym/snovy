import React from "react"
import {Alignment} from "./TabMenu"
import {css, useTheme} from "@emotion/react"

export interface TabMenuItemProps extends React.HTMLProps<HTMLDivElement> {
  alignment: Alignment
  text: string
  onActiveChange: (text: string) => void
  active: string
  icon?: boolean
  tooltip?: string
}

const TabMenuItem = (
  {
    alignment,
    text,
    onActiveChange,
    active,
    icon,
    tooltip,
    ...props
  }: TabMenuItemProps) => {

  const theme = useTheme()

  const emotionCss = css`
    ${active == text && `background-color: ${theme.activeItem};`}
    &:hover {
      background-color: ${theme.hover};
    }
  `

  return (
    <div
      {...props} css={emotionCss} className={`snovy-tab-menu-item ${alignment} ${icon ? "icon" : ""}`}
      onClick={() => onActiveChange(text)} data-tip={tooltip}
    >
      {text}
    </div>
  )

}

export default TabMenuItem