import React from "react"
import {Alignment} from "./TabMenu"
import {append, Extras} from "../../util/ComponentUtils"

export interface TabMenuItemProps {
  alignment: Alignment
  text: string
  onClick: (text: string) => void
  active: boolean
  icon?: boolean
}

const TabMenuItem = (props: TabMenuItemProps) => {

  return (
    <div
      className={`snovy-tab-menu-item ${props.alignment}`
        .concat(append(props.active, Extras.ACTIVE), append(props.icon, "icon"))
      }
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