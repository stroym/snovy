import React, {useContext, useRef, useState} from "react"
import {useHide} from "../../Hooks"
import TagSelector from "./TagSelector"
import ComboBox from "../ComboBox"
import Notebook from "../../model/Notebook"
import {NoteContext} from "../../Context"
import Tag from "../../model/coloured/Tag"

const TagNoteForm = (props: {
  notebook?: Notebook
}) => {

  const noteContext = useContext(NoteContext)

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, x, y, handleClick, flip} = useHide(selfRef)

  const [create, setCreate] = useState(false)

  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
      <ComboBox
        items={props.notebook?.sets.tags}
        onActiveChange={(tag: Tag | undefined) => {tag && noteContext?.activeNote?.tag(tag)}}
      />
      {visible &&
      <TagSelector/>
      }
    </span>
  )
}

export default TagNoteForm