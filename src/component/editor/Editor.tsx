import React, {useContext, useEffect, useState} from "react"
import RichMarkdownEditor, {theme as OutlineTheme} from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import {ToggleButton} from "../inputs/Button"
import AppContext from "../../util/AppContext"

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const Editor = (props: {
  editorStyle: typeof OutlineTheme
}) => {

  const appContext = useContext(AppContext)

  const [value, setValue] = useState("")
  const [sourceMode, setSourceMode] = useState(false)

  useEffect(
    () => {
      if (appContext.activeNote && !appContext.activeNote?.content.isBlank()) {
        setValue(appContext.activeNote?.content ?? "")
      } else {
        setValue(" ")
      }
    }, [appContext.activeNote]
  )

  return (
    <div id="snovy-editor" data-disabled={!appContext.activeNote}>
      <div className="toolbar">
        <ToggleButton preset="check" circular getState={setSourceMode}/>
      </div>
      <div className="editor-wrapper" tabIndex={-1}>
        {/*{sourceMode && <textarea value={value} onChange={e => setValue(e.target.value)}/>}*/}
        <RichMarkdownEditor
          theme={props.editorStyle} dictionary={dictionary} placeholder="" value={value}
          readOnly={!appContext.activeNote}
          onChange={value => appContext.activeNote?.updateContent(value())}
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