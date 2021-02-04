import React, {useEffect, useState} from "react"
import {useCombobox} from "downshift"
import {CollapseButton} from "./Button"
import {IdentifiedItem, Item} from "../model/common/Base"

const ComboBox = <T extends IdentifiedItem | Item>(props: {
  id?: string,
  className?: string,
  onActiveChange: (active: T | undefined) => void,
  // onContextChange?: (active: T | null | undefined) => void,
  // contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  selection?: T,
  // style?: void
}) => {

  const [inputItems, setInputItems] = useState(props.items)

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setInputValue
  } = useCombobox({
    items: props.items ?? [],
    initialSelectedItem: props.selection,
    onInputValueChange: ({inputValue}) => {
      setInputItems(
        props.items!.filter(item =>
          item.toString().toLowerCase().startsWith(inputValue!.toLowerCase())
        ).sort(Item.compareByName)
      )
    },
    onIsOpenChange: ({selectedItem}) => {
      if (!isOpen) {
        setInputValue("")
      } else {
        setInputValue(selectedItem?.toString() ?? "")
      }
    }
  })

  useEffect(
    () => {
      props.onActiveChange(selectedItem ?? undefined)
    }, [selectedItem]
  )

  return (
    <>
      <div className={"snovy-combo-box"} {...getComboboxProps()}>
        <span className="snovy-combo-box-wrapper" {...getToggleButtonProps()}>
          <input {...getInputProps()} className="snovy-combo-box-input" readOnly={props.items == undefined}/>
          <CollapseButton aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="notebook-dropdown" hidden={!isOpen}>
          {isOpen &&
          inputItems?.map((item, index) => (
            <li
              className={"snovy-list-item".concat(selectedItem == item ? " active" : "", highlightedIndex == index ? " hover" : "")}
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
            >
              {item.toString()}
            </li>
          ))}
        </ul>
      </div>
    </>
  )

}

export default ComboBox