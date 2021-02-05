import React, {useState} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"

export const Sidebar = (props: {
  classList?: Array<string>,
  children: Array<React.ReactElement> | React.ReactElement | boolean,
  tabs?: React.ReactElement<typeof TabMenu>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  return (
    <div className={"snovy-sidebar".concat(props.classList ? " " + props.classList?.join(" ") : "")}>
      {props.orientation == Orientation.LEFT && props.tabs}
      <div className={"sidebar-content " + props.orientation} id={props.orientation + "-content"}>
        {props.children}
      </div>
      {props.orientation == Orientation.RIGHT && props.tabs}
    </div>
  )

}

export const ManagedSidebar = (props: {
  classList?: Array<string>,
  children: Array<{ text: string, children: Array<React.ReactElement> | React.ReactElement | undefined }>,
  tabs: Array<{ text: string, default?: boolean }>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  const [activeTab, setActiveTab] = useState<string | undefined>()

  return (
    <Sidebar
      orientation={props.orientation} classList={props.classList}
      tabs={
        <TabMenu
          orientation={props.orientation} tabs={props.tabs}
          onClick={(active: string | undefined) => {setActiveTab(active)}}
        />}
    >
      {props.children.map(child =>
        child && <React.Fragment key={child.text}>{child.text == activeTab && child.children}</React.Fragment>)
      }
    </Sidebar>
  )

}