import React, {useEffect} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {CollapseButton} from "../Button"
import {IdentifiedItem, Item} from "../../model/common/Base"
import {Key} from "ts-key-enum"
import {useDefaultEmpty} from "../../util/Hooks"
import ComboCreateItem from "./ComboCreateItem"
import TagComboBoxItem from "../tag/TagComboBoxItem"

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
    onInputValueChange: ({inputValue, selectedItem}) => {
      const target = inputValue ?? ""

      if (target.isBlank() && selectedItem) {
        setOptions(props.items)
        setHighlightedIndex(props.items?.indexOf(selectedItem) ?? -1)
      } else {
        const filteredItems = props.items?.filter(item =>
          item.toString().toLowerCase().startsWith(target.toLowerCase())
        )

        setOptions(filteredItems)

        if (filteredItems) {
          const item = filteredItems.first()

          if (item) {
            setHighlightedIndex(filteredItems.indexOf(item))
          }
        }
      }
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
      selectedItem && props.onActiveChange(selectedItem)
    }, [selectedItem]
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
            {...getInputProps({onKeyDown: (e) => { options.isEmpty() && e.key == Key.Enter && createItem()}})}
          />
          <CollapseButton aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="notebook-dropdown" hidden={!isOpen}>
          {isOpen &&
          options?.map((item, index) => (
            <TagComboBoxItem
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
              item={item} highlighted={highlightedIndex == index} selected={selectedItem == item}
            />
          ))}
          {isOpen && options.isEmpty() &&
          <ComboCreateItem onClick={createItem} highlight inputValue={inputValue} itemName="notebook"/>
          }
        </ul>
      </div>
    </>
  )

}

export default ComboBox