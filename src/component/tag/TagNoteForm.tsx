import React, {useRef} from "react"
import {useHide} from "../../Hooks"
import TagSelector from "./TagSelector"
import ComboBox from "../ComboBox"
import Notebook from "../../model/Notebook"
import Tag from "../../model/coloured/Tag"
import Note from "../../model/Note"

const TagNoteForm = (props: {
  note: Note,
  notebook: Notebook,
  onUpdate: () => void
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, x, y, handleClick, flip} = useHide(selfRef)

  //TODO new tag picker (checkbox scope, input && colour picker scope && exclusive checkbox || parse single input
  // - might be nice to provide both as an option down the line), input && colour picker tag)
  // also: something fancier would be nice for scoped tags
  return (
    <span ref={selfRef} id={"tag-add-wrapper"}>
        <ComboBox
          items={props.notebook.sets.availableTags(props.note)}
          onActiveChange={(tag: Tag) => {
            props.note!.tag(tag)
            props.onUpdate()
          }}
        />
      {visible &&
      <TagSelector/>
      }
    </span>
  )

}

export default TagNoteForm