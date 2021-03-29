import React, {useEffect, useState} from "react"
import Note from "../../data/model/Note"
import {default as OutlineEditor, theme} from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import {useTheme} from "@emotion/react"

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
    background: currentTheme.primary,
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

  return (
    <div id="snovy-editor" data-disabled={!props.activeNote}>
      {/*<CheckButton toggle={sourceMode} onClick={() => setSourceMode(!sourceMode)}/>*/}
      <OutlineEditor
        theme={dark} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}
        onChange={value => {props.activeNote!.updateContent(value().replaceAll("\\\n", "\n"))}}
      />
    </div>
  )

}

export default Editor