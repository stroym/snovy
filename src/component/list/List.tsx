import React, {useEffect, useRef, useState} from "react"
import ListItem from "./ListItem"
import {IdentifiedItem, Item} from "../../model/common/Base"
import ContextMenu from "../context_menu/ContextMenu"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {append, Extras} from "../../util/ComponentUtils"
import {useMultiSelect} from "../../util/Hooks"
import {isArray} from "../../util/Utils"

const List = <T extends IdentifiedItem | Item>(props: {
  onActiveChange?: (active: T | undefined) => void,
  onMultipleSelection?: (items: Array<T>) => void
  onContextChange?: (active: T | null | undefined) => void,
  contextChildren?: Array<React.ReactElement<typeof ContextMenuItem>>
  items: Array<T> | undefined,
  defaultFirst?: boolean,
  selection?: Array<T> | T
}) => {

  const selfRef = useRef<HTMLDivElement>(null)
  const {shiftMode, ctrlMode} = useMultiSelect<T>()
  const [activeContext, setActiveContext] = useState<T | undefined | null>()
  const [items, setItems] = useState<Array<T>>([])

  useEffect(
    () => {
      if (props.items && !props.items.isEmpty() && props.defaultFirst) {
        setItems([props.items.first()!])
      }
    }, [props.items]
  )

  useEffect(
    () => {
      console.log(props.selection)
      if (props.items && !props.items.isEmpty()) {
        if (isArray(props.selection)) {
          if (props.selection && !props.selection.isEmpty() && props.items.includesAll(props.selection)) {
            setItems(props.selection)
          }
        } else {
          if (props.selection && props.items.includes(props.selection)) {
            setItems([props.selection])
          }
        }
      }
    }, [props.selection]
  )

  useEffect(
    () => {
      props.onActiveChange && props.onActiveChange(items.first())
      props.onMultipleSelection && props.onMultipleSelection(items)
    }, [items]
  )

  useEffect(
    () => {
      props.onContextChange && props.onContextChange(activeContext)
    }, [activeContext]
  )

  const handleItemClick = (item: T) => {
    if (ctrlMode) {
      if (items.includes(item)) {
        if (items.length > 1) {
          setItems(Array.from(items).remove(item))
        }
      } else {
        setItems(items.concat(item))
      }
    } else if (shiftMode) {
      if (props.items) {
        if (items.includes(item)) {
          setItems(props.items.slice(props.items.indexOf(items.first()!), props.items.indexOf(item) + 1))
        } else {
          const indiFirst = props.items.indexOf(items.first()!)
          const indiItem = props.items.indexOf(item)

          console.log(indiFirst)
          if (indiItem > indiFirst) {
            setItems(props.items.slice(indiFirst, indiItem + 1))
          } else {
            setItems(props.items.slice(indiItem, indiFirst + 1).reverse())
          }
        }
      }
    } else {
      setItems([item])
    }
  }

  return (
    <div
      ref={selfRef} className={"snovy-list".concat(append(!props.items, Extras.DISABLED))}
      onContextMenu={() => setActiveContext(null)}
    >
      {props.items?.map((item: T) =>
        <ListItem
          key={item instanceof IdentifiedItem ? item.id : item.name} mapped={item}
          active={items.includes(item)} activeContext={item == activeContext}
          onClick={handleItemClick} onContext={(item: T) => {setActiveContext(item)}}
        />)
      }
      <ContextMenu parentRef={selfRef} resetContext={() => setActiveContext(undefined)}>
        {props.contextChildren}
      </ContextMenu>
    </div>
  )

}

export default List