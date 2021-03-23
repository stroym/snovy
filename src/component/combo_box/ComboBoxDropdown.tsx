import React from "react"
import {GetMenuPropsOptions, GetPropsCommonOptions} from "downshift"
import ComboBoxItem from "./ComboBoxItem"

const ComboBoxDropdown = (props: {
  getMenuProps: (options?: GetMenuPropsOptions, otherOptions?: GetPropsCommonOptions) => unknown
  isOpen: boolean
  slide?: boolean
  children: Array<unknown>
  style?: React.CSSProperties
}) => {

  return (
    <ol {...props.getMenuProps} className={`snovy-dropdown ${props.slide ? " slide" : ""}`} data-visible={props.isOpen}
        style={props.style}
    >
      {props.isOpen && props.children.isEmpty() &&
      <ComboBoxItem className="snovy-dropdown-no-match" item={"No matching items found."}/>}
      {props.children}
    </ol>
  )

}

export default ComboBoxDropdown