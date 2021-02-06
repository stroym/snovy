import React from "react"

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
      className={"snovy-dropdown-item".concat(props.highlight ? " hover" : "")}
      onClick={() => !props.inputValue.isBlank() && props.onClick(props.inputValue)}
    >
      {buildMessage()}
    </li>
  )

}

export default ComboCreateItem