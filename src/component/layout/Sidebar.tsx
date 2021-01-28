import React from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"

const Sidebar = (props: {
  classList?: Array<string>,
  children: Array<React.ReactElement> | React.ReactElement,
  tabs?: React.ReactElement<typeof TabMenu>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  return (
    <div id={"snovy-sidebar-" + props.orientation}
         className={"snovy-sidebar".concat(props.classList ? " " + props.classList?.join(" ") : "")}
    >
      <div className="sidebar-content" id={props.orientation + "-content"}>
        {props.children}
      </div>
      {props.tabs}
    </div>
  )

}

export default Sidebar