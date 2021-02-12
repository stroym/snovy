import React, {useEffect, useState} from "react"
import TabMenuItem from "./TabMenuItem"

const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  startTabs?: Array<Tab>
  endTabs?: Array<Tab>
  onClick: (active: string | undefined) => void
}) => {

  const [activeTab, setActiveTab] = useState<string>()

  useEffect(
    () => {
      props.onClick(activeTab)
    }, [activeTab]
  )

  return (
    <div id={props.id} className={"snovy-tab-menu " + props.orientation}>
      <div className={"menu-section " + Alignment.START}>
        {props.startTabs && props.startTabs.map((tab) =>
          <TabMenuItem
            key={tab.text} text={tab.text} orientation={props.orientation} active={activeTab == tab.text}
            initial={tab.initial} icon={tab.icon} onClick={(active: string) => {setActiveTab(active)}}
            alignment={Alignment.START}
          />)
        }
      </div>
      <div className={"menu-section " + Alignment.END}>
        {props.endTabs && props.endTabs.map((tab) =>
          <TabMenuItem
            key={tab.text} text={tab.text} orientation={props.orientation} active={activeTab == tab.text}
            initial={tab.initial} icon={tab.icon} onClick={(active: string) => {setActiveTab(active)}}
            alignment={Alignment.START}
          />)
        }
      </div>
    </div>
  )

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export enum Alignment {

  START = "start",
  END = "end"

}

export class Tab {

  text: string
  icon: boolean
  initial: boolean

  constructor(text: string, initial = false) {
    this.text = text
    this.icon = text.length == 1
    this.initial = initial
  }

}

export default TabMenu