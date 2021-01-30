import React, {useEffect} from "react"
import {Orientation} from "./TabMenu"

const TabMenuItem = (props: {
  id?: string,
  orientation: Orientation,
  text: string,
  onClick: (active: string) => any,
  active: boolean,
  defaultSelected?: boolean
}) => {

  useEffect(
    () => {
      if (props.defaultSelected) {
        handleClick()
      }
    }, []
  )

  const handleClick = () => {
    props.onClick!(props.text)
  }

  return (
    <div id={props.id} className={"snovy-tab-menu-item ".concat(props.orientation, props.active ? " active" : "")}
         onClick={handleClick}>
      <span>{props.text}</span>
    </div>
  )

}

export default TabMenuItem