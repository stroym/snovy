import React, {useEffect} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {useDefaultEmpty} from "../../util/Hooks"
import ComboInfoItem from "./ComboInfoItem"
import ComboBoxInput from "./ComboBoxInput"
import {KeyMapping, useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import ComboBoxDropdown from "./ComboBoxDropdown"
import ComboBoxItem from "./ComboBoxItem"

export interface ComboBoxProps<T extends Record<string, any> | string> extends React.HTMLProps<HTMLInputElement> {
  onItemSelect?: (active: T | undefined) => void
  items: Array<T> | undefined
  selectedItem?: T
  newItem?: { getInputValue: (value: string) => void, name: string }
  options?: { selectPreviousOnEsc?: boolean, resetInputOnSelect?: boolean, slideDropdown?: boolean, unboundDropdown?: boolean }
  externalClose?: { closeMenu: boolean, menuVisible: (visible: boolean) => void }
  style?: React.CSSProperties
}

const ComboBox = <T extends Record<string, any> | string>(props: ComboBoxProps<T>) => {

  const [dropdownItems, setDropdownItems] = useDefaultEmpty<T>()

  const stateReducer = (state: UseComboboxState<T>, stateChange: UseComboboxStateChangeOptions<T>) => {
    const {type, changes} = stateChange

    if (type == useCombobox.stateChangeTypes.InputKeyDownEscape && props.options?.selectPreviousOnEsc) {
      return {...changes, selectedItem: state.selectedItem, inputValue: state.inputValue}
    } else if (type == useCombobox.stateChangeTypes.InputBlur && changes.selectedItem !== undefined) {
      changes.selectedItem = selectedItem
    }

    return changes
  }

  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    selectedItem, highlightedIndex, selectItem, setInputValue, setHighlightedIndex, closeMenu
  } = useCombobox({
    items: dropdownItems,
    itemToString: item => item ? item.toString() : "",
    initialSelectedItem: props.selectedItem,
    stateReducer: stateReducer,
    onInputValueChange: ({inputValue, selectedItem}) => {
      const target = inputValue ?? ""

      if (target.isBlank() && selectedItem) {
        setDropdownItems(props.items)
        setHighlightedIndex(props.items?.indexOf(selectedItem) ?? -1)
      } else {
        const filteredItems = props.items?.filter(item =>
          item.toString().toLowerCase().startsWith(target.toLowerCase()) //TODO includes + highlight
        )

        setDropdownItems(filteredItems)

        if (filteredItems) {
          const item = filteredItems.first()

          if (item) {
            setHighlightedIndex(filteredItems.indexOf(item))
          }
        }
      }
    },
    onIsOpenChange: ({selectedItem}) => {
      props.externalClose?.menuVisible(isOpen)

      if (!isOpen) {
        setInputValue("")
      } else {
        if (props.options?.resetInputOnSelect) {
          setInputValue("")
        } else {
          setInputValue(selectedItem?.toString() ?? "")
        }
      }
    }
  })

  useEffect(
    () => {
      if (props.externalClose?.closeMenu) {
        closeMenu()
      }
    }, [props.externalClose?.closeMenu]
  )

  useEffect(
    () => {
      props.items && setDropdownItems(props.items)
    }, [props.items]
  )

  useEffect(
    () => {
      props.selectedItem && selectItem(props.selectedItem)
    }, [props.selectedItem]
  )

  useEffect(
    () => {
      props.onItemSelect && selectedItem != props.selectedItem && props.onItemSelect(selectedItem ?? undefined)
      closeMenu()
    }, [selectedItem]
  )

  //TODO more/more advanced key bindings + info items
  const keyMap: Array<KeyMapping> = [
    {
      key: Key.Enter,
      handler: () => {
        props.newItem && props.newItem.getInputValue(inputValue)
        closeMenu()
      },
      condition: !inputValue.isBlank()
    },
    {
      key: Key.Enter,
      modifiers: {shift: true},
      handler: () => {
        selectItem(dropdownItems[highlightedIndex])
        closeMenu()
      },
      condition: !inputValue.isBlank()
    }
  ]

  //TODO the info items should probably be sticky
  const ComboDropdown =
    <ComboBoxDropdown
      style={props.style} getMenuProps={getMenuProps()} isOpen={isOpen} slide={props.options?.slideDropdown}
    >
      {dropdownItems?.map((item, index) => (
        <ComboBoxItem
          {...getItemProps({item, index})} key={index} item={item} highlighted={highlightedIndex == index}
          selected={props.selectedItem == item}
        />
      ))}
      {dropdownItems[highlightedIndex] &&
      <ComboInfoItem value={`Press Enter to select ${dropdownItems[highlightedIndex].toString()}`}/>
      }
      {props.newItem && dropdownItems[highlightedIndex]?.toString() != inputValue &&
      <ComboInfoItem
        value={
          `Press ${dropdownItems.isEmpty() ? "Enter/Shift+Enter" : "Shift+Enter"} 
          to create ${inputValue.isBlank() ? ` new ${props.newItem.name}...` : inputValue}`
        }
      />
      }
    </ComboBoxDropdown>

  return (
    <>
      <div style={props.style} className="snovy-combo-box" id={props.id} {...getComboboxProps()}>
        <ComboBoxInput
          style={props.style}
          getToggleButtonProps={getToggleButtonProps()}
          getInputProps={getInputProps({
            placeholder: props.placeholder,
            onKeyDown: e => useKey(e, keyMap),
            onFocus: props.onFocus
          })}
        />
        {!props.options?.unboundDropdown && ComboDropdown}
      </div>
      {props.options?.unboundDropdown && ComboDropdown}
    </>
  )

}

export default ComboBox