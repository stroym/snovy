import React from "react"
import {GetMenuPropsOptions, GetPropsCommonOptions} from "downshift"
import ComboBoxItem from "./ComboBoxItem"
import {append, Extras} from "../../util/ComponentUtils"

const ComboBoxDropdown = (props: {
  getMenuProps: (
    options?: GetMenuPropsOptions,
    otherOptions?: GetPropsCommonOptions
  ) => unknown
  isOpen: boolean
  slide?: boolean
  children: Array<unknown>
}) => {

  const className = "snovy-dropdown".concat(append(!props.isOpen, Extras.HIDDEN), append(props.slide, "slide"))

  return (
    <ol {...props.getMenuProps()} className={className}>
      {props.isOpen && props.children.isEmpty() &&
      <ComboBoxItem className="snovy-dropdown-no-match" item={"No matching items found."}/>}
      {props.children}
    </ol>
  )

}

export default ComboBoxDropdown