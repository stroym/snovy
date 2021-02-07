import React, {useEffect, useRef, useState} from "react"
import TagSelector from "./TagSelector"
import Tag from "../../model/coloured/Tag"
import TagComboBox from "../combo_box/TagComboBox"

class Stringer {

  name: string
  scopeName?: string

  constructor(str: string) {
    const parts = str.split(":")
    this.name = parts.pop()!
    this.scopeName = parts.pop()
  }

}

const AddTagForm = (props: {
  tags: Array<Tag>,
  onTag: (tag: Tag) => void
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState("")
  const [items, setItems] = useState(props.tags)

  useEffect(
    () => {
      setItems(props.tags)
    }, [props.tags]
  )

  const populateDropdown = (str: string) => {
    const temp = new Stringer(str)
    console.log(str)
  }

  //TODO on tab apply scope if applicable, maybe?
  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
        <TagComboBox
          items={items}
          onActiveChange={props.onTag}
          createTag={populateDropdown}
        />
      {inputValue &&
      <TagSelector/>
      }
    </span>
  )

}

export default AddTagForm