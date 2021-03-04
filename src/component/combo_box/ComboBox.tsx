import React, {useEffect} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {Button, CollapseButton} from "../inputs/Button"
import {Key} from "ts-key-enum"
import {useDefaultEmpty} from "../../util/Hooks"
import ComboCreateItem from "./ComboCreateItem"
import ComboBoxItem from "./ComboBoxItem"
import {useKey} from "../../util/Utils"
import {append, Extras} from "../../util/ComponentUtils"

export interface ComboBoxProps<T extends Record<string, any> | string> {
  id?: string
  className?: string
  placeholder?: string
  onSelect?: (active: T | undefined) => void
  items: Array<T> | undefined
  selection?: T
  newItem?: { getInputValue: (value: string) => void, name: string },
  options?: { selectPreviousOnEsc?: boolean, resetInputOnSelect?: boolean }
  createWithForm?: {
    button: React.ReactElement<typeof Button>, form: React.ReactElement<typeof HTMLFormElement> | false,
    closeMenu: boolean, menuVisible: (visible: boolean) => void
  }
}

const ComboBox = <T extends Record<string, any> | string>(props: ComboBoxProps<T>) => {

  const [dropdownItems, setDropdownItems] = useDefaultEmpty<T>()

  const stateReducer = (state: UseComboboxState<T>, actionAndChanges: UseComboboxStateChangeOptions<T>) => {
    const {type, changes} = actionAndChanges

    switch (type) {
      case useCombobox.stateChangeTypes.InputKeyDownEscape: //on esc press revert to last selected value
        if (props.options && !props.options.selectPreviousOnEsc) {
          return {...changes}
        } else {
          return {...changes, selectedItem: state.selectedItem, inputValue: state.inputValue}
        }
      default:
        return changes
    }
  }

  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    selectedItem, highlightedIndex, selectItem, setInputValue, setHighlightedIndex, closeMenu
  } = useCombobox({
    items: dropdownItems,
    itemToString: item => item ? item.toString() : "",
    initialSelectedItem: props.selection,
    stateReducer: stateReducer,
    onInputValueChange: ({inputValue, selectedItem}) => {
      const target = inputValue ?? ""

      if (target.isBlank() && selectedItem) {
        setDropdownItems(props.items)
        setHighlightedIndex(props.items?.indexOf(selectedItem) ?? -1)
      } else {
        const filteredItems = props.items?.filter(item =>
          item.toString().toLowerCase().startsWith(target.toLowerCase())
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
    scrollIntoView: () => {
      if (dropdownItems.isEmpty()) {
        return
      }
    },
    onIsOpenChange: ({selectedItem}) => {
      props.createWithForm?.menuVisible(isOpen)

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
      if (props.createWithForm?.closeMenu) {
        closeMenu()
      }
    }, [props.createWithForm?.closeMenu]
  )

  useEffect(
    () => {
      props.items && setDropdownItems(props.items)
    }, [props.items]
  )

  useEffect(
    () => {
      props.selection && selectItem(props.selection)
    }, [props.selection]
  )

  useEffect(
    () => {
      props.onSelect && selectedItem && selectedItem != props.selection && props.onSelect(selectedItem)
      closeMenu()
    }, [selectedItem]
  )

  const onGetInputValue = () => {
    props.newItem && props.newItem.getInputValue(inputValue)
    closeMenu()
  }

  //TODO as is, it's impossible to create items that are substrings of already existing items
  return (
    <div className="snovy-combo-box" id={props.id} {...getComboboxProps()}>
      <span className="snovy-combo-box-input-wrapper">
        {props.createWithForm?.button}
        <input
          {...getToggleButtonProps()} className="snovy-combo-box-input" placeholder={props.placeholder}
          {...getInputProps({
            onKeyDown: e => dropdownItems.isEmpty() && useKey(e, [{key: Key.Enter, handler: onGetInputValue}])
          })}
        />
        <CollapseButton {...getToggleButtonProps()} aria-label={"toggle menu"}/>
      </span>
      <ol {...getMenuProps()} className={"snovy-dropdown".concat(append(!isOpen, Extras.HIDDEN))}>
        {isOpen && dropdownItems?.map((item, index) => (
          <ComboBoxItem
            {...getItemProps({item, index})}
            key={index} item={item} highlighted={highlightedIndex == index} selected={selectedItem == item}
          />
        ))}
        {!props.newItem && isOpen && dropdownItems.isEmpty() && <ComboBoxItem item={"No matching items found."}/>}
        {props.newItem && isOpen && dropdownItems.isEmpty() &&
        <ComboCreateItem highlight inputValue={inputValue} itemName={props.newItem.name} onClick={onGetInputValue}/>
        }
      </ol>
      {props.createWithForm?.form}
    </div>
  )

}

export default ComboBox