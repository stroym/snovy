import React from "react"
import {AlignableProps, OrientableProps, Orientation} from "./TabMenu"
import {cls} from "../../util/utils"
import {default as UpArrow} from "../../../public/icons/arrows/up.svg"
import {default as RightArrow} from "../../../public/icons/arrows/right.svg"
import {default as DownArrow} from "../../../public/icons/arrows/down.svg"
import {default as LeftArrow} from "../../../public/icons/arrows/left.svg"
import {activeItem} from "../../util/classes"
import {useToggle} from "../../util/hooks"

//TODO remove alignment from TabMenuItem?
export interface TabMenuItemProps extends AlignableProps, React.HTMLProps<HTMLDivElement> {
  icon?: JSX.Element
  tooltip?: string
  viewable?: { text: string, active: string, onActiveChange: (text: string) => void }
}

const TabMenuItem = (
  {alignment: _alignment, onClick, icon, tooltip, viewable, ...props}: TabMenuItemProps) => {

  return (
    <div
      {...props} data-tip={tooltip} tabIndex={0}
      className={"snovy-tab-menu-item styled-hover".concat(
        cls("icon", icon != undefined),
        cls(activeItem, viewable != undefined && viewable.active == viewable.text)
      )}
      onClick={e => {
        onClick && onClick(e)
        viewable && viewable.onActiveChange(viewable.text)
      }}
    >
      {icon ?? viewable?.text}
    </div>
  )

}

export const CollapseTabMenuItem = (
  {alignment: _alignment, orientation, onClick}: AlignableProps & OrientableProps & React.HTMLProps<HTMLDivElement>
) => {

  const [toggled, , toggle] = useToggle()

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

    return toggled ? onIcon : offIcon
  }

  return <TabMenuItem
    icon={getIcon()}
    tooltip={toggled ? "Expand" : "Collapse"}
    onClick={e => {
      toggle()
      onClick && onClick(e)
    }}
  />

}

export default TabMenuItem