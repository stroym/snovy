import React, {useEffect, useRef, useState} from "react"
import {useHideOnOutsideClick} from "../../util/Hooks"
import Tag from "../../data/model/Tag"
import TagForm from "./TagForm"
import Scope from "../../data/model/Scope"
import {AddButton} from "../inputs/Button"
import ComboBox from "../combo_box/ComboBox"
import Notebook from "../../data/model/Notebook"

const TagComboBox = (props: {
  notebook: Notebook,
  tags: Array<Tag>,
  scopes: Array<Scope>
  onTag: (tag: Tag) => void,
  onNewTag: (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => void
}) => {

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formVisible, , flipForm] = useHideOnOutsideClick(formRef, [buttonRef])
  const [menuVisible, setMenuVisible] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const createTag = (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => {
    props.onNewTag(tagText, tagColor, scopeText, scopeColor, scopeExclusive)
  }

  useEffect(
    () => {
      if (!formVisible) {
        setInputValue("")
      }
    }, [formVisible]
  )

  const flip = () => {
    setMenuVisible(false)
    flipForm()
  }

  const getInputValue = (value: string) => {
    setInputValue(value)
    !formVisible && flip()
  }

  return (
    <ComboBox
      items={props.tags} newItem={{getInputValue: getInputValue, name: "tag"}}
      options={{selectPreviousOnEsc: false, resetInputOnSelect: true}}
      createWithForm={{
        button: <AddButton ref={buttonRef} onClick={flip}/>,
        form: formVisible &&
          <TagForm
            ref={formRef} notebook={props.notebook} scopes={props.scopes} initialValue={inputValue}
            onConfirm={createTag}
          />,
        menuVisible: setMenuVisible,
        closeMenu: menuVisible
      }}
    />
  )

}

export default TagComboBox