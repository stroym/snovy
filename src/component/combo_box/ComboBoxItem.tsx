import React, {forwardRef} from "react"
import {append, Extras} from "../../util/ComponentUtils"
import Tag from "../../data/model/Tag"
import TagDisplayItem from "../tag/TagDisplayItem"

interface ComboBoxItemProps {
  item: Record<string, any> | string
  selected?: boolean
  highlighted?: boolean
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem(props: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) {

    const {item, selected, highlighted, ...rest} = props

    //TODO while this works, there's probably a better way to do this
    if (props.item instanceof Tag) {
      return (
        <li {...rest} ref={ref}
            className={"snovy-dropdown-item tag-dropdown"
              .concat(append(selected, Extras.ACTIVE), append(highlighted, Extras.HOVER))}
        >
          <TagDisplayItem tag={props.item}/>
        </li>
      )
    }

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