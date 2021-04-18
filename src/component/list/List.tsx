import React, {forwardRef, useEffect} from "react"
import ListItem from "./ListItem"
import {KeyMapping, useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/Hooks"

interface ListProps<T extends Record<string, any>> {
  id?: string
  items: Array<T> | undefined
  defaultFirst?: boolean //TODO defaultSelection, not this
  selection: Array<T>
  onSelect: (items: Array<any>) => void
  getContextTarget?: (active: any) => void
  onItemValueChange?: (str: string) => void
  children?: Array<React.ReactElement> | React.ReactElement
}

const List = forwardRef(<T extends Record<string, any>>(props: ListProps<T>, ref?: React.Ref<HTMLDivElement>) => {

  const {selectedItems, setSelectedItems, handleItemClick} = useMultiSelect<T>(props.items)

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: () => !selectedItems.isEmpty() && setSelectedItems([selectedItems.first()!])}
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
      props.onSelect && selectedItems != props.selection && props.onSelect(selectedItems)
    }, [selectedItems]
  )

  return (
    <div
      ref={ref} id={props.id} className="snovy-list" data-disabled={!props.items}
      onKeyDown={e => useKey(e, keyMap)}
      onContextMenu={() => props.getContextTarget && props.getContextTarget(undefined)}
    >
      {props.items?.map((item, index) =>
        <ListItem
          key={index} mapped={item} onValueChange={props.onItemValueChange}
          selected={selectedItems.includes(item)} active={selectedItems.first() == item}
          onItemClick={handleItemClick} onContext={props.getContextTarget}
        />)
      }
      {props.children}
    </div>
  )

})

List.displayName = "List"

export default List