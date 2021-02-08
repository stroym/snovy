import React, {forwardRef} from "react"
import {append, Extras} from "../../util/ComponentNames"
import {Item} from "../../model/common/Base"

interface ComboBoxItemProps {
  item: Item
  selected?: boolean
  highlighted?: boolean
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem(props: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) {

    const {item, selected, highlighted, ...rest} = props

    return (
      <li {...rest} ref={ref}
          className={"snovy-dropdown-item".concat(append(selected, Extras.ACTIVE), append(highlighted, Extras.HOVER))}
      >
        {item.toString()}
      </li>
    )
  }
)

export default ComboBoxItem