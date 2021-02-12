import React, {useState} from "react"
import TabMenu, {Orientation, Tab} from "../tab_menu/TabMenu"

export const Sidebar = (props: {
  children: Array<{ text: string, children: Array<React.ReactElement> | React.ReactElement | undefined }>,
  startTabs?: Array<Tab>
  endTabs?: Array<Tab>
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  const [activeTab, setActiveTab] = useState<string | undefined>()

  const tabs = <TabMenu
    orientation={props.orientation} startTabs={props.startTabs} endTabs={props.endTabs}
    onClick={(active: string | undefined) => {setActiveTab(active)}}
  />

  return (
    <div className="snovy-sidebar">
      {props.orientation == Orientation.LEFT && tabs}
      <div className={"sidebar-content " + props.orientation} id={props.orientation + "-content"}>
        {props.children.map(child =>
          child && <React.Fragment key={child.text}>{child.text == activeTab && child.children}</React.Fragment>)
        }
      </div>
      {props.orientation == Orientation.RIGHT && tabs}
    </div>
  )

}