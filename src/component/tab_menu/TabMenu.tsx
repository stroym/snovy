import {useTheme} from "@emotion/react"
import React from "react"
import {TinyStyle} from "../tag/TagItem"

export interface AlignableProps {
  alignment?: Alignment
}

export interface OrientableProps {
  orientation: Orientation
}

export interface TabMenuProps extends OrientableProps, React.HTMLProps<HTMLDivElement> {
  children: Array<React.ReactElement<AlignableProps>>
  noSection?: boolean
}

const TabMenu = (props: TabMenuProps) => {

  const tiny = new TinyStyle(useTheme().accent)

  return (
    <div id={props.id} className={"snovy-tab-menu " + props.orientation} style={tiny.style}>
      {
        props.noSection ?
          props.children :
          <>
            <div className={"menu-section " + Alignment.START}>
              {props.children.filter(it => it.props.alignment == Alignment.START || undefined)}
            </div>
            <div className={"menu-section " + Alignment.END}>
              {props.children.filter(it => it.props.alignment == Alignment.END)}
            </div>
          </>
      }
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