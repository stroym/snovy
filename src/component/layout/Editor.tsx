import React, {ChangeEvent, useEffect, useState} from "react"
import Note from "../../model/Note"

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const [value, setValue] = useState<string>("")

  useEffect(
    () => {
      setValue(props.activeNote?.content ?? "")
    }, [props.activeNote]
  )

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (props.activeNote) {
      setValue(e.target.value)
      props.activeNote.content = e.target.value
    }
  }

  return (
    <textarea id="snovy-editor" onChange={handleChange} value={value} disabled={!props.activeNote}/>
  )

}

export default Editor