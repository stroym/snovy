import React, {useState} from "react"
import {Alignment, Orientation} from "./TabMenu"
import {css, useTheme} from "@emotion/react"
import {arrows} from "../../util/values"

export interface TabMenuItemProps extends React.HTMLProps<HTMLDivElement> {
  alignment: Alignment
  text: string
  onActiveChange: (text: string) => void
  active: string
  icon?: boolean
  tooltip?: string
}

export interface CollapseTabMenuItemProps extends React.HTMLProps<HTMLDivElement> {
  alignment: Alignment
  orientation: Orientation
  onActiveChange: () => void
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
      onClick={() => onActiveChange(text)} data-tip={tooltip} tabIndex={0}
    >
      {text}
    </div>
  )

}

export const CollapseTabMenuItem = ({alignment, orientation, onActiveChange}: CollapseTabMenuItemProps) => {

  const [toggle, setToggle] = useState(false)

  const getText = () => {
    let chars

    switch (orientation) {
      case Orientation.TOP:
        chars = [arrows.DOWN, arrows.UP]
        break
      case Orientation.BOTTOM:
        chars = [arrows.UP, arrows.DOWN]
        break
      case Orientation.LEFT:
        chars = [arrows.RIGHT, arrows.LEFT]
        break
      case Orientation.RIGHT:
        chars = [arrows.LEFT, arrows.RIGHT]
    }

    return toggle ? chars[1] : chars[0]
  }

  return <TabMenuItem
    text={getText()} alignment={alignment} active="" icon
    onActiveChange={() => {
      setToggle(!toggle)
      onActiveChange()
    }}
  />

}

export default TabMenuItem