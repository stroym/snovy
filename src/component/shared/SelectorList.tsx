import React, {useEffect, useRef, useState} from "react"
import SelectorListItem from "./SelectorListItem"

import "react-contexify/dist/ReactContexify.css"
import {Holder} from "../../model/Base"
import ContextMenu, {Action, ActionType} from "./ContextMenu"

//TODO pass holder instead of items, probably
const SelectorList = <T extends Holder<any, any>>(props: {
  id: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (action: Action) => any,
  items: T[]
}) => {

  const selfRef = useRef<HTMLOListElement>(null)

  const [activeItem, setActiveItem] = useState<T>()
  const [activeContext, setActiveContext] = useState<T>()
  const [actions, setActions] = useState<Array<Action>>([])

  useEffect(
    () => {
      if (props.items.length > 0) {
        setActiveItem(props.items[0])
      } else {
        setActiveItem(undefined)
      }
    }, [props.items]
  )

  useEffect(
    () => {
      props.onActiveChange(activeItem)
    }, [activeItem]
  )

  useEffect(
    () => {
      if (activeContext) {
        setActions([
          new Action("new", ActionType.NEW, activeContext),
          new Action("rename", ActionType.EDIT, activeContext),
          new Action("delete", ActionType.DELETE, activeContext)
        ])
      } else {
        setActions([])
        // console.log("probably parent click, buddy");
      }
    }, [activeContext, setActiveContext]
  )

  const itemClick = (item: T) => {
    setActiveItem(item)
  }

  const itemContext = (item: T) => {
    setActiveContext(item)
  }

  return (
    <ol id={props.id} ref={selfRef} className="snovy-list-selector">
      {props.items.map((item: T) => <SelectorListItem key={item.id} mapped={item} active={item == activeItem}
                                                      onClick={itemClick} onContext={itemContext}/>)}
      <ContextMenu parentRef={selfRef} actions={actions} contextChange={props.onContextChange}
                   resetContext={() => setActiveContext(undefined)}/>
    </ol>
  )

}

export default SelectorList