import React, {ChangeEvent, useEffect, useState} from "react"
import Note from "../../model/Note"
import Toolbar from "../Toolbar"

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const [value, setValue] = useState<string>("")

  useEffect(
    () => {
      setValue(props.activeNote?.content ?? "")
    }, [props.activeNote, props.activeNote?.content]
  )

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.activeNote) {
      setValue(event.target.value)
      props.activeNote.content = event.target.value
    }
  }

  return (
    <div id="snovy-editor-container">
      <Toolbar id="snovy-editor-toolbar"/>
      <textarea id="snovy-editor" onChange={handleChange} value={value} disabled={!props.activeNote}/>
    </div>
  )

}

export default Editor