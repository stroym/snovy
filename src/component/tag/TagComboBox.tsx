import React, {useEffect, useRef} from "react"
import {useCombobox} from "downshift"
import {AddButton, CollapseButton} from "../inputs/Button"
import {IdentifiedItem} from "../../model/common/Base"
import {Key} from "ts-key-enum"
import {useDefaultEmpty, useHideOnOutsideClick} from "../../util/Hooks"
import Tag from "../../model/coloured/Tag"
import ComboCreateItem from "../combo_box/ComboCreateItem"
import ComboBoxItem from "../combo_box/ComboBoxItem"
import TagForm from "./TagForm"

const TagComboBox = (props: {
  id?: string,
  className?: string,
  tags: Array<Tag>,
  onTag: (tag: Tag) => void,
  onNewTag: (tagText: string, tagColour: string, scopeText: string, scopeColour: string, scopeExclusive: boolean) => void
}) => {

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formVisible, setFormVisible, flipForm] = useHideOnOutsideClick(formRef, [buttonRef])
  const [options, setOptions] = useDefaultEmpty<Tag>()

  //TODO try to prevent tag text from flashing in input on select
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

  const createTag = (tagText: string, tagColour: string, scopeText: string, scopeColour: string, scopeExclusive: boolean) => {
    props.onNewTag(tagText, tagColour, scopeText, scopeColour, scopeExclusive)
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
                 {...getInputProps({onKeyDown: (e) => { options.isEmpty() && e.key == Key.Enter && willCreateTag()}})}
          />
          <CollapseButton {...getToggleButtonProps()} aria-label={"toggle menu"}/>
        </span>
        <ul {...getMenuProps()} className="snovy-dropdown" id="tag-dropdown" hidden={!isOpen}>
          {isOpen && options.map((item, index) => (
            <ComboBoxItem
              key={item instanceof IdentifiedItem ? item.id : item.name}
              {...getItemProps({item, index})}
              item={item} highlighted={highlightedIndex == index}
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