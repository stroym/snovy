import React, {useEffect, useRef} from "react"
import {useCombobox, UseComboboxState, UseComboboxStateChangeOptions} from "downshift"
import {useDefaultEmpty} from "../../util/hooks"
import ComboInfoItem from "./ComboInfoItem"
import {KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"
import ComboBoxItem from "./ComboBoxItem"
import WithLabel from "../inputs/WithLabel"
import Input from "../inputs/Input"
import {ToggleButton} from "../inputs/Button"
import {GenericItem} from "../../util/types"
import memoize from "fast-memoize"

type ComboBoxOptions = {
  selectPreviousOnEsc?: boolean
  resetInputOnSelect?: boolean
  absoluteDropdown?: boolean
  unboundDropdown?: boolean
}

const defaultOptions: ComboBoxOptions = {
  selectPreviousOnEsc: true,
  resetInputOnSelect: false,
  absoluteDropdown: true,
  unboundDropdown: false
}

export interface ComboBoxProps<T extends GenericItem> extends Omit<React.HTMLAttributes<HTMLInputElement>, "onSelect"> {
  items: Array<T>
  onSelect?: (active: T | undefined) => void
  selected?: T
  newItem?: { getInputValue: (value: string) => void, name: string }
  options?: ComboBoxOptions
  label?: { value: string, position: "before" | "after" }
  customItem?: (item: T) => React.ReactElement
}

const ComboBox = <T extends GenericItem>({label, customItem, options: passedOptions, ...props}: ComboBoxProps<T>) => {

  const options = passedOptions ? {...defaultOptions, ...passedOptions} : defaultOptions

  const [dropdownItems, setDropdownItems] = useDefaultEmpty<T>()

  const stateReducer = (state: UseComboboxState<T>, stateChange: UseComboboxStateChangeOptions<T>) => {
    const {type, changes} = stateChange

    if (type == useCombobox.stateChangeTypes.InputKeyDownEscape && options.selectPreviousOnEsc) {
      return {...changes, selectedItem: state.selectedItem, inputValue: state.inputValue}
    } else if (type == useCombobox.stateChangeTypes.InputBlur && changes.selectedItem !== undefined) {
      changes.selectedItem = selectedItem
    }

    return changes
  }

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    getLabelProps,
    inputValue,
    selectedItem,
    highlightedIndex,
    selectItem,
    setInputValue,
    setHighlightedIndex,
    closeMenu,
    toggleMenu
  } = useCombobox({
    items: dropdownItems,
    itemToString: item => item ? item.toString() : "",
    initialSelectedItem: props.selected,
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
    onIsOpenChange: ({selectedItem, isOpen}) => {
      if (isOpen) {
        setInputValue("")
      } else {
        if (options.resetInputOnSelect) {
          setInputValue("")
        } else {
          setInputValue(selectedItem?.toString() ?? "")
        }
      }
    },
    onSelectedItemChange: ({selectedItem}) => {
      props.onSelect && selectedItem != props.selected && props.onSelect(selectedItem ?? undefined)
      closeMenu()
    }
  })

  const getItemPropsMemoRef = useRef(getItemProps)

  useEffect(
    () => {
      setDropdownItems(props.items)
    }, [props.items]
  )

  //FIXME with hundreds of tags the whole combobox locking up for 500+ ms is unacceptable
  useEffect(
    () => {
      getItemPropsMemoRef.current = memoize(getItemProps, {
        // @ts-ignore
        serializer: ({item, index}) => {
          return `it${item}:ind${index}`
        }
      })
    }, [dropdownItems]
  )

  useEffect(
    () => {
      props.selected && selectItem(props.selected)
    }, [props.selected]
  )

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
    <ol
      {...getMenuProps()} className="snovy-dropdown" data-visible={isOpen}
      style={{
        position: options.absoluteDropdown && "absolute",
        maxHeight: options.absoluteDropdown && "50vh",
        display: isOpen ? "initial" : "none",
        visibility: isOpen ? "visible" : "hidden"
      }}
    >
      {
        dropdownItems.map((item, index) => (
          <ComboBoxItem
            {...getItemPropsMemoRef.current({item, index})} key={`${item}${index}`} item={item}
            highlighted={index == highlightedIndex} selected={selectedItem == item} customItem={customItem}
          />
        ))
      }
      {
        dropdownItems.isEmpty() &&
        <ComboInfoItem className="snovy-dropdown-no-match" value="No matching items found."/>
      }
      {
        dropdownItems[highlightedIndex] &&
        <ComboInfoItem value={`Press Enter to select ${dropdownItems[highlightedIndex].toString()}`}/>
      }
      {
        props.newItem && dropdownItems[highlightedIndex]?.toString() != inputValue &&
        <ComboInfoItem
          value={
            `Press ${dropdownItems.isEmpty() ? "Enter/Shift+Enter" : "Shift+Enter"} 
             to create ${inputValue.isBlank() ? ` new ${props.newItem.name}...` : inputValue}`
          }
        />
      }
    </ol>

  const ComboBox =
    <>
      <div className="snovy-combo-box" id={props.id} {...getComboboxProps()}>
        <Input
          {...getInputProps({
            placeholder: props.placeholder,
            onKeyDown: e => useKey(e, keyMap),
            onFocus: props.onFocus,
            onClick: () => toggleMenu()
          })}
        />
        <ToggleButton
          preset="collapse_simple" circular aria-label="toggle menu" {...getToggleButtonProps()} setState={isOpen}
          tabIndex={0}
        />
        {!options.unboundDropdown && ComboDropdown}
      </div>
      {options.unboundDropdown && ComboDropdown}
    </>

  //TODO try to make the label functional... i could probably use a ref and one of my hooks, but I don't really wanna
  if (label) {
    return (
      <WithLabel  {...getLabelProps()} value={label.value} position={label.position} onClick={e => e.preventDefault()}>
        {ComboBox}
      </WithLabel>
    )
  } else {
    return ComboBox
  }

}

export default ComboBox