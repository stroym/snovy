import React, {forwardRef, memo} from "react"
import {cls} from "../../util/utils"
import {GenericItem} from "../../util/types"
import {activeItem, highlightedItem} from "../../util/classes"

export interface ComboBoxItemProps<T extends GenericItem> extends React.HTMLProps<HTMLLIElement> {
  item: T
  selected?: boolean
  highlighted?: boolean
  customItem?: (item: T) => React.ReactElement
}

const ComboBoxItem = forwardRef(<T extends GenericItem>(
  {item, selected, highlighted, customItem, ...props}: ComboBoxItemProps<T>,
  ref: React.Ref<HTMLLIElement>
  ) => {

    return (
      <li {...props} ref={ref}
          className={"snovy-dropdown-item".concat(
            cls(highlightedItem, highlighted),
            cls(activeItem, selected)
          )}
      >
        {customItem ? customItem(item) : <p>{item.toString()}</p>}
      </li>
    )

  }
)

ComboBoxItem.displayName = "ComboBoxItem"

export default memo(ComboBoxItem)