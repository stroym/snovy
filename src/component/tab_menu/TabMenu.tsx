import React, {useEffect, useState} from "react"
import TabMenuItem from "./TabMenuItem"

//TODO possibly start/end aligned menus (but probably not
const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  tabs: Array<{ text: string, default?: boolean }>
  onClick: (active: string | undefined) => any,
}) => {

  const [activeTab, setActiveTab] = useState<string>()

  useEffect(
    () => {
      props.onClick(activeTab)
    }, [activeTab]
  )

  return (
    <div id={props.id} className={"snovy-tab-menu " + props.orientation}>
      {props.tabs.map((tab) =>
        <TabMenuItem key={tab.text} text={tab.text} orientation={props.orientation} active={activeTab == tab.text}
                     default={tab.default} onClick={(active: string) => {setActiveTab(active)}}
        />)
      }
    </div>
  )

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export default TabMenu