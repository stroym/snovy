import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {append, Extras} from "../../util/ComponentUtils"
import {useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/Hooks"

export interface WithTitle {
  title: string

  toString(): string
}

const List = <T extends WithTitle>(props: {
  id?: string,
  items: Array<T> | undefined,
  defaultFirst?: boolean, //TODO defaultSelection, not this
  selection: Array<T>
  onSelect: (items: Array<T>) => void,
  context?: { items: Array<React.ReactElement<typeof ContextMenuItem>>, onChange: (active: T | null | undefined) => void }
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
      props.context && props.context.onChange(activeContext)

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
      props.onSelect && selectedItems != props.selection && props.onSelect(selectedItems)
    }, [selectedItems]
  )

  return (
    <div
      ref={selfRef} id={props.id} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onKeyDown={e => useKey(e, keyBindings)}
    >
      {props.items?.map((item, index) =>
        <ListItem
          key={index} mapped={item}
          selected={selectedItems.includes(item)} active={selectedItems.first() == item}
          activeContext={item == activeContext}
          onClick={handleItemClick} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      {props.context &&
        //TODO reset context doesn't work properly when clicking on parent - maybe use ref?
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.context.items}
      </ContextMenu>
      }
    </div>
  )

}

export default List