import React, {useRef, useState} from "react"
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

const TagNoteForm = (props: {
  tags: Array<Tag>,
  onTag: (tag: Tag) => void
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState("")

  const populateDropdown = (str: string) => {
    const temp = new Stringer(str)
  }

  //TODO on tab apply scope if applicable, maybe?
  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
        <TagComboBox
          items={props.tags}
          onActiveChange={props.onTag}
        />
      {inputValue &&
      <TagSelector/>
      }
    </span>
  )

}

export default TagNoteForm