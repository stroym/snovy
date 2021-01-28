import React, {useEffect} from "react"

export type TabMenuItemProps = {
  id?: string,
  text: string,
  children: Array<React.ReactElement> | React.ReactElement
  onClick?: (children: Array<React.ReactElement> | React.ReactElement) => any,
  active?: boolean,
  defaultSelected?: boolean
}

const TabMenuItem = (props: TabMenuItemProps) => {

  useEffect(
    () => {
      if (props.defaultSelected && props.onClick) {
        props.onClick(props.children!)
      }
    }, []
  )

  return (
    <div id={props.id} className={"snovy-tab-menu-item".concat(props.active ? " active" : "")}
         onClick={() => {props.onClick ? props.onClick(props.children!) : []}}
    >
      {props.text}
    </div>
  )

}

export default TabMenuItem