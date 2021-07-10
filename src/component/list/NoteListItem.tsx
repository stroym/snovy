import React from "react"
import Note from "../../data/model/Note"
import {EditableInput} from "../inputs/Input"
import {ColorHelper} from "../inputs/ColorPicker"

export interface NoteListItemProps {
  note: Note
  onValueChange?: (str: string) => void
}

const NoteListItem = ({note, onValueChange, ...props}: NoteListItemProps) => {

  return (
    <div className="snovy-note-item">
      <EditableInput placeholder="Title" onValueChange={onValueChange} value={note.toString()}/>
      <ColorHelper color={note.state?.color ?? ""}/>
    </div>
  )

}

export default NoteListItem