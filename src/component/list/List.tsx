import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {IdentifiedItem, Item} from "../../model/common/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {append, Extras} from "../../util/ComponentUtils"
import {useMultiSelect} from "../../util/Hooks"

//TODO mutliselect
const List = <T extends IdentifiedItem | Item>(props: {
  onActiveChange?: (active: T | undefined) => void,
  onContextChange?: (active: T | null | undefined) => void,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  defaultFirst?: boolean,
  selection?: T,
  multipleSelection?: (items: Array<T>) => void
}) => {

  const selfRef = useRef<HTMLDivElement>(null)
  const {multiItems, setMultiItems, handleItemClick} = useMultiSelect<T>()
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  useEffect(
    () => {
      if (props.items && props.items.length > 1 && props.defaultFirst) {
        setMultiItems([props.items.first()!])
      }
    }, [props.items]
  )

  useEffect(
    () => {
      if (props.selection && props.items?.includes(props.selection)) {
        setMultiItems([props.selection])
      }
    }, [props.selection]
  )

  useEffect(
    () => {
      props.onActiveChange && props.onActiveChange(multiItems.first())
      props.multipleSelection && props.multipleSelection(multiItems)
    }, [multiItems]
  )

  useEffect(
    () => {
      if (props.onContextChange) {
        props.onContextChange(activeContext)
      }
    }, [activeContext]
  )

  // const handleItemClick = (item: T) => {
  //   if (multi) {
  //     if (multiItems.includes(item)) {
  //       setMultiItems(Array.from(multiItems).remove(item))
  //     } else {
  //       setMultiItems(multiItems.concat(item))
  //     }
  //   } else {
  //     setMultiItems([])
  //     setActiveItem(item)
  //   }
  // }

  return (
    <div
      ref={selfRef} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onContextMenu={() => setActiveContext(null)}
    >
      {props.items?.map((item: T) =>
        <ListItem
          key={item instanceof IdentifiedItem ? item.id : item.name} mapped={item}
          active={multiItems.includes(item)}
          activeContext={item == activeContext}
          onClick={handleItemClick}
          onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.contextChildren}
      </ContextMenu>
    </div>
  )

}

export default List