import React, {forwardRef, useEffect} from "react"
import ListItem from "./ListItem"
import {KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/hooks"
import {GenericItem} from "../../util/types"

export type ListPresets = "simple" | "editable"

type ListOptions = {
  readonly?: boolean,
  useMultiSelect?: boolean //TODO?
  preset?: ListPresets
}

const defaultOptions: ListOptions = {
  readonly: false,
  useMultiSelect: true,
  preset: "editable"
}

//TODO track highlighted item & apply hover & focus
interface ListProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLOListElement>, "onSelect" | "type"> {
  items: Array<T> | undefined
  selection?: Array<T>
  onSelectionChange?: (items: Array<T>) => void
  active?: T | undefined
  onActiveChange?: (item: T | undefined) => void
  onContext?: (active: T | undefined) => void
  onItemValueChange?: (str: string) => void
  options?: ListOptions
  customItem?: (item: T) => React.ReactElement
}

const ListWithRef = forwardRef(<T extends GenericItem>(
  {
    items,
    selection,
    onSelectionChange,
    active,
    onActiveChange,
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

  const {
    activeItem,
    setActiveItem,
    selectedItems,
    setSelectedItems,
    handleItemClick,
    resetSelection
  } = useMultiSelect<T>(items)

  const keyMap: Array<KeyMapping> = [
    {key: Key.Escape, handler: resetSelection}
  ]

  useEffect(
    () => {
      if (items && !items.isEmpty()) {
        active && setActiveItem(active)
        selection && setSelectedItems(selection)
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
      onActiveChange && activeItem != active && onActiveChange(activeItem)
    }, [activeItem]
  )

  useEffect(
    () => {
      onSelectionChange && selectedItems != selection && onSelectionChange(selectedItems)
    }, [selectedItems]
  )

  return (
    <ol
      {...props} ref={ref} className="snovy-list" data-disabled={!items} tabIndex={-1}
      onKeyDown={e => useKey(e, keyMap)} onContextMenu={() => onContext && onContext(undefined)}
    >
      {items?.map((item, index) =>
        <ListItem
          key={index} item={item} preset={options.preset} customItem={customItem} onValueChange={onItemValueChange}
          selected={selectedItems.includes(item)} active={activeItem == item}
          onSelect={handleItemClick} onContext={onContext}
        />)
      }
      {children}
    </ol>
  )

})

const List = ListWithRef as <T extends GenericItem>(props: ListProps<T> & { ref?: React.Ref<HTMLOListElement> }) => JSX.Element
export default List