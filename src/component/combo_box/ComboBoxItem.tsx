import React, {forwardRef} from "react"
import Tag from "../../data/model/Tag"
import TagDisplayItem from "../tag/TagDisplayItem"

interface ComboBoxItemProps extends React.HTMLProps<HTMLLIElement> {
  className?: string
  item: Record<string, any> | string
}

const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>(
  function ComboBoxItem({item, ...props}: ComboBoxItemProps, ref: React.Ref<HTMLLIElement>) {

    const className = "snovy-dropdown-item " + props.className

    //TODO while this works, there's probably a better way to do this
    if (item instanceof Tag) {
      return (
        <li {...props} ref={ref} className={"tag-dropdown " + className}>
          <TagDisplayItem tag={item}/>
        </li>
      )
    }

    return (
      <li {...props} ref={ref} className={className}>
        {item.toString()}
      </li>
    )

  }
)

export default ComboBoxItem