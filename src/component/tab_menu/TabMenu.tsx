import React, {useContext} from "react"
import {TabMenuItemProps} from "./TabMenuItem"
import OptionsContext from "../../util/OptionsContext"

const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  children: Array<React.ReactElement<TabMenuItemProps>>
}) => {

  const theme = useContext(OptionsContext).theme

  return (
    <div
      id={props.id} className={"snovy-tab-menu " + props.orientation}
      style={{backgroundColor: theme.accent}}
    >
      <div className={"menu-section " + Alignment.START}>
        {props.children.filter(it => it.props.alignment == Alignment.START)}
      </div>
      <div className={"menu-section " + Alignment.END}>
        {props.children.filter(it => it.props.alignment == Alignment.END)}
      </div>
    </div>
  )

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export enum Alignment {

  START = "start",
  END = "end"

}

export default TabMenu