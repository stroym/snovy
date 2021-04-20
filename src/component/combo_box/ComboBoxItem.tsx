import React, {forwardRef} from "react"
import {cls} from "../../util/utils"
import {GenericItem} from "../../util/types"
import {activeItem, highlightedItem} from "../../util/classes"

export interface ComboBoxItemProps<T extends GenericItem> extends React.HTMLProps<HTMLLIElement> {
  className?: string
  item: T
  active?: boolean
  highlighted?: boolean
  customItem?: (item: T) => React.ReactElement<ComboBoxItemProps<T>>
}

const ComboBoxItem = forwardRef(<T extends GenericItem>(
  {item, active, highlighted, className, customItem, ...props}: ComboBoxItemProps<T>,
  ref: React.Ref<HTMLLIElement>
  ) => {

    return (
      <li {...props} ref={ref}
          className={"snovy-dropdown-item".concat(
            cls(className),
            cls(highlightedItem, highlighted),
            cls(activeItem, active)
          )}
      >
        {customItem ? customItem(item) : item.toString()}
      </li>
    )

  }
)

ComboBoxItem.displayName = "ComboBoxItem"

export default ComboBoxItem