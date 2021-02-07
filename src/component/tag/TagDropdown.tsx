import React, {useEffect, useRef, useState} from "react"
import TagForm from "./TagForm"
import Tag from "../../model/coloured/Tag"
import TagComboBox from "../combo_box/TagComboBox"
import {useHideOnOutsideClick} from "../../util/Hooks"

const TagDropdown = (props: {
  tags: Array<Tag>,
  onTag: (tag: Tag) => void
}) => {

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [visible, setVisible, flip] = useHideOnOutsideClick(formRef, [buttonRef])
  const [inputValue, setInputValue] = useState("")
  const [items, setItems] = useState(props.tags)

  useEffect(
    () => {
      setItems(props.tags)
    }, [props.tags]
  )

  //TODO on tab apply scope if applicable, maybe?
  return (
    <span id={"tag-add-wrapper"}>
        <TagComboBox
          buttonRef={buttonRef} flip={flip}
          items={items}
          onActiveChange={props.onTag}
          createTag={(str: string) => {
            setInputValue(str)
            setVisible(true)
          }}
        />
      {visible &&
      <TagForm ref={formRef} initialValue={inputValue}/>
      }
    </span>
  )

}

export default TagDropdown