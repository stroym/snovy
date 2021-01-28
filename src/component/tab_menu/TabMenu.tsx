import React from "react"
import TabMenuItem from "./TabMenuItem"

const TabMenu = (props: {
  id?: string,
  position: Position,
  children?: Array<React.ReactElement<typeof TabMenuItem>>
}) => {

  return (
    <div id={props.id} className={"snovy-tab-menu_" + props.position}>
      {props.children}
    </div>
  )

}

export enum Position {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export default TabMenu