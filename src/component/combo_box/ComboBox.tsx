import React, {useEffect, useState} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {CollapseButton} from "../Button"
import {IdentifiedItem, Item} from "../../model/common/Base"
import {Key} from "ts-key-enum"
import {useDefaultEmpty} from "../../Hooks"

const ComboBox = <T extends Item>(props: {
  id?: string,
  className?: string,
  onActiveChange: (active: T) => void,
  // onContextChange?: (active: T | null | undefined) => void,
  // contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  selection?: T,
  createItem?: (value: string) => T,
  getInputValue?: (value: string) => void
}) => {

  const [options, setOptions] = useDefaultEmpty(props.items)
  const [optionsEmpty, setOptionsEmpty] = useState(false)

  const stateReducer = (state: UseComboboxState<T>, actionAndChanges: UseComboboxStateChangeOptions<T>) => {
    const {type, changes} = actionAndChanges

    switch (type) {
      case useCombobox.stateChangeTypes.InputKeyDownEscape: //on esc press revert to last selected value
        return {
          ...changes,
          selectedItem: state.selectedItem,
          inputValue: state.inputValue
        }
      default:
        return changes
    }
  }

  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    selectedItem, highlightedIndex, selectItem, setInputValue, setHighlightedIndex, closeMenu
  } = useCombobox({
    items: options,
    initialSelectedItem: props.selection,
    stateReducer: stateReducer,
    onInputValueChange: ({inputValue}) => {
      const filteredItems = props.items?.filter(item =>
        item.toString().toLowerCase().startsWith(inputValue!.toLowerCase())
      )

      setOptions(filteredItems)

      if (filteredItems) {
        const item = filteredItems.first()

        if (item) {
          setHighlightedIndex(filteredItems.indexOf(item))
        }
      }
    },
    onIsOpenChange: ({selectedItem}) => {
      if (!isOpen) {
        setInputValue("")
      } else {
        setInputValue(selectedItem?.toString() ?? "")
      }
    },
    scrollIntoView: () => {
      if (optionsEmpty) {
        return
      }
    }
  })

  useEffect(
    () => {
      selectedItem && props.onActiveChange(selectedItem)
    }, [selectedItem]
  )

  useEffect(
    () => {
      props?.createItem && options.isEmpty() ? setOptionsEmpty(true) : setOptionsEmpty(false)
    }, [options]
  )

  const createItem = () => {
    selectItem(props.createItem!(inputValue))
    closeMenu()
  }

  return (
    <>
      <div className={"snovy-combo-box"} {...getComboboxProps()}>
        <span className="snovy-combo-box-wrapper" {...getToggleButtonProps()}>
          <input
            className="snovy-combo-box-input"
            {...getInputProps({onKeyDown: (e) => { optionsEmpty && e.key == Key.Enter && createItem()}})}
          />
          <CollapseButton aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="notebook-dropdown" hidden={!isOpen}>
          {isOpen &&
          options?.map((item, index) => (
            <li
              className={"snovy-list-item".concat(selectedItem == item ? " active" : "", highlightedIndex == index ? " hover" : "")}
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
            >
              {item.toString()}
            </li>
          ))}
          {optionsEmpty &&
          <li className={"snovy-list-item".concat(optionsEmpty && " hover")} onClick={() => createItem()}>
            {`Create ${inputValue}`}
          </li>
          }
        </ul>
      </div>
    </>
  )

}

export default ComboBox