import React from "react"
import {Position} from "./TabMenu"

const TabMenuItem = (props: {
  id?: string,
  text: string,
  position?: Position
}) => {

  return (
    <div id={props.id} className={"snovy-tab-menu-item"}>
      {props.text}
    </div>
  )

}

export default TabMenuItem