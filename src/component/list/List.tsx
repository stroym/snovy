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
  onSelect?: (items: Array<T>) => void,
  buildContext?: (contextItem: T | undefined | null) => Array<React.ReactElement<typeof ContextMenuItem>>,
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
      if (activeContext && !selectedItems.isEmpty() && !selectedItems.includes(activeContext)) {
        setSelectedItems([selectedItems.first()!])
      }
    }, [activeContext]
  )

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

  return (
    <div
      ref={selfRef} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onKeyDown={e => useKey(e, keyBindings)}
    >
      {props.items?.map((item: T) =>
        <ListItem
          key={item instanceof IdentifiedItem ? item.id : item.name} mapped={item}
          selected={selectedItems.includes(item)} active={selectedItems.first() == item}
          activeContext={item == activeContext}
          onClick={handleItemClick} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      {props.buildContext &&
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.buildContext(activeContext)}
      </ContextMenu>
      }
    </div>
  )

}

export default List