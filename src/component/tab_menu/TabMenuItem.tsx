import React, {useEffect} from "react"

export type TabMenuItemProps = {
  id?: string,
  text: string,
  onClick: (active: string) => any,
  active: boolean,
  defaultSelected?: boolean
}

const TabMenuItem = (props: TabMenuItemProps) => {

  useEffect(
    () => {
      if (props.defaultSelected) {
        console.log("mount tab " + props.text)
        handleClick()
      }
    }, []
  )

  const handleClick = () => {
    props.onClick!(props.text)
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