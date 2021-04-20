import React, {useState} from "react"
import {Alignment, Orientation} from "./TabMenu"
import {cls} from "../../util/utils"
import {default as UpArrow} from "../../../public/icons/arrows/up.svg"
import {default as RightArrow} from "../../../public/icons/arrows/right.svg"
import {default as DownArrow} from "../../../public/icons/arrows/down.svg"
import {default as LeftArrow} from "../../../public/icons/arrows/left.svg"
import {activeItem} from "../../util/classes"

export interface TabMenuItemProps extends React.HTMLProps<HTMLDivElement> {
  alignment: Alignment
  icon?: JSX.Element
  tooltip?: string
  viewable?: { text: string, active: string, onActiveChange: (text: string) => void }
}

export interface CollapseTabMenuItemProps extends React.HTMLProps<HTMLDivElement> {
  alignment: Alignment
  orientation: Orientation
}

const TabMenuItem = (
  {alignment, onClick, icon, tooltip, viewable, ...props}: TabMenuItemProps) => {

  return (
    <div
      {...props} onClick={e => {
      onClick && onClick(e)
      viewable && viewable.onActiveChange(viewable.text)
    }} data-tip={tooltip} tabIndex={0}
      className={"snovy-tab-menu-item styled-hover".concat(
        cls("icon", icon != undefined),
        cls(alignment),
        cls(activeItem, viewable != undefined && viewable.active == viewable.text)
      )}
    >
      {icon ?? viewable?.text}
    </div>
  )

}

export const CollapseTabMenuItem = ({alignment, orientation, onClick}: CollapseTabMenuItemProps) => {

  const [toggle, setToggle] = useState(false)

  const getIcon = () => {
    let onIcon
    let offIcon

    switch (orientation) {
      case Orientation.TOP:
        onIcon = <DownArrow/>
        offIcon = <UpArrow/>
        break
      case Orientation.BOTTOM:
        onIcon = <UpArrow/>
        offIcon = <DownArrow/>
        break
      case Orientation.LEFT:
        onIcon = <LeftArrow/>
        offIcon = <RightArrow/>
        break
      case Orientation.RIGHT:
        onIcon = <RightArrow/>
        offIcon = <LeftArrow/>
    }

    return toggle ? onIcon : offIcon
  }

  return <TabMenuItem
    icon={getIcon()} alignment={alignment}
    onClick={e => {
      setToggle(!toggle)
      onClick && onClick(e)
    }}
  />

}

export default TabMenuItem