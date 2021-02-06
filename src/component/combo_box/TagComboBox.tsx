import React, {useEffect, useState} from "react"
import {useCombobox} from "downshift"
import {CollapseButton} from "../Button"
import {IdentifiedItem} from "../../model/common/Base"
import {Key} from "ts-key-enum"
import {useDefaultEmpty} from "../../Hooks"
import Tag from "../../model/coloured/Tag"

const TagComboBox = (props: {
  id?: string,
  className?: string,
  onActiveChange: (active: Tag) => void,
  items: Array<Tag> | undefined,
  createItem?: (value: string) => Tag,
  getInputValue?: (value: string) => void
}) => {

  const [options, setOptions] = useDefaultEmpty<Tag>()
  const [selected, setSelected] = useState<Tag | null>()

  useEffect(
    () => {
      setOptions(props.items)
    }, [props.items]
  )

  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    highlightedIndex, selectItem, setInputValue, setHighlightedIndex, closeMenu
  } = useCombobox({
    items: options,
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
    onIsOpenChange: () => {
      setInputValue("")
    },
    scrollIntoView: () => {
      if (options.isEmpty()) {
        return
      }
    },
    onSelectedItemChange: ({selectedItem}) => {
      setSelected(selectedItem)
      return
    }
  })

  useEffect(
    () => {
      selected && props.onActiveChange(selected)
    }, [selected]
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
            <li
              className={"snovy-list-item".concat(highlightedIndex == index ? " hover" : "")}
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
            >
              {item.toString()}
            </li>
          ))}
          {options.isEmpty() &&
          <li className="snovy-list-item">
            {"No items available."}
          </li>
          }
          {options.isEmpty() && props.createItem &&
          <li className="snovy-list-item hover" onClick={() => createItem()}>
            {`Create ${inputValue}`}
          </li>
          }
        </ul>
      </div>
    </>
  )

}

export default TagComboBox