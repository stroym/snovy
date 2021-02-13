import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {IdentifiedItem, Item} from "../../model/common/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {append, Extras} from "../../util/ComponentUtils"
import {useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/Hooks"

const List = <T extends IdentifiedItem | Item>(props: {
  onSelect?: (items: Array<T>) => void
  onContextChange?: (active: T | null | undefined) => void,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  defaultFirst?: boolean,
  selection?: Array<T>
}) => {

  const selfRef = useRef<HTMLDivElement>(null)
  const {selectedItems, setSelectedItems, handleItemClick} = useMultiSelect<T>(props.items)
  const [activeContext, setActiveContext] = useState<T | undefined | null>()

  const keyBindings = [
    {
      key: Key.Escape,
      handler: () => {!selectedItems.isEmpty() && setSelectedItems([Array.from(selectedItems).first()!])}
    }
  ]

  useEffect(
    () => {
      if (props.items && !props.items.isEmpty() && props.defaultFirst) {
        setSelectedItems([props.items.first()!])
      }
    }, [props.items]
  )

  useEffect(
    () => {
      if (props.items && !props.items.isEmpty()) {
        if (props.selection && !props.selection.isEmpty() && props.items.includesAll(props.selection)) {
          setSelectedItems(props.selection)
        }
      }
    }, [props.selection]
  )

  useEffect(
    () => {
      props.onSelect && props.onSelect(selectedItems)
    }, [selectedItems]
  )

  useEffect(
    () => {
      props.onContextChange && props.onContextChange(activeContext)
    }, [activeContext]
  )

  return (
    <div
      ref={selfRef} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onKeyDown={e => useKey(e, keyBindings)}
    >
      {props.items?.map((item: T) =>
        <ListItem
          key={item instanceof IdentifiedItem ? item.id : item.name} mapped={item}
          active={selectedItems.includes(item)} activeContext={item == activeContext}
          onClick={handleItemClick} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      {props.contextChildren && !props.contextChildren?.isEmpty() &&
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.contextChildren}
      </ContextMenu>
      }
    </div>
  )

}

export default List