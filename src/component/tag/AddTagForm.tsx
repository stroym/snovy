import React, {useEffect, useRef, useState} from "react"
import TagSelector from "./TagSelector"
import Tag from "../../model/coloured/Tag"
import TagComboBox from "../combo_box/TagComboBox"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {AddButton} from "../Button"

const AddTagForm = (props: {
  tags: Array<Tag>,
  onTag: (tag: Tag) => void
}) => {

  const formRef = useRef(null)
  const buttonRef = useRef(null)

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
      <AddButton ref={buttonRef} onClick={flip}/>
        <TagComboBox
          items={items}
          onActiveChange={props.onTag}
          createTag={(str: string) => {
            setInputValue(str)
            setVisible(true)
          }}
        />
      {visible &&
      <TagSelector ref={formRef} initialValue={inputValue}/>
      }
    </span>
  )

}

export default AddTagForm