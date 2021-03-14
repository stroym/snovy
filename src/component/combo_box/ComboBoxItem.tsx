import React, {forwardRef} from "react"
import {append, Extras} from "../../util/ComponentUtils"
import Tag from "../../data/model/Tag"
import TagDisplayItem from "../tag/TagDisplayItem"

interface ComboBoxItemProps {
  className?: string
  item: Record<string, any> | string
  selected?: boolean
  highlighted?: boolean
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem(props: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) {

    const {item, selected, highlighted, ...rest} = props

    const className = "snovy-dropdown-item".concat(
      append(props.className),
      append(selected, Extras.ACTIVE),
      append(highlighted, Extras.HOVER)
    )

    //TODO while this works, there's probably a better way to do this
    if (props.item instanceof Tag) {
      return (
        <li {...rest} ref={ref} className={"tag-dropdown " + className}>
          <TagDisplayItem tag={props.item}/>
        </li>
      )
    }

    return (
      <li {...rest} ref={ref} className={className}>
        {item.toString()}
      </li>
    )

  }
)

export default ComboBoxItem