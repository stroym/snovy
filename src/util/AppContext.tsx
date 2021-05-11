import React, {useEffect, useState} from "react"
import {dexie} from "../index"
import Scope from "../data/model/Scope"
import State from "../data/model/State"
import Tag from "../data/model/Tag"
import {fetchTags} from "../data/Database"

const AppContext = React.createContext<AppContextType>({
  scopes: [],
  tags: [],
  states: [],
  setScopes: () => false,
  setTags: () => false,
  setStates: () => false
})

interface AppContextType {
  scopes: Array<Scope>
  tags: Array<Tag>
  states: Array<State>
  setScopes: (options: Array<Scope>) => void
  setTags: (options: Array<Tag>) => void
  setStates: (options: Array<State>) => void
}

export const AppProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {

  const [scopes, setScopes] = useState<Array<Scope>>([])
  const [tags, setTags] = useState<Array<Tag>>([])
  const [states, setStates] = useState<Array<State>>([])

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.scopes, dexie.tags, dexie.states], async () => {
        setScopes(await dexie.scopes.toArray())
        setTags(await fetchTags())
        setStates(await dexie.states.toArray())
      })
    }, []
  )

  return (
    <AppContext.Provider value={{scopes, tags, states, setScopes, setStates, setTags}}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContext
