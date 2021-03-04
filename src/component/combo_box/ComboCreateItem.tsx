import React from "react"
import {append, Extras} from "../../util/ComponentUtils"

const ComboCreateItem = (props: {
  inputValue: string,
  itemName?: string,
  onClick: (value: string) => void
  highlight?: boolean
}) => {

  const buildMessage = () => {
    if (props.inputValue != undefined && props.itemName) {
      return `Create ${props.inputValue.isBlank() ? ` new ${props.itemName}...` : props.inputValue} `
    }
  }

  return (
    <li
      className={"snovy-dropdown-item".concat(append(props.highlight, Extras.HOVER))}
      onClick={() => props.onClick(props.inputValue)}
    >
      {buildMessage()}
    </li>
  )

}

export default ComboCreateItem