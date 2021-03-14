import React from "react"
import {GetItemPropsOptions, GetMenuPropsOptions, GetPropsCommonOptions} from "downshift"
import ComboBoxItem from "./ComboBoxItem"
import {append, Extras} from "../../util/ComponentUtils"

const ComboBoxDropdown = <T extends Record<string, any> | string>(props: {
  dropdownItems: Array<T>
  getMenuProps: (
    options?: GetMenuPropsOptions,
    otherOptions?: GetPropsCommonOptions
  ) => unknown
  getItemProps: (options: GetItemPropsOptions<T>) => unknown
  highlightedIndex: number,
  selectedItem: T | null
  isOpen: boolean
  inputValue: string
  newItem?: React.ReactElement<unknown>
  slide?: boolean
}) => {

  const className = "snovy-dropdown".concat(append(!props.isOpen, Extras.HIDDEN), append(props.slide, "slide"))

  //TODO maybe just send children instead of passing all the things in here
  return (
    <ol {...props.getMenuProps()} className={className}>
      {props.dropdownItems?.map((item, index) => (
        <ComboBoxItem
          {...props.getItemProps({item, index})}
          key={index} item={item} highlighted={props.highlightedIndex == index} selected={props.selectedItem == item}
        />
      ))}
      {props.isOpen && props.dropdownItems.isEmpty() &&
      <ComboBoxItem item={"No matching items found."}/>}
      {props.newItem}
    </ol>
  )

}

export default ComboBoxDropdown