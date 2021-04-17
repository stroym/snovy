import React, {useEffect, useState} from "react"
import Note from "../../data/model/Note"
import RichMarkdownEditor, {theme} from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import {useTheme} from "@emotion/react"
import {CheckButton} from "../inputs/Button"

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const currentTheme = useTheme()

  const [value, setValue] = useState("")
  const [sourceMode, setSourceMode] = useState(false)

  //https://github.com/outline/rich-markdown-editor/blob/main/src/theme.ts
  const dark = {
    ...theme,
    background: "transparent",
    text: currentTheme.textPrimary,
    code: currentTheme.textPrimary,
    cursor: currentTheme.textPrimary,

    toolbarBackground: currentTheme.primary,
    toolbarHoverBackground: currentTheme.hover,
    toolbarInput: currentTheme.primary,
    toolbarItem: currentTheme.activeItem,

    tableDivider: currentTheme.primary,
    tableSelected: currentTheme.textPrimary,
    tableSelectedBackground: currentTheme.accent,

    quote: currentTheme.primary,
    codeBackground: currentTheme.primary,
    codeBorder: currentTheme.textPrimary,
    codeString: currentTheme.activeItem,
    horizontalRule: currentTheme.primary,

    blockToolbarBackground: currentTheme.primary,
    blockToolbarTrigger: currentTheme.activeItem,
    blockToolbarTriggerIcon: currentTheme.textPrimary,
    blockToolbarItem: currentTheme.primary,
    blockToolbarText: currentTheme.textPrimary,
    blockToolbarHoverBackground: currentTheme.hover,
    blockToolbarDivider: currentTheme.primary,

    scrollbarBackground: currentTheme.accent,
    scrollbarThumb: currentTheme.primary
  }

  useEffect(
    () => {
      if (props.activeNote && !props.activeNote.content.isBlank()) {
        setValue(props.activeNote.content)
      } else {
        setValue(" ")
      }
    }, [props.activeNote]
  )

  useEffect(
    () => {
      props.activeNote?.updateContent(value)
    }, [value]
  )

  //TODO outline doesn't like being unmounted... -.-
  return (
    <div
      id="snovy-editor" data-disabled={!props.activeNote}
      style={{
        backgroundColor: currentTheme.primary
      }}
    >
      <div className="toolbar">
        <CheckButton toggle={sourceMode} onClick={() => setSourceMode(!sourceMode)}/>
      </div>
      <div className="editor-wrapper">
        <RichMarkdownEditor
          theme={dark} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}
          onChange={value => setValue(value())}
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