import React, {ChangeEvent, useContext, useEffect, useState} from "react"
import Toolbar from "../Toolbar"
import {NoteContext} from "../../Context"

const Editor = () => {

  const noteContext = useContext(NoteContext)

  const [value, setValue] = useState<string>("")

  useEffect(
    () => {
      setValue(noteContext?.activeNote?.content ?? "")
    }, [noteContext]
  )

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (noteContext?.activeNote) {
      setValue(e.target.value)
      noteContext.activeNote.content = e.target.value
    }
  }

  return (
    <div id="snovy-editor-container">
      <Toolbar id="snovy-editor-toolbar"/>
      <textarea id="snovy-editor" onChange={handleChange} value={value} disabled={!noteContext?.activeNote}/>
    </div>
  )

}

export default Editor