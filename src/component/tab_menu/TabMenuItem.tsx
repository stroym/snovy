import React, {useEffect} from "react"

export type TabMenuItemProps = {
  id?: string,
  text: string,
  children: Array<React.ReactElement> | React.ReactElement
  onClick?: (children: Array<React.ReactElement> | React.ReactElement) => any,
  active?: boolean,
  defaultSelected?: boolean
}

export type TabMenuItemPropsInherited = {
  id?: string,
  text: string,
  children: Array<React.ReactElement> | React.ReactElement
  defaultSelected?: boolean
}

const TabMenuItem = (props: TabMenuItemProps) => {

  useEffect(
    () => {
      if (props.defaultSelected) {
        handleClick()
      }
    }, []
  )

  const handleClick = () => {
    props.onClick!(props.children!)
  }

  return (
    <div id={props.id} className={"snovy-tab-menu-item".concat(props.active ? " active" : "")}
         onClick={handleClick}
    >
      {props.text}
    </div>
  )

}

export const TabMenuItemInherit = (props: TabMenuItemProps) => {

  return (
    <></>
  )

}

export default TabMenuItem