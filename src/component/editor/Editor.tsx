import React, {useEffect, useState} from "react"
import Note from "../../model/Note"
import {append, Extras} from "../../util/ComponentUtils"
import {default as OutlineEditor, theme} from "rich-markdown-editor"
import {colors} from "../theme"
import base from "rich-markdown-editor/dist/dictionary"

const Editor = (props: {
  activeNote: Note | undefined
}) => {

  const [value, setValue] = useState("")
  const [sourceMode, setSourceMode] = useState(false)

  useEffect(
    () => {
      if (props.activeNote) {
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
        onChange={value => {props.activeNote!.content = value().replaceAll("\\\n", "\n")}}
      />
    </div>
  )

}

const outlineColors = {
  almostBlack: colors.primaryDark,
  lightBlack: "#2F3336",
  almostWhite: "#E6E6E6",
  white: "#FFF",
  white10: "rgba(255, 255, 255, 0.1)",
  black: "#000",
  black10: "rgba(0, 0, 0, 0.1)",
  primary: "#1AB6FF",
  greyLight: "#F4F7FA",
  grey: "#E8EBED",
  greyMid: "#C5CCD3",
  greyDark: "#DAE1E9"
}

const dictionary = {
  ...base,
  newLineEmpty: "",
  newLineWithSlash: ""
}

const dark = {
  ...theme,
  background: outlineColors.almostBlack,
  text: outlineColors.almostWhite,
  code: outlineColors.almostWhite,
  cursor: outlineColors.white,
  divider: "#4E5C6E",
  placeholder: "#52657A",

  toolbarBackground: outlineColors.almostBlack,
  toolbarHoverBackground: outlineColors.greyMid,
  toolbarInput: outlineColors.black10,
  toolbarItem: outlineColors.greyLight,

  tableDivider: outlineColors.lightBlack,
  tableSelected: outlineColors.primary,
  tableSelectedBackground: "#002333",

  quote: outlineColors.greyDark,
  codeBackground: outlineColors.black,
  codeBorder: outlineColors.lightBlack,
  codeString: "#3d8fd1",
  horizontalRule: outlineColors.lightBlack,
  imageErrorBackground: "rgba(0, 0, 0, 0.5)",

  blockToolbarBackground: outlineColors.almostBlack,
  blockToolbarTrigger: outlineColors.white,
  blockToolbarTriggerIcon: outlineColors.white,
  blockToolbarItem: outlineColors.almostBlack,
  blockToolbarText: outlineColors.white,
  blockToolbarHoverBackground: outlineColors.almostWhite,
  blockToolbarDivider: outlineColors.white,

  scrollbarBackground: outlineColors.black,
  scrollbarThumb: outlineColors.lightBlack
}

export default Editor