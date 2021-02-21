import React, {useEffect, useRef} from "react"
import {useCombobox} from "downshift"
import {AddButton, CollapseButton} from "../inputs/Button"
import {Key} from "ts-key-enum"
import {useDefaultEmpty, useHideOnOutsideClick} from "../../util/Hooks"
import Tag from "../../data/model/colored/Tag"
import ComboCreateItem from "../combo_box/ComboCreateItem"
import ComboBoxItem from "../combo_box/ComboBoxItem"
import TagForm from "./TagForm"
import {useKey} from "../../util/Utils"

const TagComboBox = (props: {
  id?: string,
  className?: string,
  tags: Array<Tag>,
  onTag: (tag: Tag) => void,
  onNewTag: (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => void
}) => {

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formVisible, setFormVisible, flipForm] = useHideOnOutsideClick(formRef, [buttonRef])
  const [options, setOptions] = useDefaultEmpty<Tag>()

  const {
    isOpen, getToggleButtonProps, getMenuProps, getInputProps, getComboboxProps, getItemProps, inputValue,
    highlightedIndex, setInputValue, setHighlightedIndex, closeMenu
  } = useCombobox({
    items: options,
    onInputValueChange: ({inputValue}) => {
      const filteredItems = props.tags?.filter(item =>
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
      selectedItem && props.onTag(selectedItem)
      return
    }
  })

  useEffect(
    () => {
      setOptions(props.tags)
    }, [props.tags, closeMenu]
  )

  const willCreateTag = () => {
    setFormVisible(true)
    closeMenu()
  }

  const createTag = (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => {
    props.onNewTag(tagText, tagColor, scopeText, scopeColor, scopeExclusive)
    setFormVisible(false)
  }

  return (
    <span id={"tag-add-wrapper"}>
      <div className={"snovy-combo-box"} {...getComboboxProps()}>
        <span className="snovy-combo-box-wrapper">
          <AddButton
            ref={buttonRef} onClick={() => {
            flipForm()
            closeMenu()
          }}
          />
          <input {...getToggleButtonProps()}
                 className="snovy-combo-box-input" placeholder="Select or create tag..."
                 {...getInputProps({
                   onKeyDown: e => {options.isEmpty() && useKey(e, [{key: Key.Enter, handler: willCreateTag}])}
                 })}
          />
          <CollapseButton {...getToggleButtonProps()} aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="tag-dropdown" hidden={!isOpen}>
          {isOpen && options.map((item, index) => (
            <ComboBoxItem
              key={index} item={item} highlighted={highlightedIndex == index}{...getItemProps({item, index})}
            />
          ))}
          {isOpen && options.isEmpty() &&
          <ComboCreateItem onClick={willCreateTag} highlight inputValue={inputValue} itemName="tag"/>
          }
        </ul>
      </div>
      {formVisible &&
      <TagForm ref={formRef} initialValue={inputValue} onConfirm={createTag}/>
      }
    </span>

  )
}

export default TagComboBox