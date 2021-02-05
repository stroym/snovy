import React, {useContext, useRef, useState} from "react"
import {useHide} from "../../Hooks"
import TagSelector from "./TagSelector"
import ComboBox from "../ComboBox"
import Notebook from "../../model/Notebook"
import {NoteContext} from "../../Context"
import Tag from "../../model/coloured/Tag"

const TagNoteForm = (props: {
  notebook?: Notebook,
  onUpdate: () => void
}) => {

  const noteContext = useContext(NoteContext)

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, x, y, handleClick, flip} = useHide(selfRef)

  const [create, setCreate] = useState(false)

  //TODO new tag picker (checkbox scope, input && colour picker scope && exclusive checkbox || parse single input
  // - might be nice to provide both as an option down the line), input && colour picker tag)
  // also: something fancier would be nice for scoped tags
  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
      {
        props.notebook && noteContext && noteContext.activeNote &&
        <ComboBox
          items={props.notebook.sets.availableTags(noteContext.activeNote)}
          onActiveChange={(tag: Tag) => {
            noteContext.activeNote!.tag(tag)
            props.onUpdate()
          }}
        />
      }
      {visible &&
      <TagSelector/>
      }
    </span>
  )
}

export default TagNoteForm