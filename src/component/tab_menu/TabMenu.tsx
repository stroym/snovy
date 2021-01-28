import React from "react"
import TabMenuItem from "./TabMenuItem"

const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  children?: Array<React.ReactElement<typeof TabMenuItem>>
}) => {

  return (
    <div id={props.id} className={"snovy-tab-menu_" + props.orientation}>
      {props.children}
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