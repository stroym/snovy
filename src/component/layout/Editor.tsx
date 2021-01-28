import React, {ChangeEvent, useContext, useEffect, useState} from "react"
import Toolbar from "../Toolbar"
import {NoteContext} from "../../Context"

const Editor = () => {

  const noteContext = useContext(NoteContext)

  if (!noteContext) {
    return null
  }

  const [value, setValue] = useState<string>("")

  useEffect(
    () => {
      setValue(noteContext.activeNote?.content ?? "")
    }, [noteContext]
  )

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (noteContext.activeNote) {
      setValue(event.target.value)
      noteContext.activeNote.content = event.target.value
    }
  }

  return (
    <div id="snovy-editor-container">
      <Toolbar id="snovy-editor-toolbar"/>
      <textarea id="snovy-editor" onChange={handleChange} value={value} disabled={!noteContext.activeNote}/>
    </div>
  )

}

export default Editor