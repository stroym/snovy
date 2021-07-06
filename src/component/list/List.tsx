import React, {forwardRef, MutableRefObject, useEffect, useRef} from "react"
import ListItem from "./ListItem"
import {compareArrayContents, KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"
import {useMultiSelect} from "../../util/hooks"
import {GenericItem} from "../../util/types"
import {useVirtual} from "react-virtual"
import {virtualizedStyle} from "../../util/styles"

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

//TODO add integrated label
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
      selection && setSelectedItems(selection)
    }, [selection]
  )

  useEffect(
    () => {
      onSelectionChange && !compareArrayContents(selectedItems, selection) && onSelectionChange(selectedItems)
      onActiveChange && onActiveChange(activeItem)
    }, [selectedItems]
  )

  const selfRef = ref ? (ref as MutableRefObject<HTMLOListElement>) : useRef<HTMLOListElement>(null)

  const virtualizer = useVirtual({
    size: items.length,
    parentRef: selfRef,
    estimateSize: React.useCallback(() => customItem ? 80 : 40, []),
    overscan: 10
  })

  return (
    <ol
      {...props} ref={selfRef} className="snovy-list" data-disabled={!items} tabIndex={-1}
      onKeyDown={e => useKey(e, keyMap)} onContextMenu={() => onContext && onContext(undefined)}
    >
      {
        !items.isEmpty() && <li key="total-size" style={{height: virtualizer.totalSize}}/>
      }
      {
        virtualizer.virtualItems.map(vi => (
          <ListItem
            key={vi.index} item={items[vi.index]} preset={options.preset} customItem={customItem}
            onValueChange={onItemValueChange} onSelect={handleItemClick} onContext={onContext}
            selected={selectedItems.includes(items[vi.index])} active={activeItem == items[vi.index]}
            style={virtualizedStyle(vi)}
          />
        ))
      }
      {children}
    </ol>
  )

})

const List = ListWithRef as <T extends GenericItem>(props: ListProps<T> & { ref?: React.Ref<HTMLOListElement> }) => JSX.Element
export default List