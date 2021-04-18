import React, {useState} from "react"
import {Alignment, Orientation} from "./TabMenu"
import {arrows} from "../../util/values"
import {cls} from "../../util/Utils"

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

  return (
    <div
      {...props} onClick={() => onActiveChange(text)} data-tip={tooltip} tabIndex={0}
      className={"snovy-tab-menu-item styled-hover".concat(
        cls(alignment),
        cls("icon", icon),
        cls("active-item", active == text)
      )}
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