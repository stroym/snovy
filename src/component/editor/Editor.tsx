import React, {useContext, useEffect, useState} from "react"
import Note from "../../data/model/Note"
import {append, Extras} from "../../util/ComponentUtils"
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
    background: currentTheme.primaryColor,
    text: currentTheme.primaryTextColor,
    code: currentTheme.primaryTextColor,
    cursor: currentTheme.primaryTextColor,

    toolbarBackground: currentTheme.secondaryColor,
    toolbarHoverBackground: currentTheme.hoverItemColor,
    toolbarInput: currentTheme.secondaryColor,
    toolbarItem: currentTheme.activeItemColor,

    tableDivider: currentTheme.secondaryColor,
    tableSelected: currentTheme.primaryTextColor,
    tableSelectedBackground: currentTheme.accentColor,

    quote: currentTheme.secondaryColor,
    codeBackground: currentTheme.secondaryColor,
    codeBorder: currentTheme.primaryTextColor,
    codeString: currentTheme.selectedItemColor,
    horizontalRule: currentTheme.secondaryColor,

    blockToolbarBackground: currentTheme.primaryColor,
    blockToolbarTrigger: currentTheme.activeItemColor,
    blockToolbarTriggerIcon: currentTheme.primaryTextColor,
    blockToolbarItem: currentTheme.primaryColor,
    blockToolbarText: currentTheme.primaryTextColor,
    blockToolbarHoverBackground: currentTheme.hoverItemColor,
    blockToolbarDivider: currentTheme.secondaryColor,

    scrollbarBackground: currentTheme.scrollbarColor,
    scrollbarThumb: currentTheme.secondaryColor
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
    <div className={append(!props.activeNote, Extras.DISABLED)} id="snovy-editor">
      {/*<CheckButton toggle={sourceMode} onClick={() => setSourceMode(!sourceMode)}/>*/}
      <OutlineEditor
        theme={dark} dictionary={dictionary} placeholder="" value={value} readOnly={!props.activeNote}
        onChange={value => {props.activeNote!.updateContent(value().replaceAll("\\\n", "\n"))}}
      />
    </div>
  )

}

export default Editor