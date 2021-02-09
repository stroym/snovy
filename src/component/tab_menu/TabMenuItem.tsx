import React, {useEffect} from "react"
import {Orientation} from "./TabMenu"
import {append, Extras} from "../../util/ComponentUtils"

const TabMenuItem = (props: {
  id?: string,
  orientation: Orientation,
  text: string,
  onClick: (active: string) => void,
  active: boolean,
  default?: boolean
}) => {

  useEffect(
    () => {
      if (props.default) {
        handleClick()
      }
    }, []
  )

  const handleClick = () => {
    props.onClick!(props.text)
  }

  return (
    <div
      id={props.id} className={"snovy-tab-menu-item ".concat(props.orientation, append(props.active, Extras.ACTIVE))}
      onClick={handleClick}
    >
      {props.text}
    </div>
  )

}

export default TabMenuItem