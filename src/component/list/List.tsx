import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {IdentifiedItem, Item} from "../../model/common/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {append, Extras} from "../../util/ComponentUtils"

//TODO mutliselect
const List = <T extends IdentifiedItem | Item>(props: {
  onActiveChange?: (active: T | undefined) => void,
  onContextChange?: (active: T | null | undefined) => void,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  defaultFirst?: boolean,
  selection?: T
}) => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [activeItem, setActiveItem] = useState<T | undefined>(props.selection)
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  useEffect(
    () => {
      if (props.defaultFirst) {
        setActiveItem(props.items?.first())
      }
    }, [props.items]
  )

  useEffect(
    () => {
      if (props.items?.includes(props.selection!)) {
        setActiveItem(props.selection)
      }
    }, [props.selection]
  )

  useEffect(
    () => {
      props.onActiveChange && props.onActiveChange(activeItem)
    }, [activeItem]
  )

  useEffect(
    () => {
      if (props.onContextChange) {
        props.onContextChange(activeContext)
      }
    }, [activeContext]
  )

  return (
    <div
      ref={selfRef} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onContextMenu={() => setActiveContext(null)}
    >
      {props.items?.map((item: T) =>
        <ListItem
          key={item instanceof IdentifiedItem ? item.id : item.name} mapped={item} active={item == activeItem}
          activeContext={item == activeContext}
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