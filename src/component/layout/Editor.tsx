import React, {useEffect, useRef, useState} from "react"
import Note from "../../model/Note"
import {ContentState, EditorState} from "draft-js"
import {default as DraftEditor} from "@draft-js-plugins/editor"
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin"
import {stateToMarkdown} from "draft-js-export-markdown"
import {stateFromMarkdown} from "draft-js-import-markdown"
import {CheckButton} from "../inputs/Button"
import {append, Extras} from "../../util/ComponentUtils"

const plugins = [createMarkdownShortcutsPlugin()]

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const selfRef = useRef<DraftEditor>(null)

  const [state, setState] = useState(EditorState.createEmpty())
  const [sourceMode, setSourceMode] = useState(false)
  const [loadedPlugins, setLoadedPlugins] = useState(plugins)

  useEffect(
    () => {
      if (props.activeNote) {
        loadContent()
        // setState(EditorState.moveFocusToEnd(state)) TODO autofocus on note change
      } else {
        setState(EditorState.createEmpty())
      }
    }, [props.activeNote]
  )

  useEffect(
    () => {
      if (sourceMode) {
        setState(EditorState.createWithContent(ContentState.createFromText(stateToMarkdown(state.getCurrentContent()))))
        setLoadedPlugins([])
      } else {
        setLoadedPlugins(plugins)
        setState(EditorState.createWithContent(stateFromMarkdown(state.getCurrentContent().getPlainText())))
      }
    }, [sourceMode]
  )

  const focusEditor = () => {
    selfRef.current?.focus()
  }

  const loadContent = () => {
    if (props.activeNote) {
      if (sourceMode) {
        setState(EditorState.createWithContent(ContentState.createFromText(props.activeNote.content)))
      } else {
        setState(EditorState.createWithContent(stateFromMarkdown(props.activeNote.content)))
      }
    }
  }

  const writeContent = (editorState: EditorState) => {
    if (props.activeNote) {
      if (sourceMode) {
        props.activeNote.content = editorState.getCurrentContent().getPlainText()
      } else {
        props.activeNote.content = stateToMarkdown(editorState.getCurrentContent())
      }
    }
  }

  return (
    <div className={append(!props.activeNote, Extras.DISABLED)} id="snovy-editor" onClick={focusEditor}>
      <CheckButton toggle={sourceMode} onClick={() => setSourceMode(!sourceMode)}/>
      <DraftEditor
        ref={selfRef} plugins={loadedPlugins} editorState={state} readOnly={!props.activeNote}
        onChange={editorState => {
          setState(editorState)
          writeContent(editorState)
        }}
      />
    </div>
  )

}

export default Editor