import React from "react"
import Note from "../../data/model/Note"
import {EditableInput} from "../inputs/Input"
import {ColorButton} from "../inputs/Button"

export interface NoteListItemProps {
  note: Note
  onValueChange?: (str: string) => void
}

const NoteListItem = ({note, onValueChange, ...props}: NoteListItemProps) => {

  //TODO spawn modal/popup on double click for picking/creating states
  return (
    <div className="snovy-note-item">
      <EditableInput placeholder="Title" onValueChange={onValueChange} value={note.toString()}/>
      <ColorButton color={note.state?.color} onDoubleClick={() => false}/>
    </div>
  )

}

export default NoteListItem