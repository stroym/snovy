import React, {useEffect} from "react"
import {Alignment, Orientation} from "./TabMenu"
import {append, Extras} from "../../util/ComponentUtils"

const TabMenuItem = (props: {
  id?: string,
  orientation: Orientation,
  alignment: Alignment,
  text: string,
  onClick: (active: string) => void,
  active: boolean,
  initial?: boolean
  icon?: boolean
}) => {

  useEffect(
    () => {
      if (props.initial) {
        handleClick()
      }
    }, []
  )

  const handleClick = () => {
    props.onClick!(props.text)
  }

  return (
    <div
      id={props.id}
      className={`snovy-tab-menu-item ${props.orientation} ${props.alignment}`
        .concat(append(props.active, Extras.ACTIVE), append(props.icon, "icon"))
      }
      onClick={handleClick}
    >
      {props.text}
    </div>
  )

}

export default TabMenuItem