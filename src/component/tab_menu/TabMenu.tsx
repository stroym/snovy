import React from "react"

const TabMenu = (props: {
  id?: string,
  position: Position,
  children?: Array<any>
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