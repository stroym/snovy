import React, {useState} from "react"
import {TabMenuItemProps} from "./TabMenuItem"

const TabMenu = (props: {
  id?: string,
  orientation: Orientation,
  children: Array<React.ReactElement<TabMenuItemProps>>,
  onClick?: (children: Array<React.ReactElement> | React.ReactElement) => any
}) => {

  const [activeTab, setActiveTab] = useState<any>()

  // useEffect(
  //   () => {
  //     if (props.children && props.children.length > 0) {
  //       setActiveTab(props.children[0].props.text)
  //       props.children[0].props.onClick!(props.children[0].props.children)
  //     }
  //   }, [props.children]
  // )

  return (
    <div id={props.id} className={"snovy-tab-menu-" + props.orientation}>
      {appendToChildren(props.children)}
    </div>
  )

  function appendToChildren(children: Array<React.ReactElement<TabMenuItemProps>>) {
    return React.Children.map(children, (child) => {
      let temp = child.props.onClick ? child : React.cloneElement(child, {
        onClick: () => {
          setActiveTab(child.props.text)
          props.onClick ? props.onClick(child.props.children) : null
        }
      })

      return React.cloneElement(temp, {active: temp.props.text == activeTab})
    })
  }

}

export enum Orientation {

  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom"

}

export default TabMenu