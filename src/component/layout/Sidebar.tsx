import React, {useState} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"

export const Sidebar = (props: {
  classList?: Array<string>,
  children: Array<React.ReactElement> | React.ReactElement | boolean,
  tabs?: React.ReactElement<typeof TabMenu>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  return (
    <div id={"snovy-sidebar-" + props.orientation}
         className={"snovy-sidebar".concat(props.classList ? " " + props.classList?.join(" ") : "")}
    >
      {props.orientation == Orientation.LEFT && props.tabs}
      <div className="sidebar-content" id={props.orientation + "-content"}>
        {props.children}
      </div>
      {props.orientation == Orientation.RIGHT && props.tabs}
    </div>
  )

}

export const ManagedSidebar = (props: {
  classList?: Array<string>,
  children: Array<{ text: string, children: Array<React.ReactElement> | React.ReactElement }>,
  tabs: Array<{ text: string, default?: boolean }>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  const [activeTab, setActiveTab] = useState<string | undefined>()

  const onTabClick = (active: string | undefined) => {
    setActiveTab(active)
  }

  return (
    <Sidebar orientation={props.orientation} tabs={
      <TabMenu orientation={props.orientation} tabs={props.tabs} onClick={onTabClick}/>
    } classList={props.classList}>
      {props.children.map(child =>
        <React.Fragment key={child.text}>{child.text == activeTab && child.children}</React.Fragment>)
      }
    </Sidebar>
  )

}