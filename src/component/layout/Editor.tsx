import React, {useEffect, useRef, useState} from "react"
import Note from "../../model/Note"
import {EditorState} from "draft-js"
import {default as DraftEditor} from "@draft-js-plugins/editor"
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin"
import {stateToMarkdown} from "draft-js-export-markdown"
import {stateFromMarkdown} from "draft-js-import-markdown"

const plugins = [createMarkdownShortcutsPlugin()]

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const [state, setState] = useState(EditorState.createEmpty())

  const selfRef = useRef<DraftEditor>(null)

  useEffect(
    () => {
      focusEditor()
    }, []
  )

  useEffect(
    () => {
      if (props.activeNote) {
        setState(EditorState.createWithContent(stateFromMarkdown(props.activeNote.content)))
      }
    }, [props.activeNote]
  )

  const focusEditor = () => {
    selfRef.current?.focus()
  }

  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType()
    if (type === "unordered-list-item" || type === "ordered-list-item") {
      return "myListStyle"
    }

    return ""
  }

  return (
    <div id="snovy-editor" onClick={focusEditor}>
      <DraftEditor
        ref={selfRef} plugins={plugins} editorState={state}

        blockStyleFn={myBlockStyleFn}
        onChange={editorState => {
          setState(editorState)
          //probably only save like once every 5seconds to save on computing
          if (props.activeNote) {
            props.activeNote.content = stateToMarkdown(editorState.getCurrentContent())
          }
        }}
      />
    </div>
  )

}

export default Editor