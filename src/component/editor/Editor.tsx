import React, {useEffect, useState} from "react"
import Note from "../../data/model/Note"
import RichMarkdownEditor, {theme as OutlineTheme} from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import {ToggleButton} from "../inputs/Button"

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const Editor = (props: {
  activeNote: Note | undefined
  editorStyle: typeof OutlineTheme
}) => {

  const [value, setValue] = useState("")
  const [sourceMode, setSourceMode] = useState(false)

  useEffect(
    () => {
      if (props.activeNote && !props.activeNote.content.isBlank()) {
        setValue(props.activeNote.content)
      } else {
        setValue(" ")
      }
    }, [props.activeNote]
  )

  return (
    <div id="snovy-editor" data-disabled={!props.activeNote}>
      <div className="toolbar">
        <ToggleButton preset="check" circular getState={setSourceMode}/>
      </div>
      <div className="editor-wrapper" tabIndex={-1}>
        {/*{sourceMode && <textarea value={value} onChange={e => setValue(e.target.value)}/>}*/}
        <RichMarkdownEditor
          theme={props.editorStyle} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}
          onChange={value => props.activeNote?.updateContent(value())}
          style={{
            display: sourceMode ? "none" : "initial",
            visibility: sourceMode ? "hidden" : "initial",
            height: sourceMode ? "0" : "initial"
          }}
        />
      </div>
    </div>
  )

}

export default Editor