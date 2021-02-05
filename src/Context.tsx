import React, {useState} from "react"
import Note from "./model/Note"

export const NoteContext = React.createContext<NoteContextType | undefined>(undefined)

type NoteContextType = {
  activeNote: Note | undefined
  setActiveNote: React.Dispatch<React.SetStateAction<Note | undefined>>
}

export const NoteProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {
  const [activeNote, setActiveNote] = useState<Note | undefined>()

  return (
    <NoteContext.Provider
      value={{
        activeNote,
        setActiveNote
      }}
    >
      {props.children}
    </NoteContext.Provider>
  )
}