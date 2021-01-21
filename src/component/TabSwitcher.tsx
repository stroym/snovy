import React from "react"

const TabSwitcher = (props: {
  id?: string,
  position: Position
}) => {

  return (
    <div id={props.id} className={"snovy-tab-switcher_" + props.position}>
    </div>
  )

}

export enum Position {

  LEFT = "left",
  RIGHT = "right"

}

export default TabSwitcher