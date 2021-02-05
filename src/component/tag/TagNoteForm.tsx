import React, {useRef, useState} from "react"
import TagSelector from "./TagSelector"
import ComboBox from "../combo_box/ComboBox"
import Notebook from "../../model/Notebook"
import Tag from "../../model/coloured/Tag"
import Note from "../../model/Note"

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
  note: Note,
  notebook: Notebook,
  onUpdate: () => void
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [inputValue, setInputValue] = useState("")

  const populateDropdown = (str: string) => {
    const temp = new Stringer(str)
  }

  //TODO on tab apply scope if applicable, maybe?
  // and also probably different combobox...
  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
        <ComboBox
          items={props.notebook.sets.availableTags(props.note)}
          onActiveChange={(tag: Tag) => {
            props.note!.tag(tag)
            props.onUpdate()
          }}
        />
      {inputValue &&
      <TagSelector/>
      }
    </span>
  )

}

export default TagNoteForm