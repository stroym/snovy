import React from "react"
import {cls} from "../../util/utils"

export interface ComboInfoItemProps extends React.HTMLProps<HTMLLIElement> {
  value: string
}

const ComboInfoItem = ({value, className}: ComboInfoItemProps) => {

  return (
    <li className={"snovy-dropdown-item info-dropdown-item".concat(cls(className))}>
      {value}
    </li>
  )

}

export default ComboInfoItem