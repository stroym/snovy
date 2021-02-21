import React, {forwardRef} from "react"
import {append, Extras} from "../../util/ComponentUtils"
import {WithTitle} from "../list/List"

interface ComboBoxItemProps {
  item: WithTitle
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
        {item.title}
      </li>
    )
  }
)

export default ComboBoxItem