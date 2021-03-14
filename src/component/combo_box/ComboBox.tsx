import React, {useEffect} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {useDefaultEmpty} from "../../util/Hooks"
import ComboCreateItem from "./ComboCreateItem"
import ComboBoxInput from "./ComboBoxInput"
import {useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import ComboBoxDropdown from "./ComboBoxDropdown"

export interface ComboBoxProps<T extends Record<string, any> | string> {
  id?: string
  className?: string
  tabIndex?: number
  placeholder?: string
  onSelect?: (active: T | undefined) => void
  items: Array<T> | undefined
  selection?: T
  newItem?: { getInputValue: (value: string) => void, name: string },
  options?: { selectPreviousOnEsc?: boolean, resetInputOnSelect?: boolean, slideDropdown?: boolean, unboundDropdown?: boolean }
  externalClose?: { closeMenu: boolean, menuVisible: (visible: boolean) => void },
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

  if (props.options?.unboundDropdown) {
    return (
      <>
        <div className="snovy-combo-box" id={props.id} {...getComboboxProps()}>
          <ComboBoxInput
            getToggleButtonProps={getToggleButtonProps}
            comboInput={{
              getProps: getInputProps, options: {
                placeholder: props.placeholder,
                onKeyDown: e => dropdownItems.isEmpty() && useKey(e, [{
                  key: Key.Enter,
                  handler: onGetInputValue
                }])
              }
            }}
          />
        </div>
        <ComboBoxDropdown
          dropdownItems={dropdownItems} getMenuProps={getMenuProps} getItemProps={getItemProps}
          highlightedIndex={highlightedIndex} selectedItem={selectedItem} isOpen={isOpen} inputValue={inputValue}
          slide={props.options?.slideDropdown}
          newItem={
            props.newItem &&
            <ComboCreateItem inputValue={inputValue} itemName={props.newItem?.name} onClick={onGetInputValue}/>
          }
        />
      </>
    )
  } else {
    return (
      <div className="snovy-combo-box" id={props.id} {...getComboboxProps()}>
        <ComboBoxInput
          getToggleButtonProps={getToggleButtonProps}
          comboInput={{
            getProps: getInputProps, options: {
              placeholder: props.placeholder,
              onKeyDown: e => dropdownItems.isEmpty() && useKey(e, [{
                key: Key.Enter,
                handler: onGetInputValue
              }])
            }
          }}
        />
        <ComboBoxDropdown
          dropdownItems={dropdownItems} getMenuProps={getMenuProps} getItemProps={getItemProps}
          highlightedIndex={highlightedIndex} selectedItem={selectedItem} isOpen={isOpen} inputValue={inputValue}
          slide={props.options?.slideDropdown}
          newItem={
            props.newItem &&
            <ComboCreateItem inputValue={inputValue} itemName={props.newItem?.name} onClick={onGetInputValue}/>
          }
        />
      </div>
    )
  }

  //TODO as is, it's impossible to create items that are substrings of already existing items

}

export default ComboBox