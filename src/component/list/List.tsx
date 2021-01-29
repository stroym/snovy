import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {Item} from "../../model/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"

//TODO mutliselect
const List = <T extends Item>(props: {
  id?: string,
  onActiveChange: (active: T | undefined) => any,
  onContextChange: (active: T | null | undefined) => any,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  defaultFirst?: boolean,
  selection?: T
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [activeItem, setActiveItem] = useState<T | undefined>()
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  useEffect(
    () => {
      if (props.items?.includes(props.selection!)) {
        setActiveItem(props.selection)
      } else if (props.defaultFirst) {
        setActiveItem(props.items?.first())
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
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.contextChildren}
      </ContextMenu>
    </div>
  )

}

export default List