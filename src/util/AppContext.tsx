import React, {useEffect, useState} from "react"
import Notebook from "../data/model/Notebook"
import Section from "../data/model/Section"
import Note from "../data/model/Note"
import {useDefaultEmpty} from "./hooks"
import {isArray} from "./utils"
import {dexie} from "../index"
import generate from "../data/Generator"
import {Table} from "../data/model/Base"
import {useLiveQuery} from "dexie-react-hooks"
import Scope from "../data/model/Scope"
import State from "../data/model/State"
import Tag from "../data/model/Tag"

const AppContext = React.createContext<AppContextType>({
  notebooks: [],
  setNotebooks: () => false,
  activeNotebook: undefined,
  setActiveNotebook: () => false,
  selectedSections: [],
  setSelectedSections: () => false,
  selectedNotes: [],
  setSelectedNotes: () => false,
  tags: [],
  scopes: [],
  states: []
})

type AppContextType = {
  notebooks: Array<Notebook>
  setNotebooks: (items: Array<Notebook>) => void
  activeNotebook: Notebook | undefined
  setActiveNotebook: (item: Notebook | undefined) => void
  selectedSections: Array<Section>
  setSelectedSections: (items: Array<Section> | Section | undefined) => void
  selectedNotes: Array<Note>
  setSelectedNotes: (items: Array<Note> | Note | undefined) => void
  tags: Array<Tag>
  scopes: Array<Scope>
  states: Array<State>
}

export const AppProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {

  //TODO add context menu items context, maybe

  const tags = useLiveQuery(() => dexie.tags.toArray().then(async tags => {
    for (const tag of tags) {
      await tag.load()
    }
    return tags
  })) ?? []

  const scopes = useLiveQuery(() => dexie.scopes.toArray()) ?? []
  const states = useLiveQuery(() => dexie.states.toArray()) ?? []

  //TODO try adding sections and notes as an array as well, all that loading in lists is not going so well
  //also maybe like liveQuery that shit, since adding new things via context is borked, again

  const [notebooks, setNotebooks] = useDefaultEmpty<Notebook>()
  const [selectedSections, setSelectedSections] = useDefaultEmpty<Section>()
  const [selectedNotes, setSelectedNotes] = useDefaultEmpty<Note>()

  const [activeNotebook, setActiveNotebook] = useState<Notebook | undefined>()
  const [activeSection, setActiveSection] = useState<Section | undefined>()
  const [activeNote, setActiveNote] = useState<Note | undefined>()

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.notebooks, dexie.sections, dexie.notes, dexie.scopes, dexie.tags, dexie.states], async () => {
        await dexie.notebooks.toArray().then(async function (values) {
          // const loaded = values
          const loaded = values.isEmpty() ? await generate() : values

          setNotebooks(loaded.sort(Table.compareById))
          await selectNotebook(loaded.first())
        })
      })
    }, []
  )

  const resetSelected = () => {
    setSelectedSections([])
    setSelectedNotes([])
  }

  const selectNotebook = async (active: Notebook | undefined) => {
    if (active) {
      await active.load()
      setActiveNotebook(active)
    }

    resetSelected()
  }

  const selectSections = async (active: Array<Section> | Section | undefined) => {
    if (isArray(active)) {
      await active.first()?.load()
      setSelectedSections(active)
      active.isEmpty() && setSelectedNotes([])
    } else if (active) {
      await active.load()
      setSelectedSections([active])
    } else {
      resetSelected()
    }
  }

  const selectNotes = async (active: Array<Note> | Note | undefined) => {
    if (isArray(active)) {
      await active.first()?.load()
      setSelectedNotes(active)
    } else if (active) {
      await active.load()
      setSelectedNotes([active])
    } else {
      setSelectedNotes([])
    }
  }

  return (
    <AppContext.Provider
      value={{
        notebooks, setNotebooks,
        activeNotebook, setActiveNotebook: selectNotebook,
        selectedSections, setSelectedSections: selectSections,
        selectedNotes, setSelectedNotes: selectNotes,
        tags, scopes, states
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext
