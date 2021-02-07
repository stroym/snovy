import React, {useEffect} from "react"
import {useCombobox} from "downshift"
import {AddButton, CollapseButton} from "../Button"
import {IdentifiedItem} from "../../model/common/Base"
import {Key} from "ts-key-enum"
import {useDefaultEmpty} from "../../util/Hooks"
import Tag from "../../model/coloured/Tag"
import ComboCreateItem from "./ComboCreateItem"
import TagComboBoxItem from "./TagComboBoxItem"

const TagComboBox = (props: {
  id?: string,
  className?: string,
  onActiveChange: (active: Tag) => void,
  items: Array<Tag> | undefined,
  createTag: (value: string) => void,
  getInputValue?: (value: string) => void,
  buttonRef: React.RefObject<HTMLButtonElement>,
  flip: () => void
}) => {

  const [options, setOptions] = useDefaultEmpty<Tag>()

  useEffect(
    () => {
      setOptions(props.items)
    }, [props.items]
  )

  //TODO try to prevent tag text from flashing in input on select
  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    highlightedIndex, setInputValue, setHighlightedIndex, closeMenu
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
      selectedItem && props.onActiveChange(selectedItem)
      return
    }
  })

  const createTag = () => {
    props.createTag!(inputValue)
    closeMenu()
  }

  return (
    <>
      <div className={"snovy-combo-box"} {...getComboboxProps()}>
        <span className="snovy-combo-box-wrapper">
          <AddButton ref={props.buttonRef} onClick={props.flip}/>
          <input {...getToggleButtonProps()}
                 className="snovy-combo-box-input" placeholder="Select or create tag..."
                 {...getInputProps({onKeyDown: (e) => { options.isEmpty() && e.key == Key.Enter && createTag()}})}
          />
          <CollapseButton {...getToggleButtonProps()} aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="tag-dropdown" hidden={!isOpen}>
          {isOpen && options.map((item, index) => (
            <TagComboBoxItem
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
              item={item} highlighted={highlightedIndex == index}
            />
          ))}
          {isOpen && options.isEmpty() && props.createTag &&
          <ComboCreateItem onClick={createTag} highlight inputValue={inputValue} itemName="tag"/>
          }
        </ul>
      </div>
    </>
  )

}

export default TagComboBox