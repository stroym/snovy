import React, {useState} from "react"
import Note from "./model/Note"
import Section from "./model/Section"

export const NoteContext = React.createContext<NoteContextType | undefined>(undefined)

type NoteContextType = {
  activeNote: Note | undefined
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>
  activeSection: Section | undefined
  setActiveSection: React.Dispatch<React.SetStateAction<Section | undefined>>
}

export const NoteProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {
  const [activeNote, setActiveNote] = useState<Note | undefined>()
  const [activeSection, setActiveSection] = useState<Section | undefined>()

  return (
    <NoteContext.Provider
      value={{
        activeNote,
        setActiveNote,
        activeSection,
        setActiveSection
      }}
    >
      {props.children}
    </NoteContext.Provider>
  )
}