import React, {forwardRef, useEffect} from "react"
import ListItem from "./ListItem"
import {KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/hooks"
import {GenericItem} from "../../util/types"

export type ListPresets = "simple" | "editable"

type ListOptions = {
  readonly?: boolean,
  useMultiSelect?: boolean //TODO? maybe like allow selection to be Array<T> | T, but definitely don't expose activeItem setter
  preset?: ListPresets
}

const defaultOptions: ListOptions = {
  readonly: false,
  useMultiSelect: true,
  preset: "editable"
}

//TODO track highlighted item & apply hover & focus
interface ListProps<T extends GenericItem> extends Omit<React.HTMLProps<HTMLOListElement>, "onSelect" | "type"> {
  items: Array<T>
  selection?: Array<T>
  onSelectionChange?: (items: Array<T>) => void
  onActiveChange?: (item: T | undefined) => void
  onContext?: (active: T | undefined) => void
  onItemValueChange?: (str: string) => void
  options?: ListOptions
  customItem?: (item: T) => React.ReactElement
}

//TODO virtualize this
const ListWithRef = forwardRef(<T extends GenericItem>(
  {
    items,
    selection,
    onSelectionChange,
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
      if (items && !items.isEmpty() && selection && !selection.isEmpty()) {
        setSelectedItems(selection)
      }
    }, [items, selection]
  )

  useEffect(
    () => {
      onSelectionChange && selectedItems != selection && onSelectionChange(selectedItems)
      onActiveChange && onActiveChange(activeItem)
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