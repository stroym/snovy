import React, {forwardRef, useEffect} from "react"
import ListItem from "./ListItem"
import {KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/hooks"
import {GenericItem} from "../../util/types"

export type ListPresets = "simple" | "editable"

type ListOptions = {
  readonly?: boolean,
  defaultFirst?: boolean
  preset?: ListPresets
}

const defaultOptions: ListOptions = {
  readonly: false,
  defaultFirst: true,
  preset: "editable"
}

interface ListProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLOListElement>, "onSelect" | "type"> {
  items: Array<T> | undefined
  selection: Array<T>
  onSelect: (items: Array<T>) => void
  onContext?: (active: T | undefined) => void
  onItemValueChange?: (str: string) => void
  options?: ListOptions
  customItem?: (item: T) => React.ReactElement
}

//TODO maybe expose selectedItems AND activeItem
const ListWithRef = forwardRef(<T extends GenericItem>(
  {
    items,
    selection,
    onSelect,
    onContext,
    onItemValueChange,
    options: passedOptions,
    customItem,
    children,
    ...props
  }: ListProps<T>,
  ref?: React.Ref<HTMLOListElement>
) => {

  const options = passedOptions ? {...defaultOptions, ...passedOptions} : defaultOptions

  const {selectedItems, setSelectedItems, handleItemClick} = useMultiSelect<T>(items)

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: () => !selectedItems.isEmpty() && setSelectedItems([selectedItems.first()!])}
  ]

  useEffect(
    () => {
      if (items && !items.isEmpty() && options.defaultFirst) {
        setSelectedItems([items.first()!])
      }
    }, [items]
  )

  useEffect(
    () => {
      if (items && !items.isEmpty()) {
        if (selection && !selection.isEmpty() && items.includesAll(selection)) {
          setSelectedItems(selection)
        }
      }
    }, [selection]
  )

  useEffect(
    () => {
      onSelect && selectedItems != selection && onSelect(selectedItems)
    }, [selectedItems]
  )

  return (
    <ol
      {...props} ref={ref} className="snovy-list" data-disabled={!items}
      onKeyDown={e => useKey(e, keyMap)} onContextMenu={() => onContext && onContext(undefined)}
    >
      {items?.map((item, index) =>
        <ListItem
          key={index} item={item} preset={options.preset} customItem={customItem} onValueChange={onItemValueChange}
          selected={selectedItems.includes(item)} active={selectedItems.first() == item}
          onSelect={handleItemClick} onContext={onContext}
        />)
      }
      {children}
    </ol>
  )

})

const List = ListWithRef as <T extends GenericItem>(props: ListProps<T> & { ref?: React.Ref<HTMLOListElement> }) => JSX.Element
export default List