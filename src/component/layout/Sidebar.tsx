import React, {useEffect} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"

//TODO try to move tabmenu in here
const Sidebar = (props: {
  classList?: Array<string>,
  children: Array<React.ReactElement> | React.ReactElement | boolean,
  tabs?: React.ReactElement<typeof TabMenu>,
  orientation: Orientation.LEFT | Orientation.RIGHT
}) => {

  useEffect(
    () => {
      console.log("blob")
    }, [props.children, props.tabs]
  )

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