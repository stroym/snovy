import React from "react"

const ComboInfoItem = (props: { value: string }) => {

  return (
    <li className={"snovy-dropdown-item info-dropdown-item"}>
      {props.value}
    </li>
  )

}

export default ComboInfoItem