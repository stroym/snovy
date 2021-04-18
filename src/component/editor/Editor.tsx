import React, {useEffect, useState} from "react"
import Note from "../../data/model/Note"
import RichMarkdownEditor from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import {ToggleButton} from "../inputs/Button"

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const Editor = (props: {
  activeNote: Note | undefined
  editorStyle: any
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

  //TODO outline doesn't like being unmounted... -.-
  return (
    <div id="snovy-editor" data-disabled={!props.activeNote}>
      <div className="toolbar">
        <ToggleButton preset="check" getState={setSourceMode}/>
      </div>
      <div className="editor-wrapper">
        <RichMarkdownEditor
          theme={props.editorStyle} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}
          onChange={value => props.activeNote?.updateContent(value())}
        />
        {/*{*/}
        {/*  sourceMode ?*/}
        {/*    <textarea*/}
        {/*      value={value} onChange={e => {setValue(e.target.value)}}*/}
        {/*      style={{*/}
        {/*        color: currentTheme.textPrimary*/}
        {/*      }}*/}
        {/*    /> :*/}
        {/*    <RichMarkdownEditor*/}
        {/*      theme={dark} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}*/}
        {/*      onChange={value => setValue(value())}*/}
        {/*    />*/}
        {/*}*/}
      </div>
    </div>
  )

}

export default Editor