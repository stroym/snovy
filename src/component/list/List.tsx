import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {Item} from "../../model/Base"
import ContextMenu, {Action} from "../context_menu/ContextMenu"

//TODO mutliselect
const List = <T extends Item>(props: {
  id?: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (active: T | null | undefined) => any,
  contextActions?: Array<Action>,
  items: Array<T> | undefined
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [activeItem, setActiveItem] = useState<T>()
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  useEffect(
    () => {
      if (props.items && props.items.length > 0) {
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
      props.onContextChange(activeContext)
    }, [activeContext]
  )

  return (
    <div id={props.id} ref={selfRef} className={"snovy-list".concat(props.items ? "" : " disabled")}
         onContextMenu={() => setActiveContext(null)}>
      {props.items?.map((item: T) =>
        <ListItem key={item.id} mapped={item} active={item == activeItem} activeContext={item == activeContext}
                  onClick={(item: T) => {setActiveItem(item)}} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      <ContextMenu parentRef={selfRef} actions={props.contextActions} resetContext={() => setActiveContext(undefined)}/>
    </div>
  )

}

export default List