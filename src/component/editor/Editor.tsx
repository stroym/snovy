import React, {useContext, useEffect, useState} from "react"
import Note from "../../data/model/Note"
import {default as OutlineEditor, theme} from "rich-markdown-editor"
import base from "rich-markdown-editor/dist/dictionary"
import OptionsContext from "../../util/OptionsContext"

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const currentTheme = useContext(OptionsContext).theme

  const [value, setValue] = useState("")
  const [sourceMode, setSourceMode] = useState(false)

  //https://github.com/outline/rich-markdown-editor/blob/main/src/theme.ts
  const dark = {
    ...theme,
    background: currentTheme.primary,
    text: currentTheme.textPrimary,
    code: currentTheme.textPrimary,
    cursor: currentTheme.textPrimary,

    toolbarBackground: currentTheme.secondary,
    toolbarHoverBackground: currentTheme.hover,
    toolbarInput: currentTheme.secondary,
    toolbarItem: currentTheme.activeItem,

    tableDivider: currentTheme.secondary,
    tableSelected: currentTheme.textPrimary,
    tableSelectedBackground: currentTheme.accent,

    quote: currentTheme.secondary,
    codeBackground: currentTheme.secondary,
    codeBorder: currentTheme.textPrimary,
    codeString: currentTheme.activeItem,
    horizontalRule: currentTheme.secondary,

    blockToolbarBackground: currentTheme.primary,
    blockToolbarTrigger: currentTheme.activeItem,
    blockToolbarTriggerIcon: currentTheme.textPrimary,
    blockToolbarItem: currentTheme.primary,
    blockToolbarText: currentTheme.textPrimary,
    blockToolbarHoverBackground: currentTheme.hover,
    blockToolbarDivider: currentTheme.secondary,

    scrollbarBackground: currentTheme.accent,
    scrollbarThumb: currentTheme.secondary
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