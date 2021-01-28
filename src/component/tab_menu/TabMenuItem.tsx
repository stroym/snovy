import React from "react"

const TabMenuItem = (props: {
  id?: string,
  text: string
}) => {

  return (
    <div id={props.id} className={"snovy-tab-menu-item"}>
      {props.text}
    </div>
  )

}

export default TabMenuItem